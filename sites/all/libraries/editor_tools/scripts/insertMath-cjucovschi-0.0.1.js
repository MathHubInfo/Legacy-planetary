define(function(require) { return function(ace) { var core = require("scripts/core-cjucovschi-0.0.1"); core.setAce(ace); if (typeof(jQuery("asd").mathquill)=="undefined") {
	jQuery.getScript("http://mathquill.com/mathquill/mathquill.min.js", function(){});
	jQuery('head').append('<link rel="stylesheet" href="http://mathquill.com/mathquill/mathquill.css" type="text/css" />');
}


var mathFrame = jQuery("<div>").html("<div class='mathquill-editable'></div>");

jQuery(mathFrame).dialog({
    closeOnEscape : true,
    title : "Insert math",
    buttons : [
	{
	    text: "Insert",
	    click : function() {
		var math = jQuery(mathFrame).find(".mathquill-editable").mathquill('latex');
		core.insert(math);
		jQuery(mathFrame).dialog("close");
	    }
	},
	{
	    text: "Cancel",
	    click : function() {
		jQuery(mathFrame).dialog("close");
	    }
	}
    ]
});

jQuery(mathFrame).find(".mathquill-editable").mathquill('editable');
}});