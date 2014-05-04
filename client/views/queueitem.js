Template.queueItem.helpers({
	isVoted: function () {
		if (_.indexOf(this.upvoted, Meteor.userId()) !== -1)
			return true;
	},
	isPlaying: function () {
		var nowPlaying = Session.get('nowPlaying');
		if (nowPlaying && this._id === nowPlaying._id)
			return true;
	}
});

Template.queueItem.events({
	'click .vote': function (e, t) {
		e.preventDefault();
		Meteor.call('voteQueueVideo', t.data._id);
	}
});

