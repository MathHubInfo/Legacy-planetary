-- Note: replace "drupaldb" in this file with the name of your actual drupal database!
-- sed -i 's/drupaldb/real-database-name/g' tables-into-drupal.sql

-- Assuming you've got a Noosphere dump, first run something like this to import it:

-- mysql> grant all on planetary.* to 'planetary'@localhost identified by 'PASSWORD';
-- mysql> create database planetary;
-- $ mysql -u planetary --password=PASSWORD planetary < pm-alltables-20110411.sql

-- Then moving content by loading this file.
-- The simplest way to do this is:
-- $ mysql -u root --password=PASSWORD drupaldb < tables-into-drupal.sql

-- (Note that you *could* give access to the planetary database to the drupaldb user,
-- but that's an extra configuration step.)

-- Next: you will have to do further configurations, which are in
-- tables-into-drupal-pt2.sql and tables-into-drupal-pt3.sql

-- Those can be run as the drupaldb user.  Details follow:

-- BEFORE Drupal migrations:
-- $ mysql -u drupaldb --password=PASSWORD drupaldb < tables-into-drupal-pt2.sql

-- AFTER Drupal migrations:
-- $ mysql -u drupaldb --password=PASSWORD drupaldb < tables-into-drupal-pt3.sql

-- See those files for specific commands.

CREATE TABLE drupaldb.planetmath_users LIKE planetary.users;
INSERT INTO drupaldb.planetmath_users SELECT * FROM planetary.users;

CREATE TABLE drupaldb.planetmath_objects LIKE planetary.objects;
INSERT INTO drupaldb.planetmath_objects SELECT * FROM planetary.objects;

CREATE TABLE drupaldb.planetmath_collab LIKE planetary.collab;
INSERT INTO drupaldb.planetmath_collab SELECT * FROM planetary.collab;

CREATE TABLE drupaldb.planetmath_messages LIKE planetary.messages;
INSERT INTO drupaldb.planetmath_messages SELECT * FROM planetary.messages;

CREATE TABLE drupaldb.planetmath_acl LIKE planetary.acl;
INSERT INTO drupaldb.planetmath_acl SELECT * FROM planetary.acl;

CREATE TABLE drupaldb.planetmath_groups LIKE planetary.groups;
INSERT INTO drupaldb.planetmath_groups SELECT * FROM planetary.groups;

CREATE TABLE drupaldb.planetmath_group_members LIKE planetary.group_members;
INSERT INTO drupaldb.planetmath_group_members SELECT * FROM planetary.group_members;

CREATE TABLE drupaldb.planetmath_corrections LIKE planetary.corrections;
INSERT INTO drupaldb.planetmath_corrections SELECT * FROM planetary.corrections;

CREATE TABLE drupaldb.planetmath_requests LIKE planetary.requests;
INSERT INTO drupaldb.planetmath_requests SELECT * FROM planetary.requests;

CREATE TABLE drupaldb.planetmath_classification LIKE planetary.classification;
INSERT INTO drupaldb.planetmath_classification SELECT * FROM planetary.classification;

CREATE TABLE drupaldb.planetmath_msc LIKE planetary.msc;
INSERT INTO drupaldb.planetmath_msc SELECT * FROM planetary.msc;

CREATE TABLE drupaldb.planetmath_authors LIKE planetary.authors;
INSERT INTO drupaldb.planetmath_authors SELECT * FROM planetary.authors;

-- See tables-into-drupal-pt2.sql for the next step
