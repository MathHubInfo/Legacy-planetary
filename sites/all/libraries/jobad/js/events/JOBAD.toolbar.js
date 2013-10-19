/*
	JOBAD 3 Toolbar
	JOBAD.toolbar.js
		
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


JOBAD.events.Toolbar = 
{
	'default': function(JobadInstance, Toolbar){
		return false; 
	},
	'Setup': {
		'enable': function(){
			this.modules.iterateAnd(function(module){
				module.Toolbar.enable(); 
				return true;
			});
		},
		'disable': function(){
			//Remove all toolbars
			this.modules.iterateAnd(function(module){
				module.Toolbar.disable(); 
				return true;
			});
		}
	},
	'namespace': {
		
		'getResult': function(){
			var me = this; 
			this.modules.iterateAnd(function(module){
				module.Toolbar.show(); 
				return true;
			});
		},
		'trigger': function(){
			preEvent(this, "Toolbar", []);
			this.Event.Toolbar.getResult();
			postEvent(this, "Toolbar", []);
		}
	}
};

JOBAD.modules.ifaces.push([
	function(properObject, ModuleObject){
		return properObject; 
	}, function(){
		var me = this; 
		var id = me.info().identifier; 

		var TBElement = undefined; 
		var JOBADInstance = me.getJOBAD(); 

		var enabled = false; 


		this.Toolbar.get = function(){
			//gets the toolbar if available, otherwise undefined
			return TBElement;
		};

		this.Toolbar.isEnabled = function(){
			return enabled; 
		}

		this.Toolbar.enable = function(){
			//enable the toolbar

			if(me.Toolbar.isEnabled()){
				//Remove any old toolbars
				me.Toolbar.disable();
			}

			//create a new Toolbar
			var TB = JOBAD.UI.Toolbar.add(); 


			//check if we need it
			var res = me.Toolbar.call(me, me.getJOBAD(), TB);

			if(res !== true){
				//we do not want it => remove it. 
				TB.remove(); 
				JOBAD.UI.Toolbar.update(); 

				return false;  
			} else {
				//we need it. 
				TBElement = TB; 
				JOBADInstance.Event.trigger("Toolbar.add", id);

				enabled = true; //it is now enabled

				return true; 
			}

			
		}

		this.Toolbar.disable = function(){
			//disable the toolbar

			if(!me.Toolbar.isEnabled()){
				//we are already disabled
				return false; 
			}

			//remove the toolbar element

			TBElement.remove(); 
			JOBAD.UI.Toolbar.update();
			TBElement = undefined;  

			JOBADInstance.Event.trigger("Toolbar.remove", id);

			enabled = false; //it is now disabled
			return true; 
		}

		//Hide / Show the Toolbar

		var visible = JOBADInstance.Config.get("auto_show_toolbar"); //get the default

		this.Toolbar.setVisible = function(){
			visible = true; 
			me.Toolbar.show(); 
		}

		this.Toolbar.setHidden = function(){
			visible = false; 
			me.Toolbar.show(); 
		}

		this.Toolbar.isVisible = function(){
			return visible; 
		}

		this.Toolbar.show = function(){
			if(me.Toolbar.isVisible() && me.isActive() && JOBADInstance.Instance.isFocused()){
				me.Toolbar.enable(); 
				return true; 
			} else {
				me.Toolbar.disable(); 
				return false; 
			}
		}

		this.Toolbar.moveUp = function(){
			return JOBAD.UI.Toolbar.moveUp(TBElement); 
		}

		this.Toolbar.moveDown = function(){
			return JOBAD.UI.Toolbar.moveDown(TBElement); 
		}


		//Register Event Handlers for activation + focus

		JOBADInstance.Event.on("module.activate", function(m){
			if(m.info().identifier == id){
				me.Toolbar.show(); 
			}
		});

		JOBADInstance.Event.on("instance.focus", function(m){
			me.Toolbar.show(); 
		});

		JOBADInstance.Event.on("instance.unfocus", function(m){
			me.Toolbar.disable(); 
		});
	}]); 