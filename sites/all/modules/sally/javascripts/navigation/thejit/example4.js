var labelType, useGradients, nativeTextSupport, animate;
var is_init = 0;
var oldCenter = null;
var oldColor;

(function() {
  var ua = navigator.userAgent,
      iStuff = ua.match(/iPhone/i) || ua.match(/iPad/i),
      typeOfCanvas = typeof HTMLCanvasElement,
      nativeCanvasSupport = (typeOfCanvas == 'object' || typeOfCanvas == 'function'),
      textSupport = nativeCanvasSupport 
        && (typeof document.createElement('canvas').getContext('2d').fillText == 'function');
  //I'm setting this based on the fact that ExCanvas provides text support for IE
  //and that as of today iPhone/iPad current text support is lame
  labelType = (!nativeCanvasSupport || (textSupport && !iStuff))? 'Native' : 'HTML';
  nativeTextSupport = labelType == 'Native';
  useGradients = nativeCanvasSupport;
  animate = !(iStuff || !nativeCanvasSupport);
})();

var parseURL = function(id) {
	var aux = id.substring(id.lastIndexOf("/") + 1);
	var cd = aux.substring(0, aux.indexOf(".omdoc"));
	var name = aux.substring(aux.indexOf("#") + 1, aux.lastIndexOf(".def"));
	return cd + "/" + name;
};


var Log = {
  elem: false,
  write: function(text){
    if (!this.elem) 
      this.elem = document.getElementById('log');
    this.elem.innerHTML = text;
    this.elem.style.left = (500 - this.elem.offsetWidth / 2) + 'px';
  }
};


JSON.stringify = JSON.stringify ||
function(obj) {
	var t = typeof (obj);
	if (t != "object" || obj === null) {
		// simple data type
		if (t == "string")
			obj = '"' + obj + '"';
		return String(obj);
	} else {
		// recurse array or object
		var n, v, json = [], arr = (obj && obj.constructor == Array);
		for (n in obj) {
			v = obj[n];
			t = typeof (v);
			if (t == "string")
				v = '"' + v + '"';
			else if (t == "object" && v !== null)
				v = JSON.stringify(v);
			json.push(( arr ? "" : '"' + n + '":') + String(v));
		}
		return ( arr ? "[" : "{") + String(json) + ( arr ? "]" : "}");
	}
};




function init(js) {
	// init data
	var txt = document.getElementById("codebox");
	var json = "";
	if (!js && txt)
		json = jQuery.parseJSON(txt.value);
	else
		json = js;
	// end

	var infovis = document.getElementById('infovis');
	var w = infovis.offsetWidth - 50, h = infovis.offsetHeight - 50;

	// init hypertree
	var rgraph = new $jit.RGraph({
        //Where to append the visualization
        injectInto: 'infovis',
        //Optional: create a background canvas that plots
        //concentric circles.
        background: {
          CanvasStyles: {
            strokeStyle: '#555'
          }
        },
        //Add navigation capabilities:
        //zooming by scrolling and panning.
        Navigation: {
          enable: true,
          panning: 'avoid nodes',
          zooming: 10
        },
        //Set Node and Edge styles.
        Node : {
			overridable : true,
			type : "ellipse",
			height : 15,
			width : 15,
			color : "#C0C0C0"
		},
		Edge : {
			overridable : true,
			 color: '#C17878',
			lineWidth : 2,
			type : 'arrow'
		},
        
        //Add the name of the node in the correponding label
        //and a click handler to move the graph.
        //This method is called once, on label creation.
       onCreateLabel : function(domElement, node) {

			//add some styles to the node label
			var style = domElement.style;
			domElement.id = node.id;
			style.color = '#fff';
			style.fontSize = '0.8em';
			style.textAlign = 'center';
			style.width = "60px";
			style.height = "24px";
			style.paddingTop = "0px";
			style.cursor = 'pointer';
			domElement.innerHTML = node.name;
				domElement.onclick = function() {
				//http://localhost/drupal_planetary/index.php?q=sally/json/timeinterval/timeinterval
				$.getJSON("http://localhost/drupal_planetary/index.php?q=sally/services/json/"+ parseURL(node.id), function(data) {
					rgraph.op.sum(data, {
						'type' : 'fade:con',
						duration : 1500, // What does this do?
						hideLabels : false,
						onComplete : function() {							
							//Current center is green, old one returns to red, we refresh the tree so that the changes take effect
							rgraph.refresh();
						},
					});
				});
			};
		},

		//Ths method is called when moving/placing a label.
		//Add label styles based on their position.
      onPlaceLabel: function(domElement, node){
            var style = domElement.style;
            style.display = '';
            style.cursor = 'pointer';
        }
    });
    

	rgraph.canvas.translate(0,-290)
 //load JSON data
    rgraph.loadJSON(json);
    //trigger small animation
    rgraph.graph.eachNode(function(n) {
      var pos = n.getPos();
      pos.setc(-200, -200);
    });
    rgraph.compute('end');
    rgraph.fx.animate({
      modes:['polar'],
      duration: 2000
    });
    //end
}
