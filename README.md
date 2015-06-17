# Byron Burger Rater

## About
Byron Hamburgers are a British restaurant chain that I happen to be a big fan of and while I have been to my fair share, the food is always good. That's not what I wanted this mini Meteor app to be the focus of. Each Byron has it's own unique style and decor and that's what I want people to vote on and I'll visit the top ranked one.

That's the idea behind the app but in a more serious sense I thought it will give some practice interacting with a third party API (Foursquare) and building an app with Meteor.

I also want to use it as a way of becoming a better Meteor developer by opening it to scrutiny from the Meteor community as I think it's a useful way of learning.

## Todo
- Add Velocity tests (Jasmine & Nightwatch)
- Add some sort of notification when a vote is cast
- Responsive design
- Animations when casting vote (some sort of slide as the restaurant changes position)

## Setup
- bower install
- meteor run METEOR_SETTINGS={"clientId": Foursquare client Id, "clientSecret": Foursquare client secret, "byronId": "4bf58dd8d48988d16c941735"}
