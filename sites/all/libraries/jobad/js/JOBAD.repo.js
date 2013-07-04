/*
	JOBAD.repo.js - Contains the JOBAD repo implementation
	
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

var JOBAD_Repo_Urls = {}; //urls per repo
var JOBAD_Repo_Mods = {}; //primary modules

/*
	Marks the current page as a repository page and generates a repository about page. 
*/
JOBAD.repo = function(){
	JOBAD.repo.buildPage("body", "./");
}

/*
	Builds an information page about a repository. 
	@param	element	Element to generate page info in. 
	@param	repo	Repository to build page about. 
	@param	callback	A Callback; 
	
*/
JOBAD.repo.buildPage = function(element, repo, callback){

	var callback = JOBAD.util.forceFunction(callback, function(){}); 

	var body = JOBAD.refs.$("<div class='JOBAD JOBAD_Repo JOBAD_Repo_Body'>").appendTo(JOBAD.refs.$(element).empty());

	var msgBox = JOBAD.refs.$("<div>");

	msgBox.wrap("<div class='JOBAD JOBAD_Repo JOBAD_Repo_MsgBox'>").parent().appendTo(body); 

	var label = JOBAD.refs.$("<div class='progress-label'>").text("Loading Repository, please wait ...").appendTo(msgBox);
	
	msgBox.progressbar({
		value: 0
	})

	var baseUrl = JOBAD.util.resolve(repo);
	baseUrl = baseUrl.substring(0, baseUrl.length - 1); // no slash at the end

	JOBAD.repo.init(baseUrl, function(suc, cache){
		msgBox.progressbar("option", "value", 25); 
		if(!suc){
			label.text("Repository loading failed: "+cache);
			return; 
		}

		var title = cache.name; 
		var desc = cache.description; 

		body.append(
			JOBAD.refs.$("<h1 class='JOBAD JOBAD_Repo JOBAD_Repo_Title'>").text(title),
			JOBAD.refs.$("<div class='JOBAD JOBAD_Repo JOBAD_Repo_Desc'>").text(desc)
		)


		var table = JOBAD.refs.$("<table class='JOBAD JOBAD_Repo JOBAD_Repo_Table'>").appendTo(body);

		table.append(
			JOBAD.refs.$("<thead>").append(
				JOBAD.refs.$("<tr>")
				.append(
					JOBAD.refs.$("<th>").text("Identifier"),
					JOBAD.refs.$("<th>").text("Name"),
					JOBAD.refs.$("<th>").text("Author"),
					JOBAD.refs.$("<th>").text("Version"),
					JOBAD.refs.$("<th>").text("Homepage"),
					JOBAD.refs.$("<th>").text("Description"),
					JOBAD.refs.$("<th>").text("Module Dependencies"),
					JOBAD.refs.$("<th>").text("External Dependencies")
				).children("th").click(function(){
					JOBAD.UI.sortTableBy(this, "rotate", function(i){
						this.parent().find("span").remove(); 
						if(i==1){
							this.append("<span class='JOBAD JOBAD_Repo JOBAD_Sort_Ascend'>");
						} else if(i==2){
							this.append("<span class='JOBAD JOBAD_Repo JOBAD_Sort_Descend'>");
						}
					}); 
					return false; 
				}).end() 
			)
		);

		//Init everything

		label.text("Loading module information ...")

		var modules = JOBAD.util.keys(JOBAD_Repo_Urls[baseUrl]);
		var count = modules.length; 

		var i=0;


		var next = function(){

			msgBox.progressbar("option", "value", 25+75*((i+1)/(modules.length))); 

			var name = modules[i]; 

			if(i >= modules.length){
				label.text("Finished. ");
				msgBox.fadeOut(1000);
				callback(body); 
				return;
			}

			label.text("Loading module information ["+(i+1)+"/"+count+"]: \""+name+"\"");

			JOBAD.repo.loadFrom(baseUrl, modules[i], function(suc){

				if(!suc){
					table.append(
						JOBAD.refs.$("<tr>")
						.append(
							JOBAD.refs.$("<td></td>").text(name),
							"<td colspan='7'>Loading failed: Timeout</td>"
						).css("color", "red")
					);
				} else if(typeof moduleList[name] == "undefined"){
					table.append(
						JOBAD.refs.$("<tr>")
						.append(
							JOBAD.refs.$("<td></td>").text(name),
							"<td colspan='7'>Loading failed: Module specification incorrect. </td>"
						).css("color", "red")
					);
				} else {
					var info = moduleList[name].info;

					var row = JOBAD.refs.$("<tr>").appendTo(table); 
					
					//id
					JOBAD.refs.$("<td></td>").text(info.identifier).appendTo(row);
					
					//name
					JOBAD.refs.$("<td></td>").text(info.title).appendTo(row);
					
					//author
					JOBAD.refs.$("<td></td>").text(info.author).appendTo(row);
					
					//version
					if(info.version !== ""){
						JOBAD.refs.$("<td></td>").text(info.version).appendTo(row);
					} else {
						JOBAD.refs.$("<td><span class='JOBAD JOBAD_Repo JOBAD_Repo_NA'></span></td>").appendTo(row); 
					}

					//homepage
					if(typeof info.url == "string"){
						JOBAD.refs.$("<td></td>").append(
							JOBAD.refs.$("<a>").text(info.url).attr("href", info.url).attr("target", "_blank").button()
						).appendTo(row); 
					} else {
						JOBAD.refs.$("<td><span class='JOBAD JOBAD_Repo JOBAD_Repo_NA'></span></td>").appendTo(row); 
					}

					//description
					JOBAD.refs.$("<td></td>").text(info.description).appendTo(row);


					//dependencies (internal)
					var deps = info.dependencies;

					if(deps.length == 0){
						JOBAD.refs.$("<td></td>").text("(None)").appendTo(row);
					} else {
						var cell = JOBAD.refs.$("<td></td>").appendTo(row); 
						for(var j=0;j<deps.length;j++){
							cell.append("\"");
							if(JOBAD.util.indexOf(modules, deps[j]) == -1){
								cell.append(
									JOBAD.refs.$("<span>").addClass("JOBAD JOBAD_Repo JOBAD_Repo_Dependency JOBAD_Repo_Dependency_NotFound")
									.text("\""+deps[j]+"\"")
								)
							} else {
								cell.append(
									JOBAD.refs.$("<span>").addClass("JOBAD JOBAD_Repo JOBAD_Repo_Dependency JOBAD_Repo_Dependency_Found")
									.text(deps[j])
								)
							}
							cell.append("\"");
							if(j != deps.length - 1 ){
								cell.append(" , "); 
							}
						}
					}

					var edeps = info.externals;

					if(edeps.length == 0){
						JOBAD.refs.$("<td></td>").text("(None)").appendTo(row);
					} else {
						var cell = JOBAD.refs.$("<td></td>").appendTo(row); 
						for(var j=0;j<edps.length;j++){
							cell.append(
								"\"", 
								JOBAD.refs.$("<span>")
									.addClass("JOBAD JOBAD_Repo JOBAD_Repo_External_Dependency")
									.text(edeps[j]),
								"\""
							);

							if(j != edeps.length - 1 ){
								cell.append(" , "); 
							}
						}
					}

				}

				delete moduleList[name];
				i++;
				next(); 
			})
		};
		
		next(); 
	})
}

