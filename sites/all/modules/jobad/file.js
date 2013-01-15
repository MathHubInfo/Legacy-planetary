_newModule({
   
   info  : {
      'identifier'   : 'tInfoBar',
      'title'        : 'Info Bar',
      'author'       : 'Stefan Mirea',
      'description'  : 'Adds Info Bar functionality to the container',
      'dependencies' : []
   },
   
   scripts : [
      'js/modules/tInfoBar/tTooltip.css',
      'js/modules/tInfoBar/tInfoBar.css',
      'js/modules/tInfoBar/tTooltip.js',
      'js/modules/tInfoBar/tInfoBar.js'
   ],
   
   init : (function(){
   })(),
   
   options  : {},
   
   validate : (function(){
      
      return function( event, container ){
         var target = event.target;

         var obj = {};
         $.extend( obj, tContextMenu.templates.moduleOutput, {
            element     : container,
            text        : 'tInfoBar',
            description : 'tInfoBar settings',
            icon        : 'js/modules/icons/tInfoBar.png',
            smallIcon   : 'js/modules/icons/tInfoBar_small.png',
            weight      : 0
         });

         return obj;
      }
      
   })()
   
});
