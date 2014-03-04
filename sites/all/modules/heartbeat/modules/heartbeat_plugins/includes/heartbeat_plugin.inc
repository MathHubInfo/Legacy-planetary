<?php
/*
 * @file
 * Interfaces to implement and classes to extend on when building
 * a Heartbeat Plugin
 */



/**
 *
 * HeartbeatPlugin interface.
 */
interface iHeartbeatPluginWrapper {

  /**
   * getPlugin().
   * Get the real plugin object.
   */
  public function getPlugin();

}

/**
 * Class wrapper for the plugins.
 */
class HeartbeatPluginWrapper extends HeartbeatCtoolsObject implements iHeartbeatPluginWrapper {

  public $plugin_name = '';
  public $label = '';
  public $settings = array();
  public $error = array();

  /**
   * Get the real plugin object.
   */
  public function getPlugin() {
    $class = 'Heartbeat' . $this->plugin_name . 'Plugin';
    module_load_include('inc', $this->module, 'plugins/' . $this->plugin_name);
    if (class_exists($class)) {
      $plugin = new $class($this->label, $this->settings);
      $plugin->addSettings(array('plugin_name' => $this->plugin_name));
    }
    else {
      $plugin = NULL;
      $this->error = array('critical' => t('No class found for @class', array('@class' => $class)));
    }
    return $plugin;
  }

}

/**
 *
 * iHeartbeatPlugin interface.
 */
interface iHeartbeatPlugin {

  /**
   * loadAttachments().
   * Loads extra attachments into the heartbeat activity message, which
   * can and must be used when preparing for display.
   */
  public function loadAttachments(HeartbeatActivity & $heartbeatActivity, $name = NULL);

  /**
   * hasContent().
   * True if a plugin provides attachments.
   */
  public function hasContent();

  /**
   * hasAttachmentsContent().
   * True if the message has attachments content.
   */
  public function hasAttachmentsContent();

  /**
   * renderAttachmentsContent().
   */
  public function renderAttachmentsContent(HeartbeatActivity $heartbeatActivity);

  /**
   * hasButtons().
   * True if a plugin provides attachments.
   */
  public function hasButtons();

  /**
   * hasAttachmentsButtons().
   * True if a message has attachment buttons.
   */
  public function hasAttachmentsButtons();

  /**
   * renderButtons().
   */
  public function renderButtons(HeartbeatActivity $heartbeatActivity);

  /**
   * isStreamAdaptor().
   */
  public function isStreamAdaptor();

  /**
   * adaptsStream().
   */
  public function adaptsStream();

  /**
   * streamLoaded().
   */
  public function streamLoaded(HeartbeatStream $heartbeatStream);

}

/**
 *  abstract class HeartbeatBasePlugin.
 */
class HeartbeatBasePlugin {

  protected $label = '';
  protected $settings = array();
  protected $stream = NULL;

  /**
   * __construct().
   */
  public function __construct($label, $settings) {
    $this->setLabel($label);
    $this->addSettings($settings);
  }

  /**
   * setLabel().
   */
  public function setLabel($label) {
    $this->label = $label;
  }

  /**
   * getLabel().
   */
  public function getLabel() {
    return $this->label;
  }

  /**
   * setStream().
   */
  final public function setStream(HeartbeatStream $heartbeatStream) {
    $this->stream = $heartbeatStream;
  }

  /**
   * addSettings().
   */
  public function addSettings($settings) {
    $this->settings += $settings;
  }

  /**
   * getSettings().
   */
  public function getSettings() {
    return $this->settings;
  }

  /**
   * getAttachments().
   *
   * @param $template
   *   The Heartbeat Template
   * @param $component_type
   *   The type of attachment [buttons, content]
   */
  public function getAttachments($template, $component_type) {
    return array(array(
      'name' => $this->settings['plugin_name'],
      'title' => $this->settings['plugin_name'],
      'enabled' => isset($template->attachments[$component_type]['enabled'][$this->settings['plugin_name']]) ? $template->attachments[$component_type]['enabled'][$this->settings['plugin_name']] : 0,
      'weight' => 5,
    ));
  }

  /**
   * activityRemoved().
   */
  public function activityRemoved($uaids, $all) {

  }

  /**
   * getMenuItems().
   */
  public function getMenuItems() {
    return array();
  }

  /**
   * pluginUIForm().
   */
  public function pluginUIForm(&$form, &$form_state) {

  }

  /**
   * pluginAttachmentForm().
   * The form to add attachments to templates.
   */
  public function pluginAttachmentForm(&$form, $form_values, $component_type) {

  }

  /**
   * pluginStreamForm().
   */
  public function pluginStreamForm(&$form, &$form_state) {

  }

}