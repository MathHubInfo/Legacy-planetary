<?php

/**
 * @file
 * Adjusting the beer example to work for PlanetMath
 *
 * Now that we've been through this far enough to see all
 * of the basic ingredients working somewhat, maybe we can
 * think through it all once more and get it on a more
 * logically sound basis.
 *
 * Users and objects seem to import easily enough, and
 * LaTeX ends up "just working" when we enable the
 * appropriate plugin.  So no problems there.
 * 
 * Forums
 *
 * We need to associate some comments to articles and some
 * comments to forums -- that might end up being somewhat
 * tricky?  Maybe best to do it after the initial import,
 * doing some select on TBL data for example.
 * Alternatively, we could do some massaging in the
 * database first (create stub articles as standins for
 * forums, map comments to those... but I'm not sure if
 * threading of comments on articles really works the same
 * way on Drupal as it does for PlanetMath... have to
 * check)
 *
 * Threads
 *
 * Constantin has some ideas about how to get threaded
 * results to actually come across as threaded.  Can ask
 * about this later.  In the mean time, since we have to
 * run another import after this one, here we need to make
 * sure we have some references to point to. In the
 * current map, it is enough to find old 'source IDs' that
 * are targeted by a reply to, and figure out what their
 * 'destination ID' was is the PMOP migration.  However,
 * it seems like the present migration doesn't work in the
 * same logical fashion, i.e. something different from the
 * uid of the message.  This is of course somewhat
 * tedious.  It wouldn't be bad if we could easily make
 * annotations show up...  I guess we could cheat a bit
 * and send the old uid to the homepage or something like
 * that.
 *
 * to import the data you can do:
 *  drush migrate-import PMUser
 * or this can be handled through the web interface
 * at admin/content/migrate
 */

abstract class PMMigration extends Migration {
  public function __construct() {
    parent::__construct();
    $this->team = array(
      new MigrateTeamMember('Joe Corneli', 'holtzermann17@gmail.com', t('PM Board Member')),
    );
    // ':id:' adjusted by assigning ->issueNumber(1234) to a mapping.
    $this->issuePattern = 'http://trac.mathweb.org/planetary/ticket/:id:';
  }
}

class PMUserMigration extends PMMigration {
  public function __construct() {
    parent::__construct();
    $this->description = t('PM user data');

    // describe the old primary key
    $this->map = new MigrateSQLMap($this->machineName,
        array('uid' => array(
                'type' => 'int',
                'length' => 11,
                'not null' => TRUE,
                'description' => 'User ID.'
                )
             ),
        MigrateDestinationUser::getKeySchema()
    );

    //  planetmath_users is the name of the table to select from, mpu is a local alias
    $query = db_select('planetmath_users', 'mpu')
      ->fields('mpu', array('uid',
                            'password',
                            'email',
                            'sig',
                            'epoch_joined',
                            'username',
                            'active',
                            'prefs',
                            'preamble',
                            'surname',
                            'forename',
                            'lastip',
                            'karma',
                            'bio',
                            'epoch_last',
                            'city',
                            'state',
                            'country',
                            'homepage',
                            'score'));
    $this->source = new MigrateSourceSQL($query);
    $this->destination = new MigrateDestinationUser();

    $this->addFieldMapping('uid', 'uid')
         ->description(t('Preserve old uid as new uid in Drupal'));
    $this->addFieldMapping('is_new')
         ->defaultValue(TRUE);

    $this->addFieldMapping('pass', 'password');
    $this->addFieldMapping('mail', 'email');
    $this->addFieldMapping('init', 'email');
    $this->addFieldMapping('signature', 'sig');
    $this->addFieldMapping('signature_format')
         ->defaultValue('filtered_html');
    $this->addFieldMapping('created', 'epoch_joined');

    /**
     *  I was getting some errors about duplicate names.
     *  I can either remove these in the source, or try
     *  the "dedupe" function.  Going with the latter
     *  option for now.
     */ 

    $this->addFieldMapping('name', 'username')
         ->dedupe('users', 'name');
    $this->addFieldMapping('login', 'epoch_last');
    $this->addFieldMapping('access', 'epoch_last');

    // making everyone an "active" user in drupal terms (i.e. not blocked)
    $this->addFieldMapping('status')
         ->defaultValue(1);

    $this->addFieldMapping('picture')
         ->defaultValue(0);

    // Rather than leaving these things unmapped, we'll try creating some new fields to hold them.
    // Note that this doesn't seem to actually do anything -- should put in a support request I guess.

    $this->addFieldMapping('planetmath_migrate_prefs', 'prefs');
    $this->addFieldMapping('planetmath_migrate_preamble', 'preamble');
    $this->addFieldMapping('planetmath_migrate_surname', 'surname');
    $this->addFieldMapping('planetmath_migrate_forename', 'forename');
    $this->addFieldMapping('planetmath_migrate_lastip', 'lastip');
    $this->addFieldMapping('planetmath_migrate_bio', 'bio');
    $this->addFieldMapping('planetmath_migrate_city', 'city');
    $this->addFieldMapping('planetmath_migrate_state', 'state');
    $this->addFieldMapping('planetmath_migrate_country', 'country');
    $this->addFieldMapping('planetmath_migrate_homepage', 'homepage');
    $this->addFieldMapping('planetmath_migrate_score', 'score');

    // Unmapped source field
    $this->addFieldMapping(NULL, 'karma')
         ->issueGroup(t('DNM'));

    // Unmapped destination fields
    $this->addUnmigratedDestinations(array('theme',
                                           'timezone',
                                           'language',
                                           'data'));
  }
}

