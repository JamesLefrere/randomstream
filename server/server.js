var Schedule = Meteor.require('node-schedule');
var Fiber = Npm.require('fibers');
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
  getStream: function () {
	queueStream: function (data) {
		StreamQueue.insert({url: data.url, username: data.username, time: data.time, index: data.index});
		streamQueueIndex++;
		StreamQueue.remove({index: {$lt: streamQueueIndex - streamQueueLimit}});
	},
	  this.unblock();
	  return Meteor.http.call('GET', 'http://api.ustream.tv/json/stream/all/getRandom?key=F529A1377B4F8A45B55EC457A2B0648B&params=autoplay:true;height:100;width:100');
  }
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

var rule = new Schedule.RecurrenceRule();
rule.second = [0, 30];

var job = Schedule.scheduleJob(rule, function () {
	Fiber(function () {
		VideoStream.emit('newStream', Meteor.call('getStream'));
	}).run();
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