ItemQueue.deny({
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

ItemStream.permissions.write(function (eventName) {
	return false;
});

ItemStream.permissions.read(function (eventName) {
	return true;
});

ChatStream.permissions.write(function (eventName) {
	return true;
});

ChatStream.permissions.read(function (eventName) {
	return true;
});