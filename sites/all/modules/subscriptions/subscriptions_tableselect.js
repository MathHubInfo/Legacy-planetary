
(function ($) {

Drupal.subscriptions_rowToggle = function(ckb) {
  var thisRow = $(ckb).parents('tr:first');
  var controls = $('input, select', thisRow);
  for (var i = 1; i < controls.length; i++) {
    controls[i].style['visibility'] = (ckb.checked ? 'visible' : 'hidden');
  }
}

Drupal.behaviors.subscriptions_rowSelect = {
  attach: function(context, settings) {
    $('form table:has(th.subscriptions-table)', context)
    .once('row-select', Drupal.subscriptions_rowSelect);
  }
};

Drupal.subscriptions_rowSelect = function () {
  // Dynamically hide/show the other columns depending on the checkbox state in the first column.  
  var rows = $('tr', this);
  for (var i = 1; i < rows.length; i++) {
    var row = rows[i];
    var input = $('td:first input:checkbox', row);
    input.click(function(e) {
      Drupal.subscriptions_rowToggle(this);
    });

    Drupal.subscriptions_rowToggle(input[0]);
  }
}

Drupal.behaviors.subscriptions_tableSelect = {
  attach: function(context, settings) {
    $('table:has(th.select-all)', context).once('table-select', Drupal.subscriptions_tableSelect);
  }
};

Drupal.subscriptions_tableSelect = function () {
  // Do not add a "Select all" checkbox if there are no rows with checkboxes in the table
  if ($('td input:checkbox.select-row', this).size() == 0) {
    return;
  }

  // Keep track of the table, which checkbox is checked and alias the settings.
  var table = this, checkboxes, lastChecked;
  var strings = { 'selectAll': Drupal.t('Turn all subscriptions on.'), 'selectNone': Drupal.t('Turn all subscriptions off.') };
  var updateSelectAll = function(state) {
    $('th.select-all input:checkbox', table).each(function() {
      $(this).attr('title', state ? strings.selectNone : strings.selectAll);
      this.checked = state;
    });
  };

  // Find all <th> with class select-all, and insert the check all checkbox.
  $('th.select-all', table).prepend($('<input type="checkbox" class="form-checkbox"/>').attr('title', strings.selectAll)).click(function(event) {
    if ($(event.target).is('input:checkbox')) {
      // Loop through all checkboxes and set their state to the select all checkbox' state.
      checkboxes.each(function() {
        this.checked = event.target.checked;
        // Show/hide the dependent columns of this row.
        Drupal.subscriptions_rowToggle(this);
      });
      // Update the title and the state of the check all box.
      updateSelectAll(event.target.checked);
    }
  });

  // For each of the checkboxes within the table.
  checkboxes = $('td input:checkbox.select-row', table).click(function(e) {
    // If this is a shift click, we need to highlight everything in the range.
    // Also make sure that we are actually checking checkboxes over a range and
    // that a checkbox has been checked or unchecked before.
    if (e.shiftKey && lastChecked && lastChecked != e.target) {
      // We use the checkbox's parent TR to do our range searching.
      Drupal.subscriptions_tableSelectRange($(e.target).parents('tr')[0], $(lastChecked).parents('tr')[0], e.target.checked);
    }

    // If all checkboxes are checked, make sure the select-all one is checked too, otherwise keep unchecked.
    updateSelectAll((checkboxes.length == $(checkboxes).filter(':checked').length));

    // Keep track of the last checked checkbox.
    lastChecked = e.target;
  });
  // If all checkboxes are checked, make sure the select-all one is checked too, otherwise keep unchecked.
  updateSelectAll((checkboxes.length == $(checkboxes).filter(':checked').length));
  $(this).addClass('tableSelect-processed');
};

Drupal.subscriptions_tableSelectRange = function (from, to, state) {
  // We determine the looping mode based on the the order of from and to.
  var mode = from.rowIndex > to.rowIndex ? 'previousSibling' : 'nextSibling';

  // Traverse through the sibling nodes.
  for (var i = from[mode]; i; i = i[mode]) {
    // Make sure that we're only dealing with elements.
    if (i.nodeType != 1) {
      continue;
    }

    $('input:checkbox.select-row', i).each(function() {
      this.checked = state;
      // Show/hide the dependent columns of this row.
      Drupal.subscriptions_rowToggle(this);
    });

    if (to.nodeType) {
      // If we are at the end of the range, stop.
      if (i == to) {
        break;
      }
    }
    // A faster alternative to doing $(i).filter(to).length.
    else if (jQuery.filter(to, [i]).r.length) {
      break;
    }
  }
};

})(jQuery);