var repo_is_initing = false; 

/*
	Register a given set of repositories
	@param baseUrl	Base urls of the repositories
	@param callback	Callback on success / failure
*/
JOBAD.repo.init = function(baseUrl, callback){

	var callback = JOBAD.util.forceFunction(callback, function(){}); 

	if(JOBAD.util.isArray(baseUrl)){
		if(baseUrl.length == 0){
			return callback(true); 
		} else {
			var now = baseUrl[0];
			var next = baseUrl.slice(1);

			return JOBAD.repo.init(now, function(){
				JOBAD.repo.init(next, callback)
			})
		}
	}

	if(JOBAD.repo.hasInit(baseUrl)){
		return callback(true);  //we already have init
	}

	//we have a single item
	if(repo_is_initing){
		return false; 
	}
	repo_is_initing = true; 

	var baseUrl = JOBAD.util.resolve(baseUrl); 

	var repo_cache; 

	JOBAD.repo.config = function(obj){
		repo_cache = obj; //cache it
	}

	JOBAD.util.loadExternalJS(JOBAD.util.resolve("jobad_repo.js", baseUrl), function(s){

		delete JOBAD.repo.config; //delete the function again

		if(!s){
			callback(false, "Repository Main File Timeout"); 
			repo_is_initing = false; 
			return; 
		}

		//parse it

		if(!JOBAD.util.isObject(repo_cache)){
			callback(false, "Repository in wrong Format: Not an object"); 
			repo_is_initing = false; 
			return; 
		}

		if(!JOBAD.util.isArray(repo_cache.versions)){
			callback(false, "Repository Spec in wrong Format: Versions missing or not an array. "); 
			repo_is_initing = false; 
			return; 
		}


		if(JOBAD.util.indexOf(repo_cache.versions, JOBAD.version) == -1){
			callback(false, "Repository incompatible with this version of JOBAD. "); 
			repo_is_initing = false; 
			return; 
		}

		if(!JOBAD.util.isArray(repo_cache.provides)){
			callback(false, "Repository Spec in wrong Format: Modules missing or not an array. "); 
			repo_is_initing = false; 
			return; 
		}


		var overrides = {};

		if(JOBAD.util.isObject(repo_cache.at)){
			overrides = repo_cache.at; 
		}

		var modules = repo_cache.provides.slice(0); //available modules
		
		JOBAD_Repo_Urls[baseUrl] = {}; //Create a new cache object

		for(var i=0;i<modules.length;i++){
			var key = modules[i]; 
			//is the url set manually
			if(overrides.hasOwnProperty(key)){
				JOBAD_Repo_Urls[baseUrl][key] = JOBAD.util.resolve(overrides[key], baseUrl); 
			} else {
				JOBAD_Repo_Urls[baseUrl][key] = JOBAD.util.resolve(key+".js", baseUrl);
			}


			//register the repo with the modules stuff
			if(JOBAD_Repo_Mods.hasOwnProperty(key)){
				JOBAD_Repo_Mods[key].push(baseUrl);
			} else {
				JOBAD_Repo_Mods[key] = [baseUrl]; 
			}
		}

		repo_is_initing = false;  //we are done
		callback(true, repo_cache); 
	});

}

