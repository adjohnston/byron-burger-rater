//  byron
//  -----

    //  -------------------------------
    //  create a global userIp variable
    //  -------------------------------
    userIp = undefined;

    Meteor.startup(function () {
      var clientId     = Meteor.settings.clientId,
          clientSecret = Meteor.settings.clientSecret,
          byronId      = Meteor.settings.byronId;

      //  -------------------------------------------
      //  make a request to the foursquare api to get 
      //  as many byron restaurants as can be found. 
      //  search is limited to 50.
      //  -------------------------------------------
      HTTP.get('https://api.foursquare.com/v2/venues/search?intent=global&query=byron&categoryId=' + byronId + '&client_id=' + clientId + '&client_secret=' + clientSecret + '&v=20150612', function (err, res) {
        if (err)
          throw new Meteor.Error(err.reason);

        //  ---------------------------------------------
        //  I then filter our results with as much byron
        //  specific information as possible including an
        //  id used in foursquare for byron, verified and 
        //  in the UK.
        //  ---------------------------------------------
        var byrons = res.data.response.venues.filter(function (venue) {
              return venue.categories[0].id === byronId && venue.verified && venue.location.country.toLowerCase() === 'united kingdom';
            });
 
        //  ---------------------------------------------
        //  because this will happen each time on startup
        //  I only want to see if a store has been added
        //  or removed. this will be rare so can I do it
        //  before the foursqaure api call?
        //  ---------------------------------------------
        if (Byrons.find().count() !== byrons.length) {
          
          byrons.forEach(function (byron, i) {
            //  -----------------------------------------------
            //  photos require their own api call to foursquare
            //  and then I only one a single photo.
            //  -----------------------------------------------
            var photos = HTTP.get('https://api.foursquare.com/v2/venues/' + byron.id + '/photos?limit=1&client_id=' + clientId + '&client_secret=' + clientSecret + '&v=20150612'),
                photo  = photos.data.response.photos.items[0];

            //  ---------------------------------------------
            //  because I am looping over the returned data I 
            //  only want to insert new restaurants and using
            //  upsert seems to make the most sense.
            //  ---------------------------------------------
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

          //  -------------------------------------------
          //  do a search for the users IP to see whether
          //  they have previously voted or not.
          //  -------------------------------------------
          var previouslyVoted = _.find(Byrons.findOne(byronId).ips, function (ip) {
                return ip === userIp;
              });

          if (previouslyVoted)
            return;
          
          Byrons.update(byronId, {$inc: {votes: vote},
                                  $push: {ips: userIp}});
        }
      });
    });

    Meteor.onConnection(function(conn) {
      //  -------------------------------------------
      //  set the global userIp variable if it false.
      //  -------------------------------------------
      if (!userIp)
        return userIp = conn.clientAddress;
    });