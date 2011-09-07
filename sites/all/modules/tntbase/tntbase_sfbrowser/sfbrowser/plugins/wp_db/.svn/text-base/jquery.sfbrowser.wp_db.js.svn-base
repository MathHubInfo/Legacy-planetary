;(function($) {
	//
	// data from sfbrowser
	// functions
	var trace;
	var file;
	var getPath;
	var lang;
	var gettext;
	var onError;
	var fillList;
	var listAdd;
	var addContextItem;
	var sortFbTable;
	// variables
	var aPath;
	var oSettings;
	var oTree;
	var oReg;
	var oThis;
	// display objects
	var $Document;
	var $Window;
	var $Body;
	var $SFB;
	var $SFBWin;
	var $TableH;
	var $Table;
	var $TbBody;
	var $TrLoading;
	var $Context;
	//
	var sButWpdb = "wpdb";
	var sButInWpdb = "inwpdb";
	var asdf = "qwer";
	//
	// private vars
	var sConnector;
	//
	var iButtonsIndex;
	var $ContextItem;
	//
	$.fn.extend($.sfbrowser, {
		wp_db: function(p) {
			// functions
			trace = p.trace;
			file = p.file;
			getPath = p.getPath;
			lang = p.lang;
			gettext = p.gettext;
			onError = p.onError;
			addContextItem = p.addContextItem;
			sortFbTable = p.sortFbTable;
			// variables
			aPath = p.aPath;
			oTree = p.oTree;
			oSettings = p.oSettings;
			oReg = p.oReg;
			moveWindowDown = p.moveWindowDown;
			fillList = p.fillList;
			listAdd = p.listAdd;
			addContextItem = p.addContextItem;
			// display objects
			$Document = p.$Document;
			$Window = p.$Window;
			$Body = p.$Body;
			$SFB = p.$SFB;
			$SFBWin = p.$SFBWin;
			$TableH = p.$TableH;
			$Table = p.$Table;
			$TbBody = p.$TbBody;
			$TrLoading = p.$TrLoading;
			$Context = p.$Context;
			//
			sConnector = oSettings.sfbpath+"plugins/wp_db/connectors/"+oSettings.connector+"/wp_db."+oSettings.connector;
			//
			// find the button table header index
			var $ThBut = $TableH.find("th.buttons");
			iButtonsIndex = $ThBut.parent().children().index($ThBut);
			//
			// add contextmenu item
			$ContextItem = addContextItem(sButWpdb,gettext('remFromWPlib'),function(e){
				addOrRemoveFromWpdb(file());
			},5);
		}
	});
	$.extend($.sfbrowser.wp_db, {
		 fillList: function(contents) {
			var oFindDB = {};
			var iFind = 0;
			// first loop through contents to find genuine files
			$.each( contents, function(s,oFile) {
				var bUpload = oFile.mime=="upload";
				var bFolder = oFile.mime=="folder";
				var bUFolder = oFile.mime=="folderup";
				if (!(bUpload||bFolder||bUFolder)&&oFile.wpPostsId===undefined) {
					oFile.wpPostsId = 0;
					oFindDB[s] = oFile.file;
					iFind++;
				}
			});
			// then check if these files are in the WP db
			if (iFind!==0) {
				$.ajax({type:"POST", url:sConnector, data:"a=inDB&folder="+aPath.join("")+"&files="+JSON.stringify(oFindDB), dataType:"json", error:onError, success:function(data, status){
					var oDir = getPath().contents;
					$.each(data.data,function(s,id){
						var oFile = oDir[s];
						oFile.wpPostsId = id;
						oFile.tr.find("a."+sButWpdb).addClass(sButInWpdb).attr('title',gettext('isInWPlib'));
					});
				}});
			}
		}
		,listAdd: function(obj) {
			var bUpload = obj.mime=="upload";
			var bFolder = obj.mime=="folder";
			var bUFolder = obj.mime=="folderup";
			if (!(bUpload||bFolder||bUFolder)) {
				var $Tr = obj.tr;
				var $Td = $Tr.find("td:eq("+iButtonsIndex+")");
				var sTitle = gettext('clickAddToWPlib');
				var $A = $("<a onclick=\"\" class=\"sfbbutton "+sButWpdb+(obj.wpPostsId?" "+sButInWpdb:"")+"\" title=\""+sTitle+"\">&#160;<span>"+sTitle+"</span></a>").prependTo($Td);
				$A.click(function(e){addOrRemoveFromWpdb(obj)});
			}
		}
		,deleteFile: function(e) {
			var mTr = $(e.target).parent().parent();
			var oFile = file(mTr);
			if (oFile.wpPostsId) removeFromWpdb(oFile,gettext('alsoDelFromWPlib'));//##############$$$$$$$$$$$$$$
		}
		,checkContextItem: function(oFile,mCntx) {
			var bShow = oFile.wpPostsId!==undefined;
			$ContextItem.css({display:bShow?"block":"none"});
			if (bShow) {
				var bInWpdb = oFile.wpPostsId>0;
				var sFText = !bInWpdb?gettext('addToWPlib'):gettext('remFromWPlib');
				var sText = !bInWpdb?gettext('addToDB'):gettext('remFromDB');
				var $A = $ContextItem.find('a');
				$A.attr('title',sFText).find('span').html(sText);
				if (bInWpdb) $A.addClass(sButInWpdb);
				else $A.removeClass(sButInWpdb);
			}
		}
	});
	//
	function addOrRemoveFromWpdb(file) {
		if (file.wpPostsId>0)	removeFromWpdb(file,gettext('remFromWPlibLinked'));
		else					addToWpdb(file,gettext('addToWPlib'));
	}
	//
	function removeFromWpdb(file,msg) {
		if (confirm(msg)) {
			$.ajax({type:"POST", url:sConnector, data:"a=remDB&folder="+aPath.join("")+"&id="+file.wpPostsId, dataType:"json", error:onError, success:function(data, status){
				if (data.error=="") {
					var oPath = getPath();
					$.each(data.data,function(i,filename){
						trace("filename: "+filename,true);
						var oFile = oPath.contents[filename];
						oFile.tr.find("a.wpdb").removeClass(sButInWpdb);
						oFile.wpPostsId = 0;
					});
				}
			}});
		}
	}
	//
	function addToWpdb(file,msg) {
		if (confirm(msg)) {
			trace();
			$.ajax({type:"POST", url:sConnector, data:"a=addDB&folder="+aPath.join("")+"&file="+file.file, dataType:"json", error:onError, success:function(data, status){
				if (data.error=="") {
					var oPath = getPath();
					file.tr.find("a.wpdb").addClass(sButInWpdb);
					file.wpPostsId = data.data.postid;
					//
					if (data.data.files) {
						$.each(data.data.files,function(i,oFile){
							trace("file.wpPostsId: "+file);
							trace(oFile);
							oFile.wpPostsId = data.data.postid;

							var mTr = listAdd(oFile);
							mTr.find("a.wpdb").addClass(sButInWpdb);
						});
						// sort
						sortFbTable();
					}
				}
			}});
		}
	}
})(jQuery);