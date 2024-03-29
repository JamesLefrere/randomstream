Template.queue.helpers({
	items: function () {
		return Queue.find().fetch();
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