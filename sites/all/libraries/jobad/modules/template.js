/*
	A template module. 
	
	Copyright (C) 2013 KWARC Group <kwarc.info>
	
	This file is part of JOBAD.
	
	JOBAD is free software: you can redistribute it and/or modify
	it under the terms of the GNU General Public License as published by
	the Free Software Foundation, either version 3 of the License, or
	(at your option) any later version.
	
	JOBAD is distributed in the hope that it will be useful,
	but WITHOUT ANY WARRANTY; without even the implied warranty of
	MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
	GNU General Public License for more details.
	
	You should have received a copy of the GNU General Public License
	along with JOBAD.  If not, see <http://www.gnu.org/licenses/>.
*/

var template = {
	/* Module Info / Meta Data */
	info:{
		'identifier':	'template',  //(Unique) identifier for this module, preferably human readable. 
		'title':	'Template Module', //Human Readable title of the module. 
		'author':	'Template Author', //Author
		'description':	'A template you may use as a starting point for writing other modules. ', //A human readable description of the module. 
		'version':	'1.0', //string containing the version number. May be omitted. 
		'dependencies':	[], //Array of module dependencies. If ommited, assumed to have no dependencies. 
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
    globalinit: function(){
		/* 
			Called exactly once GLOBALLY. Can be used to initialise global module ids, etc. May be ommitted. Will be called once a module is loaded. 
			@this undefined. 
			@returns nothing
		*/
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

JOBAD.modules.register(template); //register the module. 
