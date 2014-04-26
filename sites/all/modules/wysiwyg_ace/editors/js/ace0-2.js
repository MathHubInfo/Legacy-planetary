(function($) {
			
function getDocumentID() {
  var m = document.URL.match("/node/([0-9]+)")
  if (m && m[1]) {
    return m[1];
  } else
  return Math.random();
}

function generateDocName(id, params) {
  if (params.field.match("edit-field-"))
    return "doc"+id+params.field; 
  else
    return "doc"+id+Math.random();
}

/**
 * Attach this editor to a target element.
 */
Drupal.wysiwyg.editor.attach.ace = function(context, params, settings) {
  // Attach editor.
  var editorID = "#"+params.field;
  var mode = "";
  var toolbardiv, editordiv, editorwrapper;
  cSettings = {
  	"mode" : "latex",
  	"ShareJS" : false,
  };
  
  if (typeof settings["enabled"]!="undefined") {
  	for (var i=0; i<settings["enabled"].length; ++i) {
  	  t = settings["enabled"][i].split("_");
  	  cSettings[t[0]]=t[1];
  	}
  }

  $(editorID).each(function (c, obj) {
  	jQuery(obj).hide();
  	  
  	editordiv = jQuery("<div>").attr("id","ace_"+params.field).attr("style"," height:400px; position:relative");
	  
  	jQuery(obj).after(editordiv);
  	var editor = ace.edit("ace_"+params.field);
	  editor.getSession().setValue(obj.value);
	  editor.setTheme("ace/theme/textmate");
	  editor.getSession().setMode("ace/mode/"+cSettings["mode"]);

    require.config({ baseUrl: Drupal.settings.editor_tools.editor_tools_path }),

    require(["editor_tools/main"], function(main) {

      var filePath = jQuery((jQuery(editorID).parents(".fieldset-wrapper").find("input")[0])).attr("value");
      handlers = main.enrich_editor(editor, "#ace_"+params.field, {root_path: Drupal.settings.editor_tools.editor_tools_path+"/", file:filePath});

      var toolbar = handlers.toolbar;
      var interpretter = handlers.interpretter;

      function download(file, callback) {
        jQuery.get(file, function(data) {
          callback(null, data);
        });
      };

      async.waterfall([
        function(callback) { download(Drupal.settings.editor_tools.editor_tools_path+"/macros/preferences.json", callback); },
        function(data, callback) { 
            if (typeof(data) == "string") data = JSON.parse(data);
            interpretter.loadAPI(data);
            callback();
        },
        function(callback) { download(Drupal.settings.editor_tools.editor_tools_path+"/macros/menu_layout.json", callback); },
        function(data, callback) {
           if (typeof(data) == "string") data = JSON.parse(data);
            toolbar.loadLayout(data);
            jQuery(handlers.header).find(".ribbon").ribbon();
            callback();
        }
      ]);
    });

	  jQuery.data(obj, 'editor', editor);
  });
};

/**
 * Detach a single or all editors.
 *
 * See Drupal.wysiwyg.editor.detach.none() for a full desciption of this hook.
 */
Drupal.wysiwyg.editor.detach.ace = function(context, params) {
  if (typeof params != 'undefined') {
    var editorID = "#"+params.field;
    $(editorID).each(function (c, obj) {
    	var editor = jQuery.data(obj, 'editor');
    	if (editor != null) {
    		obj.value = editor.getSession().getValue()  
        	jQuery.data(obj, 'editor', null);
        	jQuery("#ace_"+params.field).remove();
        }
    	jQuery(obj).show();
    });
  }
};

})(jQuery);
