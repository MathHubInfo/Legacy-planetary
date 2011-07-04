<?php
/**
 * @file
 * Display Suite example layout template.
 *
 * Available variables:
 *
 * Layout:
 * - $classes: String of classes that can be used to style this layout.
 * - $contextual_links: Renderable array of contextual links.
 *
 * Regions:
 *
 * - $left: Rendered content for the "Left" region.
 * - $left_classes: String of classes that can be used to style the "Left" region.
 *
 * - $right: Rendered content for the "Right" region.
 * - $right_classes: String of classes that can be used to style the "Right" region.
 */

?>
<div class="<?php print $classes; ?> clearfix">

  <?php if (isset($title_suffix['contextual_links'])): ?>
    <?php print render($title_suffix['contextual_links']); ?>
  <?php endif; ?>


  <!-- regions -->
  <div >
  <?php if ($profile_left): ?>
    <div class="ds-left<?php print $profile_left_classes; ?>">
      <?php print $profile_left; ?>
    </div>
  <?php endif; ?>
  
  <?php if ($profile_right): ?>
    <div class="ds-right<?php print $profile_right_classes; ?>">
      <?php print $profile_right; ?>
    </div>
  <?php endif; ?>
  </div>
  
  <?php if ($content): ?>
      <?php print $content; ?>
  <?php endif; ?>
  
</div>
