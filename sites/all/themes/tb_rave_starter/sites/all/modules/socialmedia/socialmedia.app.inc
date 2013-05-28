<?php

/**
 * @file
 * Implements apps api
 */

/**
* Implements hook_apps_app_info().
*/
function socialmedia_apps_app_info() {
  return array(
    'configure form' => 'socialmedia_apps_app_configure_form',
    //'demo content module' => 'enterprise_blog_content',
  );
}

function socialmedia_apps_app_configure_form() {
  require_once(drupal_get_path('module', 'socialmedia') . '/socialmedia.setup.inc');
  $form = drupal_get_form('socialmedia_setup_0_form');
  //$form['#submit'] = 'socialmedia_setup_1_form_submit';

  return $form;
}