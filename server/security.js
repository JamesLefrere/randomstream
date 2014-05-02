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