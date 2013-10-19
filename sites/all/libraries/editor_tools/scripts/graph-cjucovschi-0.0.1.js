define(function(require) { 
	return function(ace) { 
		var core = require("scripts/core-cjucovschi-0.0.1"); 
		core.setAce(ace); 

		var basePath = Drupal.settings.basePath;
		var context = Drupal.settings.editor_tools.context.mmt;
		var path = encodeURIComponent(context.dpath+"?"+context.module+"."+context.lang);
		var $ = jQuery;
		var iCode = "<iframe style='width: 100%; height:550px' src='"+basePath+"/hypertree?ajax&path="+path+"''>";
		console.log(iCode);

		iDiv = $("<div>").append(iCode);

		$(iDiv).dialog({width:600, height:600});
	}
});