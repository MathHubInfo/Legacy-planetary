_newModule({
   
   info  : {
      'identifier'   : 'dummyGenerator',
      'title'        : 'Dummy Generator',
      'author'       : 'Stefan Mirea',
      'description'  : 'Creates an arbitrary number of dummy items in the menu. Used for testing purposes',
      'dependencies' : []
   },
   
   options  : {
      // {int} the number of dummy elements to create
      number   : 3,
      // {int} if set, creates a random number of elements between options.number and options.random
      random   : false,
      // {boolean} if set, the dummys are generated with a random weight (10-90)
      randomOrder : false
   },
   
   validate : (function(){
      
      return function( event, container ){
         var target = event.target;

         var obj = [];
         var max;
         if( this.options.random )
            max = Math.floor( Math.random() * (this.options.random - this.options.number) ) + this.options.number;
         else
            max = this.options.number;
         
         for( var i=0; i<max; ++i ){
            obj.push({});
            $.extend( obj[i], this.menu.templates.moduleOutput, {
               element     : this.menu.emptyElement(),
               text        : 'Dummy '+(i+1),
               description : 'Dummy {'+(i+1)+'} description',
               weight      : this.options.randomOrder ? Math.floor( Math.random() * 80 ) + 10 : 10
            });
         }
         
         obj.push({});
         $.extend( obj[obj.length-1], this.menu.templates.moduleOutput, {
            element     : this.menu.emptyElement(),
            text        : 'Generator',
            description : 'Settings for the generator',
            weight      : 1,
            icon        : 'js/modules/icons/dummyGenerator.png',
            smallIcon   : 'js/modules/icons/dummyGenerator_small.png',
            children    : settingsGenerator.call( this, this.options, [['number', 'Min'], ['random', 'Max']])
         });
         
         return obj;
      }
      
      function settingsGenerator( settings, vals ){
         var output = [];
         for( var i in vals ){
            output.push({});
            vals[i].unshift(this.menu);
            $.extend( output[i], this.menu.templates.moduleOutput, {
               element     : settingsInput.apply( settings, vals[i] ),
               text        : '',
               description : ''
            });
            output[i].element.find('input').bind( 'change.update', function(){
               settings[ $(this).parent().data('opName') ] = parseInt( $(this).val() );
            });
         }
         return output;
      }
      
      function settingsInput( menu, opName, label ){
         label = label || opName;
         var elem = menu.emptyElement()
               .data('opName', opName)
               .append(
                  $(document.createElement('label'))
                     .attr({
                        'for' : 'DG_'+opName
                     })
                     .html(label+': '),
                  $(document.createElement('input'))
                     .attr({
                        'id'        : 'DG_'+opName,
                        'type'      : 'text',
                        'style'     : 'border:1px solid #696969; font-size:8pt',
                        'value'     : this[opName],
                        'size'      : 1,
                        'maxlength' : 2
                     })
               );
         return elem;
      }
      
   })()
   
});
