Chat = new Meteor.Collection(null);

var chatIndex = 0;
var chatLimit = 100;

ChatStream.on('chat', function (data) {
	Chat.insert(data);
});

Template.chat.helpers({
	messages: function () {
		return Chat.find({}, {sort: {time: -1}});
	}
});

Template.chat.events({
	'submit #chat-form': function(e) {
		e.preventDefault();
		var $chatText = $('#chat-text');
		var data = {
			time: (new Date()).getTime(),
			username: Meteor.user().username,
			message: $chatText.val(),
			index: chatIndex
		};
		Chat.insert(data);
		chatIndex++;
		Chat.remove({index: {$lt: chatIndex - chatLimit}});
		ChatStream.emit('chat', data);
		$chatText.val('').focus();
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