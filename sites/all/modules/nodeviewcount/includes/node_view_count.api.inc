<?php

function node_view_count_is_node_count($node) {
  $node_types = variable_get('node_view_count_node_types_options');
  foreach ($node_types as $key => $value) {
    if ($value === $node->type) {
			return TRUE;
    }
  }
	return FALSE;
}

function node_view_count_is_user_count($user) {
  $count_user_roles = variable_get('node_view_count_user_roles_options');
  foreach ($user->roles as $key => $role) {
    if (!empty($count_user_roles[$key])) {
      return TRUE;
    }
  }
	return FALSE;
}

/**
 * Count node views by user.
 * 
 * @param object $node
 * @param object $user
 * @return int count of views.
 */
function node_view_count_count_node_view($node, $user) {
  if (!node_view_count_is_node_count($node)) {
		return;
	}  
  if (!node_view_count_is_user_count($user)) {
		return;
	}
  $node_view_count = node_view_count_count_view_select($node->nid, $user->uid);
  return count($node_view_count);
}