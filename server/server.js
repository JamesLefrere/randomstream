Fiber = Npm.require('fibers');
GetYoutubeId = Meteor.require('get-youtube-id');

var queueIndex = 0;
var queueLimit = 100;

var getInfo = function (video, data) {
	var videoId = video;
	var url = data.url;
	Fiber(function () {
		var youtube = GetYoutubeId(data.url);
		if (youtube === undefined) {
			throw new Meteor.Error(422, 'Could not parse video');
		} else {
			Meteor.http.get('http://gdata.youtube.com/feeds/api/videos/' + youtube + '?alt=json', function (err, res) {
				if (!err) {
					var title = res.data.entry.title.$t;
					var length = res.data.entry.media$group.yt$duration.seconds;
					Queue.update(videoId, {$set: {youtubeId: youtube, title: title, length: length}});
				} else throw new Meteor.Error(422, 'Could not get video information');
			});
		}
	}).run();
};


Meteor.methods({
	queueVideo: function (data) {
		if (!/^(http|https):\/\//i.test(data.url))
			data.url = 'http://' + data.url;
		var video = Queue.insert({title: data.url, url: data.url, username: data.username, time: data.time, index: data.index, score: 0, upvoted: []});
		var parseVideo = Meteor.bindEnvironment(function () {
			getInfo(video, data);
		}, function (err) {
			throw(err);
		});
		parseVideo();
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
			Queue.update(videoId, {
				$pull: {upvoted: user._id},
				$inc: {score: -1}
			});
		} else {
			Queue.update(videoId, {
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