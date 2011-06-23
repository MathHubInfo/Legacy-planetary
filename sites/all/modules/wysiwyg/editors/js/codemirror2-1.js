(function($) {

/**
 * Attach this editor to a target element.
 */
Drupal.wysiwyg.editor.attach.codemirror2 = function(context, params, settings) {
  // Attach editor.
  var editorID = "#"+params.field;
  var editorSettings = {
		  'mode' : settings["enabled"][0],
		  'lineNumbers' : true,
  };
  $(editorID).each(function (c, obj) {
	  var editor = CodeMirror.fromTextArea(obj, editorSettings);
	  jQuery.data(obj, 'editor', editor);
  });
};

/**
 * Detach a single or all editors.
 *
 * See Drupal.wysiwyg.editor.detach.none() for a full desciption of this hook.
 */
Drupal.wysiwyg.editor.detach.codemirror2 = function(context, params) {
  if (typeof params != 'undefined') {
    var editorID = "#"+params.field;
    $(editorID).each(function (c, obj) {
    	var editor = jQuery.data(obj, 'editor');
    	if (editor != null) {
        	editor.save();
        	editor.toTextArea();
        	jQuery.data($(editorID), 'editor', null);
        }
    });
    
  }
};

})(jQuery);
