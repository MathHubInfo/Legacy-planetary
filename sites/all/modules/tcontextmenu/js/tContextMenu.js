
var tContextMenu = {};

console = console || {
   log   : function(){},
   warn  : function(){},
   info  : function(){},
   error : function(){}
};

(function($){
  $(function(){
   /** @namespace */
   tContextMenu = {
      /** @lends tContextMenu */
      
      /**
       * @namespace
       * The default options for the tContextMenu
       */
      options  : {
         /** the base url for the plugin itself - used for referencing components **/
         baseURI : './',
         /** the container in which the contextMenu will be triggered */
         target   : $(document),
         /** the default parent in which the contextMenu will be inserted */
         parent   : $(document.body),
         /** the offset of the menu from the cursor */
         offset   : { x: 5, y: 5 },
         /** path to default icons */
         defaultIcons : {
            small   : 'images/icons/noIcon_small.png',
            normal  : 'images/icons/noIcon.png'
         },
         /** list of views to be loaded. The first one will be set as currentView */
         views    : 'js/views/contextMenu.view.js',
         /**
          * settings for the modules
          * <p><code>'js/modules/module1.js'</code></p>
          * <p><code>[ 'js/modules/module1.js', false, { key1:value1, key2:'value2'} ]</code></p>
          */
         modules  : [
            // either specify a path
            'js/modules/module1.js',
            'js/modules/moduleManager.js'
            /* or a 3 component array with:
             * @param {String}  path
             * @param {Boolean}  enabled
             * @param {Object}  options
             */
         ]
      },
      
      /**
       * @namespace
       * The default classes for the tContextMenu
       */
      classes  : {
         /** The main class assigned to the menu */
         main           : 'tContextMenu',
         /** */
         node           : 'tContextMenu-node',
         /** */
         nodeHover      : 'tContextMenu-node-hover',
         /** */
         menu           : 'tContextMenu-menu',
         /** */
         hover          : 'tContextMenu-hover',
         /** */
         smallIcon      : 'tContextMenu-smallIcon',
         /** */
         icon           : 'tContextMenu-icon',
         /** */
         contentWrapper : 'tContextMenu-contentWrapper'
      },
      
      /** List of all current items in the menu. Used in building the structure, as a queue */
      _items : [],
      
      /**
       * @namespace
       * An object which stores all components used in the menu
       * @see tContextMenu.init-com
       */
      _com : {},

      /**
       * The main setup method. Creates and sets up triggers for the tContextMenu
       * @param options the options to be used for the menu (extend the defaults)
       * @param classes the classes to be used for the menu (extend the defaults)
       */
      init : function(options, classes){
         var opt = {};
         var cls = {};

         $.extend( true, opt, tContextMenu.options, options );
         $.extend( true, cls, tContextMenu.classes, classes );
         
         /** @namespace
          * The components used in the menu
          */
         var com = {
            /** the tContextMenu object. Remember it for later use inside methods */
            self                 : this,
            /** the initial menu element */
            menu                 : $(document.createElement('ul')),
            /** list of loaded files via the .load() method */
            components           : [],
            /**  */
            componentContainer   : $(document.createElement('div')),
            /** holds information about the modules */
            modules              : {
               enabled  : {
                  __length : 0
               },
               disabled : {
                  __length : 0
               },
               total    : opt.modules
            },
            /** holds information about the views */
            views                : {
               current  : null,
               loaded   : {},
               total    : opt.views
            },
            /** the current active view */
            currentView          : false
         };

         com.menu.addClass( cls.main );
         
         com.componentContainer
            .attr('id', 'tContextMenu_componentContainer')
            .hide();
            
         opt.target.prepend( com.menu, com.componentContainer );

         $(opt.target)
            .bind('contextmenu.tContextMenu', function(e){
                  com.self.onContextMenu.apply( com.self, [e] );
               }
            );

         com.menu
            .find('li')
            .live('mouseenter.showSubmenu', function(e){
               e.stopPropagation();
               com.self.hideMenu( $(this).siblings() );
               
               $(com.self).trigger('onElementHover', [e, $(this)]);
               if( $(this).hasClass(cls.node) ){
                  $(this)
                     .addClass( cls.nodeHover )
                     .children()
                     .filter('ul.'+cls.menu+':first')
                     .show();
               } else {
                  $(this).addClass( cls.hover );
               }
               $(com.self).trigger('afterElementHover', [e, $(this)]);
            });

         $(document).bind('click.hideMenu', function(e){
            if( e.which != 3 && !$(e.target).parents('.'+cls.main).length ){
               com.currentView.hide();
            }
         });
         
         this._opt = opt;
         this._cls = cls;
         this._com = com;
         
         function componentsLoaded( view, path, options ){
            if( com.views.loaded.length == com.views.total.length )
               $(com.self).trigger('onLoad', [ com ]);
         }
         
         function startLoadingViews(  ){
            if( com.modules.disabled.__length + com.modules.enabled.__length == com.modules.total.length ){
               opt.views = typeof opt.views == 'string' ? [opt.views] : opt.views;
               for( var i in opt.views ){
                  if( opt.views[i] instanceof Array )
                     com.self.loadView( opt.views[i][0], componentsLoaded, opt.views[i][1] );
                  else
                     com.self.loadView( opt.views[i], componentsLoaded );
               }
            }
         }
         
         for( var i in opt.modules ){
            if( typeof opt.modules[i] == 'string' )
               this.loadModule( opt.modules[i], startLoadingViews );
            else
               this.loadModule( opt.modules[i][0], startLoadingViews, opt.modules[i][1], opt.modules[i][2] )
         }
         $(com.self).trigger('initComplete');
      },
      
      /**
       * Hides the current menu and all its submenus
       * @param obj The current object to hide and all its submenu
       */
      hideMenu : function( obj ){
         $(this).trigger('onHideMenu', [obj]);
         obj = obj || this._com.menu;

         if( obj.is('li') )
            obj = obj.parent();
            
         obj
            .find('li.'+this.classes.hover+', li.'+this.classes.nodeHover)
            .removeClass(this.classes.hover)
            .removeClass(this.classes.nodeHover)
            .children()
            .filter('ul.'+this.classes.menu)
            .hide();
         
         $(this).trigger('onHideMenuAfter', [obj]);
         return this;
      },
      
      /**
       * @returns The menu jQuery element
       */
      getMenu  : function(){ return this._com.menu; },

      /**
       * Dynamically and asynchronously load a javascript file using JSONP
       * @param {String} path  The path to the file
       * @param {Function} callback  A callback function to be called after the load & initialization of the view
                              but right before the 'afterModuleLoad' trigger. The callback and trigger only occur
                              on success. For errors check the global jsonp error function and its triggers in 'init()'
       * @param {Object} jsonpOptions  options for the JSONP load
       */
      load  : function( path, callback, jsonpOptions ){
         callback     = callback || function(){};
         jsonpOptions = jsonpOptions || {};

         var com  = this._com;
         var self = this;
         
         if( com.components[ path ] ) 
            return this;
         
         $(self).trigger('onLoadComponent', [ path, callback ]);
         $.jsonp({
            url      : path,
            callback : jsonpOptions.callback || '_newComponent',
            error    : jsonpOptions.error    || function( data, textStatus ){
               $(com.self).trigger( 'componentLoadError', [ data, textStatus ] );
               console.warn( 'Failed to load file', data, textStatus );
            },
            success  : function( component, textStatus ){
               com.components[ path ] = component;
               callback( component, path );
               $(self).trigger('afterLoadComponent', [ component, path ]);
            }
         });
         
         return this;
      },
      
      /**
       * Returns the modules
       * @returns {Object}  An object containing detailed description about dependencies
       */
      getModuleDependencies : function( module ){
         if( typeof module == 'string' )
            module = this._com.modules.disabled[module];
         if( !module ){
            console.warn( 'tContextMenu.checkModuleDependencies(): Invalid module');
            return false;
         }
         
         var result = {
            modules  : {
               enabled  : [],
               disabled : [],
               missing  : []
            },
            scripts  : {
               loaded   : [],
               missing  : []
            }
         };
         //TODO: FIX THIS PART!!!! BADLY FIX IT!!!
/*
         var d = module.info.dependencies;
         for( var i in d ){
            if( this._com.modules.disabled[d[i]] )
               result.modules.disabled.push( d[i] );
            else {
              if( this._com.modules.enabled[d[i]] )
                result.modules.enabled.push( d[i] );
              else {
                var m   = tContextMenu._opt.modules;
                var ok  = false;
                for( var j in m ){
                  console.log( d[i], m[j] );
                  if( (typeof m[j] == 'string' && d[i] == m[j]) || (m[j] instanceof Array && m[j][0] == d[i] && !m[j][1]) )
                    ok = true;
                  break;
                }
                if( ok )
                  result.modules.enabled.push( d[i] );
                else
                  result.modules.missing.push( d[i] );
              }
            }
         }
*/
        //TODO: FIX THIS PART: CHECK TYPE OF SCRIPT AND CHECK FOR BOTH CSS/SCRIPT!!!
         for( var i in module.scripts ){
            var script = this._com.componentContainer.find('script[src="'+module.scripts[i]+'"]');
            if( script.length )
               result.scripts.loaded.push( script );
            else
               result.scripts.missing.push( module.scripts[i] );
         }
         
         return result;
      },
      
      /**
       * _Attempts_ to resolve the dependencies of a module: loads missing scripts,
       * enables disabled modules, fails upon missing module
       * @returns {Boolean}
       */
      resolveModuleDependencies : function( module ){
         if( typeof module == 'string' )
            module = this._com.modules.disabled[module];
         if( !module ){
            console.warn( 'tContextMenu.resolveModuleDependencies(): Invalid module');
            return false;
         }
         
         var i, result = true;

         var d = this.getModuleDependencies( module );
         if( d.modules.missing.length ){
            console.warn( 'tContextMenu.resolveModuleDependencies(): Missing modules: '+d.modules.missing.join(', ') );
            result = false;
         }
         
         if( d.modules.disabled.length ){
            for( i in d.modules.disabled ){
               if( !this.enableModule(d.modules.disabled[i]) ){
                  console.warn( 'tContextMenu.resolveModuleDependencies(): ['+module.info.identifier+'] Unable to enable module: '+d.modules.disabled[i] );
                  result = false;
               }
            }
         }
         
         if( d.scripts.missing.length ){
            for( i in d.scripts.missing ){
               this.loadScript( d.scripts.missing[i], module.info.identifier );
            }
         }
         
         return result;
      },
      
      /**
       * Loads a css/javascript script by creating an apropriate tag in the DOM
       * @param {String} path  The path to the script
       * @param {String} identifier  An identifier for the script
       * @returns {Boolean}  whether an apropriate tag was created or not
       */
      loadScript : function( path, identifier ){
         identifier = identifier || 'script_'+Math.floor( Math.random()*696969 );
         var script;
         var extension  = path.slice( path.lastIndexOf('.')+1 );
         path           += '?_=' + Math.floor(Math.random() * 69000);
         if( extension == 'css' ) {
            script = $(document.createElement('link'))
            script
               .attr({
                  //TODO: Add ALTERNATE STYLESHEETS
                  'rel'    : 'stylesheet',
                  'type'   : 'text/css',
                  'href'   : path,
                  'target' : identifier,
                  // Some browser require titles for style switching to work
                  'title'  : identifier+'_'+Math.floor( Math.random()*696969 )
               });
               //TODO: Fix this as well
//            script[0].disabled = true;
         } else if( extension == 'js' ){
            script = $(document.createElement('script'));
            script
               .attr({
                  'type'   : 'text/javascript',
                  'src'    : path,
                  'target' : identifier
               });
         } else {
            return false;
         }
         
         this._com.componentContainer.append( script );
         return script;
      },
      
      /**
       * Dynamically and asynchronously load a module
       *
       * @param {String} path  The path to the file
       * @param {Function} callback  A callback function to be called after the load & initialization of the function
                           but right before the 'afterModuleLoad' trigger. The callback and trigger only occur
                           on success. For errors check the global jsonp error function and its triggers in 'init()'
       * @param {Boolean} disabled  A boolean telling whether to have the module loaded but disabled or not
       * @param {Object} options  The options for the module
       */
      loadModule  : function( path, callback, disabled, options ){
         callback = callback || function(){};
         
         var com  = this._com;
         var self = this;
         
         $(self).trigger('moduleLoad', [ path, callback, disabled, options ]);
         
         this.load(
            path, 
            function( component, path ){
               var module = {};
               $.extend( true, module, self.templates.module, component );
               $.extend( module.options, options );
               module.menu = self;
               
               if( com.modules.enabled[module.info.identifier] || com.modules.disabled[module.info.identifier] )
                  return;
               
               com.modules.disabled[module.info.identifier] = module;
               ++com.modules.disabled.__length;
               if( !disabled )
                  self.enableModule( module.info.identifier, options );

               callback( module, path, disabled, options );
               $(self).trigger('afterModuleLoad', [ module, path, options, disabled ]);
            }, 
            {
               callback : '_newModule'
            }
         );
         
         return this;
      },
      
      /**
       * Returns all modules of a certain type. <br />
       * Basically returns all methods that don't start with '__'
       * @param {String} type  If not specified, it will return all modules: enabled + disabled
       * @returns {Array}  A list of modules
       */
      getModules : function( type ){
         if( typeof type == 'undefined' ){
            return this.getModules('enabled').concat( this.getModules('disabled') );
         } else {
            var result = [];
            for( var i in this._com.modules[type] ){
               if( i.indexOf('__') == 0 )
                  continue;
               result.push( this._com.modules[type][i] );
            }
            return result;
         }
      },
      
      /**
       * Enabled a module
       * @param {String} name  The module identifier
       * @param {Object} options  The options for the module
       * @returns {Boolean}  success/fail
       */
      enableModule : function( name, options ){
         if( this._com.modules.enabled[name] )
            return true;

         if( this._com.modules.disabled[name] ){
            if( this.resolveModuleDependencies( name ) ){
               this._com.modules.enabled[name] = this._com.modules.disabled[name];
               delete this._com.modules.disabled[name];
               ++this._com.modules.enabled.__length;
               --this._com.modules.disabled.__length;
               
               this._com.componentContainer.find('link[target="'+name+'"]').each( function(){ this.disabled = false; $(this).attr('disabled', false);} );
//               .attr('disabled', true).attr('disabled', false);
               this._com.modules.enabled[name].init( options );
               
               return true;
            } else {
               console.warn( 'tContextMenu.enableModule(): ['+name+'] Unable to resolve dependencies!' );
               return false;
            }
         } else {
            console.warn( 'tContextMenu.enableModule(): ['+name+'] Module not found!' );
            return false;
         }
      },
      
      /**
       * Disable a module
       * @param {String} name  The module identifier
       * @returns {Boolean}  success/fail
       */
      disableModule : function( name ){
         if( this._com.modules.disabled[name] )
            return this;
         
         if( this._com.modules.enabled[name] ){
            this._com.modules.disabled[name] = this._com.modules.enabled[name];
            delete this._com.modules.enabled[name];
            --this._com.modules.enabled.__length;
            ++this._com.modules.disabled.__length;
            return true;
         } else {
            console.warn( 'tContextMenu.disableModule(): Module "'+name+'" not found!' );
            return false;
         }
         
         return this;
      },
      
      /**
       * Gets a module if it is enabled
       * @param {String} name  The name of the module
       * @return {Object}  The module if enabled or null
       */
      m : function( name ){
        return this._com.modules.enabled[ name ] || null;
      },
      
      /**
       * Dynamically and asynchronously load a view
       *
       * @param path The path to the file
       * @param callback A callback function to be called after the load & initialization of the view
                           but right before the 'afterModuleLoad' trigger. The callback and trigger only occur
                           on success. For errors check the global jsonp error function and its triggers in 'init()'
       * @param disabled A boolean telling whether to have the view loaded but disabled or not
       */
      loadView : function( path, callback, options ){
         callback = callback || function(){};
         
         var com  = this._com;
         var self = this;
         
         $(self).trigger('onViewLoad', [ path, callback ]);
         
         this.load( 
            path,
            function( component, path ){
               var view = {};
               $.extend( true, view, self.templates.view, component );
               $.extend( view.options, options );
               view.menu = self;
               
               com.views.loaded[view.info.identifier] = view;
               if( !com.currentView ){
                  if( !self.setView( view.info.identifier ) )
                     console.warn( 'tContextMenu.loadView(): Unable to set view: '+view.info.identifier);
               }
               
               callback( view, path, options );
               $(self).trigger('afterViewLoad', [ view, path, options ]);
            }, {
               callback : '_newView'
            }
         );
      },
      
      /**
       * Enables a view, loads its stylesheets, unloads the old stylesheets, etc
       * @param {String} identifier  The identifier of the view
       * @returns {Boolean} Success/Fail
       */
      setView : function( identifier ){
         
         if( this._com.currentView && identifier == this._com.currentView.info.identifier )
            return true;
         
         if( !this._com.views.loaded[ identifier ] ){
            console.warn( 'tContextMenu.setView(): View "'+name+'" not found!' );
            return false;
         }
         
         var view = this._com.views.loaded[ identifier ];
         
         $(this).trigger( 'onSetView', [identifier] );

         // Unload old StyleSheets
         if( this._com.currentView )
            this._com.currentView._stylesheets.each( function(){ this.disabled = true; } );
            //.attr('disabled', true);

         // Load/enable new StyleSheets
         if( view.stylesheets && view.stylesheets.length ){
            if( view._stylesheets && view._stylesheets.length ){
               view._stylesheets.each( function(){ this.disabled = false; } );
               //.attr('disabled', false);
            } else {
               view._stylesheets = $();
               for( var j in view.stylesheets ){
                  var script = this.loadScript( view.stylesheets[j], view.info.identifier );
                  if( script )
                     view._stylesheets = view._stylesheets.add( script );
                  else 
                     console.warn('['+view.info.identifier+'] Unable to load stylesheet: '+view.stylesheets[i]);
               }
               this._com.componentContainer.append( view._stylesheets );
               view._stylesheets.each( function(){ this.disabled = false; } );
            }
         }
         
         view.menu = this;
         this._com.currentView = view;
         $(this).trigger( 'afterSetView', [identifier] );
         
         return true;
      },
            
      /**
       * Method that is called upon right-click
       */
      onContextMenu  : function(e){
         this._items = [];
         var modules = this.getModules('enabled');
         for( var i in modules ){
            var elem = modules[i].validate( e, this.emptyElement() );
            if( elem ){
              elem._targetEvent = e;
              this.add( elem );
            }
         }

         if( this._items.length > 0 ){
            e.preventDefault();

            this._items.sort(function(a, b){ return a.weight - b.weight; });  
            $(this).trigger('onRenderMenu', [e]);
            this._com.currentView.build( e, this._items );
            $(this).trigger('afterRenderMenu', [e]);
         }
         
      },
      
      /**
       * Returns an empty element
       * @param attributes The attributes to be set
       * @return The new element
       */
      emptyContainer : function( attributes ){
         var elem = $(document.createElement('ul'));
         elem.addClass( this._cls.menu ).attr( attributes );
         return elem;
      },
      
      /**
       * Returns an empty element
       * @param attributes The attributes to be set
       * @return The new element
       */
      emptyElement  : function( attributes ){
         var elem = $(document.createElement('li'));
         elem.attr( attributes );
         return elem;
      },
      
      /**
       * Adds one or more elements to the menu
       * @param {mixed} collection  An extended .emptyElement() or an array of .emptyElement()
       */
      add : function( collection ){
         if( collection ){
            if( collection instanceof Array ) {
               for( var i=0; i<collection.length; ++i )
                  this._items.push( collection[i] );
            } else
               this._items.push( collection );
         }
         return this;
      },
      
      /**
       * Clears the items array
       */
      clear : function(){
         tContextMenu._items = [];
      },
      
      /**
       * Same as calling tContextMenu._com.currentView.show()
       * @see tContextMenu.templates.view.show
       */
      show : function( callback, args ){
         tContextMenu._com.currentView.show.apply( tContextMenu._com.currentView, arguments );
      },
      
      /**
       * Same as calling tContextMenu._com.currentView.hide()
       * @see tContextMenu.templates.view.hide
       */
      hide : function( callback, args ){
         tContextMenu._com.currentView.hide.apply( tContextMenu._com.currentView, arguments );
      },
      
      /**
       * @namespace
       * Stores the default templates for modules, views, outputs, etc.
       * These are the base elements which get extended.
       */
      templates   : {
         /**
          * @namespace
          * The base template for a view. This will be expanded with the loaded object
          */
         view  : {
            /**
             * @namespace
             * Object containing general information about the view
             */
            info        : {
               /** The machine name of the view. Used in dependency references */
               'identifier'   : '_randomView_'+Math.floor(Math.random() * 1000),
               /** The human-readable name for the module */
               'title'        : 'Default View', 
               /** The author of the module */
               'author'       : 'No Author',
               /** The description of the module */
               'description'  : 'This template will be expanded with the loaded object',
               /** List of views that this view depends on */
               'dependencies' : []
            },
            /** Default view-specific options used */
            options     : {},
            /** Default view-specific classes used */
            classes     : {},
            /** Default view-specific images. TODO: Preload images */
            images      : {},
            /** Stylesheets to be imported along with the view */
            stylesheets : [ 'js/views/css/contextMenu.css' ],
            /** Used to store the store the stylesheet jQuery collection */
            _stylesheets : $(),
            /**
             * Initializes the view. Called upon view set
             */
            init : function( ){},
            /**
             * Performs all actions to fully create and display the menu
             * @param {Event} event
             * @param {Array} itemList
             */
            build : function( event, itemList ){
               this.set( this.render( itemList ) );
               this.show();
               this.positionMenu( event );
               return this;
            },
            /**
             * Sets the structure of the menu. Usually .html()
             * @param {jQuery} structure
             */
            set : function( structure ){
               this.menu.getMenu().html( structure );
            },
            /**
             * Method that takes the menu element and recursively renders it accordingly 
             * @param {Array} itemList  The list of items to be added to the menu
             *
             * @returns {jQuery}  The structure of the menu
             */
            render : function( itemList ){
               var struct = $();
               for( var i in itemList ){
                  this.setupElement( itemList[i] );
                  struct = struct.add( itemList[i].element );
                  itemList[i].smallIcon = itemList[i].smallIcon || tContextMenu._opt.defaultIcons.small;
                  itemList[i].element.prepend('<img src="'+itemList[i].smallIcon+'" class="'+this.menu._cls.smallIcon+'"/>');

                  if( itemList[i].children && itemList[i].children.length > 0 ){
                     itemList[i].element
                        .append( this.menu.emptyContainer().html(this.render(itemList[i].children)) )
                        .addClass( this.menu._cls.node );
                  }
               }
               
               return struct;
            },
            /**
             * Given an extendend .emptyElement() it modelates it (adds content, attributes, etc)
             * @param {Object} &obj  The extended element
             */
            setupElement : function( obj ){
               var tmp = obj.element.find('.'+this.menu._cls.contentWrapper).eq(0);
               var element = tmp.length ? tmp : obj.element;

               element
                  .append( obj.text )
                  .attr({
                     title : obj.description
                  });
               
               return this;
            },
            /**
             * Positions the menu
             * @param {Event} event
             */
            positionMenu : function( event ){
               this.menu.getMenu().offset({
                  left    : event.pageX,
                  top     : event.pageY
               });
               
               return this;
            },
            /**
             * Show animation
             * @param {Function} callback  a callback function
             * @param {Array} args  the arguments for the callback function
             */
            show : function( callback, args ){
               if( callback ){
                  var self = this;
                  this.menu.getMenu().fadeIn( 500, function(){ callback.apply( self, args ) } );
               } else
                  this.menu.getMenu().fadeIn( 500 );
                  
               return this;
            },
            /**
             * Hide animation
             * @param {Function} callback  a callback function
             * @param {Array} args  the arguments for the callback function
             */
            hide : function( callback, args ){
               if( callback ){
                  var self = this;
                  this.menu.getMenu().fadeOut( 300, function(){ callback.apply( self, args ) } );
               } else
                  this.menu.getMenu().fadeOut( 300 );
                  
               return this;
            }
         },
         /**
          * @namespace
          * Standard output for modules
          */
         moduleOutput   : {
            /** the container element given as the 3rd argument */
            element     : null,
            /** usually the html of the element */
            text        : 'No text',
            /** description of the field. By default, it is used as a title attribute, but possibilities are endless */
            description : false,
            /** a general 32x32 multipurpose icon */
            icon        : false,
            /** a general 16x16 multipurpose icon */
            smallIcon   : false,
            /** the weight determines the position in the menu. 0 means first. 
            Weights should be between 10 - 90. Bellow/Above that value should be used for "fixed" items (i.e: moduleManager, viewSwitcher) */
            weight      : 10,
            // A list of children. If set, this object will become a node in the tree-structure
            children    : []
         },
         /**
          * @namespace
          * The base template for a module. This will be expanded with the loaded object
          */
         module   : {
            /**
             * @namespace
             * Object containing general information about the module
             */
            info  : {
               /** The machine name of the module. Used in dependency references */
               'identifier'   : '__templateModule',
               /** The human-readable name for the module */
               'title'        : 'Base Template Module',
               /** The author of the module */
               'author'       : 'No Author',
               /** The description of the module */
               'description'  : 'This template will be expanded with the loaded object',
               /** List of module identifiers. By default, all modules should depend on the core module */
               'dependencies' : false
            },
            /** Array of paths to required scripts. */
            scripts  : [],
            /**
             * Default module-specific options. <br />
             * These are extended with the options provided upon load
             */
            options  : {},
            /** Default module-specific classes used */
            classes  : {},
            /** Default module-specific images. TODO: Preload images */
            images   : {},
            /**
             * A method that is called once the module has been enabled
             */
            init     : (function(){
               return function(){};
            })(),
            
            /**
             * A method that takes a the menu object and the event as parameters,
             *    applies a validation rule and returns a specific object if true
             * @param {Event} event The event associated with the action
             * @param {jQuery} container The container in which the output will be wrapped with
             * 
             * @return {mixed} Must return an extension of .emptyElement() or a list or .emptyElement()
             */
            validate : (function(){
               return function( event, container ){
                  var obj = {};
                  $.extend( obj, tContextMenu.templates.moduleOutput );
                  return false;
               }
            })()
          }
      }
      
   };
  });
})(jQuery);
