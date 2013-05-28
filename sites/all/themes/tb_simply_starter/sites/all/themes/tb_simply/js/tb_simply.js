(function ($) {
Drupal.behaviors.actionTBSimply = {
  attach: function (context) {
    window.setTimeout(function() {
      $('#main-content .grid-inner, .region-sidebar-first').matchHeights();
    }, 100);
  }
};
})(jQuery);
