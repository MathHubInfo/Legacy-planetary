<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en" lang="en">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
<title>Semantic Navigation</title>

<!-- CSS Files -->
<link type="text/css" href="<?php echo $sally; ?>/thejit/css/base.css" rel="stylesheet" />
<link type="text/css" href="<?php echo $sally ?>/thejit/css/Hypertree.css" rel="stylesheet" />

<script language="javascript" type="text/javascript" src="<?php echo $sally; ?>/thejit/jit.js"></script>

<!-- Example File -->
<script language="javascript" type="text/javascript" src="<?php echo $sally; ?>/thejit/example4.js"></script>


<script type="text/javascript" src="http://code.jquery.com/jquery-1.7.1.min.js"></script>
      <link rel="stylesheet" href="<?php echo $jobad; ?>/trunk/css/tContextMenu.css" />
      <script src="<?php echo $jobad; ?>/trunk/js/jquery.js" type="text/javascript" ></script>
      <script src="<?php echo $jobad; ?>/trunk/js/jquery.jsonp.js"></script>
      <script src="<?php echo $jobad; ?>/trunk/js/tContextMenu.js"></script>
      <script>
         
         $(function(){
            
            tContextMenu.init({
               
		root : '<?php echo $jobad; ?>/trunk/',	

		views    : [
                  'js/views/contextMenu.view.js'
               
               ],
               modules  : [
                  'js/modules/module1.js'
               ]
            });
            
         });
        
         
      </script>
</head>	  

<body>
<div id="infovis">
    </div>
	

<script>

$(document).ready(function() {
	var json = <?php echo $content; ?>;
		init(json);
	});
</script>

</body>



</html>

