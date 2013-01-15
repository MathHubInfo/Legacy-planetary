_newModule({
   
   info  : {
      'identifier'   : 'firstModule',
      'title'        : 'First Module',
      'author'       : 'Stefan Mirea',
      'description'  : 'This is the very first tContextMenu module, used for me to get an idea on ' +
                           'how a module template should look like and what should it return',
      'dependencies' : []
   },
   
   options  : {},
   
   validate : (function(){
      
      return function( event, container ){
         var target = event.target;

         var obj = {};
         $.extend( obj, tContextMenu.templates.moduleOutput, {
            element     : container,
            text        : 'Module_1',
            description : 'Module description',
            icon        : 'js/modules/icons/module1.png',
            smallIcon   : 'js/modules/icons/module1_small.png',
            weight      : 50
         });

         return obj;
      }
      
   })()
   
});
