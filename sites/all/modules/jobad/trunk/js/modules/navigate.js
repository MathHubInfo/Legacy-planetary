_newModule({
	
	info : {
		'identifier' : 'navigation',
		'title' : 'Show cell in spreadsheet',
		'author' : 'Alexandru Toader',
		'description' : 'Checks if the clicked element has the required id and name and displays the option to show it in the spreadsheet',
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
				text : 'Show cell in spreadsheet',
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
				// 0 stands for the navigate action
				Communication.sendMessage(token, cd, symbol, 0);
				
			});
			
			var i = 0;
			while (true) {
				if (typeof message.context[i] == 'undefined')
					break;
				if (jTarget.is('span') && jTarget.is('.omdoc-term') && jTarget.attr('omdoc:cd') == message.context[i].theory && jTarget.attr('omdoc:name') == message.context[i].symbol && typeof(token)!= 'undefined')
					return obj;
				i++;
			}
			return false;
			
		}
	})()
	
});
