<script type="text/javascript" src="http://code.jquery.com/jquery-1.7.1.min.js"></script>
<script type="text/javascript">
	window.onload = function() {
		$("span.omdoc-term").css("color", "blue")
			.css("cursor", "help")
			.click(function(e) {
				//send an event to the window that a navigation is taking place
				var el = document.createElement("sissi");
				$(el).attr("cd",$(e.target).attr("omdoc:cd"))
					.attr("symbol",$(e.target).attr("omdoc:name"));
				$(document.body).append(el);
				var evt = document.createEvent('Events');
				evt.initEvent("SissiNavigateEvent", true, false);
				el.dispatchEvent(evt);
			});
    }
</script>
<?php 
echo $content;
?>