Meteor.methods({
  insertRandomPost: function() {
    Posts.insert({title: 'Test Post ' + Math.floor(Math.random()*10), ts: +new Date});
  }
})