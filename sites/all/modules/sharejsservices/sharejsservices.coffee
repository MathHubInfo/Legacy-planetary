ShareJSConnection = (doc, editor) ->
  @doc = doc;
  @editor = editor;

  @initToolbar = (toolbardiv) ->
    services = [{text:"Detect Semantic Terms", id:"termref"}, {text:"Hide ", id:"hider"}];
    for serv,id in services
      btn = jQuery("<button>").append(serv.text);
      jQuery(btn).button({text:true});
      btn.click(serv, (evt) -> 
      	console.log(evt.data);
      	return false 
      )
      toolbardiv.append(btn)

  return {
    initToolbar : @initToolbar
  }; 

Drupal.ShareJS = {
	_isInit : false,
	
	init : (callback) ->
	  if @_isInit == true
	  	return;

	  async.waterfall([
	  	(callback) -> jQuery.getScript(Drupal.settings.ShareJSConfig.url+"channel/bcsocket.js",(success, textStatus, jqXHR) -> callback(null)),
	  	(callback) -> jQuery.getScript(Drupal.settings.ShareJSConfig.url+"share/AttributePool.js", (success, textStatus, jqXHR) -> callback(null)),
	  	(callback) -> jQuery.getScript(Drupal.settings.ShareJSConfig.url+"share/Changeset.js", (success, textStatus, jqXHR) -> callback(null)),
	  	(callback) -> jQuery.getScript(Drupal.settings.ShareJSConfig.url+"share/share.uncompressed.js", (success, textStatus, jqXHR) -> callback(null)),
	  ], (err)->
	  	callback()
	  );
	
	assertInit : (callback) ->
	  _this = @
	  if @_isInit == false
	  	@init(()->
		  	_this._isInit = true
		  	callback.call(_this)
	  	);

	connectServices : (docName, editorType, editor, initText, callback) ->
	  @assertInit(() ->
	  	async.waterfall([
	  		(callback) -> jQuery.getScript(Drupal.settings.ShareJSConfig.url+"share/"+editorType+".js",(success, textStatus, jqXHR) -> callback(null)),
	  		(callback) -> sharejs.open(docName, 'etherpad', Drupal.settings.ShareJSConfig.url+"channel", callback),
	  		(doc, callback) ->
	  		  doc["attach_"+editorType](editor);
	  		  if doc.created == false
	  		  	async.waterfall [
	  		  		(callback) -> doc.del 0, doc.snapshot.text.length, callback,
	  		  		(callback) -> doc.insert 0, initText
	  		  	];
	  		  callback(null, doc)
	  		(doc, callback) ->
	  		  callback(null, new ShareJSConnection(doc, editor));
	  	], (err, sharejsconn) ->
	  	  callback(err, sharejsconn);
	  	);
	  )
}

