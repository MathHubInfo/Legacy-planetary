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
			'identifier':	'jobad.config',
			'title':	'JOBAD Config Dialog',
			'author':	'Tom Wiesing',
			'description':	'This module provides a simple configuration dialog. For backwards compatibility, this module adds the .showConfigUI() function to modules. ',
			'hasCleanNamespace': false,
			'version': '3.2.0'
		},
		globalinit: function(){
			//icon source: http://openiconlibrary.sourceforge.net/gallery2/?./Icons/actions/configure-5.png, license: gplv2
			JOBAD.resources.provide("icon", "jobad.icons.config", "data:image/png;base64,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");
		},
		init: function(showMenuItem){
			var me = this; 
			me.localStore.set("showMenuItem", (typeof showMenuItem == "boolean")?showMenuItem:true); 
			me.getJOBAD().showConfigUI = function(){ //for backwards compatibilty; may be removed soon
				me.showConfigUI(); 
			}
		},
		contextMenuEntries: function(target, JOBADInstance){
			if(!this.localStore.get("showMenuItem")){
				return; 
			}
			var me = this; 
			return [
				["Show Config UI", function(element){
					me.showConfigUI();
				}, "jobad.icons.config", {"id": "awesome"}]
			];
		},
		/* builds a jQuery Config Item */
		buildjQueryConfig: function(UserConfig, $config, get_val){
			for(var key in UserConfig){
				(function(){
				
				var setting = UserConfig[key];
				var val = get_val(key); // Get current value
							
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
						var meta_data = meta.slice(1);

						var $select = JOBAD.util.createDropDown(values.map(JSON.stringify), meta_data);
						
						item.append(
							JOBAD.refs.$("<span>").text(meta[0]+": ").addClass("JOBAD JOBAD_ConfigUI JOBAD_ConfigUI_MetaConfigTitle"),
							$select,
							"<br>"
						);

						$select
						.val(JSON.stringify(val))
						.on("change", function(){
							item.data("JOBAD.config.setting.val", JSON.parse(JOBAD.refs.$(this).val()));
						});
						
						break;
					case "none":
						break;
					default:
						JOBAD.console.warn("Unable to create config dialog: Unknown configuration type '"+type+"' for user setting '"+key+"'");
						item.remove();
						break;
				}
				
				})();
				
			}
		},
		showConfigUI: function(){
				var $Div = JOBAD.refs.$("<div>")
				.on("mousemove", JOBAD.UI.hover.disable);

				var me = this.getJOBAD(); //Reference to JOBAD
				var myModule = this;  //reference to current Instance 
				


				var TabNames = []; //Tab Names
				var Tabs = []; //Tab Content

				TabNames.push("JOBAD Core"); 
				Tabs.push(JOBAD.refs.$("<div>").data("JOBAD.module.core", true));


				var mods = me.modules.getIdentifiers(); //get all the modules

				for(var i=0;i<mods.length;i++){
					var mod = me.modules.getLoadedModule(mods[i]);

					TabNames.push(mod.info().title); 
					Tabs.push(
						JOBAD.refs.$("<div>")
						.data("JOBAD.module", mod)
					); 

				}		

				var EventHandler = JOBAD.refs.$("<div>"); //Used as an event Handler
				
				var showMain = function(tab){
					var $config = JOBAD.refs.$("<div>");
					myModule.buildjQueryConfig(me.Config.getTypes(), $config, function(key){return me.Config.get(key);})
				
				
					//remove restricted items
					var restricted_items = me.Config.get("restricted_user_config");
					$config.find("div.JOBAD_CONFIG_SETTTING").each(function(i, e){
							var e = JOBAD.refs.$(e);
							if(JOBAD.util.indexOf(restricted_items, e.data("JOBAD.config.setting.key")) != -1){
								e.remove();
							}
					});

					var $focusButton = 
					JOBAD.refs.$('<button type="button" class="btn">')
					.text("Focus")
					.click(function(e){
						if(me.Instance.isFocused()){
							me.Instance.unfocus(); 
							$focusButton.removeClass("active"); 
						} else {
							me.Instance.focus(); 
							$focusButton.addClass("active"); 
						}
					});

					if(me.Instance.isFocused()){
						$focusButton.addClass("active"); 
					}

					var $autoButton = 
					JOBAD.refs.$('<button type="button" class="btn">')
					.text("Auto").click(function(e){
						if(me.Instance.isAutoFocusEnabled()){
							me.Instance.disableAutoFocus(); 
							$autoButton.removeClass("active"); 
						} else {
							me.Instance.enableAutoFocus(); 
							$autoButton.addClass("active"); 
						}
					});

					if(me.Instance.isAutoFocusEnabled()){
						$autoButton.addClass("active"); 
					}
				
					tab.empty()
					.append(
						JOBAD.util.createTabs(
							["Instance", "About JOBAD", "GPL License", "jQuery", "Bootstrap", "Underscore"], 
							[
								JOBAD.refs.$("<div>").append(
									JOBAD.refs.$("<span>").text("Instance ID: "+me.ID),
									"<br />",
									$focusButton,
									$autoButton, 
									"<h4>Configuration</h4>",
									$config
								), 
								JOBAD.refs.$("<div>").append(
									JOBAD.refs.$("<span>").text("JOBAD Core Version "+JOBAD.version),
									JOBAD.refs.$("<pre>").text(JOBAD.resources.getTextResource("jobad_license"))
								),
								JOBAD.refs.$("<pre>").text(JOBAD.resources.getTextResource("gpl_v3_text")),
								JOBAD.refs.$("<div>").append(
									JOBAD.refs.$("<span>").text("jQuery Version "+JOBAD.refs.$.fn.jquery),
									JOBAD.refs.$("<pre>").text(JOBAD.resources.getTextResource("jquery_license"))
								),
								JOBAD.refs.$("<div>").append(
									JOBAD.refs.$("<span>").text("Bootstrap Version 2.3.2"),
									JOBAD.refs.$("<pre>").text(JOBAD.resources.getTextResource("bootstrap_license"))
								),
								JOBAD.refs.$("<div>").append(
									JOBAD.refs.$("<span>").text("Underscore Version "+JOBAD.util.VERSION),
									JOBAD.refs.$("<pre>").text(JOBAD.resources.getTextResource("underscore_license"))
								)
							],
							{"scrollHack": true}
						)
					);

					EventHandler.one('JOBAD.modInfoClose', function(){
						$config.find("div.JOBAD_CONFIG_SETTTING").each(function(i, e){
							var e = JOBAD.refs.$(e);
							me.Config.set(e.data("JOBAD.config.setting.key"), e.data("JOBAD.config.setting.val"));
						});
						
						me.Sidebar.redraw(); //update the sidebar
					});

					return;
				};

				var showInfoAbout = function(mod, tab){

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

					//Sidebar onOff 

					var TBButton = JOBAD.util.createRadio(["Hide", "Show"], mod.Toolbar.isVisible()?1:0);

					var UpButton = JOBAD.refs.$('<button type="button" class="btn">').button().text("Up").click(function(){
						mod.Toolbar.moveUp(); 
					});

					var DownButton = JOBAD.refs.$('<button type="button" class="btn">').text("Down").click(function(){
						mod.Toolbar.moveDown(); 
					});

					TBButton.find("input").change(function(){
						if(TBButton.find("input").eq(1).is(":checked")){
							mod.Toolbar.setVisible(); 
							UpButton.show(); 
							DownButton.show(); 
						} else {
							mod.Toolbar.setHidden(); 
							UpButton.hide(); 
							DownButton.hide(); 
						}
					}).change();

					

					
					$info.append(
						"by ",
						JOBAD.refs.$("<span>").css("text-decoration", "italic").text(info.author),
						"<br />",
						OnOff,
						"<br />",
						"Toolbar: ",
						TBButton,
						JOBAD.refs.$("<div class='btn-group'>").append(
							DownButton, 
							UpButton
						),
						"<br />"
					);

					if(typeof info.url == "string"){
						$info.append(
							JOBAD.refs.$("<a>").text(info.url).attr("href", info.url).attr("target", "_blank").button(),
							"<br />"
						);
					}
					$info.append(
						JOBAD.refs.$("<span>").text(info.description),
						"<br />",
						JOBAD.refs.$("<span>").text(JOBAD.UserConfig.getMessage(info.identifier))
					);
					
					//Config
					var $config = JOBAD.refs.$("<div>");
					
					//Build Config Stuff	
					var UserConfig = mod.UserConfig.getTypes();
					
					myModule.buildjQueryConfig(UserConfig, $config, function(key){
						return mod.UserConfig.get(key);
					});
					
					tab.empty()
					.append(
						($config.children().length > 0)?
							JOBAD.util.createTabs(["About", "Config"], [$info, $config])
						:
							JOBAD.util.createTabs(["About"], [$info])
					)

					EventHandler
					.one('JOBAD.modInfoClose', function(){
						//Store all the settings
						$config.find("div.JOBAD_CONFIG_SETTTING").each(function(i, e){
							var e = JOBAD.refs.$(e);
							mod.UserConfig.set(e.data("JOBAD.config.setting.key"), e.data("JOBAD.config.setting.val"));
						});
					});
					
					return;
				};

				var displayDiv = JOBAD.refs.$("<div>").addClass("modal hide large"); 
				var header = JOBAD.refs.$("<div>").addClass("modal-header")
				.append(
					'<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>',
					'<h3>JOBAD Configuration</h3>'
				); 

				var footer = JOBAD.refs.$("<div>").addClass("modal-footer").append('<a href="#" class="btn btn-primary" data-dismiss="modal">Save &amp; Close</a>'); 

				displayDiv.append(
					header,
					JOBAD.util.createTabs(TabNames, Tabs, {
						"type": "tabs-left", 
						"select": function(tabName, tab){
							if(tab.data("JOBAD.module.core")){
								showMain(tab); 
							} else {
								showInfoAbout(tab.data("JOBAD.module"), tab); 
							}
						},
						"unselect": function(){
							EventHandler.trigger("JOBAD.modInfoClose"); 
						}
					}).addClass("modal-body"), 
					footer
				).appendTo($("<div>").BS().appendTo("body"))
				.modal()
				.on("hidden", function(){
					EventHandler.trigger("JOBAD.modInfoClose"); 

					displayDiv.parent().remove(); //We don't need it anymore
					JOBAD.UI.BSStyle(); //Call the Bootstrap Cleanup function
				});

				JOBAD.UI.BSStyle(); 
			}
	});
})(JOBAD.refs.$);
