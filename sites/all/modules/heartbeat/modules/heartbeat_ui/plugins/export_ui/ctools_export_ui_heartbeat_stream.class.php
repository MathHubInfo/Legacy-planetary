<?php

/**
 * @file
 * Ctools export UI for a heartbeat stream.
 * @author stalski
 *
 */
class ctools_export_ui_heartbeat_stream extends ctools_export_ui {

	/**
	 * Creates a stream based on another stream.
	 * It basically redirects to clone a stream.
	 */
	public function _add_form(&$form, &$form_state) {

    // Fetch message objects.
    ctools_include('export');
    $options = array(0 => t('Select stream to clone from'));
    foreach (ctools_export_load_object('heartbeat_streams', 'all') as $stream) {
      $options[$stream->class] = $stream->title;
    }
		$form['stream_original'] = array(
		  '#type' => 'select',
		  '#options' => $options,
		  '#default_value' => 0,
		  '#title' => t('Base stream'),
		  '#description' => t('To create a stream, you need to select a stream to clone from.')
		);
		$form['stream_op'] = array(
		  '#type' => 'value',
		  '#value' => 'add_clone',
		);
		$form['submit'] = array(
		  '#type' => 'submit',
		  '#value' => t('Clone')
		);

	}

  /**
   * Helper function with element for the settings editing form.
   */
  function _edit_form(&$form, &$form_state) {

    $heartbeatStreamConfig = $form_state['item'];
    _heartbeat_stream_config_unpack($heartbeatStreamConfig);

    $cloning = $form_state['form type'] == 'clone';

    $form['path'] = array(
      '#type' => 'hidden',
      '#title' => t('Path'),
      '#default_value' => $heartbeatStreamConfig->path,
    );
    $form['module'] = array(
      '#type' => 'hidden',
      '#title' => t('Module'),
      '#default_value' => $heartbeatStreamConfig->module,
    );

    $heartbeatStreamConfig->real_class = empty($heartbeatStreamConfig->real_class) ? $heartbeatStreamConfig->class : $heartbeatStreamConfig->real_class;
    if ($cloning) {
      $heartbeatStreamConfig->real_class = preg_replace("/clone_of_/", "", $heartbeatStreamConfig->class);
    }
    $form['real_class'] = array(
      '#type' => 'hidden',
      '#title' => t('Real class'),
      '#default_value' => $heartbeatStreamConfig->real_class,
      '#description' => t('Real class to load for clones'),
    );

    $form['title'] = array(
      '#type' => 'textfield',
      '#title' => t('Title'),
      '#default_value' => isset($heartbeatStreamConfig->title) ? $heartbeatStreamConfig->title : '',
      '#description' => t('Used in page titles'),
    );
    if ($cloning) {
      $form['title']['#default_value'] = t('Clone of @title', array('@title' => $heartbeatStreamConfig->title));
    }

    $form['settings'] = array(
      '#type' => 'vertical_tabs',
      '#tree' => TRUE,
      '#weight' => 50,
    );

    // Permissions, allow/deny message templates.
    $form['settings']['fs_perms'] = array(
      '#type' => 'fieldset',
      '#collapsible' => TRUE,
      '#collapsed' => FALSE,
      '#title' => t('Permissions'),
    );

    // Fetch message objects.
    ctools_include('export');
    $options = array();
    foreach (ctools_export_load_object('heartbeat_messages', 'all') as $template) {
      $options[$template->message_id] = $template->description;
    }
    $form['settings']['fs_perms']['messages_denied'] = array(
      '#type' => 'checkboxes',
      '#title' => t('Choose message types you want to deny from display'),
      '#multiple' => TRUE,
      '#default_value' => $heartbeatStreamConfig->messages_denied,
      '#options' => $options,
    );

    // Stream settings.
    $form['settings']['fs_settings'] = array(
      '#type' => 'fieldset',
      '#title' => t('Settings'),
      '#collapsible' => TRUE,
      '#collapsed' => TRUE,
    );

    // Configuration can be simple for some heartbeat requirements and thus exceptions.
    if (in_array($heartbeatStreamConfig->class, array('singleactivity', 'viewsactivity'))) {

      $form['settings']['fs_settings']['stream_path'] = array(
        '#type' => 'textfield',
        '#default_value' => '',
        '#title' => t('Path to the page stream'),
        '#disabled' => TRUE,
      );
      $form['settings']['fs_settings']['stream_profile_path'] = array(
        '#type' => 'textfield',
        '#default_value' => '',
        '#title' => t('Path to the user stream'),
        '#disabled' => TRUE,
      );

    }
    else {

      $form['settings']['fs_settings']['skip_active_user'] = array(
        '#title' => t('Skip the active user'),
        '#type' => 'checkbox',
        '#default_value' => $heartbeatStreamConfig->skip_active_user,
      );
      $form['settings']['fs_settings']['show_message_times'] = array(
        '#title' => t('Show the time of action in message displays'),
        '#type' => 'checkbox',
        '#default_value' => $heartbeatStreamConfig->show_message_times,
      );
      $form['settings']['fs_settings']['show_message_times_grouped'] = array(
        '#title' => t('Show the time of action with messages are grouped together'),
        '#type' => 'checkbox',
        '#default_value' => $heartbeatStreamConfig->show_message_times_grouped,
      );
      $form['settings']['fs_settings']['poll_messages'] = array(
        '#type' => 'select',
        '#options' => array(
          0 => t('No'),
          10 => t('Every 10 seconds'),
          20 => t('Every 20 seconds'),
          30 => t('Every 30 seconds'),
          45 => t('Every 45 seconds'),
          60 => t('Every minute'),
        ),
        '#title' => t('Poll every x seconds for newer messages to prepend the stream.'),
        '#default_value' => $heartbeatStreamConfig->poll_messages,
      );
      $form['settings']['fs_settings']['poll_messages_type'] = array(
        '#type' => 'select',
        '#options' => array(
          0 => t('Automatically prepend the new messages to the stream'),
          1 => t('Prepend new messages to the stream after clicking "X new messages"'),
        ),
        '#title' => t('New messages notification type'),
        '#default_value' => $heartbeatStreamConfig->poll_messages_type,
      );

      $form['settings']['fs_settings']['num_load_max'] = array(
        '#title' => t('Fetch a maximum of logged messages '),
        '#type' => 'textfield',
        '#size' => 20,
        '#description' => t('Heartbeat loads a maximum number of activity messages to keep a final number.
          This number has to be bigger than the number of max items in blocks and pages. This is needed because
          streams can have messages that are denied, grouped or inhibited by permission. In
          order to make sure we have enough messages for display and to keep the performance to a high level, this
          odd way is needed.'),
        '#default_value' => $heartbeatStreamConfig->num_load_max,
      );

      if (!empty($form_state['values']['settings']['grouping_seconds'])) {
        $value = $form_state['values']['settings']['grouping_seconds'];
      }
      elseif (isset($heartbeatStreamConfig->grouping_seconds)) {
        $value = $heartbeatStreamConfig->grouping_seconds;
      }
      else {
        $value = variable_get('heartbeat_activity_grouping_seconds', 7200);
      }
      $form['settings']['fs_settings']['grouping_seconds'] = array(
        '#title' => t('Maximum gap (in seconds)'),
        '#type' => 'select',
        '#options' => array(300 => t('5 minutes'), 600 => t('10 minutes'), 1200 => t('20 minutes'), 1800 => t('30 minutes'), 3600 => t('1 hour'), 7200 => t('2 hours'), 14400 => t('4 hours'), 86400 => t('24 hours')),
        '#default_value' => $value,
        '#description' => t('Maximum gap for the same activity to be grouped together and before an identical activity can be logged again'),
      );

      // Blocks settings.
      $form['settings']['fs_blocks'] = array(
        '#type' => 'fieldset',
        '#title' => t('Blocks'),
        '#collapsible' => TRUE,
        '#collapsed' => TRUE,
      );
      $form['settings']['fs_blocks']['has_block'] = array(
        '#title' => t('Enable block'),
        '#type' => 'checkbox',
        '#default_value' => $heartbeatStreamConfig->has_block,
        '#attributes' => array()
      );
      if ($heartbeatStreamConfig->class == 'singleactivity') {
        $form['settings']['fs_blocks']['has_block']['#attributes'] = array('readlonly' => 'readonly');
      }
      $form['settings']['fs_blocks']['block_items_max'] = array(
        '#title' => t('Maximum items in the @name blocks', array('@name' => $heartbeatStreamConfig->name)),
        '#type' => 'textfield',
        '#size' => 20,
        '#default_value' => $heartbeatStreamConfig->block_items_max,
      );
      $options = array(
        0 => t('No more link'),
        1 => t('Display "full list" link in block display'),
        2 => t('Display an ajax-driven older messages link')
      );
      $form['settings']['fs_blocks']['block_show_pager'] = array(
        '#title' => t('Show "older messages" link in block display'),
        '#type' => 'radios',
        '#options' => $options,
        '#default_value' => $heartbeatStreamConfig->block_show_pager,
      );

      // Get the view modes.
      $entity_info = entity_get_info('heartbeat_activity');
      $view_modes = array('default' => t('Default'));
      foreach ($entity_info['view modes'] as $key => $view_mode) {
        $view_modes[$key] = $view_mode['label'];
      }
      $form['settings']['fs_blocks']['block_view_mode'] = array(
        '#type' => 'select',
        '#title' => t('View mode'),
        '#options' => $view_modes,
        '#default_value' => isset($heartbeatStreamConfig->block_view_mode) ? $heartbeatStreamConfig->block_view_mode : 'default',
      );

      // Page settings.
      $form['settings']['fs_pages'] = array(
        '#type' => 'fieldset',
        '#title' => t('Pages'),
        '#collapsible' => TRUE,
        '#collapsed' => TRUE,
      );
      $form['settings']['fs_pages']['stream_path'] = array(
        '#title' => t('Path to the stream page'),
        '#type' => 'textfield',
        '#default_value' => $cloning ? '' : $heartbeatStreamConfig->stream_path,
        '#description' => t('Leave empty to disable the page.'),
      );
      $form['settings']['fs_pages']['stream_profile_path'] = array(
        '#title' => t('Path to the user profile stream page'),
        '#type' => 'textfield',
        '#default_value' => $cloning ? '' : $heartbeatStreamConfig->stream_profile_path,
        '#description' => t('Leave empty to disable the user page at user/%user/PATH.'),
      );
      $form['settings']['fs_pages']['page_items_max'] = array(
        '#title' => t('Maximum items in the @name pages', array('@name' => $heartbeatStreamConfig->name)),
        '#type' => 'textfield',
        '#size' => 20,
        '#default_value' => $heartbeatStreamConfig->page_items_max,
      );
      $form['settings']['fs_pages']['page_show_pager'] = array(
        '#title' => t('Display "older messages" link in page displays'),
        '#type' => 'checkbox',
        '#default_value' => $heartbeatStreamConfig->page_show_pager,
      );
      $form['settings']['fs_pages']['page_pager_ajax'] = array(
        '#title' => t('Display "older messages" link in page displays with Ajax'),
        '#type' => 'checkbox',
        '#default_value' => $heartbeatStreamConfig->page_pager_ajax,
      );
      $form['settings']['fs_pages']['page_view_mode'] = array(
        '#type' => 'select',
        '#title' => t('View mode'),
        '#options' => $view_modes,
        '#default_value' => isset($heartbeatStreamConfig->page_view_mode) ? $heartbeatStreamConfig->page_view_mode : 'default',
      );
      $form['settings']['fs_pages']['exclude_og'] = array(
        '#type' => 'checkbox',
        '#title' => t('Exclude messages within Organic Group context.'),
        '#description' => t('The same setting exists for blocks and content panes but at instance level.'),
        '#default_value' => isset($heartbeatStreamConfig->exclude_og) ? $heartbeatStreamConfig->exclude_og : 0,
      );
    }

    // Let other contribs save in the variables data.
    $form['variables'] = array(
      '#tree' => TRUE,
    );
  }

  /**
   * Implements edit_form().
   */
  function edit_form(&$form, &$form_state) {
    if ($form_state['form type'] == 'add') {
    	//parent::edit_form($form, $form_state);
    	$this->_add_form($form, $form_state);
    }
    else {
    	parent::edit_form($form, $form_state);
    	$this->_edit_form($form, $form_state);
    }
  }

  /**
   * Implements edit_form_submit().
   */
  function edit_form_validate(&$form, &$form_state) {
  	parent::edit_form_validate($form, $form_state);
  	if (isset($form_state['values']['stream_op']) && $form_state['values']['stream_op'] == 'add_clone') {
  		if (empty($form_state['values']['stream_original'])) {
  			$export_key = $this->plugin['export']['key'];
	      $element = array(
	        '#value' => $form_state['item']->{$export_key},
	        '#parents' => array($export_key),
	      );
	      form_error($element, t('You need to select a stream to clone from.'));
  	  }
  	}
  }

  /**
   * Implements edit_form_submit().
   */
  function edit_form_submit(&$form, &$form_state) {

    if (isset($form_state['values']['stream_op']) && $form_state['values']['stream_op'] == 'add_clone') {
    	$pluginBasePath = ctools_export_ui_plugin_base_path($this->plugin) . '/list/';
    	drupal_goto($pluginBasePath . $form_state['values']['stream_original'] . '/clone');
    }
    else {

	    // First change the values.
	    foreach ($form_state['values']['settings'] as $name => $setting) {
	      if (is_array($setting)) {
	        foreach ($setting as $key => $value) {
	          $form_state['values']['settings'][$key] = $value;
	        }
	        unset($form_state['values']['settings'][$name]);
	      }
	    }

	    heartbeat_stream_config_reset();

	    // Let CTools prepare the "item" variable as normal.
	    parent::edit_form_submit($form, $form_state);

	    drupal_set_message(t('Heartbeat streams cache has been cleared and menu is rebuild.'));

    }
  }

  /**
   * Page callback to delete an exportable item.
   */
  function delete_page($js, $input, $item) {

    $form_state = array(
      'plugin' => $this->plugin,
      'object' => &$this,
      'ajax' => $js,
      'item' => $item,
      'op' => $item->export_type & EXPORT_IN_CODE ? 'revert' : 'delete',
      'rerender' => TRUE,
      'no_redirect' => TRUE,
    );

    $output = drupal_build_form('ctools_export_ui_delete_confirm_form', $form_state);

    if (!empty($form_state['executed'])) {

      // Cleanup the stream config and stream from static caches.
      heartbeat_stream_config_reset($item);

      ctools_export_crud_delete($this->plugin['schema'], $item);

      $message = str_replace('%title', check_plain($item->{$this->plugin['export']['key']}), $this->plugin['strings']['confirmation'][$form_state['op']]['success']);
      drupal_set_message($message);

      // Cleanup the blocks that might be in use.
      db_delete('block')
      ->condition('module', 'heartbeat')
      ->condition('delta', $item->class)
      ->execute();

      drupal_goto(ctools_export_ui_plugin_base_path($this->plugin));

    }

    return $output;
  }

}