class PMForumOPMigration extends Migration {
  public function __construct() {
    parent::__construct();

    $this->dependencies = array('PMUser');

    $this->map = new MigrateSQLMap(
      $this->machineName,
      array(
        'uid' => array(
          'type' => 'int',
          'unsigned' => TRUE,
          'not null' => TRUE,
        ),
      ),
      MigrateDestinationNode::getKeySchema()
    );

    $query = db_select('planetmath_forum_ops', 'pmops')
      ->fields('pmops', array('uid',
                              'replyto',
                              'objectid',
                              'userid',
                              'username',
                              'subject',
                              'epoch_created',
                              'threadid',
                              'tbl',
                              'visible',
                              'body'))
      ->orderBy('epoch_created', 'ASC');

    $this->source = new MigrateSourceSQL($query, array(), NULL, array('map_joinable' => FALSE));
    $this->destination = new MigrateDestinationNode('forum');

    $this->addFieldMapping('is_new')
         ->defaultValue(TRUE);

    $this->addFieldMapping('nid', 'uid')
         ->description(t('Preserve old uid as new nid in Drupal.'));
    $this->addFieldMapping('is_new')
         ->defaultValue(TRUE);

    $this->addFieldMapping('thread', 'threadid');
    $this->addFieldMapping('uid', 'userid');
    $this->addFieldMapping('name', 'username');
    $this->addFieldMapping('created', 'epoch_created');
    $this->addFieldMapping('changed', 'epoch_created');
    $this->addFieldMapping('status')->defaultValue(1);
    $this->addFieldMapping('promote')->defaultValue(0);
    $this->addFieldMapping('title', 'subject');
    $this->addFieldMapping(NULL, 'prefix');
    $arguments = MigrateTextFieldHandler::arguments(array('source_type' => 'tid'));
    $this->addFieldMapping('taxonomy_forums', 'objectid')
         ->arguments($arguments);

    $this->addFieldMapping('body', 'body');
  }
}

