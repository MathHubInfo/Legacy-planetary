<?php

/* Implements hook_views_query_alter
 *
 * It makes sense to deal with these particular cases this way --
 *
 * Note, we initially deal w/ "reverse problems" ("the articles attached to
 * this problem") in the same way, though we have to clone the articles view 
 * in order to switch on the view's name.  Further node: the "reverse problems"
 * view will actually be a very interesting example of the sort of thing we can deal
 * with nicely with SPARQL:  We would like to pull up a view that adds in the
 * articles that are only *referenced* in the problem source code (w/ autolinks
 * found via NNexus).  This would make a very nice demo of what we can do with
 * the current "stack", particularly if we bring the full-text of these articles
 * into the view, *optionally* showing that above the problem when it's being solved,
 * folded and unfolded via the relevant Javascript plugin... !
 *
 * Eventually we should also have "problem sets" that are different from "problems",
 * those could be added here (just as a filtered view of "collections", maybe
 * collections should have a "subtype" that allows someone to flag it as a 
 * problem set).  They too might have an "inverse image" in the collection of
 * articles, however.
 *
 * (On the other hand, "versions" should probably be dealt with some other way.)
 *
 */

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

    case 'corrections':  
      $contextual_filter=$view->argument['nid']->value[0];
      unset($query->where[0]['conditions'][2]);
      if(is_numeric($contextual_filter)) {
	$join = new views_join;
	$join->construct('field_data_field_correction_article','node','nid','field_correction_article_nid',NULL,"INNER");
	$query->add_relationship('cha',$join,'field_data_field_correction_article');
	$query->add_where(0,"cha.field_revision_field_correction_article","$contextual_filter","=");
      }
      break;
    case 'solutions':  
      $contextual_filter=$view->argument['nid']->value[0];
      unset($query->where[0]['conditions'][2]);
      if(is_numeric($contextual_filter)) {
	$join = new views_join;
	$join->construct('problem_has_solution','node','nid','sid',NULL,"INNER");
	$query->add_relationship('phs',$join,'problem_has_solution');
	$query->add_where(0,"phs.pid","$contextual_filter","=");
      }
      break;
    case 'reviews':  
      $contextual_filter=$view->argument['nid']->value[0];
      unset($query->where[0]['conditions'][2]);
      if(is_numeric($contextual_filter)) {
	$join = new views_join;
	$join->construct('solution_has_review','node','nid','rid',NULL,"INNER");
	$query->add_relationship('shr',$join,'solution_has_review');
	$query->add_where(0,"shr.sid","$contextual_filter","=");
      }

    case 'articles_':  // "reverse problems", see comments above
      $contextual_filter=$view->argument['nid']->value[0];
      unset($query->where[0]['conditions'][2]);
      if(is_numeric($contextual_filter)) {
	$join = new views_join;
	$join->construct('article_has_problem','node','nid','aid',NULL,"INNER");
	$query->add_relationship('ahp',$join,'article_has_problem');
	$query->add_where(0,"ahp.pid","$contextual_filter","=");
      }
      break;
  }
}
