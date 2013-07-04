# How to write Modules

It is easy to write modules. A module is a JSON object with several properties. Take a look at the following template: 

```js
var template = {
	/* Module Info / Meta Data */
	info:{
		'identifier':	'template',  //(Unique) identifier for this module, preferably human readable. 
		'title':	'Template Module', //Human Readable title of the module. 
		'author':	'Template Author', //Author
		'description':	'A template you may use as a starting point for writing other modules. ', //A human readable description of the module. 
		'url': 'http://example.com', //website url (if available)
		'version':	'1.0', //string containing the version number. May be omitted. 
		'dependencies':	[], //Array of module dependencies. If ommited, assumed to have no dependencies. 
		'externals': [], //external scripts this module depends on
		'async': false, //should globalinit be async
		'hasCleanNamespace': true // Does this module contain only standard functions?
	},
	// Contains configuration which can be set by the user. May be omitted. 
	config: {
		"a_string": ["string", "default-value-goes-here", ["String", "With a default value. "]],
		"a_bool": ["bool", false, ["Boolean", "Either true or false. "]],
		"a_num": ["number", [-10, 10], 0, ["Number", "An awesome number between -10 and 10 "]],
		"an_int": ["integer", [-10, 10], 0, ["Integer", "An awesome integer between -10 and 10. "]],
		"a_list": ["list", [1, 2, 3, 4], 1, ["Select an option", "A", "B", "C", "D"]]
	}
	/* Init handlers */
    globalinit: function(next){
		/* 
			Called exactly once GLOBALLY. Can be used to initialise global module ids, etc. May be ommitted. Will be called once a module is loaded. 
			@param next	Callback if info.async is true. Should be called as a callback. 
			@this special object which has access to this.info, this.globalStore, this.UserConfig and non-clean functions
			@returns nothing
		*/
		//next(); //only if async is true 
	},
	init: function(JOBADInstance, param1, param2, param3 /*, ... */){
		/* 	
			Called to intialise a new instance of this module. 
			@this An instance of JOBAD.modules.loadedModule
			@param JOBADInstance The instance of JOBAD the module is initiated on. 
			@param *param Initial parameters passed to this.modules.load
			@return nothing. 
		*/
	},
	activate: function(JOBADInstance){
		/*
			Called every time this module is activated. 
			@this An instance of JOBAD.modules.loadedModule
			@param JOBADInstance The instance of JOBAD the module is activated on. 
		*/
	},
	deactivate: function(JOBADInstance){
		/*
			Called every time this module is deactivated. 
			@this An instance of JOBAD.modules.loadedModule
			@param JOBADInstance The instance of JOBAD the module is deactivated on. 
		*/
	},
	/* Event Handlers */
	leftClick: function(target, JOBADInstance){
		/*
			called when a left click is performed.  Every left click action is performed. May be ommitted. 
			@this An instance of JOBAD.modules.loadedModule
			@param target The element that has been left clicked on. 
			@param JOBADInstance The instance of JOBAD the module is initiated on.  
			@returns Returns true iff it performed some action. 
		*/
	},
	dblClick: function(target, JOBADInstance){
		/*
			called when a double click is performed.  
			@this An instance of JOBAD.modules.loadedModule
			@param target The element that has been double clicked on. 
			@param JOBADInstance The instance of JOBAD the module is initiated on.  
			@returns Returns true iff it performed some action. 
		*/
	},
	contextMenuEntries: function(target, JOBADInstance){
		/*
			called when a context menu is requested. Context Menu entries will be merged. May be ommitted.  
			@this An instance of JOBAD.modules.loadedModule
			@param target The element the menu has been requested on. 
			@param JOBADInstance The instance of JOBAD the module is initiated on. 
			@returns returns context menu entries as array [[entry_1, function_1], ..., [entry_n, function_1]] or as a map {entry_1: function_1, entry_2: function_2, ...}
				All entry names must be non-empty. (Empty ones will be ignored). 
		*/
	},
	hoverText: function(target, JOBADInstance){
		/*
			called when a hover text is requested. May be ommitted. 
			@this An instance of JOBAD.modules.loadedModule
			@param target The element the hover has been requested on. 
			@param JOBADInstance The instance of JOBAD the module is initiated on. 
			@returns a text, a jqueryish ($(...), Domnode, etc) object to use as hover or a boolean indicating either the text or if something was done. 
		*/
	},
	onEvent: function(event, element, JOBADInstance){
		/*
			called whenever another event is raised. Does not trigger for onEvent events and onSideBarUpdate events. 
			@this An instance of JOBAD.modules.loadedModule
			@param event The event that was raised. 
			@param element The element the event was triggered on. 
			@param JOBADInstance The instance of JOBAD the module is initiated on. 				
		*/
	},
	SideBarUpdate: function(JOBADInstance){
		/*
			called every time the sidebar is updated. May be ommitted. 
			@this An instance of JOBAD.modules.loadedModule
			@param JOBADInstance The instance of JOBAD the module is initiated on. 
			@returns nothing. 
		*/
	},
	configUpdate: function(setting, JOBADInstance){
		/*
			called every time the user configuration is updated. May be ommitted. 
			@this An instance of JOBAD.modules.loadedModule
			@param setting The setting which has been updated. 
			@param JOBADInstance The instance of JOBAD the module is initiated on. 
			@returns nothing. 
		*/
	}
};

JOBAD.modules.register(template); //don't forget to register it. 
```

When you write a module and you wish to use jQuery, do not use the "$" reference to jQuery. This might not be available if jQuery is in noConflict mode. Always use the JOBAD.refs.$ reference to jQuery. 
If you want to use the '$' inside your code you can use the following code. 

```js
(function($){
	/* your code with $'s here */
	/* JOBAD.modules.register(template); */
})(JOBAD.refs.$);
```

Before writing your first module, you may want to take a look at the [Example Modules](example_modules.md). 

Afterwards you can also take a look at individual parts of modules: 

* [Events](events.md) - What are events?
* [Tooltips](hover.md) - How to use tooltips in JOBAD
* [Context Menu](contextmenu.md) - How to use the context menu
* [Sidebar](sidebar.md) - How does the sidebar work?
* [Folding](folding.md) - Folding the DOM
* [Config UI](config.md) - How can I configure JOBAD modules?