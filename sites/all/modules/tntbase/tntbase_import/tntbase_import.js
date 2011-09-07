(function($) {
	function selectFiles(f) {
		val = $("#edit-tntpath").text();
		for (i=0; i<f.length; i++) {
			file = f[i].file;
		  	pos = file.indexOf("///");
			val+=file.substr(pos+2)+"\n";
		}
		$("#edit-tntpath").text(val);
	}
	
	$(function(){
		$("#edit-taxonomy-link").click(function() {
			$.sfb({"select":selectFiles});
			return false;
		});
	});
})(jQuery);