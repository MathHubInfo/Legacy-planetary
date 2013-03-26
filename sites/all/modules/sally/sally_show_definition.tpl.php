	<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
    <html xmlns="http://www.w3.org/1999/xhtml">	
	<head>
	<!-- I know, this is bad but I will fix it. drupal_add_js wasn't working properly or I didn't know how to use it.-->
	<script type="text/javascript" src="http://code.jquery.com/jquery-1.7.1.min.js"></script>
    <link rel="stylesheet" href="<?php echo $jobad; ?>/trunk/css/tContextMenu.css" />
    <script src="<?php echo $jobad; ?>/trunk/js/jquery.js" type="text/javascript" ></script>
    <script src="<?php echo $jobad; ?>/trunk/js/jquery.jsonp.js"></script>
    <script src="<?php echo $jobad; ?>/trunk/js/tContextMenu.js"></script>
	<script src="<?php echo $jobad; ?>/trunk/js/mathml.js"></script>
	<script src="<?php echo $sally; ?>/javascripts/communication.js"></script>
	<script type="text/javascript">
<![CDATA[
	/**
	 * On window load, initialize the Communication object, load the scripts, ask for context resources
  	 * and add interaction to the semantic objects in the definition depending on whether the item is in the spreadsheet or not.
	 */
	 window.onload = function() {
		Communication.init("<?php echo $token; ?>", function(){
		window.message = arguments[0];// This is needed in the modules as context information (to determine which terms are in the spreadsheet and which are not)
		$("span.omdoc-term").css("color", "#808080").css("cursor", "help").click(function(e) {
        //send an event to the window that a navigation is taking place
        cd = $(e.target).attr("omdoc:cd");
        symbol=$(e.target).attr("omdoc:name");
        window.open("http://localhost/drupal_planetary/?q=sally/showdef/" + cd + "/" + symbol + "/" + token, "_parent");
		});
		var i=0;
		while(typeof message.context[i] !== 'undefined'){
		$('span.omdoc-term[omdoc\\:cd="' + message.context[i].theory + '"][omdoc\\:name="' + message.context[i].symbol + '"]').css("color", "blue").css("cursor", "help").click(function(e) {
			cd = $(e.target).attr("omdoc:cd");
			symbol = $(e.target).attr("omdoc:name");
			window.open("http://localhost/drupal_planetary/?q=sally/showdef/" + cd + "/" + symbol + "/" + token, "_parent");
	});
		i++;
	}
	});
};
 ]]>
	  </script>
	  
    <script>
	<![CDATA[
		//This is needed in the modules. This way it is set as a global variable.
        window.token = "<?php echo $token; ?>";	
		
         $(function(){
            tContextMenu.init({   
		root : '<?php echo $jobad; ?>/trunk/',	
		views    : [
                  'js/views/contextMenu.view.js'
               
               ],
               modules  : [
                  'js/modules/moduleManager.js', 'js/modules/searchGoogle.js', 'js/modules/opendef.js', 'js/modules/showGraph.js', '/js/modules/folding.js', 'js/modules/navigate.js'
               ]
            });
            
         });
        
 ]]>
</script>
</head>
<body>
<?php 
echo $content;
?>
</body>
</html>
