(function($){

var planetaryNavigation = {
	info: {
		'identifier' : 'kwarc.mmt.search',
		'title' : 'MMT/MWS Search Service in Planetary',
		'author': 'MMT developer team',
		'description' : 'The navigation service for browsing MMT repositories in Planetary',
		'version' : '1.0',
		'dependencies' : [],
		'hasCleanNamespace': false
	},
  
    leftClick: function(target, JOBADInstance){
      console.log('Left click');
    }, 


    contextMenuEntries: function(target, JOBADInstance) {
	  if (typeof window.getSelection != "undefined") {
        var sel = window.getSelection();		
	    var me = this;
	    return [ [
		  'Search selection', function() {me.planetary_search(sel);} ]
		];
	  }
	  return { 'Search word': function() {me.planetary_search(sel);} };
	},

	planetary_search: function(query) { 
		console.log(query);
	},
}


JOBAD.modules.register(planetaryNavigation);
})(jQuery);