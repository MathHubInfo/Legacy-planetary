<?php

/**
 * @file
 * Administration pages for widget settings.
 */

/**
 * Menu callback; Listing of all current widget sets.
 */
function widgets_set_list() {
  $page = array();

  $sets = widgets_sets();
  $page['widgets_set_list'] = array(
    '#markup' => theme('widgets_set_list', array('sets' => $sets)),
    '#attached' => array(
      'css' => array(drupal_get_path('module', 'widgets') . '/widgets.admin.css' => array()),
    ),
  );

  return $page;
}

/**
 * Form builder; Edit an widget set name and elements order.
 *
 * @param $form_state
 *   An associative array containing the current state of the form.
 * @param $set
 *   An widget set array.
 * @ingroup forms
 * @see widgets_set_form_submit()
 * @see widgets_set_name_validate()
 */
function widgets_set_form($form, &$form_state, $set) {
//dsm($set);
  // if destination is set, save it in session so widget element add works correctly
  /*
  if ($_GET['destination']) {
    $_SESSION['widgets']['set_form']['destination'] = $_GET['destination'];
    $query = str_replace('destination=', 'd', $_SERVER['QUERY_STRING']);
    //drupal_goto(request_path() . '?' . $query);
  }
  else {
    unset($_SESSION['widgets']['set_form']['destination']);
  }
  */

  $title = t('Edit %name set', array('%name' => $set['name']));
  drupal_set_title($title, PASS_THROUGH);

  // Adjust this form for sets that must be overridden to edit.
  $editable = (bool) ($set['storage'] & WIDGETS_STORAGE_EDITABLE);

  if (!$editable && empty($form_state['input'])) {
    drupal_set_message(t('This widget set is currently being provided by a module. Click the "Override defaults" button to change its settings.'), 'warning');
  }

  $form_state['widgets_set'] = $set;
  $form['#tree'] = TRUE;
  $form['#attached']['css'][drupal_get_path('module', 'widgets') . '/widgets.admin.css'] = array();

  // Show the thumbnail preview.
  $form['preview'] = array(
    '#type' => 'item',
    '#title' => t('Preview'),
    '#markup' => theme('widgets_set_view', array('set' => $set)),
  );

  // Allow the name of the set to be changed, unless this set is
  // provided by a module's hook_default_widgets_sets().
  if ($set['storage'] & WIDGETS_STORAGE_MODULE) {
    $form['name'] = array(
      '#type' => 'item',
      '#title' => t('Widget set name'),
      '#markup' => $set['name'],
      '#description' => t('This widget set is being provided by %module module and may not be renamed.', array('%module' => $set['module'])),
    );
  }
  else {
    $form['name'] = array(
      '#type' => 'textfield',
      '#size' => '64',
      '#title' => t('Widget set name'),
      '#default_value' => $set['name'],
      '#description' => t('The name is used as the identifier for generating the widget set. Use only lowercase alphanumeric characters, underscores (_), and hyphens (-).'),
      '#element_validate' => array('widgets_set_name_validate'),
      '#required' => TRUE,
    );
  }
  
  // Build the list of existing widget elements for this widget set.
  $form['elements'] = array(
    '#theme' => 'widgets_set_elements',
  );
  foreach ($set['elements'] as $key => $element) {
    $form['elements'][$key]['#weight'] = isset($form_state['input']['elements']) ? $form_state['input']['elements'][$key]['weight'] : NULL;
    $form['elements'][$key]['label'] = array(
      '#markup' => $element['label'],
    );
    $form['elements'][$key]['summary'] = array(
      '#markup' => isset($element['summary theme']) ? theme($element['summary theme'], array('data' => $element['data'])) : '',
    );
    $form['elements'][$key]['weight'] = array(
      '#type' => 'weight',
      '#title' => t('Weight for @title', array('@title' => $element['label'])),
      '#title_display' => 'invisible',
      '#default_value' => $element['weight'],
      '#access' => $editable,
    );

    // Only attempt to display these fields for editable sets as the 'weid'
    // key is not set for sets defined in code.
    if ($editable) {
      $form['elements'][$key]['configure'] = array(
        '#type' => 'link',
        '#title' => t('edit'),
        '#href' => 'admin/structure/widgets/sets/edit/' . $set['name'] . '/elements/' . $element['weid'],
        '#access' => $editable && isset($element['form callback']),
      );
      $form['elements'][$key]['remove'] = array(
        '#type' => 'link',
        '#title' => t('delete'),
        '#href' => 'admin/structure/widgets/sets/edit/' . $set['name'] . '/elements/' . $element['weid'] . '/delete',
        '#access' => $editable,
      );
    }
  }

  // Build the new widget element addition form and add it to the element list.
  $new_element_options = array();
  foreach (widgets_element_definitions() as $element => $definition) {
    if (isset($definition['group'])) {
      $new_element_options[$definition['group']][$element] = $definition['label'];
    }
    else {
      $new_element_options['Other'][$element] = $element;
    }
  }

  /*
  foreach (widgets_element_definitions() as $element => $definition) {
    $new_element_options[$element] = check_plain($definition['label']);
  }
  */
  $form['elements']['new'] = array(
    '#tree' => FALSE,
    '#weight' => isset($form_state['input']['weight']) ? $form_state['input']['weight'] : NULL,
    '#access' => $editable,
  );
  $form['elements']['new']['new'] = array(
    '#type' => 'select',
    '#title' => t('Element'),
    '#title_display' => 'invisible',
    '#options' => $new_element_options,
    '#empty_option' => t('Select a new element'),
  );
  $form['elements']['new']['weight'] = array(
    '#type' => 'weight',
    '#title' => t('Weight for new element'),
    '#title_display' => 'invisible',
    '#default_value' => count($form['elements']) - 1,
  );
  $form['elements']['new']['add'] = array(
    '#type' => 'submit',
    '#value' => t('Add'),
    '#validate' => array('widgets_set_form_add_validate'),
    '#submit' => array('widgets_set_form_submit', 'widgets_set_form_add_submit'),
  );
  
  // add data form elements
  if (!isset($set['data'])) {
    $set['data'] = array();
  }
  $form['data'] = widgets_set_form_data_fields($set['data'], $set, $editable);
  if (isset($set['form callback']) && function_exists($set['form callback'])) {
    $fields = call_user_func($set['form callback'], $set['data'], $editable);
    if (is_array($fields)) {
      $form['data'] = array_merge($form['data'], $fields);
    }    
  }
  drupal_alter('widgets_set_form', $form['data'], $set);

  // Show the Override or Submit button for this set.
  $form['actions'] = array('#type' => 'actions');
  $form['actions']['override'] = array(
    '#type' => 'submit',
    '#value' => t('Override defaults'),
    '#validate' => array(),
    '#submit' => array('widgets_set_form_override_submit'),
    '#access' => !$editable,
  );
  $form['actions']['submit'] = array(
    '#type' => 'submit',
    '#value' => t('Update set'),
    '#access' => $editable,
  );

  return $form;
}

