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
    $this->addFieldMapping('user_forename', 'forename');
    $this->addFieldMapping('user_surname', 'surname');
    $this->addFieldMapping('user_city', 'city');
    $this->addFieldMapping('user_state', 'state');
    $this->addFieldMapping('user_country', 'country');
    $this->addFieldMapping('user_homepage', 'homepage');
    $this->addFieldMapping('user_preamble', 'preamble');
    $this->addFieldMapping('user_bio', 'bio');

    $this->addFieldMapping(NULL, 'lastip')
         ->issueGroup(t('DNM'));

    $this->addFieldMapping(NULL, 'score')
         ->issueGroup(t('DNM'));

    $this->addFieldMapping(NULL, 'prefs')
         ->issueGroup(t('DNM'));

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
    $this->addFieldMapping('language')->defaultValue('und');
    $this->addFieldMapping('taxonomy_forums', 'objectid');
    $this->addFieldMapping('taxonomy_forums:source_type')
      ->defaultValue('tid');

    $this->addFieldMapping('body', 'body');
  }
}

// forum posts that are attached to already-existing threads
class PMForumCommentMigration extends Migration {
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

    $query = db_select('planetmath_forum_comments', 'pmfc')
      ->fields('pmfc', array('uid',
                             'replyto',
                             'op',
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

    // We should get the nid of the op (which means we need to add an appropriate
    // column into the table we're porting over)

    $this->addFieldMapping('nid', 'op')
         ->description(t('Preserve old OP as nid in Drupal'));

    // All subsequent comments are replies to other comments
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
// select COUNT(*) from migrate_map_pmforumop;
//
// UPDATE planetmath_objects SET uid=uid+VAL;
// UPDATE planetmath_object_comments SET objectid=objectid+VAL, replyto=replyto+VAL;
//
// Note: would be nicest to be able to run those commands
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
                            'msc_class',
                            'hits',
                            'self',
                            'pronounce',
                            'version',
                            'linkpolicy',
                            'type_string'));
    $this->source = new MigrateSourceSQL($query);
    $this->destination = new MigrateDestinationNode('article');

    // Mapped fields
    $this->addFieldMapping('nid', 'uid')
         ->description(t('Preserve old uid as new nid in Drupal'));
    $this->addFieldMapping('is_new')
         ->defaultValue(TRUE);

    $this->addFieldMapping('uid', 'userid');
    $this->addFieldMapping('title', 'title');
    $this->addFieldMapping('created', 'epoch_created');
    $this->addFieldMapping('changed', 'epoch_modified');
    $this->addFieldMapping('access', 'epoch_last');
    $this->addFieldMapping('access', 'epoch_last');

    // Rather than leaving these things unmapped, we'll try creating some new fields to hold them.
    // Hm... I thought I had this squared away in some version of the code, let's look around at
    // the servers when we have a chance.

    // $this->addFieldMapping('field_preamble', 'preamble');

    $this->addFieldMapping('field_canonicalname', 'name');
    $this->addFieldMapping('field_canonicalname:source_type')
      ->defaultValue('value');

    // mapping in the legacy "parent" relationship this way, as opposed to some other sort of connection...
    $this->addFieldMapping('field_parent', 'parentid');
    $this->addFieldMapping('field_parent:source_type')
      ->defaultValue('value');

    $this->addFieldMapping('field_msc', 'msc_class');
    $this->addFieldMapping('field_msc:source_type')
      ->defaultValue('value');

    $this->addFieldMapping('field_related', 'related');
    $this->addFieldMapping('field_related:source_type')
      ->defaultValue('value');

    $this->addFieldMapping('field_synonym', 'synonyms');
    $this->addFieldMapping('field_synonym:source_type')
      ->defaultValue('value');

    $this->addFieldMapping('field_defines', 'defines');
    $this->addFieldMapping('field_defines:source_type')
      ->defaultValue('value');

