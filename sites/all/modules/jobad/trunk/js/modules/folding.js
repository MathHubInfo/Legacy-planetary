_newModule({
   
   info  : {
      'identifier'   : 'folding',
      'title'        : 'Folding',
      'author'       : 'Stefan Mirea, Catalin David, Alexandru Toader',
      'description'  : '',
	  'dependencies' : []
   },
   
   options  : {},
   
   validate : (function(){

         
      return function( event, container ){
         var target = event.target;
		
	   var outputFold = {};     
	    $.extend( outputFold, tContextMenu.templates.moduleOutput, {
            element     : tContextMenu.emptyElement(),
            text        : 'Fold',
            description : 'Fold object',
			icon        : 'js/modules/icons/module1.png',
		    smallIcon   : 'js/modules/icons/module1_small.png',
            weight      : 50
            });
         
		 
		var outputUnfold = {};
         $.extend( outputUnfold, tContextMenu.templates.moduleOutput, {
            element     : tContextMenu.emptyElement(),
            text        : 'Unfold',
            description : 'Unfold object',
			icon        : 'js/modules/icons/module1.png',
			smallIcon   : 'js/modules/icons/module1_small.png',
            weight      : 50
         });
		var outputUnfoldAll = {};
         $.extend( outputUnfoldAll, tContextMenu.templates.moduleOutput, {
            element     : tContextMenu.emptyElement(),
            text        : 'Unfold All',
            description : 'Unfold ',
            icon        : 'js/modules/icons/module1.png',
            smallIcon   : 'js/modules/icons/module1_small.png',
            weight      : 50
         });
		
		
		 outputFold.element.bind( 'click.switchViews', function(){
                  tContextMenu.hide(
                     function( view ){ tContextMenu.setView( view ); },
                     [ $(this).data('identifier') ]
                  );
            });
		outputUnfold.element.bind( 'click.switchViews', function(){
                  tContextMenu.hide(
                     function( view ){ tContextMenu.setView( view ); },
                     [ $(this).data('identifier') ]
                  );
            });
		outputUnfoldAll.element.bind( 'click.switchViews', function(){
                  tContextMenu.hide(
                     function( view ){ tContextMenu.setView( view ); },
                     [ $(this).data('identifier') ]
                  );
            });

		outputUnfold.element.bind('click', function(){
		var object = target;
		var isInMaction = checkMathMLEncapsulation("maction", object);
		while ((getTagName(object) != "math") && (isInMaction)) {
			if ($(object).closest("maction").attr("actiontype") == "folding") {
				$(object).closest("maction").attr("selection", "1");
				return;
			}
			else {
				object = $(object).closest("maction").parent().get(0);
				isInMaction = checkMathMLEncapsulation("maction", object);
				// this should be sufficient, but it didn't work so I added the following code
				if (isInMaction == false) {
					return;
				}	
			}
		}
		});	
		 outputFold.element.bind('click',function(){
          var obj = target;
          var cnt = getFirstMrowOrEquivalent(obj);
		  var isInMaction = checkMathMLEncapsulation("maction", obj);
		  
		if (isInMaction == true && $(obj).closest("maction").attr("actiontype") == "folding") {
			if ($(obj).closest("maction").attr('selection') == 1) { // unfolded version. fold
				$(obj).closest("maction").attr('selection', '2');
				return null;
			}
			else {//folded version -- unfold
				$(obj).closest("maction").attr('selection', '1');
				return null;
			}
		}	
        if (getTagName(cnt) != 'math') { //so, we got an mrow/mfrac w/e, put the thing in an maction
			var ma = createMactionElement("…", "folding", cnt);
            ma.parentNode.setAttribute("selection", "2");
        } 
		else {//the folded child is a direct child of math -- take everything in math, put it in an MROW, put the mrow in an MACTION, replace the content of MATH with MACTION 
              var obj = cnt.cloneNode(true);
              //put everything in an MROW   
              var mr = document.createElementNS(NS_MATHML, 'mrow');
              for (var i = 0; i < obj.childNodes.length; i++) {
                  mr.appendChild(obj.childNodes[i].cloneNode(true));
              }
              //then put it in an MACTION type=folding
            var ma = document.createElementNS(NS_MATHML, 'maction');
            ma.setAttribute('actiontype', "folding");
            ma.setAttribute('selection', '2');
            ma.appendChild(mr);
            appendMathMLChild("mi", "...", ma);
            //delete all the existing nodes
            while (cnt.childNodes.length > 0) 
                cnt.removeChild(cnt.childNodes[0]);
              //append the maction to the MATH element
            cnt.appendChild(ma);
        }
	 });
	 
		 outputUnfoldAll.element.bind('click', function(){
		var obj = $(target).closest("maction")[0];
		var result = document.evaluate('.//mathml:maction[@actiontype="folding"] | .', obj, nsResolver, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
		for (i = 0; i < result.snapshotLength; i++) {
			var res = result.snapshotItem(i);
			if ($(res).attr('selection') == "2") {
				$(res).attr('selection', "1");
			}
		}
		});
		
		
		if (checkMathMLEncapsulation('math', target)) {
        //code taken from foldingServiceSupportCheck and adapted
		  var returnValue = false; //default value
          var obj = target; // replace with target OR current selection
          var isInMaction = checkMathMLEncapsulation("maction", obj);
          if (isInMaction == true) {
              if ($(obj).closest("maction").attr("actiontype") == "folding") { //already folded
                  if ($(obj).closest("maction").attr('selection') == 1) { // unfolded version. return fold
                      return outputFold;
                  }
                  else {//folded version -- return unfold
                      var result = document.evaluate('//mathml:maction[@actiontype="folding"]', $(target).closest("maction")[0], nsResolver, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);//FIXME ask for maction only
                      if (result.snapshotLength > 1)
					return [outputUnfoldAll, outputUnfold];
					return outputUnfold;
                  }
              }
              else {
                  return outputUnfold;
              }
          }
          else {
              return outputFold;
          }
          return null;
      }
	   else {
        return null;
      }
    }
	
	
	 /** 
      * nsResolver - function that resolves which prefix (usually in an XPath query) corresponds to which namespace
      *
      * @param prefix : a string value of the prefix to be resolved
      * @returns the corresponding namespace or null if prefix undefined
      */
      function nsResolver(prefix){
          var ns = {
              'xhtml': 'http://www.w3.org/1999/xhtml',
              'mathml': 'http://www.w3.org/1998/Math/MathML',
              'm': 'http://www.w3.org/1998/Math/MathML',
              'openmath': 'http://www.openmath.org/OpenMath',
              'omdoc': 'http://omdoc.org/ns',
              'jobad': 'http://omdoc.org/presentation'
          };
          return ns[prefix] || null;
      }
 
 })()
   
});
