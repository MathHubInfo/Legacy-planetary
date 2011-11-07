(function($) {

Drupal.wysiwyg.editor.init.etherpad_lite = function(settings) {
	console.log(settings);
}
	
/**
 * Attach this editor to a target element.
 */
Drupal.wysiwyg.editor.attach.etherpad_lite = function(context, params, settings) {
  editorid = "#"+params.field;
  console.log(params);
  newID = params.field+"-editor";
  $(editorid).after($("<div>").attr("id", params.field+"-editor").attr("class","pad"));
  obj = $(editorid).next();
  egid = $("#etherpad_gid").val();
  nid = $("#etherpad_nid").val();
  if (typeof(egid) != "undefined") {
	  settings.egid = egid;
	  $(obj).pad({
			'padId': settings.egid+"$"+params.field,
			'host':settings.host, 
			'showChat':'true', 
			'showControls':'true',
		    'showLineNumbers'  : true,
		    'userName'	 : settings.user,
			});
	  if (nid.length>0) {
		  $(obj).pad({'getContents': {
			  "format": "txt",
			  "callback": function(txt) {
				  if (txt.length==1) {
					  $(obj).pad({'host':settings.host, 
   			  		  	'setContents':$(editorid).val(),
   			  		  	"nid" : nid,
   			  		  	'padId': settings.egid+"$"+params.field,
   			  		  	});   				  
				  }
			  }
		  }});
	  }

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
