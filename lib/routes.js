//  routes
//  ------

    FlowRouter.route('/', {
      name: 'index',

      subscriptions: function () {
        this.register('allByrons', Meteor.subscribe('allByrons'));
      },

      action: function () {
        FlowLayout.render('mainLayout', {
          main: 'index'
        });
      }
    });