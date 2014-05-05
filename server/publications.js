Meteor.publish('userPresence', function () {
	var filter = { userId: { $exists: true }};
	return Presences.find(filter, {fields: {state: true, userId: true}});
});

Meteor.publish('queue', function () {
	return Queue.find({}, {limit: 10, sort: {score: -1, time: -1}});
});
