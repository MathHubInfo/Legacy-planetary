(function ($) {

// Check that shadowbox library is available
if (typeof Shadowbox === 'undefined') return;

Drupal.behaviors.shadowbox = {
  attach: function(context, settings) {
    if (settings.shadowbox.auto_enable_all_images == 1) {
      $("a[href$='jpg'], a[href$='png'], a[href$='gif'], a[href$='jpeg'], a[href$='bmp'], a[href$='JPG'], a[href$='PNG'], a[href$='GIF'], a[href$='JPEG'], a[href$='BMP']").each(function() {
        if ($(this).attr('rel') == '') {
          if (settings.shadowbox.auto_gallery == 1) {
            $(this).attr('rel', 'shadowbox[gallery]');
          }
          else {
            $(this).attr('rel', 'shadowbox');
          }
        }
      });
    } 
    Shadowbox.setup();
  }
};

var changeListener = function(elem){
  $("div.sb-image a").each(function(index, value){
    if(value.title == elem.title){
      var link = $(value).parent().next()[0];
      setTimeout(function(){
        $('#sb-title-inner').html(link);
        $("#sb-title-inner a").css("color", "#fff");
      }, 1000);
    }
  })
}

Shadowbox.init({
  onOpen : changeListener,
	onChange : changeListener
});

})(jQuery);
