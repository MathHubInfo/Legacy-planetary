-- (run "use demodb;" for the next part)
-- users

ALTER TABLE planetmath_users ADD epoch_joined int(11);
UPDATE planetmath_users SET epoch_joined = UNIX_TIMESTAMP(joined);

ALTER TABLE planetmath_users ADD epoch_last int(11);
UPDATE planetmath_users SET epoch_last = UNIX_TIMESTAMP(last);

-- in order to simplify things we can leave unteleported all users
-- who didn't ever contribute in the last epoch of PlanetMath
-- (this line can be removed if we change our minds about this harsh measure...)
DELETE FROM planetmath_users WHERE score = 0;

-- articles

ALTER TABLE planetmath_objects ADD epoch_created int(11);
UPDATE planetmath_objects SET epoch_created = UNIX_TIMESTAMP(created);

ALTER TABLE planetmath_objects ADD epoch_modified int(11);
UPDATE planetmath_objects SET epoch_modified = UNIX_TIMESTAMP(modified);

-- adding MSC info

ALTER TABLE planetmath_objects ADD msc_class text(255);
UPDATE planetmath_objects SET msc_class = (select group_concat(planetmath_msc.id separator ', ') as msc_class_string from planetmath_msc , planetmath_classification where planetmath_classification.objectid=planetmath_objects.uid and planetmath_classification.catid = planetmath_msc.uid);

-- (untested) adding authors info, this will have to be added to the Drupal migration as well!

ALTER TABLE planetmath_objects add authors text;
UPDATE planetmath_objects SET authors = (select group_concat(planetmath_authors.userid separator ', ') as authors_string from planetmath_authors where planetmath_authors.objectid=planetmath_objects.uid and planetmath_authors.tbl = 'objects');

-- make the mathtype information transparent, so we can use something meaningful in our migration.

ALTER TABLE planetmath_objects ADD type_string text(255);
UPDATE planetmath_objects SET type_string = 'Theorem' WHERE planetmath_objects.type          = 1;
UPDATE planetmath_objects SET type_string = 'Corollary' WHERE planetmath_objects.type        = 2;
UPDATE planetmath_objects SET type_string = 'Definition' WHERE planetmath_objects.type       = 5;
UPDATE planetmath_objects SET type_string = 'Result' WHERE planetmath_objects.type           = 6;
UPDATE planetmath_objects SET type_string = 'Proof' WHERE planetmath_objects.type            = 3;
UPDATE planetmath_objects SET type_string = 'Algorithm' WHERE planetmath_objects.type        = 17;
UPDATE planetmath_objects SET type_string = 'Data Structure' WHERE planetmath_objects.type   = 19;
UPDATE planetmath_objects SET type_string = 'Axiom' WHERE planetmath_objects.type            = 20;
UPDATE planetmath_objects SET type_string = 'Topic' WHERE planetmath_objects.type            = 21;
UPDATE planetmath_objects SET type_string = 'Biography' WHERE planetmath_objects.type        = 22;
UPDATE planetmath_objects SET type_string = 'Example' WHERE planetmath_objects.type          = 7;
UPDATE planetmath_objects SET type_string = 'Derivation' WHERE planetmath_objects.type       = 25;
UPDATE planetmath_objects SET type_string = 'Conjecture' WHERE planetmath_objects.type       = 24;
UPDATE planetmath_objects SET type_string = 'Application' WHERE planetmath_objects.type      = 26;
UPDATE planetmath_objects SET type_string = 'Feature' WHERE planetmath_objects.type          = 27;
UPDATE planetmath_objects SET type_string = 'Bibliography' WHERE planetmath_objects.type     = 28;

-- requests

ALTER TABLE planetmath_requests ADD epoch_created int(11);
UPDATE planetmath_requests SET epoch_created = UNIX_TIMESTAMP(created);

ALTER TABLE planetmath_requests ADD epoch_closed int(11);
UPDATE planetmath_requests SET epoch_closed = UNIX_TIMESTAMP(closed);

-- collabs

ALTER TABLE planetmath_collab ADD epoch_created int(11);
UPDATE planetmath_collab SET epoch_created = UNIX_TIMESTAMP(created);

ALTER TABLE planetmath_collab ADD epoch_modified int(11);
UPDATE planetmath_collab SET epoch_modified = UNIX_TIMESTAMP(modified);

-- corrections

ALTER TABLE planetmath_corrections ADD epoch_filed int(11);
UPDATE planetmath_corrections SET epoch_filed = UNIX_TIMESTAMP(filed);

ALTER TABLE planetmath_corrections ADD epoch_closed int(11);
UPDATE planetmath_corrections SET epoch_closed = UNIX_TIMESTAMP(closed);

ALTER TABLE planetmath_corrections ADD was_closed int(11) DEFAULT 0;
UPDATE planetmath_corrections SET was_closed = 1 WHERE IFNULL(closed,0) <> 0;

-- comments

UPDATE planetmath_messages SET subject = CONCAT(SUBSTR(subject,1,60), '...') WHERE LENGTH(subject) > 60;

ALTER TABLE planetmath_messages ADD epoch_created int(11);
UPDATE planetmath_messages SET epoch_created = UNIX_TIMESTAMP(created);

ALTER TABLE planetmath_messages ADD username varchar(32);
UPDATE planetmath_messages, planetmath_users
  SET planetmath_messages.username = planetmath_users.username
  WHERE planetmath_messages.userid = planetmath_users.uid;

