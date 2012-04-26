<?php
drupal_add_library('system', 'ui.tabs');
$requests = (object) planetmath_blocks_block_view('request');
$additions = (object) planetmath_blocks_block_view('article');
$messages = (object) planetmath_blocks_block_view('message');
$revisions = (object) planetmath_blocks_block_view('revision');
$solutions = (object) planetmath_blocks_block_view('solution');
?>
<div id="content" class="column frontpage-content"><div class="section">
    
    <div id="front-center-block">
      <?php print render($page['frontpage_center']); ?>
    </div>

    <div id="front-top-tabs">    
      <div id="front-left-block-tabs" class="block-tabs">
        <ul>
          <li><a class="tab-title-link" href="#front-left-tabs-1"><?php print $additions->subject; ?></a></li>
        </ul>
        <div class="tab-contents" id="front-left-tabs-1">
          <?php print $additions->content; ?>
        </div>      
      </div>
      
      <div id="front-right-block-tabs" class="block-tabs">
        <ul>
          <li><a class="tab-title-link" href="#front-right-tabs-1"><?php print $revisions->subject; ?></a></li>
        </ul>
        <div class="tab-contents" id="front-right-tabs-1">
          <?php print $revisions->content; ?>
        </div>      
      </div>
    </div>

    <div id="front-mid-tabs">    
      <div id="front-left-mid-block-tabs" class="block-tabs">
        <ul>
          <li><a class="tab-title-link" href="#front-right-mid-tabs-1"><?php print $messages->subject; ?></a></li>
        </ul>
        <div class="tab-contents" id="front-right-mid-tabs-1">
          <?php print $messages->content; ?>
        </div>      
      </div>    
    </div>
    
</div></div>


<script type="text/javascript">
  (function($){
    $(document).ready(function(){
      $("#front-left-block-tabs").tabs();
      $("#front-right-block-tabs").tabs();
      $("#front-left-mid-block-tabs").tabs();
    })    
  })(jQuery);
</script>
