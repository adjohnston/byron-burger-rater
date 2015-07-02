Template.mainLayout.events({
  'click .splash__link': function (e, tmpl) {
    e.preventDefault();
    $('main').scrollintoview();
  }
});