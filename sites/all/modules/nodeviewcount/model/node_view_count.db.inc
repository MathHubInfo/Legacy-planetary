<?php 

function node_view_count_count_view_insert($nid, $uid) {
  $fields = array(
    'nid' => $nid,  
    'uid' => $uid,
    'timestamp' => REQUEST_TIME,
  );
  return drupal_write_record('node_view_count', $fields);
}

function node_view_count_count_view_select($nid, $uid) {
  $query = db_select('node_view_count', 'nvc');
  $query->fields('nvc', array('nid'));  
  $query->condition('nid', $nid, '=');
  $query->condition('uid', $uid, '=');
  $result = $query->execute()->fetchAll();
  
  return $result;
}