function widgets_set_form_data_fields($data, $set, $editable) {
  $form = array();
  $options = array(
    '' => t('None'),
    'plain-linebreaks' => t('Plain with linebreaks'),
    'verticle' => t('Verticle'),
    'horizontal' => t('Horizontal'),
  );
  if ($editable) {
    $form['style'] = array(
      '#type' => 'select',
      '#title' => t('Style'),
      '#default_value' => (isset($data['style']) && $data['style']) ? $data['style'] : '',
      //'#description' => t('The name is used in URLs for generated widgets. Use only lowercase alphanumeric characters, underscores (_), and hyphens (-).'),
      '#options' => $options,
    );
  }
  else {
    $form['style'] = array(
      '#type' => 'item',
      '#title' => t('Style'),
      '#markup' => $options[(isset($set['style']) && $set['style']) ? $set['style'] : ''],
    );    
  }

  $form['visibility'] = array(
    '#type' => 'fieldset',
    '#title' => t('Visibility'),
    '#collapsible' => TRUE,
    '#collapsed' => TRUE,
  ); 
  
  $form['visibility']['token'] = array(
    '#type' => 'checkbox',
    '#title' => t('Token'),
    '#description' => t('Create a token to display this widget.'),
    '#default_value' => isset($data['visibility']['token']) ? $data['visibility']['token'] : 1,
  );
  
  $form['visibility']['block'] = array(
    '#type' => 'checkbox',
    '#title' => t('Block'),
    '#description' => t('Enable widget to be displayed as a block.'),
    '#default_value' => isset($data['visibility']['block']) ? $data['visibility']['block'] : 1,
  );
  
  if (!$editable) {
    $form['visibility']['token']['#type'] = 'item';
    $form['visibility']['token']['#markup'] = isset($data['visibility']['token']) && !$data['visibility']['token'] ? 'No' : 'Yes';
    $form['visibility']['block']['#type'] = 'item';
    $form['visibility']['block']['#markup'] = isset($data['visibility']['block']) && !$data['visibility']['block'] ? 'No' : 'Yes';
  }
  
  $types = node_type_get_types();

  $form['visibility']['content_types'] = array(
    '#type' => 'fieldset',
    '#title' => t('Content types'),
    '#description' => t('Check the below boxes to display widgets in node links by content types.'),
    '#collapsible' => TRUE,
    '#collapsed' => TRUE,
  );
  $options = array(
    'links_full' => 'Full content',  
    'links_teaser' => 'Teaser',   
  );
  foreach ($types AS $typename => $type) {
    $form['visibility']['content_types'][$typename] = array(
      '#type' => 'checkboxes',
      '#title' => $type->name,
      '#options' => $options,
      '#default_value' => isset($data['visibility']['content_types'][$typename]) ? $data['visibility']['content_types'][$typename] : array(),
    ); 
    if (!$editable) {
      $form['visibility']['content_types'][$typename]['#type'] = 'item';
      $form['visibility']['content_types'][$typename]['#markup'] = ((isset($data['visibility']['content_types'][$typename])) && count($data['visibility']['content_types'][$typename])) ? implode(', ', $data['visibility']['content_types'][$typename]) : 'No';
    }  
  }
  
  $form['cache'] = array(
    '#type' => 'fieldset',
    '#title' => t('Cache'),
    '#collapsible' => TRUE,
    '#collapsed' => TRUE,
  );

  $options = array(
    '' => t('Don\'t cache'),
    'site' => t('Cache site wide'),
    'author' => t('Cache by node author and user page account'),
    'page' => t('Cache by page'),    
    'user' => t('Cache by logged in user'),
  );
  $default = (isset($scope['cache']['scope'])) ? $scope['cache']['scope'] : '';
  $form['cache']['scope'] = array(
    '#type' => 'radios',
    '#title' => t('Scope'),
    '#description' => t('Caching improves the speed widget sets are loaded. Cache scope should be based on the scope of the tokens used by the widget elements. Use <em>Cache site wide</em> unless your widget elements have tokens that are page, author or user specific.'),
    '#options' => $options,
    '#default_value' => isset($data['cache']['scope']) ? $data['cache']['scope'] : $default,
  );
  // save existing scope to flush if changed
  $cid0 = '';
  if (isset($set['data']['cache']['scope'])) {
    $cid0 = widgets_build_cache_cid($set['name'], $set['data']['cache']['scope']);
  }
  $form['cache']['cid0'] = array(
    '#type' => 'value',
    '#value' => $cid0,
  ); 
  
//dsm($set);
  $vars = array(
    'set' => $set,
    'process_tokens' => FALSE,
  );
  $text = theme_widgets_set_view($vars);
  $tokens = token_scan($text);
  $form['tokens'] = array(
    '#type' => 'fieldset',
    '#title' => t('Tokens'),
    '#collapsible' => TRUE,
    '#collapsed' => TRUE,
  );
  if (!is_array($tokens) || (count($tokens) == 0)) {
    $form['tokens']['tokens'] = array(
      '#markup' => t('This widget set does not contain any tokens.'),
    );
  }
  else {
    $items = array();
    $count = 0;
    foreach ($tokens AS $key => $type) {
      if (is_array($type)) {
        foreach ($type AS $k => $token) {
          $items[] = $token;
          $count++;
        }
      }
    }
    $form['tokens']['tokens_list'] = array(
      '#markup' => t('This widget set contains the following !count tokens:', array('!count' => $count)) . theme('item_list', array('items' => $items)),
    );
    $form['tokens']['tokens'] = array(
      '#type' => 'value',
      '#value' => $items,
    );
  }
  
  return $form;
}

