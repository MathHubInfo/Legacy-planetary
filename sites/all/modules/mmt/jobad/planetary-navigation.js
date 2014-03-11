(function($){

var planetaryNavigation = {
	info: {
		'identifier' : 'kwarc.mmt.planetary.navigation',
		'title' : 'MMT Navigation Service in Planetary',
		'author': 'MMT developer team',
		'description' : 'The navigation service for browsing MMT repositories in Planetary',
		'version' : '1.0',
		'dependencies' : [],
		'hasCleanNamespace': false
	},
  

    leftClick: function(target, JOBADInstance) {
		if(target.hasAttribute('jobad:href')) {
			var uri = target.attr("jobad:href");
			var uriEnc = this.encode(uri);
			window.location = uriEnc;
			return true;
		}
		return false;
    },


    contextMenuEntries: function(target, JOBADInstance) {
		var blob_url = 'http://gl.mathhub.info/' + oaff_node_group  + "/" + oaff_node_archive + "/blob/master/source/" + oaff_node_rel_path;
		var blame_url = 'http://gl.mathhub.info/' + oaff_node_group  + "/" + oaff_node_archive + "/blame/master/source/" + oaff_node_rel_path;
		var res = {
			'View Source' : function() {window.open(blob_url, '_blank');},
			'View Change History' : function() {window.open(blame_url, '_blank');},
			'View Graph' : function() {$('#modal').modal()},
		};
		if (target.hasAttribute('jobad:href')) {			
			var mr = $(target).closest('mrow');
			var select = (mr.length === 0) ? target : mr[0];
			mmt.setSelected(select);
			var uri = target.attr('jobad:href');
			var me = this;
			res['Go To Declaration'] = function() {me.planetaryOpen(uri);};		
		} 
		return res;
	},

	planetaryOpen : function(uri) {
		uriSegs = uri.split("?");
		if (uriSegs.length < 2) {//document path 
			window.location.search = "?q=" + this.encode(uri);
		} else { //module, symbol or fragment path
			var modUri = uriSegs[0]; //getting doc
			window.location.search = "?q=" + this.encode(modUri);        
		}
	},


    encode : function(uri) {
		var rawEncoded = encodeURIComponent(uri);
		var matches = uri.match(/^((http[s]?|ftp):\/)?\/?([^:\/\s]+)((\/\w+)*\/)([\w\-\.]+[^#?\s]+)(.*)?(#[\w\-]+)?$/);
		var fragment = ""; //default
		if (matches[7] != undefined) {
			fragment = "#" + matches[7].substring(1); //removing beginning '?'
		}
		var path = matches[4] + "source/" + matches[6] + fragment;

		return path;
    },
};


JOBAD.modules.register(planetaryNavigation);
})(jQuery);