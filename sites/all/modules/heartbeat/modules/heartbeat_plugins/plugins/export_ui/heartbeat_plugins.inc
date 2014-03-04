<?php

/**
 * @file
 * Contains ctools export_ui plugin for heartbeat plugins.
 */

$plugin = array(

  'schema' => 'heartbeat_plugins',
  'access' => 'admin heartbeat plugins',
  'menu' => array(
    'menu prefix' => 'admin/structure/heartbeat', // default
    'menu item' => 'plugins', // default
    'menu title' => 'Heartbeat plugins',
    'menu description' => 'Administer heartbeat plugins.',
  ),
  'title singular' => t('Heartbeat plugin'),
  'title singular proper' => t('Heartbeat plugin'),
  'title plural' => t('Heartbeat plugins'),
  'title plural proper' => t('Heartbeat plugins'),

  'handler' => array(
    'class' => 'ctools_export_ui_heartbeat_plugin',
    'parent' => 'ctools_export_ui',
  ),

);