/*
	Checks if a repository has been initialised
	@param	baseUrl	Repository to check. 
*/
JOBAD.repo.hasInit = function(baseUrl){
	return JOBAD_Repo_Urls.hasOwnProperty(baseUrl); 
}

/*
	Loads modules from a repository. 
	@param	repo	Repository to load module from. 
	@param	modules	Module to load
	@param	callback	Callback once finished. 
*/
JOBAD.repo.loadFrom = function(repo, modules, callback){

	var callback = JOBAD.util.forceFunction(callback, function(){}); 
	var modules = JOBAD.util.forceArray(modules); 
	var repo = JOBAD.util.resolve(repo);

	JOBAD.repo.init(repo, function(res, msg){

		//we failed to initialise it
		if(!res){
			return callback(false, "Repo init failed: "+msg);
		}

		if(!JOBAD.repo.provides(repo, modules)){
			return callback(false, "Modules are not provided by repo. ");
		}

		//only load thigns that we don't already have
		modules = JOBAD.util.filter(modules, function(mod){
			return !JOBAD.modules.available(mod, false);
		});

		var m2 = JOBAD.util.map(modules, function(mod){
			return JOBAD_Repo_Urls[repo][mod]; 
		});


		JOBAD.util.loadExternalJS(m2, function(suc){
			if(suc){
				callback(true)
			} else {
				callback(false, "Failed to load one or more Modules: Timeout")
			}
		});
	});
}

JOBAD.repo.loadAllFrom = function(repo, callback){

	var callback = JOBAD.util.forceFunction(callback, function(){}); 
	var repo = JOBAD.util.resolve(repo);

	JOBAD.repo.init(repo, function(res, msg){

		//we failed to initialise it
		if(!res){
			return callback(false, "Repo init failed: "+msg);
		}

		JOBAD.repo.loadFrom(repo, JOBAD.util.keys(JOBAD_Repo_Urls[repo]), callback); 
	});
}

/*
	Check if repo provides module
	@param	repo	Repositorie(s) to look in. Optional. 
	@param	module	Module(s) to look for. 
*/
JOBAD.repo.provides = function(repo, module){

	var Repos = JOBAD.util.forceArray(repo); 
	var Modules = JOBAD.util.forceArray(module); 
	
	if(typeof module == "undefined"){
		Modules = Repos; 
		Repos = JOBAD.util.keys(JOBAD_Repo_Urls); 
	}

	return JOBAD.util.lAnd(JOBAD.util.map(Modules, function(mod){
		return JOBAD.util.lOr(JOBAD.util.map(Repos, function(rep){
			//check repo for module safely
			var rep = JOBAD.util.resolve(rep);

			return JOBAD.util.indexOf(JOBAD_Repo_Mods[mod], rep) != -1; 
		}));
	}));

}

/*
	Provide a module
	@param	modules	Modules to provide. 
	@param	repos	Additionally to repos already available, check these. Optional. 
	@param	callback	Callback to use. 
	@param	provideDependencies	Should we provide depndencies?
*/
JOBAD.repo.provide = function(modules, repos, callback, provideDependencies){
	if(typeof repos == "function"){
		provideDependencies = callback;
		callback = repos; 
		repos = []; 
	}

	var callback = JOBAD.util.forceFunction(callback, function(){}); 

	var modules = JOBAD.util.forceArray(modules);
	var i = 0;
	var repos = JOBAD.util.forceArray(repos);
	var provideDependencies = JOBAD.util.forceBool(provideDependencies, true);

	var load_next = function(){
		if(i >= modules.length){
			return callback(true); 
		}

		var mod = modules[i]; 

		var repo = JOBAD_Repo_Mods[mod][0]; //take the first provider
		JOBAD.repo.loadFrom(repo, mod, function(suc, msg){
			if(!suc){
				callback(false, msg); 
			} else {
				if(provideDependencies){
					var deps = moduleList[mod].info.dependencies;

					if(!JOBAD.repo.provides(deps)){
						return callback(false, "Dependencies for module '"+mod+"' are not provided by any repo. ")
					}

					modules = JOBAD.util.union(modules, deps); //add dependencies in the end
				}
				
				i++; 
				load_next(); 
			}
		})
	}

	JOBAD.repo.init(repos, function(suc, msg){
		if(!JOBAD.repo.provides(modules)){
			return callback(false, "Modules are not provided by any repo. ");
		}
		if(suc){
			load_next();
		} else {
			callback(false, msg); 
		}
	})
}