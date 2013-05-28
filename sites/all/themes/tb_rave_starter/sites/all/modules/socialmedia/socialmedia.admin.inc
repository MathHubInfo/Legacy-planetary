<?php
// $Id$

/**
 * @file
 * Admin page callback for the socialmedia module.
 */

/**
 * Builds and returns the socialmedia settings form.
 */
function socialmedia_admin_settings() {
  drupal_add_css(drupal_get_path('module', 'socialmedia') . '/socialmedia.admin.css');
  
  $form = array();
  
  $form['platforms'] = array(
    '#type' => 'fieldset',
    '#title' => t('Platforms'),
    '#collapsible' => TRUE,
    '#collapsed' => FALSE,
    '#description' => t('Select which social media platforms you want to enable on your site.'),
  ); 
  
  $platforms = socialmedia_socialmedia_platform_info();
  $options = array();
  $extra = array();
  foreach ($platforms AS $platform_name => $platform) {
    $options[$platform_name] = $platform['title'];
  }
  $defaults = array_keys($options);
  $form['platforms']['socialmedia_platforms_site'] = array(
    '#type' => 'checkboxes',
    '#title' => t('Site platforms'),
    '#default_value' => variable_get('socialmedia_platforms_site', $defaults),
    '#description' => t('Select the platforms you want active for site wide profiles.'),
    '#options' => $options,
    '#multicolumn' => array('width' => 2),  // multi colunms the checkboxes if multicolumnchecdkboxesradio.module installed
  );
  
  $form['platforms']['socialmedia_platforms_user'] = array(
    '#type' => 'checkboxes',
    '#title' => t('User platforms'),
    '#default_value' => variable_get('socialmedia_platforms_user', $defaults),
    '#description' => t('Select the platforms you want active for user level profiles. Only users with the !permissions permission will be able to add user profiles.',
      array(
        '!permissions' => l(t('Administer own social profiles'), 'admin/people/permissions'),
      )
     ),
    '#options' => $options,
    '#multicolumn' => array('width' => 2),  // multi colunms the checkboxes if multicolumnchecdkboxesradio.module installed
  );
  
  $form['appearance'] = array(
    '#type' => 'fieldset',
    '#title' => t('Default widget appearance'),
    '#collapsible' => TRUE,
    '#collapsed' => TRUE,
    '#description' => t('Default settings for widget appearance.'),
  );
  $form['appearance']['socialmedia_default_width'] = array(
    '#type' => 'textfield',
    '#title' => t('Width'),
    '#size' => 4,
    '#field_suffix' => t('px'),    
    '#default_value' => variable_get('socialmedia_default_width', SOCIALMEDIA_WIDTH_DEFAULT),
  );
  $form['appearance']['socialmedia_default_height'] = array(
    '#type' => 'textfield',
    '#title' => t('Height'),
    '#size' => 4,
    '#field_suffix' => t('px'),    
    '#default_value' => variable_get('socialmedia_default_height', SOCIALMEDIA_HEIGHT_DEFAULT),
  );
  $form['appearance']['socialmedia_default_color_body_background'] = array(
    '#type' => 'textfield',
    '#title' => t('Body background color'),
    '#size' => 8,    
    '#default_value' => variable_get('socialmedia_default_color_body_background', SOCIALMEDIA_COLOR_BODY_BACKGROUND_DEFAULT),
  );
  $form['appearance']['socialmedia_default_color_body_text'] = array(
    '#type' => 'textfield',
    '#title' => t('Body text color'),
    '#size' => 8,    
    '#default_value' => variable_get('socialmedia_default_color_body_text', SOCIALMEDIA_COLOR_BODY_TEXT_DEFAULT),
  );
  $form['appearance']['socialmedia_default_color_body_linktext'] = array(
    '#type' => 'textfield',
    '#title' => t('Body linktext color'),
    '#size' => 8,    
    '#default_value' => variable_get('socialmedia_default_color_body_linktext', SOCIALMEDIA_COLOR_BODY_LINKTEXT_DEFAULT),
  );
  $form['appearance']['socialmedia_default_color_header_background'] = array(
    '#type' => 'textfield',
    '#title' => t('Header background color'),
    '#size' => 8,    
    '#default_value' => variable_get('socialmedia_default_color_header_background', SOCIALMEDIA_COLOR_HEADER_BACKGROUND_DEFAULT),
  );
  $form['appearance']['socialmedia_default_color_header_text'] = array(
    '#type' => 'textfield',
    '#title' => t('Header text color'),
    '#size' => 8,    
    '#default_value' => variable_get('socialmedia_default_color_header_text', SOCIALMEDIA_COLOR_HEADER_TEXT_DEFAULT),
  );
  $form['appearance']['socialmedia_default_color_border'] = array(
    '#type' => 'textfield',
    '#title' => t('Border color'),
    '#size' => 8,    
    '#default_value' => variable_get('socialmedia_default_color_border', SOCIALMEDIA_COLOR_BORDER_DEFAULT),
  );
  
  $form['link_attributes'] = array(
    '#type' => 'fieldset',
    '#title' => t('Default link attributes'),
    '#collapsible' => TRUE,
    '#collapsed' => TRUE,
    '#description' => t('Default settings link attributes.'),
  );
  $form['link_attributes']['socialmedia_default_link_target_profile'] = array(
    '#type' => 'textfield',
    '#title' => t('Profile target'),
    '#default_value' => variable_get('socialmedia_default_link_target_profile', SOCIALMEDIA_LINK_TARGET_PROFILE_DEFAULT),
    '#description' => t('Sets the default target= attribute on profile widget links. Set to &lt;none&gt; to remove attribute.'),
  );
  $options = array(
    '<none>' => t('Remove rel attribute'),
    'nofollow' => t('Set rel="nofollow"'),
  );
  $form['link_attributes']['socialmedia_default_link_rel_profile'] = array(
    '#type' => 'select',
    '#title' => t('Profile rel'),
    '#options' => $options,
    '#default_value' => variable_get('socialmedia_default_link_target_profile', SOCIALMEDIA_LINK_REL_PROFILE_DEFAULT),
    '#description' => t('Sets the default rel= attribute on profile widget links.'),
  );
  $form['link_attributes']['socialmedia_default_link_target_sharing'] = array(
    '#type' => 'textfield',
    '#title' => t('Sharing target'),
    '#default_value' => variable_get('socialmedia_default_link_target_sharing', SOCIALMEDIA_LINK_TARGET_SHARING_DEFAULT),
    '#description' => t('Sets the default target= attribute on sharing widget links. Set to &lt;none&gt; to remove attribute.'),
  );
  $options = array(
    '<none>' => t('Remove rel attribute'),
    'nofollow' => t('Set rel="nofollow"'),
  );
  $form['link_attributes']['socialmedia_default_link_rel_sharing'] = array(
    '#type' => 'select',
    '#title' => t('Sharing rel'),
    '#options' => $options,
    '#default_value' => variable_get('socialmedia_default_link_target_sharing', SOCIALMEDIA_LINK_REL_SHARING_DEFAULT),
    '#description' => t('Sets the default rel= attribute on sharing widget links.'),
  );

  
  $form['iconsets'] = array(
    '#type' => 'fieldset',
    '#title' => t('Icon sets'),
    '#collapsible' => TRUE,
    '#collapsed' => FALSE,
  );
  $options = socialmedia_icon_style_options(FALSE);
  $form['iconsets']['socialmedia_icon_default_style'] = array(
    '#type' => 'select',
    '#title' => t('Default icon style'),
    '#default_value' => variable_get('socialmedia_icon_default_style', SOCIALMEDIA_ICON_DEFAULT_STYLE_DEFAULT),
  //'#description' => t('The name is used in URLs for generated images. Use only lowercase alphanumeric characters, underscores (_), and hyphens (-).'),
    '#options' => $options,
  );
  
  $examples = socialmedia_icon_platforms(TRUE);
  $header = array(
    array(
      'data' => t('Icon set'),
      'style' => 'width: 150px;',
    ), 
    t('Styles')
  );
  foreach ($examples AS $ekey => $ename) {
    $header[] = '';
  }
  
  $rows = array();
  $icons = socialmedia_iconset_info();
  //$examples = array('twitter', 'facebook', 'stumbleupon', 'youtube');
  foreach ($icons AS $iconset_name => $iconset) {
    $name = (isset($iconset['download'])) ? l($iconset['name'], $iconset['download'], array('attributes' => array('target' => '_blank'))) : $iconset['name'];
    if (isset($iconset['publisher'])) {
      $name .= '<br />by ' . ((isset($iconset['publisher url'])) ? l($iconset['publisher'], $iconset['publisher url'], array('attributes' => array('target' => '_blank'))) : $iconset['publisher']);
    }
    $row = array(
      $name,
      implode('<br />', $iconset['styles']),
    );
    if (socialmedia_iconset_is_installed($iconset_name)) {
      foreach ($examples AS $pkey => $pname) {
        $vars = array(
          'path' => call_user_func($iconset['path callback'], $pkey),
          //'alt' => $pname,
          'title' => $pname,
        );
        $row[] = theme('image', $vars) . ' ';
      }
      
    }
    else {
      $str = t('<strong>Not installed.</strong><br />To install: !download and install into %dir.',
        array(
          '!download' => l(t('download'), $iconset['download'], array('attributes' => array('target' => '_blank'))),
          '%dir' => drupal_get_path('module', 'socialmedia') . '/icons/' . $iconset_name . '/',
        )
      );
      if (isset($iconset['additional instructions'])) {
        $str .= ' ' . $iconset['additional instructions'];
      }
      $row[] = array(
        'data' => $str,
        'colspan' => count($examples),
      );
    }
    $rows[] = $row;
    $vars = array(
      'header' => $header,
      'rows' => $rows,
      'attributes' => array(
        'id' => 'socialmedia-iconsets',
      ),
    );
    $form['iconsets']['installed'] = array(
      '#markup' => theme('table', $vars),
    );    
  
  }
  
  $form['#submit'][] = 'socialmedia_admin_settings_submit';
  
  
  
  return system_settings_form($form);
}