/**
 * Validate handler for adding a new widget element to an widget set.
 */
function widgets_set_form_add_validate($form, &$form_state) {
  if (!$form_state['values']['new']) {
    form_error($form['elements']['new']['new'], t('Select an element to add.'));
  }
}

/**
 * Submit handler for adding a new widget element to an widget set.
 */
function widgets_set_form_add_submit($form, &$form_state) {
  $set = $form_state['widgets_set'];
  // Check if this field has any configuration options.
  $element = widgets_element_definition_load($form_state['values']['new']);

  // Load the configuration form for this option.
  if (isset($element['form callback'])) {
    $path = 'admin/structure/widgets/sets/edit/' . $form_state['widgets_set']['name'] . '/add/' . $form_state['values']['new'];
    $form_state['redirect'] = array($path, array('query' => array('weight' => $form_state['values']['weight'])));
  }
  // If there's no form, immediately add the widget element.
  else {
    $element['wsid'] = $set['wsid'];
    $element['weight'] = $form_state['values']['weight'];
    widgets_element_save($element);
    drupal_set_message(t('The widget element was successfully added.'));
  }
  // clear caches
  $scope = isset($set['data']['cache']['scope']) ? $set['data']['cache']['scope'] : '';
  $cid = widgets_build_cache_cid($set['name'], $scope);
  widgets_clear_widgets_cache($cid);
}

/**
 * Submit handler for overriding a module-defined set.
 */
function widgets_set_form_override_submit($form, &$form_state) {
  drupal_set_message(t('The %set set has been overridden, allowing you to change its settings.', array('%set' => $form_state['widgets_set']['name'])));
  widgets_default_set_save($form_state['widgets_set']);
}

/**
 * Submit handler for saving an widget set.
 */
function widgets_set_form_submit($form, &$form_state) {
  // Update the widget set name if it has changed.
  $set = $form_state['widgets_set'];
  if (isset($form_state['values']['name']) && $set['name'] != $form_state['values']['name']) {
    $set['name'] = $form_state['values']['name'];
  }

  // Update widget element weights.
  if (!empty($form_state['values']['elements'])) {
    foreach ($form_state['values']['elements'] as $wid => $element_data) {
      if (isset($set['elements'][$wid])) {
        $element = $set['elements'][$wid];
        $element['weight'] = $element_data['weight'];
        widgets_element_save($element);
      }
    }
  }
  
  $set['data'] = $form_state['values']['data'];
  //drupal_alter('widgets_set', $set, 'widgets_set_form');
  widgets_set_save($set);
  if ($form_state['values']['op'] == t('Update set')) {
    drupal_set_message(t('Changes to the set have been saved.'));
  }
  
   widgets_clear_widgets_cache($set['data']['cache']['cid0']);
  
  $form_state['redirect'] = 'admin/structure/widgets/sets/edit/' . $set['name'];
}

/**
 * Form builder; Form for adding a new widget set.
 *
 * @ingroup forms
 * @see widgets_set_add_form_submit()
 * @see widgets_set_name_validate()
 */
function widgets_set_add_form($form, &$form_state) {
  $form['name'] = array(
    '#type' => 'textfield',
    '#size' => '30',
    '#title' => t('Set name'),
    '#default_value' => '',
    '#description' => t('The name is used to identify the widget set in blocks, tokens and other displays. Use only lowercase alphanumeric characters, underscores (_), and hyphens (-).'),
    '#element_validate' => array('widgets_set_name_validate'),
    '#required' => TRUE,
  );

  $form['submit'] = array(
    '#type' => 'submit',
    '#value' => t('Create new set'),
  );

  return $form;
}

/**
 * Submit handler for adding a new widget set.
 */
function widgets_set_add_form_submit($form, &$form_state) {
  $set = array('name' => $form_state['values']['name']);
  $set = widgets_set_save($set);
  drupal_set_message(t('Set %name was created.', array('%name' => $set['name'])));
  $form_state['redirect'] = 'admin/structure/widgets/sets/edit/' . $set['name'];
}

/**
 * Element validate function to ensure unique, URL safe set names.
 */
