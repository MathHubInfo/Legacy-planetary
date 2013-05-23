/*
	example2.js - An example module for JOBAD. 
	Provides a context menu entry which checks if the clicked element is a <p>. 
	
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
			'identifier':	'test.p',
			'title':	'Test Module: Paragraphs',
			'author':	'Tom Wiesing',
			'description':	'Provides a context menu entry which checks if the clicked element is a <p>. '
		},
		contextMenuEntries: function(target){
		
			if(target.is('#nomenu,#nomenu *')){ //no menu for these elements
				return false;
			}
			return [
				["Am I a <p> ?", function(element){
					if(element.is("p")){
						alert("I am a <p> element. ");
					} else {
						alert("No I'm not. ");
					}
				
				}]
			];
		}
	});
})(JOBAD.refs.$);
