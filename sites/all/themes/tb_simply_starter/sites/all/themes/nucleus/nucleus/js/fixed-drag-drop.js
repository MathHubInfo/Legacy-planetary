jQuery.widget("ui.nucleus_sortable", jQuery.extend({}, jQuery.ui.sortable.prototype, {

  _init: function(){
    this.element.data('sortable', this.element.data('nucleus_sortable'));
    return jQuery.ui.sortable.prototype._init.apply(this, arguments);
  },

  // Override _getParentOffset to fix bug lost position in overlay
  _getParentOffset: function() {
    //Get the offsetParent and cache its position
    this.offsetParent = this.helper.offsetParent();
    var po = this.offsetParent.offset();

    // This is a special case where we need to modify a offset calculated on start, since the following happened:
    // 1. The position of the helper is absolute, so it's position is calculated based on the next positioned parent
    // 2. The actual offset parent is a child of the scroll parent, and the scroll parent isn't the document, which means that
    //    the scroll is included in the initial calculation of the offset of the parent, and never recalculated upon drag
    if(this.cssPosition == 'absolute' && this.scrollParent[0] != document && this.scrollParent[0].tagName.toLowerCase() != 'html' && jQuery.ui.contains(this.scrollParent[0], this.offsetParent[0])) {
      po.left += this.scrollParent.scrollLeft();
      po.top += this.scrollParent.scrollTop();
    }

    if((this.offsetParent[0] == document.body) //This needs to be actually done for all browsers, since pageX/pageY includes this information
    || (this.offsetParent[0].tagName && this.offsetParent[0].tagName.toLowerCase() == 'html' && jQuery.browser.msie)) //Ugly IE fix
      po = { top: 0, left: 0 };

    return {
      top: po.top + (parseInt(this.offsetParent.css("borderTopWidth"),10) || 0),
      left: po.left + (parseInt(this.offsetParent.css("borderLeftWidth"),10) || 0)
    };
  }
}));

jQuery.ui.nucleus_sortable.defaults = jQuery.extend({}, jQuery.ui.sortable.defaults);

(function ($) {
  Drupal.behaviors.nucleusDragDropAction = {
    attach: function (context) {
        $(".dragable-blocks-list").nucleus_sortable({
          connectWith: ".dragable-blocks-list",
          distance: 10,
          start: function(event, ui) {
            var item = $(ui.item);
            var block_wrapper_id = item.attr('id');
            var block_key = block_wrapper_id.substr(22);
            if(Drupal.Nucleus.currentOpenedButton) {
              Drupal.Nucleus.hidePopup();
              Drupal.Nucleus.tempHiddenPopup = true;
            }
          },
          update: function(event, ui) {
            var target = $(event.target);
            var item = $(ui.item);
            var counter = 0;
            target.children().each(function() {
              var child_id = $(this).attr('id');
              var weight_id = child_id.replace("block_preview_wrapper", "block_weight_hidden");
              $('input[name="' + weight_id + '"]').val(counter);
              counter ++;
            });
            if (Drupal.Nucleus.tempHiddenPopup) {
              params = Drupal.Nucleus.parseButtonInfo(item.find('.rb-setting-sub-form .rb-setting-btn'));
              Drupal.Nucleus.showPopup(params);
              Drupal.Nucleus.tempHiddenPopup = false;
            }
          },
          receive: function(event, ui) {
            var target = $(event.target);
            var item = $(ui.item);
            var page_prefix = Drupal.Nucleus.currentPagePrefix();
            var block_wrapper_id = item.attr('id');
            var block_key = block_wrapper_id.substr(22);
            var hidden_name = page_prefix + "region_block_hidden_" + block_key;
            var current_region_key = $('input[name="' + hidden_name + '"]').val();

            var target_region_id = target.attr('id');
            var new_region_key = target_region_id.substr(17);
            Drupal.Nucleus.moveBlockAction(page_prefix, block_key, hidden_name, current_region_key, new_region_key);
            $('select[name="' + page_prefix + 'block_' + block_key + '_style_region_selector"]').val(new_region_key);
            if (Drupal.Nucleus.tempHiddenPopup) {
              params = Drupal.Nucleus.parseButtonInfo(item.find('.rb-setting-sub-form .rb-setting-btn'));
              Drupal.Nucleus.showPopup(params);
              Drupal.Nucleus.tempHiddenPopup = false;
            }
          }
        });    
    }
  }
})(jQuery);
