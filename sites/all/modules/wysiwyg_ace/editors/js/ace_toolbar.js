(function($) {
	window.ace_toolbar = {};
	window.ace_toolbar.initToolbar = function (editor) {
		container = $(editor.container);
		container_id = $(container).attr("id");
		toolbarid = "toolbar_"+ container_id;
		toolbardiv = $("<div>").attr("id",toolbarid).addClass("ui-widget-header ui-corner-all");

		wrapper = $("<div>").addClass("ace_toolbar_wrapper").attr("id", "wrapper_"+container_id); 
		
		$(container).wrap(wrapper);
		
		$("#wrapper_"+container_id).prepend(toolbardiv);

		editor.addToolbarButton = function(shortName, imageUrl, callback, data) {
  	  	  btn = $("<button>").append(shortName);
  	  	  $(btn).button({icons: {primary : "envInsertIcon"}, text : false } );
  	  	  $(btn).click(data, function(evt) {
  	  	  		  evt.preventDefault();
  	  	  		  callback(evt);
  	  	  });
  	  	  toolbardiv.append(btn)
  	  	}
	}
})(jQuery);
