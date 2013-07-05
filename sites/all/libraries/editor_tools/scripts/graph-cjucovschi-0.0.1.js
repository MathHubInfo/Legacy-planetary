define(function(require) { 
	return function(ace) { 
		var core = require("scripts/core-cjucovschi-0.0.1"); 
		core.setAce(ace); 

		var text = core.getText();
		basePath = Drupal.settings.basePath;
		var request = {
			text : text,
		};

		var $ = jQuery;

		jQuery.post(basePath+"compile", request, function(result) {
			var root = $("<div>");
			var errors = false;

			for (var type in result) {
				var title = "ok";
				if (result[type].length > 0)
					title = "errors found";

				root.append("<h3>"+type+" status: "+title+" </h3>");

				var tpErrors = $("<div>");
				for (var i in result[type]) {
					errors = true;
					$(tpErrors).append(result[type][i]+"<br/>");
				}
				root.append(tpErrors);
			}

			var title = "Success";
			if (errors) {
				title = "Errors found";
			}

			var parent = $("<div>").append(root);
			$(parent).dialog({title: title, height: 300, width: 400});
			$(root).accordion({collapsible: true});
		});
	}
});