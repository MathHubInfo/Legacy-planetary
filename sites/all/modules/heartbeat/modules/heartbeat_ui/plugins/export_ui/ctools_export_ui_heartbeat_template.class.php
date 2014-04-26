<?php

/**
 * @file
 * Ctools export UI for a heartbeat template
 * @author stalski
 *
 */
class ctools_export_ui_heartbeat_template extends ctools_export_ui {

  /**
   * Helper function with element for the settings editing form.
   */
  function _edit_form(&$form, &$form_state) {

    // The template object is filled by ctools export. This means that
    // we don't have an complete object like Heartbeat expects it.
    // E.g. concat_arg[roles] which are stored and filtered by setRoles().
    $template = $form_state['item'];

    $form['general-tab'] = array('#type' => 'vertical_tabs');

    // Add extra css.
    $form['#attached']['css'][] = drupal_get_path('module', 'heartbeat_ui') . '/heartbeat_ui.css';

    // Required form elements.
    $form['hid'] = array(
      '#type' => 'hidden',
      '#default_value' => empty($template->hid) ? 0 : $template->hid,
    );
    $form['general'] = array(
      '#type' => 'fieldset',
      '#title' => t('Definition'),
      '#collapsible' => TRUE,
      '#collapsed' => TRUE,
      '#group' => 'general-tab',
    );
    $form['general']['description'] = array(
      '#type' => 'textarea',
      '#title' => t('Description of the message'),
      '#description' => t('(most of the time you already have an event in mind)'),
      '#cols' => 60,
      '#rows' => 1,
      '#required' => TRUE,
      '#default_value' => empty($template->description) ? '' : t($template->description),
    );

    $form['permissions'] = array(
      '#type' => 'fieldset',
      '#title' => t('Access'),
      '#collapsible' => TRUE,
      '#collapsed' => TRUE,
      '#group' => 'general-tab',
    );
    $form['permissions']['perms'] = array(
      '#type' => 'select',
      '#title' => t('Message display access'),
      '#description' => t('Defines to whom the message is meant for and who is entitled to see the message.'),
      '#options' => _heartbeat_perms_options(),
      '#default_value' => !isset($template->perms) ? HEARTBEAT_PUBLIC_TO_ALL : $template->perms,
    );

    if (!empty($template->concat_args['roles'])) {
      $template->setRoles($template->concat_args['roles']);
    }

    $form['permissions']['roles'] = array(
      '#type' => 'checkboxes',
      '#title' => t('Limit this message with roles'),
      '#description' => t('Select the roles to filter activity. Leaving empty means the messages will always be shown.'),
      '#options' => user_roles(),
      '#default_value' => empty($template->roles) ? array() : $template->roles,
    );

    // Examples with variables
    $form['examples'] = array(
      '#type' => 'fieldset',
      '#title' => t('Examples'),
      '#collapsible' => TRUE,
      '#collapsed' => TRUE,
      '#group' => 'general-tab',
    );
    $form['examples']['tokens']['#type'] = 'markup';
    $form['examples']['tokens']['#markup'] = '<p>'. t('Here are a few examples of usage of variables in heartbeat messages:') .'</p><div>';
    $form['examples']['tokens']['#markup'] .= '<small>'. t('!username has updated !node_title') .' (for a single message)</small><br />';
    $form['examples']['tokens']['#markup'] .= '<small>'. t('!username has added %node_title%') .' (for grouped messages with variable summary)</small><br />';

    // Extended example, specific to friendlist
    if (module_exists('friendlist_api')) {
      $form['examples']['tokens']['#markup'] .= '<small>'. t('!user1 is now !relation_type with !user2') .' (use %user2% if user1 becomes friends with lots of users in last timespan)</small><br />';
    }
    $form['examples']['tokens']['#markup'] .= '</div><p>'. t('Always append your variables with ! or embed the word in %\'s to group several instances of one part of a message.') .'</p>';

    $form['content'] = array(
      '#type' => 'fieldset',
      '#title' => t('Content'),
      '#collapsible' => TRUE,
      '#collapsed' => TRUE,
      '#group' => 'general-tab',
    );

    $form['content']['message'] = array(
      '#type' => 'textarea',
      '#title' => t('Single message'),
      '#cols' => 60,
      '#rows' => 1,
      '#default_value' => empty($template->message) ? '' : $template->message,
      '#description' => t('Message is a special field in the Heartbeat Activity entity. The message is a phrase / sentence that contains variables to be replaced at runtime. Such variables should be prefixed with "!", much like the asis placeholders. You could also leave this field empty if you are working the the normal entity field storage.<br />Note that the actor variable of the message should be <strong>!username</strong>.'),
    );

    $desc = t('Type of message when it comes to grouping messages together.<br />
      <strong>Single</strong> is when you want to repeat messages without merging them together. These messages
      are standalone and they dont take notice on previous and upcoming messages.<br />
      <strong>Count</strong> means you want to merge the messages together so you know the occurrency.
      Only one message in its single format will be displayed.<br />
      A <strong>summary</strong> is when you want to group the same instance of several messages together.
      For this you will summarize a part of the message and use it as substitional variables (with separators) to
    form the merged messages. The occurrency of the message instance is also known as the count.<br />');

    /**
     * The group type of the message. Other form elements will
     * depend on this setting to hide/show.
     */
    $form['content']['group_type'] = array(
      '#id' => 'heartbeat_message_type',
      '#type' => 'select',
      '#title' => t('Type of message'),
      '#description' => $desc,
      '#options' => array(
        'single'  => t('Single: Treat all activity instances as standalone messages'),
        'count'   => t('Count: only add counter variable, merging only identical activity'),
        'summary' => t('Summary: Merge recurrent activity together')
      ),
      '#required' => TRUE,
      '#default_value' => $template->group_type,
    );

    /**
     * Container for the concatenation or group arguments.
     */
    $form['content']['type_summary'] = array(
      '#type' => 'container',
      '#states' => array(
        'visible' => array(
          ':input[name="group_type"]' => array('value' => 'summary'),
        ),
      ),
    );
    $form['content']['type_summary']['message_concat'] = array(
      '#type' => 'textarea',
      '#title' => t('Message to group instances'),
      '#description' => t('You can use "%" to indicate that a variable word needs to be replaced with multiple instances of another variable (target variable). This is used when messages are merged together.<br />! is still available'),
      '#cols' => 60,
      '#rows' => 2,
      '#default_value' => empty($template->message_concat) ? '' : $template->message_concat,
      // Add Prefix to improve UX.
      '#prefix' => '<div class="heartbeat-conf-indent">',
    );

    /**
     *  The concatenation arguments.
     */
    $form['content']['type_summary']['concat_args'] = array(
      '#tree' => TRUE,
      '#type' => 'container',
    );
    $group_by = !empty($template->concat_args['group_by']) ? $template->concat_args['group_by'] : 'none';
    $form['content']['type_summary']['concat_args']['group_by'] = array(
      '#type' => 'select',
      '#options' => array(
        'none' => t('No grouping'),
        'user' => t('Group by user to summarize nodes'),
        'node' => t('Group by node to summarize users'),
        'node-target' => t('Group by target object id to summarize nodes'),
        'user-user' => t('Group by user to summarize users'),
      ),
      '#title' => t('Group by'),
      '#description' => t('<strong>Required for types summary. </strong>Messages with parts that merge together are grouped by user or node.
        E.g. Group by node if you want to summarize users and vice versa.<br />In some cases where the activity uses a relation
        between two users, then set the group by to "user-user". A good example is a friend-relation.'),
      '#required' => FALSE,
      '#default_value' => $group_by,
    );
    $desc = t('<blockquote>
      Grouped message: !username added %images%.
      Single message: !username added an !image and a nice one.
      Then you will group by user and build a summary of images. The grouping variable here is "image".
      </blockquote>');
    $form['content']['type_summary']['concat_args']['group_target'] = array(
      '#type' => 'textfield',
      '#title' => t('Variable to summarize'),
      '#description' => t('If you used a word between %-signs, you have to fill in the variable you want to summarize.') .'<br /> e.g.:'. $desc,
      '#required' => FALSE,
      '#default_value' => empty($template->concat_args['group_target']) ? '' : $template->concat_args['group_target'],
    );
    // The wrapper for special user-user mapping.
    $form['content']['type_summary']['concat_args']['group_by_target'] = array(
      '#type' => 'textfield',
      '#title' => t('The group by variable.'),
      '#description' => t('This is the variable you want to summarize on. Group by parameter indicates your intensions. Note that it can never be the same as the group variable.'),
      '#required' => FALSE,
      '#default_value' => empty($template->concat_args['group_by_target']) ? '' : $template->concat_args['group_by_target'],
    );
    $form['content']['type_summary']['concat_args']['group_num_max'] = array(
      '#title' => 'Maximum number of messages to group',
      '#type' => 'textfield',
      '#size' => 5,
      '#default_value' => empty($template->concat_args['group_num_max']) ? '' : $template->concat_args['group_num_max'],
      '#description' => 'Maximum number of items that can be grouped to create one summarized message.',
    );
    $form['content']['type_summary']['concat_args']['merge_separator'] = array(
      '#type' => 'textfield',
      '#title' => t('Fill in the target separator'),
      '#description' => t('Separators between the targets, like a colon. E.g. "title1<strong>,</strong> title2 and title3"'),
      '#required' => FALSE,
      '#default_value' => empty($template->concat_args['merge_separator']) ? '' : $template->concat_args['merge_separator'],
    );
    $form['content']['type_summary']['concat_args']['merge_end_separator'] = array(
      '#type' => 'textfield',
      '#title' => t('Fill in the target end separator.'),
      '#description' => t('Separators finishing listed targets. E.g. "title1, title2 <strong>and</strong> title3"'),
      '#required' => FALSE,
      '#default_value' => empty($template->concat_args['merge_end_separator']) ? '' : $template->concat_args['merge_end_separator'],
      // Add Suffix to improve UX only.
      '#suffix' => '</div>',
    );

    /**
     *  Add container for other saveable data.
     */
    if (module_exists('heartbeat_plugins')) {
      $form['attachments'] = array(
        '#tree' => TRUE,
        '#type' => 'fieldset',
        '#title' => t('Attachments'),
        '#collapsible' => TRUE,
        '#collapsed' => TRUE,
        '#group' => 'general-tab'
      );
    }
  }

  /**
   * Implements edit_form().
   */
  function edit_form(&$form, &$form_state) {
    parent::edit_form($form, $form_state);
    $this->_edit_form($form, $form_state);
  }

  /**
   * Implements edit_form_submit().
   */
  function edit_form_submit(&$form, &$form_state) {

    // Reformat the variables, attachments and concat args to fit the storage.
    $form_state['values']['variables'] = HeartbeatMessageTemplate::getVariablesFromMessage($form_state['values']['message'], $form_state['values']['message_concat']);
    $form_state['values']['attachments'] = empty($form_state['values']['attachments']) ? array() : $form_state['values']['attachments'];
    $form_state['values']['concat_args']['roles'] = $form_state['values']['roles'];

    $form_state['item']->message_id = $form_state['values']['message_id'];
	  field_attach_presave('heartbeat_activity', $form_state['item']);
	  module_invoke_all('entity_presave', $form_state['item'], 'heartbeat_activity');

    // Let CTools prepare the "item" variable as normal.
    parent::edit_form_submit($form, $form_state);
    // Main task it's doing:
    // $form_state['item']->{$key} = $form_state['values'][$key];

    drupal_set_message(t('Heartbeat streams cache has been cleared and menu is rebuild.'));

  }

  /**
   * Called to save the final product from the edit form.
   */
  function edit_save_form($form_state) {
  	parent::edit_save_form($form_state);

  	// Entity bundle has been saved.
    $op = $form_state['form type'] == 'add' ? 'insert' : 'update';
    field_attach_insert('heartbeat_activity', $form_state['item']);
    module_invoke_all("entity_$op", $form_state['item'], 'heartbeat_activity');

    field_info_cache_clear();
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
      ctools_export_crud_delete($this->plugin['schema'], $item);
      $export_key = $this->plugin['export']['key'];
      $message = str_replace('%title', check_plain($item->{$export_key}), $this->plugin['strings']['confirmation'][$form_state['op']]['success']);
      drupal_set_message($message);

      // Perform a deletion of the activity for this template.
      if (!($item->export_type & EXPORT_IN_CODE)) {
        db_delete('heartbeat_activity')->condition('message_id', $item->message_id)->execute();
      }

      drupal_goto(ctools_export_ui_plugin_base_path($this->plugin));
    }

    return $output;
  }

}