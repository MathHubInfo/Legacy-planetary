<?php

/**
 * @file panel.tpl.php
 * Default theme implementation to display a panel.
 *
 * Available variables:
 * - $page: contain full info about the regions inside current panel
 * - $panel_width: width of each region;
 * - $panel_classes: class name of each region;
 * - $panels_list: list panels name;
 *
 * @see nucleus_render_panel()
 */
?><?php if($not_empty_panel):?>
  <?php foreach ($panels_list as $panel => $panel_title): ?>
    <?php if ($panel_width[$panel]) :?>
      <div class="<?php print $panel_classes[$panel];?> <?php print $panel_grid[$panel];?>">
        <div class="grid-inner clearfix">
          <?php if ($panel_content = render($page[$panel])): ?>
            <?php print $panel_content; ?>
          <?php else:?>
            &nbsp;
          <?php endif;?>
        </div>
      </div>
    <?php endif;?>
  <?php endforeach;?>
<?php endif;?>