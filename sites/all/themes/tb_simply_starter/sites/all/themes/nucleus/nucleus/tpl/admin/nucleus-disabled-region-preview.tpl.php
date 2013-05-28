<?php
/**
 * @file
 */
?>
<div id="page" class="page-default">
  <div id="disabled-wrapper" class="wrapper disabled-region-preview hidden-region">
    <div class="container <?php print $grid;?>">
      <div class="grid-inner clearfix">
        <div id="disabled-region" class="clearfix">
          <div class="hidden-zone-title region-title"><?php print t("Hidden regions & blocks");?></div>
          <?php print $markup;?>
        </div>
      </div>
    </div>
  </div>
</div>