-- do this once here so we don't have to do it several times below for the derived tables
UPDATE planetmath_messages SET objectid = 1 WHERE objectid = 0;
UPDATE planetmath_messages SET objectid = 3 WHERE objectid = 230;
UPDATE planetmath_messages SET objectid = 4 WHERE objectid = 232;
UPDATE planetmath_messages SET objectid = 5 WHERE objectid = 233;
UPDATE planetmath_messages SET objectid = 6 WHERE objectid = 234;
UPDATE planetmath_messages SET objectid = 7 WHERE objectid = 235;
UPDATE planetmath_messages SET objectid = 8 WHERE objectid = 236;
UPDATE planetmath_messages SET objectid = 9 WHERE objectid = 237;
UPDATE planetmath_messages SET objectid = 10 WHERE objectid = 238;
UPDATE planetmath_messages SET objectid = 11 WHERE objectid = 239;
UPDATE planetmath_messages SET objectid = 12 WHERE objectid = 240;
UPDATE planetmath_messages SET objectid = 13 WHERE objectid = 241;
UPDATE planetmath_messages SET objectid = 14 WHERE objectid = 242;
UPDATE planetmath_messages SET objectid = 15 WHERE objectid = 245;
UPDATE planetmath_messages SET objectid = 16 WHERE objectid = 246;

CREATE TABLE planetmath_forum_ops LIKE planetmath_messages;
INSERT INTO planetmath_forum_ops SELECT * FROM planetmath_messages WHERE tbl = 'forums' AND replyto = '-1';

CREATE TABLE planetmath_forum_comments LIKE planetmath_messages;
INSERT INTO planetmath_forum_comments SELECT * FROM planetmath_messages WHERE tbl='forums' AND replyto <> '-1';

ALTER TABLE planetmath_forum_comments ADD op int(11);

UPDATE planetmath_forum_comments SET op = replyto
WHERE replyto in (SELECT uid FROM planetmath_forum_ops);

CREATE TABLE intermediate (uid int(11), op int(11));

DELIMITER $$

DROP PROCEDURE IF EXISTS findparents$$

CREATE PROCEDURE findparents()
BEGIN

  DECLARE counter int DEFAULT 0;

  WHILE counter < 26 DO
    INSERT INTO intermediate (uid, op) select uid, (select op from planetmath_forum_comments as a where a.uid = b.replyto) as OP from planetmath_forum_comments as b where IFNULL(op,0)=0;
    UPDATE planetmath_forum_comments, intermediate SET planetmath_forum_comments.op = intermediate.op WHERE planetmath_forum_comments.uid = intermediate.uid;
    TRUNCATE intermediate;
    SET counter = counter + 1;
  END WHILE;
END$$

DELIMITER ;

CALL findparents();

-- Drupal considers comments with no parent to have pid 0.  This gets that info set up for import.
UPDATE planetmath_forum_comments SET planetmath_forum_comments.replyto = 0 WHERE planetmath_forum_comments.op = planetmath_forum_comments.replyto.

-- CREATE TABLE planetmath_forum_first_comments LIKE planetmath_messages;
-- INSERT INTO planetmath_forum_first_comments SELECT * FROM planetmath_forum_comments;
-- DELETE FROM planetmath_forum_first_comments WHERE replyto NOT IN (SELECT uid FROM planetmath_forum_ops);
-- DELETE FROM planetmath_forum_comments WHERE uid IN (SELECT uid FROM planetmath_forum_first_comments);

CREATE TABLE planetmath_object_comments LIKE planetmath_messages;
INSERT INTO planetmath_object_comments SELECT * FROM planetmath_messages WHERE tbl = 'objects';

CREATE TABLE planetmath_correction_comments LIKE planetmath_messages;
INSERT INTO planetmath_correction_comments SELECT * FROM planetmath_messages WHERE tbl = 'corrections';

CREATE TABLE planetmath_collab_comments LIKE planetmath_messages;
INSERT INTO planetmath_collab_comments SELECT * FROM planetmath_messages WHERE tbl = 'collab';

CREATE TABLE planetmath_request_comments LIKE planetmath_messages;
INSERT INTO planetmath_request_comments SELECT * FROM planetmath_messages WHERE tbl = 'requests';

-- These commands adjust indexing of objects so that everything can be imported in one swoop

UPDATE planetmath_objects SET uid=uid+30000;
UPDATE planetmath_object_comments SET objectid=objectid+30000, replyto=replyto+30000;
UPDATE planetmath_acl SET objectid=objectid+30000 where tbl='objects';

UPDATE planetmath_collab SET uid=uid+50000;
UPDATE planetmath_collab_comments SET objectid=objectid+50000, replyto=replyto+50000;
UPDATE planetmath_acl SET objectid=objectid+50000 where tbl='collab';

UPDATE planetmath_requests SET uid=uid+60000;
UPDATE planetmath_request_comments SET objectid=objectid+60000, replyto=replyto+60000;

UPDATE planetmath_corrections SET uid=uid+70000;
UPDATE planetmath_correction_comments SET objectid=objectid+70000, replyto=replyto+70000;

-- See tables-into-drupal-pt3.sql for the next step

-- iff you need to start over you can run these commands:
-- DROP TABLE planetmath_forum_ops ;
-- DROP TABLE planetmath_forum_comments ;
-- DROP TABLE intermediate ;
-- DROP TABLE planetmath_object_comments ;
-- DROP TABLE planetmath_correction_comments ;
-- DROP TABLE planetmath_request_comments ;
