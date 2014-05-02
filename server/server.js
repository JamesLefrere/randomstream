var timer;
var waitTime = 60000;
var streamQueueIndex = 0;
var streamQueueLimit = 100;

var setTimer = function () {
	timer = Meteor.setInterval(function () {
		VideoStream.emit('newStream', Meteor.call('nextStream'));
	}, waitTime);
};

var clearTimer = function () {
	Meteor.clearInterval(timer);
};

Meteor.startup(function () {
	setTimer();
});

Meteor.methods({
	queueStream: function (data) {
		StreamQueue.insert({url: data.url, username: data.username, time: data.time, index: data.index});
		streamQueueIndex++;
		StreamQueue.remove({index: {$lt: streamQueueIndex - streamQueueLimit}});
	},
  getUStream: function (url) {
	  this.unblock();
	  if (url !== null) {
		  // parse ustream url, return api call
	  } else {
		  return Meteor.http.call('GET', 'http://api.ustream.tv/json/stream/all/getRandom?key=F529A1377B4F8A45B55EC457A2B0648B&params=autoplay:true;height:100;width:100');
	  }
  },
  getTwitch: function (url) {
	  this.unblock();
	  if (url !== 'undefined') {
		  // parse twitch url, return api call
	  } else {
		  // return api call for random twitch video
	  }
  },
	getYoutube: function (url) {
		this.unblock();
		if (url !== 'undefined') {
			// parse youtube url, return api call
		} else {
			// return api call for random youtube video
		}
	},
	randomStream: function () {
		var randy = Math.random();
		if (randy < 0.33) {
			VideoStream.emit('newStream', Meteor.call('getUStream', null));
		} else if (randy < 0.66) {
			VideoStream.emit('newStream', Meteor.call('getTwitch', null));
		} else {
			VideoStream.emit('newStream', Meteor.call('getYoutube', null));
		}
	},
	nextStream: function () {
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
				Meteor.call('nextStream');
				break;
			case '/rtv':
				Meteor.call('rockTheVote');
				break;
		}
	}
});