<?php
/**
 * @file
 * Zen theme's implementation to display a node.
 *
 * Available variables:
 * - $title: the (sanitized) title of the node.
 * - $content: An array of node items. Use render($content) to print them all,
 *   or print a subset such as render($content['field_example']). Use
 *   hide($content['field_example']) to temporarily suppress the printing of a
 *   given element.
 * - $user_picture: The node author's picture from user-picture.tpl.php.
 * - $date: Formatted creation date. Preprocess functions can reformat it by
 *   calling format_date() with the desired parameters on the $created variable.
 * - $name: Themed username of node author output from theme_username().
 * - $node_url: Direct url of the current node.
 * - $display_submitted: Whether submission information should be displayed.
 * - $submitted: Submission information created from $name and $date during
 *   template_preprocess_node().
 * - $classes: String of classes that can be used to style contextually through
 *   CSS. It can be manipulated through the variable $classes_array from
 *   preprocess functions. The default values can be one or more of the
 *   following:
 *   - node: The current template type, i.e., "theming hook".
 *   - node-[type]: The current node type. For example, if the node is a
 *     "Blog entry" it would result in "node-blog". Note that the machine
 *     name will often be in a short form of the human readable label.
 *   - node-teaser: Nodes in teaser form.
 *   - node-preview: Nodes in preview mode.
 *   - view-mode-[mode]: The view mode, e.g. 'full', 'teaser'...
 *   The following are controlled through the node publishing options.
 *   - node-promoted: Nodes promoted to the front page.
 *   - node-sticky: Nodes ordered above other non-sticky nodes in teaser
 *     listings.
 *   - node-unpublished: Unpublished nodes visible only to administrators.
 *   The following applies only to viewers who are registered users:
 *   - node-by-viewer: Node is authored by the user currently viewing the page.
 * - $title_prefix (array): An array containing additional output populated by
 *   modules, intended to be displayed in front of the main title tag that
 *   appears in the template.
 * - $title_suffix (array): An array containing additional output populated by
 *   modules, intended to be displayed after the main title tag that appears in
 *   the template.
 *
 * Other variables:
 * - $node: Full node object. Contains data that may not be safe.
 * - $type: Node type, i.e. story, page, blog, etc.
 * - $comment_count: Number of comments attached to the node.
 * - $uid: User ID of the node author.
 * - $created: Time the node was published formatted in Unix timestamp.
 * - $classes_array: Array of html class attribute values. It is flattened
 *   into a string within the variable $classes.
 * - $zebra: Outputs either "even" or "odd". Useful for zebra striping in
 *   teaser listings.
 * - $id: Position of the node. Increments each time it's output.
 *
 * Node status variables:
 * - $view_mode: View mode, e.g. 'full', 'teaser'...
 * - $teaser: Flag for the teaser state (shortcut for $view_mode == 'teaser').
 * - $page: Flag for the full page state.
 * - $promote: Flag for front page promotion state.
 * - $sticky: Flags for sticky post setting.
 * - $status: Flag for published status.
 * - $comment: State of comment settings for the node.
 * - $readmore: Flags true if the teaser content of the node cannot hold the
 *   main body content. Currently broken; see http://drupal.org/node/823380
 * - $is_front: Flags true when presented in the front page.
 * - $logged_in: Flags true when the current user is a logged-in member.
 * - $is_admin: Flags true when the current user is an administrator.
 *
 * Field variables: for each field instance attached to the node a corresponding
 * variable is defined, e.g. $node->body becomes $body. When needing to access
 * a field's raw values, developers/themers are strongly encouraged to use these
 * variables. Otherwise they will have to explicitly specify the desired field
 * language, e.g. $node->body['en'], thus overriding any language negotiation
 * rule that was previously applied.
 *
 * @see template_preprocess()
 * @see template_preprocess_node()
 * @see zen_preprocess_node()
 * @see template_process()
 */
//print_r($content['field_latex']);
?>
<div id="node-<?php print $node->nid; ?>" class="<?php print $classes; ?> clearfix"<?php print $attributes; ?>>


 <?php print render($title_prefix); ?>
 <?php if ($node->textitle) : ?>
    <h1<?php print $title_attributes; ?>><a href="<?php print $node_url; ?>"><?php print $node->textitle; ?></a></h1>
  <?php endif; ?>
  <?php print render($title_suffix); ?>

  <?php if ($unpublished): ?>
    <div class="unpublished"><?php print t('Unpublished'); ?></div>
  <?php endif; ?>

  <?php if ($display_submitted): ?>
    <div class="submitted">
      <?php print $submitted;
?>
  <?php if ($type === 'article'): ?>
      <p> Authors:
     <?php
   dd($content['planetmath_og_display_coauthors']);
            print render($content['planetmath_og_display_coauthors']); 
      ?>
      </p>
  <?php endif; ?>
    </div>
  <?php endif; ?>

   <?php if ($type === 'group'): ?>
   <div id="planetmath_group">
   <h2> Group information </h2>
   <?php
   dd($content);
     print render($content['planetmath_group_users']); 
   ?> <br />
   <?php
     print render($content['planetmath_group_content']);
   ?> <br />
   Type:
   <?php
     print render($content['field_group_subtype'][0]);
     hide($content['field_group_subtype']);
   ?> <br />
   <?php
     // I don't know why, but this seems to be needed to get "subscribe" link
     // to show up for non-admin users (but we hide this for the World Writable group)
      if($content['group_group']['#object']->nid != 1){
        print render($content['group_group'][0]);
        hide($content['group_group']);
      } else {
        //hide($content['group_group'][0]);
        hide($content['group_group']);
      }
   ?>
   </div>
   <?php endif; ?>

  <div class="content"<?php print $content_attributes; ?>>
    <?php
    // We hide the comments and links now so that we can render them later.
    hide($content['comments']);
    hide($content['links']);
    hide($content['field_msc']);
    hide($content['field_revisioncomment']);
    hide($content['planetary_links']);
    //HACK to get the latex field to work
//    hide($content['field_latex']);
    //END-HACK
    print render($content);
?> <?php if(isset($node->field_msc['und'][0]['value'])): ?>
  
<h2>Mathematics Subject Classification</h2>

<?php $codes=explode(",",$node->field_msc['und'][0]['value']); 
foreach($codes as $code){
  $code = trim($code);
  print $code . " " . l(msc_browser_get_label($code),"msc_browser/".$code) . "<br/>";
} endif; ?>
  </div>

  <br />  
  <div id="planetary-links">
  <?php
  if ($content['planetary_links']) {
    print render($content['planetary_links']);
  } else {
  ?>
    <a href="<?php print (!$logged_in ? url('user/login') : '#comment-form') ?>">Post comment</a> | 
    <a href="<?php print (!$logged_in ? url('user/login') : url('node/add/correction')); ?>">Add correction</a> |   
    <a href="<?php print (!$logged_in ? url('user/login') : url('node/add/request')); ?>">Add request</a> | 
    <a href="<?php print (!$logged_in ? url('user/login') : url('node/add/solution')); ?>">Add solution</a> 
  <?php } ?>
  </div>
  <?php print render($content['comments']); ?>

</div><!-- /.node -->
