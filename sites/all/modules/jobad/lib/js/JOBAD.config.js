/*
	JOBAD Configuration
	
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

JOBAD.storageBackend = {
	"getKey": function(key, def){
		var res = JOBAD.storageBackend.engines[JOBAD.config.storageBackend][0](key);
		if(typeof res == "string"){
			return JSON.parse(res);
		} else {
			return def;
		}
	}, 
	"setKey": function(key, value){return JOBAD.storageBackend.engines[JOBAD.config.storageBackend][1](key, JSON.stringify(value));}
}

JOBAD.storageBackend.engines = {
	"none": [function(key){}, function(key, value){}]
}

JOBAD.config.storageBackend = "none";

/*
	Validates if specefied object of a configuration object can be set. 
	@param	obj Configuration Object
	@param	key	Key to validate. 
	@param	val	Value to vaildate. 
	@returns boolean
*/
JOBAD.util.validateConfigSetting = function(obj, key, val){
	if(!obj.hasOwnProperty(key)){
		JOBAD.console.warn("Undefined user setting: "+key);
		return false;
	}
	var type = obj[key][0];
	var validator = obj[key][1];
	switch(type){
		case "string":
			if(typeof val != "string"){
				return false;
			}
			if(JOBAD.refs._.isRegExp(validator)){
				return validator.test(val);
			} else if(typeof validator == 'function') {
				return validator(val);
			} else {
				return true;
			}
			break;
		case "bool":
			return (typeof val == "boolean");
			break;
		case "integer":
			if(typeof val != "number" || val % 1 != 0){
				return false;
			}
			if (typeof validator == "function"){
				return validator(val);
			} else if(JOBAD.refs._.isArray(validator)){
				return (val >= validator[0] && val <= validator[1]);
			} else {
				return true;
			}
			break;
		case "number":
			if(typeof val != "number"){
				return false;
			}
			if (typeof validator == "function"){
				return validator(val);
			} else if(JOBAD.refs._.isArray(validator)){
				return (val >= validator[0] && val <= validator[1]);
			} else {
				return true;
			}
			break;
		case "list":
			return validator.indexOf(val) != -1;
			break;
		default:
			JOBAD.console.warn("Unknown configuration type '"+type+"' for user setting '"+key+"'");
			break;
	}
};

/*
	Gets the default of a configuration object
	@param	obj Configuration Object
	@param	key	Key to get. 
	@returns object
*/
JOBAD.util.getDefaultConfigSetting = function(obj, key){
	if(!obj.hasOwnProperty(key)){
		JOBAD.console.warn("Undefined user setting: "+key);
		return;
	}
	var val = obj[key][2];
	if(JOBAD.util.validateConfigSetting(obj, key, val)){
		return val;
	} else {
		JOBAD.console.warn("Undefined user setting: "+obj);
	}
};

var configCache = {};

JOBAD.modules.extensions.config = {
	"required": false, //not required
	
	"validate": function(prop){return true; }, //anything is ok
	
	"init": function(available, value, originalObject, properObject){
		return available ? value : {};
	},
	
	"onLoad": function(value, properObject, loadedModule){
		var id = properObject.info.identifier;
		
		this.UserConfig = {};
		
		this.UserConfig.set = function(prop, val){
			if(this.UserConfig.canSet(prop, val)){
				configCache[id][prop] = val;
			} else {
				JOBAD.console.warn("Can not set user config '"+prop+"': Validation failure. ");
			}
			JOBAD.storageBackend.setKey(id, configCache[id]);
		};
		
		this.UserConfig.canSet = function(prop, val){
			return JOBAD.util.validateConfigSetting(value, prop, val);
		};
		
		this.UserConfig.get = function(prop){
			var res = configCache[id][prop];
			if(JOBAD.util.validateConfigSetting(value, prop, res)){
				return res;
			} else{
				JOBAD.console.log("Failed to access user setting '"+prop+"'");
			}
		};
		
		this.UserConfig.getTypes = function(){
			return JOBAD.refs._.clone(value);
		}
		
		this.UserConfig.reset = function(prop){
			configCache[id] = JOBAD.storageBackend.getKey(id);
			if(typeof configCache[id] == "undefined"){
				configCache[id] = {};
				for(var key in value){
					configCache[id][key] = JOBAD.util.getDefaultConfigSetting(value, key);
				}
			}
		};
		
		if(!configCache.hasOwnProperty(id)){//not yet loaded by some other JOBAD
			this.UserConfig.reset();
		}
	}
}

/*
	Config Manager UI
*/