function socialmedia_admin_settings_submit() {
  //flush widgets caches so tokens are reloaded
  if (module_exists('widgets')) {
    widgets_clear_widgets_cache('*', TRUE);
  }
}

/**
 * Builds and returns the socialmedia settings form.
 */
function socialmedia_admin_profiles_form($form, &$form_state, $context = 'site', $user = NULL, $setup_mode = FALSE) {

  $uid = (is_object($user)) ? $user->uid : 0;

  $platforms = socialmedia_platform_definitions();
  $defaults = array_keys($platforms);

  $active_platforms = variable_get('socialmedia_platforms_' . (($user) ? 'user' : 'site'), $defaults);
  $form['context'] = array(
    '#type' => 'value',
    '#value' => $context,
  );
  
  $form['uid'] = array(
    '#type' => 'value',
    '#value' => $uid,
  );
  
  foreach ($platforms AS $name => $platform) {
    if ((!isset($active_platforms[$name]) || !$active_platforms[$name]) && !$setup_mode) {
      continue;
    }
    $fields = array();
    $profile = socialmedia_profile_load($name, $uid);

    $fields[$name] = array(
      '#type' => 'fieldset',
      '#title' => filter_xss($platform['title']),
      '#collapsible' => TRUE,
      '#collapsed' => FALSE,
    );
    
    // check if custom form callback, else use default form fields
    if (isset($platform['form callback'])) {
      $fields[$name] = array_merge($fields[$name], call_user_func($platform['form callback'], $profile)); 
    }
    else {
      $default_description = t('Enter the URL to your @platform profile. To create an account on @platform visit !homepage', 
        array(
          '@platform' => $platform['title'],
          '!homepage' => l($platform['homepage'], $platform['homepage'], array('attributes' => array('target' => '_blank'))),
        )
      );
      $fields[$name]['input_' . $name . '_url'] = array(
        '#type' => 'textfield',
        '#title' => filter_xss($platform['title'] . ' URL'),
        '#default_value' => (isset($profile['inputs']['url'])) ? $profile['inputs']['url'] : '',
        '#description' => filter_xss(isset($platform['profile url']) ? $platform['profile description url'] : $default_description),
        '#size' => 80,
      );
      $default_description = t('Enter your @platform profile name how you want it displayed in text links. Leave blank to use the username from the URL.', array('@platform' => $platform['title']));
      $fields[$name]['input_' . $name . '_username'] = array(
        '#type' => 'textfield',
        '#title' => filter_xss($platform['title'] . ' Username'),
        '#default_value' => (isset($profile['inputs']['username'])) ? $profile['inputs']['username'] : '',
        '#description' => filter_xss(isset($platform['description username']) ? $platform['description username'] : $default_description),
        '#size' => 32,
      ); 
    }
    if (isset($platform['group'])) {
      if (!isset($form[$platform['group']])) {
        $form[$platform['group']] = array(
          '#type' => 'fieldset',
          '#title' => filter_xss($platform['group']),
          '#collapsible' => TRUE,
          '#collapsed' => TRUE,
          '#weight' => 20,
        );        
      }
      $form[$platform['group']] = array_merge($form[$platform['group']], $fields);
    }
    else {
      $form = array_merge($form, $fields);
    }
  }
  
  $form['submit'] = array(
    '#type' => 'submit',
    '#value' => t('Submit'),
    '#weight' => 30,
  );
  
  return $form;
}

