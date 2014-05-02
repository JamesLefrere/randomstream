VideoStream.on('newStream', function (get) {
	var stream = get.data.results[0];
	stream.iframe = '<iframe src="http://www.ustream.tv/embed/'+stream.id+'?v=3&wmode=direct&autoplay=true" scrolling="no" frameborder="0"></iframe>';
	Session.set('currentStream', stream);
});

Accounts.ui.config({
	passwordSignupFields: 'USERNAME_ONLY'
});
