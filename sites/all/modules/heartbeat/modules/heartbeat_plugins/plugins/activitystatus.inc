<?php
/*
 * @file
 * Allows to create entity forms to post a user status to the streams.
 */

/**
 * Class HeartbeatActivityStatusPlugin.
 */
class HeartbeatActivityStatusPlugin extends HeartbeatBasePlugin implements iHeartbeatPlugin  {

  /**
   * loadAttachments().
   * Loads extra attachments onto a heartbeat activity message.
   */
  public function loadAttachments(HeartbeatActivity & $heartbeatActivity, $name = NULL) {

  }

  /**
   * hasContent().
   * True if a plugin provides attachments.
   */
  public function hasContent() {
    return FALSE;
  }

  /**
   * hasAttachmentsContent().
   * True if the message has attachments content.
   */
  public function hasAttachmentsContent() {
    return FALSE;
  }

  /**
   * renderAttachmentsContent().
   */
  public function renderAttachmentsContent(HeartbeatActivity $heartbeatActivity) {
  }

  /**
   * hasButtons().
   * True if a plugin provides attachments.
   */
  public function hasButtons() {
    return FALSE;
  }

  /**
   * hasAttachmentsButtons().
   * True if a message has attachment buttons.
   */
  public function hasAttachmentsButtons() {
    return FALSE;
  }

  /**
   * renderButtons().
   */
  public function renderButtons(HeartbeatActivity $heartbeatActivity) {
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

    if (!empty($heartbeatStream->config->settings['show_status_form'])
      && user_access('post activity statuses')
      && $heartbeatStream->canPostActivityStatuses()) {

      $template = heartbeat_message_template_load($heartbeatStream->config->settings['show_status_form']);

      if ($template) {

      	$heartbeatActivity = new HeartbeatActivity(array('actor' => $GLOBALS['user']), $template);

	      // Allow the stream to modify the HeartbeatActivity object.
	      // This is mostly used to add some context to the logging.
	      $heartbeatStream->modifyActivityMessage($heartbeatActivity);

	      $output = drupal_get_form('heartbeat_activity_form_' . $template->message_id, $heartbeatActivity, $heartbeatStream);

	      // Add the form as prefix while wishing I'll find a better way.
	      $heartbeatStream->prefix .= drupal_render($output);

      }
    }

  }

  /**
   * pluginStreamForm().
   */
  public function pluginStreamForm(&$form, &$form_state) {

    $form['settings']['fs_activity_status'] = array(
      '#type' => 'fieldset',
      '#title' => t('Prepend a user status form to the stream (like tweets)'),
      '#collapsible' => TRUE,
      '#collapsed' => TRUE,
      'show_status_form' => array(
        '#type' => 'radios',
        '#options' => array('0' => t('None')) + heartbeat_templates_names(),
        '#default_value' => isset($form_state['item']->settings['show_status_form']) ? $form_state['item']->settings['show_status_form'] : 0,
      ),
    );
  }

}