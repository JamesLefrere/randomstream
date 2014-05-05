Fiber = Npm.require('fibers');
GetYoutubeId = Meteor.require('get-youtube-id');

var queueIndex = 0;
var queueLimit = 100;
var timer;
var voters = 0;
ServerSession.set('nowPlaying', null);

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

var setTimer = function () {
	timer = Meteor.setInterval(function () {
		var video = ServerSession.get('nowPlaying');
		if (video.seek < video.length) {
			video.seek++;
			console.log(video.seek + '/' + video.length);
			ServerSession.set('nowPlaying', video);
		} else {
			clearTimer();
			Meteor.setTimeout(function () {
				Meteor.call('startVideo');
			}, 3000);
		}
	}, 1000);
};

var clearTimer = function () {
	Meteor.clearInterval(timer);
};

Meteor.methods({
	queueVideo: function (data) {
		// need to validate for youtube url
		if (!/^(http|https):\/\//i.test(data.url))
			data.url = 'http://' + data.url;
		var video = Queue.insert({title: data.url, url: data.url, username: data.username, time: data.time, index: data.index, score: 0, upvoted: [], plays: 0});
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
	startVideo: function () {
		var video = Queue.find({}, {limit: 1, sort: {plays: 1, score: -1, time: -1}}).fetch()[0];
		video.seek = 0;
		ServerSession.set('nowPlaying', video);
		VideoStream.emit('nowPlaying', ServerSession.get('nowPlaying'));
		Queue.update(ServerSession.get('nowPlaying')._id, {$inc: {plays: 1}});
		clearTimer();
		setTimer();
		voters = 0;
	},
	gibeVideoPlox: function () {
		return ServerSession.get('nowPlaying');
	},
	rockTheVote: function (username) {
		voters++;
		var filter = { userId: { $exists: true }};
		var electorate = Presences.find(filter, {fields: {state: true, userId: true}}).fetch().length;
		var data = {
			time: (new Date()).getTime(),
			username: null,
			message: username + ' wants to rock the vote (' + voters + '/' + electorate + ')',
			index: 0
		};
		ChatStream.emit('chat', data);
		if (voters === electorate) {
			Queue.update(ServerSession.get('nowPlaying')._id, {$inc: {plays: 1}}, function (err, res) {
				if (!err) {
					Meteor.setTimeout(function () {
						var data = {
							time: (new Date()).getTime(),
							username: null,
							message: 'Vote successful.',
							index: 0
						};
						ChatStream.emit('chat', data);
						Meteor.call('startVideo');
					}, 500);
				} else console.log(err);
			});
		}
	}
});
