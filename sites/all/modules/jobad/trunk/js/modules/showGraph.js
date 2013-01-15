_newModule({
	
	info : {
		'identifier' : 'show_graph',
		'title' : 'Show dependency graph',
		'author' : 'Alexandru Toader',
		'description' : 'Shows the dependency graph',
		'dependencies' : []
	},
	
	options : {},
	
	validate : (function () {
		
		return function (event, container) {
			var target = event.target;
			var jTarget = $(target);
			var obj = {};
			$.extend(obj, tContextMenu.templates.moduleOutput, {
				element : container,
				text : 'Show dependency graph',
				description : 'Module description',
				icon : 'js/modules/icons/module1.png',
				smallIcon : 'js/modules/icons/module1_small.png',
				weight : 50
			});
			
			obj.element.bind('click.switchViews', function () {
				tContextMenu.hide(function (view) {
					tContextMenu.setView(view);
				}, [$(this).data('identifier')]);
			});
			
			obj.element.bind('click', function () {
				cd = jTarget.attr("omdoc:cd");
				symbol = jTarget.attr("omdoc:name");
				// Window.token is a global variable and must be set on $.ready() or window.onload()
				//alert(token);
					window.open("http://localhost/drupal_planetary/index.php?q=sally/semnav/" + cd + "/" + symbol + "/" + token, "_parent");
				
			});
			
			if (jTarget.is('.omdoc-term') && typeof(token)!= 'undefined')
				return obj;
			return false;
			
		}
	})()
	
});
