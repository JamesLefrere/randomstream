Template.home.helpers({
  posts: function() {
    return Posts.find().fetch();
  }
});

Template.home.events({
  'click button': function(event, template) {
    Meteor.call('insertRandomPost');
  }
});