function _socialmedia_admin_profiles_form_build_inputs($values, $platforms) {
  $inputs = array();
  foreach ($values AS $key => $value) {
    if (strpos($key, 'input_') === 0) {
      $key = substr($key, 6);
      foreach ($platforms AS $platform_name => $platform) {
        if (strpos($key, $platform_name . '_') === 0) {
          $key = substr($key, strlen($platform_name . '_'));
          if (!isset($inputs[$platform_name])) {
            $inputs[$platform_name] = array();
          }
          $inputs[$platform_name][$key] = $value;
        }
      }
    }
  }  
  return $inputs;
}

function socialmedia_admin_profiles_form_validate($form, &$form_state) {

  $setup_mode = (isset($form_state['values']['setup_mode']) && $form_state['values']['setup_mode']) ? 1 : 0;
  $platforms = socialmedia_platform_definitions();
  $inputs = _socialmedia_admin_profiles_form_build_inputs($form_state['values'], $platforms);

  foreach ($platforms AS $platform_name => $platform) {
    if (!isset($inputs[$platform_name])) {
      continue;
    }
    if (isset($platform['parser callback'])) {
      if ($setup_mode && (!isset($inputs[$platform_name]['url']) || !trim($inputs[$platform_name]['url']))) {
        continue;
      }
      call_user_func($platform['parser callback'], $inputs[$platform_name], 'user');
    }
  }
}

