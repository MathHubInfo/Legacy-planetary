_newView({

    info      : {
        'identifier'  : 'iconMenu',
        'title'       : 'Icon Menu View',
        'author'      : 'Stefan Mirea',
        'description' : 'Provides an appealing icon-menu using the .icon property'+
                            +' of the modules'
    },
    
    options : {
         /** whether or not to add a label underneath the images */
         labels            : false,
         /** the distance the icons appear from the point of origin */
         distance				: 69,
         /** {int} grow the distance depending on the number of elements by: */
         growth            : 0,
         /** the angle at which the icon arrangement will start */
         angle             : 0,
         /** the time of animation */
         time					: 600,
         /** if set to true, the menu will appear where the pointer is, instead of the middle of the clicked object */
         mousePositioning	: false,
         /** specify whether or not to use static binding or live binding for the handles */
         liveBind				: false
    },
    
    stylesheets : [ 'js/views/css/iconMenu.css' ],
    
    classes : {
        item    : 'iconMenu-item'
    },
    
    render : function( itemList ){
        var struct = $();
        for( var i in itemList ){
            this.setupElement( itemList[i] );
            struct = struct.add( itemList[i].element );
            
            itemList[i].element.addClass( this.classes.item );
            
            if( itemList[i].children && itemList[i].children.length > 0 ){
                itemList[i].element
                    .append( this.menu.emptyContainer().html(this.render(itemList[i].children)) )
                    .addClass( this.menu._cls.node );
            }
        }
       
       return struct;

    },
    
    setupElement : function( obj ){
         var tmp = obj.element.find('.'+this.menu._cls.contentWrapper).eq(0);
         var element = tmp.length ? tmp : obj.element;
         
         element
            .prepend(
               $(document.createElement('img')).attr({
                  'src'   : obj.icon,
                  'alt'   : obj.text
               }),
               $(document.createElement('div')).attr({
                  'class'  : 'iconMenu-text'
               }).html( obj.text )
            ).attr({
               title : obj.description
            });
       
      return this;
    },
    
    positionMenu : function( event ){
      this.menu.getMenu().offset({
         left    : event.pageX,
         top     : event.pageY
      });
       /*
        if( this.options.mousePositioning ){
            x = e.pageX;
            y = e.pageY;
        } else {
            x = origin.offset().left + (origin.outerWidth() / 2);
            y = origin.offset().top  + (origin.outerHeight() / 2);
        }
       */
       return this;
    },
    
    show : function( callback, args ){
         var items      = this.menu.getMenu().children('.'+this.classes.item);
         var q          = 360 / items.length;
         var self       = this;
         var distance   = self.options.distance + self.options.growth * items.length;
         
         this.menu.getMenu().css('opacity',1).show();
         
         var CALLBACK = callback ? function(){ callback.apply( self, args ); } : null;
         
         var c = 0;
         items
           .show()
           .css({
               'position'  : 'absolute',
               'left'      : 0,
               'top'       : 0,
               'opacity'   : 0
            })
           .each(function(){
               var w       = $(this).outerWidth() / 2;
               var h       = $(this).outerHeight() / 2;
               var angle   = (-self.options.angle + c*q) * Math.PI/180;
               var fn      = items.length-1 == c ? CALLBACK : null;
               $(this)
                  .data( 'angle', angle )
                  .stop()
                  .css({
                     'left'  : -w,
                     'top'	  : -h
                  })
                  .animate({
                     'left'      : Math.cos( angle ) * distance - w,
                     'top'	      : Math.sin( angle ) * distance - h,
                     'opacity'   : 1
                  }, self.options.time, fn );
                ++c;
            });
        
        return this;
    },
    
    hide : function( callback, args ){
      var self = this;
      
      var CALLBACK;
      if( callback )
         CALLBACK = function(){ self.menu.getMenu().hide(); callback.apply( self, args ); };
      else
         CALLBACK = function(){ self.menu.getMenu().hide(); };
      
      var orig = {
         x  : this.menu.getMenu().offset().left,
         y  : this.menu.getMenu().offset().top
      };
      
      var TIME = 300;
      
      this.menu.getMenu()
         .children('.'+this.classes.item)
         .each(function(){
            var angle = $(this).data('angle');
            $(this).animate({
               left     : '+='+Math.cos( angle ) * 50,
               top      : '+='+Math.sin( angle ) * 50,
               opacity  : 0
            }, TIME);
         });
      
      setTimeout( CALLBACK, TIME );
      
      return this;
    }
});