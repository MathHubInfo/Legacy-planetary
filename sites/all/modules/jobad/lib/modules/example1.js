/*
	example1.js - An example module for JOBAD. 
	A Testing module, colors <p>s in the color given as first parameter. 
*/
(function($){
	JOBAD.modules.register({
		info:{
			'identifier':	'test.color.click',
			'title':	'Test Module: Colors Click',
			'author':	'Tom Wiesing',
			'description':	'A Testing module, colors <p>s in the color given as first parameter. ',
			'hasCleanNamespace': false
		},
		init: function(JOBADInstance, color){
			this.localStore.set("color", color); //Store the color setting
		},
		leftClick: function(target, JOBADInstance){
			if(target.is("p")){
				this.colorize(target); //Color the target
			}
		},
		colorize: function(target){
			target.css("color", this.localStore.get("color")); //get the color setting and apply it. 
		}
	});
})(JOBAD.refs.$);
