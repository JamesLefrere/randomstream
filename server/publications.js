Meteor.publish('userPresence', function () {
	var filter = { userId: { $exists: true }};
	return Presences.find(filter, {fields: {state: true, userId: true}});
});


Meteor.publish('itemQueue', function () {
	return ItemQueue.find({}, {limit: 10, sort: {score: -1, time: -1}});
});