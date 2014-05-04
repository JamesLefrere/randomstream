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
	console.log('autorun');
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
		player = new YT.Player('video', {
			videoId: video.youtubeId,
			events: {
				'onReady': onPlayerReady
			}
		});
		Meteor.clearInterval(interval);
	}, 1500);
});


//player.playVideo();
console.log(player);

Accounts.ui.config({
	passwordSignupFields: 'USERNAME_ONLY'
});

Hooks.onLoggedIn = function () {
	Meteor.setTimeout(function () {
		$('#chat-text').removeAttr('disabled').focus();
	}, 1500);
};
