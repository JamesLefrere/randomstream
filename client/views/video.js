Template.video.helpers({
	youtubeId: function () {
		return Session.get('youtubeId');
	}
});

Template.video.created = function () {
	if (typeof player === 'undefined')
		$.getScript('https://www.youtube.com/iframe_api', function () {});
};
