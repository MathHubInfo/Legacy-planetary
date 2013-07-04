/*
	folding.js - An example module for JOBAD. 
	Allows to trigger folding via the context menu. 
	
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
			'identifier':	'jobad.folding',
			'title':	'Folding module',
			'author':	'Tom Wiesing',
			'description':	'This module shows a context menu item for folding. '
		},
		globalinit: function(){
			//icon source: http://openiconlibrary.sourceforge.net/gallery2/?./Icons/actions/view-sort-descending-2.png, license: lgpl
			JOBAD.resources.provide("icon", "jobad.folding.icon", "data:image/png;base64,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");
		},
		contextMenuEntries: function(target, JOBADInstance){
			var entries = [
				["Folding",  {
					"Trigger on this JOBAD Instance": function(){
						if(JOBADInstance.Folding.isEnabled(JOBADInstance.element)){ //check if folding is enabled on the overall element
							JOBADInstance.Folding.disable(); 
						} else {
							JOBADInstance.Folding.enable(); 
						}
					},
					"Trigger on this element": function(element){
						if(JOBADInstance.Folding.isEnabled(element)){ //check if folding is enabled on the overall element
							JOBADInstance.Folding.disable(element); 
						} else {
							JOBADInstance.Folding.enable(element); 
						}
					}
				}, "jobad.folding.icon"]
			];
			return entries; 
		}
	});
})(JOBAD.refs.$);
