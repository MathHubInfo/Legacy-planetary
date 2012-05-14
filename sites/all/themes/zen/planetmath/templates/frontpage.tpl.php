<?php
drupal_add_library('system', 'ui.tabs');
$requests = (object) planetmath_blocks_block_view('request');
$additions = (object) planetmath_blocks_block_view('article');
$messages = (object) planetmath_blocks_block_view('message');
$revisions = (object) planetmath_blocks_block_view('revision');
$solutions = (object) planetmath_blocks_block_view('solution');
$everythingElse = (object) planetmath_blocks_block_view('everything-else');
$personal_feed = (object) planetmath_blocks_block_view('personal-feed');
?>
<div id="content" class="column frontpage-content"><div class="section">
    
    <div id="front-center-block">
      <?php print render($page['frontpage_center']); ?>
    </div>

    <div id="front-top-tabs">    
      <div id="front-left-block-tabs" class="front-left block-tabs">
        <ul>
          <li><a class="tab-title-link" href="#front-left-tabs-1"><?php print $additions->subject; ?></a></li>
        </ul>
        <div class="tab-contents" id="front-left-tabs-1">
          <?php print $additions->content; ?>
        </div>      
      </div>
      
      <div id="front-right-block-tabs" class="front-right block-tabs">
        <ul>
          <li><a class="tab-title-link" href="#front-right-tabs-1"><?php print $revisions->subject; ?></a></li>
        </ul>
        <div class="tab-contents" id="front-right-tabs-1">
          <?php print $revisions->content; ?>
        </div>      
      </div>
    </div>

<br />
<br />

    <div id="front-mid-tabs">    
      <div id="front-left-mid-block-tabs" class="front-left block-tabs">
        <ul>
          <li><a class="tab-title-link" href="#front-left-mid-tabs-1"><?php print $messages->subject; ?></a></li>
        </ul>
        <div class="tab-contents" id="front-left-mid-tabs-1">
          <?php print $messages->content; ?>
        </div>      
      </div>    
      <div id="front-right-mid-block-tabs" class="front-right block-tabs">
        <ul>
          <li><a class="tab-title-link" href="#front-right-mid-tabs-1"><?php print $everythingElse->subject; ?></a></li>
        </ul>
        <div class="tab-contents" id="front-right-mid-tabs-1">
          <?php print $everythingElse->content; ?>
        </div>      
      </div>   
    </div>

    <div id="front-bot-tabs">    
      <div id="front-left-bot-block-tabs" class="front-left block-tabs">
        <ul>
          <li><a class="tab-title-link" href="#front-left-bot-tabs-1"><?php print $personal_feed->subject; ?></a></li>
        </ul>
        <div class="tab-contents" id="front-left-bot-tabs-1">
          <?php print $personal_feed->content; ?>
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
      $("#front-right-mid-block-tabs").tabs();
      $("#front-left-bot-block-tabs").tabs();
    })    
  })(jQuery);
</script>
