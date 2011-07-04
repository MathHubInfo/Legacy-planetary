
(function($){
$(document).ready(function(){
  var weight = Drupal.settings.js_weights.blue;
  var newDiv = $('<div></div>').css('color', 'blue').html('I have a weight of ' + weight);
  $('#js-weights').append(newDiv);
});
})(jQuery);
