-- Some revisions are currently not handled by migrate --
--  tables-into-drupal-pt2.sq

-- This updates the total without recording a specific transaction bringing
-- things up to date.  But hey, at least the totals are right.
UPDATE userpoints SET points = (SELECT score FROM planetmath_users WHERE planetmath_users.uid = userpoints.uid), max_points=points;

UPDATE userpoints_total SET points = (SELECT score FROM planetmath_users WHERE planetmath_users.uid = userpoints_total.uid), max_points=points;

INSERT INTO field_data_field_latex
 (entity_type, bundle, deleted, entity_id, revision_id, language, delta, field_latex_preamble, field_latex_document,field_latex_format)
 SELECT 'node','article',0, node.nid, node.vid,'und',0, planetmath_objects.preamble, planetmath_objects.data, 'tex_editor'
 FROM planetmath_objects,node where node.nid = planetmath_objects.uid;

INSERT INTO field_data_field_question_latex
 (entity_type, bundle, deleted, entity_id, revision_id, language, delta, field_question_latex_document,field_question_latex_preamble,field_question_latex_format)
 SELECT 'node','question',0, node.nid, node.vid,'und',0,data,'','tex_editor'
 FROM planetmath_requests,node where node.nid = planetmath_requests.uid;

INSERT INTO field_data_field_latex
 (entity_type, bundle, deleted, entity_id, revision_id, language, delta, field_latex_preamble, field_latex_document,field_latex_format)
 SELECT 'node','article',0, node.nid, node.vid,'und',0, '', planetmath_collab.data, 'tex_editor'
 FROM planetmath_collab,node where node.nid = planetmath_collab.uid;
