//  byron
//  -----

    userIp = undefined;

    Meteor.startup(function () {
      var clientId     = Meteor.settings.clientId,
          clientSecret = Meteor.settings.clientSecret,
          byronId      = Meteor.settings.byronId;

      HTTP.get('https://api.foursquare.com/v2/venues/search?intent=global&query=byron&categoryId=' + byronId + '&client_id=' + clientId + '&client_secret=' + clientSecret + '&v=20150612', function (err, res) {
        if (err)
          throw new Meteor.Error(err.reason);

        var byrons = res.data.response.venues.filter(function (venue) {
              return venue.categories[0].id === byronId && venue.verified && venue.location.country.toLowerCase() === 'united kingdom';
            });
 
        if (Byrons.find().count() !== byrons.length) {
          
          byrons.forEach(function (byron, i) {
            var photos = HTTP.get('https://api.foursquare.com/v2/venues/' + byron.id + '/photos?limit=1&client_id=' + clientId + '&client_secret=' + clientSecret + '&v=20150612'),
                photo  = photos.data.response.photos.items[0];

            Byrons.upsert(byron.id, {$set: {
              address: byron.location.formattedAddress,
              photo:   (photo) ? photo.prefix + '150x150' + photo.suffix : null
            }, $setOnInsert: {
              votes: 0,
              ips:   []
            }});
          });

        }
      });

      Meteor.methods({
        castVote: function (byronId, vote) {
          check(byronId, String);
          check(vote, Number);

          var currentIp = _.find(Byrons.findOne(byronId).ips, function (ip) {
                return ip === userIp;
              });

          if (currentIp)
            return;
          
          Byrons.update(byronId, {$inc: {votes: vote},
                                  $push: {ips: userIp}});
        }
      });
    });

    Meteor.onConnection(function(conn) {
      if (!userIp)
        return userIp = conn.clientAddress;
    });