function widgets_set_name_validate($element, $form_state) {
  // Check for duplicates.
  $sets = widgets_sets();
  if (isset($sets[$element['#value']]) && (!isset($form_state['widgets_set']['wsid']) || $sets[$element['#value']]['wsid'] != $form_state['widgets_set']['wsid'])) {
    form_set_error($element['#name'], t('The widget set name %name is already in use.', array('%name' => $element['#value'])));
  }

  // Check for illegal characters in widget set names.
  if (preg_match('/[^0-9a-z_\-]/', $element['#value'])) {
    form_set_error($element['#name'], t('Please only use lowercase alphanumeric characters, underscores (_), and hyphens (-) for set names.'));
  }
}

/**
 * Form builder; Form for deleting an widget set.
 *
 * @param $set
 *   An widget set array.
 *
 * @ingroup forms
 * @see widgets_set_delete_form_submit()
 */
function widgets_set_delete_form($form, $form_state, $set) {
  $form_state['widgets_set'] = $set;

  $replacement_sets = array_diff_key(widgets_set_options(), array($set['name'] => ''));
  $form['replacement'] = array(
    '#title' => t('Replacement set'),
    '#type' => 'select',
    '#options' => $replacement_sets,
    '#empty_option' => t('No replacement, just delete'),
  );

  return confirm_form(
    $form,
    t('Optionally select a set before deleting %set', array('%set' => $set['name'])),
    'admin/structure/widgets/sets',
    t('If this set is in use on the site, you may select another set to replace it.'),
    t('Delete'),  t('Cancel')
  );
}

/**
 * Submit handler to delete an widget set.
 */
function widgets_set_delete_form_submit($form, &$form_state) {
  $set = $form_state['widgets_set'];

  widgets_set_delete($set, $form_state['values']['replacement']);
  drupal_set_message(t('Set %name was deleted.', array('%name' => $set['name'])));
  $form_state['redirect'] = 'admin/structure/widgets/sets';
}

/**
 * Confirmation form to revert a database set to its default.
 */
function widgets_set_revert_form($form, $form_state, $set) {
  $form_state['widgets_set'] = $set;

  return confirm_form(
    $form,
    t('Revert the %set set?', array('%set' => $set['name'])),
    'admin/structure/widgets/sets',
    t('Reverting this set will delete the customized settings and restore the defaults provided by the @module module.', array('@module' => $set['module'])),
    t('Revert'),  t('Cancel')
  );
}

/**
 * Submit handler to convert an overridden set to its default.
 */
function widgets_set_revert_form_submit($form, &$form_state) {
  drupal_set_message(t('The %set set has been revert to its defaults.', array('%set' => $form_state['widgets_set']['name'])));
  widgets_default_set_revert($form_state['widgets_set']);
  $form_state['redirect'] = 'admin/structure/widgets/sets';
}

function widgets_set_export_form($form, &$form_state, $set) {
  $form = array();

  // TODO add widget set data support
  $str = "\$sets['" . $set['name'] . "'] = array(\n";
  $str .= "  'elements' => array(\n";
  $i = 1;
  foreach ($set['elements'] AS $weid => $element) {
    $str .= "    array(\n";
    $str .= "      'name' => '" . $element['name'] . "',\n";
    $str .= "      'weight' => " . $i . ",\n";
    $str .= "      'data' => array(\n";
    if (is_array($element['data'])) {
      foreach ($element['data'] AS $key => $value) {
        if (is_array($value)) {
          $str .= "        '" . $key . "' => array(\n";
          foreach ($value AS $key2 => $value2) {
            if ($value2) {
              $str .= "          '" . $key2 . "' => '" . $value2 . "',\n"; 
            }
          }
          $str .= "        ),\n";
        }
        elseif ($value) {
          $str .= "        '" . $key . "' => '" . $value . "',\n";  
        }
      }
    }
    $str .= "      ),\n";
    $str .= "    ),\n";
    $i++;
  }  
  $str .= "  ),\n";
  $str .= ");";

  $form['export'] = array(
    '#type' => 'textarea',
    '#title' => t('code'),
    '#rows' => 25,
    '#default_value' => $str, 
  );
  return $form;
}

/**
 * Form builder; Form for adding and editing widget elements.
 *
 * This form is used universally for editing all widget elements. Each element adds
 * its own custom section to the form by calling the form function specified in
 * hook_widgets_elements().
 *
 * @param $form_state
 *   An associative array containing the current state of the form.
 * @param $set
 *   An widget set array.
 * @param $element
 *   An widget element array.
 *
 * @ingroup forms
 * @see hook_widgets_elements()
 * @see widgets_elements()
 * @see widgets_resize_form()
 * @see widgets_scale_form()
 * @see widgets_rotate_form()
 * @see widgets_crop_form()
 * @see widgets_element_form_submit()
 */
function widgets_element_form($form, &$form_state, $set, $element) {
  if (!empty($element['data'])) {
    $title = t('Edit %label element', array('%label' => $element['label']));
  }
  else{
    $title = t('Add %label element', array('%label' => $element['label']));
    $element['data'] = array();
  }
  drupal_set_title($title, PASS_THROUGH);

  $form_state['widgets_set'] = $set;
  $form_state['widgets_element'] = $element;

  // If no configuration for this widget element, return to the widget set page.
  if (!isset($element['form callback'])) {
    drupal_goto('admin/structure/widgets/sets/edit/' . $set['name']);
  }

  $form['#tree'] = TRUE;
  $form['#attached']['css'][drupal_get_path('module', 'widgets') . '/widgets.admin.css'] = array();
  if (function_exists($element['form callback'])) {
    $form['data'] = call_user_func($element['form callback'], $element['data']);
    drupal_alter('widgets_element_form', $form['data'], $set, $element);
  }

  // Check the URL for a weight, then the widget element, otherwise use default.
  $form['weight'] = array(
    '#type' => 'hidden',
    '#value' => isset($_GET['weight']) ? intval($_GET['weight']) : (isset($element['weight']) ? $element['weight'] : count($set['elements'])),
  );

  $form['actions'] = array('#tree' => FALSE, '#type' => 'actions');
  $form['actions']['submit'] = array(
    '#type' => 'submit',
    '#value' => isset($element['weid']) ? t('Update element') : t('Add element'),
  );
  $form['actions']['cancel'] = array(
    '#type' => 'link',
    '#title' => t('Cancel'),
    '#href' => 'admin/structure/widgets/sets/edit/' . $set['name'],
  );
  
  return $form;
}

