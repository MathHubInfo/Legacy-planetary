-- (run "use demodb;" for the next part)
-- users

ALTER TABLE planetmath_users ADD epoch_joined int(11);
UPDATE planetmath_users SET epoch_joined = UNIX_TIMESTAMP(joined);

ALTER TABLE planetmath_users ADD epoch_last int(11);
UPDATE planetmath_users SET epoch_last = UNIX_TIMESTAMP(last);

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

-- comments

UPDATE planetmath_messages SET subject = CONCAT(SUBSTR(subject,1,60), '...') WHERE LENGTH(subject) > 60;

ALTER TABLE planetmath_messages ADD epoch_created int(11);
UPDATE planetmath_messages SET epoch_created = UNIX_TIMESTAMP(created);

ALTER TABLE planetmath_messages ADD username varchar(32);
UPDATE planetmath_messages, planetmath_users 
  SET planetmath_messages.username = planetmath_users.username
  WHERE planetmath_messages.userid = planetmath_users.uid;

CREATE TABLE planetmath_forum_ops LIKE planetmath_messages; 
INSERT INTO planetmath_forum_ops SELECT * FROM planetmath_messages WHERE tbl = 'forums' AND replyto = '-1'; 

CREATE TABLE planetmath_forum_comments LIKE planetmath_messages;
INSERT INTO planetmath_forum_comments SELECT * FROM planetmath_messages WHERE tbl='forums' AND replyto <> '-1'; 

CREATE TABLE planetmath_forum_first_comments LIKE planetmath_messages;
INSERT INTO planetmath_forum_first_comments SELECT * FROM planetmath_forum_comments;
DELETE FROM planetmath_forum_first_comments WHERE replyto NOT IN (SELECT uid FROM planetmath_forum_ops);
DELETE FROM planetmath_forum_comments WHERE uid IN (SELECT uid FROM planetmath_forum_first_comments);

CREATE TABLE planetmath_object_comments LIKE planetmath_messages; 
INSERT INTO planetmath_object_comments SELECT * FROM planetmath_messages WHERE tbl = 'objects';

CREATE TABLE planetmath_correction_comments LIKE planetmath_messages; 
INSERT INTO planetmath_correction_comments SELECT * FROM planetmath_messages WHERE tbl = 'corrections';

CREATE TABLE planetmath_request_comments LIKE planetmath_messages; 
INSERT INTO planetmath_request_comments SELECT * FROM planetmath_messages WHERE tbl = 'requests'; 

-- PlanetMath System Updates and News
UPDATE planetmath_forum_ops SET objectid = 1 WHERE objectid = 0;
-- PlanetMath Comments = 2
-- Competition questions
UPDATE planetmath_forum_ops SET objectid = 3 WHERE objectid = 230;  
-- High School/Secondary
UPDATE planetmath_forum_ops SET objectid = 4 WHERE objectid = 232;  
-- Math Humor
UPDATE planetmath_forum_ops SET objectid = 5 WHERE objectid = 233;  
-- University/Tertiary
UPDATE planetmath_forum_ops SET objectid = 6 WHERE objectid = 234;  
-- Testing
UPDATE planetmath_forum_ops SET objectid = 7 WHERE objectid = 235;  
-- LaTeX help
UPDATE planetmath_forum_ops SET objectid = 8 WHERE objectid = 236;  
-- PlanetMath help
UPDATE planetmath_forum_ops SET objectid = 9 WHERE objectid = 237;  
-- The Math Pub
UPDATE planetmath_forum_ops SET objectid = 10 WHERE objectid = 238; 
-- Graduate/Advanced
UPDATE planetmath_forum_ops SET objectid = 11 WHERE objectid = 239; 
-- Research/Postgrad
UPDATE planetmath_forum_ops SET objectid = 12 WHERE objectid = 240; 
-- Industry/Practice
UPDATE planetmath_forum_ops SET objectid = 13 WHERE objectid = 241; 
-- Math History
UPDATE planetmath_forum_ops SET objectid = 14 WHERE objectid = 242; 
-- Strategic Communications Development
UPDATE planetmath_forum_ops SET objectid = 15 WHERE objectid = 245; 
-- PlanetMath Organization Discussion
UPDATE planetmath_forum_ops SET objectid = 16 WHERE objectid = 246; 

UPDATE planetmath_forum_comments SET objectid = 1 WHERE objectid = 0;
UPDATE planetmath_forum_comments SET objectid = 3 WHERE objectid = 230;  
UPDATE planetmath_forum_comments SET objectid = 4 WHERE objectid = 232;  
UPDATE planetmath_forum_comments SET objectid = 5 WHERE objectid = 233;  
UPDATE planetmath_forum_comments SET objectid = 6 WHERE objectid = 234;  
UPDATE planetmath_forum_comments SET objectid = 7 WHERE objectid = 235;  
UPDATE planetmath_forum_comments SET objectid = 8 WHERE objectid = 236;  
UPDATE planetmath_forum_comments SET objectid = 9 WHERE objectid = 237;  
UPDATE planetmath_forum_comments SET objectid = 10 WHERE objectid = 238; 
UPDATE planetmath_forum_comments SET objectid = 11 WHERE objectid = 239; 
UPDATE planetmath_forum_comments SET objectid = 12 WHERE objectid = 240; 
UPDATE planetmath_forum_comments SET objectid = 13 WHERE objectid = 241; 
UPDATE planetmath_forum_comments SET objectid = 14 WHERE objectid = 242; 
UPDATE planetmath_forum_comments SET objectid = 15 WHERE objectid = 245; 
UPDATE planetmath_forum_comments SET objectid = 16 WHERE objectid = 246; 

-- These commands adjust indexing of objects so that everything can be imported in one swoop

UPDATE planetmath_objects SET uid=uid+30000;
UPDATE planetmath_object_comments SET objectid=objectid+30000, replyto=replyto+30000;
UPDATE planetmath_acl SET objectid=objectid+30000;

-- See tables-into-drupal-pt3.sql for the next step