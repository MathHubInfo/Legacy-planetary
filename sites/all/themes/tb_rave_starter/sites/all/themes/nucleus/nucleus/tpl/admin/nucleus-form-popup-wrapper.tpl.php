<?php
/**
 * @file
 */
?>
<div id="nucleus_form_popup_wrapper" class="tb-popup-wrap">
  <div class="tb-popup">
    <?php print $nucleus_form_popup;?>
    <div class="tb-popup-actions clearfix">
      <input type="hidden" name="nucleus_popup_type" id="nucleus_popup_type" value=""/>
      <input type="hidden" name="nucleus_popup_page" id="nucleus_popup_page" value=""/>
      <input type="hidden" name="nucleus_popup_key" id="nucleus_popup_key" value=""/>
      <a href="#" id="nucleus_popup_save" class="tb-form-btn save-btn"><?php print t('OK');?></a>
      <a href="#" id="nucleus_popup_close" class="tb-form-btn close-btn"><?php print t('Cancel');?></a>
    </div>
  </div>
</div>