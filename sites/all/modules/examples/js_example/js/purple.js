
(function($){
$(document).ready(function(){
  var weight = Drupal.settings.js_weights.purple;
  var newDiv = $('<div></div>').css('color', 'purple').html('I have a weight of ' + weight);
  $('#js-weights').append(newDiv);
});
})(jQuery);
