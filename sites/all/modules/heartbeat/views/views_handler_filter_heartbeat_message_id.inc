<?php
/**
 * Filter by Hearbeat message template.
 */
class views_handler_filter_heartbeat_message_id extends views_handler_filter_in_operator {
  // Populate options with different heartbeat templates.
  function get_value_options() {
    if (!isset($this->value_options)) {
      $this->value_title = t('Message Template');
      $options = array();
      foreach (heartbeat_templates_names() as $type => $name) {
        $options[$type] = t($name);
      }
      asort($options);
      $this->value_options = $options;
    }
  }
}