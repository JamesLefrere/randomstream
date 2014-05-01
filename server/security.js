VideoStream.permissions.write(function (eventName) {
	return false;
});

VideoStream.permissions.read(function (eventName) {
	return true;
});