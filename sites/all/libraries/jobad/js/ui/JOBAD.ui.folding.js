/*
    JOBAD 3 UI Functions
    JOBAD.ui.folding.js
        
    Copyright (C) 2013 KWARC Group <kwarc.info>
    
    This file is part of JOBAD.
    
    JOBAD is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.
    
    JOBAD is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.
    
    You should have received a copy of the GNU General Public License
    along with JOBAD.  If not, see <http://www.gnu.org/licenses/>.
*/

//JOAD UI Folding Namespace
JOBAD.UI.Folding = {};

//Folding config
JOBAD.UI.Folding.config = {
    "placeHolderHeight": 50, //height of the place holder
    "placeHolderContent": "<p>Click to unfold me. </p>" //jquery ish stuff in the placeholder; ignored for livePreview mode. 
}

/*
    Enables folding on an element
    @param element      Element to enable folding on. 
    @param config       Configuration. 
        config.enable       Callback on enable. 
        config.autoFold     Fold on init? Default: false. 
        config.disable      Callback on disable
        config.fold         Callback on folding
        config.unfold       Callback on unfold
        config.stateChange  Callback on state change. 
        config.align        Alignment of the folding. Either 'left' (default) or 'right'.  
        config.update       Called every time the folding UI is updated. 
        config.height       Height fo the preview / replacement element. Leave empyt to assume default. 
        config.livePreview  Enable livePreview, shows a preview of the element instead of a replacement div. Default: false. 
        config.preview      String or function which describes the element(s). Will be used as preview text. Optional. 
*/

