(function ($) {
		window.aceEmacs = {};
		 jQuery.get("dialogs.xml", function(data) {
		 		 jQuery("body").append(data);
 		 }, "text");
 		
		window.aceEmacs.prepareEmacsMode = function (editor) {
			var emacs = window.ace.require("ace/keyboard/emacs").handler;
			emacs.addCommands({
					addEnvironment : function (editor) {
						
						$("#ace_cmd_dialog").dialog({
								width: "450px",
								close: function() {
									editor.focus();
								}
						});
						Exhibit.jQuery("#ace_cmd_dialog").bind("onEnter", function(evt, data) {
								db = data.db;
								item = data.item;
								template = db.getObject(item, "template");
								params = db.getObject(item, "params");
								$("#ace_cmd_dialog").dialog("close");
								$("#ace_properties_cmd_name").text(item);
								$("#ace_properties_form").empty();
								$("#ace_properties_form").jsonForm({
										"schema" : params,
										"onSubmit" : function (errors, values) {
											if (errors) {
												return ;
											}
											$("#ace_properties_form").close();
											editor.insert(_.template(template, values));
										}
								});
								$("#ace_properties_form button").submit(function (evt) {
										evt.preventDefault();
								});
								$("#ace_properties").dialog();
								$("#ace_properties").find("input, textarea, select").first().each(function(idx, obj) {
										$(obj).focus();
								});
						});
					}
			});
			emacs.bindKeys({"C-c C-e" : "addEnvironment"});
			editor.setKeyboardHandler(emacs);
			
			editor.addToolbarButton("add environment", "http://www.freefavicon.com/freefavicons/network/environment_add.gif", function(evt, btn) {
				emacs.commands.addEnvironment.exec(editor);		
  			}, {"addevent":1})
  		}
})(jQuery);
