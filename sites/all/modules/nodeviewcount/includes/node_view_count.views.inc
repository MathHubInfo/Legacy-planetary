<?php

function node_view_count_views_data() {
  $data = array();
  
  $data['node_view_count']['table']['group'] = t('Node count');
  
  $data['node_view_count']['table']['base'] = array(
    'field' => 'nid',
    'title' => t('Node view count'), 
    'help' => t('This table is containing the data about count view of node.'), 
    'weight' => -10,
  );
  
  $data['node_view_count']['table']['join'] = array(
    'node' => array(  
      'handler' => 'views_join',
      'left_table' => 'node',  
      'left_field' => 'nid',
      'field' => 'nid',
    ),    
  );
  
  $data['node_view_count']['nid'] = array(
    'title' => t('Node id'),
    'help' => t('Node id.'), 
    'field' => array(
       'handler' => 'views_handler_field_numeric',
       'click sortable' => TRUE,
      ),
     'filter' => array(
       'handler' => 'views_handler_filter_numeric',
     ),
     'sort' => array(
       'handler' => 'views_handler_sort',
     ),
     'argument' => array(
      'handler' => 'views_handler_argument_numeric',
    ),  
  );
  
  $data['node_view_count']['uid'] = array(
    'title' => t('Who view'),
    'help' => t('Who view  of node.'),         
    'field' => array(
       'handler' => 'views_handler_field_numeric',
       'click sortable' => TRUE,
      ),
     'filter' => array(
       'handler' => 'views_handler_filter_numeric',
     ),
     'sort' => array(
       'handler' => 'views_handler_sort',
     ), 
     'argument' => array(
      'handler' => 'views_handler_argument_numeric',
    ), 
  );

  $data['node_view_count']['timestamp'] = array(
    'title' => t('Timestamp'),
    'help' => t('When user view of node.'), 
    'field' => array(
       'handler' => 'views_handler_field_date',
       'click sortable' => TRUE,
      ),
     'filter' => array(
       'handler' => 'views_handler_filter_date',
     ),
     'sort' => array(
       'handler' => 'views_handler_sort_date',
     ),  
  );
      
  return $data;  
}