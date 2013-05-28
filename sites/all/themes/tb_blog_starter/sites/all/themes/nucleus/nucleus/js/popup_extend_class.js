(function ($) {

Drupal.Nucleus.tempSaved = Drupal.Nucleus.tempSaved || [];
Drupal.Nucleus.currentOpenedButton = false;
Drupal.Nucleus.tempHiddenPopup = false;

Drupal.behaviors.nucleusGridAction = {
  attach: function (context) {
    $('.rb-setting-sub-form .rb-setting-btn').click(function(event) {
      var this_id = $(this).attr('id');
      Drupal.Nucleus.eventStopPropagation(event);
      if (Drupal.Nucleus.currentOpenedButton) {
      	current_id = Drupal.Nucleus.currentOpenedButton; 
        Drupal.Nucleus.hidePopup();
        if (current_id == this_id) {
          Drupal.Nucleus.currentOpenedButton = false;
          return;
        }
      }
      params = Drupal.Nucleus.parseButtonInfo($(this));
      Drupal.Nucleus.showPopup(params);
    });

    $(document).bind('click', function() {
      Drupal.Nucleus.hidePopup();
    });
    $('.tb-popup-wrap').click(function(event) {
      Drupal.Nucleus.eventStopPropagation(event);
    });
    $('#nucleus_popup_save').click(function(event) {
      Drupal.Nucleus.savePopup(event);
      return false;
    });
    $('#nucleus_popup_close').click(function(event) {
      Drupal.Nucleus.cancelPopup(event);
      return false;
    });
    $('select[name="popup_block_style_selector"]').change(function(event) {
     Drupal.Nucleus.changeBlockStyle();
    });
    $('select[name="popup_region_selector"]').change(function(event) {
      Drupal.Nucleus.changeBlockRegion();
    });
  }
};

Drupal.Nucleus.changeBlockRegion = function(event) {
  var popup = $('#nucleus_form_popup_wrapper');
  var type = popup.find('#nucleus_popup_type').val();
  var page_prefix = popup.find('#nucleus_popup_page').val();
  var key = popup.find('#nucleus_popup_key').val();

  var hidden_name = page_prefix + "region_block_hidden_" + key;
  var current_region_key = $('input[name="' + hidden_name + '"]').val();
  var new_region_key = popup.find('select[name="popup_region_selector"]').val();
  
  var current_blocks_container = $('#draggable_region_' + current_region_key);
  var new_blocks_container = $('#draggable_region_' + new_region_key);
  var block_preview_wrapper = $('#block_preview_wrapper_' + key);
  block_preview_wrapper.appendTo('#draggable_region_' + new_region_key);
  Drupal.Nucleus.smoothScroll('#block_preview_wrapper_' + key, 50, -50);
//  Drupal.Nucleus.moveBlockAction(page_prefix, key, hidden_name, current_region_key, new_region_key);
  Drupal.Nucleus.hidePopup();
  params = Drupal.Nucleus.parseButtonInfo(block_preview_wrapper.find('.rb-setting-sub-form .rb-setting-btn'));
  Drupal.Nucleus.showPopup(params);
}

Drupal.Nucleus.parseButtonInfo = function(button) {
  params = {};
  button_id = button.attr('id');
  page_prefix = Drupal.Nucleus.currentPagePrefix();
  constant_key = "_setting_btn_" + page_prefix;
  constant_key_pos = button_id.indexOf(constant_key);
  constant_key_len = constant_key.length;
  var page_review_container = $("#" + page_prefix + "page_preview_container");

  params.button_id = button_id;
  params.button_top = button.position().top;
  params.button_left = button.position().left;
  params.button_height = button.height();
  params.type = button_id.substr(0, constant_key_pos);
  params.key = button_id.substr(constant_key_pos + constant_key_len);
  params.page_prefix = page_prefix;
  params.preview_left = page_review_container.offset().left;
  params.preview_width = page_review_container.width();
  return params;
}

Drupal.Nucleus.clearPopup = function(button) {
}

Drupal.Nucleus.eventStopPropagation = function(event) {
  if (event.stopPropagation) {
    event.stopPropagation();
  }
  else if (window.event) {
    window.event.cancelBubble = true;
  }
}

Drupal.Nucleus.showPopup = function(params) {
  Drupal.Nucleus.currentOpenedButton = params.button_id;
  var popup = $('#nucleus_form_popup_wrapper');
  var popup_width = popup.width();
  var popup_height = popup.height();

  var popup_left = params.button_left;
  var popup_top = params.button_top + params.button_height + 4;
  if (params.button_left + popup_width > params.preview_width) {
    popup_left -= params.button_left + popup_width - params.preview_width;
  }
  popup.css({top: popup_top + "px", left: popup_left + "px"});
  popup.find('#nucleus_popup_type').val(params.type);
  popup.find('#nucleus_popup_page').val(params.page_prefix);
  popup.find('#nucleus_popup_key').val(params.key);

  var temp_name = params.page_prefix + params.type + "_" + params.key;
  if(Drupal.Nucleus.tempSaved[temp_name] != undefined) {
	this.loadTempForm(popup, params, temp_name);
  }
  else {
    this.loadRegionWidth(popup, params);
    this.loadBlockRegion(popup, params);
    this.loadBlockStyle(popup, params);  
  }
  popup.show();
}

Drupal.Nucleus.loadTempForm = function(popup, params, temp_name) {
  for(x in Drupal.Nucleus.tempSaved[temp_name]) {
	if(popup.find('input[type="radio"][name="' + x + '"]').length) {
      popup.find('input[type="radio"][name="' + x + '"][value="' + Drupal.Nucleus.tempSaved[temp_name][x] + '"]').attr('checked', 'checked');
    }
    else {
	  popup.find('[name="' + x + '"]').val(Drupal.Nucleus.tempSaved[temp_name][x]);
    }
  }
  if(params.type == 'block') {
    popup.find('.form-item-popup-region-selector').show();
  }
  else {
    popup.find('.form-item-popup-region-selector').hide();
  }

  if($('input[name="' + params.page_prefix + params.key + '_width"]').length) {
    popup.find('.form-item-popup-region-width-selector').show();
  }
  else {
    popup.find('.form-item-popup-region-width-selector').hide();
  }

  var style = popup.find('select[name="popup_block_style_selector"]').val();
  style = style == '' ? 'default' : style;
  style = Drupal.Nucleus.getApplyingBlockStyle(params.page_prefix, params.type, params.key, style);
  Drupal.Nucleus.handleShowHideGroupExtendClass(style);
}

Drupal.Nucleus.hidePopup = function() {
  if(Drupal.Nucleus.currentOpenedButton) {
    var popup = $('#nucleus_form_popup_wrapper');
    var type = popup.find('#nucleus_popup_type').val();
    var page_prefix = popup.find('#nucleus_popup_page').val();
    var key = popup.find('#nucleus_popup_key').val();
    var temp_name = page_prefix + type + "_" + key;
    var temp = [];
    popup.find('input:radio:checked, select').each(function() {
      if($(this).val() != '') {
        temp[$(this).attr('name')] = $(this).val();
      }
    });
    Drupal.Nucleus.tempSaved[temp_name] = temp;
    popup.hide();
    Drupal.Nucleus.currentOpenedButton = false;
  }
}

Drupal.Nucleus.loadBlockRegion = function(popup, params) {
  if(params.type == 'block') {
    var wrapper = popup.find('.form-item-popup-region-selector');
    wrapper.find('select[name="popup_region_selector"]').val($('input[name="' + params.page_prefix + "region_block_hidden_" + params.key + '"]').val());
    wrapper.show();
  }
  else {
    popup.find('.form-item-popup-region-selector').hide();
  }
}

Drupal.Nucleus.loadRegionWidth = function(popup, params) {
  if($('input[name="' + params.page_prefix + params.key + '_width"]').length) {
    var wrapper = popup.find('.form-item-popup-region-width-selector');
    wrapper.find('select[name="popup_region_width_selector"]').val($('input[name="' + params.page_prefix + params.key + '_width"]').val());
    wrapper.show();
  }
  else {
    popup.find('.form-item-popup-region-width-selector').hide();
  }
}

Drupal.Nucleus.loadBlockStyle = function(popup, params) {
  var style = $('input[name="' + params.page_prefix + params.type + "_" + params.key + '_style"]').val();
  var extend_class = $('input[name="' + params.page_prefix + params.type + "_" + params.key + '_extend_class"]').val();
  var parts = extend_class.split(" ");
  popup.find('input[type="radio"]').attr("checked", false);
  for(var i = 0; i < parts.length - 1; i += 2) {
    popup.find('#group-' + parts[i] + '-' + parts[i + 1] + '-radio').attr('checked', 'checked');
  }
  style = style == '' ? 'default' : style;
  popup.find('select[name="popup_block_style_selector"]').val(style);
  style = Drupal.Nucleus.getApplyingBlockStyle(params.page_prefix, params.type, params.key, style);
  Drupal.Nucleus.handleShowHideGroupExtendClass(style);
}

Drupal.Nucleus.savePopup = function(event) {
  var popup = $('#nucleus_form_popup_wrapper');
  var type = popup.find('#nucleus_popup_type').val();
  var page_prefix = popup.find('#nucleus_popup_page').val();
  var key = popup.find('#nucleus_popup_key').val();
  
  var style_name = page_prefix + type + "_" + key + "_style";
  var width_name = page_prefix + key + "_width";
  var extend_class_name = page_prefix + type + "_" + key + '_extend_class';

  var selector_width = $('select[name="popup_region_width_selector"]');
  if (selector_width.length) {
    $('input[name="' + width_name + '"]').val(selector_width.val());
  }

  var style = Drupal.Nucleus.getApplyingBlockStyle(page_prefix, type, key, popup.find('select[name="popup_block_style_selector"]').val());
  $('input[name="' + style_name + '"]').val(style);
  var group_name_list = Drupal.Nucleus.extendClassSupportGroups[style];
  var support_some_group = false;
  var values = [];
  for (var x in group_name_list) {
    var group = group_name_list[x];
    var radio = $('input:radio[name="' + group + '-radio"]:checked');
    if (radio.length) {
      var value = radio.val();
      if (value != undefined && value != '') {
        var text = Drupal.Nucleus.extendClassesList[value];
        values.push(group);
        values.push(value);
      }
    }
  }
  $('input:hidden[name="' + extend_class_name + '"]').attr("value", values.join(' '));

  Drupal.Nucleus.hidePopup();
  Drupal.Nucleus.eventStopPropagation(event);
  $('#' + type + '_setting_btn_' + page_prefix + key).addClass('changed-settings');
  return false;
}

Drupal.Nucleus.cancelPopup = function(event) {
  Drupal.Nucleus.hidePopup();
}

Drupal.Nucleus.changeBlockStyle = function() {
  var popup = $('#nucleus_form_popup_wrapper');
  var type = popup.find('#nucleus_popup_type').val();
  var page_prefix = popup.find('#nucleus_popup_page').val();
  var key = popup.find('#nucleus_popup_key').val();
  var style = Drupal.Nucleus.getApplyingBlockStyle(page_prefix, type, key, popup.find('select[name="popup_block_style_selector"]').val());
  Drupal.Nucleus.handleShowHideGroupExtendClass(style);
}

Drupal.Nucleus.handleShowHideGroupExtendClass = function(style) {
  var popup = $('#nucleus_form_popup_wrapper');
  var groups_list = Drupal.Nucleus.extendClassSupportGroups[style];
  var all_groups_list = Drupal.Nucleus.extendClassGroupsNameList;
  for (var x in all_groups_list) {
    popup.find('#' + all_groups_list[x] + "-group").hide();
  }
  var empty = true;
  for (var x in groups_list) { 
    popup.find('#' + groups_list[x] + "-group").show();
    empty = false;
  }
  if(empty) {
    popup.find('#tb-extend-class').hide();
  }
  else {
    popup.find('#tb-extend-class').show();
  }
}

Drupal.Nucleus.getApplyingBlockStyle = function(page_prefix, type, key, style) {
  if(type == 'block' && (style == 'default' || style == '')) {
    var region_key = Drupal.Nucleus.regionsBlocksList['blocks'][key];
    region_key = region_key.replace(/-/gi, '_');
    var temp_name = page_prefix + "region_" + region_key;
    if(Drupal.Nucleus.tempSaved[temp_name] != undefined) {
      return Drupal.Nucleus.tempSaved[temp_name]['popup_block_style_selector'];
    }
    style = $('input[name="' + page_prefix + "region_" + region_key + '_style"]').val();
  };
  return style == '' ? "default" : style;
}

Drupal.Nucleus.currentPagePrefix = function() {
  return "";
}

Drupal.Nucleus.getCurrentYPos = function() {
  if (self.pageYOffset) {
    return self.pageYOffset;
  }
  if (document.documentElement && document.documentElement.scrollTop) {
    return document.documentElement.scrollTop;
  }
  if (document.body.scrollTop) {
    return document.body.scrollTop;
  }
  return 0;
}

Drupal.Nucleus.getElementYPos = function(eID) {
  return $(eID).offset().top;
}

Drupal.Nucleus.smoothScroll = function(eID, duration, delta) {
  if (!duration) {
    duration = 500;
  }
  if (!delta) {
    delta = 0;
  }
  var startY = Drupal.Nucleus.getCurrentYPos();
  var stopY = Drupal.Nucleus.getElementYPos(eID) + delta;
  var distance = stopY - startY;
  var speed = Math.round(duration / 33);
  var step  = Math.round(distance / speed);
  if (!step) {
    scrollTo(0, stopY); return;
  }
  var leapY = startY;
  var timer = 0;
  while (leapY != stopY) {
    leapY += step;
    if ((stopY > startY && leapY > stopY) || (stopY < startY && leapY < stopY)) {
      leapY = stopY;
    }
    setTimeout("window.scrollTo(0, "+leapY+")", timer * speed);
    timer++;
  }
  return;
}
Drupal.Nucleus.moveBlockAction = function(page_prefix, block_key, hidden_name, current_region_key, new_region_key) {
  var current_region_name = current_region_key.replace(/_/gi, '-');
  var new_region_name = new_region_key.replace(/_/gi, '-');
  $('input[name="' + hidden_name + '"]').val(new_region_key);
  var style_name = page_prefix + "region_" + new_region_key + "_style";
  var region_style = $('input[name="' + style_name + '"]').val();
  region_style = (region_style == '') ? 'default' : region_style;

  Drupal.Nucleus.regionsBlocksList['blocks'][block_key] = new_region_name;
  Drupal.Nucleus.regionsBlocksList['regions'][current_region_name][block_key] = 0;
  Drupal.Nucleus.regionsBlocksList['regions'][new_region_name][block_key] = 1;
  var popup = $('#nucleus_form_popup_wrapper');
  var type = popup.find('#nucleus_popup_type').val();
  var page_prefix = popup.find('#nucleus_popup_page').val();
  var key = popup.find('#nucleus_popup_key').val();
  var style = Drupal.Nucleus.getApplyingBlockStyle(page_prefix, type, key, popup.find('select[name="popup_block_style_selector"]').val());
  Drupal.Nucleus.handleShowHideGroupExtendClass(style);  
}
})(jQuery);
