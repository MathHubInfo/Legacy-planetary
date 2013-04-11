
var labelType, useGradients, nativeTextSupport, animate;

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


/** 
* Used to wrap the title, dependency, value, iterator, definition and formula objects in HTML
*/
function createHTML(title, dependency, value, iterator, definition, formula){
return ("<div class=nodes><div class=title>"+
		"<span class=title-text>"+title+"</span></br>"+
		 "<span class=title-dependency>"+dependency+ "</span>"+
	"</div>"+
	"<div class=cell-container>"+
		"<div class=value-container>"+
			"<div class=cell-value>"+value+
			"</div>"+
		"</div>"+
		"<div class=cell-iterator>"+
		iterator+
		"</div>"+
	"</div>"+
	"<div class=definition-container>"+
		"<div class =definition>"+
		definition+
		"</div>"+
	"</div>"+
	"<div class=formula-container>"+
		"<div class=formula>"+
		formula+
		"</div></div>");
}

/*
* Initialize the spacetree
*/
function init(json){
	alert(json);
	alert("YES");
	try{
	json = JSON.parse(json);
	}catch(e){
	alert(e);
	}
    //init data
	/*
	var strVar='<div xmlns="http://www.w3.org/1999/xhtml" xmlns:krextor="http://kwarc.info/projects/krextor" id="sax-salarycostsperti-projected.def" class="omdoc-definition"> <span class="omdoc-statement-header"> <span class="omdoc-definition-number">1</span> <span class="omdoc-reference-for" href="sax-salarycostsperti-projected">sax-salarycostsperti-projected</span> </span> <span class="omdoc-statement-content"> <p xmlns:omdoc="http://omdoc.org/ns" xmlns:stex="http://kwarc.info/ns/sTeX" id="sax-salarycostsperti-projected.def.CMP1.p1" class="p" about="#sax-salarycostsperti-projected.def.CMP1.p1"> <span class="omdoc-definiendum">Projected salary costs</span> are those<span omdoc:cd="sax-salarycosts" omdoc:name="sax-salarycostsperti" class="omdoc-term">salary costs</span> that are projectedwith <span omdoc:cd="SemAnteX" omdoc:name="sax" class="omdoc-term">SemAnteX</span>’s<span omdoc:cd="sax-prognosis" omdoc:name="sax-prognosisperti" class="omdoc-term">prognosis function for salary costs</span>, which is</p> <table xmlns:omdoc="http://omdoc.org/ns" xmlns:stex="http://kwarc.info/ns/sTeX" class="equation"> <tr id="S0.Ex1" class="equation baseline"> <td class="eqpad" /> <td class="center" colspan="1"> <math xmlns:m="http://www.w3.org/1998/Math/MathML" id="MCRd3431e20"> <semantics> <mrow xref="#a48b6d1f0-816f-11e2-8e99-00163e5d3aec"> <maction xmlns:o="http://omdoc.org/ns" actiontype="elision" o:elevel="300" o:egroup="fence"> <mspace /> <mo o:egroup="fence" fence="true" o:elevel="300">(</mo> </maction> <mrow xref="#a48b6d1f0-816f-11e2-8e99-00163e5d3aec-arg1"> <msubsup xref="#a48b6d1f0-816f-11e2-8e99-00163e5d3aec-arg1-fun"> <mi>c</mi> <mtext>salary</mtext> <mi>p</mi> </msubsup> <mrow> <mo fence="true">(</mo> <mi xref="#a48b6d1f0-816f-11e2-8e99-00163e5d3aec-arg1-arg1">t</mi> <mo fence="true">)</mo> </mrow> </mrow> <mo xref="#a48b6d1f0-816f-11e2-8e99-00163e5d3aec-fun">=</mo> <mrow xref="#a48b6d1f0-816f-11e2-8e99-00163e5d3aec-arg2"> <maction xmlns:o="http://omdoc.org/ns" actiontype="elision" o:elevel="300" egroup="fence"> <mspace /> <mo egroup="fence" fence="true" o:elevel="300">(</mo> </maction> <mrow xref="#a48b6d1f0-816f-11e2-8e99-00163e5d3aec-arg2-args-arg1"> <maction xmlns:o="http://omdoc.org/ns" actiontype="elision" o:elevel="0" egroup="fence"> <mspace /> <mo egroup="fence" fence="true" o:elevel="0">(</mo> </maction> <msub id="cvar.0g"> <mi id="cvar.0a">k</mi> <mrow id="cvar.0f"> <mi id="cvar.0aa">s</mi> <mo id="cvar.0b">â?¢</mo> <mi id="cvar.0c">a</mi> <mo id="cvar.0d">â?¢</mo> <mi id="cvar.0e">l</mi> </mrow> </msub> <mo xref="#a48b6d1f0-816f-11e2-8e99-00163e5d3aec-arg2-args-arg1-fun1">/</mo> <mn xref="#a48b6d1f0-816f-11e2-8e99-00163e5d3aec-arg2-args-arg1-arg21">3</mn> <maction xmlns:o="http://omdoc.org/ns" actiontype="elision" o:elevel="0" egroup="fence"> <mspace /> <mo egroup="fence" fence="true" o:elevel="0">)</mo> </maction> </mrow> <maction xmlns:o="http://omdoc.org/ns" actiontype="elision" o:elevel="300" egroup="fence"> <mspace /> <mo egroup="fence" fence="true" o:elevel="300">)</mo> </maction> </mrow> <maction xmlns:o="http://omdoc.org/ns" actiontype="elision" o:elevel="300" o:egroup="fence"> <mspace /> <mo o:egroup="fence" fence="true" o:elevel="300">)</mo> </maction> </mrow> <annotation-xml> <om:OMA xmlns:om="http://www.openmath.org/OpenMath" id="a48b6d1f0-816f-11e2-8e99-00163e5d3aec"> <om:OMS cd="relation1" name="eq" id="a48b6d1f0-816f-11e2-8e99-00163e5d3aec-fun" /> <om:OMA id="a48b6d1f0-816f-11e2-8e99-00163e5d3aec-arg1"> <om:OMS cd="sax-salarycosts-projected" name="sax-salarycostsperti-projected" id="a48b6d1f0-816f-11e2-8e99-00163e5d3aec-arg1-fun" /> <om:OMV name="t" id="a48b6d1f0-816f-11e2-8e99-00163e5d3aec-arg1-arg1" /> </om:OMA> <om:OMA id="a48b6d1f0-816f-11e2-8e99-00163e5d3aec-arg2"> <om:OMS cd="arithmetics" name="times" /> <om:OMA id="a48b6d1f0-816f-11e2-8e99-00163e5d3aec-arg2-args-arg1"> <om:OMS cd="arithmetics" name="adivide" id="a48b6d1f0-816f-11e2-8e99-00163e5d3aec-arg2-args-arg1-fun1" /> <om:OMATTR id="a48b6d1f0-816f-11e2-8e99-00163e5d3aec-arg2-args-arg1-arg11" id="cvar.0.om"> <om:OMATP> <om:OMS cd="OMPres" name="PMML" /> <om:OMFOREIGN> <msub id="cvar.0g"> <mi id="cvar.0a">k</mi> <mrow id="cvar.0f"> <mi id="cvar.0aa">s</mi> <mo id="cvar.0b">â?¢</mo> <mi id="cvar.0c">a</mi> <mo id="cvar.0d">â?¢</mo> <mi id="cvar.0e">l</mi> </mrow> </msub> </om:OMFOREIGN> </om:OMATP> <om:OMV name="name.cvar.0" /> </om:OMATTR> <om:OMI id="a48b6d1f0-816f-11e2-8e99-00163e5d3aec-arg2-args-arg1-arg21">3</om:OMI> </om:OMA> </om:OMA> </om:OMA> </annotation-xml> </semantics> </math> </td> <td class="eqpad" /> </tr> </table> <p xmlns:omdoc="http://omdoc.org/ns" xmlns:stex="http://kwarc.info/ns/sTeX" id="sax-salarycostsperti-projected.def.CMP1.p3" class="p" about="#sax-salarycostsperti-projected.def.CMP1.p3">where <math xmlns:m="http://www.w3.org/1998/Math/MathML" id="MCRd3431e118"> <semantics> <mrow xref="#a48b7e360-816f-11e2-8e99-00163e5d3aec"> <maction xmlns:o="http://omdoc.org/ns" actiontype="elision" o:elevel="300" o:egroup="fence"> <mspace /> <mo o:egroup="fence" fence="true" o:elevel="300">(</mo> </maction> <msub id="cvar.1g"> <mi id="cvar.1a">k</mi> <mrow id="cvar.1f"> <mi id="cvar.1aa">s</mi> <mo id="cvar.1b">â?¢</mo> <mi id="cvar.1c">a</mi> <mo id="cvar.1d">â?¢</mo> <mi id="cvar.1e">l</mi> </mrow> </msub> <mo xref="#a48b7e360-816f-11e2-8e99-00163e5d3aec-fun">=</mo> <mn xref="#a48b7e360-816f-11e2-8e99-00163e5d3aec-arg2">1.6409</mn> <maction xmlns:o="http://omdoc.org/ns" actiontype="elision" o:elevel="300" o:egroup="fence"> <mspace /> <mo o:egroup="fence" fence="true" o:elevel="300">)</mo> </maction> </mrow> <annotation-xml> <om:OMA xmlns:om="http://www.openmath.org/OpenMath" id="a48b7e360-816f-11e2-8e99-00163e5d3aec"> <om:OMS cd="relation1" name="eq" id="a48b7e360-816f-11e2-8e99-00163e5d3aec-fun" /> <om:OMATTR id="a48b7e360-816f-11e2-8e99-00163e5d3aec-arg1" id="cvar.1.om"> <om:OMATP> <om:OMS cd="OMPres" name="PMML" /> <om:OMFOREIGN> <msub id="cvar.1g"> <mi id="cvar.1a">k</mi> <mrow id="cvar.1f"> <mi id="cvar.1aa">s</mi> <mo id="cvar.1b">â?¢</mo> <mi id="cvar.1c">a</mi> <mo id="cvar.1d">â?¢</mo> <mi id="cvar.1e">l</mi> </mrow> </msub> </om:OMFOREIGN> </om:OMATP> <om:OMV name="name.cvar.1" /> </om:OMATTR> <om:OMF dec="1.6409" id="a48b7e360-816f-11e2-8e99-00163e5d3aec-arg2" /> </om:OMA> </annotation-xml> </semantics> </math> </p> </span></div>';
	var formula= "<math xmlns='http://www.w3.org/1998/Math/MathML'> <mrow>  <mi>prRev</mi>  <mo>-</mo>  <mi>prExp</mi> </mrow></math>";
	var json = {
	id:"node01",
	name:"node01",
	data:{title:"Projected Profit", 
		dependency:"Year", 
		value:"1.573", 
		iterator:"1987",
		definition:strVar,
		formula:formula	},
	children:[ {
    id:"node09",
    name:"node01",
    data:{title:"Projected Profit", 
        dependency:"Year", 
        value:"1.573", 
        iterator:"1987",
        definition:strVar,
        formula:formula },
    children:[]
    },{
    id:"node07",
    name:"node01",
    data:{title:"Projected Profit", 
        dependency:"Year", 
        value:"1.573", 
        iterator:"1987",
        definition:strVar,
        formula:formula },
    children:[]
    }, {
    id:"node03",
    name:"node01",
    data:{title:"Projected Profit", 
        dependency:"Year", 
        value:"1.573", 
        iterator:"1987",
        definition:strVar,
        formula:formula },
    children:[]
    },{
    id:"node02",
    name:"node02",
    data:{title:"Projected Profit", 
        dependency:"Year", 
        value:"1.573", 
        iterator:"1987",
        definition:strVar,
        formula:formula },
    children:[
    {
    id:"node03",
    name:"node01",
    data:{title:"Projected Profit", 
        dependency:"Year", 
        value:"1.573", 
        iterator:"1987",
        definition:strVar,
        formula:formula },
    children:[]
    },  {
    id:"node04",
    name:"node01",
    data:{title:"Projected Profit", 
        dependency:"Year", 
        value:"1.573", 
        iterator:"1987",
        definition:strVar,
        formula:formula },
    children:[ {
    id:"node10",
    name:"node01",
    data:{title:"Projected Profit", 
        dependency:"Year", 
        value:"1.573", 
        iterator:"1987",
        definition:strVar,
        formula:formula },
    children:[ {
    id:"node11",
    name:"node01",
    data:{title:"Projected Profit", 
        dependency:"Year", 
        value:"1.573", 
        iterator:"1987",
        definition:strVar,
        formula:formula },
    children:[]
    }]
    }]
    }]
    }]
	}
	*/
	    //end
    //init Spacetree
    //Create a new ST instance
    var st = new $jit.ST({
    
        //id of viz container element
        injectInto: 'infovis',
        width: 999,
        height: 600,
        //set duration for the animation
        duration: 50,
        //set animation transition type
        transition: $jit.Trans.Quart.easeInOut,
        //set distance between node and its children
        levelDistance: 75,
        levelsToShow : 1000,
        offsetY: 200,  
        //enable panning
        Navigation: {
          enable:true, 
          panning:true,
        },
        //set node and edge styles
        //set overridable=true for styling individual
        //nodes or edges
        Node: {
            height: 85, //approximate height of the node
            width: 220, //approximate width of the node
            type: 'rectangle',  
            color: '#1A1A1A',
            overridable: true
        },
        
        Edge: {
            type: 'bezier',
            overridable: true
        },
        
        //This method is called on DOM label creation.
        //Use this method to add event handlers and styles to
        //your node.
        onCreateLabel: function(label, node){
            label.id = node.id;            
            label.innerHTML = /*createHTML("alabalaalabalaalabalaalabalaalabalaalabalaala balaalabalaalabalaalabalaalabalaalabalaalabala	alabalaalabalaalabalaalabalaalabalaalabalaalab		alaalabalaalabalaalabalaalab		alaalabalaalabalaalabalaalabalaalabalaalabala",
			"bla","bla","bla","bla","bla");*/
			createHTML(node.data.title, node.data.fblock, node.data.value, node.data.row, node.data.definition, node.data.formula);
            label.onclick = function(){
            	if(normal.checked) {
            	  st.onClick(node.id);
            	} else {
                st.setRoot(node.id, 'animate');
            	}
            };
            //set label styles
            var style = label.style;
            style.width = 100 + 'px';
            style.height = 100 + 'px';            
            style.cursor = 'pointer';
            style.fontSize = '0.8em';
            style.textAlign= 'center';
            style.paddingTop = '3px';
        },
        
    });
 
    //load json data
    st.loadJSON(json);
    //compute node positions and layout
    st.compute();
    //emulate a click on the root node.
    st.onClick(st.root);

    //end    

        st.switchPosition("top",  "replot", {  
});    
    
}
