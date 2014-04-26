var child_process = require('child_process');
var modules = ["gear", "gear-lib"]; //Modules to install

process.stdout.write("Checking for NPM dependencies ... ");

var child = child_process.exec('npm --parseable true ls --json true',
	function(error, stdout, stderr){
		if(error !== null){
			fail(); 
		} else {
			try{
				var res = JSON.parse(stdout);
				if(NPMObjectHas(res, modules)){
					process.stdout.write("OK\n"); 
					process.exit(0); 
				} else {
					process.stdout.write("NOT FOUND\n"); 
					NPMInstallDeps();
				}
			} catch(e){
				fail(); 
			}
		}
	}
);

var fail = function(){
	process.stdout.write("FAIL\n"); 
	process.exit(1); 
}

var NPMObjectHas = function(obj, deps){
	for(var i=0;i<deps.length;i++){
		if(!NPMHasDep(obj, deps[i])){
			return false; 
		}
	}
	return true; 
}

var NPMHasDep = function(obj, dep){
	try{
		var obj = obj.dependencies; 
	} catch(e){
		return false; 
	}
	if(typeof obj == "undefined"){
		return false; 
	}
	if(obj.hasOwnProperty(dep)){
		return true; 
	} else {
		for(var key in obj){
			try{
				if(NPMHasDep(obj[key], dep)){
					return true; 
				}
			} catch(e){}
			
		}
		return false; 
	}
}

var NPMInstallDeps = function(){
	console.log("Installing NPM Dependencies ... ")
	var mods = modules.slice(0); 
	mods.unshift("install"); 
	var installer = child_process.spawn("npm", mods, { stdio: 'inherit' });
	installer.on("exit", function(code){
		if(code != 0){
			console.log("FAIL");
		} else {
			console.log("OK");
			process.exit(0); 
		}
		
	})
}