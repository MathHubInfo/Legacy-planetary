/*
	example2.js - An example module for JOBAD. 
	Provides a context menu entry which checks if the clicked element is a <p>. 
*/
(function($){
	JOBAD.modules.register({
		info:{
			'identifier':	'test.p',
			'title':	'Test Module: Paragraphs',
			'author':	'Tom Wiesing',
			'description':	'Provides a context menu entry which checks if the clicked element is a <p>. '
		},
		contextMenuEntries: function(target){
		
			if(target.is('#nomenu,#nomenu *')){ //no menu for these elements
				return false;
			}
			return [
				["Am I a <p> ?", function(element){
					if(element.is("p")){
						alert("I am a <p> element. ");
					} else {
						alert("No I'm not. ");
					}
				
				}]
			];
		}
	});
})(JOBAD.refs.$);
