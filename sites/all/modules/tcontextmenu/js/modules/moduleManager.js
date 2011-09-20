_newModule({
   
   info  : {
      'identifier'   : 'moduleManager',
      'title'        : 'Module Manager',
      'author'       : 'Stefan Mirea',
      'description'  : 'This allows the managing of modules via the menu itself',
      'dependencies' : []
   },
   
   validate : (function(){
      
      return function( event, container ){
         var menu       = this.menu;
         var target     = event.target;
         var children   = [];
         var m          = menu.getModules();
         var delim      = menu._com.modules.enabled.__length;
         
         for( var i in m ){
            if( m[i].info.identifier == this.info.identifier )
               continue;
            
            var el         = menu.emptyElement();
            var id         = 'moduleManager_'+m[i].info.identifier;
            var checkbox   = $(document.createElement('input'));
            
            checkbox
               .attr({
                  'type'      : 'checkbox',
                  'id'        : id,
                  'class'     : menu._cls.smallIcon,
                  'style'     : 'position:absolute;left:2px;top:-1px',
                  'checked'   : i < delim
               })
               .data( 'moduleName', m[i].info.identifier )
               .bind( 'change.updateModule', function(){
                  if( $(this).is(':checked') )
                     menu.enableModule( $(this).data('moduleName') );
                  else
                     menu.disableModule( $(this).data('moduleName') );
               });
               
            el.prepend(
               checkbox,
               $(document.createElement('label'))
                  .attr({
                     'for'    : id,
                     'class'  : menu._cls.contentWrapper
                  }).html( m[i].info.title )
            );
            
            children.push( {} );
            $.extend( children[children.length-1], menu.templates.moduleOutput, {
               element     : el,
               text        : '',
               description : 'Toggle this module',
               smallIcon   : false
            });
         }
         
         var obj = {};
         $.extend( obj, menu.templates.moduleOutput, {
            element     : container,
            text        : 'Module Manager',
            description : 'Configure modules',
            weight      : 91,
            children    : children,
            icon        : 'js/modules/icons/moduleManager.png',
            smallIcon   : 'js/modules/icons/moduleManager_small.png'
         });

         return obj;
      }
      
   })()
   
});
