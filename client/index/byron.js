//  byron
//  -----

//  helpers
//  -------
    Template.byron.helpers({
      byrons: function () {
        return Byrons.find({}, {sort: {votes: -1}});
      },

      formattedVotes: function () {
        return (this.votes > 0) ? '+' + this.votes : this.votes;
      }
    });


//  events
//  ------
    Template.byron.events({
      'click .vote__up': function (e, tmpl) {
        var _id = tmpl.$(e.target).parents('li').data('byron');

        Meteor.call('castVote', _id, 1);
      },

      'click .vote__down': function (e, tmpl) {
        var _id = tmpl.$(e.target).parents('li').data('byron');

        Meteor.call('castVote', _id, -1);
      }
    });