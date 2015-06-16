//  byrons : publications
//  ---------------------

    Meteor.publish('allByrons', function () {
      return Byrons.find();
    });