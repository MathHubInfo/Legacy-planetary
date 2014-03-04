<?php
/**
 * Field handler to present message attachments for the activity.
 */
class views_handler_field_heartbeat_attachments extends views_handler_field {

  function construct() {
    parent::construct();
    $this->additional_fields['uaid'] = 'uaid';
  }

//  function query() {
//    $this->ensure_my_table();
//    $this->add_additional_fields();
//  }

  function render($values) {
    $uaid = $this->get_value($values, 'uaid');
    $heartbeatActivity = heartbeat_activity_load($uaid);
    if ($heartbeatActivity->template->hasPluginAttachments()) {
     $view = heartbeat_activity_view($heartbeatActivity);
     return $this->render_attachments($view['attachments']);
    }
  }

  function render_attachments($attachments) {
    return drupal_render($attachments);
  }

}