(function( $ ){

  $.fn.pad = function( options ) {
    var settings = {
      'host'		 : 'http://beta.etherpad.org',
      'baseUrl'		 : '/p/',
      'showControls'     : false,
      'showChat'	 : false,
      'showLineNumbers'  : false,
      'userName'	 : 'unnamed',
      'useMonospaceFont' : false,
      'noColors'   : 'false'
    };
    // This reads the etherpad contents if required
    if ( options.getContents )
    {
      // Specify the target Div
      var options = options.getContents;

      // Get the frame properties and provide us with an export path
      var frameID = this.attr('id');
      var epframe = "epframe"+frameID;
      var frameUrl = document.getElementById(epframe).src;
      if (frameUrl.indexOf("?")>-1){
        frameUrl = frameUrl.substr(0,frameUrl.indexOf("?"));
      }
      var contentsUrl = frameUrl + "/export/html";
      if (typeof(options.format)!="undefined")
    	  contentsUrl = frameUrl + "/export/"+options.format;
      
      // perform an ajax call on contentsUrl and write it to the parent
      $.ajax({
    	  "url": contentsUrl,
          "async" : false,
    	  "success" : 
    		  function(data) {
        	  	if (typeof(options.callback)!="undefined")
        	  		options.callback(data);
          	  },
      });
      return;
    }
    
    if ( options.setContents ) {
    	
    	url = Drupal.settings.basePath+"localedit/sync/"+options.nid,
    	data = {
    		padid:	options.padId,
    		content:	options.setContents
    	};
    	console.log(data);
    	$.ajax({
    		"url": url,
    		"type": "POST",
    		"data": data,
    		"success": function() {
    			
    		}
    	});
    	return;
    }
    
    // This writes a new frame if required
    if ( options ) 
    { 
      $.extend( settings, options );
    }
    console.log(options);
    var epframe = this.attr('id');
    var iFrameLink = '<iframe id="epframe'+epframe+'" src="'+settings.host+settings.baseUrl+settings.padId+'?showControls='+settings.showControls+'&showChat='+settings.showChat+'&showLineNumbers='+settings.showLineNumbers+'&useMonospaceFont='+settings.useMonospaceFont+'&userName=' + settings.userName + '&noColors=' + settings.noColors + '"></iframe>';
    this.html(iFrameLink);

  };
})( jQuery );
