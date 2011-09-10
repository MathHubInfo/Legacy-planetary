(function($) {

/**
 * Attach this editor to a target element.
 */
Drupal.wysiwyg.editor.attach.ymacs = function(context, params, settings) {
  // Attach editor.
  window.Dynarch_Base_Url = settings["jspath"]+"/test/dl";
  window.YMACS_SRC_PATH = settings["jspath"]+"/src/js/";
  var desktop = new DlDesktop({});
  desktop.fullScreen();
  var dlg = new DlDialog({ title: "Ymacs", resizable: true });
  var javascript = new Ymacs_Buffer({ name: "test.js" });
  javascript.setCode("lalala");
  javascript.cmd("javascript_dl_mode");
  javascript.setq("indent_level", 4);
  var ymacs = window.ymacs = new Ymacs({ buffers: [ javascript ] });
  ymacs.setColorTheme([ "dark", "y" ]);
  alert(ymacs);
};

/**
 * Detach a single or all editors.
 *
 * See Drupal.wysiwyg.editor.detach.none() for a full desciption of this hook.
 */
Drupal.wysiwyg.editor.detach.ymacs = function(context, params) {
  if (typeof params != 'undefined') {
    var editorID = "#"+params.field;
    $(editorID).each(function (c, obj) {
    	var editor = jQuery.data(obj, 'editor');
    	if (editor != null) {
        	editor.save();
        	editor.toTextArea();
        	jQuery.data($(editorID), 'editor', null);
        }
    });
    
  }
};

})(jQuery);
