/*
	JOBAD 3 Core
*/

/* 
	JOBAD 3 Main Function
	Creates a new JOBAD instance on a specefied DOM element.  
	@param element Element to link this element to. May be a DOM Element or a jQuery Object. 
	@param config Configuration for this JOBAD Instance. 

*/
var JOBAD = function(element){

	if(!(this instanceof JOBAD)){
		return new JOBAD(element);	
	}

	var me = this; //Kept in functions
	
	//Add init arguments
	me.arguments = [];
	for(var i=0;i<arguments.length;i++){
		me.arguments.push(arguments[i]);
	}

	//The element the current JOBAD instance works on. 
	this.element = element;
	if(JOBAD.refs._.isElement(this.element)){
		this.element = JOBAD.refs.$(this.element);
	}
	if(!(this.element instanceof JOBAD.refs.$)){
		JOBAD.error("Can't create JOBADInstance: Not a DOM Element. ");
	}
	
	//IFace extensions
	for(var i=0; i < JOBAD.ifaces.length; i++){
		var mod = JOBAD.ifaces[i];
		if(typeof mod == 'function'){
			mod.call(this, this, this.arguments); 
		}
	}
};

JOBAD.ifaces = []; //JOBAD interfaces

/* JOBAD Version */
JOBAD.version = "3.0.0"; 

/*
	JOBAD.toString
*/
JOBAD.toString = function(){
	return "function(/* JOBAD "+JOBAD.version+" */){ [non-native non-trivial code] }";
};

JOBAD.toString.toString = JOBAD.toString; //self-reference!

/* JOBAD Global config */
JOBAD.config = 
{
	    'debug': true //Debugging enabled? (Logs etc)
};

/*
	JOBAD.console: Mimics  or wraps the native console object if available and debugging is enabled. 
*/
if(!_.isUndefined(console)){//Console available
	
	JOBAD.console = 
	{
		"log": function(msg){
			if(JOBAD.config.debug){
				console.log(msg);
			}
		},
		"warn": function(msg){
			if(JOBAD.config.debug){
				console.warn(msg);
			}		
		},
		"error": function(msg){
			if(JOBAD.config.debug){
				console.error(msg);
			}		
		}
	}
} else {
	JOBAD.console = 
	{
		"log": function(){},
		"warn": function(){},
		"error": function(){}	
	}
}


/*
	JOBAD.error: Produces an error message
*/
JOBAD.error = function(msg){
	JOBAD.console.error(msg);
	throw new Error(msg);
}

/*
	JOBAD Dependencies namespace. 
*/
JOBAD.refs = {};
JOBAD.refs.$ = jQuery;
JOBAD.refs._ = _; 

JOBAD.noConflict = function(){
	return {
		"_": JOBAD.noConflict._(),
		"$": JOBAD.noConflict.$()	
	}
}; //No conflict mode

/*
	sets jQuery in noConflict mode. 
	@returns jQuery.noConflict()
*/
JOBAD.noConflict.$ = function(){
	
	JOBAD.refs.$ = JOBAD.refs.$.noConflict();
	return JOBAD.refs.$;
};

/*
	sets Underscore in noConflict mode. 
	@returns _.noConflict()
*/
JOBAD.noConflict._ = function(){
	JOBAD.refs._ = JOBAD.refs._.noConflict();
	return JOBAD.refs._;
};