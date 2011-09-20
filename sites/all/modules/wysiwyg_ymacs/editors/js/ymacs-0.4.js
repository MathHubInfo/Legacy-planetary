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
  javascript.setCode($(editorID).val());
  javascript.cmd("stex_mode");
  javascript.setq("indent_level", 4);
  
  var layout = new DlLayout({ parent: dlg });

  var ymacs = window.ymacs = new Ymacs({ buffers: [ javascript ] });
  ymacs.setColorTheme([ "dark", "y" ]);
  
  try {
   	ymacs.getActiveBuffer().cmd("eval_file", ".ymacs");
  } catch(ex) {}

  layout.packWidget(ymacs, { pos: "bottom", fill: "*" });

  dlg.show(true);
  $(dlg.getElement()).attr("style","position:relative; width: 500px");
  dlg.setSize({x:500, y:300});
  $(editorID).after($(dlg.getElement()));
  $(editorID).hide();
  $(editorID).each(function (c, obj) {
	  jQuery.data(obj, "editor", ymacs);
	  jQuery.data(obj, "dialog", dlg);
	  jQuery.data(obj, "buffer", javascript);
  });
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
    	var ymacs = jQuery.data(obj, "editor");
        var dialog = jQuery.data(obj, "dialog");
        var buffer = jQuery.data(obj, "buffer");
        if (typeof(ymacs) != "undefined" && typeof(dialog) != "undefined" && typeof(buffer) != "undefined") {
        	dialog.destroy();
        	ymacs.destroy();
        	$(editorID).val(buffer.getCode());
        	$(editorID).show();
        	jQuery.data(obj, "editor", null);
        	jQuery.data(obj, "dialog", null);
        	jQuery.data(obj, "buffer", null);	
        }    	
    });
    	
  }
};

})(jQuery);
