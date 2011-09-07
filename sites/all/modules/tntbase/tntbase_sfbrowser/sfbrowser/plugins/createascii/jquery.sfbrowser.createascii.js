;(function($) {
	//
	// data from sfbrowser
	// functions
	var trace;
	var file;
	var lang;
	var gettext;
	var onError;
	var listAdd;
	var shortcutsDisabled;
	var resizeWindow;
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
	// private vars
	var oFile;
	var mBut;
	var mAsc;
	var mNme; // input.text for name
	var mExt; // select for extension
	var mCnt; // textarea for contents
	var sCntOr; // original contents
	var mContextItem;
	var bNewOrEdit;
	var sConnector;
	//
	$.fn.extend($.sfbrowser, {
		createascii: function(p) {
			trace = p.trace;
			file = p.file;
			lang = p.lang;
			gettext = p.gettext;
			onError = p.onError;
			addContextItem = p.addContextItem;
			aPath = p.aPath;
			oTree = p.oTree;
			oSettings = p.oSettings;
			oReg = p.oReg;
			moveWindowDown = p.moveWindowDown;
			listAdd = p.listAdd;
			shortcutsDisabled = p.shortcutsDisabled;
			resizeWindow = p.resizeWindow;
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
			sConnector = oSettings.sfbpath+"plugins/createascii/connectors/"+oSettings.connector+"/createascii."+oSettings.connector;
			//
			var sHtml = "<div>"+oSettings.createascii+"</div>";
			var oHtml = $(sHtml);
			//
			mBut = oHtml.find(">ul>li:first").prependTo($SFB.find("#sfbtopmenu")).click(openCreateascii);
			mBut.find("a>span").text(gettext('asciiFileNew'));
			//
			mAsc = oHtml.find("#sfbcreateascii").appendTo($SFB.find("#fbwin")).hide();
			mAsc.find(".cancel").click(closeCreateascii);
			mAsc.find(".submit").click(submitCreateascii);

			mNme = mAsc.find("input");
			mExt = mAsc.find("select");
			mCnt = mAsc.find("textarea");
			//
			// labels
			mAsc.find("label[for=filename]").text(gettext('filename')+": ");
			mAsc.find("label[for=fileext]").text(gettext('filetype')+": ");
			mAsc.find("label[for=filecont]").text(gettext('contents')+": ");
			//
			// add mime types
			$(oSettings.ascii).each(function(i,o){
				if (oSettings.deny.indexOf(0)<0) mExt.append("<option value=\""+o+"\">&#160; "+o+"</option>");
			});
			//
			// header
			mAsc.find("div.sfbheader>h3").mousedown(moveWindowDown);
			//
			// add contextmenu item
			mContextItem = addContextItem("editascii",gettext('editascii'),function(){openCreateascii()},0);
//			//$.sfbrowser.createascii.resizeWindow(123,123); //$$ causes IE error : functions are probably not inited yet
		}
	});
	$.extend($.sfbrowser.createascii, {
		resizeWindow: function(iWdt,iHgt) {
			mCnt.width(iWdt-30).height(iHgt-mCnt.position().top-45);
		}
		,checkContextItem: function(oFile) {
			mContextItem.css({display:oSettings.ascii.indexOf(oFile.mime)>=0?"block":"none"});
		}
	});
	function openCreateascii(e) {
		bNewOrEdit = e!=null;
		shortcutsDisabled(true);
		// set txt
		mAsc.find("h3").text(bNewOrEdit?gettext('asciiFileNew'):gettext('editascii'));
		mAsc.find(".submit").text(bNewOrEdit?gettext('create'):gettext('save'));
		//
		if (bNewOrEdit) {
			mCnt.text("");
			oFile = null;
		} else {
			oFile = file();
			$.ajax({type:"POST", url:sConnector, data:"a=cont&folder="+aPath.join("")+"&file="+oFile.file, dataType:"json", success:function(data, status){//, error:onError
				if (typeof(data.error)!="undefined") {
					if (data.error!="") alert(lang(data.error));
					else				mCnt.text(data.data.text);
				}
			}});
		}
		//
		//
		var oShow = {display:bNewOrEdit?"inline":"none"}
		$("[for=filename],[for=fileext],[name=filename],[name=fileext]").css(oShow);
		//mNme.css(oShow);
		//mExt.css(oShow);
		//
		$("#winbrowser").hide();
		mAsc.show();
		resizeWindow();
//		resizeBrowser();
//		$("#resizer").mousedown().mouseup();
//			$SFB.resizeBrowser();
//			$SFB.resizeWindow();
//		gettext('editascii')
//		mAsc.show(0,$.sfbrowser.resizeWindow);
//		mAsc.show(0,resizeWindow);
//		$.sfbrowser.createascii.resizeWindow();
	}
	function closeCreateascii(e) {
		mAsc.hide();
		shortcutsDisabled(false);
		$("#winbrowser").show();
		resizeWindow();
//		$("#resizer").mousedown().mouseup();
//			$SFB.resizeBrowser();
//			$SFB.resizeWindow();
	}
	function submitCreateascii(e) {
		var sNme = mNme.val();
		var sExt = mExt.val();
		var sCnt = mCnt.val();
		var sFNme = sNme+"."+sExt;
		var bProceed = true;
		if (bNewOrEdit) {
			if (sNme==""||sNme.match(oReg.fileNameNoExt)) {
				alert(gettext('axciiFileNameInvalid'));
				bProceed = false;
			}
		} else {
			if (sCntOr==sCnt) {
				trace("No changes were made.");
				closeCreateascii();
				bProceed = false;
			}
		}
		if (bProceed) {
			var sSend = "a="+(bNewOrEdit?"new":"edit")+"&folder="+aPath.join("")+"&file="+(bNewOrEdit?sFNme:oFile.file)+"&contents="+sCnt;
			$.ajax({type:"POST", url:sConnector, data:sSend, dataType:"json", error:onError, success:function(data, status){
				if (typeof(data.error)!="undefined") {
					if (data.error!="") {
						alert(lang(data.error));
					} else {
						if (data.data.file)	listAdd(data.data,1);
						closeCreateascii();
					}
				}
			}});
		}
	}
})(jQuery);