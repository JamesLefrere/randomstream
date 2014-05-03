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
		ItemQueue.insert({url: data.url, username: data.username, time: data.time, index: data.index, score: 0});
		streamQueueIndex++;
		ItemQueue.remove({index: {$lt: streamQueueIndex - streamQueueLimit}});
	},
	voteItem: function (data) {
		var item = ItemQueue.find({_id: data.id});
		ItemQueue.update({_id: data.id}, {$inc: {score: 1}});
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