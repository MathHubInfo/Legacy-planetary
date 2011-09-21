_newView({
    // Object containing general information about the module
    info      : {
       // The machine name of the view. Used in dependency references
       'identifier'  : 'contextMenu',
       // The human-readable name for the module
       'title'       : 'Context Menu View',
       // The author of the module
       'author'      : 'Stefan Mirea',
       // The description of the module
       'description' : 'The default context-menu view for the menu. It is the built-in template'
    },
    stylesheets : [ tContextMenu._opt.baseURL + 'js/views/css/contextMenu.css' ]
});
