Chat = new Meteor.Collection(null);

var chatIndex = 0;
var chatLimit = 100;

ChatStream.on('chat', function (data) {
	Chat.insert(data);
});

Template.chat.helpers({
	messages: function () {
		return Chat.find({}, {sort: {time: -1}});
	},
	viewers: function () {
		if (Presences.find() !== undefined) {
			return Presences.find().fetch().length;
		}
	}
});

Template.chat.events({
	'keydown #chat-text': function(e) {
		if (e.which === 13) {
			e.preventDefault();
			var $chatText = $('#chat-text');
			if ($chatText.val() === '')
				return false;
			var data = {
				time: (new Date()).getTime(),
				username: Meteor.user().username,
				message: $chatText.val(),
				index: chatIndex
			};
			Chat.insert(data);
			chatIndex++;
			Chat.remove({index: {$lt: chatIndex - chatLimit}});
			if (data.message === 'rtv') {
				Meteor.call('rockTheVote', Meteor.user().username);
			} else {
				ChatStream.emit('chat', data);
			}
			$chatText.val('').focus();
		}
	}
});

Template.chat.rendered = function () {
	Meteor.setTimeout(function () {
		var $chatText = $('#chat-text');
		$chatText.textareaAutoSize();
		$chatText.removeAttr('disabled');
		Template.chat.resize();
	}, 1500);
};

Template.chat.resize = function () {
	var $wrapper = $('.chat-inner');
	if ($wrapper.length) {
		$wrapper.css('height', $(window).height() - $wrapper.offset().top);
	}
};

$(window).resize(function () {
	Template.chat.resize();
});
