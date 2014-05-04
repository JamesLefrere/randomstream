var player;

var onPlayerReady = function () {
	player.playVideo();
};

Meteor.startup(function () {
	Hooks.init();
	Session.set('YTApiReady', false);
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
		var playerDiv = document.createElement('div'),
			video = Template.video.getVideo();

		playerDiv.id = 'video';
		document.getElementById('video-wrapper').innerHTML = '';
		document.getElementById('video-wrapper').appendChild(playerDiv);

		player = null;
		if (video !== undefined) {
			player = new YT.Player('video', {
				videoId: video.youtubeId,
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
		$chatText.textareaAutoSize();
		$chatText.shiftenter({
			hint: null
		});
		$chatText.removeAttr('disabled').focus();
	}, 1500);
};
