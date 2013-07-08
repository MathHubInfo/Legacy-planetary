<?php
/**
 * @file
 * kwarc_members_contenttypes.features.taxonomy.inc
 */

/**
 * Implements hook_taxonomy_default_vocabularies().
 */
function kwarc_members_contenttypes_taxonomy_default_vocabularies() {
  return array(
    'kwarc_role' => array(
      'name' => 'KWARC Role',
      'machine_name' => 'kwarc_role',
      'description' => '',
      'hierarchy' => '1',
      'module' => 'taxonomy',
      'weight' => '0',
      'rdf_mapping' => array(
        'rdftype' => array(
          0 => 'skos:ConceptScheme',
        ),
        'name' => array(
          'predicates' => array(
            0 => 'dc:title',
          ),
        ),
        'description' => array(
          'predicates' => array(
            0 => 'rdfs:comment',
          ),
        ),
      ),
    ),
  );
}
