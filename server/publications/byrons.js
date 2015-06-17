//  byrons : publications
//  ---------------------

    Meteor.publish('byrons', function () {
      return Byrons.find();
    });