// forum posts that are attached to already-existing threads
class PMForumFirstCommentMigration extends Migration {
  public function __construct() {
    parent::__construct();

    $this->dependencies = array('PMForumOP');

    $this->map = new MigrateSQLMap(
      $this->machineName,
      array(
        'uid' => array(
          'type' => 'int',
          'unsigned' => TRUE,
          'not null' => TRUE,
        ),
      ),
      MigrateDestinationComment::getKeySchema()
    );

    $query = db_select('planetmath_forum_first_comments', 'pmfic')
      ->fields('pmfic', array('uid',
                             'replyto',
                             'objectid',
                             'userid',
                             'username',
                             'subject',
                             'epoch_created',
                             'threadid',
                             'tbl',
                             'visible',
                             'body'))
      ->orderBy('epoch_created', 'ASC');

    $this->source = new MigrateSourceSQL($query, array(), NULL, array('map_joinable' => FALSE));
    $this->destination = new MigrateDestinationComment('comment_node_forum');

    $this->addFieldMapping('status')
         ->defaultValue(COMMENT_PUBLISHED);

    $this->addFieldMapping('nid', 'replyto')
         ->description(t('Preserve old objectid as nid in Drupal'));
    $this->addFieldMapping('pid')
         ->defaultValue(0);
    $this->addFieldMapping('subject', 'subject');
    $this->addFieldMapping('created', 'epoch_created');
    $this->addFieldMapping('changed', 'epoch_created');
    $this->addFieldMapping('comment_body', 'body');
    $this->addFieldMapping('name', 'username');
    $this->addFieldMapping('uid', 'userid');
    $this->addFieldMapping(NULL, 'visible');
    $this->addFieldMapping(NULL, 'tbl');

    $this->addUnmigratedDestinations(array('mail',
                                           'path',
                                           'homepage',
                                           'threadid',
                                           'language',
                                           'changed',
                                           'hostname'));
  }
}

// forum posts that are attached to already-existing threads
class PMForumCommentMigration extends Migration {
  public function __construct() {
    parent::__construct();

    $this->dependencies = array('PMForumFirstComment');

    $this->map = new MigrateSQLMap(
      $this->machineName,
      array(
        'uid' => array(
          'type' => 'int',
          'unsigned' => TRUE,
          'not null' => TRUE,
        ),
      ),
      MigrateDestinationComment::getKeySchema()
    );

    $query = db_select('planetmath_forum_comments', 'pmfc')
      ->fields('pmfc', array('uid',
                             'replyto',
                             'objectid',
                             'userid',
                             'username',
                             'subject',
                             'epoch_created',
                             'threadid',
                             'tbl',
                             'visible',
                             'body'))
      ->orderBy('epoch_created', 'ASC');

    $this->source = new MigrateSourceSQL($query, array(), NULL, array('map_joinable' => FALSE));
    $this->destination = new MigrateDestinationComment('comment_node_forum');

    $this->addFieldMapping('status')
         ->defaultValue(COMMENT_PUBLISHED);

    $this->addFieldMapping('nid', 'objectid')
         ->description(t('Preserve old objectid as nid in Drupal'));
    $this->addFieldMapping('pid', 'replyto')
         ->description(t('Preserve old replyto as pid in Drupal'));
    $this->addFieldMapping('subject', 'subject');
    $this->addFieldMapping('created', 'epoch_created');
    $this->addFieldMapping('changed', 'epoch_created');
    $this->addFieldMapping('comment_body', 'body');
    $this->addFieldMapping('name', 'username');
    $this->addFieldMapping('uid', 'userid');
    $this->addFieldMapping(NULL, 'visible');
    $this->addFieldMapping(NULL, 'tbl');

    $this->addUnmigratedDestinations(array('mail',
                                           'path',
                                           'homepage',
                                           'threadid',
                                           'language',
                                           'changed',
                                           'hostname'));
  }
}

// before this runs, update some counts in sql!
// select * from migrate_map_pmforumop;
// and look at the last value, VAL, then
//
// UPDATE planetmath_objects SET uid=uid+VAL;
// UPDATE planetmath_object_comments SET objectid=objectid+VAL, replyto=replyto+VAL;
//
// Note: would be nicest to be able to run these commands
// from within this import script.

