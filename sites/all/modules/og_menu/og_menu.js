/**
 * @file
 * Javascript magic. Shows the eligible menu options when switching groups.
 * 
 */
(function ($) {
  Drupal.behaviors.og_menu = {

    attach: function() {
      // Initialize variables
      var originalParent = $('.menu-parent-select').val();  /* : goes to \\: */
      if(originalParent) {
        var originalParent = originalParent.replace(":","\\:");
      }
      var enabled = $('#edit-menu-enabled').is(':checked');

      var holder = document.createElement('select');
      var selectors = 'select[name^="og_group_ref"], input[name^="og_group_ref"]';

      // Toggle menu alteration
      function toggle(values) {
        // make sure 'values' is always an array, i.e. when using single value select
        if (!(values instanceof Array)) {
          var v = values;
          values = [];
          values[0] = v;
        }

        $('.menu-parent-select option:not(.value-none)').appendTo(holder);

        $.each(values, function(key, val) {
          $('option', holder).each(function() {
            parts = $(this).val().split(':');
            if (Drupal.settings.og_menu.admin === true) {
              $(this).appendTo('.menu-parent-select');
            }
            else {
              if (Drupal.settings.og_menu.menus[parts[0]] == val) {
                $(this).appendTo('.menu-parent-select');
              }
            }
          });
        });

        // If an option exists with the initial value, set it. We do this because
        // we want to keep the original parent if user just adds a group to the node.
        if (values[0]) {
          // Select the menu for the first available group.
          for(var i in Drupal.settings.og_menu.menus) {
            if ((enabled === true) && $('.menu-parent-select option[value='+originalParent+']')) {
              $('.menu-parent-select').val(originalParent);
            }
            else if (Drupal.settings.og_menu.menus[i] == values[0]) {
              $('.menu-parent-select').val(i + ':0');
            }
          }

        }
      }

      // Toggle function for OG select
      var toggleSelect = function() {
        if ($(this).val()) {
          toggle($(this).val());
        }
      };

      // Alter menu on OG select change and init
      if ($(selectors).size()) {
        $(selectors).change(toggleSelect).ready(toggleSelect);
      }

      // init
      toggle($(selectors).val());
    }

  }

}(jQuery));