<?php

/**
 * @file aggregator-feed-source.tpl.php
 * Default theme implementation to present the source of the feed.
 *
 * The contents are rendered above feed listings when browsing source feeds.
 * For example, "example.com/aggregator/sources/1".
 *
 * Available variables:
 * - $source_icon: Feed icon linked to the source. Rendered through
 *   theme_feed_icon().
 * - $source_image: Image set by the feed source.
 * - $source_description: Description set by the feed source.
 * - $source_url: URL to the feed source.
 * - $last_checked: How long ago the feed was checked locally.
 *
 * @see template_preprocess()
 * @see template_preprocess_aggregator_feed_source()
 */
?>
<div class="aside feed-source">
  <?php if ($source_description): ?>
    <div class="header feed-description"><?php print $source_description; ?></div>
  <?php endif; ?>

  <?php print $source_icon; ?>
  <?php print $source_image; ?>

  <div class="footer">
    <p class="feed-url">
      <strong><?php print t('URL:'); ?></strong> <a href="<?php print $source_url; ?>"><?php print $source_url; ?></a>
    </p>
    <p class="feed-updated">
      <strong><?php print t('Updated:'); ?></strong> <?php print $last_checked; ?>
    </p>
  </div>
</div>
