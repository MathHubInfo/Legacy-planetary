<?php
/**
 * @file
 */
?>
<div id="block_preview_wrapper_<?php print $block_key;?>" class="block block-preview-wrapper">
  <div class="rb-setting-sub-form">
    <div class="rb-setting-title"><?php print t("@block_title", array('@block_title' => $block['info']));?></div>
    <div id="block_setting_btn_<?php print $page_prefix . $block_key;?>" class="tb-form-btn edit-btn rb-setting-btn clearfix">
      <?php print t('Block Settings');?>
    </div>
  </div>
</div>