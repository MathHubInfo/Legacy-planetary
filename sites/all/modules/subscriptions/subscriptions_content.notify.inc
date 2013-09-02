<?php

/**
 * @file
 * Subscriptions Content module (notify functions).
 */

/**
 * Returns a node if published, including any comments that are still queued, but
 * limited by the given subscriptions queue ID.
 *
 * @param int $nid
 * @param int|null $comment_load_sqid
 * @internal param array $subs
 *
 * @return object|null
 */
function _subscriptions_content_load($nid, $comment_load_sqid = NULL) {
  global $user;

  $node = node_load($nid, NULL, TRUE);
  // Note: we must not cache across users (access checking), and we take care
  // not to process the same node more than once (except for multiple batches
  // of comments), so we don't gain from caching nodes; on the contrary: we
  // might run out of memory!

  if (!empty($node)) {
    if (module_exists('comment')) {
      // Load comments like comment_get_thread().
      $query = db_select('comment', 'c');
      $query->addField('c', 'cid');
      $query
        ->condition('c.nid', $nid)
        ->addTag('node_access')
        ->addTag('comment_filter')
        ->addMetaData('node', $node);

      $query->join('subscriptions_queue', 'sq', (db_driver() != 'pgsql' ? 'c.cid = sq.load_args' : 'CAST(c.cid AS VARCHAR) = sq.load_args'));
      $query->addField('sq', 'sqid', '_subscriptions_sqid');
      $query->addField('sq', 'is_new', '_subscriptions_is_new');
      $query->condition('sq.uid', $user->uid);
      $query->condition('sq.load_function', 'subscriptions_content_load_comment');

      if (!user_access('administer comments')) {
        $query->condition('c.status', COMMENT_PUBLISHED);
      }
      $query->orderBy('c.cid', 'ASC');

      if (!empty($comment_load_sqid)) {
        // check for a later queued update notification (don't send comments past that one because it will go out as node/type with its own comments later!)
        if ($cutoff_sqid = db_query_range("SELECT sqid FROM {subscriptions_queue} WHERE module = 'node' AND field = 'nid' AND value = :value AND uid = :uid AND load_function = 'subscriptions_content_load_node' AND sqid > :sqid", 0, 1, array(
          ':value' => $nid,
          ':uid' => $user->uid,
          ':sqid' => $comment_load_sqid))->fetchField()
        ) {
          $query->condition('sq.sqid', $cutoff_sqid, '<');
        }
      }

      $sqids = $cids = array();
      foreach ($query->execute() as $comment_info) {
        if ($comment_info && user_access('access comments') && !isset($comment_infos[$comment_info->cid])) {
          $cids[] = $comment_info->cid;
          $comment_infos[$comment_info->cid] = $comment_info;
        }
        $sqids[] = $comment_info->_subscriptions_sqid;
      }
      if ($sqids) {
        db_delete('subscriptions_queue')
          ->condition('sqid', $sqids, 'IN')
          ->execute();
      }

      if ($cids) {
        $comments = comment_load_multiple($cids);
        foreach ($comments as $cid => $comment) {
          $comment->_subscriptions_sqid = $comment_infos[$cid]->_subscriptions_sqid;
          $comment->_subscriptions_is_new = $comment_infos[$cid]->_subscriptions_is_new;
        }
        $node->_subscriptions_comments = $comments;
      }
    }
    return $node;
  }
  return NULL;
}

