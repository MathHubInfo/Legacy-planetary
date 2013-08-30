<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en" lang="en">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8"></meta>
<meta content="utf-8" http-equiv="encoding"></meta>

<title>Spacetree - Tree Animation</title>

<!-- CSS Files -->
<script src="<?php echo $sally; ?>/deps/jobad/jquery/jquery-2.0.0.min.js"></script>
<script src="<?php echo $sally; ?>/deps/jobad/jquery/jquery-ui-1.10.3.js"></script>
<script src="<?php echo $sally; ?>/deps/jobad/underscore/underscore-min.js"></script>
<script src="<?php echo $sally; ?>/deps/jobad/JOBAD.min.js"></script>
<script src="<?php echo $sally; ?>/deps/communication.js"></script>
<script src="<?php echo $sally; ?>/deps/fex/jit.js" language="javascript" type="text/javascript"></script>
<script src="<?php echo $sally; ?>/deps/fex/createTree.js" language="javascript" type="text/javascript" ></script>
<script src="<?php echo $sally; ?>/deps/jobad/modules/fex_tooltip.js"></script>

<link type="text/css" href="<?php echo $sally; ?>/deps/fex/base.css" rel="stylesheet" />
<link type="text/css" href="<?php echo $sally; ?>/deps/fex/Spacetree.css" rel="stylesheet" />
<link rel="stylesheet" type="text/css" href="<?php echo $sally; ?>/deps/fex/node.css"/>
<link href="<?php echo $sally; ?>/deps/jobad/css/jquery-ui.css" rel="stylesheet"/>
<link href="<?php echo $sally; ?>/deps/jobad/css/JOBAD.css" rel="stylesheet"/>

<script >
function a(){
Communication.init();
window.setTimeout(b,1000)
}

function b(){
if(Communication.isActive()){
	window.token ="<?php echo $token; ?>";
	message = new sally.FormulaRequest;
	message.actionId = token;
	Communication.sendMessage(message, function(){
	if(typeof(arguments[0])!='undefined'){
		init(arguments[0].json);
	}
	});
}
	var JOBAD1;

			JOBAD.noConflict._(); //prevent underscore conflicts

			jQuery(function(){	
				JOBAD1 = new JOBAD(jQuery("#infovis"));
				JOBAD1.modules.load('fex_tooltip', []);
				

				JOBAD1.Setup();
			})		
}
</script>
</head>

<body onload="a();">
<div id="container">
<div id="center-container">
 <div id="infovis"></div>   
</div>
</div>
</body>
</html>
