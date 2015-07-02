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
      HTTP.get('https://api.foursquare.com/v2/venues/search?intent=global&query=byron&limit=50&categoryId=' + byronId + '&client_id=' + clientId + '&client_secret=' + clientSecret + '&v=20150612', function (err, res) {
        if (err)
          throw new Meteor.Error(err.reason);

        //  ---------------------------------------------
        //  I then filter our results with as much byron
        //  specific information as possible including an
        //  id used in foursquare for byron, verified and 
        //  in the UK.
        //  ---------------------------------------------
        var byrons = res.data.response.venues.filter(function (venue) {
              return venue && venue.verified && venue.name.toLowerCase() === 'byron' && venue.location.country.toLowerCase() === 'united kingdom';
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
                photo  = photos.data.response.photos.items[0],
                _id    = Byrons.findOne({'foursquare.byronId': byron.id});

            //  -----------------------------------------------------
            //  because I am looping over the returned data I only 
            //  want to insert new restaurants and using upsert 
            //  seems to make the most sense. A suggestion by looshi
            //  on Meteor forums was to add the store id into a 
            //  foursquare object incase I used a different method of 
            //  populating the db.
            //  -----------------------------------------------------
            Byrons.upsert(_id, {$set: {
              foursquare: {
                byronId: byron.id,
                address: byron.location.formattedAddress,
                photo:   (photo) ? photo.prefix + '150x150' + photo.suffix : undefined
              }
            }, $setOnInsert: {
              votes: 0,
              ips: {up:   [], 
                    down: []}
            }});
          });

        }
      });

      Meteor.methods({
        castVote: function(_id, vote) {
          check(_id, String);
          check(vote, Number);

          //  -------------------------------------------
          //  do a search for the users IP to see whether
          //  they have previously voted or not.
          //  -------------------------------------------
          function hasVoted(ip) {
            var ips       = Byrons.findOne(_id).ips,
                voteState = (vote > 0) ? 'up' : 'down';

            if (!ips)
              throw new Meteor.Error('No Byron restaurant found with _id:' + _id);

            return !!ips[voteState].filter(function (existingIp) {
              return existingIp === ip;
            }).length;
          }

          //  -------------------------------------------
          //  if an ip is found then we simply use return
          //  to break out from the function.
          //  -------------------------------------------
          if (hasVoted(userIp))
            return;

          //  -----------------------------------------------
          //  we decide whether the vote is up or down and
          //  then push and pull the userIp from the relevant
          //  array.
          //  -----------------------------------------------
          if (vote > 0) {
            Byrons.update(_id, {$pull: {'ips.down': userIp},
                                $push: {'ips.up':   userIp}});
          } else {
            Byrons.update(_id, {$pull: {'ips.up':   userIp},
                                $push: {'ips.down': userIp}});
          }

          //  ------------------------------------
          //  finally we increment the vote count.
          //  ------------------------------------
          Byrons.update(_id, {$inc: {votes: vote}});
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