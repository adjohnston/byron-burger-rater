//  routes
//  ------

//  index
//  -----
    FlowRouter.route('/', {
      name: 'index',

      subscriptions: function () {
        this.register('byrons', Meteor.subscribe('byrons'));
      },

      action: function () {
        FlowLayout.render('mainLayout', {
          main: 'byron'
        });
      }
    });