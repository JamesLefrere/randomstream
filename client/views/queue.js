Template.queue.helpers({
	items: function () {
		return Queue.find({}, {sort: {score: -1, time: -1}}).fetch();
	},
	currentViewers: function () {
		if (Viewers.find() !== undefined) {
			return Viewers.find().fetch().length;
		}
	}
});

Template.queue.events({
	'submit #queue-form': function(e) {
		e.preventDefault();
		var $queueUrl = $('#queue-url');
		if ($queueUrl.val() === '')
			return false;
		var data = {
			time: (new Date()).getTime(),
			username: Meteor.user().username,
			url: $queueUrl.val()
		};
		Meteor.call('queueVideo', data);
		$queueUrl.val('');
	}
});