/**
 * Submit handler for updating an widget element.
 */
function widgets_element_form_submit($form, &$form_state) {
  $set = $form_state['widgets_set'];
  $element = array_merge($form_state['widgets_element'], $form_state['values']);
  $element['wsid'] = $set['wsid'];
  widgets_element_save($element);
  drupal_set_message(t('The widget element was successfully configured.'));
  $form_state['redirect'] = 'admin/structure/widgets/sets/edit/' . $set['name'];
}

/**
 * Form builder; Form for deleting an widget element.
 *
 * @param $set
 *   Name of the widget set from which the widget element will be removed.
 * @param $element
 *   Name of the widget element to remove.
 * @ingroup forms
 * @see widgets_element_delete_form_submit()
 */
function widgets_element_delete_form($form, &$form_state, $set, $element) {
  $form_state['widgets_set'] = $set;
  $form_state['widgets_element'] = $element;

  $question = t('Are you sure you want to delete the @element element from the %set set?', array('%set' => $set['name'], '@element' => $element['label']));
  return confirm_form($form, $question, 'admin/structure/widgets/sets/edit/' . $set['name'], '', t('Delete'));
}

/**
 * Submit handler to delete an widget element.
 */
function widgets_element_delete_form_submit($form, &$form_state) {
  $set = $form_state['widgets_set'];
  $element = $form_state['widgets_element'];

  widgets_element_delete($element);
  
  $scope = isset($set['data']['cache']['scope']) ? $set['data']['cache']['scope'] : '';
  $cid = widgets_build_cache_cid($set['name'], $scope);
  
  drupal_set_message(t('The widget element %name has been deleted.', array('%name' => $element['label'])));
  $form_state['redirect'] = 'admin/structure/widgets/sets/edit/' . $set['name'];
}

/**
 * Element validate handler to ensure an integer pixel value.
 *
 * The property #allow_negative = TRUE may be set to allow negative integers.
 */
function widgets_element_integer_validate($element, &$form_state) {
  $value = empty($element['#allow_negative']) ? $element['#value'] : preg_replace('/^-/', '', $element['#value']);
  if ($element['#value'] != '' && (!is_numeric($value) || intval($value) <= 0)) {
    if (empty($element['#allow_negative'])) {
      form_error($element, t('!name must be an integer.', array('!name' => $element['#title'])));
    }
    else {
      form_error($element, t('!name must be a positive integer.', array('!name' => $element['#title'])));
    }
  }
}

/**
 * Element validate handler to ensure a hexadecimal color value.
 */
function widgets_element_color_validate($element, &$form_state) {
  if ($element['#value'] != '') {
    $hex_value = preg_replace('/^#/', '', $element['#value']);
    if (!preg_match('/^#[0-9A-F]{3}([0-9A-F]{3})?$/', $element['#value'])) {
      form_error($element, t('!name must be a hexadecimal color value.', array('!name' => $element['#title'])));
    }
  }
}

/**
 * Element validate handler to ensure that either a height or a width is
 * specified.
 */
function widgets_element_scale_validate($element, &$form_state) {
  if (empty($element['width']['#value']) && empty($element['height']['#value'])) {
    form_error($element, t('Width and height can not both be blank.'));
  }
}

/**
 * Form structure for the template auto form.
 *
 * Note that this is not a complete form, it only contains the portion of the
 * form for configuring the resize options. Therefore it does not not need to
 * include metadata about the element, nor a submit button.
 *
 * @param $data
 *   The current configuration for this resize element.
 */
function widgets_template_auto_form($data, $element = NULL) {
//dsm($data);  

  $form = array();
  if (!isset($element)) {
    $element = widgets_element_load_by_admin_path();
  }
//dsm($element);
  if (isset($element['data']) && count($element['data'])) {
    $data = $element['data'];
  }

  $fields = widgets_field_scan($element['template']);
  if (is_array($fields)) {
    foreach ($fields AS $key => $values) {       
      $keys = explode(':', $key);
       if (count($keys) > 0) {
          $key = $keys[count($keys) - 1];
       }
       $default = '';
       if (count($keys) == 1) {
          $default = isset($data[$keys[0]]) ? $data[$keys[0]] : '';
       }
       elseif (count($keys) == 2) {
          $default = isset($data[$keys[0]][$keys[1]]) ? $data[$keys[0]][$keys[1]] : '';
       }
       $field = array(
        '#type' => 'textfield',
        '#title' => t(ucfirst(str_replace(array('_', '-'), ' ', $key))),  // PVE 7/2/12 translations
        '#default_value' => $default,
        '#template_default_value' => $values['default'],
        '#description' => t('Leave blank to use default %default.',
          array(
            '%default' => $values['default'],
          )
        ),              
      );
      if (isset($values['pre']) || isset($values['post'])) {
        if (isset($values['pre'])) {
          $field['#replace_pre'] = $values['pre'];
        }
        if (isset($values['post'])) {
          $field['#replace_post'] = $values['post'];
        }
        $field['#description'] .= ' ' . t('Use &lt;none&gt; to remove setting.');
      }
      if (count($keys) == 1) {
        $form[$key] = $field;
      }
      else {
        if (!isset($form[$keys[0]])) {
          $form[$keys[0]] = array(
            '#type' => 'fieldset',
            '#title' => ucfirst(str_replace(array('_', '-'), ' ', $keys[0])),
            '#collapsible' => TRUE,
            '#collapsed' => FALSE,
          ); 
        }
        $form[$keys[0]][$key] = $field;
      }
    }
  }

  return $form;
}

