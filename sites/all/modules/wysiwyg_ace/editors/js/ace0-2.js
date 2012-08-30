(function($) {
		
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
  	  
  	  editordiv = jQuery("<div>").attr("id","ace_"+params.field).attr("style"," height:200px; position:relative");
	  
  	  jQuery(obj).after(editordiv);
  	  var editor = ace.edit("ace_"+params.field);
	  window.ace_toolbar.initToolbar(editor);
  	  editor.getSession().setValue(obj.value);
	  editor.setTheme("ace/theme/twilight");
	  editor.getSession().setMode("ace/mode/"+cSettings["mode"]);

	  window.aceEmacs.prepareEmacsMode(editor);
	  if (cSettings["ShareJS"]) {
	  	  async.waterfall([
	  	  		  function (callback) {
	  	  		  	  Drupal.ShareJS.connectServices("test-doc", "ace", editor, editor.getSession().getValue(), callback)
	  	  		  },
	  	  		  function (conn, callback) {	
	  	  		  	  conn.initToolbar(toolbardiv);
	  	  		  	  callback(null);
	  	  		  }
	  	  ]);
	  }
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
