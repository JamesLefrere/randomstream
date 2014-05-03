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

Meteor.startup(function () {
	setTimer();
});

Meteor.methods({
	queueItem: function (data) {
		ItemQueue.insert({url: data.url, username: data.username, time: data.time, index: data.index, score: 0, upvoted: []});
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
  getUStream: function (url) {
	  this.unblock();
	  if (url !== null) {
		  // parse ustream url, return api call
	  }
  },
  getTwitch: function (url) {
	  this.unblock();
	  if (url !== 'undefined') {
		  // parse twitch url, return api call
	  }
  },
	getYoutube: function (url) {
		this.unblock();
		if (url !== 'undefined') {
			// parse youtube url, return api call
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