_newModule({
   
   info  : {
      'identifier'   : 'viewSwitcher',
      'title'        : 'View Switcher',
      'author'       : 'Stefan Mirea',
      'description'  : 'Enables the user to change views'
   },
   
   options  : {},
   
   validate : (function(){
      
      return function( event, container ){
         var menu       = this.menu;
         var target     = event.target;
         var v          = menu._com.views.loaded;
         var current    = menu._com.currentView;
         var children   = [];
         for( var i in v ){
            if( v[i].info.identifier == current.info.identifier )
               continue;
            
            var el = menu.emptyElement();
            
            el
               .data('identifier', v[i].info.identifier)
               .bind( 'click.switchViews', function(){
                  menu.hide(
                     function( view ){ menu.setView( view ); },
                     [ $(this).data('identifier') ]
                  );
            });
            
            children.push( {} );
            $.extend( children[children.length-1], menu.templates.moduleOutput, {
               element     : el,
               text        : v[i].info.title,
               description : 'Toggle this view',
               icon        : 'js/modules/icons/viewSwitcher_view.png',
               smallIcon   : 'js/modules/icons/viewSwitcher_view_small.png'
            });
         }
         
         var obj = {};
         $.extend( obj, menu.templates.moduleOutput, {
            element     : container,
            text        : 'Change Views',
            description : 'Swap between views',
            weight      : 92,
            children    : children,
            icon        : 'js/modules/icons/viewSwitcher.png',
            smallIcon   : 'js/modules/icons/viewSwitcher_small.png'
         });

         return obj;
      }
      
   })()
   
});
