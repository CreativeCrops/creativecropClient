/* Previously when the freeze property of the popover was false it was getting bound to the parent 
element of the origin element istead of getting bound to the body. So there was a problem with the 
calculation of top and left. Now it is bound to the body to solve that problem.*/

/*------------------------   NOTES   ------------------------*/
/*
  Things needed to document:
  1. Added onResize callback to be called on resize event being triggered
  2. Added onScroll callback to be called on resize event being triggered
  3. ltPropHeaderPadding
  4. ltPropContentPadding
  5. ltPropFooterPadding
  6. close popover on clicking freeze layer
*/
if(!LytePopup){
    var LytePopup = {
        components:[],
        onEscape : function(evt){
            evt = evt || window.event;
            var isEscape = false;
            if ("key" in evt) {
                isEscape = (evt.key == "Escape" || evt.key == "Esc");
            } else {
                isEscape = (evt.keyCode == 27);
            }
            if (isEscape) {
                LytePopup.closePopup(undefined,true);
            }
        },
        bindDocumentKeydown : function(){
            document.addEventListener('keydown',LytePopup.onEscape,true);
        },
        addPopup : function(component) {
            LytePopup.closePopup();
            var compLengh = LytePopup.components.length;
            if(compLengh>0){
                var prevZIndex = 0;
                var prePopup = '', thisPopup = '', thisFreeze = '';
                if(LytePopup.components[compLengh-1].$node.tagName == "LYTE-MODAL"){
                    prePopup = '.lyteModal';
                }
                else if(LytePopup.components[compLengh-1].$node.tagName == "LYTE-POPOVER"){
                    prePopup = '.lytePopover';
                }   
                else{
                    prePopup = '.alertPopup';
                }

                if(component.$node.tagName == "LYTE-MODAL"){
                    thisPopup = '.lyteModal';
                    thisFreeze = 'lyte-modal-freeze';
                }
                else if(component.$node.tagName == "LYTE-POPOVER"){
                    thisPopup = '.lytePopover';
                    thisFreeze = 'lyte-popover-freeze';
                }
                else{
                    thisPopup = '.alertPopup';
                    thisFreeze = '.alertFreezeLayer';
                }
                var node = LytePopup.components[compLengh-1].childComp.querySelector(prePopup);
                prevZIndex = Number(document.defaultView.getComputedStyle(node,null).getPropertyValue('z-index'));
                component.childComp.querySelector(thisPopup).style.zIndex = prevZIndex+2;
                if(component.$node.ltProp('freeze') && component.childComp.querySelector(thisFreeze)){
                    component.childComp.querySelector(thisFreeze).style.zIndex = prevZIndex+1;
                }
            }
            LytePopup.components[compLengh] = component;
        },
        closePopup : function(component,fromEscape){
            if(fromEscape){
                var lastPop = LytePopup.components[LytePopup.components.length-1];
                if(lastPop && lastPop.$node.ltProp("closeOnEscape")){
                    lastPop.$node.ltProp("show",false);
                }
            }
            else{
                if(component){
                    LytePopup.components.splice(LytePopup.components.indexOf(component),1);
                }
                else{
                    for(var i=LytePopup.components.length-1;i>=0;i--){
                        if(LytePopup.components[i].$node && !LytePopup.components[i].$node.ltProp("allowMultiple")){
                            LytePopup.components[i].$node.ltProp("show",false);
                        }
                    }
                }   
            }  
        }   
    };
    LytePopup.bindDocumentKeydown();
    
};

