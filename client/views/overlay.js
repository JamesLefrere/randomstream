Meteor.startup(function () {
	Session.setDefault('overlayHidden', false);
});

Template.overlay.events({
	'click .overlay-toggle': function () {
		Session.toggle('overlayHidden');
	}
});

Template.overlay.helpers({
	overlayHidden: function () {
		return Session.get('overlayHidden');
	}
});