function socialmedia_admin_profiles_form_submit($form, &$form_state) {
  $platforms = socialmedia_platform_definitions();
  $inputs = _socialmedia_admin_profiles_form_build_inputs($form_state['values'], $platforms);
  foreach ($platforms AS $platform_name => $platform) {
    if (!isset($inputs[$platform_name])) {
      continue;
    }
    if (isset($platform['parser callback'])) {      
      $profile = call_user_func($platform['parser callback'], $inputs[$platform_name]);
      $profile['inputs'] = $inputs[$platform_name];
      socialmedia_profile_save($profile, $platform_name, $form_state['values']['uid']);
    }
  }
  
  //flush widgets caches so tokens are reloaded
  if (module_exists('widgets')) {
    widgets_clear_widgets_cache('*', TRUE);
  }
  // rebuild redirects if module exists
  if (module_exists('redirect')) {
    socialmedia_update_redirects();
  }

  return 'OK';
}

/**
 * Builds and returns the socialmedia settings form.
 */
function socialmedia_admin_redirects_form($form, &$form_state, $context = 'site', $user = NULL, $setup_mode = FALSE) {

  $form['submit'] = array(
    '#type' => 'submit',
    '#value' => t('Submit'),
  );
  
  return $form;
}

function socialmedia_admin_profile_widgets_form($form, $form_state) {
  require_once(drupal_get_path('module', 'socialmedia') . '/socialmedia.tokens.inc');
  drupal_set_title(t('Social media profile widget'));

  $instructions = t('The profile widget provides a set of buttons that link to your social profiles. Check each platform you want displayed in your default profile widget set. You can edit and change the sort order later.');

  $instructions2 = t('Only platforms that you have entered profile information for can be enabled. To enable additional profiles, !profiles_link. To place the widget set on your site and for additional configuration settings, !widget_link.',
    array(
      '!profiles_link' => l(t('visit the profile settings page'), 'admin/config/media/socialmedia/profiles'),
      '!widget_link' => l(t('visit the profile widget set configuration page'), 'admin/structure/widgets/sets/edit/socialmedia_profile-default'),
    )
  
  );

  $form['instructions'] = array(
    '#markup' => '<p>' . $instructions . '</p>',
  );
  $form['instructions2'] = array(
    '#markup' => '<p>' . $instructions2 . '</p>',
  ); 
  $form['setup_mode'] = array(
    '#type' => 'value',
    '#value' => 1,
  );
  $form['#tree'] = TRUE;  
  
  $defs = socialmedia_widgets_set_profile_default_elements();
  $set = variable_get('socialmedia_widget_set_default_profile', socialmedia_widgets_set_profile_default());
//dsm($defs);
//dsm($set);
  foreach ($defs AS $group => $defs2) {
    $form[$group] = array(
      '#type' => 'fieldset',
      '#title' => filter_xss($defs2['name']),
      '#collapsible' => TRUE,
      '#collapsed' => FALSE,
    ); 
    $weight = 0;      
    foreach ($defs2['elements'] AS $key => $element) {
      $def = widgets_element_definition_load($element['name']);
      if (isset($element['data'])) {
        $def['data'] = $element['data']; 
      }
      $vars = array(
        'element' => $def,
      );
      $form[$group][$element['name']] = array(
        '#type' => 'checkbox',
        '#field_prefix' => theme('widgets_element_view', $vars),
        '#title' =>  t('Include @widget.', array('@widget' => $def['label'])),
        '#return_value' => $element['name'],  
        '#default_value' => socialmedia_element_in_set($element, $set) ? $key : 0, 
        '#weight' => (isset($defs['basic']['elements'][$key]['weight'])) ? $defs['basic']['elements'][$key]['weight'] : 0,  
     );
     $weight++;
    }
  }
  $form['submit'] = array(
    '#type' => 'submit',
    '#value' => t('Save profile widget buttons'),
  );  

  return $form;
}

