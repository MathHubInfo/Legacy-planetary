/*
	example5.js - An example module for JOBAD. 
	Counts the words in a paragraph and shows a tooltip in the sidebar. Also logs any other event. 
*/
(function($){
	JOBAD.modules.register({
		info:{
			'identifier':	'test.sidebar',
			'title':	'Test Module: Sidebar',
			'author':	'Tom Wiesing',
			'description':	'Displays the number of characters next to every p and clicking it trigger the original p. '
		},
		config: {
			"test": ["integer", [0, 10], 0, "Test"]
		},
		init: function(JOBADInstance){
			var classes = ["info", "warning", "error"];
			JOBADInstance.element.find("p")
			.each(function(i, target){
				var $target = $(target);
				JOBADInstance.Sidebar.registerNotification($target, {
					"text": $target.text().length.toString()+" Characters of text",
					"trace": true, 
					"class": classes[i % 3],
					"click": function(){
							JOBADInstance.Event.leftClick.trigger($target);
					},
					"menu": [["Remove this notification", function(element, JOBADInstance){
						JOBADInstance.Sidebar.removeNotification($(this));
					}]]
				});

				JOBADInstance.Sidebar.registerNotification($target, {
					"text": "A second something. ",
					"trace": true, 
					"class": classes[(i+1) % 3],
					"click": function(){
							JOBADInstance.Event.leftClick.trigger($target);
					},
					"menu": [["Remove this notification", function(element, JOBADInstance){
						JOBADInstance.Sidebar.removeNotification($(this));
					}]]
				});
				
			})
		}
	});
})(JOBAD.refs.$);