JOBAD.ifaces.push(function(){
	this.showConfigUI = function(){
	
		var $Div = JOBAD.refs.$("<div>");
		
		$Div.attr("title", "JOBAD Configuration Utility");

		var mods = this.modules.getIdentifiers();

		//create the table
		
		var $table = JOBAD.refs.$("<table>")
		.addClass("JOBAD JOBAD_ConfigUI JOBAD_ConfigUI_tablemain")
		.append(
			JOBAD.refs.$("<colgroup>").append(
				JOBAD.refs.$("<col>").css("width", "10%"), 
				JOBAD.refs.$("<col>").css("width", "90%")
			)
		);
		
		var len = mods.length;		

		var $displayer = JOBAD.refs.$("<td>").addClass("JOBAD JOBAD_ConfigUI JOBAD_ConfigUI_infobox").attr("rowspan", len+1);

		var showMain = function(){
			$displayer
			.trigger("JOBAD.modInfoClose")	
			.html("")	
			.append(
				$("<span>").text("JOBAD Core Version "+JOBAD.version),
				"<br />",
				$("<pre>").text("Copyright (C) 2013 KWARC Group <kwarc.info>")
			)
			.one('JOBAD.modInfoClose', function(){
				//Closing Main
				//in the future we might save stuff here
			});
			return;
		};

		var showInfoAbout = function(mod){
		
			var info = mod.info();
			
			var div = JOBAD.refs.$("<div class='JOBAD JOBAD_ConfigUI JOBAD_ConfigUI_subtabs'>")
			
			var ul = JOBAD.refs.$("<ul>").appendTo(div);
			
			var info_id = JOBAD.util.UID();
			var $info = JOBAD.refs.$("<div>").attr("id", info_id).appendTo(div);
			
			
			var config_id = JOBAD.util.UID();
			var $config = JOBAD.refs.$("<div>").attr("id", config_id).appendTo(div);
			
			$info.append(
				JOBAD.refs.$("<span>").text(info.title).css("font-weight", "bold"),
				" [",
				JOBAD.refs.$("<span>").text(info.identifier),
				"] <br />"
			);
			if(typeof info.version == 'string' && info.version != ""){
				$info.append(
					"Version ",
					JOBAD.refs.$("<span>").css("text-decoration", "italic").text(info.version)
				);
			}
			
			var id1 = JOBAD.util.UID();
			var id2 = JOBAD.util.UID();
			var id3 = JOBAD.util.UID();
			
			var r_on = JOBAD.refs.$("<input type='radio' name='"+id1+"' id='"+id2+"'>");
			var r_off = JOBAD.refs.$("<input type='radio' name='"+id1+"' id='"+id3+"'>");
			
			var OnOff = JOBAD.refs.$('<span>')
			.append(
				r_on, "<label for='"+id2+"'>On</label>",
				r_off, "<label for='"+id3+"'>Off</label>"
			);
			
			if(mod.isActive()){
				r_on[0].checked = true;
			} else {
				r_off[0].checked = true;
			}
			OnOff.buttonset();
			
			var onChange = function(){
				if(r_on.is(":checked")){
					if(!mod.isActive()){
						mod.activate();
					}
				} else {
					if(mod.isActive()){
						mod.deactivate();
					}
				}
			};
			
			r_on.change(onChange);
			
			r_off.change(onChange);
			
			
			$info.append(
				"by ",
				JOBAD.refs.$("<span>").css("text-decoration", "italic").text(info.author),
				"<br />",
				OnOff,
				"<br />",
				JOBAD.refs.$("<span>").text(info.description)
			);
			
			
			ul.append(
				"<li><a href='#"+info_id+"'>About</li>",
				"<li><a href='#"+config_id+"'>Config</li>"
			)
			
			$displayer
			.trigger("JOBAD.modInfoClose")
			.html("")		
			.append(div)
			.one('JOBAD.modInfoClose', function(){
				//Closing mod
				//in the future we will save settings here
			});
			
			div.tabs();
			
			return;
		};


		$("<tr>").append(
			$("<td>").text("JOBAD Core").click(showMain),
			$displayer
		).appendTo($table);

		for(var i=0;i<len;i++){
			var mod = this.modules.getLoadedModule(mods[i]);
			JOBAD.refs.$("<tr>").append(
				$("<td>").text(mod.info().title)
				.data("JOBAD.module", mod)
				.click(function(){
					showInfoAbout(JOBAD.refs.$(this).data("JOBAD.module"));
				})
			).appendTo($table);					
		}
		
		$Div.append($table);
		
		$Div.dialog({
			modal: true,
			width: 600,
			height: 450,
			open: showMain,
			close: function(){
				$displayer
				.trigger("JOBAD.modInfoClose")
			}
		});	
	}
});

