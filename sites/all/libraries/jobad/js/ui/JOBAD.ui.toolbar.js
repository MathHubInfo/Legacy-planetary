/*
	JOBAD 3 UI Functions - Toolbar
	JOBAD.ui.toolbar.js
		
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

JOBAD.UI.Toolbar = {};

var Toolbars = JOBAD.refs.$(); 

JOBAD.UI.Toolbar.config = {
	"height": 20 //The default toolbar height
};

/*
	Adds a toolbar to the page and returns a reference to it. 
*/
JOBAD.UI.Toolbar.add = function(){
	var TB = JOBAD.refs.$("<div>").css({
		"width": "100%",
		"height": JOBAD.UI.Toolbar.config.height,
	}).appendTo("body");

	Toolbars = Toolbars.add(TB); 
	JOBAD.UI.Toolbar.update(); 
	JOBAD.util.markHidden(TB); 
	TB.on("contextmenu", function(e){
		return e.ctrlKey; 
	}); 
	return TB; 
}

/*
	Updates all toolbars at the bottom of the page. 
*/
JOBAD.UI.Toolbar.update = JOBAD.util.throttle(function(){
	var pos = 0; 
	Toolbars = Toolbars.filter(function(){
		var me = JOBAD.refs.$(this); 

		if(me.parent().length != 0){

			me.css({
				"position": "fixed",
				"right": 0, 
				"bottom": pos
			})

			pos += me.height(); 
			return true; 
		} else {
			return false; 
		}
	})
}, 300); 

JOBAD.UI.Toolbar.moveUp = function(TB){
	var x = Toolbars.index(TB); 
	if(x >= 0){
		Toolbars = JOBAD.refs.$(JOBAD.util.permuteArray(Toolbars, x, x+1));
	}
	JOBAD.UI.Toolbar.update(); 
}

JOBAD.UI.Toolbar.moveDown = function(TB){
	var x = Toolbars.index(TB); 
	if(x >= 0){
		Toolbars = JOBAD.refs.$(JOBAD.util.permuteArray(Toolbars, x, x-1));
	}
	JOBAD.UI.Toolbar.update(); 
}