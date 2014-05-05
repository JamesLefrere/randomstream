var player;

var onPlayerReady = function (event) {
	player.playVideo();
	Meteor.setTimeout(function () {
		player.seekTo(Session.get('nowPlaying').seek + 1);
	}, 1000);
};

Meteor.startup(function () {
	Hooks.init();
	Session.set('YTApiReady', false);
	Session.set('rockedTheVote', false);
	Meteor.setTimeout(function () {
		Meteor.call('gibeVideoPlox', function (err, res) {
			if (!err) {
				Session.set('nowPlaying', res);
			} else console.log(err);
		});
	}, 100);
});

onYouTubeIframeAPIReady = function () {
	Session.set('YTApiReady', true);
};

VideoStream.on('nowPlaying', function (data) {
	Session.set('nowPlaying', data);
});

Deps.autorun(function (c) {
	if (Session.equals('YTApiReady', false)
		|| Session.equals('videoRendered', false)
		|| Session.get('nowPlaying') === 'undefined') {
		return;
	}
	var interval = Meteor.setInterval(function () {
		if(!document.getElementById('video')) {
			return;
		}
		var playerDiv = document.createElement('div');
		var video = Session.get('nowPlaying');

		playerDiv.id = 'video';
		document.getElementById('video-wrapper').innerHTML = '';
		document.getElementById('video-wrapper').appendChild(playerDiv);

		player = null;
		if (video !== undefined) {
			player = new YT.Player('video', {
				videoId: video.youtubeId,
				playerVars: {
					controls: 0,
					modestbranding: 1,
					disablekb: 1,
					enablejsapi: 1,
					iv_load_policy: 3,
					playsinline: 1,
					rel: 0,
					showinfo: 0
				},
				events: {
					'onReady': onPlayerReady
				}
			});
			Meteor.clearInterval(interval);
		}
	}, 1500);
});

Accounts.ui.config({
	passwordSignupFields: 'USERNAME_ONLY'
});

Hooks.onLoggedIn = function () {
	Meteor.setTimeout(function () {
		var $chatText = $('#chat-text');
		$chatText.removeAttr('disabled');
	}, 1500);
};

Presence.state = function() {
	return {
		online: true,
		rockedTheVote: Session.get('rockedTheVote')
	};
};