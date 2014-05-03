Template.nowPlaying.helpers({
	video: function () {
		return Session.get('nowPlaying');
	}
});
