Drupal.ShareJS = (_editor, _docName, _editorType) ->
  editor = _editor;
  docName = _docName;
  editorType = _editorType;
  
  inMathEnvironment = (callback) ->
    range = editor.getCursorPosition();
    r = range.row;
    c = range.column;
    rDoc = editor.getSession().getDocument();
    # not handling multiple-line $. Probably no need to 
    
    inMath = 0;
    mathBegin = 0;
    mathEnd = 0;
    rDoc.getLine(r).replace(/\$/g, (token, pos) ->
      if pos < c
        inMath^=1;
        mathBegin = pos+1 if inMath;
      else
        mathEnd = pos if mathEnd == 0;
    );
    # happens when the closing $ is missing
    if mathEnd < mathBegin 
      mathEnd = rDoc.getLine(r).length
    if inMath
      callback(null, 
        start: {row: r, column: mathBegin}, 
        end: {row:r, column: mathEnd}, 
        isEmpty : () -> return false; 
        isMultiLine : () -> return false;
      )
    else
      callback(null, null);

  assertLoadMathQuill = (_callback) ->
    libPath = Drupal.settings.basePath+"sites/all/libraries/mathquill/"
    async.waterfall([
      (callback) -> jQuery.getScript(libPath+"build/mathquill.js",(success, textStatus, jqXHR) -> callback(null)),
      (callback) -> jQuery('head').append( jQuery('<link rel="stylesheet" type="text/css" />').attr('href', libPath+"mathquill.css") ); callback();
    ], _callback);
  
  assertLoadShareJS = (_callback) -> 
    if ShareJS?
      _callback();
      return
    async.waterfall([
      (callback) -> jQuery.getScript(Drupal.settings.ShareJSConfig.url+"channel/bcsocket.js",(success, textStatus, jqXHR) -> callback(null)),
      (callback) -> jQuery.getScript(Drupal.settings.ShareJSConfig.url+"share/AttributePool.js",(success, textStatus, jqXHR) -> callback(null)),
      (callback) -> jQuery.getScript(Drupal.settings.ShareJSConfig.url+"share/Changeset.js",(success, textStatus, jqXHR) -> callback(null)),
      (callback) -> jQuery.getScript(Drupal.settings.ShareJSConfig.url+"share/share.uncompressed.js", (success, textStatus, jqXHR) -> callback(null)),
      (callback) -> jQuery.getScript(Drupal.settings.ShareJSConfig.url+"share/ace.js",(success, textStatus, jqXHR) -> callback(null)),
      ], _callback);
  
  @initToolbar = (_callback) ->
    editor.addToolbarButton("Bold", "bold", (data) ->
      range = editor.getSelectionRange();
      rDoc = editor.getSession().getDocument();
      rDoc.insert(range.end, "}")
      rDoc.insert(range.start, "\\bf{")
    );
    editor.addToolbarButton("Italic", "italic", (data) ->
      range = editor.getSelectionRange();
      rDoc = editor.getSession().getDocument();
      rDoc.insert(range.end, "}")
      rDoc.insert(range.start, "\\em{")
    );
    editor.addToolbarButton("Add formula", "formula", (data) ->
      async.waterfall([
        (callback) -> assertLoadMathQuill(callback),
        (callback) -> inMathEnvironment(callback),
        (range, callback) ->
          rDoc = editor.getSession().getDocument();
          console.log("Range=",range);
          formulaText = "";
          if range?
            formulaText = rDoc.getTextRange(range);
          insertFormula = () ->
            txt = jQuery("#mathedit span").mathquill("latex");
            if (range?)
              rDoc.replace(range, txt);
            else
              editor.insert("$"+txt+"$");
            jQuery("#mathedit").dialog("close");
            editor.focus();
          if jQuery("#mathedit").size() == 0 
            jQuery("<div>").attr("id", "mathedit").appendTo("body");
            jQuery("<span>").text(formulaText).appendTo("#mathedit").mathquill("editable");
            jQuery("#mathedit span").bind('keydown', (e) ->
              if (e.keyCode?)
                code = e.keyCode; 
              else
                code = e.which;
              if (code == 13)
                e.stopPropagation();
                insertFormula();
                return;
            )
          else
            jQuery("#mathedit span").mathquill("latex", formulaText);
          jQuery("#mathedit").dialog(
            "title":"Edit math", 
            buttons:[
              "text" : "insert",
              click : insertFormula
            ]
          );
          callback();
      ]);
    );
    editor.addToolbarButton("Share", "share", () ->
      async.waterfall([
        (callback) -> assertLoadShareJS(callback),
        (callback) -> sharejs.open(docName, 'etherpad', Drupal.settings.ShareJSConfig.url+"channel", callback),
        (doc, callback) ->
          sharetext = doc.type.api.getText.apply(doc);
          initText = editor.getSession().getDocument().getValue();
          return callback(null, doc, true) if (sharetext == initText)
          choice = confirm("Somebody else is editing this document. Would you like to collaborate on it?");
          return callback(null, doc, true) if (choice)
          docName += Math.random();
          sharejs.open(docName, 'etherpad', Drupal.settings.ShareJSConfig.url + "channel", callback);
        (doc, keep, callback) ->
          if (callback?)
            doc["attach_"+editorType](editor, false);
          else
            doc["attach_"+editorType](editor, true);
        ], (err) ->
          console.log(err) if err?; 
      );
    );
   @

