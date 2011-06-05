
(function($){
$(document).ready(function(){
  var weight = Drupal.settings.js_weights.black;
  var newDiv = $('<div></div>').css('color', 'black').html('I have a weight of ' + weight);
  $('#js-weights').append(newDiv);
});
})(jQuery);
