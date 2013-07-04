/*
	JOBAD 3 Folding
	JOBAD.folding.js
		
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

JOBAD.ifaces.push(function(){
	var me = this;

	//Folding namespace. 
	this.Folding = {};

	/*
		Enables Folding on an element. 
		@param element	Element to enable folding on.  
		@param config	Configuration for folding. See JOBAD.UI.Folding.enable. 
	*/
	this.Folding.enable = function(element, config){

		if(typeof element == "undefined"){
			var element = this.element; 
		}

		var element = JOBAD.refs.$(element); //TODO: Add support for folding the entire thing. 

		if(!this.contains(element)){
			JOABD.console.warn("Can't enable folding on element: Not a member of this JOBADInstance")
			return;
		}

		if(element.is(this.element)){
			if(element.data("JOBAD.UI.Folding.virtualFolding")){
				element = element.data("JOBAD.UI.Folding.virtualFolding");
			} else {
				this.element.wrapInner(JOBAD.refs.$("<div></div>"));
				element = this.element.children().get(0);
				this.element.data("JOBAD.UI.Folding.virtualFolding", JOBAD.refs.$(element));
			}
			
		}

		return JOBAD.UI.Folding.enable(
			element, 
			JOBAD.util.extend(JOBAD.util.defined(config), 
				{
					"update": 
						function(){
							if(!me.Sidebar.redrawing){
								me.Sidebar.redraw(); //redraw the sidebar. 
							}
						}
				}
			)
		);
	};

	/*
		Disables folding on an element. 
		@param	element	Element to disable folding on. 
	*/
	this.Folding.disable = function(element){
		if(typeof element == "undefined"){
			var element = this.element; 
		}
		var element = JOBAD.refs.$(element);

		if(element.data("JOBAD.UI.Folding.virtualFolding")){
			var vElement = element.data("JOBAD.UI.Folding.virtualFolding");
			JOBAD.UI.Folding.disable(vElement);
			vElement.replaceWith(vElement.children()); //replace the element completely with the children
			return element.removeData("JOBAD.UI.Folding.virtualFolding"); 
		} else {
			return JOBAD.UI.Folding.disable(element);
		}
	};

	/*
		Checks if folding is enabled on an element. 
	*/
	this.Folding.isEnabled = function(element){
		if(typeof element == "undefined"){
			var element = this.element; 
		}
		var element = JOBAD.refs.$(element);

		if(element.data("JOBAD.UI.Folding.virtualFolding")){
			return element.data("JOBAD.UI.Folding.virtualFolding").data("JOBAD.UI.Folding.enabled")?true:false;
		} else {
			return element.data("JOBAD.UI.Folding.enabled")?true:false;
		}
	};

	this.Folding = JOBAD.util.bindEverything(this.Folding, this);
});