Lyte.Component.register("lyte-popover",{
_template:"<template tag-name=\"lyte-popover\">\t<template is=\"if\" value=\"{{ltPropBindToBody}}\"><template case=\"true\"> \t<lyte-wormhole case=\"true\" style=\"{{if(ltPropShowCopy,'visibility:visible','visibility:hidden')}}\">\t\t<template is=\"registerYield\" yield-name=\"lyte-content\">\t\t\t<div class=\"popoverWrapper {{ltPropWrapperClass}}\">\t\t\t\t<div class=\"lytePopover\">\t\t\t\t\t<span id=\"lytePopoverArrow\" class=\"lytePopoverArrowIcon\"></span>\t\t\t\t\t<template is=\"if\" value=\"{{ltPropShowCloseButton}}\">\t\t\t\t\t\t<template case=\"true\"><span class=\"lytePopoverClose\" onclick=\"{{action('close')}}\"></span></template>\t\t\t\t\t</template>\t\t\t\t\t<lyte-yield yield-name=\"popover\"></lyte-yield>\t\t\t\t</div>\t\t\t\t<template is=\"if\" value=\"{{ltPropFreeze}}\">\t\t\t\t\t<template case=\"true\"><lyte-popover-freeze></lyte-popover-freeze></template>\t\t\t\t</template>\t\t\t</div>\t\t</template>\t</lyte-wormhole>\t</template></template></template>",
_dynamicNodes : [{"type":"attr","position":[1]},{"type":"if","position":[1],"cases":{"true":{"dynamicNodes":[{"type":"attr","position":[1],"attr":{"style":{"name":"style","helperInfo":{"name":"if","args":["ltPropShowCopy","'visibility:visible'","'visibility:hidden'"]}}}},{"type":"registerYield","position":[1,1],"dynamicNodes":[{"type":"attr","position":[1]},{"type":"attr","position":[1,1,3]},{"type":"if","position":[1,1,3],"cases":{"true":{"dynamicNodes":[{"type":"attr","position":[0]}]}},"default":{}},{"type":"insertYield","position":[1,1,5]},{"type":"attr","position":[1,3]},{"type":"if","position":[1,3],"cases":{"true":{"dynamicNodes":[{"type":"componentDynamic","position":[0]}]}},"default":{}}]},{"type":"componentDynamic","position":[1]}]}},"default":{}}],
_observedAttributes :["ltPropShow","ltPropType","ltPropFreeze","ltPropShowCloseButton","ltPropCloseOnEscape","ltPropOriginElem","ltPropPosition","ltPropPlacement","ltPropScrollable","ltPropDraggable","ltPropAllowMultiple","ltPropMaxHeight","ltPropMaxWidth","ltPropWidth","ltPropHeight","ltPropWrapperClass","ltPropBoundry","ltPropHeading","ltPropButtons","ltPropButtonPosition","ltPropCloseOnBodyClick","ltPropDuration","ltPropOffset","ltPropBindToBody","ltPropHeaderPadding","ltPropContentPadding","ltPropFooterPadding","ltPropDimmer","buttons","ltPropShowCopy","visible","timeOutId","classTobeAdded","keys","first","arrowHidden","arrowEle","absDiv"],

    data: function(){
        return {
            //config from callee
            "ltPropShow":Lyte.attr("boolean",{"default": false}),
            "ltPropType":Lyte.attr("string",{"default":"callout"}),
            "ltPropFreeze":Lyte.attr("boolean",{"default": true}),
            "ltPropShowCloseButton":Lyte.attr("boolean",{"default": true}),
            "ltPropCloseOnEscape":Lyte.attr("boolean",{"default": true}),
            "ltPropOriginElem":Lyte.attr("string",{"default":""}),
            "ltPropPosition":Lyte.attr("string",{"default":"bottom"}),
            "ltPropPlacement":Lyte.attr("string",{"default":""}),
            "ltPropScrollable":Lyte.attr("boolean",{"default": false}),
            "ltPropDraggable":Lyte.attr("boolean",{"default": false}),
            "ltPropAllowMultiple":Lyte.attr("boolean",{"default": false}),
            "ltPropMaxHeight":Lyte.attr("string",{"default":""}),
            "ltPropMaxWidth":Lyte.attr("string",{"default":""}),
            "ltPropWidth":Lyte.attr("string",{"default":""}),
            "ltPropHeight":Lyte.attr("string",{"default":"auto"}),
            "ltPropWrapperClass":Lyte.attr("string",{"default":""}),
            "ltPropBoundry" : Lyte.attr("object",{"default":{}}),
            "ltPropHeading":Lyte.attr("string",{"default":""}),
            "ltPropButtons":Lyte.attr("string",{"default":""}),
            "ltPropButtonPosition":Lyte.attr("string",{"default":"right"}),
            "ltPropCloseOnBodyClick" : Lyte.attr("boolean",{"default" : true}),
            "ltPropDuration" : Lyte.attr("number",{"default" : 800}),
            "ltPropOffset" : Lyte.attr("object",{"default" : {}}),
            "ltPropBindToBody" : Lyte.attr("boolean",{"default":false}),
            "ltPropHeaderPadding":Lyte.attr("string",{"default":"15px 30px"}),
            "ltPropContentPadding":Lyte.attr("string",{"default":"15px 30px"}),
            "ltPropFooterPadding":Lyte.attr("string",{"default":"15px 30px"}),
            //local properties
            "ltPropDimmer":Lyte.attr("object",{"default":{"color":"black","opacity":"0.4"}}),
            "buttons":Lyte.attr("array",{"default":[{"type":"accept","text":"Ok"}]}),
            "ltPropShowCopy":Lyte.attr("boolean",{"default": false}),
            "visible" : Lyte.attr("boolean",{"default" : true}),
            "timeOutId" : Lyte.attr("number"),
            "classTobeAdded" : Lyte.attr("string"),
            "keys" : Lyte.attr("object", {"default" : {37: 1, 38: 1, 39: 1, 40: 1}}),
            "first" : Lyte.attr("boolean",{"default":true}),
            "arrowHidden" : Lyte.attr("boolean", {"default" : false}),
            "arrowEle" : Lyte.attr("object"),
            "absDiv" : Lyte.attr("object",{"default":null})
        }
    },

    addDragHandler : function(){
        var dragHeader = this.actualModalDiv.querySelector('lyte-popover-header');
        if(dragHeader){
            dragHeader.parentEle = this;
            if(this.$node.ltProp("draggable")){
                dragHeader.addEventListener('mousedown',this.handleMove,true);
                dragHeader.classList.add('draggable');
            }
            else{
                dragHeader.removeEventListener('mousedown',this.handleMove,true);
                dragHeader.classList.remove('draggable');
            }
        }
        else{
            console.warn("This popover is not draggable because it has no header");
            this.$node.ltProp("draggable",false);
        }
    },
    handleMove : function(e){
        var drag = e.currentTarget.parentEle.actualModalDiv;
        LytePopup.node=drag;
        LytePopup.xPos=e.clientX-this.getBoundingClientRect().left;
        LytePopup.yPos=e.clientY-this.getBoundingClientRect().top;
        var elePos = drag.getBoundingClientRect();
        drag.style.transitionDuration = "0s";
        var arrowEle = drag.parentElement.querySelector("#lytePopoverArrow");
        if(arrowEle){
            this.parentEle.setData('arrowHidden',true);
            this.parentEle.setData('arrowEle',arrowEle);
            arrowEle.style.display = "none";    
        }
        document.body.addEventListener('mousemove',e.currentTarget.parentEle.handleDrag,true);
        document.body.addEventListener('mouseup',e.currentTarget.parentEle.stopDrag,true);
    },
    handleDrag : function(e){
        var drag = LytePopup.node;
        drag.style.left=(e.clientX-drag.offsetParent.getBoundingClientRect().left-LytePopup.xPos)+'px';
        drag.style.top=(e.clientY-drag.offsetParent.getBoundingClientRect().top-LytePopup.yPos)+'px';
        window.getSelection().removeAllRanges();
    },
    stopDrag : function(e){
        var targetElem = e.target;
        while(targetElem && targetElem !== document){
            if(targetElem.parentEle){
                this.removeEventListener('mousemove',targetElem.parentEle.handleDrag,true);
                this.removeEventListener('mouseup',targetElem.parentEle.stopDrag,true);
                break;
            }
            targetElem = targetElem.parentElement ? targetElem.parentElement : document;
        }
    },
    closeAlertFn : function(){
        this.$node.ltProp("show",false);
        if(this.getMethods("onClose")){
            this.executeMethod("onClose");  
        }
    },
    showToggled : function(){
        // debugger
        // if(!this.getData('absDiv')){
        //     var div = document.createElement('div');
        //     div.style.position = "absolute";
        //     LyteComponent.appendChild(document.body,div);
        //     this.setData('absDiv',div);
        // }
        if(this.$node.ltProp("show") && !this.$node.ltProp("showCopy")){
            this.$node.ltProp("bindToBody",true);
            this.onBeforeShowHandling();
        }
        else{
            if(this.$node.ltProp("showCopy")){
                this.onBeforeCloseHandling();
            }
        }
    }.observes("ltPropShow").on('didConnect'),
    changeShow : function(){
        if(!this.getData('ltPropBindToBody')){
            if(this.getData('ltPropShow')){
                this.setData('ltPropShow',false);
            }
        }
    }.observes("ltPropBindToBody"),
    callOnResize : function(event){
        if(this.getMethods('onResize')){
            this.executeMethod('onResize',event,this);
        }
    },
    callOnScroll: function(event){
        var returnVal;
        if(this.getMethods('onScroll')){
            returnVal = this.executeMethod('onScroll',event,this);
        }
        return (returnVal == undefined ? true : returnVal);
    },
    updateScrollHandling : function(){   //Sets the height and width of the popover
        if(!this.$node.ltProp("freeze") && this.$node.ltProp("scrollable")){
            this.$node.ltProp("scrollable",true);
        }
        var modalElem = this.actualModalDiv;
        var oldHeight, oldWidth, newHeight, newWidth,
        contentNode = modalElem.querySelector("lyte-popover-content");
        contentNode = contentNode ? contentNode : modalElem;
        modalElem.style.maxWidth = "";
        modalElem.style.maxHeight = "";
        modalElem.style.height = this.$node.ltProp("height")?this.$node.ltProp("height"):"auto";
        modalElem.style.width = this.$node.ltProp("width")?this.$node.ltProp("width"):"auto";
        /*------------------------------ MEASURE STARTS --------------------------*/
        $L.fastdom.measure(function(){   //Measures the initial height and width based on the content of popover
            var modalElemOffset = modalElem.getBoundingClientRect();
            /*IF maxwidth or maxheigth given as a percentage then to calculate the actual width or height 
                                we need the modalElements parent element's width and height*/
            var modalParentOff = modalElem.parentElement.getBoundingClientRect();
            var totalHeight = ((modalElem.querySelector('lyte-popover-header') ? modalElem.querySelector('lyte-popover-header').getBoundingClientRect().height : 0) +
                                    (modalElem.querySelector('lyte-popover-content') ? modalElem.querySelector('lyte-popover-content').getBoundingClientRect().height : 0) +
                                        (modalElem.querySelector('lyte-popover-footer') ? modalElem.querySelector('lyte-popover-footer').getBoundingClientRect().height : 0))
            var cs = window.getComputedStyle(modalElem);
            var borderDimensionY = ((cs.borderTop ? parseFloat(cs.borderTop) : 0) +
                                     (cs.borderBottom ? parseFloat(cs.borderBottom) : 0));
            var h = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
            /*------------------------------ MUTATE STARTS --------------------------*/
            $L.fastdom.mutate(function(){  //Measures and sets the height and width based on the user provided max values
                // debugger
                if(this.$node.ltProp("maxHeight") && totalHeight >= parseInt(this.$node.ltProp("maxHeight"))){
                    this.childComp.querySelector(".popoverWrapper").classList.add("scrollable");
                    this.$node.ltProp("scrollable",true);
                    oldHeight = modalElemOffset.height - borderDimensionY;
                    var newH = this.$node.ltProp("maxHeight").indexOf('%') != -1 ? ((parseFloat(this.$node.ltProp("maxHeight"))/100) * modalParentOff.height) : parseFloat(this.$node.ltProp("maxHeight"));
                    modalElem.style.height = this.$node.ltProp("maxHeight");
                    newHeight = newH - borderDimensionY;
                }
                else{
                    oldHeight = modalElemOffset.height - borderDimensionY;
                    newHeight = h-20;
                }

                if(this.$node.ltProp("maxWidth")){
                    this.$node.ltProp("scrollable",true);
                    oldWidth = modalElemOffset.width;
                    modalElem.style.width = this.$node.ltProp("maxWidth");
                    newWidth = this.$node.ltProp("maxWidth").indexOf('%') != -1 ? ((parseFloat(this.$node.ltProp("maxWidth"))/100) * modalParentOff.width) : parseFloat(this.$node.ltProp("maxWidth"));
                    if(oldWidth < newWidth){
                        modalElem.style.width = oldWidth+"px";
                        newWidth = oldWidth;
                    }
                    modalElem.style.overflowX = "auto";
                }
                else{
                    newWidth = modalElemOffset.width;
                }

                if(this.$node.ltProp("scrollable")){
                    var popoverHeader = this.actualModalDiv.querySelector("lyte-popover-header"), popoverFooter = this.actualModalDiv.querySelector("lyte-popover-footer");
                    var popoverHOff = 0,popoverFOff = 0;
                    /*------------------------------ MEASURE STARTS --------------------------*/
                    $L.fastdom.measure(function(){    //Measures the heaser and footer dimensions
                        if(popoverHeader){
                            popoverHOff = popoverHeader.getBoundingClientRect().height;
                        }
                        if(popoverFooter){
                            popoverFOff = popoverFooter.getBoundingClientRect().height;
                        }
                        /*------------------------------ MUTATE STARTS --------------------------*/
                        $L.fastdom.mutate(function(){   //Sets the final height and width of the popover
                            var newH = (newHeight - (popoverHOff + popoverFOff));
                            contentNode.style.maxHeight = (newH > 0 ? newH : 50) +"px";
                            contentNode.style.overflowY = "auto"; 
                            if(this.getData('ltPropHeight')){
                                contentNode.style.height = (oldHeight - (popoverHOff + popoverFOff))+"px";
                            }
                            else{
                                contentNode.style.height = "auto";
                            }
                            modalElem.style.width = this.$node.ltProp("width")?this.$node.ltProp("width"):"auto";
                            this.actualModalDiv.style.maxWidth = newWidth > 0 ? (newWidth +"px"):("70%");
                            modalElem = null;
                            contentNode = null;
                            popoverHeader = null;
                            popoverFooter = null;
                        },this);
                        /*------------------------------ MUTATE ENDS --------------------------*/
                    },this);
                    /*------------------------------ MEASURE ENDS --------------------------*/
                }
                else{
                    this.childComp.querySelector(".popoverWrapper").classList.remove("scrollable");
                    modalElem = null;
                    contentNode = null;
                }
                if(this.$node.ltProp('freeze')){
                    this.childComp.querySelector(".popoverWrapper").style.position = "fixed";
                }
                else{
                    this.childComp.querySelector(".popoverWrapper").style.position = "inherit";   
                }
            },this);
            /*------------------------------ MUTATE ENDS --------------------------*/
        },this);
        /*------------------------------ MEASURE ENDS --------------------------*/
    },
    scrollHandling : function(){
        if(!this.getData('ltPropShow')){
            return;
        }
        this.updateScrollHandling();
    }.observes("ltPropWidth","ltPropMaxWidth","ltPropHeight","ltPropMaxHeight"),

    //Sets the left and top of the popover
    computeOffsetImpl : function(){
        var classTobeAdded = "", offsetLeft="",offsetTop="";
        var modalEle = this.actualModalDiv;
        modalEle.classList.remove('lytePopoverCenter','lytePopoverBottomCenter','lytePopoverBottomLeft','lytePopoverBottomRight','lytePopoverTopCenter','lytePopoverTopLeft','lytePopoverTopRight','lytePopoverLeft','lytePopoverRight');
        // modalEle.style.left = "";
        // modalEle.style.top = "";
        /*------------------------------ MEASURE STARTS --------------------------*/
        $L.fastdom.measure(function(){
            if(this.$node.ltProp("showCopy")){
                if(this.$node.ltProp('originElem') != ""){
                    // debugger
                    var ele = document.querySelector(this.$node.ltProp('originElem'));
                    var modalElePosition = modalEle.getBoundingClientRect();
                    var xscroll = window.pageXOffset || document.documentElement.scrollLeft;
                    var yscroll = window.pageYOffset || document.documentElement.scrollTop;
                    var bodyHeight = Math.max(document.documentElement.clientHeight, window.innerHeight || 0) + yscroll;
                    var bodyWidth = Math.max(document.documentElement.clientWidth, window.innerWidth || 0) + xscroll;  
                    var eleOffset = ele.getBoundingClientRect();
                    var origElemPosition;
                    if(Lyte.Component.registeredHelpers.lyteUiIsEmptyObject(this.$node.ltProp('offset'))){
                        origElemPosition = {top: eleOffset.top,
                                            right: eleOffset.right,
                                            bottom: eleOffset.bottom,
                                            left: eleOffset.left,
                                            width: eleOffset.width,
                                            height: eleOffset.height
                                          };
                    }
                    else{
                        origElemPosition = {width:this.$node.ltProp('offset').width || 0,
                                            height:this.$node.ltProp('offset').height || 0,
                                            top:this.$node.ltProp('offset').top,
                                            left:this.$node.ltProp('offset').left,
                                            bottom:(this.$node.ltProp('offset').top + (this.$node.ltProp('offset').height || 0)),
                                            right:(this.$node.ltProp('offset').left + (this.$node.ltProp('offset').width || 0))
                                            }
                    }
                    if(!this.getData('ltPropFreeze')){
                        origElemPosition.top = origElemPosition.top + yscroll;
                        origElemPosition.left = origElemPosition.left + xscroll;
                    }
                    
                    var elementPosition = origElemPosition;
                    var offObj = {}, newOffObj = {};
                    var position =  this.$node.ltProp('positionNew');
                    var flag = true;
                    var count = 0;
                    do{
                        if(this.$node.ltProp('placement') && !this.$node.ltProp('freeze')){
                            flag = true;
                            offObj = this.positionPopover(this.$node.ltProp('placement'),elementPosition,modalElePosition);
                            if(!this.$node.ltProp('freeze')){
                                newOffObj.offsetTop = origElemPosition.top + origElemPosition.height; 
                                newOffObj.offsetLeft = origElemPosition.left + origElemPosition.width; 
                            }
                            else{
                                newOffObj = offObj;
                            }
                            switch(this.$node.ltProp('placement')){
                                case 'bottom':
                                    
                                    if((newOffObj.offsetLeft-modalElePosition.width) < 0){
                                        offObj.offsetLeft = elementPosition.left;
                                        flag = true;
                                    }
                                    if(bodyWidth < (newOffObj.offsetLeft+modalElePosition.width)){
                                        offObj.offsetLeft = bodyWidth - modalElePosition.width - 10;
                                        flag = true;
                                    }
                                    break;
                                case 'bottomLeft':
                                    
                                    if((newOffObj.offsetLeft-modalElePosition.width) < 0){
                                        offObj.offsetLeft = elementPosition.left;
                                        flag = true;
                                    }
                                    if(bodyWidth < (newOffObj.offsetLeft+modalElePosition.width)){
                                        offObj.offsetLeft = bodyWidth - modalElePosition.width - 10;
                                        flag = true;
                                    }
                                    break;
                                case 'bottomRight':
                                    
                                    if((newOffObj.offsetLeft-modalElePosition.width) < 0){
                                        offObj.offsetLeft = elementPosition.left;
                                        flag = true;
                                    }
                                    if(bodyWidth < (newOffObj.offsetLeft+modalElePosition.width)){
                                        offObj.offsetLeft = bodyWidth - modalElePosition.width - 10;
                                        flag = true;
                                    }
                                    break;
                                case 'top':
                                    
                                    if((newOffObj.offsetLeft-modalElePosition.width) < 0){
                                        offObj.offsetLeft = elementPosition.left;
                                        flag = true;
                                    }
                                    if(bodyWidth < (newOffObj.offsetLeft+modalElePosition.width)){
                                        offObj.offsetLeft = bodyWidth - modalElePosition.width - 10;
                                        flag = true;
                                    }
                                    break;
                                case 'topLeft':
                                    
                                    if((newOffObj.offsetLeft-modalElePosition.width) < 0){
                                        offObj.offsetLeft = elementPosition.left;
                                        flag = true;
                                    }
                                    if(bodyWidth < (newOffObj.offsetLeft+modalElePosition.width)){
                                        offObj.offsetLeft = bodyWidth - modalElePosition.width - 10;
                                        flag = true;
                                    }
                                    break;
                                case 'topRight':
                                    
                                    if((newOffObj.offsetLeft-modalElePosition.width) < 0){
                                        offObj.offsetLeft = elementPosition.left;
                                        flag = true;
                                    }
                                    if(bodyWidth < (newOffObj.offsetLeft+modalElePosition.width)){
                                        offObj.offsetLeft = bodyWidth - modalElePosition.width - 10;
                                        flag = true;
                                    }
                                    break;
                                case 'left':
                                    
                                    if((newOffObj.offsetTop-modalElePosition.height) < 0 ){
                                        offObj.offsetTop = elementPosition.top;
                                    }
                                    if(bodyHeight < (offObj.offsetTop+modalElePosition.height)){
                                        offObj.offsetTop = bodyHeight - modalElePosition.height;
                                    }
                                    break;
                                case 'right':
                                    
                                    if((newOffObj.offsetTop-modalElePosition.height) < 0 ){
                                        offObj.offsetTop = elementPosition.top;
                                    }
                                    if(bodyHeight < (offObj.offsetTop+modalElePosition.height)){
                                        offObj.offsetTop = bodyHeight - modalElePosition.height;
                                    }
                                    break;
                            }
                            position = this.$node.ltProp('placement');
                        }
                        else{
                           count++;
                            flag = true;
                            offObj = this.positionPopover(position,elementPosition,modalElePosition);
                            if(!this.$node.ltProp('freeze')){
                                newOffObj.offsetTop = origElemPosition.top + origElemPosition.height; 
                                newOffObj.offsetLeft = origElemPosition.left + origElemPosition.width; 
                            }
                            else{
                                newOffObj = offObj;
                            }
                            switch(position){
                                case 'bottom':
                                    if(bodyHeight < (newOffObj.offsetTop+modalElePosition.height)){
                                        position = "top";
                                        flag = false;
                                        break;
                                    }
                                    
                                    if((newOffObj.offsetLeft-modalElePosition.width) < 0){
                                        offObj.offsetLeft = elementPosition.left;
                                        flag = true;
                                    }
                                    if(bodyWidth < (newOffObj.offsetLeft+modalElePosition.width)){
                                        offObj.offsetLeft = bodyWidth - modalElePosition.width - 10;
                                        flag = true;
                                    }
                                    break;
                                case 'bottomLeft':
                                    if(bodyHeight < (newOffObj.offsetTop+modalElePosition.height)){
                                        position = "top";
                                        flag = false;
                                        break;
                                    }

                                    if((newOffObj.offsetLeft-modalElePosition.width) < 0){
                                        offObj.offsetLeft = elementPosition.left;
                                        flag = true;
                                    }
                                    if(bodyWidth < (newOffObj.offsetLeft+modalElePosition.width)){
                                        offObj.offsetLeft = bodyWidth - modalElePosition.width - 10;
                                        flag = true;
                                    }
                                    break;
                                case 'bottomRight':
                                    if(bodyHeight < (newOffObj.offsetTop+modalElePosition.height)){
                                        position = "top";
                                        flag = false;
                                        break;
                                    }
                                    
                                    if((newOffObj.offsetLeft-modalElePosition.width) < 0){
                                        offObj.offsetLeft = elementPosition.left;
                                        flag = true;
                                    }
                                    if(bodyWidth < (newOffObj.offsetLeft+modalElePosition.width)){
                                        offObj.offsetLeft = bodyWidth - modalElePosition.width - 10;
                                        flag = true;
                                    }
                                    break;
                                case 'top':
                                    if((newOffObj.offsetTop-modalElePosition.height) < 0){
                                        position = "right";
                                        flag = false;
                                        break;
                                    }
                                    
                                    if((newOffObj.offsetLeft-modalElePosition.width) < 0){
                                        offObj.offsetLeft = elementPosition.left;
                                        flag = true;
                                    }
                                    if(bodyWidth < (newOffObj.offsetLeft+modalElePosition.width)){
                                        offObj.offsetLeft = bodyWidth - modalElePosition.width - 10;
                                        flag = true;
                                    }
                                    break;
                                case 'topLeft':
                                    if((newOffObj.offsetTop-modalElePosition.height) < 0){
                                        position = "right";
                                        flag = false;
                                        break;
                                    }
                                    
                                    if((newOffObj.offsetLeft-modalElePosition.width) < 0){
                                        offObj.offsetLeft = elementPosition.left;
                                        flag = true;
                                    }
                                    if(bodyWidth < (newOffObj.offsetLeft+modalElePosition.width)){
                                        offObj.offsetLeft = bodyWidth - modalElePosition.width - 10;
                                        flag = true;
                                    }
                                    break;
                                case 'topRight':
                                    if((newOffObj.offsetTop-modalElePosition.height) < 0){
                                        position = "left";
                                        flag = false;
                                        break;
                                    }
                                    
                                    if((newOffObj.offsetLeft-modalElePosition.width) < 0){
                                        offObj.offsetLeft = elementPosition.left;
                                        flag = true;
                                    }
                                    if(bodyWidth < (newOffObj.offsetLeft+modalElePosition.width)){
                                        offObj.offsetLeft = bodyWidth - modalElePosition.width - 10;
                                        flag = true;
                                    }
                                    break;
                                case 'left':
                                    if(newOffObj.offsetLeft < 0){
                                        position = "right";
                                        offsetLeft = (elementPosition.left + elementPosition.width)+9;
                                        offsetTop = elementPosition.top;
                                    }

                                    if((newOffObj.offsetTop-modalElePosition.height) < 0 ){
                                        offObj.offsetTop = elementPosition.top;
                                    }
                                    if(bodyHeight < (offObj.offsetTop+modalElePosition.height)){
                                        offObj.offsetTop = bodyHeight - modalElePosition.height;
                                    }
                                    break;
                                case 'right':
                                    if(bodyWidth < (newOffObj.offsetLeft+modalElePosition.width)){
                                        position = "left";
                                        offObj.offsetLeft = (elementPosition.left - modalElePosition.width)-9;
                                        offObj.offsetTop = elementPosition.top;
                                    }

                                    if((newOffObj.offsetTop-modalElePosition.height) < 0 ){
                                        offObj.offsetTop = elementPosition.top;
                                    }
                                    if(bodyHeight < (offObj.offsetTop+modalElePosition.height)){
                                        offObj.offsetTop = bodyHeight - modalElePosition.height;
                                    }
                                    break;
                            }

                        }
                        
                    }while(!flag && count <= 8)
                    var positions = ["bottom","bottomLeft","bottomRight","top","topLeft","topRight","right","left"];

                    offsetLeft = offObj.offsetLeft;
                    offsetTop = offObj.offsetTop;

                    if(this.$node.ltProp('type') === "callout"){
                        if(position.indexOf("bottom") > -1){
                            offObj.classTobeAdded = "lytePopoverArrowTop";
                        }
                        else if(position.indexOf("top") > -1){
                            offObj.classTobeAdded = "lytePopoverArrowBottom";
                        }
                        else if(position === "left"){
                             offObj.classTobeAdded = "lytePopoverArrowRight";
                        }
                        else if(position === "right"){
                             offObj.classTobeAdded = "lytePopoverArrowLeft";
                        }
                        var arrowIcon = modalEle.querySelector("#lytePopoverArrow");
                        arrowIcon.classList.remove("lytePopoverArrowTop","lytePopoverArrowBottom","lytePopoverArrowRight","lytePopoverArrowLeft");
                        arrowIcon.classList.add(offObj.classTobeAdded);
                        var arrowIconOffset;
                        /*------------------------------ MEASURE STARTS --------------------------*/
                        $L.fastdom.measure(function(){
                        arrowIconOffset = arrowIcon.getBoundingClientRect();
                        });
                        /*------------------------------ MEASURE ENDS --------------------------*/
                        /*------------------------------ MUTATE STARTS --------------------------*/
                        //Positions the arrowIcon of the popover and the popover too based on origin elem
                        $L.fastdom.mutate(function(){   //If originElem -> height < arrowIcon -> height OR originElem -> width < arrowIcon -> width
                            if(offObj.classTobeAdded === "lytePopoverArrowTop" || offObj.classTobeAdded === "lytePopoverArrowBottom"){
                                arrowIcon.style.left = Math.abs(offsetLeft - (elementPosition.left+(elementPosition.width-arrowIcon.offsetWidth)/2))+"px"; 
                                arrowIcon.style.top = "";
                                if(arrowIconOffset.left < 12 && origElemPosition.width <= 16){
                                    var diff = 12 - arrowIconOffset.left;
                                    if(origElemPosition.left == offsetLeft && (offsetLeft - diff) >= 0){
                                        arrowIcon.style.left = arrowIconOffset.left + diff + "px";
                                        offsetLeft -= diff;
                                    }
                                }
                                else if(modalElePosition.width - arrowIconOffset.right < 12 && origElemPosition.width <= 16){
                                    var diff = 12 - (modalElePosition.width - arrowIcon.getBoundingClientRect().right);
                                    if(origElemPosition.left + origElemPosition.width == modalElePosition.width + offsetLeft){
                                        arrowIcon.style.left = arrowIconOffset.left - diff + "px";
                                        offsetLeft += diff;
                                    }
                                }
                            }
                            else{
                                arrowIcon.style.left = "";
                                arrowIcon.style.top = Math.abs(offsetTop - (elementPosition.top+(elementPosition.height-arrowIcon.offsetHeight)/2)) + 5 +"px"; 
                                if(arrowIconOffset.top < 12 && origElemPosition.height <= 16){
                                    var diff = 12 - arrowIconOffset.top;
                                    if(origElemPosition.top == offsetTop && (offsetTop - diff) >= 0){
                                        arrowIcon.style.top = arrowIconOffset.top + diff + "px";
                                        offsetTop -= diff;
                                    }
                                }
                                else if(modalElePosition.height - arrowIconOffset.bottom < 12 && origElemPosition.height <= 16){
                                    var diff = 12 - (modalElePosition.height - arrowIconOffset.bottom);
                                    if(origElemPosition.top + origElemPosition.height == modalElePosition.height + offsetTop){
                                        arrowIcon.style.top = arrowIconOffset.top - diff + "px";
                                        offsetTop += diff;
                                    }
                                }
                            }
                        });
                        /*------------------------------ MUTATE ENDS --------------------------*/
                        
                    }
                    this.setData('classTobeAdded',offObj.classTobeAdded);
                }         
                this.$node.ltProp('positionNew',position);
                /*------------------------------ MUTATE STARTS --------------------------*/
                $L.fastdom.mutate(function(){ 
                    modalEle.style.left = offsetLeft+"px";
                    modalEle.style.top = offsetTop+"px";
                    if(this.getData("first")){
                        this.callOnShow();
                        this.setData("first",false);
                    }
                },this);
                /*------------------------------ MUTATE ENDS --------------------------*/
            }
        },this);
        /*------------------------------ MEASURE ENDS --------------------------*/
        if(this.$node.ltProp("freeze")){
            document.body.classList.add('bodyWrapper');    
        }
    },
    positionPopover : function(position,elementPosition,modalElePosition){
        var  offsetLeft=0,offsetTop=0;
        switch(position){
            case 'bottom':
                offsetLeft = elementPosition.left - (modalElePosition.width - elementPosition.width)/2;
                offsetTop = elementPosition.top+elementPosition.height+9;
                classTobeAdded = "lytePopoverArrowTop";
                break;
            case 'bottomLeft':
                offsetLeft = elementPosition.left;
                offsetTop = elementPosition.top +elementPosition.height+9;
                classTobeAdded = 'lytePopoverArrowTop';
                break;
            case 'bottomRight':
                offsetLeft = (elementPosition.left + elementPosition.width) - modalElePosition.width;
                offsetTop =  elementPosition.top +elementPosition.height+9;
                classTobeAdded = 'lytePopoverArrowTop';
                break;
            case 'top':
                offsetLeft = elementPosition.left - (modalElePosition.width - elementPosition.width)/2;
                offsetTop = elementPosition.top - (modalElePosition.height+9);
                classTobeAdded = 'lytePopoverArrowBottom';
                break;
            case 'topLeft':
                offsetLeft = elementPosition.left;
                offsetTop = elementPosition.top - (modalElePosition.height+9);
                classTobeAdded = 'lytePopoverArrowBottom';
                break;
            case 'topRight':
                offsetLeft = (elementPosition.left + elementPosition.width) - modalElePosition.width;
                offsetTop = elementPosition.top - (modalElePosition.height+9);
                classTobeAdded = 'lytePopoverArrowBottom';
                break;
            case 'left':
                offsetLeft = (elementPosition.left - modalElePosition.width)-9;
                offsetTop = elementPosition.top;
                classTobeAdded = 'lytePopoverArrowRight';
                break;
            case 'right':
                offsetLeft = (elementPosition.left + elementPosition.width)+9;
                offsetTop = elementPosition.top;
                classTobeAdded = 'lytePopoverArrowLeft';
                break;
        }
        return {offsetLeft:offsetLeft,offsetTop:offsetTop,classTobeAdded:classTobeAdded};
    },

    callOnShow:function(){
        if(this.getMethods("onShow")){
            this.executeMethod("onShow",this); 
        }
    },
    
    /*computeOffset : function(){
        this.computeOffsetImpl();
    }.observes("ltPropOriginElem","ltPropPosition","ltPropType","ltPropShowCopy","ltPropOffset"),*/
    onBeforeCloseHandling : function(){
        var result = true;
        var event = event || window.event;
        if(this.getMethods("onBeforeClose")){
            result = this.executeMethod("onBeforeClose",event,this); 
        }
        if(result === undefined || result){
            if(this.getData('arrowHidden')){
                this.getData('arrowEle').style.display = "";
                this.setData('arrowHidden',false);
                this.setData('arrowEle',null);
            }
            var animDur = parseInt(this.getData('ltPropDuration'));
            var self = this;
            var timeOutId = setTimeout(function(){
                self.$node.ltProp({"show":false,"showCopy":false});
                // console.log("hidden");
            },animDur);
            this.setData('timeOutId',timeOutId);
            this.actualModalDiv.style.transitionDuration = (animDur / 1000)+"s";
            this.actualModalDiv.style.opacity = 0;
            LytePopup.closePopup(this);
            this.setData('visible',false);
            if(this.getMethods("onClose")){
                this.executeMethod("onClose",this);  
            }
            if(this.$node.ltProp('freeze') && this.childComp.querySelector("lyte-popover-freeze")){
                this.childComp.querySelector("lyte-popover-freeze").style.opacity = 0;
            }
            this.childComp.querySelector(".popoverWrapper").style.position = "";
            document.body.classList.remove('bodyWrapper');
            if(!this.getData('ltPropFreeze') && document.body.classList.contains('lyteStopBodyScrolling')){
                document.body.classList.remove('lyteStopBodyScrolling');
            }
        }
        else{
            this.$node.ltProp('show',true);
            if(!this.getData('visible')){
                this.setData('visible',true);
            }
        }
    },
    onBeforeShowHandling : function(){
        var result = true;
        if(this.getMethods("onBeforeShow")){
            result = this.executeMethod("onBeforeShow") ? this.executeMethod("onBeforeShow",this) : true; 
        }
        if(!result){
            this.$node.ltProp({"show":false,"showCopy":false});
        }
        else{
            if(this.getData('ltPropDraggable')){
                this.addDragHandler();
            }
            this.updateScrollHandling();
            if(this.$node.ltProp('freeze')){
                this.childComp.querySelector(".popoverWrapper").style.position = "fixed";
            }
            else{
                this.childComp.querySelector(".popoverWrapper").style.position = "inherit";   
            }

            this.$node.ltProp("positionNew",this.$node.ltProp("position"));
            var self = this;
            setTimeout(function(){
                /*------------------------------ MUTATE STARTS --------------------------*/
                $L.fastdom.mutate(function(){
                    self.computeOffsetImpl();
                },self);
                /*------------------------------ MUTATE ENDS --------------------------*/
                self.$node.ltProp('showCopy',true);
                self.actualModalDiv.style.transitionDuration = (parseFloat(self.getData('ltPropDuration'))/1000) + "s";
                LytePopup.makingVisible = true;
                self.actualModalDiv.style.opacity = "1";
                if(self.$node.ltProp('freeze')){
                    var freezeStyle = self.childComp.querySelector("lyte-popover-freeze").style;
                    freezeStyle.transitionDuration = (parseFloat(self.getData('ltPropDuration'))/1000) + "s";
                    freezeStyle.opacity = self.getData('ltPropDimmer').opacity;
                    freezeStyle.background = self.getData('ltPropDimmer').color;
                }
                
                if(!self.$node.ltProp('freeze') && self.getData('classTobeAdded') && (self.getData('classTobeAdded') == "lytePopoverArrowLeft" || self.getData('classTobeAdded') == "lytePopoverArrowRight")){
                    var actualModalDivOffset = self.actualModalDiv.getBoundingClientRect();
                    var origElemPosition = document.querySelector(self.getData('ltPropOriginElem')).getBoundingClientRect();
                    if(actualModalDivOffset.top != origElemPosition.top){
                        self.actualModalDiv.style.top = origElemPosition.top + "px";
                    }
                }

            },0);
            if(!this.getData("first")){
                this.setData("first",true);
            }
            if(!this.getData('ltPropFreeze')){
                document.body.classList.add('lyteStopBodyScrolling');
            }
            if(!this.getData('visible')){
                this.setData('visible',true);
            }
             LytePopup.addPopup(this);
            
        }
    },
    didDestroy : function(){
        if(this.childComp){
            if(this.getData('timeOutId')){
                clearInterval(this.getData('timeOutId'));
            }
            this.childComp.remove();    
        }
        LytePopup.components = [];
    },
    actions: {
        wormholeDidConnect : function(){   
            // debugger
            
            this.childComp = this.$node.querySelector('lyte-wormhole');

            //Sets the padding style based on user provide padding values
            if(this.$node.parentElement && this.$node.parentElement.tagName == 'LYTE-COLORPICKER'){
                this.$node.parentElement.component.childComp = this.childComp;
            }
            if(this.childComp.querySelector('lyte-popover-header')){
                this.childComp.querySelector('lyte-popover-header').style.padding = this.getData('ltPropHeaderPadding');
            }
            if(this.childComp.querySelector('lyte-popover-content')){
                this.childComp.querySelector('lyte-popover-content').style.padding = this.getData('ltPropContentPadding');
            }
            if(this.childComp.querySelector('lyte-popover-footer')){
                this.childComp.querySelector('lyte-popover-footer').style.padding = this.getData('ltPropFooterPadding');
            }
            this.actualModalDiv = this.childComp.querySelector(".lytePopover");
            if(this.childComp.querySelector('lyte-popover-header') && this.getData('ltPropShowCloseButton')){
                var headerHeight=0, closeHeight= 0;
                $L.fastdom.measure(function(){
                    headerHeight = this.childComp.querySelector('lyte-popover-header').getBoundingClientRect().height;
                    closeHeight = this.childComp.querySelector('.lytePopoverClose').getBoundingClientRect().height;
                },this);
                $L.fastdom.mutate(function(){
                    this.childComp.querySelector('.lytePopoverClose').style.top = (headerHeight - closeHeight) / 2 + "px";
                },this);
            }
            
            LyteComponent.appendChild(document.body,this.childComp)
            // console.log("appending");
        },
        close : function(){
           this.$node.ltProp("show",false);
        }
    }
});



