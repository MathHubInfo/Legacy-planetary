<?php
/*
 * @file
 * Integrates with shoutbox module.
 */

/**
 * Class HeartbeatShoutBoxPlugin.
 */
class HeartbeatShoutBoxPlugin extends HeartbeatBasePlugin implements iHeartbeatPlugin  {

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

    if (isset($heartbeatStream->config->settings['shoutbox']) && $heartbeatStream->config->settings['shoutbox']) {

      // Load externals.
      theme('shoutbox_external_files');

      $output = drupal_get_form('shoutbox_add_form');
      $heartbeatStream->prefix = drupal_render($output);

      _shoutbox_js_config();
      //$output = shoutbox_view(TRUE);
      //$heartbeatStream->prefix = drupal_render($output);

    }

  }

  /**
   * pluginStreamForm().
   */
  public function pluginStreamForm(&$form, &$form_state) {

    $form['settings']['fs_shoutbox'] = array(
      '#type' => 'fieldset',
      '#title' => t('Shoutbox'),
      '#collapsible' => TRUE,
      '#collapsed' => TRUE,
      'shoutbox' => array(
        '#type' => 'checkbox',
        '#title' => t('Prepend a shoutbox form to the stream'),
        '#default_value' => isset($form_state['item']->settings['shoutbox']) ? $form_state['item']->settings['shoutbox'] : 0,
      ),
    );
  }

}