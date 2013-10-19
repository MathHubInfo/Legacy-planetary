/*
	config.js - An example module for JOBAD. 
	Shows a configure item. 	
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
			'identifier':	'jobad.showfocus',
			'title':	'JOBAD Show Focus',
			'author':	'Tom Wiesing',
			'description':	'Highlights focused JOBADInstances',
			'version': '3.1.9'
		},
		init: function(JOBADInstance){
			if(JOBADInstance.Instance.isFocused()){
				this.focus(JOBADInstance); 
			} else {
				this.unfocus(JOBADInstance);
			}
		},
		focus: function(JOBADInstance){
			JOBADInstance.element.css("background-color", "yellow"); 
		},
		unfocus: function(JOBADInstance){
			JOBADInstance.element.css("background-color", ""); 
		}
	});
})(JOBAD.refs.$);