/**
 * Form structure for the template custom text form.
 *
 * Note that this is not a complete form, it only contains the portion of the
 * form for configuring the resize options. Therefore it does not not need to
 * include metadata about the element, nor a submit button.
 *
 * @param $data
 *   The current configuration for this resize element.
 */
function widgets_template_custom_markup_form($data) {
  $form['text'] = array(
    '#type' => 'textarea',
    '#title' => t('Text'),
    '#default_value' => isset($data['text']) ? $data['text'] : '',
    '#required' => TRUE,
  );
  return $form;
}

/**
 * Menu callback; Listing of all current widget definitions.
 */
function widgets_definition_list() {
  $page = array();

  $definitions = widgets_element_definitions();
  $page['widgets_definition_list'] = array(
    '#markup' => theme('widgets_definition_list', array('definitions' => $definitions)),
    '#attached' => array(
      'css' => array(drupal_get_path('module', 'widgets') . '/widgets.admin.css' => array(), array('attributes' => array('target' => '_blank'))),
    ),
  );

  return $page;
}

function widgets_definition_template_syntax() {
  $str = t('Tokens can be used. For a list of available tokens, !token_link.',
    array(
      '!token_link' => l(t('see the token list'), 'admin/help/token'),
    ));
  $str .= ' ' . t('To add variables that adminitrators can change using the widget edit form, use the syntax <code>[?variable name=default value?]</code>.');
  $str .= ' ' . t('Variable names are used as the field lables in the widget edit form and can contain spaces. They can be grouped into fieldsets using the syntax <code>fieldset:variable name</code>.');
  $str .= ' ' . t('Default values can be tokens or literals. Spaces are permitted in default values.');
  $str .= t('For more detailed help on building widget definitions, !link.',
    array(
      '!link' => l(t('see this blog post'), 'http://www.leveltendesign.com/blog/tom/building-custom-widgets', array('attributes' => array('target' => '_blank'))),
    ));
  return $str;
}

/**
 * Form builder; Form for adding a new widget set.
 *
 * @ingroup forms
 * @see widgets_set_add_form_submit()
 * @see widgets_set_name_validate()
 */
function widgets_definition_edit_form($form, &$form_state, $definition = NULL, $add = FALSE) {
  $operation = ($add) ? 'add' : 'edit';
  if (isset($definition)) {
    // check if clone operation
    if ($add) {
      $operation = 'clone';
      $definition = widgets_element_definition_load($definition);
      $name = $definition['name'] . '-custom'; 
      // check name is unique
      $i = 1;
      while (widgets_element_definition_load($name)) {
        $name = $definition['name'] . '-custom' . '-' . $i;
        $i++;
      }
      $definition['name'] = $name;
    }
    $title = t('Edit %name definition', array('%name' => $definition['name']));
    drupal_set_title($title, PASS_THROUGH);
  }
  $form['operation'] = array(
    '#type' => 'value',
    '#value' => $operation,
  );
  
  $form['#tree'] = TRUE;
  $form['name'] = array(
    '#type' => 'textfield',
    '#title' => t('Definition name'),
    '#default_value' => isset($definition['name']) ? $definition['name']: '',
    '#description' => t('The name is used to identify the widget set in blocks, tokens and other displays. Use only lowercase alphanumeric characters, underscores (_), and hyphens (-).'),
    '#element_validate' => array('widgets_set_name_validate'),
    '#required' => TRUE,
  );
  
  $form['template'] = array(
    '#type' => 'textarea',
    '#title' => t('Template'),
    '#default_value' => isset($definition['template']) ? $definition['template']: '',
    '#description' => t('Enter the markup code for the widget.') . ' ' . widgets_definition_template_syntax(),
    '#required' => TRUE,
  );
  
  if (module_exists('token') && FALSE) {
    $form['tokens'] = array(
      '#type' => 'item',
      '#title' => t('Available tokens'),
      '#markup' => theme('token_tree', array('token_types' => 'all', 'click_insert' => FALSE, 'show_restricted' => TRUE)),
    );    
  }
  
  $form['advanced'] = array(
    '#type' => 'fieldset',
    '#title' => t('Advanced'),
    '#collapsible' => TRUE,
    '#collapsed' => TRUE,
  ); 
  $form['advanced']['add_js'] = array(
    '#type' => 'fieldset',
    '#title' => t('Add JavaScript'),
    '#collapsible' => FALSE,
    '#collapsed' => FALSE,
    '#description' => t('Some widgets required JavaScript in addition to the standard template code. You can add additional JavaScript code using the below inputs. By default JavaScript added here will be unique per widget set. This is particularly useful if you have a set of widgets that enabled by a single JavaScript.'),

  );
  $form['advanced']['add_js']['data'] = array(
    '#type' => 'textarea',
    '#rows' => 3,
    '#title' => t('JavaScript'),
    '#default_value' => isset($definition['add_js']['data']) ? $definition['add_js']['data']: '',
    '#description' => t('Enter any JavaScript you want added with this widget.') . ' ',
  );
  $options = array(
    'set_pre' => 'Before the widget set',
    'set_post' => 'After the widget set',
    'header' => 'In the page header',
    'footer' => 'In the page footer',
  );
  $form['advanced']['add_js']['options']['scope'] = array(
    '#type' => 'select',
    '#title' => t('Scope'),
    '#options' => $options,
    '#default_value' => isset($definition['add_js']['options']['scope']) ? $definition['add_js']['options']['scope']: '',
    '#description' => t('Select where you want the JavaScript added.') . ' ',
  );

  if (isset($definition)) {
    $form['submit'] = array(
      '#type' => 'submit',
      '#value' => t('Update definition'),
    );     
  }
  else {
    $form['submit'] = array(
      '#type' => 'submit',
      '#value' => t('Create new definition'),
    );    
  }

  return $form;
}

