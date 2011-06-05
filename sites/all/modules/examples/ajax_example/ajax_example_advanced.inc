<?php

/**
 * @file
 * AJAX Commands examples.
 *
 * This demonstrates each of the
 * new AJAX commands. This is consolidated into a dense page because
 * it's advanced material and because it would spread itself all over creation
 * otherwise.
 *
*/

/**
 * Form to display the AJAX Commands.
 */
function ajax_example_advanced_commands($form, &$form_state) {
  $form = array();
  $form['intro'] = array(
    '#type' => 'markup',
    '#markup' => t("<div>Demonstrates how AJAX commands can be used.</div>"),
  );

  // Shows the 'after' command with a callback generating commands.
  $form['after_command_example_fieldset'] = array(
    '#type' => 'fieldset',
    '#title' => t("This shows the Ajax 'after' command. Click to put something below the div that says 'Something can be inserted after this'")
  );

  $form['after_command_example_fieldset']['after_command_example'] = array(
    '#value' => t("AJAX 'After': Click to put something after the div"),
    '#type' => 'submit',
    '#ajax' => array(
      'callback' => 'ajax_example_advanced_commands_after_callback',
    ),
    '#suffix' => "<div id='after_div'>Something can be inserted after this</div>
                  <div id='after_status'>'After' Command Status: Unknown</div>",
  );

  // Shows the 'alert' command.
  $form['alert_command_example_fieldset'] = array(
    '#type' => 'fieldset',
    '#title' => t("Demonstrates the AJAX 'alert' command. Click the button."),
  );
  $form['alert_command_example_fieldset']['alert_command_example'] = array(
    '#value' => t("AJAX 'Alert': Click to alert"),
    '#type' => 'submit',
    '#ajax' => array(
      'callback' => 'ajax_example_advanced_commands_alert_callback',
    ),
  );

  // Shows the 'append' command.
  $form['append_command_example_fieldset'] = array(
    '#type' => 'fieldset',
    '#title' => t("This shows the Ajax 'append' command. Click to put something below the div that says 'Something can be inserted after this'")
  );

  $form['append_command_example_fieldset']['append_command_example'] = array(
    '#value' => t("AJAX 'Append': Click to append something"),
    '#type' => 'submit',
    '#ajax' => array(
      'callback' => 'ajax_example_advanced_commands_append_callback',
    ),
    '#suffix' => "<div id='append_div'>Something can be appended inside this div... </div>
                  <div id='append_status'>'After' Command Status: Unknown</div>"
  );


  // Shows the 'before' command.
  $form['before_command_example_fieldset'] = array(
    '#type' => 'fieldset',
    '#title' => t("This shows the Ajax 'before' command.")
  );

  $form['before_command_example_fieldset']['before_command_example'] = array(
    '#value' => t("AJAX 'before': Click to put something before the div"),
    '#type' => 'submit',
    '#ajax' => array(
      'callback' => 'ajax_example_advanced_commands_before_callback',
    ),
    '#suffix' => "<div id='before_div'>Something can be inserted before this</div>
                  <div id='before_status'>'before' Command Status: Unknown</div>"
  );

  // Shows the 'changed' command.
  $form['changed_command_example_fieldset'] = array(
    '#type' => 'fieldset',
    '#title' => t("Demonstrates the AJAX 'changed' command. If region is 'changed', it is marked with CSS. This example also puts an asterisk by changed content."),
  );

  $form['changed_command_example_fieldset']['changed_command_example'] = array(
    '#title' => t("AJAX changed: If checked, div is marked as changed."),
    '#type' => 'checkbox',
    '#default_value' => FALSE,
    '#ajax' => array(
      'callback' => 'ajax_example_advanced_commands_changed_callback',
    ),
    '#suffix' => "<div id='changed_div'> <div id='changed_div_mark_this'>This div can be marked as changed or not.</div></div>
                  <div id='changed_status'>Status: Unknown</div>"
  );

  // Shows the AJAX 'css' command.
  $form['css_command_example_fieldset'] = array(
    '#type' => 'fieldset',
    '#title' => t("Demonstrates the AJAX 'css' command."),
  );

  $form['css_command_example_fieldset']['css_command_example'] = array(
    '#title' => t("AJAX CSS: Choose the color you'd like the '#box' div to be."),
    '#type' => 'select',
    // '#default_value' => 'green',
    '#options' => array('green' => 'green', 'blue' => 'blue'),
    '#ajax' => array(
      'callback' => 'ajax_example_advanced_commands_css_callback',
    ),
    '#suffix' => "<div id='css_div' style='height: 50px; width: 50px; border: 1px solid black'> box</div>
                  <div id='css_status'>Status: Unknown</div>"
  );

  // Shows the AJAX 'data' command. But there is no use of this information,
  // as this would require a javascript client to use the data.
  $form['data_command_example_fieldset'] = array(
    '#type' => 'fieldset',
    '#title' => t("Demonstrates the AJAX 'data' command."),
  );

  $form['data_command_example_fieldset']['data_command_example'] = array(
    '#title' => t("AJAX data: Set a key/value pair on a selector."),
    '#type' => 'textfield',
    '#default_value' => 'color=green',
    '#ajax' => array(
      'callback' => 'ajax_example_advanced_commands_data_callback',
    ),
    '#suffix' => "<div id='data_div'>This div should have key='time'/value='a time string' attached.</div>
                  <div id='data_status'>Status: Unknown</div>"
  );

  // Shows the AJAX 'html' command.
  $form['html_command_example_fieldset'] = array(
    '#type' => 'fieldset',
    '#title' => t("Demonstrates the AJAX 'html' command."),
  );

  $form['html_command_example_fieldset']['html_command_example'] = array(
    '#title' => t("AJAX html: Replace the HTML in a selector."),
    '#type' => 'textfield',
    '#default_value' => 'new value',
    '#ajax' => array(
      'callback' => 'ajax_example_advanced_commands_html_callback',
    ),
    '#suffix' => "<div id='html_div'>Original contents</div>
                  <div id='html_status'>Status: Unknown</div>"
  );

  // Shows the AJAX 'prepend' command.
  $form['prepend_command_example_fieldset'] = array(
    '#type' => 'fieldset',
    '#title' => t("This shows the AJAX 'prepend' command. Click to put something below the div that says 'Something can be inserted after this'")
  );

  $form['prepend_command_example_fieldset']['prepend_command_example'] = array(
    '#value' => t("AJAX 'prepend': Click to prepend something"),
    '#type' => 'submit',
    '#ajax' => array(
      'callback' => 'ajax_example_advanced_commands_prepend_callback',
    ),
    '#suffix' => "<div id='prepend_div'>Something can be prepended to this div... </div>
                  <div id='prepend_status'>'After' Command Status: Unknown</div>"
  );

  // Shows the AJAX 'remove' command.
  $form['remove_command_example_fieldset'] = array(
    '#type' => 'fieldset',
    '#title' => t("Shows the Ajax 'remove' command.")
  );

  $form['remove_command_example_fieldset']['remove_command_example'] = array(
    '#title' => t("AJAX 'remove': Check to remove text. Uncheck to add it back."),
    '#type' => 'checkbox',
    '#default_value' => FALSE,
    '#ajax' => array(
      'callback' => 'ajax_example_advanced_commands_remove_callback',
    ),
    '#suffix' => "<div id='remove_div'><div id='remove_text'>text to be removed</div></div>
                  <div id='remove_status'>'After' Command Status: Unknown</div>"
  );

  // Show off the AJAX 'restripe' command. Also shows classic AJAX replacement
  // on the "how many rows" processing.
  $form['restripe_command_example_fieldset'] = array(
    '#type' => 'fieldset',
    '#title' => t("Demonstrates the Ajax 'restripe' command.")
  );

  $form['restripe_command_example_fieldset']['restripe_num_rows'] = array(
    '#type' => 'select',
    '#default_value' => !empty($form_state['values']['restripe_num_rows']) ? $form_state['values']['restripe_num_rows'] : 1,
    '#options' => drupal_map_assoc(array(1, 2, 3, 4, 5, 6, 7, 8, 9, 10)),
    '#ajax' => array(
      'callback' => 'ajax_example_advanced_commands_restripe_num_rows',
      'method' => 'replace',
      'wrapper' => 'restripe_table',
    ),
  );
  $form['restripe_command_example_fieldset']['restripe_restripe'] = array(
    '#type' => 'submit',
    '#value' => t("Restripe the table"),
    '#ajax' => array(
      'callback' => 'ajax_example_advanced_commands_restripe_callback',
    ),
    '#suffix' => "<div id='restripe_div'>
                  <table id='restripe_table' style='border: 1px solid black' >
                  <tr id='table-first'><td>first row</td></tr>
                  </table>
                  </div>
                  <div id='restripe_status'>'Restripe' Command Status: Unknown</div>",

  );

  $form['submit'] = array(
    '#type' => 'submit',
    '#value' => t('Submit'),
  );

  return $form;
}

