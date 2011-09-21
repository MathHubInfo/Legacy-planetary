_newModule({
  
  info  : {
    'identifier'   : 'jobad',
    'title'        : 'JOBAD',
    'author'       : 'Stefan Mirea',
    'description'  : 'Enables some JOBAD features as part of the context menu',
    'dependencies' : ['tooltip']
  },
  
  init : function(){
    $.extend($.expr[':'], {
      math : function(a){
        var n = a.nodeName.toLowerCase();
        return n == 'm:math' || n == 'math';
      },
      mrow : function(a){
        return a.nodeName.toLowerCase() == 'm:row';
      },
      OMV : function(a){
        return a.nodeName == 'om:OMV';
      },
      OMS : function(a){
        return a.nodeName == 'om:OMS';
      }
		});
  },
  
  options  : {},
  
  validate : (function(){
    
    return function( event, container ){
      var self    = this;
      var target  = event.target;
      
      if( $(target).is(':math') || $(target).parentsUntil(':math').parent().is(':math') ){
        var obj = {};
        $.extend( obj, tContextMenu.templates.moduleOutput, {
          element      : container,
          text         : 'Definition Lookup',
          description  : 'Module description',
          icon         : tContextMenu._opt.baseURL + 'js/modules/icons/jobad.png',
          smallIcon    : tContextMenu._opt.baseURL + 'js/modules/icons/jobad_small.png',
          weight       : 0
        });
        
        obj.element.bind('click.definitionLookup', function(e){
          self.definitionLookup( target, container );
        });
        
        return obj;
      }
      
      return null;
    }
    
  })(),
  
  definitionLookup  : function( target, container ){
    var tooltip = tContextMenu.m('tooltip');
    if( $(target).attr('xref') ){
      var OMV = $(target).parentsUntil(':math').parent().find( '[id="'+$(target).attr('xref').slice(1)+'"]' );
      if( OMV ){
        var OMS = OMV.is('ooms') ? OMV : OMV.parentsUntil('ooms').parent();
        var opt = {
          cd    : OMS.attr('cd'),
          name  : OMS.attr('name')
        };
        if( opt.cd && opt.name ){
          var url = Drupal.extraInfo.baseURL + 'tcontextmenu/definitionLookup/'+opt.cd+'/'+opt.name;
          
          tooltip
            .set( $(document.createElement('img')).attr({'src':tContextMenu._opt.baseURL + 'images/ajax.gif','width':16}) )
            .target( container );
            
          $.get( url, 
            function(r){
              tooltip
                .set( r.result )
                .target( container );
          });
        }
      }
    }
  }
  
});
