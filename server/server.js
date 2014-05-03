Fiber = Npm.require('fibers');
GetYoutubeId = Meteor.require('get-youtube-id');

var timer;
var waitTime = 60000;
var streamQueueIndex = 0;
var streamQueueLimit = 100;

var setTimer = function () {
	timer = Meteor.setInterval(function () {
		ItemStream.emit('newItem', Meteor.call('nextItem'));
	}, waitTime);
};

var clearTimer = function () {
	Meteor.clearInterval(timer);
};

var getTitle = function (item, data) {
	var itemId = item;
	var url = data.url;
	Meteor.http.get(url, function (err, res) {
		if (!err) {
			var titleRegex = new RegExp(/<title[^>]*>([^<]+)<\/title>/);
			var matchedTitle = res.content.match(titleRegex) !== null ? res.content.match(titleRegex)[1] : false;
		} else console.log(err);
		Fiber(function () {
			if (matchedTitle)
				ItemQueue.update(itemId, {$set: {title: matchedTitle}});
		}).run();
	});
};

var getEmbed = function (item, data) {
	var itemId = item;
	var url = data.url;
	Fiber(function () {
		var youtube = GetYoutubeId(data.url);
		if (youtube !== 'undefined') {
			youtube = '<iframe src="//www.youtube.com/embed/'+youtube+'" frameborder="0" allowfullscreen></iframe>';
			ItemQueue.update(itemId, {$set: {embed: youtube}});
		}
	}).run();
};

Meteor.startup(function () {
	setTimer();
});

Meteor.methods({
	queueItem: function (data) {
		if (!/^(http|https):\/\//i.test(data.url))
			data.url = 'http://' + data.url;
		var item = ItemQueue.insert({title: data.url, url: data.url, username: data.username, time: data.time, index: data.index, score: 0, upvoted: []});
		var parseItem = Meteor.bindEnvironment(function () {
			getTitle(item, data);
			getEmbed(item, data);
		}, function (err) {
			throw(err);
		});
		parseItem();
		streamQueueIndex++;
		ItemQueue.remove({index: {$lt: streamQueueIndex - streamQueueLimit}});
	},
	voteItem: function (itemId) {
		var user = Meteor.user();
		if (!user)
			throw new Meteor.Error(401, 'Login to vote');
		var item = ItemQueue.findOne(itemId);
		if (!item)
			throw new Meteor.Error(422, 'Item not found');

		if (_.include(item.upvoted, user._id)) {
			// Already voted
			ItemQueue.update(item._id, {
				$pull: {upvoted: user._id},
				$inc: {score: -1}
			});
		} else {
			ItemQueue.update(item._id, {
				$addToSet: {upvoted: user._id},
				$inc: {score: 1}
			});
		}
	},
	nextItem: function () {
		console.log('next! timer reset');
		clearTimer();
		setTimer();
		// get next stream now, since we have to wait for the timer
	},
	rockTheVote: function () {
		//hmm
	}
});

ChatStream.on('chat', function (data) {
	if (data.message.substring(0, 1) === '/') {
		switch (data.message) {
			case '/next':
				Meteor.call('nextItem');
				break;
			case '/rtv':
				Meteor.call('rockTheVote');
				break;
		}
	}
});