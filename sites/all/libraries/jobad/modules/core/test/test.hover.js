/*
	example4.js - An example module for JOBAD. 
	Counts the words in a paragraph and shows a tooltip. 
	
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
			'identifier':	'test.hover',
			'title':	'Hover Test menu',
			'author':	'Tom Wiesing',
			'description':	'Counts the words in a p element. ',
		},
		hoverText: function(target){
			if(target.is("p")){
				var wordCount = (target.text().split(" ").length+1).toString()
				return "I am a p element which contains "+wordCount+" words. ";
			}
		}
	});
})(JOBAD.refs.$);
