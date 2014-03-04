<?php

/**
 * @file
 * Defines default rules.
 *
 */

/**
 * Implements hook_default_rules_configuration().
 */
function heartbeat_rules_default_rules_configuration() {

  $configs = array();
  if (module_exists('heartbeat_defaults')) {
	  foreach (_heartbeat_rules_default_rules_configuration() as $key => $default) {
	    $configs[$key] = rules_import($default);
	  }
  }

  return $configs;

}

/**
 * Helper function to define exports from rules.
 * The defaults will be imported with rules_import command.
 */
function _heartbeat_rules_default_rules_configuration() {

  $configs = array();

  $configs['rules_heartbeat_node_create'] = '{ "rules_heartbeat_node_create" : {
    "LABEL" : "Log activity for a new node being published",
    "PLUGIN" : "reaction rule",
    "REQUIRES" : [ "rules", "heartbeat_rules" ],
    "ON" : [ "node_insert" ],
    "IF" : [ { "node_is_published" : { "node" : [ "node" ] } } ],
    "DO" : [
      { "heartbeat_activity_heartbeat_add_node" : {
          "nid" : "[node:nid]",
          "uid" : "[node:author:uid]",
          "nid_target" : "0",
          "uid_target" : "0",
          "message_id" : { "value" : { "heartbeat_add_node" : "heartbeat_add_node" } },
          "!username" : "[node:author:link]",
          "!node_type" : "[node:content-type]",
          "!node_title" : "[node:link]",
          "!types" : "[node:content-type]s"
        }
      }
    ]
  }
}';


  $configs['rules_log_activity_user_account_update'] = '{ "rules_log_activity_user_account_update" : {
    "LABEL" : "Log activity when user account is updated",
    "PLUGIN" : "reaction rule",
    "REQUIRES" : [ "rules", "heartbeat_rules" ],
    "ON" : [ "user_update" ],
    "DO" : [
      { "heartbeat_activity_heartbeat_edit_account" : {
          "nid" : "0",
          "uid" : "[account:uid]",
          "nid_target" : "0",
          "uid_target" : "0",
          "message_id" : { "value" : { "heartbeat_edit_account" : "heartbeat_edit_account" } },
          "!username" : "[account:link]"
        }
      }
    ]
  }
}';

  if (module_exists('comment')) {
  $configs['rules_log_activity_when_node_comment'] = '{ "rules_log_activity_when_node_comment" : {
    "LABEL" : "Log activity when a node is commented",
    "PLUGIN" : "reaction rule",
    "REQUIRES" : [ "rules", "heartbeat_rules", "comment" ],
    "ON" : [ "comment_update", "comment_insert" ],
    "DO" : [
      { "heartbeat_activity_heartbeat_add_comment" : {
          "nid" : "[comment:node:nid]",
          "uid" : "[comment:author:uid]",
          "nid_target" : "0",
          "uid_target" : "0",
          "message_id" : { "value" : { "heartbeat_add_comment" : "heartbeat_add_comment" } },
          "!username" : "[comment:author:link]",
          "!title" : "[comment:node:link]",
          "!comment" : "[comment:title]\u003cbr \/\u003e[comment:body]"
        }
      }
    ]
  }
}';
  }

  $configs['rules_log_activity_when_updating_node'] = '{ "rules_log_activity_when_updating_node" : {
    "LABEL" : "Log activity when published node is being updated",
    "PLUGIN" : "reaction rule",
    "REQUIRES" : [ "rules", "heartbeat_rules" ],
    "ON" : [ "node_update" ],
    "IF" : [ { "node_is_published" : { "node" : [ "node" ] } } ],
    "DO" : [
      { "heartbeat_activity_heartbeat_edit_node" : {
          "nid" : "[node:nid]",
          "uid" : "[site:current-user:uid]",
          "nid_target" : "0",
          "uid_target" : "0",
          "message_id" : { "value" : { "heartbeat_edit_node" : "heartbeat_edit_node" } },
          "!username" : "[site:current-user:link]",
          "!node_type" : "[node:content-type]",
          "!node_title" : "[node:link]"
        }
      }
    ]
  }
}';

  if (module_exists('user_relationships_rules')) {
	  $configs['rules_log_activity_when_user_relationship_is_made'] = '{ "rules_log_activity_when_user_relationship_is_made" : {
	    "LABEL" : "Log activity when user relationship is made",
	    "PLUGIN" : "reaction rule",
	    "REQUIRES" : [ "rules", "heartbeat_rules", "user_relationships_rules" ],
	    "ON" : [ "user_relationships_approve" ],
	    "DO" : [
	      { "heartbeat_activity_heartbeat_become_friends" : {
	          "nid" : "0",
	          "uid" : "[requester:uid]",
	          "message_id" : { "value" : { "heartbeat_become_friends" : "heartbeat_become_friends" } },
	          "!username" : "[requester:link]",
	          "!user2" : "[requestee:link]"
	        }
	      },
	      { "heartbeat_activity_heartbeat_become_friends" : {
	          "nid" : "0",
	          "uid" : "[requestee:uid]",
	          "message_id" : { "value" : { "heartbeat_become_friends" : "heartbeat_become_friends" } },
	          "!username" : "[requestee:link]",
	          "!user2" : "[requester:link]"
	        }
	      }
	    ]
	  }
	}';
  }

  return $configs;

}
