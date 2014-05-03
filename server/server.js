Fiber = Npm.require('fibers');
GetYoutubeId = Meteor.require('get-youtube-id');

var queueIndex = 0;
var queueLimit = 100;

var getTitle = function (video, data) {
	var videoId = item;
	var url = data.url;
	Meteor.http.get(url, function (err, res) {
		if (!err) {
			var titleRegex = new RegExp(/<title[^>]*>([^<]+)<\/title>/);
			var matchedTitle = res.content.match(titleRegex) !== null ? res.content.match(titleRegex)[1] : false;
			matchedTitle = matchedTitle.replace(' - YouTube', '');
		} else console.log(err);
		Fiber(function () {
			if (matchedTitle)
				Queue.update(videoId, {$set: {title: matchedTitle}});
		}).run();
	});
};

var getYoutubeId = function (video, data) {
	var videoId = video;
	var url = data.url;
	Fiber(function () {
		var youtube = GetYoutubeId(data.url);
		if (youtube !== 'undefined')
			Queue.update(videoId, {$set: {youtubeId: youtube}});
	}).run();
};

Meteor.methods({
	queueVideo: function (data) {
		if (!/^(http|https):\/\//i.test(data.url))
			data.url = 'http://' + data.url;
		var item = Queue.insert({title: data.url, url: data.url, username: data.username, time: data.time, index: data.index, score: 0, upvoted: []});
		var parseItem = Meteor.bindEnvironment(function () {
			getTitle(item, data);
			getYoutubeId(item, data);
		}, function (err) {
			throw(err);
		});
		parseItem();
		queueIndex++;
		Queue.remove({index: {$lt: queueIndex - queueLimit}});
	},
	voteQueueVideo: function (videoId) {
		var user = Meteor.user();
		if (!user)
			throw new Meteor.Error(401, 'Login to vote');
		var item = Queue.findOne(videoId);
		if (!item)
			throw new Meteor.Error(422, 'Video not found');

		if (_.include(item.upvoted, user._id)) {
			// Already voted
			Queue.update(videoId._id, {
				$pull: {upvoted: user._id},
				$inc: {score: -1}
			});
		} else {
			Queue.update(videoId._id, {
				$addToSet: {upvoted: user._id},
				$inc: {score: 1}
			});
		}
	},
	sendVideo: function () {
		var item = Queue.find({}, {limit: 1, sort: {score: -1, time: -1}}).fetch();
		VideoStream.emit('nowPlaying', item[0]);
	},
	nextVideo: function () {
		console.log('next!');
		// what else does this method need to do?
		Meteor.call('sendVideo');
	},
	rockTheVote: function () {
		//hmm
	}
});

ChatStream.on('chat', function (data) {
	if (data.message.substring(0, 1) === '/') {
		switch (data.message) {
			case '/next':
				Meteor.call('nextVideo');
				break;
			case '/rtv':
				Meteor.call('rockTheVote');
				break;
		}
	}
});