/*
	JOBAD.wrap.js
	
	Included at the end of the build to register all ifaces..
*/
for(var key in JOBAD.modules.extensions){
	JOBAD.modules.cleanProperties.push(key);
}