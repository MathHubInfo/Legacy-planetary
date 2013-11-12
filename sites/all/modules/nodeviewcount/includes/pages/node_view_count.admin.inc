<?php

/**
 * Admin form.
 */
function node_view_count_admin_settings_form($form, &$form_state) {
  // Get node types that were checked on admin settings form.
  $options_node_type = node_view_count_get_checked_node_types();

  $form['node_view_count_node_types_options'] = array(
    '#title' => t('Node types'),  
    '#description' => t('Choose content types to count views of node.'),  
    '#type' => 'checkboxes',
    '#options' => $options_node_type,
    '#default_value' => variable_get('node_view_count_node_types_options', array()),
  );
  // Get user roles options.
  $options_user_roles = node_view_count_get_checked_user_roles();
  
  $form['node_view_count_user_roles_options'] = array(
    '#title' => t('User roles'),  
    '#description' => t('Choose user roles to count node views for.'),  
    '#type' => 'checkboxes',
    '#options' => $options_user_roles,
    '#default_value' => variable_get('node_view_count_user_roles_options', array()),    
  );
  $form = system_settings_form($form);
  return $form;
}

/**
 * Get node types options.
 *
 * @return
 *   Associative array of options.
 */
function node_view_count_get_checked_node_types() {
  $options = array();
  // All node types on site.
  $node_field_types = node_type_get_types();
  foreach ($node_field_types as $node_field_type) {
    $options[$node_field_type->type] = $node_field_type->name;
  }
  return $options;
}

/**
 * Get user roles options.
 *
 * @return
 *   Associative array of options.
 */
function node_view_count_get_checked_user_roles() {
  $options = array();
  // All user roles on site.
  $user_roles = user_roles();
  foreach ($user_roles as $key => $user_role) {
    // All user roles, but anonymous role.
    if ($user_role == 'anonymous user') {
      continue;
    }
    $options[$key] = $user_role;
  }
  return $options;
}