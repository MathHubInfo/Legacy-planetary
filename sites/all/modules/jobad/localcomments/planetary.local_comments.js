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
		'identifier':	'planetary.local_comments',  //(Unique) identifier for this module, preferably human readable. 
		'title':	'Localised Comments for Planetary', //Human Readable title of the module. 
		'author':	'Tom Wiesing', //Author
		'description':	'Localised comments module', //A human readable description of the module. 
	},
	contextMenuEntries: function(target, JOBADInstance){
		return {
			"Id": function(){
				var id = JOBAD.util.closest(target, function(e){
					return (typeof e.attr("id") != "undefined");
				}).attr("id");

				var $dialog = jQuery("<div>");
				$dialog
				.attr("title", "New comment for '"+id+"'")
				.append(
					jQuery("<iframe />")
					.attr("src", "http://localhost/node/add/forum/1")
					.width("95%")
					.height("95%")
				).dialog({modal: true});
			} 
		}; 
	}
};

JOBAD.modules.register(template); //register the module. 