class PMObjectMigration extends PMMigration {
  public function __construct() {
    parent::__construct();
    $this->description = t('PM Article data');

    $this->dependencies = array('PMForumComment');

    $this->map = new MigrateSQLMap($this->machineName,
      array(
        'uid' => array(
          'type' => 'int',
          'length' => 11,
          'not null' => TRUE,
          'description' => 'Article ID.',
          'alias' => 'mpo',
        )
      ),
      MigrateDestinationNode::getKeySchema()
    );

    $query = db_select('planetmath_objects', 'mpo')
      ->fields('mpo', array('uid',
                            'userid',
                            'title',
                            'epoch_created',
                            'epoch_modified',
                            'data',
                            'parentid',
                            'preamble',
                            'name',
                            'related',
                            'synonyms',
                            'defines',
                            'keywords',
                            'hits',
                            'self',
                            'pronounce',
                            'version',
                            'linkpolicy',
                            'type'));
    $this->source = new MigrateSourceSQL($query);
    $this->destination = new MigrateDestinationNode('article');

    // Mapped fields
    $this->addFieldMapping('nid', 'uid')
         ->description(t('Preserve old uid as new nid in Drupal'));
    $this->addFieldMapping('is_new')
         ->defaultValue(TRUE);

    $this->addFieldMapping('uid', 'userid');
    $this->addFieldMapping('title', 'title');
    $this->addFieldMapping('body', 'data');
    $this->addFieldMapping('created', 'epoch_created');
    $this->addFieldMapping('changed', 'epoch_modified');
    $this->addFieldMapping('access', 'epoch_last');
    $this->addFieldMapping('access', 'epoch_last');

    // Rather than leaving these things unmapped, we'll try creating some new fields to hold them.

    $this->addFieldMapping('field_preamble', 'preamble');

    //    $this->addFieldMapping('planetmath_migrate_parentid', 'parentid');
    //    $this->addFieldMapping('planetmath_migrate_name', 'name');
    //    $this->addFieldMapping('planetmath_migrate_related', 'related');
    //    $this->addFieldMapping('planetmath_migrate_synonyms', 'synonyms');
    //    $this->addFieldMapping('planetmath_migrate_defines', 'defines');
    //    $this->addFieldMapping('planetmath_migrate_keywords', 'keywords');
    //    $this->addFieldMapping('planetmath_migrate_hits', 'hits');
    //    $this->addFieldMapping('planetmath_migrate_selfproof', 'self');
    //    $this->addFieldMapping('planetmath_migrate_version', 'version');
    //    $this->addFieldMapping('planetmath_migrate_linkpolicy', 'linkpolicy');
    //    $this->addFieldMapping('planetmath_migrate_type', 'type');

    $this->addFieldMapping(NULL, 'pronounce')
         ->issueGroup(t('DNM'));

    // Unmapped destination fields
    // NOTE: it should be possible to infer "name" from forename+surname, 
    // just need to see how to compute during migration
    $this->addUnmigratedDestinations(array('vid',
                                           'type',
                                           'language',
                                           'status',
                                           'comment',
                                           'promote',
                                           'sticky',
                                           'tnid',
                                           'translate'));
  }
}

class PMObjectCommentMigration extends PMMigration {
  public function __construct() {
    parent::__construct();
    $this->description = t('PM Comment data');

    $this->dependencies = array('PMObject');

    $this->map = new MigrateSQLMap($this->machineName,
      array(
        'uid' => array(
          'type' => 'int',
          'length' => 11,
          'not null' => TRUE,
          'description' => 'Message ID.',
          'alias' => 'pmoc',
        )
      ),
       MigrateDestinationComment::getKeySchema()
    );

    // beer example suggests to do   ->orderBy('cid_parent', 'ASC');
    // Maybe something similarly intelligent can be done here
    $query = db_select('planetmath_object_comments', 'pmoc')
      ->fields('pmoc', array('uid',
                             'replyto',
                             'objectid',
                             'userid',
                             'username',
                             'subject',
                             'epoch_created',
                             'threadid',
                             'tbl',
                             'visible',
                             'body'))
      ->orderBy('epoch_created', 'ASC');
    $this->source = new MigrateSourceSQL($query);
    $this->destination = new MigrateDestinationComment('comment_node_article');
    
    $this->addFieldMapping('status')
         ->defaultValue(COMMENT_PUBLISHED);
    $this->addFieldMapping('nid', 'objectid')
         ->description(t('Preserve old objectid as nid in Drupal'));
    $this->addFieldMapping('pid', 'replyto')
         ->description(t('Preserve old replyto as pid in Drupal'));
    $this->addFieldMapping('comment_body', 'body');
    $this->addFieldMapping('name', 'username');
    $this->addFieldMapping('uid', 'userid');
    $this->addFieldMapping('subject', 'subject');
    $this->addFieldMapping('created', 'epoch_created');
    $this->addFieldMapping('changed', 'epoch_created');

    $this->addFieldMapping(NULL, 'visible');
    $this->addFieldMapping(NULL, 'tbl');

    $this->addUnmigratedDestinations(array('mail',
                                           'path',
                                           'homepage',
                                           'threadid',
                                           'language',
                                           'changed',
                                           'hostname'));
  }
}