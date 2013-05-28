<?php

/**
 * @file aggregator-item.tpl.php
 * Default theme implementation to format an individual feed item for display
 * on the aggregator page.
 *
 * Available variables:
 * - $feed_url: URL to the originating feed item.
 * - $feed_title: Title of the feed item.
 * - $source_url: Link to the local source section.
 * - $source_title: Title of the remote source.
 * - $source_date: Date the feed was posted on the remote source.
 * - $content: Feed item content.
 * - $categories: Linked categories assigned to the feed.
 *
 * @see template_preprocess()
 * @see template_preprocess_aggregator_item()
 */
?>
<div class="article feed-item">
  <div class="header feed-item-title">
    <h2><a href="<?php print $feed_url; ?>"><?php print $feed_title; ?></a></h2>
  </div>

  <?php if ($content) : ?>
    <div class="content feed-item-content"><?php print $content; ?></div>
  <?php endif; ?>

  <div class="footer feed-item-meta">
    <p class="meta">
      <?php if ($source_url) : ?>
        <a href="<?php print $source_url; ?>" class="feed-item-source"><?php print $source_title; ?></a> -
      <?php endif; ?>
      <span class="time datetime" title="<?php print $datetime; ?>"><?php print $source_date; ?></span>
    </p>
    <?php if ($categories): ?>
      <p class="categories"><strong><?php print t('Categories'); ?></strong> - <?php print implode(', ', $categories); ?></p>
    <?php endif; ?>
  </div>
</div>
