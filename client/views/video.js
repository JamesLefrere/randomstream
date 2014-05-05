Template.video.created = function () {
	if (typeof player === 'undefined')
		$.getScript('https://www.youtube.com/iframe_api', function () {});
};

Template.video.rendered = function () {
	Session.set('videoRendered', true);
};

Template.video.destroyed = function () {
	Session.set('videoRendered', false);
};