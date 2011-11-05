<?php
/**
 * @file
 * planetmath_encyclopedia.relation_default.inc
 */

/**
 * Implements hook_relation_default_relation_types().
 */
function planetmath_encyclopedia_relation_default_relation_types() {
  $export = array();

  $relation_type = new stdClass;
  $relation_type->disabled = FALSE; /* Edit this to true to make a default relation_type disabled initially */
  $relation_type->api_version = 1;
  $relation_type->relation_type = 'correction_article';
  $relation_type->label = 'Correction-Article';
  $relation_type->reverse_label = '';
  $relation_type->directional = 0;
  $relation_type->transitive = 0;
  $relation_type->r_unique = 1;
  $relation_type->min_arity = 2;
  $relation_type->max_arity = 2;
  $export['correction_article'] = $relation_type;

  $relation_type = new stdClass;
  $relation_type->disabled = FALSE; /* Edit this to true to make a default relation_type disabled initially */
  $relation_type->api_version = 1;
  $relation_type->relation_type = 'hassolution';
  $relation_type->label = 'HasSolution';
  $relation_type->reverse_label = 'SolutionTo';
  $relation_type->directional = 1;
  $relation_type->transitive = 0;
  $relation_type->r_unique = 0;
  $relation_type->min_arity = 2;
  $relation_type->max_arity = 2;
  $export['hassolution'] = $relation_type;

  return $export;
}