function socialmedia_admin_profile_widgets_form_submit($form, $form_state) {
  $values = $form_state['values'];
  $defs = socialmedia_widgets_set_profile_default_elements();
  $set = widgets_set_load('socialmedia_profile-default');
  $set['elements'] = array();

  $i = 1;
  foreach ($values AS $group => $elements) {
    if (isset($defs[$group])) {
      foreach ($elements AS $key => $v) {
        if ($v) {
          $element = $defs[$group]['elements'][$key];
          $element += widgets_element_definition_load($key);
          $element['weight'] = $i++;
          $set['elements'][] = $element;
        }
      }
    }
  }
  variable_set('socialmedia_widget_set_default_profile', $set);  

  cache_clear_all('widgets_sets', 'cache');
  return 'OK';
}

function socialmedia_admin_share_widgets_form($form, $form_state) {
  require_once(drupal_get_path('module', 'socialmedia') . '/socialmedia.tokens.inc');
  drupal_set_title(t('Social media share widget'));

  $instructions = t('The share widget provides a set of buttons that enable visitors to share and bookmark site content. Check each sharing method you want displayed in your default sharing widget set. You can edit and change the sort order later.');

  $instructions2 = t('To place the widget set on your site and for additional configuration settings, !widget_link.',
    array(
      '!widget_link' => l(t('visit the profile widget set configuration page'), 'admin/structure/widgets/sets/edit/socialmedia_share-default'),
    )
  
  );

  $form['instructions'] = array(
    '#markup' => '<p>' . $instructions . '</p>',
  );
  $form['instructions2'] = array(
    '#markup' => '<p>' . $instructions2 . '</p>',
  ); 
  $form['setup_mode'] = array(
    '#type' => 'value',
    '#value' => 1,
  );  
  $form['#tree'] = TRUE;
  
  $share_defs = socialmedia_widgets_set_share_default_elements();
  $set = variable_get('socialmedia_widget_set_default_share', socialmedia_widgets_set_share_default());
  foreach ($share_defs AS $group => $share_defs2) {
    $form[$group] = array(
      '#type' => 'fieldset',
      '#title' => filter_xss($share_defs2['name']),
      '#collapsible' => TRUE,
      '#collapsed' => FALSE,
    );       
    foreach ($share_defs2['elements'] AS $key => $element) {
      $def = widgets_element_definition_load($element['name']);
      if (isset($element['data'])) {
        $def['data'] = $element['data']; 
      }
      $vars = array(
        'element' => $def,
      );
      $form[$group][$element['name']] = array(
        '#type' => 'checkbox',
        '#field_prefix' => theme('widgets_element_view', $vars),
        '#title' =>  t('Include @widget.', array('@widget' => $def['label'])),
        '#return_value' => $element['name'],  
        '#default_value' => socialmedia_element_in_set($element, $set) ? $key : 0,    
      );
    }
  }
  $form['submit'] = array(
    '#type' => 'submit',
    '#value' => t('Save share widget buttons'),
  );  

  return $form;
}

function socialmedia_admin_share_widgets_form_submit($form, $form_state) {
  $values = $form_state['values'];
  $defs = socialmedia_widgets_set_share_default_elements();
  $set = widgets_set_load('socialmedia_share-default');
  $set['elements'] = array();

  $i = 1;
  foreach ($values AS $group => $elements) {
    if (isset($defs[$group])) {
      foreach ($elements AS $key => $v) {
        if ($v) {
          $element = $defs[$group]['elements'][$key];
          $element += widgets_element_definition_load($key);
          $element['weight'] = $i++;
          $set['elements'][] = $element;
        }
      }
    }
  }
  variable_set('socialmedia_widget_set_default_share', $set);  

  cache_clear_all('widgets_sets', 'cache');
  return 'OK';
}

function socialmedia_element_in_set($element, $set) {
//dsm($element);
//dsm($set);
  if (isset($set['elements']) && is_array($set['elements'])) {
    foreach ($set['elements'] AS $e) {
      if ($element['name'] == $e['name']) {
        return TRUE;
      }
    }  
  }
  return FALSE;  
}