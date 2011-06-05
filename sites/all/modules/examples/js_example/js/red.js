
(function($){
$(document).ready(function(){
  var weight = Drupal.settings.js_weights.red;
  var newDiv = $('<div></div>').css('color', 'red').html('I have a weight of ' + weight);
  $('#js-weights').append(newDiv);
});
})(jQuery);
