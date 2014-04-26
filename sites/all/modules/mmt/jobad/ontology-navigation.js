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
			menu_entries['Used In'] = me.getRelated(uri, qmt.tosubject("Includes"));
			menu_entries['Uses'] = me.getRelated(uri, qmt.toobject("Includes"));
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
    					var path = $(val).attr('path');
    					related_uris[path] = function() {planetary.navigate(path);};
    				});
    			 },
    			 false);
    	return related_uris;
    },

	
};

JOBAD.modules.register(ontologyNavigation);
})(jQuery);

