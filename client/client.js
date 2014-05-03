Meteor.startup(function () {
	Hooks.init();
	Session.set('YTApiReady', false);
});

onYouTubeIframeAPIReady = function () {
	Session.set('YTApiReady', true);
};

VideoStream.on('newItem', function (data) {
	Session.set('youtubeId', data.youtubeId);

	if (Session.equals('YTApiReady', false))
		return;

	var interval = Meteor.setInterval(function () {
		if (!document.getElementById('video'))
			return;

		var playerDiv = document.createElement('div'),
			youtubeId = Session.get('youtubeId');

		playerDiv.id = 'video';
		document.getElementById('video-wrapper').innerHTML = '';
		document.getElementById('video-wrapper').appendChild(playerDiv);

		player = null;
		player = new YT.Player('video', {
			videoId: youtubeId
			//			events: {
			//				'onReady': onPlayerReady
			//			}
		});
		Meteor.clearInterval(interval);
	}, 1000);
});

Accounts.ui.config({
	passwordSignupFields: 'USERNAME_ONLY'
});

Hooks.onLoggedIn = function () {
	Meteor.setTimeout(function () {
		$('#chat-text').removeAttr('disabled').focus();
	}, 1500);
};
