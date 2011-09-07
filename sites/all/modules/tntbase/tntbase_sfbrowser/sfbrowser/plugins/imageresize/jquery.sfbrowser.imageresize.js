;(function($) {
	// data from sfbrowser
	// functions
	var trace;
	var openDir;
	var addContextItem;
	var file;
	var lang;
	var gettext;
	var moveWindowDown;
	var resizeWindow;
	// variables
	var aPath;
	var oSettings;
	var oTree;
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
	var sConnector;
	var oFile;
	var mContextItem;
	//
	// dragging
	var mDragEl;
	var iDragEl = -1;
	//
	var fRzsAspR;
	var fRzsScale;
	//
	var iRzsW;
	var iRzsH;
	var iCrpW;
	var iCrpH;
	var iCrpX;
	var iCrpY;
	var iCrpXs;
	var iCrpYs;
	var iCrpWs;
	var iCrpHs;
	//
	$.fn.extend($.sfbrowser, {
		imageresize: function(p) {
			trace = p.trace;
			openDir = p.openDir;
			aPath = p.aPath;
			oTree = p.oTree;
			oSettings = p.oSettings;
			addContextItem = p.addContextItem;
			file = p.file;
			lang = p.lang;
			gettext = p.gettext;
			moveWindowDown = p.moveWindowDown;
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
			var oSfb = $.sfbrowser;
			sConnector = oSettings.sfbpath+"plugins/imageresize/connectors/"+oSettings.connector+"/imageresize."+oSettings.connector;
			//
			//$SFB.find("#fbwin").prepend(oSettings.imageresize);
			$(oSettings.imageresize).prependTo($SFB.find("#fbwin")).hide();
			//
			// header
			$SFB.find("#sfbimgresize>div.sfbheader>h3").mousedown(moveWindowDown);
			// resize menu
			$SFB.find("div.cancelresize").text(gettext('cancel')).click(function(){
				$("#sfbimgresize").hide();
				$("#winbrowser").show();
				resizeWindow();
			});
			$SFB.find("div.resize").text(gettext('resize')).click(resizeSend);
			$SFB.find("div.handle").attr("title",gettext('dragMe')).mousedown(dragStart);
			$SFB.find("div#crop").attr("title",gettext('dragMe')).mousedown(dragStart);
			$("div#sfbimgresize>div.fbcontent>label[for=rszperc]").text(gettext('scale'));
			// resize form
			$("form#sfbsize legend:eq(0)").text(gettext('resize')+":");
			$("form#sfbsize label[for=rszW]").text(gettext('width'));
			$("form#sfbsize label[for=rszH]").text(gettext('height'));
			$("form#sfbsize input[name=rszW]").change(function(){
				iRzsW = Math.min(oFile.width,parseInt($(this).val()));
				iRzsH = iRzsW/fRzsAspR;
				setView();
			});
			$("form#sfbsize input[name=rszH]").change(function(){
				iRzsH = Math.min(oFile.height,parseInt($(this).val()));
				iRzsW = iRzsH*fRzsAspR;
				setView();
			});
			// resize crop
			$("form#sfbsize legend:eq(1)").text(gettext('crop')+":");
			$("form#sfbsize label[for=crpW]").text(gettext('width'));
			$("form#sfbsize label[for=crpH]").text(gettext('height'));
			$("form#sfbsize input[name=crpX]").change(function(){
				iCrpX = parseInt($(this).val());
				setView();
			});
			$("form#sfbsize input[name=crpY]").change(function(){
				iCrpY = parseInt($(this).val());
				setView();
			});
			$("form#sfbsize input[name=crpW]").change(function(){
				iCrpW = parseInt($(this).val());
				setView();
			});
			$("form#sfbsize input[name=crpH]").change(function(){
				iCrpH = parseInt($(this).val());
				setView();
			});
			// add contextmenu item
			mContextItem = addContextItem("resize",gettext('resize'),function(){resizeImage()},0);
		}
	});
	$.extend($.sfbrowser.imageresize, {
		resizeWindow: function(iWdt,iHgt) {
			if (oFile) {
				var iMaxW = $("#fbwin").width()-$("form#sfbsize").width()-20;
				var iMaxH = $("#fbwin").height()-70;
				fRzsScale = Math.min(1,Math.min(iMaxW/oFile.width,iMaxH/oFile.height));
				$("div#sfbimgresize>div.fbcontent>span#rszperc").text(Math.round(fRzsScale*100)+"%");
				$("#sfbimgresize div#org").css({width:(fRzsScale*oFile.width)+"px",height:(fRzsScale*oFile.height)+"px"});
				setView();
			}
		}
		,checkContextItem: function(oFile,mCntx) {
			mContextItem.css({display:oFile.width!==undefined&&oFile.height!==undefined?"block":"none"});
		}
	});
	// resize Image
	function resizeImage(el) {
		$("#winbrowser").hide();
		$("#sfbimgresize").show();
		oFile = file();
		fRzsAspR = oFile.width/oFile.height;
		iCrpWs = iCrpW = iRzsW = oFile.width;
		iCrpHs = iCrpH = iRzsH = oFile.height;
		iCrpXs = iCrpYs = iCrpX = iCrpY = 0;
		$("#sfbimgresize>div.sfbheader>h3").text(gettext('imgResize')+": "+oFile.file);
		$("div#sfbrsimg>img").attr("src",oSettings.sfbpath+aPath.join("")+oFile.file+"?"+Math.random());
		$.sfbrowser.imageresize.resizeWindow();
	}
	// dragging
	function dragStart(e) {
		iCrpXs = iCrpX;
		iCrpYs = iCrpY;
		iCrpWs = iCrpW;
		iCrpHs = iCrpH;
		var oCurTarget = this;
		$SFB.find("div.handle").each(function(i){
			if ($(this)[0]==oCurTarget) iDragEl = i;
		});
		mDragEl = $(this);
		if (mDragEl[0]==$("div#crop")[0]) iDragEl = 10;
		$("body").mousemove(dragMove).mouseup(function(){
			$("body").unbind("mousemove",dragMove);
			iDragEl = -1;
			mDragEl = null;
		});
		e.stopPropagation();
		return false;
	}
	function dragMove(e) {
		var mPrn = mDragEl.parent();
		var iXps = Math.min(Math.max(0,Math.round((e.pageX-mPrn.offset().left)/fRzsScale)),oFile.width);
		var iYps = Math.min(Math.max(0,Math.round((e.pageY-mPrn.offset().top )/fRzsScale)),oFile.height);
		switch (iDragEl) {
			case 10:
				iCrpX = iXps-iCrpW/2;
				iCrpY = iYps-iCrpH/2;
			break;
			case 8:
				iRzsW = iXps;
				iRzsH = iYps;
			break;
			default:
				for (var i=0;i<(iDragEl<4?2:1);i++) {
					switch (((iDragEl%4)-i+4)%4) {
						case 0: iCrpY = iYps; iCrpH = iCrpHs-(iCrpY-iCrpYs); break;
						case 1: iCrpW = iXps-iCrpX; break;
						case 2: iCrpH = iYps-iCrpY; break;
						case 3: iCrpX = iXps; iCrpW = iCrpWs-(iCrpX-iCrpXs); break;		
					}
				}
		}
		setView();
		e.stopPropagation();
		return false;
	}
	// set view
	function setView() {
		// correct size
		iRzsW = Math.max(1,iRzsW);
		iRzsH = Math.max(1,iRzsH);
		if (iRzsW/iRzsH>fRzsAspR)	iRzsH = iRzsW/fRzsAspR;
		else						iRzsW = iRzsH*fRzsAspR;
		// correct size and crop
		iCrpX = Math.max(Math.min(iCrpX,iRzsW-iCrpW),0);
		iCrpY = Math.max(Math.min(iCrpY,iRzsH-iCrpH),0);
		iCrpW = Math.max(1,Math.min(iCrpW,iRzsW-iCrpX));
		iCrpH = Math.max(1,Math.min(iCrpH,iRzsH-iCrpY));
		//
		var iRW = iRzsW*fRzsScale;
		var iRH = iRzsH*fRzsScale;
		var iCX = iCrpX*fRzsScale;
		var iCY = iCrpY*fRzsScale;
		var iCW = iCrpW*fRzsScale;
		var iCH = iCrpH*fRzsScale;
		//
		// squares
		$("div#sfbrsimg>img").css({width:iRW+"px",height:iRH+"px"});
		$("#sfbimgresize div#crop").css({left:iCX+"px",top:iCY+"px",width:iCW+"px",height:iCH+"px"});
		//
		// handles
		$("div.handle:eq(8)").css({left:(iRW-6)+"px",top:(iRH-6)+"px"});
		//
		// corner:	tl,tr,br,bl	0,1,2,3
		$("div.handle:eq(0)").css({left:(iCX-6)+"px",top:(iCY-6)+"px"});
		$("div.handle:eq(1)").css({left:(iCX+iCW-6)+"px",top:(iCY-6)+"px"});
		$("div.handle:eq(2)").css({left:(iCX+iCW-6)+"px",top:(iCY+iCH-6)+"px"});
		$("div.handle:eq(3)").css({left:(iCX-6)+"px",top:(iCY+iCH-6)+"px"});
		//
		// side:	t,r,b,l		4,5,6,7
		$("div.handle:eq(4)").css({left:(iCX+iCW/2-6)+"px",top:(iCY-6)+"px"});
		$("div.handle:eq(5)").css({left:(iCX+iCW-6)+"px",top:(iCY+iCH/2-6)+"px"});
		$("div.handle:eq(6)").css({left:(iCX+iCW/2-6)+"px",top:(iCY+iCH-6)+"px"});
		$("div.handle:eq(7)").css({left:(iCX-6)+"px",top:(iCY+iCH/2-6)+"px"});
		//
		// set form
		var fScl = iRzsW/oFile.width;
		$("form#sfbsize input[name=rszW]").val(Math.round(iRzsW));
		$("form#sfbsize input[name=rszH]").val(Math.round(iRzsH));
		$("form#sfbsize input[name=crpX]").val(Math.round(iCrpX));
		$("form#sfbsize input[name=crpY]").val(Math.round(iCrpY));
		$("form#sfbsize input[name=crpW]").val(Math.round(iCrpW));
		$("form#sfbsize input[name=crpH]").val(Math.round(iCrpH));
	}
	function resizeSend() {
		trace("sfb resizeSend");
		var iW = $("form#sfbsize input[name=rszW]").val();
		var iH = $("form#sfbsize input[name=rszH]").val();
		var iCX = $("form#sfbsize input[name=crpX]").val();
		var iCY = $("form#sfbsize input[name=crpY]").val();
		var iCW = $("form#sfbsize input[name=crpW]").val();
		var iCH = $("form#sfbsize input[name=crpH]").val();
		if (iW==oFile.width&&iH==oFile.height&&iCW==oFile.width&&iCH==oFile.height) {
			trace("sfb Will not resize to same size.");
		} else {
			trace("sfb Sending resize request...");
			$.ajax({type:"POST", url:sConnector, data:"a=bar&folder="+aPath.join("")+"&file="+oFile.file+"&w="+iW+"&h="+iH+"&cx="+iCX+"&cy="+iCY+"&cw="+iCW+"&ch="+iCH, dataType:"json", success:function(data, status){
				if (typeof(data.error)!="undefined") {
					if (data.error!="") {
						trace(lang(data.error));
						alert(lang(data.error));
					} else {
						oFile.width  = iCW;
						oFile.height = iCH;
//						for (var s in oFile) trace(s+": "+String(oFile[s]).split("\n")[0]);
						oFile.tr.find("td:eq(4)").attr("abbr",iCW*iCH).text(iCW+" x "+iCH+" px");
						// preview
						var mPrv = $("#fbpreview").clone(true);
						$("#fbpreview").html("");
						$("#fbpreview").html(mPrv.children())
						//
						$("#sfbimgresize").hide();
						$("#winbrowser").show();
						resizeWindow();
					}
				}
			}});
		}
	}
})(jQuery);