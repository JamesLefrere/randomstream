Template.message.helpers({
	isMe: function () {
		if (Meteor.user() && this.username === Meteor.user().username)
			return true;
	}
});