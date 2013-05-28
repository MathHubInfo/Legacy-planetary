<?php
/**
 * @file
 * Override of theme_preprocess_...
 */

/**
 * Override or insert variables into the node template.
 *
 * @param array $vars
 *   An array of variables to pass to the theme template.
 */
function tb_blog_preprocess_node(&$vars) {
  if ($vars['type'] == 'blog') {
    $vars['blog_created_day'] = date('d', $vars['created']);
    $vars['blog_created_month'] = date('M', $vars['created']);
  }
}
