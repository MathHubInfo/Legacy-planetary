<?php
// $Id$

/**
 * @file
 * Setup wizard
 */

/*
 * 
 */
function socialmedia_admin_setup($step = 0) {
  if (!$step) {
    $step = 0;
  }
  $form = drupal_get_form('socialmedia_setup_' . $step . '_form');
  $output = render($form);
  return $output;
}

/** 
 * Checks if dependencies are installed
 * @param $form
 * @param $form_state
 */
function socialmedia_setup_0_form($form, &$form_state) {
  $form = array();
  $output = '';
  $enabled = FALSE;
  
  if (!module_exists('widgets') && (!$enabled = module_enable(array('widgets')))) {
    $output = t('In order to setup Social media you need to !install.',
      array('!install' => l(t('install the Widgets module'), 'admin/modules'))
    );
  }
  else {
    // check if module was just enabled, clear menu cache if yes
    if ($enabled) {
      menu_rebuild(TRUE);
      menu_cache_clear_all();
      cache_clear_all('theme_registry', 'cache', TRUE);
    }
    drupal_goto('admin/config/media/socialmedia/setup/1');
  }
  
  return $form;
}
/**
 * Select social media profiles
 * @param $form
 * @param $form_state
 */
function socialmedia_setup_1_form($form, $form_state) {
  require_once(drupal_get_path('module', 'socialmedia') . '/socialmedia.admin.inc');
  drupal_set_title(t('Social media profiles setup'));
  $instructions = <<<EOF
<p>The first step is to setup your social media profiles. The social media module supports several platforms such as Twitter, Facebook and Google+. If you already have accounts enter them below. If you have not setup any social media profiles yet or want to create additional ones, follow the homepage links below to create accounts. 
</p><p>
You do not have to create an account on all platforms. Any platforms that you do not enter a profile url for will be ignored. You can add and remove profiles later on the Social Media configuration page.  
EOF;

  $form['instructions'] = array(
    '#markup' => t($instructions),
  ); 
  $form['setup_mode'] = array(
    '#type' => 'value',
    '#value' => 1,
  );
  $platforms = socialmedia_socialmedia_platform_info();
  $fields = socialmedia_admin_profiles_form($form, $form_state, 'site', NULL, TRUE);

  unset($fields['Widget platforms']);
  $fields['submit']['#value'] = t('Save profiles');
  
  
  $form= array_merge($form, $fields);
  
  $form['#validate'][] = 'socialmedia_admin_profiles_form_validate';
  $form['#submit'][] = 'socialmedia_setup_1_form_submit';

  return $form;
}

function socialmedia_setup_1_form_submit($form, $form_state) {
  $values = $form_state['values'];
//dsm($values);
  $platforms = socialmedia_socialmedia_platform_info();
  $platforms_site = variable_get('socialmedia_platforms_site' , array());
//dsm($platforms);
  foreach ($platforms AS $key => $platform) {
    if (!isset($values['input_' . $key . '_url'])) {
      continue;
    }
    $platforms_site[$key] = $key;
    if (!trim($values['input_' . $key . '_url'])) {
      $platforms_site[$key] = 0;
      unset($form_state['values']['input_' . $key . '_url']);
      unset($form_state['values']['input_' . $key . '_username']);
    }
    //unset($values
  }
  variable_set('socialmedia_platforms_site', $platforms_site, array());
//dsm($platforms_site);
  $inputs = _socialmedia_admin_profiles_form_build_inputs($form_state['values'], $platforms);
//dsm($inputs);
  // save profile data
  socialmedia_admin_profiles_form_submit($form, $form_state);

  // clear widgets set cache so profile_default updates
  cache_clear_all('widgets_sets', 'cache');

  drupal_set_message(t('Profile information has been saved.'));
  drupal_goto('admin/config/media/socialmedia/setup/2');
}

/**
 * Select social media profiles
 * @param $form
 * @param $form_state
 */
function socialmedia_setup_2_form($form, &$form_state) {
  cache_clear_all('set:socialmedia_profile-default', 'cache_widgets');
  require_once(drupal_get_path('module', 'socialmedia') . '/socialmedia.admin.inc');
  drupal_set_title(t('Social media profile widget setup'));

  $fields = socialmedia_admin_profile_widgets_form($form, $form_state);
  $form = array_merge($form, $fields); 
  //$form['#validate'][] = 'socialmedia_admin_profile_widgets_form_validate';
  $form_state['redirect'] = 'admin/config/media/socialmedia/setup/3';

  return $form;
}

function socialmedia_setup_2_form_submit($form, &$form_state) {  
  socialmedia_admin_profile_widgets_form_submit($form, $form_state);
  drupal_goto('admin/config/media/socialmedia/setup/3');
}

