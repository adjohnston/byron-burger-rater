// Template.index.onRendered(function () {
//   this.find('.byrons')._uihooks = {
//     moveElement: function (node, next) {
//       // todo
//     }
//   }
// });

Template.index.helpers({
  byrons: function () {
    return Byrons.find({}, {sort: {votes: -1}});
  },

  formattedVotes: function () {
    return (this.votes > 0) ? '+' + this.votes : this.votes;
  }
});

Template.index.events({
  'click .vote__up': function (e, tmpl) {
    var byronId = tmpl.$(e.target).parents('li').data('byron');

    Meteor.call('castVote', byronId, 1);
  },

  'click .vote__down': function (e, tmpl) {
    var byronId = tmpl.$(e.target).parents('li').data('byron');

    Meteor.call('castVote', byronId, -1);
  }
});