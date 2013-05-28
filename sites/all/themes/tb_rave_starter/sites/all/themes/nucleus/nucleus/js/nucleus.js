(function ($) {

if (Drupal.Nucleus == undefined) {
  Drupal.Nucleus = {};
}
Drupal.behaviors.nucleusAction = {
  attach: function (context) {
    Drupal.Nucleus.changeGrid($("#edit-grid"));
    $("#edit-grid").change(function () {
      Drupal.Nucleus.changeGrid(this);
    });
  }
};

Drupal.Nucleus.updateGridOptions = function(select_name, grid_int) {
  if (grid_int < Drupal.Nucleus.currentGridInt) {
    for (var i = grid_int + 1; i <= Drupal.Nucleus.currentGridInt; i ++) {
      $('select[name="' + select_name + '"] option[value="' + i + '"]').remove();
    }
  }
  else if (grid_int > Drupal.Nucleus.currentGridInt) {
    var select = $('select[name="' + select_name + '"]');
    for (var i = Drupal.Nucleus.currentGridInt + 1; i <= grid_int; i ++) {
      select.append($('<option value="' + i + '">' + i + " " + (i > 1 ? Drupal.t('columns') : Drupal.t('column')) + '</option>'));
    }
  }
}

Drupal.Nucleus.changeGrid = function(element) {
  var grid = parseInt($(element).val());
  var select = $('select[name="layout_width_selector"]');
  if(select.length) {
    var current_value = select.val();
    select.find('option').remove();
    var min_width = 900;
    var max_width = 1080;
    for(var i = min_width; i <= max_width; i ++) {
      if(i % grid == 0) {
        select.append($('<option value="' + i + '">' + i + " " + Drupal.t('Pixels') + '</option>'));
      }
    }
    select.append($('<option value="custom">' + Drupal.t('Custom') + '</option>'));
    select.val(current_value);
  }
  Drupal.Nucleus.updateGridOptions('popup_region_width_selector', grid)
  Drupal.Nucleus.currentGridInt = grid;
}

Drupal.Nucleus.onClickResetDefaultSettings = function() {
  var answer = confirm(Drupal.t('Are you sure you want to reset your theme settings to default theme settings?'))
  if (answer){
    $("input:hidden[name = nucleus_use_default_settings]").attr("value", 1);
    return true;
  }

  return false;
}

Drupal.Nucleus.rebuildBlocks = function() {
  $("input:hidden[name=nucleus_rebuild_blocks]").attr("value", 1);  
}

})(jQuery);
