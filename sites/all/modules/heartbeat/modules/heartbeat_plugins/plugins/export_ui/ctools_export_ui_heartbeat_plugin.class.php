<?php
/**
 * @file
 * Ctools export UI for a heartbeat plugin
 * @author stalski
 *
 */
class ctools_export_ui_heartbeat_plugin extends ctools_export_ui {

  /**
   * Provide the actual editing form.
   */
  function edit_form(&$form, &$form_state) {
    parent::edit_form($form, $form_state);

    $settings = $form_state['item']->settings;
    $new = TRUE;

    $form['label'] = array(
      '#type' => 'textfield',
      '#title' => t('Label'),
      '#default_value' => isset($form_state['item']->label) ? $form_state['item']->label : array(),
      '#size' => 60,
      '#maxlength' => 128,
      '#required' => TRUE,
      '#attributes' => $new ? array() : array('readonly' => 'readonly'),
    );
    $form['module'] = array(
      '#type' => 'textfield',
      '#title' => t('Module'),
      '#default_value' => isset($form_state['item']->module) ? $form_state['item']->module : array(),
      '#size' => 60,
      '#maxlength' => 128,
      '#required' => TRUE,
      '#attributes' => $new ? array() : array('readonly' => 'readonly'),
    );
    $form['settings'] = array(
      '#type' => 'fieldset',
      '#title' => t('Settings'),
      '#collapsible' => TRUE,
      '#collapsed' => FALSE,
      '#tree' => TRUE,
      '#group' => 'general-tab',
    );

    $plugin_name = $form_state['item']->plugin_name;
    $pluginWrapper = heartbeat_plugins_get_plugin($plugin_name);
    if ($pluginWrapper instanceof iHeartbeatPluginWrapper) {
      $plugin = $pluginWrapper->getPlugin();
      if ($plugin) {
        $plugin->pluginUIForm($form, $form_state);
      }
      $new = FALSE;
    }

    if ($new) {
      $form['settings']['attachment'] = array(
        '#type' => 'checkbox',
        '#title' => t('Attachment'),
        '#default_value' => isset($settings['attachment']) ? $settings['attachment'] : array(),
      );
    }

    if (!element_children($form['settings'])) {
      unset($form['settings']);
    }

    // Clear the cache for heartbeat plugins.
    cache_clear_all('heartbeat_plugins', 'cache');

  }


  /**
   * Validate callback for the edit form.
   */
  function edit_form_validate(&$form, &$form_state) {
    parent::edit_form_validate($form, $form_state);

    $pluginName = $form_state['values']['plugin_name'];
    if (empty($pluginName)) {
      form_set_error('plugin_name', t('No valid plugin name given. The plugin needs to be a valid class as extension of iHeartbeatPlugin.'));
    }

    $pluginWrapper = heartbeat_plugins_get_plugin($pluginName);
    if ($pluginWrapper instanceof iHeartbeatPluginWrapper) {
      $plugin = $pluginWrapper->getPlugin();
    }

    if (!($plugin instanceof HeartbeatBasePlugin)) {
      form_set_error('plugin_name', t('Class @class does not implement HeartbeatBasePlugin.', array('@class' => $pluginName)));
    }

  }

}