(function($) {

/**
 * Attach this editor to a target element.
 */
Drupal.wysiwyg.editor.attach.ymacs = function(context, params, settings) {
  // Attach editor.
  window.Dynarch_Base_Url = settings["jspath"]+"/test/dl";
  window.YMACS_SRC_PATH = settings["jspath"]+"/src/js/";
  var editorID = "#"+params.field;
  
  var dlg = new DlDialog({ title: "Ymacs", resizable: false, fixed: true, noShadows: true });
  dlg.addClass("dropPadding");
  var javascript = new Ymacs_Buffer({ name: "file.tex" });
  javascript.setCode($(editorID).text());
  javascript.cmd("stex_mode");
  javascript.setq("indent_level", 4);
  
  var layout = new DlLayout({ parent: dlg });

  var ymacs = window.ymacs = new Ymacs({ buffers: [ javascript ] });
  ymacs.setColorTheme([ "dark", "y" ]);
  
  try {
   	ymacs.getActiveBuffer().cmd("eval_file", ".ymacs");
  } catch(ex) {}

  layout.packWidget(ymacs, { pos: "bottom", fill: "*" });

  //dlg._focusedWidget = ymacs;

  dlg.show(true);
  dlg.setSize({x:500, y:300});
  $(dlg.getElement()).attr("style","");
  $(dlg.getElement()).after($(editorID));
  $(editorID).hide();

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
