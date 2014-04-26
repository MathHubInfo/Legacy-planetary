/*
	example3.js - An example module for JOBAD. 
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
			'identifier':	'test.color.menu',
			'title':	'Test Module: Menu',
			'author':	'Tom Wiesing',
			'description':	'Test the menu and adds several items. '
		},
		contextMenuEntries: function(target, JOBADInstance){
			if(target.is('#nomenu,#nomenu *')){
				return false;
			}
			return {
				"Colors": 
					{
						"Make me orange": function(element){element.css("color", "orange");}, 
						"Highlight my background": function(element){
							element
							.stop().css("background-color", "#FFFF9C")
							.animate({ backgroundColor: "#FFFFFF"}, 1500);
						},
						"Revert": function(element){element.stop().css('color', '');}
					},
				"Show Config Menu": function(){
					JOBADInstance.showConfigUI();
				}
				};
		}
	});
})(JOBAD.refs.$);
