<?php
/**
 * @file
 */
?>
<div id="<?php print $page_prefix . $region_key;?>_setting_wrapper" class="region-preview-wrapper">
  <div class="region-title"><h4><?php print t($region_title);?></h4></div>
  <?php if (!$disabled_region):?>
    <div class="rb-setting-sub-form">
      <div id="region_setting_btn_<?php print $page_prefix . $region_key;?>" class="tb-form-btn edit-btn rb-setting-btn"><?php print t('Region Settings');?></div>
    </div>
  <?php endif;?>
  <div id="draggable_region_<?php print $region_key;?>" class="dragable-blocks-list">
    <?php print $blocks_markup;?>
  </div>
</div>