/**
 * Select social media profiles
 * @param $form
 * @param $form_state
 */
function socialmedia_setup_3_form($form, $form_state) {
  require_once(drupal_get_path('module', 'socialmedia') . '/socialmedia.admin.inc');
  drupal_set_title(t('Social media profile widget setup'));

  $fields = socialmedia_admin_share_widgets_form($form, $form_state);
  $form = array_merge($form, $fields); 

  return $form;
}

function socialmedia_setup_3_form_submit($form, &$form_state) {  
  socialmedia_admin_share_widgets_form_submit($form, $form_state);
  drupal_goto('admin/config/media/socialmedia/setup/4');
}

function socialmedia_setup_4_form($form, $form_state) {
  drupal_add_css(drupal_get_path('module', 'socialmedia') . '/socialmedia.admin.css');
  drupal_set_title(t('Social media widget placement setup'));
  
  $form =  array();  
  $instructions = t('The below form is used to place widgets on your site. It allows you to place your default profile and share widget sets and other popular widgets. These settings can be changed later by editing the widget set via the Widgets admin page.');

  $form['instructions'] = array(
    '#markup' => '<p>' . $instructions . '</p>',
  );
  $default_theme = variable_get('theme_default', NULL);
  $regions = system_region_list($default_theme);
  array_unshift($regions, 'Don\'t add to any regions');

  $form['profile_set'] = array(
    '#type' => 'fieldset',
    '#title' => t('Default profile set'),
    '#collapsible' => TRUE,
    '#collapsed' => FALSE,
  ); 
  $form['profile_set']['preview0'] = array(
    '#markup' => '<div id="preview">',
  );
  $set_name = 'socialmedia_profile-default';
  $set = widgets_set_load($set_name);
//dsm($set);
  $form['profile_set_name'] = array(
    '#type' => 'value',
    '#value' => $set_name,
  );
  $form['profile_set']['preview'] = array(
    '#type' => 'item',
    '#title' => t('Preview'),
    '#markup' => theme('widgets_set_view', array('set' => $set)),
  );
  $form['profile_set']['preview1'] = array(
    '#markup' => '</div>',
  );  
  
  $form['profile_set']['settings0'] = array(
    '#markup' => '<div id="settings">',
  );
  $block = block_load('widgets', 's_' . $set_name);
  $default = array(
    (isset($block->region) && $block->region != -1) ? $block->region : (isset($regions['header']) ? 'header' : '')
  );
  //$default = array('header');
  $form['profile_set']['profile_block'] = array(
    '#type' => 'select',
    '#title' => t('Region'),
    '#description' => t('Select a region to place the profile widget set as a block.'),
    '#options' => $regions,
    '#default_value' => $default,
  );
  $form['profile_set']['setting1'] = array(
    '#markup' => '</div>',
  );

  $form['share_set'] = array(
    '#type' => 'fieldset',
    '#title' => t('Default share set'),
    '#collapsible' => TRUE,
    '#collapsed' => FALSE,
  ); 
  $form['share_set']['preview0'] = array(
    '#markup' => '<div id="preview">',
  );
  $set_name = 'socialmedia_share-default';
  $set = widgets_set_load($set_name);
  $form['share_set_name'] = array(
    '#type' => 'value',
    '#value' => $set_name,
  );
  $form['share_set']['preview'] = array(
    '#type' => 'item',
    '#title' => t('Preview'),
    '#markup' => theme('widgets_set_view', array('set' => $set)),
  );
  $form['share_set']['preview1'] = array(
    '#markup' => '</div>',
  );  
  
  $form['share_set']['settings0'] = array(
    '#markup' => '<div id="settings">',
  ); 
  $block = block_load('widgets', 's_' . $set_name);
//dsm($block);
  $default = array(
   (isset($block->region) && $block->region != -1) ? $block->region : (isset($regions['sidebar_second']) ? 'sidebar_second' : '')
  ); 
  $form['share_set']['share_block'] = array(
    '#type' => 'select',
    '#title' => t('Region'),
    '#description' => t('Select a region to place the profile widget set as a block.'),
    '#options' => $regions,
    '#default_value' => $default,
  );

  $types = node_type_get_types();
  $set = widgets_set_load($set_name);
  $form['share_set']['share_content_types'] = array(
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
    $form['share_set']['share_content_types']['contenttype_' . $typename] = array(
      '#type' => 'checkboxes',
      '#title' => filter_xss($type->name),
      '#options' => $options,
      '#default_value' => isset($set['data']['visibility']['content_types'][$typename]) ? $set['data']['visibility']['content_types'][$typename] : array(),
    ); 
  }  
  $form['share_set']['settings1'] = array(
    '#markup' => '</div>',
  );  
  
  $form['facebook_set'] = array(
    '#type' => 'fieldset',
    '#title' => t('Facebook like box'),
    '#collapsible' => TRUE,
    '#collapsed' => FALSE,
  ); 
  $form['facebook_set']['preview0'] = array(
    '#markup' => '<div id="preview">',
  );
  $set_name = 'facebook-like-box';
  $set = widgets_set_load($set_name);
  $form['facebook_set_name'] = array(
    '#type' => 'value',
    '#value' => $set_name,
  );
  $form['facebook_set']['preview'] = array(
    '#type' => 'item',
    '#title' => t('Preview'),
    '#markup' => theme('widgets_set_view', array('set' => $set)),
  );
  $form['facebook_set']['preview1'] = array(
    '#markup' => '</div>',
  );  
  
  $form['facebook_set']['settings0'] = array(
    '#markup' => '<div id="settings">',
  );
  $block = block_load('widgets', 's_' . $set_name);
  $default = array(
    (isset($block->region) && $block->region != -1) ? $block->region : (isset($regions['sidebar_second']) ? 'sidebar_second' : '')
  );
  //$default = array('header');
  $form['facebook_set']['facebook_block'] = array(
    '#type' => 'select',
    '#title' => t('Region'),
    '#description' => t('Select a region to place the profile widget set as a block.'),
    '#options' => $regions,
    '#default_value' => $default,
  );
  $form['facebook_set']['setting1'] = array(
    '#markup' => '</div>',
  );
  
  $form['twitter_set'] = array(
    '#type' => 'fieldset',
    '#title' => t('Twitter profile widget'),
    '#collapsible' => TRUE,
    '#collapsed' => FALSE,
  ); 
  $form['twitter_set']['preview0'] = array(
    '#markup' => '<div id="preview">',
  );
  $set_name = 'twitter-profile-widget';
  $set = widgets_set_load($set_name);
  $form['twitter_set_name'] = array(
    '#type' => 'value',
    '#value' => $set_name,
  );
  $form['twitter_set']['preview'] = array(
    '#type' => 'item',
    '#title' => t('Preview'),
    '#markup' => theme('widgets_set_view', array('set' => $set)),
  );
  $form['twitter_set']['preview1'] = array(
    '#markup' => '</div>',
  );  
  
  $form['twitter_set']['settings0'] = array(
    '#markup' => '<div id="settings">',
  );
  $block = block_load('widgets', 's_' . $set_name);
  $default = array(
    (isset($block->region) && $block->region != -1) ? $block->region : (isset($regions['sidebar_second']) ? 'sidebar_second' : '')
  );
  //$default = array('header');
  $form['twitter_set']['twitter_block'] = array(
    '#type' => 'select',
    '#title' => t('Region'),
    '#description' => t('Select a region to place the profile widget set as a block.'),
    '#options' => $regions,
    '#default_value' => $default,
  );
  $form['facebook_set']['setting1'] = array(
    '#markup' => '</div>',
  );
  
  $form['submit'] = array(
    '#type' => 'submit',
    '#value' => t('Save widget placement settings'),
  );
  
  
  return $form; 
}

