<?php
/**
 * @file
 * project_generation_feature.views_default.inc
 */

/**
 * Implements hook_views_default_views().
 */
function project_generation_feature_views_default_views() {
  $export = array();

  $view = new view();
  $view->name = 'project_groups';
  $view->description = '';
  $view->tag = 'default';
  $view->base_table = 'node';
  $view->human_name = 'Project Groups';
  $view->core = 7;
  $view->api_version = '3.0';
  $view->disabled = FALSE; /* Edit this to true to make a default view disabled initially */

  /* Display: Master */
  $handler = $view->new_display('default', 'Master', 'default');
  $handler->display->display_options['title'] = 'Project Administration';
  $handler->display->display_options['use_more_always'] = FALSE;
  $handler->display->display_options['access']['type'] = 'role';
  $handler->display->display_options['access']['role'] = array(
    3 => '3',
    2 => '2',
    8 => '8',
  );
  $handler->display->display_options['cache']['type'] = 'none';
  $handler->display->display_options['query']['type'] = 'views_query';
  $handler->display->display_options['exposed_form']['type'] = 'basic';
  $handler->display->display_options['pager']['type'] = 'full';
  $handler->display->display_options['pager']['options']['items_per_page'] = '100';
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
    'project_group' => 'project_group',
  );

  /* Display: Page */
  $handler = $view->new_display('page', 'Page', 'page');
  $handler->display->display_options['path'] = 'project-administration';
  $export['project_groups'] = $view;

  $view = new view();
  $view->name = 'projects_list';
  $view->description = '';
  $view->tag = 'default';
  $view->base_table = 'node';
  $view->human_name = 'KWARC: Projects';
  $view->core = 7;
  $view->api_version = '3.0';
  $view->disabled = FALSE; /* Edit this to true to make a default view disabled initially */

  /* Display: Master */
  $handler = $view->new_display('default', 'Master', 'default');
  $handler->display->display_options['title'] = 'KWARC: Projects';
  $handler->display->display_options['use_more_always'] = FALSE;
  $handler->display->display_options['access']['type'] = 'perm';
  $handler->display->display_options['cache']['type'] = 'none';
  $handler->display->display_options['query']['type'] = 'views_query';
  $handler->display->display_options['exposed_form']['type'] = 'basic';
  $handler->display->display_options['pager']['type'] = 'full';
  $handler->display->display_options['pager']['options']['items_per_page'] = '100';
  $handler->display->display_options['style_plugin'] = 'default';
  $handler->display->display_options['row_plugin'] = 'node';
  /* Header: Global: Text area */
  $handler->display->display_options['header']['area']['id'] = 'area';
  $handler->display->display_options['header']['area']['table'] = 'views';
  $handler->display->display_options['header']['area']['field'] = 'area';
  $handler->display->display_options['header']['area']['content'] = 'The KWARC group has developed various added value services based on OMDoc-encoded content, including a mathematical knowledge base, a semantic search engine, management of change, a semantic wiki, mathematical web services, and invasive OMDoc editing technologies. Furthermore, the group works on the utilization of OMDoc to provide Logic Interoperability and to establish scientific Communities of Practice.';
  $handler->display->display_options['header']['area']['format'] = 'filtered_html';
  /* Field: Content: Weight in Views */
  $handler->display->display_options['fields']['field_weight_in_views']['id'] = 'field_weight_in_views';
  $handler->display->display_options['fields']['field_weight_in_views']['table'] = 'field_data_field_weight_in_views';
  $handler->display->display_options['fields']['field_weight_in_views']['field'] = 'field_weight_in_views';
  $handler->display->display_options['fields']['field_weight_in_views']['settings'] = array(
    'thousand_separator' => ' ',
    'prefix_suffix' => 1,
  );
  /* Sort criterion: Content: Weight in Views (field_weight_in_views) */
  $handler->display->display_options['sorts']['field_weight_in_views_value']['id'] = 'field_weight_in_views_value';
  $handler->display->display_options['sorts']['field_weight_in_views_value']['table'] = 'field_data_field_weight_in_views';
  $handler->display->display_options['sorts']['field_weight_in_views_value']['field'] = 'field_weight_in_views_value';
  $handler->display->display_options['sorts']['field_weight_in_views_value']['order'] = 'DESC';
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
    'project_description' => 'project_description',
  );

  /* Display: Page */
  $handler = $view->new_display('page', 'Page', 'page');
  $handler->display->display_options['defaults']['style_plugin'] = FALSE;
  $handler->display->display_options['style_plugin'] = 'list';
  $handler->display->display_options['style_options']['grouping'] = array(
    0 => array(
      'field' => 'field_type_domain',
      'rendered' => 1,
      'rendered_strip' => 0,
    ),
    1 => array(
      'field' => 'title',
      'rendered' => 1,
      'rendered_strip' => 0,
    ),
  );
  $handler->display->display_options['style_options']['uses_fields'] = TRUE;
  $handler->display->display_options['defaults']['style_options'] = FALSE;
  $handler->display->display_options['defaults']['row_plugin'] = FALSE;
  $handler->display->display_options['row_plugin'] = 'node';
  $handler->display->display_options['defaults']['row_options'] = FALSE;
  $handler->display->display_options['defaults']['fields'] = FALSE;
  /* Field: Content: Weight in Views */
  $handler->display->display_options['fields']['field_weight_in_views']['id'] = 'field_weight_in_views';
  $handler->display->display_options['fields']['field_weight_in_views']['table'] = 'field_data_field_weight_in_views';
  $handler->display->display_options['fields']['field_weight_in_views']['field'] = 'field_weight_in_views';
  $handler->display->display_options['fields']['field_weight_in_views']['settings'] = array(
    'thousand_separator' => ' ',
    'prefix_suffix' => 1,
  );
  /* Field: Content: Type Domain */
  $handler->display->display_options['fields']['field_type_domain']['id'] = 'field_type_domain';
  $handler->display->display_options['fields']['field_type_domain']['table'] = 'field_data_field_type_domain';
  $handler->display->display_options['fields']['field_type_domain']['field'] = 'field_type_domain';
  $handler->display->display_options['fields']['field_type_domain']['label'] = '';
  $handler->display->display_options['fields']['field_type_domain']['element_label_colon'] = FALSE;
  $handler->display->display_options['fields']['field_type_domain']['empty'] = 'N/A';
  $handler->display->display_options['fields']['field_type_domain']['group_rows'] = FALSE;
  $handler->display->display_options['fields']['field_type_domain']['delta_offset'] = '0';
  /* Field: Content: Title */
  $handler->display->display_options['fields']['title']['id'] = 'title';
  $handler->display->display_options['fields']['title']['table'] = 'node';
  $handler->display->display_options['fields']['title']['field'] = 'title';
  $handler->display->display_options['fields']['title']['label'] = '';
  $handler->display->display_options['fields']['title']['element_label_colon'] = FALSE;
  $handler->display->display_options['defaults']['sorts'] = FALSE;
  /* Sort criterion: Content: Type Domain (field_type_domain) */
  $handler->display->display_options['sorts']['field_type_domain_tid']['id'] = 'field_type_domain_tid';
  $handler->display->display_options['sorts']['field_type_domain_tid']['table'] = 'field_data_field_type_domain';
  $handler->display->display_options['sorts']['field_type_domain_tid']['field'] = 'field_type_domain_tid';
  $handler->display->display_options['sorts']['field_type_domain_tid']['order'] = 'DESC';
  /* Sort criterion: Content: Weight in Views (field_weight_in_views) */
  $handler->display->display_options['sorts']['field_weight_in_views_value']['id'] = 'field_weight_in_views_value';
  $handler->display->display_options['sorts']['field_weight_in_views_value']['table'] = 'field_data_field_weight_in_views';
  $handler->display->display_options['sorts']['field_weight_in_views_value']['field'] = 'field_weight_in_views_value';
  $handler->display->display_options['sorts']['field_weight_in_views_value']['order'] = 'DESC';
  /* Sort criterion: Content: Title */
  $handler->display->display_options['sorts']['title']['id'] = 'title';
  $handler->display->display_options['sorts']['title']['table'] = 'node';
  $handler->display->display_options['sorts']['title']['field'] = 'title';
  $handler->display->display_options['path'] = 'projects';

  /* Display: Domain */
  $handler = $view->new_display('page', 'Domain', 'page_1');
  $handler->display->display_options['defaults']['style_plugin'] = FALSE;
  $handler->display->display_options['style_plugin'] = 'list';
  $handler->display->display_options['style_options']['grouping'] = array(
    0 => array(
      'field' => 'field_type_domain',
      'rendered' => 1,
      'rendered_strip' => 0,
    ),
    1 => array(
      'field' => 'title',
      'rendered' => 1,
      'rendered_strip' => 0,
    ),
  );
  $handler->display->display_options['style_options']['uses_fields'] = TRUE;
  $handler->display->display_options['defaults']['style_options'] = FALSE;
  $handler->display->display_options['defaults']['row_plugin'] = FALSE;
  $handler->display->display_options['row_plugin'] = 'node';
  $handler->display->display_options['defaults']['row_options'] = FALSE;
  $handler->display->display_options['defaults']['fields'] = FALSE;
  /* Field: Content: Weight in Views */
  $handler->display->display_options['fields']['field_weight_in_views']['id'] = 'field_weight_in_views';
  $handler->display->display_options['fields']['field_weight_in_views']['table'] = 'field_data_field_weight_in_views';
  $handler->display->display_options['fields']['field_weight_in_views']['field'] = 'field_weight_in_views';
  $handler->display->display_options['fields']['field_weight_in_views']['settings'] = array(
    'thousand_separator' => ' ',
    'prefix_suffix' => 1,
  );
  /* Field: Content: Type Domain */
  $handler->display->display_options['fields']['field_type_domain']['id'] = 'field_type_domain';
  $handler->display->display_options['fields']['field_type_domain']['table'] = 'field_data_field_type_domain';
  $handler->display->display_options['fields']['field_type_domain']['field'] = 'field_type_domain';
  $handler->display->display_options['fields']['field_type_domain']['label'] = '';
  $handler->display->display_options['fields']['field_type_domain']['element_label_colon'] = FALSE;
  $handler->display->display_options['fields']['field_type_domain']['empty'] = 'N/A';
  $handler->display->display_options['fields']['field_type_domain']['group_rows'] = FALSE;
  $handler->display->display_options['fields']['field_type_domain']['delta_offset'] = '0';
  /* Field: Content: Title */
  $handler->display->display_options['fields']['title']['id'] = 'title';
  $handler->display->display_options['fields']['title']['table'] = 'node';
  $handler->display->display_options['fields']['title']['field'] = 'title';
  $handler->display->display_options['fields']['title']['label'] = '';
  $handler->display->display_options['fields']['title']['element_label_colon'] = FALSE;
  $handler->display->display_options['defaults']['sorts'] = FALSE;
  /* Sort criterion: Content: Type Domain (field_type_domain) */
  $handler->display->display_options['sorts']['field_type_domain_tid']['id'] = 'field_type_domain_tid';
  $handler->display->display_options['sorts']['field_type_domain_tid']['table'] = 'field_data_field_type_domain';
  $handler->display->display_options['sorts']['field_type_domain_tid']['field'] = 'field_type_domain_tid';
  $handler->display->display_options['sorts']['field_type_domain_tid']['order'] = 'DESC';
  /* Sort criterion: Content: Weight in Views (field_weight_in_views) */
  $handler->display->display_options['sorts']['field_weight_in_views_value']['id'] = 'field_weight_in_views_value';
  $handler->display->display_options['sorts']['field_weight_in_views_value']['table'] = 'field_data_field_weight_in_views';
  $handler->display->display_options['sorts']['field_weight_in_views_value']['field'] = 'field_weight_in_views_value';
  $handler->display->display_options['sorts']['field_weight_in_views_value']['order'] = 'DESC';
  /* Sort criterion: Content: Title */
  $handler->display->display_options['sorts']['title']['id'] = 'title';
  $handler->display->display_options['sorts']['title']['table'] = 'node';
  $handler->display->display_options['sorts']['title']['field'] = 'title';
  $handler->display->display_options['path'] = 'projects/domain';
  $handler->display->display_options['menu']['type'] = 'tab';
  $handler->display->display_options['menu']['title'] = 'Domain';
  $handler->display->display_options['menu']['weight'] = '0';
  $handler->display->display_options['menu']['name'] = 'main-menu';
  $handler->display->display_options['menu']['context'] = 0;
  $handler->display->display_options['menu']['context_only_inline'] = 0;
  $handler->display->display_options['tab_options']['weight'] = '0';

  /* Display: Architectural Layer */
  $handler = $view->new_display('page', 'Architectural Layer', 'page_2');
  $handler->display->display_options['defaults']['style_plugin'] = FALSE;
  $handler->display->display_options['style_plugin'] = 'list';
  $handler->display->display_options['style_options']['grouping'] = array(
    0 => array(
      'field' => 'field_type_architectural_layer',
      'rendered' => 1,
      'rendered_strip' => 0,
    ),
    1 => array(
      'field' => 'title',
      'rendered' => 1,
      'rendered_strip' => 0,
    ),
  );
  $handler->display->display_options['style_options']['uses_fields'] = TRUE;
  $handler->display->display_options['defaults']['style_options'] = FALSE;
  $handler->display->display_options['defaults']['row_plugin'] = FALSE;
  $handler->display->display_options['row_plugin'] = 'node';
  $handler->display->display_options['defaults']['row_options'] = FALSE;
  $handler->display->display_options['defaults']['fields'] = FALSE;
  /* Field: Content: Weight in Views */
  $handler->display->display_options['fields']['field_weight_in_views']['id'] = 'field_weight_in_views';
  $handler->display->display_options['fields']['field_weight_in_views']['table'] = 'field_data_field_weight_in_views';
  $handler->display->display_options['fields']['field_weight_in_views']['field'] = 'field_weight_in_views';
  $handler->display->display_options['fields']['field_weight_in_views']['settings'] = array(
    'thousand_separator' => ' ',
    'prefix_suffix' => 1,
  );
  /* Field: Content: Type Architectural Layer */
  $handler->display->display_options['fields']['field_type_architectural_layer']['id'] = 'field_type_architectural_layer';
  $handler->display->display_options['fields']['field_type_architectural_layer']['table'] = 'field_data_field_type_architectural_layer';
  $handler->display->display_options['fields']['field_type_architectural_layer']['field'] = 'field_type_architectural_layer';
  $handler->display->display_options['fields']['field_type_architectural_layer']['label'] = '';
  $handler->display->display_options['fields']['field_type_architectural_layer']['element_type'] = 'strong';
  $handler->display->display_options['fields']['field_type_architectural_layer']['element_label_colon'] = FALSE;
  $handler->display->display_options['fields']['field_type_architectural_layer']['empty'] = 'N/A';
  $handler->display->display_options['fields']['field_type_architectural_layer']['group_rows'] = FALSE;
  $handler->display->display_options['fields']['field_type_architectural_layer']['delta_offset'] = '0';
  /* Field: Content: Title */
  $handler->display->display_options['fields']['title']['id'] = 'title';
  $handler->display->display_options['fields']['title']['table'] = 'node';
  $handler->display->display_options['fields']['title']['field'] = 'title';
  $handler->display->display_options['fields']['title']['label'] = '';
  $handler->display->display_options['fields']['title']['element_label_colon'] = FALSE;
  $handler->display->display_options['defaults']['sorts'] = FALSE;
  /* Sort criterion: Content: Type Architectural Layer (field_type_architectural_layer) */
  $handler->display->display_options['sorts']['field_type_architectural_layer_tid']['id'] = 'field_type_architectural_layer_tid';
  $handler->display->display_options['sorts']['field_type_architectural_layer_tid']['table'] = 'field_data_field_type_architectural_layer';
  $handler->display->display_options['sorts']['field_type_architectural_layer_tid']['field'] = 'field_type_architectural_layer_tid';
  $handler->display->display_options['sorts']['field_type_architectural_layer_tid']['order'] = 'DESC';
  /* Sort criterion: Content: Weight in Views (field_weight_in_views) */
  $handler->display->display_options['sorts']['field_weight_in_views_value']['id'] = 'field_weight_in_views_value';
  $handler->display->display_options['sorts']['field_weight_in_views_value']['table'] = 'field_data_field_weight_in_views';
  $handler->display->display_options['sorts']['field_weight_in_views_value']['field'] = 'field_weight_in_views_value';
  $handler->display->display_options['sorts']['field_weight_in_views_value']['order'] = 'DESC';
  /* Sort criterion: Content: Title */
  $handler->display->display_options['sorts']['title']['id'] = 'title';
  $handler->display->display_options['sorts']['title']['table'] = 'node';
  $handler->display->display_options['sorts']['title']['field'] = 'title';
  $handler->display->display_options['path'] = 'projects/architectural-layer';
  $handler->display->display_options['menu']['type'] = 'tab';
  $handler->display->display_options['menu']['title'] = 'Architectural Layer';
  $handler->display->display_options['menu']['weight'] = '0';
  $handler->display->display_options['menu']['name'] = 'main-menu';
  $handler->display->display_options['menu']['context'] = 0;
  $handler->display->display_options['menu']['context_only_inline'] = 0;

  /* Display: Funding Agency */
  $handler = $view->new_display('page', 'Funding Agency', 'page_3');
  $handler->display->display_options['defaults']['style_plugin'] = FALSE;
  $handler->display->display_options['style_plugin'] = 'list';
  $handler->display->display_options['style_options']['grouping'] = array(
    0 => array(
      'field' => 'field_type_funding_agency',
      'rendered' => 1,
      'rendered_strip' => 0,
    ),
    1 => array(
      'field' => 'title',
      'rendered' => 1,
      'rendered_strip' => 0,
    ),
  );
  $handler->display->display_options['style_options']['uses_fields'] = TRUE;
  $handler->display->display_options['defaults']['style_options'] = FALSE;
  $handler->display->display_options['defaults']['row_plugin'] = FALSE;
  $handler->display->display_options['row_plugin'] = 'node';
  $handler->display->display_options['defaults']['row_options'] = FALSE;
  $handler->display->display_options['defaults']['fields'] = FALSE;
  /* Field: Content: Weight in Views */
  $handler->display->display_options['fields']['field_weight_in_views']['id'] = 'field_weight_in_views';
  $handler->display->display_options['fields']['field_weight_in_views']['table'] = 'field_data_field_weight_in_views';
  $handler->display->display_options['fields']['field_weight_in_views']['field'] = 'field_weight_in_views';
  $handler->display->display_options['fields']['field_weight_in_views']['settings'] = array(
    'thousand_separator' => ' ',
    'prefix_suffix' => 1,
  );
  /* Field: Content: Type Funding Agency */
  $handler->display->display_options['fields']['field_type_funding_agency']['id'] = 'field_type_funding_agency';
  $handler->display->display_options['fields']['field_type_funding_agency']['table'] = 'field_data_field_type_funding_agency';
  $handler->display->display_options['fields']['field_type_funding_agency']['field'] = 'field_type_funding_agency';
  $handler->display->display_options['fields']['field_type_funding_agency']['label'] = '';
  $handler->display->display_options['fields']['field_type_funding_agency']['element_label_colon'] = FALSE;
  $handler->display->display_options['fields']['field_type_funding_agency']['empty'] = 'N/A';
  $handler->display->display_options['fields']['field_type_funding_agency']['group_rows'] = FALSE;
  $handler->display->display_options['fields']['field_type_funding_agency']['delta_offset'] = '0';
  /* Field: Content: Title */
  $handler->display->display_options['fields']['title']['id'] = 'title';
  $handler->display->display_options['fields']['title']['table'] = 'node';
  $handler->display->display_options['fields']['title']['field'] = 'title';
  $handler->display->display_options['fields']['title']['label'] = '';
  $handler->display->display_options['fields']['title']['element_label_colon'] = FALSE;
  $handler->display->display_options['defaults']['sorts'] = FALSE;
  /* Sort criterion: Content: Type Funding Agency (field_type_funding_agency) */
  $handler->display->display_options['sorts']['field_type_funding_agency_tid']['id'] = 'field_type_funding_agency_tid';
  $handler->display->display_options['sorts']['field_type_funding_agency_tid']['table'] = 'field_data_field_type_funding_agency';
  $handler->display->display_options['sorts']['field_type_funding_agency_tid']['field'] = 'field_type_funding_agency_tid';
  $handler->display->display_options['sorts']['field_type_funding_agency_tid']['order'] = 'DESC';
  /* Sort criterion: Content: Weight in Views (field_weight_in_views) */
  $handler->display->display_options['sorts']['field_weight_in_views_value']['id'] = 'field_weight_in_views_value';
  $handler->display->display_options['sorts']['field_weight_in_views_value']['table'] = 'field_data_field_weight_in_views';
  $handler->display->display_options['sorts']['field_weight_in_views_value']['field'] = 'field_weight_in_views_value';
  $handler->display->display_options['sorts']['field_weight_in_views_value']['order'] = 'DESC';
  /* Sort criterion: Content: Title */
  $handler->display->display_options['sorts']['title']['id'] = 'title';
  $handler->display->display_options['sorts']['title']['table'] = 'node';
  $handler->display->display_options['sorts']['title']['field'] = 'title';
  $handler->display->display_options['path'] = 'projects/funding-agency';
  $handler->display->display_options['menu']['type'] = 'tab';
  $handler->display->display_options['menu']['title'] = 'Funding Agency';
  $handler->display->display_options['menu']['weight'] = '0';
  $handler->display->display_options['menu']['name'] = 'main-menu';
  $handler->display->display_options['menu']['context'] = 0;
  $handler->display->display_options['menu']['context_only_inline'] = 0;
  $export['projects_list'] = $view;

  return $export;
}
