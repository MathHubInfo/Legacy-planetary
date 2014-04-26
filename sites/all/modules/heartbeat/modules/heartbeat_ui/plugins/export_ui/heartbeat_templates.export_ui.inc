<?php

/**
 * @file
 * Contains ctools export_ui plugin for mail templates.
 */
$plugin = array(

  'schema' => 'heartbeat_messages',
  'access' => 'admin heartbeat templates',

  'menu' => array(
    'menu prefix' => 'admin/structure/heartbeat', // default
    'menu item' => 'templates', // default
    'menu title' => 'Heartbeat templates',
    'menu description' => 'Administer heartbeat templates.',
  ),

  'title singular' => t('Heartbeat template'),
  'title singular proper' => t('Heartbeat template'),
  'title plural' => t('Heartbeat templates'),
  'title plural proper' => t('Heartbeat templates'),

  'handler' => array(
    'class' => 'ctools_export_ui_heartbeat_template',
    'parent' => 'ctools_export_ui',
  ),

);