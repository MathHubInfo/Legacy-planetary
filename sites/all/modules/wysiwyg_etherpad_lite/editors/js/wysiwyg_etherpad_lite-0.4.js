(function($) {

Drupal.wysiwyg.editor.init.etherpad_lite = function(settings) {
	console.log(settings);
}
	
/**
 * Attach this editor to a target element.
 */
Drupal.wysiwyg.editor.attach.etherpad_lite = function(context, params, settings) {
  editorid = "#"+params.field;
  newID = params.field+"-editor";
  $(editorid).after($("<div>").attr("id", params.field+"-editor").attr("class","pad"));
  obj = $(editorid).next();
  egid = $("#etherpad_gid").val();
  if (typeof(egid) != "undefined") {
	  settings.egid = egid;
	  $(obj).pad({
			'padId': settings.egid+"$"+params.field,
			'host':settings.host, 
			'showChat':'true', 
			'showControls':'true'
			});
	  $(editorid).hide();  
  }
};

/**
 * Detach a single or all editors.
 *
 * See Drupal.wysiwyg.editor.detach.none() for a full desciption of this hook.
 */
Drupal.wysiwyg.editor.detach.etherpad_lite = function(context, params) {
  editorid = "#"+params.field;
  newID = editorid+"-editor";
  
  $(newID).each(function(id, obj) {
	  $(obj).after($("<div>").attr("id", params.field+"-editor-val").attr("style","display:none"));
   	  $(obj).pad({'getContents': {
   		  "format": "txt",
   		  "callback": function(txt) {
   		   $(editorid).val(txt);
   	      }
   	  }});
   	  $(editorid).show();
   	  $(obj).hide();
   });
};

})(jQuery);
