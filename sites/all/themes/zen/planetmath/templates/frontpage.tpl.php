<?php
drupal_add_library('system', 'ui.tabs');
$requests = (object) planetmath_blocks_block_view('request');
$additions = (object) planetmath_blocks_block_view('article');
$messages = (object) planetmath_blocks_block_view('message');
// $revisions = (object) planetmath_blocks_block_view('revision');
$solutions = (object) planetmath_blocks_block_view('solution');
// $everythingElse = (object) planetmath_blocks_block_view('everything-else');
$personal_feed = (object) planetmath_blocks_block_view('personal-feed');
?>
<div id="content" class="column frontpage-content"><div class="section">
    
    <div id="front-center-block">
      <?php print render($page['frontpage_center']); ?>
    </div>

    <div id="front-top-tabs">    
      <div id="front-left-block-tabs" class="front-left block-tabs">
        <h2><?php print $additions->subject; ?></h2>
        <div class="tab-contents" id="front-left-tabs-1">
          <?php print $additions->content; ?>
        </div>      
      </div>

      <div id="front-right-block-tabs" class="front-right block-tabs" style="visibility:hidden">
        <h2><?php print $messages->subject; ?></h2>
        <div class="tab-contents" id="front-right-tabs-1">
          <?php print $messages->content; ?>
        </div>      
      </div>
    </div>
<br />
<br />

   <div style="clear:both"></div>

    <div id="front-mid-tabs">    
      <div id="front-left-mid-block-tabs" class="front-left block-tabs">
         <h2><?php print $messages->subject; ?></h2>
        <div class="tab-contents" id="front-left-mid-tabs-1">
          <?php print $messages->content; ?>
        </div>      
      </div>
    </div>

</div></div>


<script type="text/javascript">
  (function($){
    $(document).ready(function(){
       $("#front-left-block-tabs").tabs();
       // $("#front-right-block-tabs").tabs();
       $("#front-left-mid-block-tabs").tabs();
       //       $("#front-right-mid-block-tabs").tabs();
       // $("#front-left-bot-block-tabs").tabs();


   var max_lines =0;
   var min_line_height = 10;
   // console.log("look inside");
   // look inside each block
   jQuery('.tab-contents').each( function(){
       // look inside each span
       var num_lines =1;
       var this_line_height =10;
       jQuery(this).find('span').each( function(){
	   // count the number of lines in this span
	   num_lines += Math.ceil(jQuery(this).text().length/42);
	   max_lines = Math.max(max_lines,num_lines);
         });
       this_line_height = (390/num_lines);
       min_line_height = Math.min(this_line_height,min_line_height);
       // now that we know how many lines in THIS block
       // we set the line height in this block accordingly
       jQuery(this).css('line-height',this_line_height+'px')
      });
   // now that we know the maximum number of lines used on any block,
   // we set the height of all blocks based on that value
   jQuery('#front-left-block-tabs').css('height',Math.ceil((max_lines*min_line_height*2.2))+'px');
   jQuery('#front-right-block-tabs').css('height',Math.ceil((max_lines*min_line_height*2.2))+'px');

    })
  })(jQuery);
</script>
