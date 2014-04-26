<?php

/**
 * @file
 * Flag attachment plugin for heartbeat.
 *
 */

 module_load_include('inc', 'heartbeat_plugins', 'includes/heartbeatflagplugin');

/**
 * Class HeartbeatFlagAttachmentPlugin.
 */
class HeartbeatFlagAttachmentPlugin extends HeartbeatFlagPlugin implements iHeartbeatPlugin  {

  public $flag = NULL;
  public $count = 0;
  public $link = '';

  /**
   * getAttachments().
   *
   * @param $template
   *   The Heartbeat Template
   * @param $component_type
   *   The type of attachment [buttons, content]
   */
  public function getAttachments($template, $component_type) {

    $attachments = array();

    $flags = flag_get_flags('heartbeat_activity');
    foreach ($flags as $flag) {
      $args = array('@flag' => $flag->name);
      $attachments[] = array(
        'name' => $this->settings['plugin_name'] . ':' . $flag->name,
        'title' => $component_type == 'buttons' ? t('Heartbeat flag buttons for "@flag"', $args) :t('Heartbeat flag count for "@flag"', $args),
        'enabled' => isset($template->attachments[$component_type]['enabled'][$this->settings['plugin_name'] . ':' . $flag->name]) ? $template->attachments[$component_type]['enabled'][$this->settings['plugin_name'] . ':' . $flag->name] : 0,
        'weight' => 0,
      );
    }

    return $attachments;
  }

  /**
   * loadAttachments().
   *
   * @param HeartbeatActivity $heartbeatActivity
   *   The Heartbeat Activity Message object
   * @param String $name
   *   The Flagname of the flag attached to the Message.
   */
  public function loadAttachments(HeartbeatActivity & $heartbeatActivity, $name = NULL) {

    // We need the flagname for flagmessages.
    if (!isset($name)) {
      return;
    }

    $pluginId = $this->settings['plugin_name'] . ":" . $name;
    $attachments = $heartbeatActivity->template->attachments;

    // Always load the flag (for content or buttons).
    $this->flag = flag_get_flag($name);

    // Load the count for this message if needed.
    if (isset($attachments['content']['enabled'][$pluginId])) {
      $counts = flag_get_counts('heartbeat_activity', $heartbeatActivity->uaid);
      $this->count = isset($counts[$name]) ? $counts[$name] : 0;
    }

    // Load the link for this message if needed.
    if (isset($attachments['buttons']['enabled'][$pluginId])) {
      $this->link = flag_create_link($name, $heartbeatActivity->uaid);
    }

    // Add the plugin to this message.
    if ($this->flag && _flag_content_enabled($this->flag, 'heartbeat_activity')) {
      $heartbeatActivity->add_plugin($pluginId, $this);
    }
    // Remove the flags that are currently disabled.
    else {
      $heartbeatActivity->remove_plugin($pluginId);
    }

  }

  /**
   * hasContent().
   * True if a plugin provides attachments.
   */
  public function hasContent() {
    return TRUE;
  }

  /**
   * hasAttachmentsContent().
   * True if the message has attachments content.
   */
  public function hasAttachmentsContent() {
    // TODO add correct evaluation.
    return TRUE;
  }

  /**
   * renderAttachmentsContent().
   */
  public function renderAttachmentsContent(HeartbeatActivity $heartbeatActivity) {
  	if ($this->count > 0) {
  		$heartbeatActivity->add_attachment('<span class="heartbeat-flag-count">' . $this->flag->get_label('flag_message', $heartbeatActivity) . '</span>');
  	}
  }

  /**
   * hasButtons().
   */
  public function hasButtons() {
    return TRUE;
  }

  /**
   * hasAttachmentsButtons().
   * True if a message has attachment buttons.
   */
  public function hasAttachmentsButtons() {
    // TODO add correct evaluation.
    return TRUE;
  }

  /**
   * renderButtons().
   */
  public function renderButtons(HeartbeatActivity $heartbeatActivity) {
    if (isset($this->link)) {
      $heartbeatActivity->add_button($this->link);
    }
    elseif ($this->flag && $this->flag->access($heartbeatActivity->uaid)) {
      $link = $this->flag->theme($this->flag->is_flagged($heartbeatActivity->uaid) ? 'unflag' : 'flag', $heartbeatActivity->uaid, FALSE);
      $heartbeatActivity->add_button($link);
    }
  }

  /**
   * isStreamAdaptor().
   */
  public function isStreamAdaptor() {
    return TRUE;
  }

  /**
   * adaptsStream().
   */
  public function adaptsStream() {
    return TRUE;
  }

  /**
   * streamLoaded().
   */
  public function streamLoaded(HeartbeatStream $heartbeatStream) {
    $heartbeatStream->needsModal(TRUE);
  }

  /**
   * getMenuItems().
   */
  public function getMenuItems() {
    return array(
      'heartbeat/%ctools_js/flagged/%heartbeat_activity' => array(
        'title' => 'People who liked this',
        'type' => MENU_CALLBACK,
        'page callback' => 'heartbeat_plugins_modal_flagging_users',
        'page arguments' => array(1, 3),
        'access arguments' => array('access heartbeat activity profiles'),
        'file' => 'includes/heartbeatflagplugin.inc',
      ),
    );
  }

