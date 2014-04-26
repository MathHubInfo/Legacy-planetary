<?php

/**
 * @file
 * Contains ctools export_ui plugin for heartbeat streams.
 */

$plugin = array(

  'schema' => 'heartbeat_streams',
  'access' => 'admin heartbeat streams',

  'menu' => array(
    'menu prefix' => 'admin/structure/heartbeat', // default
    'menu item' => 'streams', // default
    'menu title' => 'Heartbeat streams',
    'menu description' => 'Administer heartbeat streams.',
  ),

  'title singular' => t('Heartbeat stream'),
  'title singular proper' => t('Heartbeat stream'),
  'title plural' => t('Heartbeat streams'),
  'title plural proper' => t('Heartbeat streams'),

  // A handler to override some methods for advanced UI.
  'handler' => array(
    'class' => 'ctools_export_ui_heartbeat_stream',
    'parent' => 'ctools_export_ui',
  ),

);
