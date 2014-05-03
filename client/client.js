Meteor.startup(function () {
	Hooks.init();
});

ItemStream.on('newItem', function (data) {
	console.log('newItem');
	console.log(data);
	Session.set('currentItem', data);
});

Accounts.ui.config({
	passwordSignupFields: 'USERNAME_ONLY'
});

Hooks.onLoggedIn = function () {
	Meteor.setTimeout(function () {
		$('#chat-text').removeAttr('disabled').focus();
	}, 1500);
};
