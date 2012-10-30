-- Note: replace "planetaryRC1" in this file with the name of your actual drupal database!
-- sed -i 's/planetaryRC1/real-database-name/g' tables-into-drupal.sql

-- Assuming you've got a Noosphere dump, first run something like this to import it:

-- mysql> grant all on planetary.* to 'planetary'@localhost identified by 'PASSWORD';
-- mysql> create database planetary;
-- $ mysql -u planetary --password=PASSWORD planetary < pm-alltables-20110411.sql

-- Then moving content by loading this file.
-- The simplest way to do this is:
-- $ mysql -u root --password=PASSWORD planetaryRC1 < tables-into-drupal.sql

-- (Note that you *could* give access to the planetary database to the planetaryRC1 user,
-- but that's an extra configuration step.)

-- Next: you will have to do further configurations, which are in
-- tables-into-drupal-pt2.sql and tables-into-drupal-pt3.sql

-- Those can be run as the planetaryRC1 user.  Details follow:

-- BEFORE Drupal migrations:
-- $ mysql -u planetaryRC1 --password=PASSWORD planetaryRC1 < tables-into-drupal-pt2.sql

-- AFTER Drupal migrations:
-- $ mysql -u planetaryRC1 --password=PASSWORD planetaryRC1 < tables-into-drupal-pt3.sql

-- See those files for specific commands.

CREATE TABLE planetaryRC1.planetmath_users LIKE staging.users;
INSERT INTO planetaryRC1.planetmath_users SELECT * FROM staging.users;

CREATE TABLE planetaryRC1.planetmath_objects LIKE staging.objects;
INSERT INTO planetaryRC1.planetmath_objects SELECT * FROM staging.objects;

CREATE TABLE planetaryRC1.planetmath_collab LIKE staging.collab;
INSERT INTO planetaryRC1.planetmath_collab SELECT * FROM staging.collab;

CREATE TABLE planetaryRC1.planetmath_messages LIKE staging.messages;
INSERT INTO planetaryRC1.planetmath_messages SELECT * FROM staging.messages;

CREATE TABLE planetaryRC1.planetmath_acl LIKE staging.acl;
INSERT INTO planetaryRC1.planetmath_acl SELECT * FROM staging.acl;

CREATE TABLE planetaryRC1.planetmath_groups LIKE staging.groups;
INSERT INTO planetaryRC1.planetmath_groups SELECT * FROM staging.groups;

CREATE TABLE planetaryRC1.planetmath_group_members LIKE staging.group_members;
INSERT INTO planetaryRC1.planetmath_group_members SELECT * FROM staging.group_members;

CREATE TABLE planetaryRC1.planetmath_corrections LIKE staging.corrections;
INSERT INTO planetaryRC1.planetmath_corrections SELECT * FROM staging.corrections;

CREATE TABLE planetaryRC1.planetmath_requests LIKE staging.requests;
INSERT INTO planetaryRC1.planetmath_requests SELECT * FROM staging.requests;

CREATE TABLE planetaryRC1.planetmath_classification LIKE staging.classification;
INSERT INTO planetaryRC1.planetmath_classification SELECT * FROM staging.classification;

CREATE TABLE planetaryRC1.planetmath_msc LIKE staging.msc;
INSERT INTO planetaryRC1.planetmath_msc SELECT * FROM staging.msc;

CREATE TABLE planetaryRC1.planetmath_authors LIKE staging.authors;
INSERT INTO planetaryRC1.planetmath_authors SELECT * FROM staging.authors;

-- See tables-into-drupal-pt2.sql for the next step
