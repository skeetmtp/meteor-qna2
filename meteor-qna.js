Questions = new Meteor.Collection("questions");

if (Meteor.isClient) {

  Meteor.subscribe("questions");

  Template.ask.events({
    'click #btn' : function () {
      var q  = $("#question").val();
      if(q === '') {
        console.log("empty quesion");
        return;
      }
      Questions.insert({question : q, vote : 0, voters : []});
    }
  });



  Template.list.questions = function () {
    if(Session.get("sort"))
      return Questions.find({}, {sort : {vote : -1}});
    return Questions.find({});
  };


  Template.list.likedByMe = function () {
    return _.contains(this.voters, Meteor.userId());
  };

  Template.list.events({
    'click #sort' : function () {
      Session.set("sort", true);
    },
    'click .like' : function () {
      Meteor.call("vote", this._id);
    }
  });
}

Meteor.methods({
  vote : function(id) {
    Questions.update({_id : id, voters : {$ne: this.userId}}, { $inc : {vote : 1}, $addToSet : { voters : this.userId} });
  }
});

if (Meteor.isServer) {

  Meteor.publish('questions', function () {
    return Questions.find({}, {sort : {vote : -1}});
  })

  Questions.allow({
    insert: function(userId, doc) {
      return userId;
    }
  });


}
