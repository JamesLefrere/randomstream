Template.itemQueue.helpers({
	items: function () {
		return ItemQueue.find({}, {sort: {time: -1}}).fetch();
	}
});

Template.itemQueue.events({
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
		Meteor.call('queueItem', data);
		$queueUrl.val('');
	}
});