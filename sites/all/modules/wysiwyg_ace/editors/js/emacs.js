(function ($) {
    window.aceEmacs = {};
    var dialogLoad = false;
    var dataLoaded = false;
    
    window.aceEmacs.prepareEmacsMode = function (editor) {
      
      if (!dialogLoad) {
        dialogLoad = true;
        jQuery.get(Drupal.settings.basePath+"sites/all/modules/wysiwyg_ace/editors/dialogs.xml", function(data) {
            jQuery("body").append(data);
        }, "text");
      }
      
      function loadEnvironments(callback) {
        if (!dataLoaded) {
          dataLoaded = true;
          window.database = Exhibit.Database.create();
          window.database.loadLinks(function() {
              window.exhibit = Exhibit.create();
              window.exhibit.configureFromDOM();
              callback();
          });
        } else
        callback();
      }
      
      var emacs = window.ace.require("ace/keyboard/emacs").handler
      
      emacs.addCommands({
          addEnvironment : function (_editor) {
            var editor = _editor;
            loadEnvironments(function() {
                $("#ace_cmd_dialog").dialog({
                    width: "450px",
                    close: function() {
                      Exhibit.jQuery("#ace_cmd_dialog").unbind("onEnter");
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
                            for (x in params) {
                              if (typeof(values[x])==="undefined") {
                                values[x] = params[x]["default"];
                              }
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
                      setTimeout(function() {
                          editor.focus();
                      }, 100);
                    }
                    
                });
            });
            
          }
      });
      emacs.bindKeys({"C-c C-e" : "addEnvironment"});
      
      // THE Emacs mode tries to remap mouse clicks in a wrong way so
      // next 3 lines save the old mapping and restore it
      oldScreenFnc = editor.renderer.screenToTextCoordinates;
      editor.setKeyboardHandler(emacs);
      editor.renderer.screenToTextCoordinates = oldScreenFnc;
      editor.getSession().setUseWrapMode(true);
      editor.getSession().adjustWrapLimit(80);
      
      editor.addToolbarButton("add environment", "envInsertIcon", function(evt, btn) {
          emacs.commands.addEnvironment.exec(editor);    
        }, {"addevent":1})
    }
})(jQuery);