  /**
   * flagDefinitions().
   * Defines the flag definition.
   */
  public function flagDefinitions() {
    return array(
      'heartbeat_activity' => array(
        'title' => t('Heartbeat activity instance'),
        'description' => t("Heartbeat activity messages."),
        'handler' => 'flag_heartbeat_message',
      )
    );
  }

  /**
   * flagDefaults().
   * Defines the default flags.
   */
  public function flagDefaults() {

    $flags = array();
    // Exported flag: "I like".
    $flags['like'] = array(
      'content_type' => 'heartbeat_activity',
      'title' => 'I like',
      'global' => '0',
      'types' => array(),
      'flag_short' => 'I like this',
      'flag_long' => 'you like this',
      'flag_message' => '[heartbeat_activity:flag-like-count-linked] liked this',
      'unflag_short' => 'I don\'t like this',
      'unflag_long' => 'you don\'t like this',
      'unflag_message' => 'you don\'t like this',
      'unflag_denied_text' => '',
      'link_type' => 'toggle',
      'roles' => array(
        'flag' => array(
          '0' => '2',
        ),
        'unflag' => array(
          '0' => '2',
        ),
      ),
      'api_version' => 2,
    );
    return $flags;

  }

  /**
   * pluginUIForm().
   */
  public function pluginUIForm(&$form, &$form_state) {

    $form['settings']['count_enabled'] = array(
      '#type' => 'checkbox',
      '#title' => t('Enable the count data'),
      '#default_value' => isset($this->settings['count_enabled']) ? $this->settings['count_enabled'] : '',
    );

  }

  /**
   * pluginAttachmentForm().
   *
   * @param $form
   * @param $form_values
   * @param $component_type [buttons, content]
   */
  public function pluginAttachmentForm(&$form, $form_values, $component_type) {

    // If no count is available, then this plugin has no content, only buttons.
    if ($component_type == 'content' && !$this->countEnabled()) {
      // unset
    }

  }

  /**
   * countEnabled().
   */
  protected function countEnabled() {
    return isset($this->settings['count_enabled']) && $this->settings['count_enabled'];
  }

}

/**
 * Exposes a Heartbeat Message Flag.
 */
class flag_heartbeat_message extends flag_flag {

  function options_form(&$form) {
    parent::options_form($form);
    $form['access']['types'] = array(
      // A user flag doesn't support node types.
      // TODO: Support heartbeat templates instead of node types.
      '#type' => 'value',
      '#value' => array(0 => 0),
    );
  }

  function _load_content($content_id) {
    $heartbeatActivity = HeartbeatMessagePool::getInstance()->getMessage($content_id);
    return is_numeric($content_id) ? $heartbeatActivity : NULL;
  }

  function applies_to_content_object($message_instance) {

    if ($message_instance) {
      return TRUE;
    }
    return FALSE;
  }

  function get_content_id($heartbeat_message) {
    return $heartbeat_message->uaid;
  }

  function uses_hook_link($teaser) {
    return TRUE;
  }

  function get_labels_token_types() {
    return array_merge(array('heartbeat_activity'), parent::get_labels_token_types());
  }

  function replace_tokens($label, $contexts, $options, $content_id) {
    if ($content_id) {
      if ($content_id instanceOf HeartbeatActivity) {
        $contexts['heartbeat_activity'] = $content_id;
        $content_id = $contexts['heartbeat_activity']->uaid;
      }
      elseif ($message = $this->fetch_content($content_id)) {
        $contexts['heartbeat_activity'] = $message;
      }
    }
    return parent::replace_tokens($label, $contexts, $options, $content_id);
  }

  function get_flag_action($content_id) {
    $flag_action = parent::get_flag_action($content_id);
    $flag_action->content_title = $this->fetch_content($content_id)->message;
    return $flag_action;
  }

  function get_relevant_action_objects($content_id) {
    return array('heartbeat_activity' => $this->fetch_content($content_id));
  }

  function rules_get_event_arguments_definition() {
    return array(
      'heartbeat_activity' => array(
        'type' => 'heartbeat_activity',
        'label' => t('flagged heartbeat message'),
        'handler' => 'flag_rules_get_event_argument',
      ),
    );
  }

  function rules_get_element_argument_definition() {
    return array('type' => 'heartbeat_activity', 'label' => t('Flagged heartbeat message'));
  }

  function get_views_info() {
    return array(
      'views table' => 'heartbeat_activity',
      'title field' => 'message',
      'title' => t('Activity flag'),
      'help' => t('Limit results to only those messages flagged by a certain flag; Or display information about the flag set on an activity message.'),
      'counter title' => t('Activity flag counter'),
      'counter help' => t('Include this to gain access to the flag counter field.'),
    );
  }

  function applies_to_content_id_array($content_ids) {
    $passed = array();
    foreach ($content_ids as $uaid) {
      $passed[$uaid] = TRUE;
    }
    return $passed;
  }

}