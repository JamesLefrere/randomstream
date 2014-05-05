Meteor.startup(function () {
	Meteor.setTimeout(function () {
		Meteor.call('startVideo');
	}, 2000);
});