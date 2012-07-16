(function($) {

/**
 * Attach this editor to a target element.
 */
Drupal.wysiwyg.editor.attach.ace = function(context, params, settings) {
  // Attach editor.
  var editorID = "#"+params.field;
  var mode = "";
  if (settings["enabled"]===undefined || settings["enabled"][0]===undefined)
    mode = "latex";
  else
    mode = settings["enabled"][0];
  $(editorID).each(function (c, obj) {
  	  jQuery(obj).hide();
  	  t = jQuery("<div>").attr("id","ace_"+params.field).attr("style"," height:200px; position:relative");
  	  jQuery(obj).after(t);
  	  var editor = ace.edit("ace_"+params.field);
  	  editor.getSession().setValue(obj.value);
	  editor.setTheme("ace/theme/twilight");
	  editor.getSession().setMode("ace/mode/"+mode);
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
