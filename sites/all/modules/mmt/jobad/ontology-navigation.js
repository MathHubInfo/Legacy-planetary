(function($){

var ontologyNavigation = {
	info: {
		'identifier' : 'kwarc.mmt.ontology.navigation',
		'title' : 'MMT Navigation Service in based on ontology',
		'author': 'MMT developer team',
		'description' : 'A navigation service for browsing MMT repositories based on relational information ',
		'version' : '1.0',
		'dependencies' : [],
		'hasCleanNamespace': false
	},

    contextMenuEntries: function(target, JOBADInstance) {
    	var me = this;
    	var menu_entries = {};
    	if (target.hasAttribute('jobad:href')) {
			var uri = target.attr('jobad:href');
			menu_entries['Used In'] = me.getRelated(uri, qmt.tosubject("RefersTo"));
			menu_entries['Uses'] = me.getRelated(uri, qmt.toobject("RefersTo"));
		}
		return menu_entries;
    },

    getRelated: function(uri, relation) {
    	var query = qmt.related(qmt.literalPath(uri), relation);
    	var related_uris = {};
    	var me = this;
    	qmt.exec(query, 
    			 function(data) { 
    				$(data).find("uri").each(function (i, val) {
    					related_uris[$(val).attr('path')] = function() {me.planetaryOpen(uri);};
    				});
    			 },
    			 false);
    	console.log(related_uris);
    	return related_uris;
    },

    planetaryOpen : function(uri) {
    	window.location = uri;
    	return;
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
		//mirroring drupal in not escaping slashes
		return rawEncoded.replace(/%2F/g, "/");
    },
};

JOBAD.modules.register(ontologyNavigation);
})(jQuery);

