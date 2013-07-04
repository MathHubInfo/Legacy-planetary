/*
	JOBAD 3 UI Functions
	JOBAD.ui.js
		
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

// This file contains general JOBAD.UI functions

//Mouse coordinates
var mouseCoords = [0, 0];


JOBAD.refs.$(document).on("mousemove.JOBADListener", function(e){
	mouseCoords = [e.pageX-JOBAD.refs.$(window).scrollLeft(), e.pageY-JOBAD.refs.$(window).scrollTop()];
});

//UI Namespace. 
JOBAD.UI = {}


/*
	highlights an element
*/
JOBAD.UI.highlight = function(element, color){
	var element = JOBAD.refs.$(element);
	var col;
	if(typeof element.data("JOBAD.UI.highlight.orgColor") == 'string'){
		col = element.data("JOBAD.UI.highlight.orgColor");
	} else {
		col = element.css("backgroundColor");
	}
	
	element
	.stop().data("JOBAD.UI.highlight.orgColor", col)
	.animate({ backgroundColor: (typeof color == 'string')?color:"#FFFF9C"}, 1000);	
};
/*
	unhighlights an element.	
*/		
JOBAD.UI.unhighlight = function(element){
	var element = JOBAD.refs.$(element);
	element
	.stop()
	.animate({
		backgroundColor: element.data("JOBAD.UI.highlight.orgColor"),
		finish: function(){
			element.removeData("JOBAD.UI.highlight.orgColor");
		}
	}, 1000);		
};

/*
	Sorts a table. 
	@param	el	Table Row Head to sort. 
	@param sortFunction	A function, `ascending`, `descending`, `reset` or `rotate`
	@param callback(state) Callback only for rotate state. 0 = originial, 1=ascend, 2=descend
*/
JOBAD.UI.sortTableBy = function(el, sortFunction, callback){
	//get the table
	var el = JOBAD.refs.$(el); 
	var table = el.closest("table"); //the table
	var rows = JOBAD.refs.$("tbody > tr", table); //find the rows
	var colIndex = el.parents().children().index(el); //colIndex

	if(!table.data("JOBAD.UI.TableSort.OrgOrder")){
		table.data("JOBAD.UI.TableSort.OrgOrder", rows); 
	}

	if(typeof sortFunction == "undefined"){
		sortFunction = "rotate"; 
	}
	if(typeof sortFunction == "string"){
		if(sortFunction == "rotate"){
			var now = el.data("JOBAD.UI.TableSort.rotationIndex");
			if(typeof now != "number"){
				now = 0;
			}
			
			now = (now+1) % 3; 

			sortFunction = ["reset", "ascending", "descending"][now]; 

			el.data("JOBAD.UI.TableSort.rotationIndex", now); 

			callback.call(el, now); 
		}

		if(sortFunction == "ascending"){
			var sortFunction = function(a, b){return (a>b)?1:0; };
		} else if(sortFunction == "descending"){
			var sortFunction = function(a, b){return (a<b)?1:0; };
		} else if(sortFunction == "reset"){
			table.data("JOBAD.UI.TableSort.OrgOrder").each(function(){
				var row = JOBAD.refs.$(this); 
				row.detach().appendTo(table); 
			});
			return el;  
		}
	}

	rows.sort(function(a, b){
		var textA = JOBAD.refs.$("td", a).eq(colIndex).text();
		var textB = JOBAD.refs.$("td", b).eq(colIndex).text();
		return sortFunction(textA, textB); 
	}).each(function(i){
		var row = JOBAD.refs.$(this); 
		row.detach().appendTo(table); 
	})

	return el; 
}