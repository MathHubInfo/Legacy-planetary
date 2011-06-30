
(function($){
$(document).ready(function(){
  var weight = Drupal.settings.js_weights.green;
  var newDiv = $('<div></div>').css('color', 'green').html('I have a weight of ' + weight);
  $('#js-weights').append(newDiv);
});
})(jQuery);
