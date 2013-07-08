<?php

/**
 * Implements hook_views_default_views().
 */
function localcomments_views_default_views() {
  $export = array();

  $view = new view();
  $view->name = 'local_comments';
  $view->description = '';
  $view->tag = 'default';
  $view->base_table = 'node';
  $view->human_name = 'Local Comments';
  $view->core = 7;
  $view->api_version = '3.0';
  $view->disabled = FALSE; /* Edit this to true to make a default view disabled initially */

  /* Display: Master */
  $handler = $view->new_display('default', 'Master', 'default');
  $handler->display->display_options['title'] = 'Local Comments';
  $handler->display->display_options['use_more_always'] = FALSE;
  $handler->display->display_options['access']['type'] = 'perm';
  $handler->display->display_options['cache']['type'] = 'none';
  $handler->display->display_options['query']['type'] = 'views_query';
  $handler->display->display_options['exposed_form']['type'] = 'basic';
  $handler->display->display_options['pager']['type'] = 'full';
  $handler->display->display_options['pager']['options']['items_per_page'] = '10';
  $handler->display->display_options['style_plugin'] = 'default';
  $handler->display->display_options['row_plugin'] = 'node';
  /* Field: Content: Title */
  $handler->display->display_options['fields']['title']['id'] = 'title';
  $handler->display->display_options['fields']['title']['table'] = 'node';
  $handler->display->display_options['fields']['title']['field'] = 'title';
  $handler->display->display_options['fields']['title']['label'] = '';
  $handler->display->display_options['fields']['title']['alter']['word_boundary'] = FALSE;
  $handler->display->display_options['fields']['title']['alter']['ellipsis'] = FALSE;
  /* Sort criterion: Content: Post date */
  $handler->display->display_options['sorts']['created']['id'] = 'created';
  $handler->display->display_options['sorts']['created']['table'] = 'node';
  $handler->display->display_options['sorts']['created']['field'] = 'created';
  $handler->display->display_options['sorts']['created']['order'] = 'DESC';
  /* Filter criterion: Content: Published */
  $handler->display->display_options['filters']['status']['id'] = 'status';
  $handler->display->display_options['filters']['status']['table'] = 'node';
  $handler->display->display_options['filters']['status']['field'] = 'status';
  $handler->display->display_options['filters']['status']['value'] = 1;
  $handler->display->display_options['filters']['status']['group'] = 1;
  $handler->display->display_options['filters']['status']['expose']['operator'] = FALSE;
  /* Filter criterion: Content: Type */
  $handler->display->display_options['filters']['type']['id'] = 'type';
  $handler->display->display_options['filters']['type']['table'] = 'node';
  $handler->display->display_options['filters']['type']['field'] = 'type';
  $handler->display->display_options['filters']['type']['value'] = array(
    'forum' => 'forum',
  );
  /* Filter criterion: Content: ID (field_id) */
  $handler->display->display_options['filters']['field_id_value']['id'] = 'field_id_value';
  $handler->display->display_options['filters']['field_id_value']['table'] = 'field_data_field_id';
  $handler->display->display_options['filters']['field_id_value']['field'] = 'field_id_value';
  $handler->display->display_options['filters']['field_id_value']['operator'] = 'not empty';
  /* Filter criterion: Content: URI (field_uri) */
  $handler->display->display_options['filters']['field_uri_value']['id'] = 'field_uri_value';
  $handler->display->display_options['filters']['field_uri_value']['table'] = 'field_data_field_uri';
  $handler->display->display_options['filters']['field_uri_value']['field'] = 'field_uri_value';
  $handler->display->display_options['filters']['field_uri_value']['exposed'] = TRUE;
  $handler->display->display_options['filters']['field_uri_value']['expose']['operator_id'] = 'field_uri_value_op';
  $handler->display->display_options['filters']['field_uri_value']['expose']['label'] = 'URI (field_uri)';
  $handler->display->display_options['filters']['field_uri_value']['expose']['operator'] = 'field_uri_value_op';
  $handler->display->display_options['filters']['field_uri_value']['expose']['identifier'] = 'field_uri_value';
  $handler->display->display_options['filters']['field_uri_value']['expose']['remember_roles'] = array(
    2 => '2',
    1 => 0,
  );

  /* Display: Page */
  $handler = $view->new_display('page', 'Page', 'page');
  $handler->display->display_options['path'] = 'local-comments';
  $export['local_comments'] = $view;

  return $export;
}
