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
	@param	val	Value to validate. 
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
			return (validator(val) && typeof val == "string");
			break;
		case "bool":
			return (typeof val == "boolean");
			break;
		case "integer":
			return (typeof val == "number" && val % 1 == 0 && validator(val));
			break;
		case "number":
			return (typeof val == "number" && validator(val));
			break;
		case "list":
			return validator(val);
			break;
	}
};

/*
	Creates a proper User Settings Object
	@param	obj Configuration Object
	@param modName	Name of the module
	@returns object
*/
JOBAD.util.createProperUserSettingsObject = function(obj, modName){

	var newObj = {};
	for(var key in obj){
		
		var WRONG_FORMAT_MSG = "Ignoring UserConfig '"+key+"' in module '"+modName+"': Wrong description format";
		
		if(obj.hasOwnProperty(key)){
			(function(){
			var spec = obj[key];
			var newSpec = [];
			
			if(!JOBAD.refs._.isArray(spec)){
				JOBAD.console.warn(WRONG_FORMAT_MSG+" (Array required). ");
				return;
			}
			
			if(spec.length == 0){
				JOBAD.console.warn(WRONG_FORMAT_MSG+" (Array may not have length zero). ");
				return;
			}
			
			if(typeof spec[0] == 'string'){
				var type = spec[0];
			} else {
				JOBAD.console.warn(WRONG_FORMAT_MSG+" (type must be a string). ");
				return; 
			}
			
			if(spec.length == 4){
				var validator = spec[1];
				var def = spec[2];
				var meta = spec[3];
			} else if(spec.length == 3) {
				var validator = function(){return true;};
				var def = spec[1];
				var meta = spec[2];
			} else {
				JOBAD.console.warn(WRONG_FORMAT_MSG+" (Array length 3 or 4 required). ");
				return; 
			}
			
			switch(type){
				case "string":
					newSpec.push("string");
					
					//validator
					if(JOBAD.refs._.isRegExp(validator)){
						newSpec.push(function(val){return validator.test(val)});
					} else if(typeof validator == 'function') {
						newSpec.push(validator);
					} else {
						JOBAD.console.warn(WRONG_FORMAT_MSG+" (Unknown restriction type for 'string'. ). ");
						return;
					}
					
					//default
					try{
						if(newSpec[newSpec.length-1](def) && typeof def == 'string'){
							newSpec.push(def);
						} else {
							JOBAD.console.warn(WRONG_FORMAT_MSG+" (Validation function failed for default value. ). ");
							return;
						}
					} catch(e){
						JOBAD.console.warn(WRONG_FORMAT_MSG+" (Validation function caused exception for default value. ). ");
						return;
					}
					
					//meta
					if(typeof meta == 'string'){
						newSpec.push([meta, ""]);
					} else if(JOBAD.refs._.isArray(meta)) {
						if(meta.length == 1){
							meta.push("");
						}
						if(meta.length == 2){
							newSpec.push(meta);
						} else {
							JOBAD.console.warn(WRONG_FORMAT_MSG+" (Meta data not allowed for length > 2). ");
							return;
						}
					} else {
						JOBAD.console.warn(WRONG_FORMAT_MSG+" (Meta data needs to be a string or an array). ");
						return;
					}
					
					break;
				case "bool":
					newSpec.push("bool");
					
					//Validator
					if(spec.length == 4){
						JOBAD.console.warn(WRONG_FORMAT_MSG+" (Type 'boolean' may not have restrictions. )");
						return;
					}					
					newSpec.push(validator);
					
					//default
					try{
						if(newSpec[newSpec.length-1](def) && typeof def == 'boolean'){
							newSpec.push(def);
						} else {
							JOBAD.console.warn(WRONG_FORMAT_MSG+" (Validation function failed for default value. ). ");
							return;
						}
					} catch(e){
						JOBAD.console.warn(WRONG_FORMAT_MSG+" (Validation function caused exception for default value. ). ");
						return;
					}
					
					//meta
					if(typeof meta == 'string'){
						newSpec.push([meta, ""]);
					} else if(JOBAD.refs._.isArray(meta)) {
						if(meta.length == 1){
							meta.push("");
						}
						if(meta.length == 2){
							newSpec.push(meta);
						} else {
							JOBAD.console.warn(WRONG_FORMAT_MSG+" (Meta data not allowed for length > 2). ");
							return;
						}
					} else {
						JOBAD.console.warn(WRONG_FORMAT_MSG+" (Meta data needs to be a string or an array). ");
						return;
					}
					
					break;
				case "integer":
					newSpec.push("integer");
					
					//validator
					if(JOBAD.refs._.isArray(validator)){
						if(validator.length == 2){
							newSpec.push(function(val){return (val >= validator[0])&&(val <= validator[1]);});
						} else {
							JOBAD.console.warn(WRONG_FORMAT_MSG+" (Restriction Array must be of length 2). ");
						}
					} else if(typeof validator == 'function') {
						newSpec.push(validator);
					} else {
						JOBAD.console.warn(WRONG_FORMAT_MSG+" (Unknown restriction type for 'integer'. ). ");
						return;
					}
					
					//default
					try{
						if(newSpec[newSpec.length-1](def) && (def % 1 == 0)){
							newSpec.push(def);
						} else {
							JOBAD.console.warn(WRONG_FORMAT_MSG+" (Validation function failed for default value. ). ");
							return;
						}
					} catch(e){
						JOBAD.console.warn(WRONG_FORMAT_MSG+" (Validation function caused exception for default value. ). ");
						return;
					}
					
					//meta
					if(typeof meta == 'string'){
						newSpec.push([meta, ""]);
					} else if(JOBAD.refs._.isArray(meta)) {
						if(meta.length == 1){
							meta.push("");
						}
						if(meta.length == 2){
							newSpec.push(meta);
						} else {
							JOBAD.console.warn(WRONG_FORMAT_MSG+" (Meta data not allowed for length > 2). ");
							return;
						}
					} else {
						JOBAD.console.warn(WRONG_FORMAT_MSG+" (Meta data needs to be a string or an array). ");
						return;
					}
					
					break;
				case "number":
					newSpec.push("number");
					
					//validator
					if(JOBAD.refs._.isArray(validator)){
						if(validator.length == 2){
							newSpec.push(function(val){return (val >= validator[0])&&(val <= validator[1]);});
						} else {
							JOBAD.console.warn(WRONG_FORMAT_MSG+" (Restriction Array must be of length 2). ");
						}
					} else if(typeof validator == 'function') {
						newSpec.push(validator);
					} else {
						JOBAD.console.warn(WRONG_FORMAT_MSG+" (Unknown restriction type for 'number'. ). ");
						return; 
					}
					
					//default
					try{
						if(newSpec[newSpec.length-1](def) && typeof def == 'number'){
							newSpec.push(def);
						} else {
							JOBAD.console.warn(WRONG_FORMAT_MSG+" (Validation function failed for default value. ). ");
							return;
						}
					} catch(e){
						JOBAD.console.warn(WRONG_FORMAT_MSG+" (Validation function caused exception for default value. ). ");
						return;
					}
					
					//meta
					if(typeof meta == 'string'){
						newSpec.push([meta, ""]);
					} else if(JOBAD.refs._.isArray(meta)) {
						if(meta.length == 1){
							meta.push("");
						}
						if(meta.length == 2){
							newSpec.push(meta);
						} else {
							JOBAD.console.warn(WRONG_FORMAT_MSG+" (Meta data not allowed for length > 2). ");
							return;
						}
					} else {
						JOBAD.console.warn(WRONG_FORMAT_MSG+" (Meta data needs to be a string or an array). ");
						return;
					}
					
					break;
				case "list":
					newSpec.push("list");
					
					
					//validator
					if(JOBAD.refs._.isArray(validator) && spec.length == 4){
							if(validator.length == 0){
								JOBAD.console.warn(WRONG_FORMAT_MSG+" (Array restriction must be non-empty). ");
								return;
							}
							newSpec.push(function(val){return (JOBAD.refs._.indexOf(validator, val) != -1);});
					} else {
						JOBAD.console.warn(WRONG_FORMAT_MSG+" (Type 'list' needs array restriction. ). ");
						return;
					}
					
					//default
					try{
						if(newSpec[newSpec.length-1](def)){
							newSpec.push(def);
						} else {
							JOBAD.console.warn(WRONG_FORMAT_MSG+" (Validation function failed for default value. ). ");
							return;
						}
					} catch(e){
						JOBAD.console.warn(WRONG_FORMAT_MSG+" (Validation function caused exception for default value. ). ");
						return;
					}
					
					//meta
					if(JOBAD.refs._.isArray(meta)) {
						if(meta.length == validator.length+1){
							newSpec.push(meta);
						} else {
							JOBAD.console.warn(WRONG_FORMAT_MSG+" (Meta data has wrong length). ");
							return;
						}
					} else {
						JOBAD.console.warn(WRONG_FORMAT_MSG+" (Meta data for type 'list' an array). ");
						return;
					}
					
					//construction-data
					newSpec.push(validator); 
					
					break;
				default:
					JOBAD.console.warn(WRONG_FORMAT_MSG+" (Unknown type '"+type+"'. ). ");
					return;
					break;
			}
			newObj[key] = newSpec;
			})();
		}
	}
	return newObj;
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
	return obj[key][2];
};

