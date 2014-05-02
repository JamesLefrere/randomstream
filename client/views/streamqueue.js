Template.streamQueue.helpers({
	queueItems: function () {
		return StreamQueue.find({}, {sort: {time: -1}}).fetch();
	}
});

Template.streamQueue.events({
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
		Meteor.call('queueStream', data);
		$queueUrl.val('');
	}
});