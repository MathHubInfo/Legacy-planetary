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
			semMap = [["sax-salarycosts", "sax-salarycostsperti"], ["sax-revenues-actual", "sax-revenuesperti-actual"], ["sax-salarycosts-actual", "sax-salarycostsperti-actual"], ["sax-expenses-actual", "sax-expensesperti-actual"], ["sax-utilitycosts-projected", "sax-utilitycostsperti-projected"], ["sax-expenses-actual", "sax-othercostsperti-actual"], ["sax-expenses-projected", "sax-othercostsperti-projected"], ["sax-revenues-projected", "sax-revenuesperti-projected"], ["sax-utilitycosts-actual", "sax-utilitycostsperti-actual"], ["sax-admincosts-actual", "sax-admincostsperti-actual"], ["sax-materialcosts-projected", "sax-materialcostsperti-projected"], ["sax-salarycosts-projected", "sax-salarycostsperti-projected"], ["sax-profits-actual", "sax-profitsperti-actual"], ["sax-salarycosts-projected", "sax-salaryperti-projected"], ["sax-materialcosts-actual", "sax-materialcostsperti-actual"], ["timeinterval", "timeinterval"], ["sax-expenses-projected", "sax-expensesperti-projected"], ["sax-admincosts-projected", "sax-admincostsperti-projected"], ["sax-profits-projected", "sax-profitsperti-projected"], ["sax-salarycosts-actual", "sax-salaryperti-actual"]];
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

					if (document.activeElement.selectionStart) {
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
			} else
				return false;

		}
	})()

});