var configCache = {};

JOBAD.modules.extensions.config = {
	"required": false, //not required
	
	"validate": function(prop){return true; }, 
	
	"init": function(available, value, originalObject, properObject){
		return JOBAD.util.createProperUserSettingsObject(available ? value : {}, properObject.info.identifier);
	},
	
	"onLoad": function(value, properObject, loadedModule){
		var id = properObject.info.identifier;
		
		//User Configuration Namespace
		this.UserConfig = {};
		
		
		/*
			Sets a user configuration. 
			@param prop	Property to set
			@param val	Value to set. 
		*/
		this.UserConfig.set = function(prop, val){
			if(this.UserConfig.canSet(prop, val)){
				if(JOBAD.util.objectEquals(val, this.UserConfig.get(prop))){
					return; //we have it already; no change neccessary. 
				}
				configCache[id][prop] = val;
				
			} else {
				JOBAD.console.warn("Can not set user config '"+prop+"': Validation failure. ");
				return; 
			}
			JOBAD.storageBackend.setKey(id, configCache[id]);
			JOBAD.refs.$("body").trigger("JOBAD.ConfigUpdateEvent", [prop, this.info().identifier]);
		};
		
		/*
			Checks if a user configuration can be set. 
			@param prop	Property to set
			@param val	Value to set. 
		*/
		this.UserConfig.canSet = function(prop, val){
			return JOBAD.util.validateConfigSetting(value, prop, val);
		};
		
		/*
			Retrieves a user configuration setting. 
			@param prop	Property to get
			@param val	Value to get. 
		*/
		this.UserConfig.get = function(prop){
			var res = configCache[id][prop];
			if(JOBAD.util.validateConfigSetting(value, prop, res)){
				return res;
			} else {
				JOBAD.console.log("Failed to access user setting '"+prop+"'");
			}
		};
		
		/*
			Gets the user configuration types. 
		*/
		this.UserConfig.getTypes = function(){
			return JOBAD.refs._.clone(value); 
		}
		
		/*
			Resets the user configuration. 
		*/
		this.UserConfig.reset = function(prop){
			configCache[id] = JOBAD.storageBackend.getKey(id);
			if(typeof configCache[id] == "undefined"){
				configCache[id] = {};
				for(var key in value){
					configCache[id][key] = JOBAD.util.getDefaultConfigSetting(value, key);
					JOBAD.refs.$("body").trigger("JOBAD.ConfigUpdateEvent", [key, this.info().identifier]);
				}
			}
		};
		
		this.UserConfig = JOBAD.util.bindEverything(this.UserConfig, this);
		
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
				JOBAD.util.createTabs(
					["About JOBAD", "GPL License", "jQuery", "jQuery UI", "Underscore"], 
					[
						JOBAD.refs.$("<div>").append(
							JOBAD.refs.$("<span>").text("JOBAD Core Version "+JOBAD.version),
							JOBAD.refs.$("<pre>").text(JOBAD.resources.jobad_license)
						),
						JOBAD.refs.$("<pre>").text(JOBAD.resources.gpl_v3_text),
						JOBAD.refs.$("<div>").append(
							JOBAD.refs.$("<span>").text("jQuery Version "+JOBAD.refs.$.fn.jquery),
							JOBAD.refs.$("<pre>").text(JOBAD.resources.jquery_license)
						),
						JOBAD.refs.$("<div>").append(
							JOBAD.refs.$("<span>").text("jQuery UI Version "+JOBAD.refs.$.ui.version),
							JOBAD.refs.$("<pre>").text(JOBAD.resources.jqueryui_license)
						),
						JOBAD.refs.$("<div>").append(
							JOBAD.refs.$("<span>").text("Underscore Version "+JOBAD.refs._.VERSION),
							JOBAD.refs.$("<pre>").text(JOBAD.resources.underscore_license)
						)
					], {}, 400
				).addClass("JOBAD JOBAD_ConfigUI JOBAD_ConfigUI_subtabs")
			)
			.one('JOBAD.modInfoClose', function(){
				//We are closing the main mod info. 
				//We may want to save things
			});
			return;
		};

		var showInfoAbout = function(mod){
			//grab mod info
			var info = mod.info();
		
			//Generate Info Tab
			var $info = JOBAD.refs.$("<div>");
			
			//Title and Identifier
			$info.append(
				JOBAD.refs.$("<span>").text(info.title).css("font-weight", "bold"),
				" [",
				JOBAD.refs.$("<span>").text(info.identifier),
				"] <br />"
			);
			
			//Version
			if(typeof info.version == 'string' && info.version != ""){
				$info.append(
					"Version ",
					JOBAD.refs.$("<span>").css("text-decoration", "italic").text(info.version)
				);
			}
			
			//On / Off Switch			
			var OnOff = JOBAD.util.createRadio(["Off", "On"], mod.isActive()?1:0);
			
			OnOff.find("input").change(function(){
				if(OnOff.find("input").eq(1).is(":checked")){
					if(!mod.isActive()){
						mod.activate();
					}
				} else {
					if(mod.isActive()){
						mod.deactivate();
					}
				}
			});
			
			$info.append(
				"by ",
				JOBAD.refs.$("<span>").css("text-decoration", "italic").text(info.author),
				"<br />",
				OnOff,
				"<br />",
				JOBAD.refs.$("<span>").text(info.description)
			);
			
			//Config
			var $config = JOBAD.refs.$("<div>");
			
			//Build Config Stuff	
			var UserConfig = mod.UserConfig.getTypes();
			
			for(var key in UserConfig){
				(function(){
				var setting = UserConfig[key];
				var val = mod.UserConfig.get(key); // Get current value
				
				var item = JOBAD.refs.$("<div class='JOBAD_CONFIG_SETTTING'>")
				.data({
						"JOBAD.config.setting.key": key,
						"JOBAD.config.setting.val": val
				}).appendTo($config);
				
				var type = setting[0];
				var validator = setting[1];
				var meta = setting[3];
				switch(type){
					case "string":
							item.append(
								JOBAD.refs.$("<span>").text(meta[0]+": ").addClass("JOBAD JOBAD_ConfigUI JOBAD_ConfigUI_MetaConfigTitle"),
								JOBAD.refs.$("<input type='text'>").addClass("JOBAD JOBAD_ConfigUI JOBAD_ConfigUI_validateOK").val(val).keyup(function(){
									var val = JOBAD.refs.$(this).val();
									if(validator(val)){
										item.data("JOBAD.config.setting.val", val);
										JOBAD.refs.$(this).removeClass("JOBAD_ConfigUI_validateFail").addClass("JOBAD_ConfigUI_validateOK");
									} else {
										JOBAD.refs.$(this).addClass("JOBAD_ConfigUI_validateFail").removeClass("JOBAD_ConfigUI_validateOK");
									}
									
								}),
								"<br>", 
								JOBAD.refs.$("<span>").text(meta[1]).addClass("JOBAD JOBAD_ConfigUI JOBAD_ConfigUI_MetaConfigDesc")
							);
						break;
					case "bool":
		
						var radio = JOBAD.util.createRadio(["True", "False"], val?0:1);	
		
						item.append(
							JOBAD.refs.$("<span>").text(meta[0]+": ").addClass("JOBAD JOBAD_ConfigUI JOBAD_ConfigUI_MetaConfigTitle"),
							radio,
							"<br>", 
							JOBAD.refs.$("<span>").text(meta[1]).addClass("JOBAD JOBAD_ConfigUI JOBAD_ConfigUI_MetaConfigDesc")
						);
						
						radio.find("input").change(function(){
							item.data("JOBAD.config.setting.val", radio.find("input").eq(0).is(":checked"));
						});
						
						break;
					case "integer":
					
						var update = function(val){
							if(validator(val) && val % 1 == 0){
								item.data("JOBAD.config.setting.val", val);
								spinner.removeClass("JOBAD_ConfigUI_validateFail").addClass("JOBAD_ConfigUI_validateOK");
								return true;
							} else {
								spinner.addClass("JOBAD_ConfigUI_validateFail").removeClass("JOBAD_ConfigUI_validateOK");
								return false;
							}
						}
					
						var id = JOBAD.util.UID();
						
						var spinner = JOBAD.refs.$("<input>")
						.attr("id", id)
						.val(val)
						.addClass("JOBAD JOBAD_ConfigUI JOBAD_ConfigUI_validateOK")
						.keyup(function(){
							var val = JOBAD.refs.$(this).val();
							if(val != ""){
								update(parseFloat(val));
							}
							
						})
						.spinner({
							spin: function(ev, ui){
								update(ui.value);
							}
						});
						
						item.append(
							JOBAD.refs.$("<label for='"+id+"'>").text(meta[0]+": ").addClass("JOBAD JOBAD_ConfigUI JOBAD_ConfigUI_MetaConfigTitle"),
							spinner,
							"<br>", 
							JOBAD.refs.$("<span>").text(meta[1]).addClass("JOBAD JOBAD_ConfigUI JOBAD_ConfigUI_MetaConfigDesc")				
						);

						break;
					case "number":
						var update = function(val){
							if(validator(val)){
								item.data("JOBAD.config.setting.val", val);
								spinner.removeClass("JOBAD_ConfigUI_validateFail").addClass("JOBAD_ConfigUI_validateOK");
								return true;
							} else {
								spinner.addClass("JOBAD_ConfigUI_validateFail").removeClass("JOBAD_ConfigUI_validateOK");
								return false;
							}
						}
					
						var id = JOBAD.util.UID();
						
						var spinner = JOBAD.refs.$("<input>")
						.attr("id", id)
						.val(val)
						.addClass("JOBAD JOBAD_ConfigUI JOBAD_ConfigUI_validateOK")
						.keyup(function(){
							var val = JOBAD.refs.$(this).val();
							if(val != ""){
								update(parseFloat(val));
							}
						});
						
						item.append(
							JOBAD.refs.$("<label for='"+id+"'>").text(meta[0]+": ").addClass("JOBAD JOBAD_ConfigUI JOBAD_ConfigUI_MetaConfigTitle"),
							spinner,
							"<br>", 
							JOBAD.refs.$("<span>").text(meta[1]).addClass("JOBAD JOBAD_ConfigUI JOBAD_ConfigUI_MetaConfigDesc")				
						);

						break;
					case "list":
						var values = setting[4]; 
						var meta_data = meta.slice(1)
						
						var $select = JOBAD.refs.$("<select>");
						
						for(var i=0;i<values.length;i++){
							$select.append(
								JOBAD.refs.$("<option>").attr("value", JSON.stringify(values[i])).text(meta_data[i])
							)
						}
						
						$select
						.val(JSON.stringify(val))
						.change(function(){
							item.data("JOBAD.config.setting.val", JSON.parse(JOBAD.refs.$(this).val()));
						});
						
						item.append(
							JOBAD.refs.$("<span>").text(meta[0]+": ").addClass("JOBAD JOBAD_ConfigUI JOBAD_ConfigUI_MetaConfigTitle"),
							$select,
							"<br>"
						);
						
						break;
					default:
						JOBAD.console.warn("Unable to create config dialog: Unknown configuration type '"+type+"' for user setting '"+key+"'");
						item.remove();
						break;
				}
				
				})();
				
			}
			
			$displayer
			.trigger("JOBAD.modInfoClose")
			.html("")		
			
			
			.append(
				($config.children().length > 0)?
					JOBAD.util.createTabs(["About", "Config"], [$info, $config], {}, 400).addClass("JOBAD JOBAD_ConfigUI JOBAD_ConfigUI_subtabs")
				:
					JOBAD.util.createTabs(["About"], [$info], {}, 400).addClass("JOBAD JOBAD_ConfigUI JOBAD_ConfigUI_subtabs")
			)
			.one('JOBAD.modInfoClose', function(){
				//Store all the settings
				$config.find("div.JOBAD_CONFIG_SETTTING").each(function(i, e){
					var e = JOBAD.refs.$(e);
					mod.UserConfig.set(e.data("JOBAD.config.setting.key"), e.data("JOBAD.config.setting.val"));
				});
			});
			
			return;
		};


		JOBAD.refs.$("<tr>").append(
			JOBAD.refs.$("<td>").text("JOBAD Core").click(showMain),
			$displayer
		).appendTo($table);

		for(var i=0;i<len;i++){
			var mod = this.modules.getLoadedModule(mods[i]);
			JOBAD.refs.$("<tr>").append(
				JOBAD.refs.$("<td>").text(mod.info().title)
				.data("JOBAD.module", mod)
				.click(function(){
					showInfoAbout(JOBAD.refs.$(this).data("JOBAD.module"));
				})
			)
			.addClass("JOBAD JOBAD_ConfigUI JOBAD_ConfigUI_ModEntry")
			.appendTo($table);					
		}
		
		$Div.append($table);
		
		$Div.dialog({
			modal: true,
			width: 700,
			height: 600,
			open: showMain,
			close: function(){
				$displayer
				.trigger("JOBAD.modInfoClose")
			}
		});	
	}
});

