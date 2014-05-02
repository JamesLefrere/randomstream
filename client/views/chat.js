Chat = new Meteor.Collection(null);

ChatStream.on('chat', function (data) {
	Chat.insert(data);
});

Template.chat.helpers({
	messages: function () {
		return Chat.find();
	}
});

Template.chat.events({
	'submit #chat-form': function(e) {
		e.preventDefault();
		var data = {
			username: Meteor.user().username,
			message: $('#chat-text').val()
		};
		Chat.insert(data);
		ChatStream.emit('chat', data);
		$('#chat-text').val('').focus();
	}
});

Template.chat.rendered = function () {
	Meteor.setTimeout(function () {
		var $chatText = $('#chat-text');
		$chatText.textareaAutoSize();
		$chatText.shiftenter({
			hint: null
		});
	}, 1000);
};