<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE html  PUBLIC "-//W3C//DTD XHTML 1.1 plus MathML 2.0//EN" "http://www.w3.org/Math/DTD/mathml2/xhtml-math11-f.dtd"><html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en" lang="en">
<head>

<title>Spacetree - Tree Animation</title>

<!-- CSS Files -->
	<script src="<?php echo $sally; ?>/javascripts/communication.js"></script>
<link type="text/css" href="<?php echo $sally; ?>/javascripts/fex/base.css" rel="stylesheet" />
<link type="text/css" href="<?php echo $sally; ?>/javascripts/fex/Spacetree.css" rel="stylesheet" />
 <link rel="stylesheet" type="text/css" href="<?php echo $sally; ?>/javascripts/fex/node.css"/>
<!--[if IE]><script language="javascript" type="text/javascript" src="../../Extras/excanvas.js"></script><![endif]-->

<!-- JIT Library File -->
<script language="javascript" type="text/javascript" src="<?php echo $sally; ?>/javascripts/fex/jit.js"></script>

<!-- Example File -->
<script language="javascript" type="text/javascript" src="<?php echo $sally; ?>/javascripts/fex/createTree.js"></script>
<script >
function a(){
Communication.init();
window.setTimeout(b,1000)
}

function b(){
if(Communication.isActive()){
	token ="<?php echo $token; ?>";
	message = new sally.FormulaRequest;
	message.actionId = token;
	Communication.sendMessage(message, function(){
	if(typeof(arguments[0])!='undefined'){
		json = arguments[0].json;
	init(json);
	}
	});
}
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
