<?php
/**
 * @file
 * planetmath_attachable_content.view.inc
 */

/**
 * Implements hook_views_default_views().
 */
function planetmath_attachable_content_views_default_views() {
  $export = array();

  $view = new view();
  $view->name = 'acv';
  $view->description = '';
  $view->tag = 'default';
  $view->base_table = 'apachesolr__solr';
  $view->human_name = 'ATTACH';
  $view->core = 7;
  $view->api_version = '3.0';
  $view->disabled = FALSE; /* Edit this to true to make a default view disabled initially */

  /* Display: Master */
  $handler = $view->new_display('default', 'Master', 'default');
  $handler->display->display_options['title'] = 'ATTACH';
  $handler->display->display_options['use_ajax'] = TRUE;
  $handler->display->display_options['use_more_always'] = FALSE;
  $handler->display->display_options['access']['type'] = 'none';
  $handler->display->display_options['cache']['type'] = 'none';
  $handler->display->display_options['query']['type'] = 'views_query';
  $handler->display->display_options['exposed_form']['type'] = 'input_required';
  $handler->display->display_options['exposed_form']['options']['text_input_required_format'] = 'tex_editor';
  $handler->display->display_options['pager']['type'] = 'full';
  $handler->display->display_options['pager']['options']['items_per_page'] = '10';
  $handler->display->display_options['style_plugin'] = 'table';
  $handler->display->display_options['style_options']['columns'] = array(
    'url' => 'url',
    'entity_id' => 'entity_id',
  );
  $handler->display->display_options['style_options']['default'] = '-1';
  $handler->display->display_options['style_options']['info'] = array(
    'url' => array(
      'sortable' => 0,
      'default_sort_order' => 'asc',
      'align' => '',
      'separator' => '',
      'empty_column' => 0,
    ),
    'entity_id' => array(
      'sortable' => 0,
      'default_sort_order' => 'asc',
      'align' => '',
      'separator' => '',
      'empty_column' => 0,
    ),
  );
  /* Field: Apache Solr: url */
  $handler->display->display_options['fields']['url']['id'] = 'url';
  $handler->display->display_options['fields']['url']['table'] = 'apachesolr__solr';
  $handler->display->display_options['fields']['url']['field'] = 'url';
  /* Field: Apache Solr: entity_id */
  $handler->display->display_options['fields']['entity_id']['id'] = 'entity_id';
  $handler->display->display_options['fields']['entity_id']['table'] = 'apachesolr__solr';
  $handler->display->display_options['fields']['entity_id']['field'] = 'entity_id';
  /* Filter criterion: Apache Solr: Search */
  $handler->display->display_options['filters']['keyword']['id'] = 'keyword';
  $handler->display->display_options['filters']['keyword']['table'] = 'apachesolr__solr';
  $handler->display->display_options['filters']['keyword']['field'] = 'keyword';
  $handler->display->display_options['filters']['keyword']['exposed'] = TRUE;
  $handler->display->display_options['filters']['keyword']['expose']['operator_id'] = '';
  $handler->display->display_options['filters']['keyword']['expose']['label'] = 'Search terms';
  $handler->display->display_options['filters']['keyword']['expose']['operator'] = 'keyword_op';
  $handler->display->display_options['filters']['keyword']['expose']['identifier'] = 'keyword';
  $handler->display->display_options['filters']['keyword']['expose']['remember_roles'] = array(
    2 => '2',
    1 => 0,
    3 => 0,
  );
  /* Filter criterion: Apache Solr: is_uid */
  $handler->display->display_options['filters']['is_uid']['id'] = 'is_uid';
  $handler->display->display_options['filters']['is_uid']['table'] = 'apachesolr__solr';
  $handler->display->display_options['filters']['is_uid']['field'] = 'is_uid';
  $handler->display->display_options['filters']['is_uid']['exposed'] = TRUE;
  $handler->display->display_options['filters']['is_uid']['expose']['operator_id'] = '';
  $handler->display->display_options['filters']['is_uid']['expose']['label'] = 'User ID';
  $handler->display->display_options['filters']['is_uid']['expose']['description'] = '(optional)';
  $handler->display->display_options['filters']['is_uid']['expose']['operator'] = 'is_uid_op';
  $handler->display->display_options['filters']['is_uid']['expose']['identifier'] = 'is_uid';
  $handler->display->display_options['filters']['is_uid']['expose']['remember_roles'] = array(
    2 => '2',
    1 => 0,
    3 => 0,
  );

  /* Display: Page */
  $handler = $view->new_display('page', 'Page', 'acp');
  $handler->display->display_options['defaults']['hide_admin_links'] = FALSE;
  $handler->display->display_options['exposed_block'] = FALSE;
  $handler->display->display_options['path'] = 'attachablecontent';

  /* Display: Block */
  $handler = $view->new_display('block', 'Block', 'attachable_content_block');
  $handler->display->display_options['defaults']['hide_admin_links'] = FALSE;
  $handler->display->display_options['block_description'] = 'Attachable Content';
  $translatables['acv'] = array(
    t('Master'),
    t('ATTACH'),
    t('more'),
    t('Apply'),
    t('Reset'),
    t('Sort by'),
    t('Asc'),
    t('Desc'),
    t('Select any filter and click on Apply to see results'),
    t('Items per page'),
    t('- All -'),
    t('Offset'),
    t('« first'),
    t('‹ previous'),
    t('next ›'),
    t('last »'),
    t('url'),
    t('entity_id'),
    t('Search terms'),
    t('User ID'),
    t('(optional)'),
    t('Page'),
    t('Block'),
    t('Attachable Content'),
  );

  $export['acv'] = $view;
  return $export;
}