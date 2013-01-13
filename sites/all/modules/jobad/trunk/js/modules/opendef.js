_newModule({
	
	info : {
		'identifier' : 'open_def',
		'title' : 'Open definition',
		'author' : 'Alexandru Toader',
		'description' : 'Open the definition of the selected item in the current window',
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
				text : 'Look-up definition',
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
				var cd,
				symbol;
				if (jTarget.is('span')) {
					cd = jTarget.attr("omdoc:cd");
					symbol = jTarget.attr("omdoc:name");
				} else if (jTarget.is('div')) {
					var aux = jTarget.attr('id');
					aux = aux.substring(aux.lastIndexOf("/") + 1);
					cd = aux.substring(0, aux.indexOf(".omdoc"));
					symbol = aux.substring(aux.indexOf("#") + 1, aux.lastIndexOf(".def"));
				}

					window.open("http://localhost/drupal_planetary/?q=sally/showdef/" + cd + "/" + symbol + "/" + token, "_parent");
				
			});
			if ((jTarget.is('.omdoc-term') || jTarget.attr('class') == 'node')&& typeof(token)!= 'undefined')
				return obj;
			return false;
			
		}
	})()
	
});
