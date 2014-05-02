Meteor.publish('userPresence', function () {
	var filter = { userId: { $exists: true }};
	return Presences.find(filter, {fields: {state: true, userId: true}});
});


Meteor.publish('streamQueue', function () {
	return StreamQueue.find({}, {limit: 10});
});