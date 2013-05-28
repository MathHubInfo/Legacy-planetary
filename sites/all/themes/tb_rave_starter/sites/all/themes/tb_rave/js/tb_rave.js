(function ($) {
Drupal.TBRave = {};
Drupal.behaviors.tbRaveAction = {
  attach: function (context) {
    var active = $('ul.sf-style-rave a.active');
    if (active.length) {
      active.parent().addClass('active-trail');
    }
  }
};
})(jQuery);
