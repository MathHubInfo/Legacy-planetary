/*
	example5.js - An example module for JOBAD. 
	
	Counts the words in a paragraph and shows a tooltip in the sidebar. 
	Currently also serves as an example for UserConfig. 
	
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
			'identifier':	'test.sidebar',
			'title':	'Sidebar Test',
			'author':	'Tom Wiesing',
			'description':	'Displays the number of characters next to every p and clicking it trigger the original p. '
		},
		init: function(JOBADInstance){
			//add a bunch of notifications
			var classes = ["info", "warning", "error"];
			JOBADInstance.element.find("p")
			.each(function(i, target){
				var $target = $(target);
				JOBADInstance.Sidebar.registerNotification($target, {
					"text": $target.text().length.toString()+" Characters of text",
					"trace": true, 
					"class": classes[i % 3],
					"click": function(){
							JOBADInstance.Event.leftClick.trigger($target);
					},
					"menu": [["Remove this notification", function(element, JOBADInstance){
						JOBADInstance.Sidebar.removeNotification($(this));
					}]]
				});
				JOBADInstance.Sidebar.registerNotification($target, {
					"text": "A second something. ",
					"trace": true,
					"class": classes[(i+1) % 3],
					"click": function(){
							JOBADInstance.Event.leftClick.trigger($target);
					},
					"menu": [["Remove this notification", function(element, JOBADInstance){
						JOBADInstance.Sidebar.removeNotification($(this));
					}]]
				});
			})
		}
	});
})(JOBAD.refs.$);