function socialmedia_setup_4_form_submit($form, $form_state) {
  $values = $form_state['values'];
  // update block settings
  $blocks = array();
  $blocks[$values['profile_set_name']] = $values['profile_block'];
  $blocks[$values['share_set_name']] = $values['share_block'];
  $blocks[$values['facebook_set_name']] = $values['facebook_block'];
  $blocks[$values['twitter_set_name']] = $values['twitter_block'];

  $default_theme = variable_get('theme_default', NULL);
  foreach ($blocks AS $set => $region) {
    $query = db_merge('block')
      ->key(array('theme' => $default_theme, 'delta' => 's_' . $set, 'module' => 'widgets'))
      ->fields(array(
        'region' => ($region) ? $region : -1, 
        'pages' => '', 
        'status' => ($region) ? 1 : 0,
      ));
//dsm(' ' . $query);
    $query->execute(); 
  }
  
  // Update node links settings
  $set = variable_get('socialmedia_widget_set_default_share', socialmedia_widgets_set_share_default());
  foreach ($values AS $key => $value) {
    if (strpos($key, 'contenttype_') === 0) {
      list($a, $type) = explode('_', $key, 2);
      $set['data']['visibility']['content_types'][$type] = $value;
    }
  }
  variable_set('socialmedia_widget_set_default_share', $set);

  cache_clear_all('widgets_sets', 'cache');

  drupal_set_message(t('Widget set placement has been saved.'));
  drupal_goto('');
}