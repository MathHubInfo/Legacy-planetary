_newModule({
  
  info  : {
    'identifier'   : 'local_comments',
    'title'        : 'Local Comments',
    'author'       : 'Stefan Mirea',
    'description'  : 'Enable localized commenting on drupal',
    'dependencies' : [ 'tInfoBar' ]
  },
  
  options  : {
    // custom validation function. By default, this module appears for every element with an ID tag
    validation  : function( target ){ return !!target.id; }
  },
  
  basePath : Drupal.extraInfo.baseURL + 'sites/all/modules/local_comments/',
  
  validate : (function(){
    
    return function( event, container ){
      var info = {
        oldTarget : event.target,
        newTarget : null
      };
      if( this.options.validation( info ) ){
        var target      = info.newTarget || info.oldTarget;
        var id          = $(target).attr('id');
        var tooltip     = tContextMenu.m('tooltip');
        
        var ajaxImage =  $(document.createElement('img')).attr({'src': tContextMenu._opt.baseURL+'images/ajax.gif', 'height':16, title:"Loading..."});
        
        var obj = {};
        $.extend( obj, tContextMenu.templates.moduleOutput, {
          element     : container,
          text        : 'Localized comments',
          description : 'View/add a local comment',
          icon        : this.basePath + 'images/local_comments.png',
          smallIcon   : this.basePath + 'images/local_comments_small.png',
          weight      : 50
        });
        
        container.bind( 'click.displayTooltip', function(){
          
        tooltip.set( ajaxImage ).target( container );
                    
        $.get( Drupal.extraInfo.baseURL + 'local_comments/get/' + Drupal.extraInfo.node.nid + '/' + id,
          function(r){
            var h = '<div style="text-align:center"><a target="_blank" href="'+getThreadsLink( id )+'">View threads</a></div>';
            for(var i in r)
              h += '<div class="localComments-thread">' +
                    '<div class="localComments-subject">' + r[i].subject + '</div>' +
                    '<div class="localComments-meta">' + r[i].name + '</div>' +
                  '</div>';
            
            h +=  '<table>'+
                    '<tr><td><input type="text" style="width:155px;resize:none" id="localComments_subject" /></td></tr>'+
					          '<tr><td><textarea style="width:155px;resize:none" id="localComments_text" ></textarea></td></tr>'+
					          '<tr><td style="text-align:right">'+
						          '<input type="button" value="Cancel" class="closeMe" />'+
						          '<input type="button" value="Create Thread" id="submitLocalComment" />'+
					          '</td></tr>'+
				         '</table>';
            
	          tooltip.set( h ).target( container );
	          
	          tooltip.com.tooltip
	            .find('#submitLocalComment')
	            .bind('click.submit', function(){
                var type  = 'localComment';
                var arg1  = escape( $('#localComments_subject').val() );
                var arg2  = escape( $('#localComments_text').val() );
                
                tooltip.set( ajaxImage ).target( container );
                $.get( Drupal.extraInfo.baseURL + 'local_comments/add/' +
                         0 + '/' +
                         Drupal.extraInfo.node.nid + '/' + 
            		    	   (id || 'ERROR') + '/' + 
                         arg1 + '/' + arg2, 
                    function(r){
		                  if( r['result'] === true ){
//				                  if( !s.data('infoBarIcon') ) infoBar.addToken(s, type);
			                  tooltip.com.tooltip.find('#localComments_subject, #localComments_text').val('Done...');
			                  tooltip.hide();
		                  } else {
		                    console.warn( r.error );
		                    tooltip.set( r.error );
		                  }
                    }
                );

              });
            }
          );
        });
        
        return obj;
      }
      
      return null;
    }
    
    function getThreadsLink( id ){
      return Drupal.extraInfo.baseURL + 'local_comments/showthread/' + Drupal.extraInfo.node.nid + '/' + id;
    }
    
  })()
  
});