JOBAD.UI.Folding.enable = function(e, c){

    var results = JOBAD.refs.$(e).each(function(i, element){
        var element = JOBAD.refs.$(element);

        //check if we are already enabled
        if(element.data("JOBAD.UI.Folding.enabled")){
            JOBAD.console.log("Can't enable folding on element: Folding already enabled. ");
            return;
        }

        var config = JOBAD.util.clone(JOBAD.util.defined(c));
        var went_deeper = false; 

        if(typeof config == "undefined"){
            config = {};
        }

        //normalise config properties
        config.autoFold = (typeof config.autoFold == 'boolean')?config.autoFold:false;
        config.autoRender = JOBAD.util.forceBool(config.autoRender, true);
        config.enable = (typeof config.enable == 'function')?config.enable:function(){};
        config.disable = (typeof config.disable == 'function')?config.disable:function(){};
        config.fold = (typeof config.fold == 'function')?config.fold:function(){};
        config.unfold = (typeof config.unfold == 'function')?config.unfold:function(){};
        config.stateChange = (typeof config.stateChange == 'function')?config.stateChange:function(){};
        config.update = (typeof config.update == 'function')?config.update:function(){}
        config.align = (config.align == "right")?"right":"left";
        config.height = (typeof config.height == "number")?config.height:JOBAD.UI.Folding.config.placeHolderHeight;


        if(typeof config.preview == "undefined"){
            config.preview = function(){return JOBAD.UI.Folding.config.placeHolderContent;};
        } else {
            if(typeof config.preview !== "function"){
                //scope to keeo variables intatc
                (function(){
                    var old_preview = config.preview;
                    config.preview = function(){return old_preview; }
                })();
            }
        }

        config.livePreview = (typeof config.livePreview == "boolean")?config.livePreview:false;

        //Folding class
        var folding_class = "JOBAD_Folding_"+config.align;

        var wrapper = JOBAD.refs.$("<div class='JOBAD "+folding_class+" JOBAD_Folding_Wrapper'>");

        //spacing
        var spacer = JOBAD.refs.$("<div class='JOBAD "+folding_class+" JOBAD_Folding_Spacing'></div>").insertAfter(element);

        element.wrap(wrapper);
        wrapper = element.parent();

        //make the placeHolder
        var placeHolder = JOBAD.refs.$("<div class='JOBAD "+folding_class+" JOBAD_Folding_PlaceHolder'>")
        .prependTo(wrapper)
        .height(JOBAD.UI.Folding.config.placeHolderHeight)
        .hide().click(function(){
            JOBAD.UI.Folding.unfold(element);
        }); //prepend and hide me
        

        var container = JOBAD.refs.$("<div class='JOBAD "+folding_class+" JOBAD_Folding_Container'>")
        .prependTo(wrapper)
        .on("contextmenu", function(e){
            return (e.ctrlKey);
        });

        wrapper
        .data("JOBAD.UI.Folding.state", JOBAD.util.forceBool(element.data("JOBAD.UI.Folding.state"), config.autoFold))
        .data("JOBAD.UI.Folding.update", function(){
            JOBAD.UI.Folding.update(element);
        })
        .on("JOBAD.UI.Folding.fold", function(event){
            event.stopPropagation();
            //fold me
            wrapper.data("JOBAD.UI.Folding.state", true);
            //trigger event
            config.fold(element);
            config.stateChange(element, true);
            JOBAD.UI.Folding.update(element);
        })
        .on("JOBAD.UI.Folding.unfold", function(event){
            event.stopPropagation();
            //unfold me
            wrapper.data("JOBAD.UI.Folding.state", false);
            //trigger event
            config.unfold(element);
            config.stateChange(element, false);
            JOBAD.UI.Folding.update(element);
        })
        .on("JOBAD.UI.Folding.update", config.livePreview?
        function(event){

            event.stopPropagation();

            element
            .unwrap()


            JOBAD.util.markHidden(element);

            container
            .css("height", "")

            if(wrapper.data("JOBAD.UI.Folding.state")){
                element
                .wrap(
                    JOBAD.refs.$("<div style='overflow: hidden; '>").css("height", config.height)
                );

                //we are folded
                container.removeClass("JOBAD_Folding_unfolded").addClass("JOBAD_Folding_folded");
            } else {
                element.wrap("<div style='overflow: hidden; '>");
                

                //mark me visible
                JOBAD.util.markDefault(element);

                //we are unfolded
                container.removeClass("JOBAD_Folding_folded").addClass("JOBAD_Folding_unfolded");
            }

            //reset height
            container
            .height(wrapper.height());

            config.update();
        }
        :
        function(event){
            //we dont have life preview; fallback to the old stuff. 
            //reset first

            element.parent().show()
            .end().show();

            //hide me. 
            JOBAD.util.markHidden(element);

            container
            .css("height", "")


            if(wrapper.data("JOBAD.UI.Folding.state")){
                //hide the element again
                element.parent().hide()
                .end().hide();

                //adjust placeholder height
                placeHolder.height(config.height)
                .show()

                JOBAD.util.markHidden(placeHolder); //hide it from JOBAD

                //append stuff to the placeholder
                placeHolder.empty().append(
                    config.preview(element)
                )

                //we are folded
                container.removeClass("JOBAD_Folding_unfolded").addClass("JOBAD_Folding_folded");
            } else {
                //we are going back to the normal state
                //hide the placeholder
                placeHolder.hide();

                //we are unfolded
                container.removeClass("JOBAD_Folding_folded").addClass("JOBAD_Folding_unfolded");

                //mark me visible
                JOBAD.util.markDefault(element);
            }

            container
            .height(wrapper.height());

            config.update();
        });

        container
        .add(spacer)
        .click(function(event){
            //fold or unfold goes here
            if(wrapper.data("JOBAD.UI.Folding.state")){
                JOBAD.UI.Folding.unfold(element);
            } else {
                JOBAD.UI.Folding.fold(element);
            }
        });

        element
        .wrap("<div style='overflow: hidden; '>")
        .data("JOBAD.UI.Folding.wrappers", container.add(placeHolder).add(spacer))
        .data("JOBAD.UI.Folding.enabled", true)
        .data("JOBAD.UI.Folding.callback", config.disable)
        .data("JOBAD.UI.Folding.onStateChange", config.update)
        .data("JOBAD.UI.Folding.config", config);

        element.click(function(ev){
                //we are folded
                JOBAD.UI.Folding.unfold();       
                ev.stopPropagation();
        });

        config.enable(element);
    }); 

    JOBAD.UI.Folding.update(e); //update everythign at the ened

    return results; 
}


/*
    Updates a folded element. 
    @param element  Element to update folding on. 
*/

JOBAD.UI.Folding.updating = false; 

