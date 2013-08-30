<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN"
        "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en" lang="en">


<head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/>
    <meta content="utf-8" http-equiv="encoding"/>
    <title>Semantic Navigation</title>
    <link type="text/css" href="<?php echo $sally; ?>/deps/navigation/thejit/css/base.css" rel="stylesheet"/>
    <link type="text/css" href="<?php echo $sally; ?>/deps/navigation/thejit/css/Hypertree.css" rel="stylesheet"/>
    <script type="text/javascript" src="<?php echo $sally; ?>/deps/navigation/thejit/jit.js"></script>
    <!-- Example File -->
    <script type="text/javascript" src="<?php echo $sally; ?>/deps/navigation/thejit/hypertree_generation.js"></script>
    <script src="<?php echo $sally; ?>/deps/jobad/jquery/jquery-2.0.0.min.js"></script>
    <script src="<?php echo $sally; ?>/deps/jobad/jquery/jquery-ui-1.10.3.js"></script>
    <script src="<?php echo $sally; ?>/deps/jobad/underscore/underscore-min.js"></script>
    <link href="<?php echo $sally; ?>/deps/jobad/css/jquery-ui.css" rel="stylesheet"/>
    <!-- Include JOBAD -->
    <script src='<?php echo $sally; ?>/deps/jobad/JOBAD.js'></script>
    <link href="<?php echo $sally; ?>/deps/jobad/css/JOBAD.css" rel="stylesheet"/>
    <script src="<?php echo $sally; ?>/deps/Communication.js"></script>
    <!-- Load all the modules -->
    <script src="<?php echo $sally; ?>/deps/jobad/modules/searchGoogle.js"></script>
    <script src="<?php echo $sally; ?>/deps/jobad/modules/opendef.js"></script>
    <script src="<?php echo $sally; ?>/deps/jobad/modules/showGraph.js"></script>
    <script type="text/javascript">
        /**
         * On window load, initialize the Communication object, load the scripts, ask for context resources
         * and add interaction to the semantic objects in the definition depending on whether the item is in the spreadsheet or not.
         */

        var JOBAD1;
        var base_path = "<?php echo  base_path();?>";
        var token = "<?php echo  $token;?>";
        console.log(base_path);
        console.log(token);
        JOBAD.noConflict._(); //prevent underscore conflicts

        jQuery(function () {
            JOBAD1 = new JOBAD(jQuery("#infovis"));
            JOBAD1.modules.load('searchGoogle', []);
            JOBAD1.modules.load('opendef', [base_path, token]);
            JOBAD1.modules.load('showGraph', [base_path, token]);
            JOBAD1.Setup();
        });
    </script>
</head>
<body>
<div id="infovis">
</div>
<script>
    $(document).ready(function () {
        var json = <?php echo $content; ?>;
        init(json);
    });
</script>
</body>
</html>
