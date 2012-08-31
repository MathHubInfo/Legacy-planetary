(function ($) {
		window.aceEmacs = {};
 		var loaded = false;
		window.aceEmacs.prepareEmacsMode = function (editor) {
			if (!loaded) {
				jQuery.get(Drupal.settings.basePath+"sites/all/modules/wysiwyg_ace/editors/dialogs.xml", function(data) {
						jQuery("body").append(data);
				}, "text");
		 	}
			var emacs = window.ace.require("ace/keyboard/emacs").handler;
			emacs.addCommands({
					addEnvironment : function (_editor) {
						var editor = _editor;
						$("#ace_cmd_dialog").dialog({
								width: "450px",
								close: function() {
									editor.focus();
								}
						});
						Exhibit.jQuery("#ace_cmd_dialog").bind("onEnter", function(evt, data) {
								db = data.db;
								item = data.item;
								var template = db.getObject(item, "template");
								params = db.getObject(item, "params");
								$("#ace_cmd_dialog").dialog("close");
								$("#ace_properties_cmd_name").text(item);
								$("#ace_properties_form").empty();
								
								if (params) {
									var form = $("#ace_properties_form").jsonForm({
											schema : params,
											onSubmit : function (errors, values) {
												if (errors) {
													return false;
												}
												$("#ace_properties").dialog("close");
												try {
													editor.insert(_.template(template, values));
												} catch (e) {
													console.log(e);
												}
												setTimeout(function() {
														editor.focus();
												}, 100);
												return false;
											}
									});
									setTimeout(function() {
										$("#ace_properties").dialog();
									}, 200);

								} else {
									editor.insert(_.template(template, {}));
								}
								
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
