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
			var uriEnc = planetary.relNavigate(uri);
		}
		return false;
    },


    contextMenuEntries: function(target, JOBADInstance) {
		var blob_url = 'http://gl.mathhub.info/' + oaff_node_group  + "/" + oaff_node_archive + "/blob/master/source/" + oaff_node_rel_path;
		var blame_url = 'http://gl.mathhub.info/' + oaff_node_group  + "/" + oaff_node_archive + "/blame/master/source/" + oaff_node_rel_path;
		var res = {
			'View Source' : function() {window.open(blob_url, '_blank');},
			'View Change History' : function() {window.open(blame_url, '_blank');},
			'View Graph' : function() {$('#svg_modal').modal()},
		};
		if (target.hasAttribute('jobad:href')) {			
			var mr = $(target).closest('mrow');
			var select = (mr.length === 0) ? target : mr[0];
			mmt.setSelected(select);
			var uri = target.attr('jobad:href');
			var me = this;
			res['Go To Declaration'] = function() {planetary.navigate(uri);};
			res['Show Definition'] = function() {
				$.ajax({ 
				  'url': mmtUrl + "/:immt/query",
   	  			  'type' : 'POST',
			      'data' : '{ "subject" : "' + uri + '",' + 
			      	'"relation" : "isDefinedBy",' + 
			        '"return" : "planetary"}',
			       'dataType' : 'html',
			       'processData' : 'false',
	       			'contentType' : 'text/plain',
	              'crossDomain': true,
                  'success': function cont(data) {
  					$('#dynamic_modal_content').html(data);
  					$('#dynamic_modal').modal();
                  },
                  'error' : function( reqObj, status, error ) {
					console.log( "ERROR:", error, "\n ",status );
		    	  },
                });
			};
		} 
		return res;
	},
    
};

JOBAD.modules.register(planetaryNavigation);
})(jQuery);