JOBAD.UI.Folding.update = function(elements){
    if(JOBAD.UI.Folding.updating){
        return false;
    } else {
        var elements = JOBAD.refs.$(elements);

        if(elements.length > 0){
            var updaters = elements.parents().filter("div.JOBAD_Folding_Wrapper");
        } else {
            var updaters = JOBAD.refs.$("div.JOBAD_Folding_Wrapper");
        }
        JOBAD.UI.Folding.updating = true;
        JOBAD.util.orderTree(updaters).each(function(){
                //trigger each one individually. 
                JOBAD.refs.$(this).trigger("JOBAD.UI.Folding.update");
            });
        JOBAD.UI.Folding.updating = false; 
        JOBAD.refs.$(window).trigger("JOBAD.UI.Folding.update");
        return true; 
    }
    
}

/*
    Folds an element. 
    @param element  Element to update folding on. 
*/
JOBAD.UI.Folding.fold = function(element){
    var element = JOBAD.refs.$(element);
    if(!element.data("JOBAD.UI.Folding.enabled")){
        JOBAD.console.log("Can't fold element: Folding not enabled. ");
        return false;
    }
    element.parent().parent().trigger("JOBAD.UI.Folding.fold");
    return true;
}

/*
    Unfolds an element
*/
JOBAD.UI.Folding.unfold = function(el){
    JOBAD.refs.$(el)
    .each(function(){
        var element = JOBAD.refs.$(this);
        if(!element.data("JOBAD.UI.Folding.enabled")){
            JOBAD.console.log("Can't unfold element: Folding not enabled. ");
        }
        element.parent().parent().trigger("JOBAD.UI.Folding.unfold");
    });
    
    return true;
}

/*
    Disables folding on an element
    @param element Element to disable folding on. 
    @param keep Keeps elements hidden if set to true. 
*/
JOBAD.UI.Folding.disable = function(element, keep){
    var element = JOBAD.refs.$(element);

    if(element.length > 1){
        var me = arguments.callee;
        return element.each(function(i, e){
            me(e);
        });
    }

    if(element.data("JOBAD.UI.Folding.enabled") !== true){
        JOBAD.console.log("Can't disable folding on element: Folding already disabled. ");
        return;
    }

    //store the state of the current hiding. 
    element.data("JOBAD.UI.Folding.state", element.data("JOBAD.UI.Folding.wrappers").eq(0).parent().data("JOBAD.UI.Folding.state")?true:false);


    //do we keep it hidden?
    if(keep?false:true){
        JOBAD.UI.Folding.unfold(element);
        JOBAD.util.markDefault(element); 
        element.removeData("JOBAD.UI.Folding.config"); //reset to default. 
    }
    
    //call event handlers
    element.data("JOBAD.UI.Folding.callback")(element);
    element.data("JOBAD.UI.Folding.onStateChange")(element);

    //remove unneccesary elements. 
    element.data("JOBAD.UI.Folding.wrappers").remove();

    //remove any overlays. 
    JOBAD.UI.Overlay.undraw(element.parent());

    //clear up the last stuff
    element
    .unwrap()
    .unwrap()
    .removeData("JOBAD.UI.Folding.callback")
    .removeData("JOBAD.UI.Folding.onStateChange")
    .removeData("JOBAD.UI.Folding.enabled")
    .removeData("JOBAD.UI.Folding.wrappers");

    return element;
}
/*
    Checks if an element is foldable. 
    @param  element element to check. 
*/
JOBAD.UI.Folding.isFoldable = function(element){
    return JOBAD.util.closest(element, function(e){
        return e.data("JOBAD.UI.Folding.enabled");
    }).length > 0;
}
/*
    Shows this element if it is folded.
*/
JOBAD.UI.Folding.show = function(element){
    return JOBAD.refs.$(element).each(function(){
        var folded = JOBAD.refs.$(this).parents().add(JOBAD.refs.$(this)).filter(function(){
            var me = JOBAD.refs.$(this);
            return me.data("JOBAD.UI.Folding.enabled")?true:false;
        });

        window.folded = folded;

        if(folded.length > 0){
            JOBAD.UI.Folding.unfold(folded.get().reverse()); //unfold
         }
    });
}