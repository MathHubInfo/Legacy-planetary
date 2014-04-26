/*
	test.menu3.js - An example module for JOBAD. 
	Test the menu and adds several items. 
	
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
(function($){
	JOBAD.modules.register({
		info:{
			'identifier':	'test.menu3',
			'title':	'Menu Testing module: Dynamic callbacks',
			'author':	'Tom Wiesing',
			'description':	'Tests dynamic menu callbacks. '
		},
		contextMenuEntries: function(target, JOBADInstance){

			var message = "Ooops, something didn't work according to plan. "; 

			JOBADInstance.Event.once("contextmenu.open", function(){
				//called once the contextmenu is opened
				message = "this message has been generated in another function. "; 
			});

			return {
				"Dynamic Menu Test": [
					function(){
						alert(message); 
					}, {
						"id": "dynamic_menu_test", //This is the id
						"icon": "none" //set an icon if desired
					}
				]
			}
		},
		onEvent: function(evt){
			if(evt == "contextMenuOpen"){
				//Context Menu is opened

				//Hack the item to be yellow
				$("#dynamic_menu_test").find("a").css("color", "yellow")
			}
			if(evt == "contextMenuClose"){
				//Context Menu was closed
			}
		}
	});
})(JOBAD.refs.$);
