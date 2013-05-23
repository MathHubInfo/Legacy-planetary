/*
	example1.js - An example module for JOBAD. 
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
			'identifier':	'test.color.click',
			'title':	'Test Module: Colors Click',
			'author':	'Tom Wiesing',
			'description':	'A Testing module, colors <p>s in the color given as first parameter. ',
			'hasCleanNamespace': false
		},
		init: function(JOBADInstance, color){
			this.localStore.set("color", color); //Store the color setting
		},
		leftClick: function(target, JOBADInstance){
			if(target.is("p")){
				this.colorize(target); //Color the target
			}
		},
		colorize: function(target){
			target.css("color", this.localStore.get("color")); //get the color setting and apply it. 
		}
	});
})(JOBAD.refs.$);