/**
 * 'after' callback.
 * @see ajax_command_after()
 */
function ajax_example_advanced_commands_after_callback($form, $form_state) {
  $selector = '#after_div';

  $commands = array();
  $commands[] = ajax_command_after($selector, "New 'after'...");
  $commands[] = ajax_command_replace("#after_status", "<div id='after_status'>Updated after_command_example " . date('r') . "</div>");
  return array('#type' => 'ajax', '#commands' => $commands);
}

/**
 * 'alert' callback.
 * @see ajax_command_alert()
 */
function ajax_example_advanced_commands_alert_callback($form, $form_state) {
  $commands = array();
  $commands[] = ajax_command_alert("Alert requested at " . date('r'));
  return array('#type' => 'ajax', '#commands' => $commands);
}

/**
 * 'append' callback.
 * @see ajax_command_append()
 */
function ajax_example_advanced_commands_append_callback($form, $form_state) {
  $selector = '#append_div';

  $commands = array();
  $commands[] = ajax_command_append($selector, "Stuff...");
  $commands[] = ajax_command_replace("#append_status", "<div id='append_status'>Updated append_command_example " . date('r') . "</div>");
  return array('#type' => 'ajax', '#commands' => $commands);
}

/**
 * 'before' callback.
 * @see ajax_command_before()
 */