function widgets_definition_edit_form_validate($form, &$form_state) {
  if (($form_state['values']['operation'] == 'clone') || ($form_state['values']['operation'] == 'clone')) {
    if (widgets_element_definition_load($form_state['values']['name'])) {
      form_set_error('name', t('A widget definition %name already exists. Please select a unique name.', array('%name' => $form_state['values']['name'])));
    }
  }
}

/**
 * Submit handler for adding a new widget set.
 */
function widgets_definition_edit_form_submit($form, &$form_state) {
  $values = $form_state['values'];
  $definition = array(
    'name' => $values['name'],
    'label' => $values['name'],
    'template' => $values['template'],
  );
//dsm($values);
  $values = $values['advanced'];
  if ($values['add_js']['data']) {
    $definition['add_js'] = $values['add_js'];
  }
//dsm($definition);
  
  // check to see if variable fields are in the template, if so, set form callback to auto form
  $fields = widgets_template_auto_form(array(), $definition);
  if (count($fields)) {
    $definition['form callback'] = 'widgets_template_auto_form';
  }
  widgets_element_definition_save($definition);
  drupal_set_message(t('Defintion %name was updated.', array('%name' => $definition['name'])));
  $form_state['redirect'] = 'admin/structure/widgets/definitions';
}

function widgets_definition_preview_form($form, &$form_state, $definition) {

  $form = array();
  if (isset($_SESSION['widgets']['preview_form_data'])) {
    $definition['data'] = $_SESSION['widgets']['preview_form_data'];
    //unset($_SESSION['widgets']['preview_form_data']);
  }
//dsm($form_state);
//dsm($definition);
  
  $set = array(
    'name' => 'preview',
  );
//dsm($definition);  
  // Show the thumbnail preview.
  $form['#tree'] = TRUE;
  $preview = theme('widgets_element_view', array('element' => $definition));
  $form['preview'] = array(
    '#type' => 'item',
    '#title' => t('Preview'),
    '#markup' => $preview,
  );
  
  $form['markup'] = array(
    '#type' => 'fieldset',
    '#title' => t('Markup'),
    '#collapsible' => TRUE,
    '#collapsed' => TRUE,
  ); 
  $form['markup']['template'] = array(
    '#type' => 'textarea',
    '#title' => t('Template'),
    '#default_value' => $definition['template'],
    '#rows' => 5,
  );
  $form['markup']['output'] = array(
    '#type' => 'textarea',
    '#title' => t('Output'),
    '#default_value' => $preview,
    '#rows' => 5,
  );
  
  $form['data'] = array(
    '#type' => 'fieldset',
    '#title' => t('Configuration form'),
    '#collapsible' => TRUE,
    '#collapsed' => FALSE,
  );  
  if (isset($definition['form callback'])) {
    //$fields = call_user_func($definition['form callback'], $definition['data'], $definition);
    $fields = call_user_func($definition['form callback'], $definition['data']);
//dsm($definition);
//dsm($fields);
    drupal_alter('widgets_element_form', $fields, $set, $definition);
    $form['data'] = array_merge($form['data'], $fields);
    
//    $form['data'] = call_user_func($element['form callback'], $element['data']);
//    drupal_alter('widgets_element_form', $form['data'], $set, $element);
  }
  else {
    $form['data']['markup'] = array(
      '#markup' => t('Widget definition has no configuration settings.'),
    );     
  } 
  
  $form['actions']['submit'] = array(
    '#type' => 'submit',
    '#value' => t('Refresh preview'),
  );
  
  return $form;  
}

function widgets_definition_preview_form_submit($form, &$form_state) {
  $_SESSION['widgets']['preview_form_data'] = $form_state['values']['data'];
}

function widgets_definition_export_form($form, &$form_state, $definition) {
  $form = array();

  // TODO add widget set data support
  $str = "\$elements['" . $definition['name'] . "'] = array(\n";
  $str .= "  'label' => t('{$definition['name']}'),\n";
  $str .= "  'template' => '{$definition['template']}',\n";
  if (isset($definition['add_js']['data'])) {
    $str .= "  'add_js' => array(\n";
    $str .= "    'data' => '{$definition['add_js']['data']}',\n";
    $str .= "    'options' => array(\n";
    $str .= "      'scope' => '{$definition['add_js']['options']['scope']}',\n";
    $str .= "    ),\n";
    $str .= "  ),\n";
  }
  $str .= "  'form callback' => 'widgets_template_auto_form',\n";
  $str .= ");";

  $form['export'] = array(
    '#type' => 'textarea',
    '#title' => t('code'),
    '#rows' => 20,
    '#default_value' => $str, 
  );
  return $form;
}

