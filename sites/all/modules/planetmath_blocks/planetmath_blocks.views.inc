<?php

function planetmath_blocks_views_query_alter(&$view, &$query) {
  switch($view->name) {
    case 'problems':  
      $contextual_filter=$view->argument['nid']->value[0];
      // removing this thing by number is EXTREMELY hackish,
      // but it's the only thing that made sense to do in the current circumstances
      unset($query->where[0]['conditions'][2]);
      if(is_numeric($contextual_filter)) {
	//dd("ADDING JOIN!");
	$join = new views_join;
	$join->construct('article_has_problem','node','nid','pid',NULL,"INNER");
	$query->add_relationship('ahp',$join,'article_has_problem');
	$query->add_where(0,"ahp.aid","$contextual_filter","=");
      }
      //$selectQ = $query->query();
      //dpm((string)($selectQ));
      //dpm($query);
      break;
  }
}