    $this->addFieldMapping('field_keywords', 'keywords');
    $this->addFieldMapping('field_keywords:source_type')
      ->defaultValue('value');

    $this->addFieldMapping('field_mathtype', 'type_string');
    $this->addFieldMapping('field_mathtype:source_type')
      ->defaultValue('value');

    $this->addFieldMapping('field_latex', 'preamble');
    $this->addFieldMapping('field_latex:source_type')
      ->defaultValue('preamble');

    $this->addFieldMapping('field_latex', 'data');
    $this->addFieldMapping('field_latex:source_type')
      ->defaultValue('document');

    // We can deal with the "version" in our SQL-based cleanup
    $this->addFieldMapping(NULL, 'version')
         ->issueGroup(t('DNM'));

    $this->addFieldMapping(NULL, 'pronounce')
         ->issueGroup(t('DNM'));

    $this->addFieldMapping(NULL, 'hits')
         ->issueGroup(t('DNM'));

    $this->addFieldMapping(NULL, 'self')
         ->issueGroup(t('DNM'));

    $this->addFieldMapping(NULL, 'linkpolicy')
         ->issueGroup(t('DNM'));

    // Unmapped destination fields
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

class PMCollabMigration extends PMMigration {
  public function __construct() {
    parent::__construct();
    $this->description = t('PM Collab data');

    // might as well run the object migrations first?
    // Or should we run the collabs first, to tuck them in because there are fewer of them
    $this->dependencies = array('PMObject');

    $this->map = new MigrateSQLMap($this->machineName,
      array(
        'uid' => array(
          'type' => 'int',
          'length' => 11,
          'not null' => TRUE,
          'description' => 'Collab ID.',
          'alias' => 'mpcollab',
        )
      ),
      MigrateDestinationNode::getKeySchema()
    );

    $query = db_select('planetmath_objects', 'mpcollab')
      ->fields('mpcollab', array('uid',       // int(11)     
                                 'userid',    // int(11)     
                                 'title',     // varchar(255)
                                 'abstract',  // text     
                                 'data',      // text     
                                 '_lock',     // int(11)   - ignore
                                 'epoch_created',   // datetime 
                                 'locktime',  // datetime  - ignore
                                 'lockuser',  // int(11)   - ignore
                                 'published', // tinyint(4)
                                 'epoch_modified',  // datetime
                                 'version',   // int(11)
                                 'hits',      // int(11)
                                 'sitedoc'    // int(11)
                                 ));
    $this->source = new MigrateSourceSQL($query);

    // We will migrate these in as articles, just like the regular objects
    $this->destination = new MigrateDestinationNode('article');

    // Mapped fields
    // If we're going to preserve this, then we need to check and provide the right offset so
    // that we don't get collisions...
    $this->addFieldMapping('nid', 'uid')
         ->description(t('Preserve old uid as new nid in Drupal'));
    
    $this->addFieldMapping('is_new')
         ->defaultValue(TRUE);

    $this->addFieldMapping('uid', 'userid');
    $this->addFieldMapping('title', 'title');
    $this->addFieldMapping('body', 'data');
    $this->addFieldMapping('created', 'epoch_created');
    $this->addFieldMapping('changed', 'epoch_modified');

    // We need to come up with some suitable destinations for these things.  
    // Will they be additional fields for all articles?
    $this->addFieldMapping('field_published', 'published');
    $this->addFieldMapping('field_published:source_type')
      ->defaultValue('value');

    // Hopefully this will work...
    $this->addFieldMapping('field_section')
         ->defaultValue('Collaboration');

    // ... Maybe the "sitedoc" will actually just be an example of one of 
    // the "special sections", for which we need to general support
    $this->addFieldMapping('field_sitedoc', 'sitedoc');
    $this->addFieldMapping('field_sitedoc:source_type')
      ->defaultValue('value');

    $this->addFieldMapping(NULL, '_lock')
         ->issueGroup(t('DNM'));
    $this->addFieldMapping(NULL, 'lockuser')
         ->issueGroup(t('DNM'));
    $this->addFieldMapping(NULL, 'locktime')
         ->issueGroup(t('DNM'));
    $this->addFieldMapping(NULL, 'hits')
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

// Note on the following: I think maybe we SHOULD migrate the "closedbyid" since corrections
// might be closed by any co-author.  Also, we may as well map the
// "comment" part as well, just creating an additional field for
// "comment".  I guess I'll think a little more about this before
// I decide.  But in any case, it should be ready to run shortly.

class PMCorrectionMigration extends PMMigration {
  public function __construct() {
    parent::__construct();
    $this->description = t('PM Corrections data');

    $this->dependencies = array('PMObject');

    $this->map = new MigrateSQLMap($this->machineName,
      array(
        'uid' => array(
          'type' => 'int',
          'length' => 11,
          'not null' => TRUE,
          'description' => 'Correction ID.',
          'alias' => 'mpcor',
        )
      ),
      MigrateDestinationNode::getKeySchema()
    );

    $query = db_select('planetmath_corrections', 'mpcor')
      ->fields('mpcor', array('uid',
                              'objectid',
                              'userid',
                              'type',
                              'title',
                              'data',
                              'epoch_filed',
                              'epoch_closed',
                              'was_closed',
                              'accepted',
                              'comment',
                              'graceint',
                              'closedbyid'))
      ->orderBy('epoch_filed', 'ASC');

    $this->source = new MigrateSourceSQL($query);
    $this->destination = new MigrateDestinationNode('correction');

    /* We can preserve the old uid as the new nid as long
       as we increment the corresponding columns by
       another 30000 or so */

    $this->addFieldMapping('nid', 'uid')
         ->description(t('Preserve old uid as new nid in Drupal'));
    $this->addFieldMapping('is_new')
         ->defaultValue(TRUE);

    // This is the sort of migration that worked for forums, presumably
    // something similar works here for mapping values into a give field

    $this->addFieldMapping('field_correction_article', 'objectid');
    $this->addFieldMapping('field_correction_article:source_type')
      ->defaultValue('nid');

    //$node->uid = $correction->userid;
    $this->addFieldMapping('uid', 'userid');

    $this->addFieldMapping('field_correction_type', 'type');
    $this->addFieldMapping('field_correction_type:source_type')
      ->defaultValue('value');

    // In order to make these meaningful, we should be sure to update them to
    // the forms that Drupal is expecting (then re-import).
    $this->addFieldMapping('field_correction_accepted', 'accepted');
    $this->addFieldMapping('field_correction_accepted:source_type')
      ->defaultValue('value');

    $this->addFieldMapping('field_correction_closed', 'was_closed');
    $this->addFieldMapping('field_correction_closed:source_type')
      ->defaultValue('value');

    $this->addFieldMapping('field_correction_closedby', 'closedbyid');
    $this->addFieldMapping('field_correction_closedby:source_type')
      ->defaultValue('uid');

    $this->addFieldMapping('title', 'title');
    $this->addFieldMapping('body', 'data');
    $this->addFieldMapping('created', 'epoch_filed');
    $this->addFieldMapping('changed', 'epoch_filed');

    $this->addFieldMapping('field_correction_remark', 'comment');
    $this->addFieldMapping('field_correction_remark:source_type')
      ->defaultValue('value');

    $this->addUnmigratedDestinations(array('graceint',
                                           'epoch_closed'));
  }
}

class PMCorrectionCommentMigration extends PMMigration {
  public function __construct() {
    parent::__construct();
    $this->description = t('PM Correction Comment data');

    $this->dependencies = array('PMCorrection');

    $this->map = new MigrateSQLMap($this->machineName,
      array(
        'uid' => array(
          'type' => 'int',
          'length' => 11,
          'not null' => TRUE,
          'description' => 'Message ID.',
          'alias' => 'pmcorco',
        )
      ),
       MigrateDestinationComment::getKeySchema()
    );

    // beer example suggests to do   ->orderBy('cid_parent', 'ASC');
    // Maybe something similarly intelligent can be done here
    $query = db_select('planetmath_correction_comments', 'pmcorco')
      ->fields('pmcorco', array('uid',
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
    $this->destination = new MigrateDestinationComment('comment_node_correction');

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


class PMRequestMigration extends PMMigration {
  public function __construct() {
    parent::__construct();
    $this->description = t('PM Requests data');

    $this->dependencies = array('PMObject');

    $this->map = new MigrateSQLMap($this->machineName,
      array(
        'uid' => array(
          'type' => 'int',
          'length' => 11,
          'not null' => TRUE,
          'description' => 'Request ID.',
          'alias' => 'mprq',
        )
      ),
      MigrateDestinationNode::getKeySchema()
    );

    $query = db_select('planetmath_requests', 'mprq')
      ->fields('mprq', array('uid',
                             'creatorid',
                             'fulfillerid',
                             'title',
                             'data',
                             'epoch_created',
                             'closed',
                             'epoch_closed',
                             'fulfilled'))
      ->orderBy('epoch_created', 'ASC');

    $this->source = new MigrateSourceSQL($query);
    $this->destination = new MigrateDestinationNode('question');

    /* We can preserve the old uid as the new nid as long
       as we increment the corresponding columns by
       another 30000 or so */

    $this->addFieldMapping('nid', 'uid')
         ->description(t('Preserve old uid as new nid in Drupal'));
    $this->addFieldMapping('is_new')
         ->defaultValue(TRUE);

    // This is the sort of migration that worked for forums, presumably
    // something similar works here for mapping values into a give field
    $this->addFieldMapping('uid', 'creatorid');

    $this->addFieldMapping('field_question_fulfiller', 'fulfillerid');
    $this->addFieldMapping('field_question_fulfiller:source_type')
      ->defaultValue('uid');

    $this->addFieldMapping('field_question_type')->defaultValue('req');
    $this->addFieldMapping('field_question_type:source_type')
      ->defaultValue('value');

    $this->addFieldMapping('title', 'title');

    // this shows how to migrate data directly into a LaTeX field (I hope this works!)
    $this->addFieldMapping('field_question_latex', 'data');
    $this->addFieldMapping('field_question_latex:source_type')
      ->defaultValue('document');

    // ... continues like this?
    //$this->addFieldMapping('field_question_latex')->defaultValue('tex_editor');
    //$this->addFieldMapping('field_question_latex:source_type')
    //  ->defaultValue('format');

    $this->addFieldMapping('created', 'epoch_created');
    
    // For *questions*, closed is a datetime (whereas for corrections, it's a binary value)
    $this->addFieldMapping('field_question_closed', 'closed');
    $this->addFieldMapping('field_question_closed:source_type')
      ->defaultValue('value');

    $this->addUnmigratedDestinations(array('field_question_article'));
  }
}


class PMRequestCommentMigration extends PMMigration {
  public function __construct() {
    parent::__construct();
    $this->description = t('PM Request Comment data');

    $this->dependencies = array('PMRequest');

    $this->map = new MigrateSQLMap($this->machineName,
      array(
        'uid' => array(
          'type' => 'int',
          'length' => 11,
          'not null' => TRUE,
          'description' => 'Message ID.',
          'alias' => 'pmrqco',
        )
      ),
       MigrateDestinationComment::getKeySchema()
    );

    // beer example suggests to do   ->orderBy('cid_parent', 'ASC');
    // Maybe something similarly intelligent can be done here
    $query = db_select('planetmath_request_comments', 'pmrqco')
      ->fields('pmrqco', array('uid',
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
    $this->destination = new MigrateDestinationComment('comment_node_request');

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