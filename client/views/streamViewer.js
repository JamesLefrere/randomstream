Template.streamViewer.helpers({
	stream: function () {
		return Session.get('currentStream');
	}
});

Template.streamViewer.events({

});

VideoStream.on('newStream', function (get) {
	Session.set('currentStream', get.data.results[0]);
});