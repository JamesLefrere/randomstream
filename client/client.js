Meteor.startup(function () {
	Hooks.init();
});

VideoStream.on('newStream', function (data) {
	console.log('newStream');
	console.log(data);
	// need to do this on the server
	//	var stream = data.data.results[0];
	//	stream.iframe = '<iframe src="http://www.ustream.tv/embed/'+stream.id+'?v=3&wmode=direct&autoplay=true" scrolling="no" frameborder="0"></iframe>';
	//	Session.set('currentStream', stream);
});

Accounts.ui.config({
	passwordSignupFields: 'USERNAME_ONLY'
});

Hooks.onLoggedIn = function () {
	Meteor.setTimeout(function () {
		$('#chat-text').removeAttr('disabled').focus();
	}, 1500);
};