(function($) {
    $("body").ready(function() {
	    var link = '<a href="#discuss" class="use-ajax ajax-processed"> New Discussion </a>'
		var discuss = $("<li>").append(link);
	    var contextMenu = $("<ul>").attr("id",
					     "localDiscussContextMenu").attr("class", "contextMenu").append(
													    discuss);
	    var contextMenuWrapper = $("<div>").append(contextMenu);
	    console.log(Drupal.ajax);
	    $("body").append(contextMenuWrapper);

	    $(".commentable").contextMenu({
		    menu: "localDiscussContextMenu"
			},
		function(action, el, pos) {
		    $.ajax({
			    url: "/testmod/view/4",
				success: function(data) {
				console.log(data);
			    }
		    	});
		    $('#edit-eid').val($(el).attr('id'));
		    console.log(
			  "Action: " + action + "\n\n" +
			  "Element ID: " + $(el).attr("id") + "\n\n" +
			  "X: " + pos.x + "  Y: " + pos.y + " (relative to element)\n\n" +
			  "X: " + pos.docX + "  Y: " + pos.docY+ " (relative to document)"
			  );
		});
	    //TODO: implement navigation / highlighting for a.local_comments

	});

})(jQuery);