/**
 * Returns HTML for the page containing the list of widget sets.
 *
 * @param $variables
 *   An associative array containing:
 *   - sets: An array of all the widget sets returned by widgets_get_sets().
 *
 * @see widgets_get_sets()
 * @ingroup themeable
 */
function theme_widgets_set_list($variables) {  
  $sets = $variables['sets'];

  $header = array(t('Set name'), t('Settings'), array('data' => t('Operations'), 'colspan' => 3));
  $rows = array();
  foreach ($sets as $set) {
    $row = array();
    $row[] = l($set['name'], 'admin/structure/widgets/sets/edit/' . $set['name']);
    $link_attributes = array(
      'attributes' => array(
        'class' => array('widgets-set-link'),
      ),
    );
    if ($set['storage'] == WIDGETS_STORAGE_NORMAL) {
      $row[] = t('Custom');
      $row[] = l(t('edit'), 'admin/structure/widgets/sets/edit/' . $set['name'], $link_attributes);
      $row[] = l(t('delete'), 'admin/structure/widgets/sets/delete/' . $set['name'], $link_attributes);
    }
    elseif ($set['storage'] == WIDGETS_STORAGE_OVERRIDE) {
      $row[] = t('Overridden');
      $row[] = l(t('edit'), 'admin/structure/widgets/sets/edit/' . $set['name'], $link_attributes);
      $row[] = l(t('revert'), 'admin/structure/widgets/sets/revert/' . $set['name'], $link_attributes);
    }
    else {
      $row[] = t('Default');
      $row[] = l(t('edit'), 'admin/structure/widgets/sets/edit/' . $set['name'], $link_attributes);
      $row[] = '';
    }
    $rows[] = $row;
  }

  if (empty($rows)) {
    $rows[] = array(array(
      'colspan' => 4,
      'data' => t('There are currently no sets. <a href="!url">Add a new one</a>.', array('!url' => url('admin/structure/widgets/sets/add'))),
    ));
  }

  return theme('table', array('header' => $header, 'rows' => $rows));
}

/**
 * Returns HTML for a listing of the elements within a specific widget set.
 *
 * @param $variables
 *   An associative array containing:
 *   - form: A render element representing the form.
 *
 * @ingroup themeable
 */
function theme_widgets_set_elements($variables) {
  $form = $variables['form'];

  $rows = array();

  foreach (element_children($form) as $key) {
    $row = array();
    $form[$key]['weight']['#attributes']['class'] = array('widgets-element-order-weight');
    if (is_numeric($key)) {
      $summary = drupal_render($form[$key]['summary']);
      $row[] = drupal_render($form[$key]['label']) . (empty($summary) ? '' : ' ' . $summary);
      $row[] = drupal_render($form[$key]['weight']);
      $row[] = drupal_render($form[$key]['configure']);
      $row[] = drupal_render($form[$key]['remove']);
    }
    else {
      // Add the row for adding a new widget element.
      $row[] = '<div class="widgets-set-new">' . drupal_render($form['new']['new']) . drupal_render($form['new']['add']) . '</div>';
      $row[] = drupal_render($form['new']['weight']);
      $row[] = array('data' => '', 'colspan' => 2);
    }

    if (!isset($form[$key]['#access']) || $form[$key]['#access']) {
      $rows[] = array(
        'data' => $row,
        'class' => !empty($form[$key]['weight']['#access']) || $key == 'new' ? array('draggable') : array(),
      );
    }
  }

  $header = array(
    t('Element'),
    t('Weight'),
    array('data' => t('Operations'), 'colspan' => 2),
  );

  if (count($rows) == 1 && $form['new']['#access']) {
    array_unshift($rows, array(array(
      'data' => t('There are currently no elements in this set. Add one by selecting an option below.'),
      'colspan' => 4,
    )));
  }

  $output = theme('table', array('header' => $header, 'rows' => $rows, 'attributes' => array('id' => 'widgets-set-elements')));
  drupal_add_tabledrag('widgets-set-elements', 'order', 'sibling', 'widgets-element-order-weight');
  return $output;
}

function theme_widgets_definition_list($variables) {
  $defs = $variables['definitions'];

  $header = array(t('Definition name'), t('Settings'), array('data' => t('Operations'), 'colspan' => 4));
  $rows = array();
  foreach ($defs as $def) {
    $row = array();
    $row[] = l($def['name'], 'admin/structure/widgets/definitions/preview/' . $def['name']);
    $link_attributes = array(
      'attributes' => array(
        'class' => array('widgets-set-link'),
      ),
    );
    if ($def['storage'] == WIDGETS_STORAGE_NORMAL) {
      $row[] = t('Custom');
      $row[] = l(t('edit'), 'admin/structure/widgets/definitions/edit/' . $def['name'], $link_attributes);
      $row[] = l(t('delete'), 'admin/structure/widgets/definitions/delete/' . $def['name'], $link_attributes);
      $row[] = l(t('export'), 'admin/structure/widgets/definitions/export/' . $def['name'], $link_attributes);
    }
    else {
      $row[] = t('Default');
      $row[] = l(t('clone'), 'admin/structure/widgets/definitions/add/' . $def['name'], $link_attributes);
      $row[] = l(t('export'), 'admin/structure/widgets/definitions/export/' . $def['name'], $link_attributes);
      $row[] = '';
    }
    $rows[] = $row;
  }

  if (empty($rows)) {
    $rows[] = array(array(
      'colspan' => 5,
      'data' => t('There are currently no definitions. <a href="!url">Add a new one</a>.', array('!url' => url('admin/structure/widgets/definitions/add'))),
    ));
  }

  return theme('table', array('header' => $header, 'rows' => $rows));
}