if (document.readyState === "complete" || document.readyState === "interactive"){
    addPopoverEvent();
}
else{
    document.addEventListener("DOMContentLoaded", function(event){
        addPopoverEvent(event);
    });
}

function addPopoverEvent(event){

    document.addEventListener('click',function(event){
        var ele = event.target;
        while(!$L(ele).hasClass('popoverWrapper') && ele.tagName != "LYTE-POPOVER-FREEZE" && ele.tagName != 'LYTE-DROP-BOX' && ele.tagName != 'HTML'){
            ele = ele.parentElement;
            if(!ele){
                return
            }
        }
        if(ele.tagName == 'HTML' || ele.tagName == "LYTE-POPOVER-FREEZE"){
            for(var i = LytePopup.components.length -1 ; i>=0; i--){
                if(LytePopup.components[i].$node.tagName == "LYTE-POPOVER" && LytePopup.components[i].childComp.style.visibility == "visible"){
                    var popover = LytePopup.components[i].$node;
            
                    if(popover && popover.component.getData('visible') && popover.component.getData('ltPropCloseOnBodyClick')){
                        popover.component.setData('visible',false);
                        popover.ltProp('show',false);
                    }
                }
            }
        }
    },true);

    document.body.addEventListener('scroll',function(event){    //This is for closing the dropdown when an outside area is clicked(CODE HELP)
       // console.log("called scroll");
       if(LytePopup.makingVisible) {
        LytePopup.makingVisible = false;
        return;
       }
        var wormhole;
        for(var i=LytePopup.components.length-1;i>=0;i--){
            if(LytePopup.components[i].$node && LytePopup.components[i].$node.nodeName == "LYTE-POPOVER" && LytePopup.components[i].childComp.style.visibility == "visible"){
                wormhole = LytePopup.components[i].childComp;
                if(wormhole && wormhole._callee.component.$node.ltProp("scrollable")){
                    if(LytePopup.components[i].callOnScroll(event)){
                        var ele =  wormhole.querySelector('.lytePopover');
                        if(!ele){
                            return ;
                        }
                        while(ele.tagName != 'LYTE-WORMHOLE'){
                            ele = ele.parentElement
                        }
                        var curscroll = event.target
                        if(curscroll.nodeName == "#document"){     //This probably happens because scrollIntoView is used to focus the dropdown which is open at the start so the event.target is #document(CODE HELP)
                            return ;
                        }
                        while(curscroll.tagName != "LYTE-WORMHOLE" && curscroll.tagName != 'HTML'){
                            curscroll = curscroll.parentElement
                        }
                        if(curscroll.tagName == 'LYTE-WORMHOLE'){
                            return ;
                        }
                        // console.log("didnt return");
                        ele._callee.component.computeOffsetImpl();

                        var par = document.querySelector(ele._callee.ltProp('originElem'));
                        var screl = event.target
                        var pbcr = par.getBoundingClientRect();
                        var sbcr = screl.getBoundingClientRect();

                        var boundry = ele._callee.ltProp("boundry");
                        var popoverElem = ele.querySelector('.lytePopover');
                        if(!(Object.keys(boundry).length === 0 && boundry.constructor === Object)){
                            if(boundry.top && popoverElem.getBoundingClientRect().top < parseFloat(boundry.top)){
                                ele._callee.ltProp('show',false);
                            }
                            else if(boundry.bottom && popoverElem.getBoundingClientRect().bottom > parseFloat(boundry.bottom)){
                                ele._callee.ltProp('show',false);
                            }
                            else if(boundry.left && popoverElem.getBoundingClientRect().left < parseFloat(boundry.left)){
                                ele._callee.ltProp('show',false);
                            }
                            else if(boundry.right && popoverElem.getBoundingClientRect().right > parseFloat(boundry.right)){
                                ele._callee.ltProp('show',false);
                            }
                        }
                        // console.log("for moving up",sbcr.top,pbcr.top)
                        // console.log("for moving down",(sbcr.top+sbcr.height),(pbcr.top+pbcr.height))
                        if(ele.querySelector('#lytePopoverArrow') && ele.querySelector('#lytePopoverArrow').classList.contains('lytePopoverArrowBottom') && ((pbcr.top+(pbcr.height/2)) > window.innerHeight)){
                            ele._callee.ltProp('show',false);
                        }
                        if(sbcr.top > pbcr.top || (sbcr.top+sbcr.height)<(pbcr.top+pbcr.height) || (ele.querySelector('#lytePopoverArrow') && (ele.querySelector('#lytePopoverArrow').classList.contains('lytePopoverArrowLeft') || ele.querySelector('#lytePopoverArrow').classList.contains('lytePopoverArrowRight')) &&(ele.querySelector('#lytePopoverArrow').getBoundingClientRect().bottom >= ele.querySelector('.lytePopover').getBoundingClientRect().bottom))){
                            ele._callee.ltProp('show',false);
                        }
                        if(sbcr.left > pbcr.left || (sbcr.left+sbcr.width)<(pbcr.left+pbcr.width)){
                            ele._callee.ltProp('show',false);
                        }
                    }
                }
            }
        }
        
       
    },true);

    window.addEventListener("resize",function(event){
        if(LytePopup._lytePopoverRTId){
            // console.log(LytePopup._lytePopoverRTId);
            clearTimeout(LytePopup._lytePopoverRTId);
            LytePopup._lytePopoverRTId = false;
        }
        LytePopup._lytePopoverRTId = setTimeout(function(){
            for(var i = LytePopup.components.length - 1 ; i >= 0 ; i--){
                if(LytePopup.components[i].$node && LytePopup.components[i].$node.nodeName == "LYTE-POPOVER" && LytePopup.components[i].childComp.style.visibility == "visible" && LytePopup.components[i].childComp.querySelector('.lytePopover')){
                    LytePopup.components[i].$node.component.updateScrollHandling();
                    LytePopup.components[i].$node.component.computeOffsetImpl();
                    LytePopup.components[i].$node.component.callOnResize(event);
                }
            }
        },100);
    },true);

};

