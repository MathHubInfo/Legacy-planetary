<?php
/**
 * Field handler to present message buttons for the activity.
 */
class views_handler_field_heartbeat_buttons extends views_handler_field {

  function construct() {
    parent::construct();
    // Add the javascript and css files.
    drupal_add_js(drupal_get_path('module', 'heartbeat') . '/js/heartbeat.js');
    if (variable_get('heartbeat_include_default_style', 1)) {
      drupal_add_css(drupal_get_path('module', 'heartbeat') . '/css/heartbeat.css');
    }

    $this->additional_fields['uaid'] = 'uaid';
  }

//  function query() {
//    $this->ensure_my_table();
//    $this->add_additional_fields();
//  }

  function render($values) {
    $uaid = $this->get_value($values, 'uaid');
    $heartbeatActivity = heartbeat_activity_load($uaid);
     //ctools_include('modal');
   //ctools_include('ajax');
    return $this->render_buttons($heartbeatActivity);
  }

  function render_buttons($heartbeatActivity) {
    return theme('heartbeat_buttons',
     array('heartbeat_activity' => $heartbeatActivity));
  }
}