StreamQueue.deny({
	insert: function() {
		return true;
	},
	update: function() {
		return true;
	},
	remove: function() {
		return true;
	}
});

VideoStream.permissions.write(function (eventName) {
	return false;
});

VideoStream.permissions.read(function (eventName) {
	return true;
});

ChatStream.permissions.write(function (eventName) {
	return true;
});

ChatStream.permissions.read(function (eventName) {
	return true;
});