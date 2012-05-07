-- Some revisions are currently not handled by migrate --
--  tables-into-drupal-pt2.sq

INSERT INTO field_data_field_canonicalname 
  (entity_type, bundle, deleted, entity_id, revision_id, language, delta,
   field_canonicalname_value, field_canonicalname_format)
   SELECT 'node', 'article', 0, node.nid, node.vid, 'und', 0, planetmath_objects.name, NULL
   FROM planetmath_objects,node where node.nid = planetmath_objects.uid;

INSERT INTO field_revision_field_canonicalname
  (entity_type, bundle, deleted, entity_id, revision_id, language, delta,
   field_canonicalname_value, field_canonicalname_format)
   SELECT 'node', 'article', 0, node.nid, node.vid, 'und', 0, planetmath_objects.name, NULL
   FROM planetmath_objects,node where node.nid = planetmath_objects.uid;

INSERT INTO field_data_field_latex
 (entity_type, bundle, deleted, entity_id, revision_id, language, delta, field_latex_preamble, field_latex_document)
 SELECT 'node','article',0, uid, NULL,'und',0, preamble, data
 FROM planetmath_objects;

INSERT INTO field_data_field_msc
  (entity_type, bundle, deleted, entity_id, revision_id, language, delta, field_msc_value, field_msc_format)
  SELECT 'node','article',0,uid,NULL,'und',0,msc_class,NULL
  FROM planetmath_objects;

INSERT INTO userpoints (uid, points, max_points)
  SELECT entity_id,field_user_score_value,field_user_score_value 
  FROM field_data_field_user_score;

INSERT INTO userpoints_total (uid, points, max_points) 
  SELECT entity_id,field_user_score_value,field_user_score_value
  FROM field_data_field_user_score;
