/*
	TB1.js - An example module for JOBAD. 
	A Testing module, colors <p>s in the color given as first parameter. 
	
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
			'identifier':	'test.tb1',
			'title':	'Test Toolbar 1',
			'author':	'Tom Wiesing',
			'description':	' '
		},
		"Toolbar": function(JI, TB){
			var me = this; 

			TB.css("background-color", "green"); 
			TB.text("I'm the first Toolbar!"); 

			$("<a>").text("up").click(function(){
				me.Toolbar.moveUp(); 
				return false; 
			}).appendTo(TB); 

			$("<a>").text("down").click(function(){
				me.Toolbar.moveDown(); 
				return false; 
			}).appendTo(TB); 

			return true; 
		}
	});
})(JOBAD.refs.$);
