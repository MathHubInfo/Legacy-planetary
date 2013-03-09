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
//print_r(array_keys($content));
?>
<div id="node-<?php print $node->nid; ?>" class="<?php print $classes; ?> clearfix"<?php print $attributes; ?>>

   <?php /* We won't use the theme to display titles for articles, rather, we use
            LaTeXML for that.*/ ?>
  <?php if ( ($node->textitle) && ($node->type != 'article') ) : ?>
  <?php print render($title_prefix); ?>
    <h1<?php print $title_attributes; ?>><a href="<?php print $node_url; ?>"><?php print $node->textitle; ?></a></h1>
  <?php print render($title_suffix); ?>
  <?php endif; ?>

  <?php if ($unpublished): ?>
    <div class="unpublished"><?php print t('Unpublished'); ?></div>
  <?php endif; ?>

   <?php /* Ideally we would ALWAYS put the "submitted" and
	    "authorship" information into a block, similar to the
	    Interact block -- once that's sorted out, this stuff can
            be taken out of this part of the theme. */ ?>

  <?php if ($type=='forum'): ?>
    <div class="submitted">
      <?php print $submitted; ?>
    </div>
   <?php endif; ?>

  <?php /* Only for questions!*/
   if ($type === 'question'): ?>
   <h2> Question </h2>
   <?php
     print render($content['field_question_latex']); ?>

   <?php if (isset($content['field_question_note']['#items'][0]['document'])): ?>
   <h2> Note to reader </h2>
   <?php
     print render($content['field_question_note']); ?>
   <?php endif; ?>

   <?php endif; ?>
  
  <?php /* Only for groups!*/
   if ($type === 'group'): ?>
   <div id="planetmath_group">
   <h2> Group information </h2>
   <?php
     // dd($content);
     // Note: we found a module that could be modified to display group content in the sidebar, which would
     // probably look better than what we have here.
     print render($content['planetmath_group_users']); 
     print l("(see full roster)", "members/".$node->nid, array('attributes' => array('style' => 'font-style:italic;')));
   ?> 
<br />
<br />
   <?php
     print render($content['planetmath_group_content']);
     print l("(see full list)", "group-content/".$node->nid, array('attributes' => array('style' => 'font-style:italic;')));
   ?> <br /><br />
   Type:
   <?php
     //dd($content['field_group_subtype'][0]);
     print render($content['field_group_subtype'][0]);
     hide($content['field_group_subtype']);
   ?> <br /> <br />
   <?php if ($content['field_group_subtype'][0]['#markup'] == "Team"
	   && planetmath_og_attach_is_member($nid)) : 
	// You can't add more content to a Co-authors group, and all content by me.
	// is supposed to go into the buddy list group.   For now, we just remove
	// the "add stuff" link from the presentation for everyone but Teams,
	// (later we can have a more robust solution).
    ?>
     <?php print render($content['add_stuff']); ?>
     <br />
   <?php endif; ?>
   <?php hide($content['add_stuff']); ?> 
   <?php
     // I don't know why, but this seems to be needed to get "subscribe" link
     // to show up for non-admin users (but we hide this for the World Writable group)
   if(isset($content['group_group'])) {
      if($content['group_group']['#object']->nid != 1){
        print render($content['group_group'][0]);
        hide($content['group_group']);
      } else {
        //hide($content['group_group'][0]);
        hide($content['group_group']);
      }
   }
   ?>
   </div>
   <?php endif; ?>

  <?php /* Only for collections!*/
   if ($type === 'collection'):  
    print render($content['body']); 
    if(isset($content['collection_contents_table'])): ?>
      <div id="collection_content">
      <h2> Collection content </h2>
	 <?php print render($content['collection_contents_table']); ?>
      </div>
   <?php endif; ?>
   <?php endif; ?>

  <?php /* Only for solutions!*/
   if ($type === 'solution'):  
    if(isset($content['problem_content'])): ?>
      <div id="problem_content" style="border:1px solid black;padding:4px;">
      <h2> Problem: </h2>
	 <?php print render($content['problem_content']); ?>
      </div>
    <?php print render($content['body']); ?>
     <?php endif; ?>
   <?php endif; ?>

  <div class="content"<?php print $content_attributes; ?>>
    <?php   /* Generic stuff for all nodes goes here */
    // We hide the comments and links now so that we can render them later (if desired).
     //dd($content);
    hide($content['comments']);
    hide($content['links']);
    hide($content['field_msc']);
    hide($content['field_revisioncomment']);
    // sitedoc and published status are really only relevant to the author/editor
    // (readers can gather the relevant info from context)
    hide($content['field_sitedoc']);
    hide($content['field_published']);
    hide($content['planetary_links']);
    hide($content['planetmath_og_display_coauthors']);
    //HACK to get the latex field to work
//    hide($content['field_latex']);
    //END-HACK
    print render($content);
?> 
  <?php if(isset($node->field_msc['und'][0]['value'])): ?>  
  <h2>Mathematics Subject Classification</h2>
  <?php $codes=explode(",",$node->field_msc['und'][0]['value']); 
  foreach($codes as $code){
    $code = trim($code);
    $label=msc_browser_get_label($code);
    if($label){
    print $code . " " . l($label,"msc_browser/".$code) . "<br/>";
    } else {
      print $code . " " . "<em>no label found</em>";
    }
  }
   endif; ?>

 </div> <?php /* End of content div */ ?>

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
