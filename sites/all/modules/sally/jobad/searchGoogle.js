(function($){JOBAD.modules.register({
    info: {
        'identifier': 'searchGoogle',
        'title': 'Search Google',
        'author': 'Alexandru Toader',
        'description': 'Search Google for selected text or for the title of a node. ',
        'hasCleanNamespace': false
    },
    getSelectedText: function () {
        var selectedText = (window.getSelection ? window.getSelection() : document.getSelection ? document.getSelection() : document.selection.createRange().text
            );
        if (!selectedText || selectedText == "") {

            if (document.activeElement && document.activeElement.selectionStart) {
                selectedText = document.activeElement.value.substring(document.activeElement.selectionStart.document.activeElement.selectionEnd);
            }
        }

        return selectedText;
    },

    contextMenuEntries: function (target) {
        var txt = this.getSelectedText().toString();
        var text = "Search Google for ";
        if (txt && txt.replace(/\s+/g, ' ') != '') {
            text += '"' + txt.substring(0, 5) + ".." + '""';
            return [
                [text, function (element) {
                    window.open("http://www.google.com/search?q=" + txt, "_parent");
                }]
            ];
        } else if (target.attr('class') == 'node' && target.is('div')) {
            console.log("here");
            txt = target.text();
            text += '"' + txt.substring(0, 5) + ".." + '""';
            return [
                [text, function (element) {
                    window.open("http://www.google.com/search?q=" + txt, "_parent");
                }]
            ];
        }

    },
});
})(JOBAD.refs.$);