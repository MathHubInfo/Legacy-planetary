_newModule({

	info : {
		'identifier' : 'search_google',
		'title' : 'Show cell in spreadsheet',
		'author' : 'Alexandru Toader',
		'description' : 'Checks if text was selected and returns the option to search google for the text',
		'dependencies' : []
	},

	options : {},

	validate : (function() {

		return function(event, container) {
			var target = event.target;
			var jTarget = $(target);
			var obj = {};
			$.extend(obj, tContextMenu.templates.moduleOutput, {
				element : container,
				text : 'Search Google for ',
				description : 'Module description',
				icon : 'js/modules/icons/module1.png',
				smallIcon : 'js/modules/icons/module1_small.png',
				weight : 50
			});
				obj.element.bind('click.switchViews', function() {
				tContextMenu.hide(function(view) {
					tContextMenu.setView(view);
				}, [$(this).data('identifier')]);
			});

			function GetSelectedText() {
				var selectedText = (window.getSelection ? window.getSelection() : document.getSelection ? document.getSelection() : document.selection.createRange().text
				);
				if (!selectedText || selectedText == "") {

					if (document.activeElement && document.activeElement.selectionStart) {
						selectedText = document.activeElement.value.substring(document.activeElement.selectionStart.document.activeElement.selectionEnd);
					}
				}

				return selectedText;
			}

			txt = GetSelectedText().toString();
			if (txt && txt.replace(/\s+/g, ' ') != '') {
				obj.text += '"' + txt.substring(0, 5) + ".." + '""';
				obj.element.bind('click', function() {
					window.open("http://www.google.com/search?q=" + txt, "_parent");
				});
				return obj;
			} else if (jTarget.attr('class') == 'node' && jTarget.is('div')) {
				txt = jTarget.text();
				obj.text += '"' + txt.substring(0, 5) + ".." + '""';
				obj.element.bind('click', function() {
					window.open("http://www.google.com/search?q=" + txt, "_parent");
				});
				return obj;

			} else
				return false;

		}
	})()

});