function ajax_example_advanced_commands_before_callback($form, $form_state) {
  $selector = '#before_div';

  $commands = array();
  $commands[] = ajax_command_before($selector, "New 'before'...");
  $commands[] = ajax_command_replace("#before_status", "<div id='before_status'>Updated before_command_example " . date('r') . "</div>");
  return array('#type' => 'ajax', '#commands' => $commands);
}

/**
 * 'changed' callback.
 * @see ajax_command_changed()
 */
function ajax_example_advanced_commands_changed_callback($form, $form_state) {
  $checkbox_value = $form_state['values']['changed_command_example'];
  $checkbox_value_string = $checkbox_value ? "TRUE" : "FALSE";
  $commands = array();
  if ($checkbox_value) {
    $commands[] = ajax_command_changed( '#changed_div', '#changed_div_mark_this');
  }
  else {
    $commands[] = ajax_command_replace('#changed_div', "<div id='changed_div'> <div id='changed_div_mark_this'>This div can be marked as changed or not.</div></div>");
  }
  $commands[] = ajax_command_replace("#changed_status", "<div id='changed_status'>Updated changed_command_example to $checkbox_value_string: " . date('r') . "</div>");
  return array('#type' => 'ajax', '#commands' => $commands);
}

/**
 * 'css' callback.
 * @see ajax_command_css()
 */
function ajax_example_advanced_commands_css_callback($form, $form_state) {
  $selector = '#css_div';
  $color = $form_state['values']['css_command_example'];

  $commands = array();
  $commands[] = ajax_command_css($selector, array('background-color' => $color));
  $commands[] = ajax_command_replace("#css_status", "<div id='css_status'>Updated css_command_example to '{$color}' " . date('r') . "</div>");
  return array('#type' => 'ajax', '#commands' => $commands);
}

/**
 * 'data' callback.
 * @see ajax_command_data()
 */
function ajax_example_advanced_commands_data_callback($form, $form_state) {
  $selector = '#data_div';
  $text = $form_state['values']['data_command_example'];
  list($key, $value) = preg_split('/=/', $text);

  $commands = array();
  $commands[] = ajax_command_data($selector, $key, $value);
  $commands[] = ajax_command_replace("#data_status", "<div id='data_status'>Updated data_command_example with key=$key, value=$value; " . date('r') . "</div>");
  return array('#type' => 'ajax', '#commands' => $commands);
}

/**
 * 'html' callback.
 * @see ajax_command_html()
 */
function ajax_example_advanced_commands_html_callback($form, $form_state) {
  $text = $form_state['values']['html_command_example'];

  $commands = array();
  $commands[] = ajax_command_html('#html_div', $text);
  $commands[] = ajax_command_replace("#html_status", "<div id='html_status'>Updated html_command_example with text=$text;  " . date('r') . "</div>");
  return array('#type' => 'ajax', '#commands' => $commands);
}

/**
 * 'prepend' callback.
 * @see ajax_command_prepend()
 */
function ajax_example_advanced_commands_prepend_callback($form, $form_state) {
  $commands = array();
  $commands[] = ajax_command_prepend('#prepend_div', "Prepended Stuff...");
  $commands[] = ajax_command_replace("#prepend_status", "<div id='prepend_status'>Updated prepend_command_example " . date('r') . "</div>");
  return array('#type' => 'ajax', '#commands' => $commands);
}

/**
 * 'remove' callback.
 * @see ajax_command_remove()
 */
function ajax_example_advanced_commands_remove_callback($form, $form_state) {
  $commands = array();
  $should_remove = $form_state['values']['remove_command_example'];
  $should_remove_string = $should_remove ? 'TRUE' : 'FALSE';
  if ($should_remove) {
    $commands[] = ajax_command_remove('#remove_text');
  }
  else {
    $commands[] = ajax_command_html('#remove_div', "<div id='remove_text'>text to be removed</div>");
  }
  $commands[] = ajax_command_replace("#remove_status", "<div id='remove_status'>Updated remove_command_example (value={$should_remove_string} " . date('r') . "</div>");
  return array('#type' => 'ajax', '#commands' => $commands);
}

/**
 * 'restripe' rows callback.
 * Rebuilds the table with the selected number of rows.
 */
function ajax_example_advanced_commands_restripe_num_rows($form, $form_state) {
  $num_rows = $form_state['values']['restripe_num_rows'];
  $output = "<table id='restripe_table' style='border: 1px solid black'>";
  for ($i=1; $i<=$num_rows; $i++) {
    $output .= "<tr><td>Row $i</td></tr>";
  }
  $output .= "</table>";
  return $output;
}

/**
 * 'restripe' callback.
 * @see ajax_command_restripe()
 */
function ajax_example_advanced_commands_restripe_callback($form, $form_state) {
  $commands = array();
  $commands[] = ajax_command_restripe('#restripe_table');
  $commands[] = ajax_command_replace("#restripe_status", "<div id='restripe_status'>Restriped table " . date('r') . "</div>");
  return array('#type' => 'ajax', '#commands' => $commands);
}
