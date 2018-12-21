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
                    thisFreeze = '.lytePopoverFreeze';
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

Lyte.Component.register("lyte-modal",{
_template:"<template tag-name=\"lyte-modal\">\t<template is=\"if\" value=\"{{expHandlers(ltPropBindToBody,'&amp;&amp;',expHandlers(ltPropReRenderModal,'!'))}}\"><template case=\"true\">\t\t<lyte-wormhole case=\"true\" style=\"{{if(ltPropShowCopy,'visibility:visible','visibility:hidden')}}\">\t\t\t<template is=\"registerYield\" yield-name=\"lyte-content\">\t\t\t\t<div class=\"modalWrapper {{ltPropWrapperClass}}\">\t\t\t\t\t<div class=\"lyteModal\">\t\t\t\t\t\t<template is=\"if\" value=\"{{ltPropShowCloseButton}}\">\t\t\t\t\t\t\t<template case=\"true\"><span class=\"lyteModalClose\" onclick=\"{{action('close')}}\"></span></template>\t\t\t\t\t\t</template>\t\t\t\t\t\t<lyte-yield yield-name=\"modal\"></lyte-yield>\t\t\t\t\t</div>\t\t\t\t\t<template is=\"if\" value=\"{{ltPropFreeze}}\">\t\t\t\t\t\t<template case=\"true\"><lyte-modal-freeze></lyte-modal-freeze></template>\t\t\t\t\t</template>\t\t\t\t</div>\t\t\t</template>\t\t</lyte-wormhole>\t</template></template></template>",
_dynamicNodes : [{"type":"attr","position":[1]},{"type":"if","position":[1],"cases":{"true":{"dynamicNodes":[{"type":"attr","position":[1],"attr":{"style":{"name":"style","helperInfo":{"name":"if","args":["ltPropShowCopy","'visibility:visible'","'visibility:hidden'"]}}}},{"type":"registerYield","position":[1,1],"dynamicNodes":[{"type":"attr","position":[1]},{"type":"attr","position":[1,1,1]},{"type":"if","position":[1,1,1],"cases":{"true":{"dynamicNodes":[{"type":"attr","position":[0]}]}},"default":{}},{"type":"insertYield","position":[1,1,3]},{"type":"attr","position":[1,3]},{"type":"if","position":[1,3],"cases":{"true":{"dynamicNodes":[{"type":"componentDynamic","position":[0]}]}},"default":{}}]},{"type":"componentDynamic","position":[1]}]}},"default":{}}],
_observedAttributes :["ltPropShow","ltPropFreeze","ltPropShowCloseButton","ltPropCloseOnEscape","ltPropTransition","ltPropOffset","ltPropDimmer","ltPropDraggable","ltPropAllowMultiple","ltPropScrollable","ltPropMaxHeight","ltPropMaxWidth","ltPropWidth","ltPropHeight","ltPropWrapperClass","ltPropHeading","ltPropButtons","ltPropButtonPosition","ltPropBindToBody","ltPropShowCopy","ltPropReRenderModal","first","resizeCalled","prevHeight","returnedFalse"],
    data: function(){
        return {
            //config from callee
            "ltPropShow":Lyte.attr("boolean",{"default": false}),
            "ltPropFreeze":Lyte.attr("boolean",{"default": true}),
            "ltPropShowCloseButton":Lyte.attr("boolean",{"default": true}),
            "ltPropCloseOnEscape":Lyte.attr("boolean",{"default": true}),
            "ltPropTransition":Lyte.attr("object",{"default":{"animation":"slideFromTop","duration":"0.5"}}),
            "ltPropOffset":Lyte.attr("object",{"default":{"top":"center","left":"center"}}),
            "ltPropDimmer":Lyte.attr("object",{"default":{"color":"black","opacity":"0.4"}}),
            "ltPropDraggable":Lyte.attr("boolean",{"default": false}),
            "ltPropAllowMultiple":Lyte.attr("boolean",{"default": false}),
            "ltPropScrollable":Lyte.attr("boolean",{"default": false}),
            "ltPropMaxHeight":Lyte.attr("string",{"default":""}),
            "ltPropMaxWidth":Lyte.attr("string",{"default":""}),
            "ltPropWidth":Lyte.attr("string",{"default":""}),
            "ltPropHeight":Lyte.attr("string",{"default":"auto"}),
            "ltPropWrapperClass":Lyte.attr("string",{"default":""}),

            "ltPropHeading":Lyte.attr("string",{"default":""}),
            "ltPropButtons":Lyte.attr("array",{"default":[{"type":"accept","text":"Ok"}]}),
            "ltPropButtonPosition":Lyte.attr("string",{"default":"right"}),
            "ltPropBindToBody":Lyte.attr("boolean",{"default":false}),

            //local properties
            "ltPropShowCopy":Lyte.attr("boolean",{"default": false}),
            "ltPropReRenderModal":Lyte.attr("boolean",{"default":false}),
            "first":Lyte.attr("boolean",{"default":true}),
            'resizeCalled' : Lyte.attr("boolean",{"default":false}),
            "prevHeight" : Lyte.attr("number"),
            "returnedFalse" : Lyte.attr("boolean",{"default" : false})
        }
    },
    addDragHandler : function(){
        var dragHeader = this.actualModalDiv.querySelector('lyte-modal-header');
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
            console.warn("This modal is not draggable because it has no header");
            this.$node.ltProp("draggable",false);
        }
    },
    handleMove : function(e){
        var drag = e.currentTarget.parentEle.actualModalDiv;
        LytePopup.node=drag;
        if(e.currentTarget.parentEle.getData('ltPropTransition').animation == "fadeIn"){
            LytePopup.xPos=e.clientX-this.getBoundingClientRect().left;
            LytePopup.yPos=e.clientY-this.getBoundingClientRect().top;
        }
        else{
            LytePopup.xPos=e.clientX;
            LytePopup.yPos=e.clientY;
        }
        var elePos = drag.getBoundingClientRect();
        drag.style.transitionDuration = "0s";
        document.body.addEventListener('mousemove',e.currentTarget.parentEle.handleDrag,true);
        document.body.addEventListener('mouseup',e.currentTarget.parentEle.stopDrag,true);
    },
    handleDrag : function(e){
        var drag = LytePopup.node;
        if(!LytePopup.node){
            return;
        }
        if(LytePopup.node.closest('lyte-wormhole')._callee.component.getData('ltPropTransition').animation == "fadeIn"){
            drag.style.left=(e.clientX-LytePopup.xPos)+'px';
            drag.style.top=(e.clientY-LytePopup.yPos)+'px';
        }
        else{
            var matrix = LytePopup.node.closest('lyte-wormhole')._callee.component.transform,
                x = matrix.x+(e.clientX-LytePopup.xPos),
                y = matrix.y+(e.clientY-LytePopup.yPos);
            drag.style.transform = "translate("+x+"px, "+y+"px)";
        }
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
        if(LytePopup.node){
            var comp = LytePopup.node.closest('lyte-wormhole')._callee.component;
            LytePopup.node.style.transitionDuration = comp.getData('ltPropTransition').duration;
            if(comp.getData('ltPropTransition').animation != "fadeIn"){
                var matrix = new WebKitCSSMatrix(window.getComputedStyle(comp.actualModalDiv).transform);
                comp.transform = {'x' : matrix.m41, 'y' : matrix.m42};
            }
            LytePopup.node = null;
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
        if(this.getData('returnedFalse')){
            this.setData('returnedFalse',false);
            return;
        }
        if(this.$node.ltProp("reRenderModal")){
            if(this.$node.ltProp("show")){
                this.$node.ltProp({"showCopy":false, "show":false});
            }
            this.$node.ltProp("reRenderModal",false);
        }
        if(this.$node.ltProp("show") && !this.$node.ltProp("showCopy")){
            this.$node.ltProp("bindToBody",true);
            var self = this;
            setTimeout(function(){
                self.onBeforeShowHandling();
            },0);
            
        }
        else{
            if(this.$node.ltProp("showCopy")){
                var self = this;
                setTimeout(function(){
                    self.onBeforeCloseHandling();
                },0);
            }
        }
    }.observes("ltPropShow","ltPropReRenderModal").on('didConnect'),
    changeShow : function(){
        if(!this.getData('ltPropBindToBody')){
            this.actualModalDiv = null;
            this.childComp = null;
            if(this.getData('ltPropShow')){
                this.setData('ltPropShow',false);
            }
        }
    }.observes("ltPropBindToBody"),
    updateScrollHandling : function(){    //It sets the height and width of the modal
        if(!this.$node.ltProp("freeze")){
            this.$node.ltProp("scrollable",true);
        }
        var modalElem = this.actualModalDiv;
        var oldHeight, oldWidth, newHeight, newWidth,
        contentNode = modalElem.querySelector("lyte-modal-content");
        contentNode = contentNode ? contentNode : modalElem;
        modalElem.style.maxWidth = "";
        modalElem.style.maxHeight = "";
        modalElem.style.height = this.$node.ltProp("height")?this.$node.ltProp("height"):"auto";
        modalElem.style.width = this.$node.ltProp("width")?this.$node.ltProp("width"):"auto"; 
        // console.log(this.$node.ltProp("width"));
        /*------------------------------ MEASURE STARTS --------------------------*/
        $L.fastdom.measure(function() {    //Measures the initial height and width
            var modalElemOffset = modalElem.getBoundingClientRect();
            /*IF maxwidth or maxheigth given as a percentage then to calculate the actual width or height 
                                we need the modalElements parent element's width and height*/
            var modalParentOff = modalElem.parentElement.getBoundingClientRect();
            var cs = window.getComputedStyle(modalElem);
            var borderDimensionY = ((cs.borderTop ? parseFloat(cs.borderTop) : 0) +
                                     (cs.borderBottom ? parseFloat(cs.borderBottom) : 0));
            var h = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
            // console.log(modalElemOffset);
            /*------------------------------ MUTATE STARTS --------------------------*/
            $L.fastdom.mutate(function(){    //Checks for the max height and width provided by the user and sets the modal height and width based on that
                if(this.$node.ltProp("maxHeight")){
                    this.childComp.querySelector(".modalWrapper").classList.add("scrollable");
                    this.$node.ltProp("scrollable",true);
                    oldHeight = modalElemOffset.height - borderDimensionY;
                    var newH = this.$node.ltProp("maxHeight").indexOf('%') != -1 ? ((parseFloat(this.$node.ltProp("maxHeight"))/100) * modalParentOff.height) : parseFloat(this.$node.ltProp("maxHeight"));
                    modalElem.style.height = newH + "px";
                    newHeight = newH - borderDimensionY;
                }
                else{
                    oldHeight = modalElemOffset.height - borderDimensionY;
                    newHeight = h-40;
                }

                if(this.$node.ltProp("maxWidth")){
                    this.$node.ltProp("scrollable",true);
                    oldWidth = modalElemOffset.width /*- borderDimensionX*/;
                    newWidth = this.$node.ltProp("maxWidth").indexOf('%') != -1 ? ((parseFloat(this.$node.ltProp("maxWidth"))/100) * modalParentOff.width) : parseFloat(this.$node.ltProp("maxWidth"));
                    modalElem.style.width = newWidth + "px";
                    if(oldWidth < newWidth){
                        modalElem.style.width = oldWidth+"px";
                        newWidth = oldWidth;
                    }
                    modalElem.style.overflowX = "auto";
                }
                else{
                    newWidth = modalElemOffset.width /*- borderDimensionX*/;
                }
            

                if(this.$node.ltProp("scrollable")){
                    var modalheader = this.actualModalDiv.querySelector("lyte-modal-header"), modalFooter = this.actualModalDiv.querySelector("lyte-modal-footer");
                    var modalHOff = null,modalFOff = null;
                    /*------------------------------ MEASURE STARTS --------------------------*/
                    $L.fastdom.measure(function(){   //measures the content haeder, content and footer dimensions
                        if(modalheader){
                            modalHOff = modalheader.getBoundingClientRect();
                        }
                        if(modalFooter){
                            modalFOff = modalFooter.getBoundingClientRect();
                        }
                        var contentNodeOffset = contentNode.getBoundingClientRect();
                        var diff = 0;
                        var modalHeight = modalElem.getBoundingClientRect().height;
                        if(this.getData('resizeCalled')){
                            //to get the difference between previous height and current height
                            if(this.getData('prevHeight') < modalHeight){
                                diff = modalHeight - this.getData('prevHeight');
                            }
                            this.setData('resizeCalled',false);
                        }
                        this.setData('prevHeight',modalHeight);
                        /*------------------------------ MUTATE STARTS --------------------------*/
                        $L.fastdom.mutate(function(){   //Sets the final height and width of the modal
                            var newH = (newHeight - ((modalHOff ? modalHOff.height : 0)+ (modalFOff ? modalFOff.height : 0)));
                            contentNode.style.maxHeight = (newH > 0 ? newH : 50) + diff +"px";
                            contentNode.style.overflowY = "auto";
                            if(this.getData('first')){
                                contentNode.style.height = (oldHeight - ((modalHOff ? modalHOff.height : 0)+ (modalFOff ? modalFOff.height : 0))) +"px";
                            }
                            modalElem.style.width = this.$node.ltProp("width")?this.$node.ltProp("width"):"auto";
                            this.actualModalDiv.style.maxWidth = newWidth > 0 ? (newWidth +"px"):("70%");
                            modalElem = null;
                            contentNode = null;
                            modalheader = null;
                            modalFooter = null;
                            this.computeOffsetImpl();
                        },this);
                        /*------------------------------ MUTATE ENDS --------------------------*/
                    },this);
                    /*------------------------------ MEASURE ENDS --------------------------*/
                }
                else{
                    this.childComp.querySelector(".modalWrapper").classList.remove("scrollable");
                    modalElem = null;
                    contentNode = null;
                    this.computeOffsetImpl();
                }

                if (!this.$node.ltProp("freeze")) { 
                    this.childComp.querySelector(".modalWrapper").style.position = "static";
                }
                else{
                    this.childComp.querySelector(".modalWrapper").style.position = "fixed";
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
    callOnShow: function(){
        if(this.getMethods("onShow")){
            this.executeMethod("onShow",this); 
        }
    },
    callOnResize : function(){
        if(this.getMethods("onResize")){
            this.executeMethod("onResize");
        }
    },

    enableTransform : function(val,pos){
        this.$node.ltProp('showCopy',true);
        if(pos == 'x'){
            this.actualModalDiv.style.transform = "translate("+val+"px,0px)";
            this.transform = {'x' : val, 'y' : 0};
        }
        if(pos == 'y'){
            this.actualModalDiv.style.transform = "translate(0px,"+val+"px)";
            this.transform = {'x' : 0, 'y' : val};
        }
    },

    computeOffsetImplOnResize : function(){
        /*------------------------------ MEASURE STARTS --------------------------*/
         $L.fastdom.measure(function() {   
            var modalEle = this.actualModalDiv;
                modalElePosition = modalEle.getBoundingClientRect();
                w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0),
                h = Math.max(document.documentElement.clientHeight, window.innerHeight || 0),
                prevWinH = this.getData('prevWinH'),
                prevWinW = this.getData('prevWinW'),
                transform = this.transform /*new WebKitCSSMatrix(window.getComputedStyle(modalEle).transform)*/,
                newTop = null,
                newLeft = null,
                offsetObj = this.getData('ltPropOffset');
            
            if(this.getData('ltPropTransition').animation === "fadeIn"){
                if(w < prevWinW){
                    if((offsetObj.left && offsetObj.left == "center") || (offsetObj.right && offsetObj.right == "center")){
                        newLeft = modalElePosition.left - ((prevWinW - w) / 2);
                    }
                    else if(offsetObj.right){
                        newLeft = modalElePosition.left - (prevWinW - w);
                    }
                    else if(offsetObj.left){
                        newLeft = modalElePosition.left;
                    }
                }
                if(w > prevWinW){
                    if((offsetObj.left && offsetObj.left == "center") || (offsetObj.right && offsetObj.right == "center")){
                        newLeft = modalElePosition.left + ((w - prevWinW) / 2);
                    }
                    else if(offsetObj.right){
                        newLeft = modalElePosition.left + (w - prevWinW);
                    }
                    else if(offsetObj.left){
                        newLeft = modalElePosition.left;
                    }
                }
                if(h < prevWinH){
                    if((offsetObj.top && offsetObj.top == "center") || (offsetObj.bottom && offsetObj.bottom == "center")){
                        newTop = modalElePosition.top - ((prevWinH - h) / 2);
                    }
                    else if(offsetObj.bottom){
                        newTop = modalElePosition.top - (prevWinH - h);
                    }
                    else if(offsetObj.top){
                        newTop = modalElePosition.top;
                    }
                }
                if(h > prevWinH){
                    if((offsetObj.top && offsetObj.top == "center") || (offsetObj.bottom && offsetObj.bottom == "center")){
                        newTop = modalElePosition.top + ((h - prevWinH) / 2);
                    }
                    else if(offsetObj.bottom && offsetObj.bottom != "center"){
                        newTop = modalElePosition.top + (h - prevWinH);
                    }
                    else if(offsetObj.top && offsetObj.top != "center"){
                        newTop = modalElePosition.top;
                    }
                }
                $L.fastdom.mutate(function() {
                    if(newTop){
                        modalEle.style.top = newTop + "px";
                    }
                    if(newLeft){
                        modalEle.style.left = newLeft + "px";
                    }
                    
                },this);
            }
            else{
                if(w < prevWinW){
                    if((offsetObj.left && offsetObj.left == "center") || (offsetObj.right && offsetObj.right == "center")){
                        newLeft = transform.x - ((prevWinW - w) / 2);
                    }
                    else if(offsetObj.right){
                        newLeft = transform.x - (prevWinW - w);
                    }
                    else if(offsetObj.left){
                        newLeft = transform.x;
                    }
                    this.transform.x = newLeft;
                }
                if(w > prevWinW){
                    if((offsetObj.left && offsetObj.left == "center") || (offsetObj.right && offsetObj.right == "center")){
                        newLeft = transform.x + ((w - prevWinW) / 2);
                    }
                    else if(offsetObj.right){
                        newLeft = transform.x + (w - prevWinW);
                    }
                    else if(offsetObj.left){
                        newLeft = transform.x;
                    }
                    this.transform.x = newLeft;
                }
                if(h < prevWinH){
                    if((offsetObj.top && offsetObj.top == "center") || (offsetObj.bottom && offsetObj.bottom == "center")){
                        newTop = transform.y - ((prevWinH - h) / 2);
                    }
                    else if(offsetObj.bottom){
                        newTop = transform.y - (prevWinH - h);
                    }
                    else if(offsetObj.top){
                        newTop = transform.y;
                    }
                    
                    this.transform.y = newTop;
                }
                if(h > prevWinH){
                    if((offsetObj.top && offsetObj.top == "center") || (offsetObj.bottom && offsetObj.bottom == "center")){
                        newTop = transform.y + ((h - prevWinH) / 2);
                    }
                    else if(offsetObj.bottom && offsetObj.bottom != "center"){
                        newTop = transform.y + (h - prevWinH);
                    }
                    else if(offsetObj.top && offsetObj.top != "center"){
                        newTop = transform.y;
                    }
                    this.transform.y = newTop;
                }
                $L.fastdom.mutate(function() {
                    modalEle.style.transitionDuration = "0s";
                    if(this.getData('ltPropTransition').animation === "slideFromTop" || this.getData('ltPropTransition').animation === "slideFromBottom"){
                        if(w < prevWinW){
                            modalEle.style.left = modalElePosition.left - ((prevWinW - w)/2) + "px";
                        }
                        if(w > prevWinW){
                            modalEle.style.left = modalElePosition.left + ((w - prevWinW)/2) + "px";
                        }
                        modalEle.style.transform = "translate(0px,"+this.transform.y+"px)";
                    }
                    else if(this.getData('ltPropTransition').animation === "slideFromLeft" || this.getData('ltPropTransition').animation === "slideFromRight"){
                        if(h < prevWinH){
                            modalEle.style.top = modalElePosition.top - ((prevWinH - h)/2) + "px";
                        }
                        if(h > prevWinH){
                            modalEle.style.top = modalElePosition.top + ((h - prevWinH)/2) + "px";
                        }
                        modalEle.style.transform = "translate("+this.transform.x+"px,0px)";
                    }
                },this);
            }
            this.setData('prevWinH',h);
            this.setData('prevWinW',w);
        },this);
        /*------------------------------ MEASURE ENDS --------------------------*/
        modalEle = null;
    },

    computeOffsetImpl : function(){     //sets the left and top of the modal based on user provided values   
        var _this = this.nodeName && this.nodeName === "LYTE-MODAL" ? this.component : this;
        /*------------------------------ MEASURE STARTS --------------------------*/
         $L.fastdom.measure(function() {   
            var modalEle = _this.actualModalDiv;
            var offsetObj = Lyte.deepCopyObject(_this.$node.ltProp('offset'));
            var modalElePosition = modalEle.getBoundingClientRect();
            var w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
            var h = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
             // $L.fastdom.mutate(() => {
                modalEle.style.transitionDuration = _this.$node.ltProp("transition").duration+"s";
            // },this);
            _this.setData('prevWinH',h);
            _this.setData('prevWinW',w);
            if(offsetObj){
                if(offsetObj.left === "center" || offsetObj.right === "center"){
                    var offLeft = (w - modalElePosition.width)/2;
                    if(offLeft < 0){
                        offLeft = 20;
                    }
                    offsetObj.left = offLeft + "px";
                }
                if(offsetObj.top === "center" || offsetObj.bottom === "center"){
                    var offTop = (h - modalElePosition.height)/2;
                    if(offTop < 0){
                        offTop = 20;
                    }
                    offsetObj.top = offTop + "px";
                }            
                if(offsetObj.right && offsetObj.right !== "center"){
                    if(offsetObj.right.indexOf("%") > -1){
                        offsetObj.left = w-(modalElePosition.width+(w/parseFloat(offsetObj.right)))+"px";
                    }
                    else{
                        offsetObj.left = w-(modalElePosition.width+parseFloat(offsetObj.right))+"px";   
                    }
                }
                if(offsetObj.bottom && offsetObj.bottom !== "center"){
                    if(offsetObj.bottom.indexOf("%") > -1){
                        offsetObj.top = h-(modalElePosition.height+(h/parseFloat(offsetObj.bottom)))+"px";
                    }
                    else{
                        offsetObj.top = h-(modalElePosition.height+parseFloat(offsetObj.bottom))+"px";   
                    }
                }
                if(offsetObj.left === ""){
                    offsetObj.left = ((w - modalElePosition.width)/2) + "px";
                }
                if(offsetObj.top === ""){
                    offsetObj.top = ((h - modalElePosition.height)/2) + "px";
                } 
                /*------------------------------ MUTATE STARTS --------------------------*/
                 $L.fastdom.mutate(function() {
                    if(_this.getData('ltPropTransition').animation == "slideFromTop"){
                        modalEle.style.left = offsetObj.left;
                        modalEle.style.top = (-1 * modalElePosition.height) + "px";
                        _this.enableTransform(parseInt(offsetObj.top)+modalElePosition.height,"y");
                    }
                    else if(_this.getData('ltPropTransition').animation == "slideFromBottom"){
                        modalEle.style.left = offsetObj.left;
                        modalEle.style.top = h+1 + "px";
                        _this.enableTransform(-1 * (h - parseInt(offsetObj.top) + 1),"y");
                    }
                    else if(_this.getData('ltPropTransition').animation == "slideFromLeft"){
                        modalEle.style.top = offsetObj.top;
                        modalEle.style.left = (-1 * modalElePosition.width) + "px";
                        _this.enableTransform(parseInt(offsetObj.left)+modalElePosition.width,'x');
                    }
                    else if(_this.getData('ltPropTransition').animation == "slideFromRight"){
                        modalEle.style.top = offsetObj.top;
                        modalEle.style.left = w + 1 + "px";
                        _this.enableTransform(-1 * (w - parseInt(offsetObj.left) + 1),'x');
                    }
                    else if(_this.getData('ltPropTransition').animation == "fadeIn"){
                        _this.$node.ltProp('showCopy',true);
                        modalEle.style.left = offsetObj.left;
                        modalEle.style.top = offsetObj.top;
                    }
                    if(_this.getData('first')){
                        _this.callOnShow();
                        _this.setData("first",false);
                    }
                },_this);
                /*------------------------------ MUTATE ENDS --------------------------*/
            }
            else{
                var offsetLeft="",offsetTop="";
                offsetLeft = ((w - modalElePosition.width)/2);
                offsetTop = ((h - modalElePosition.height)/2);
                if(!_this.$node.ltProp("scrollable")){
                    if(offsetLeft < 0){
                        offsetLeft = 20;
                    }
                    if(offsetTop < 0){
                        offsetTop = 20;
                    }
                }
                /*------------------------------ MUTATE STARTS --------------------------*/
                 $L.fastdom.mutate(function() {
                    if(_this.getData('ltPropTransition').animation == "slideFromTop"){
                        modalEle.style.left = offsetLeft + "px";
                        modalEle.style.top = (-1 * modalElePosition.height) + "px";
                        _this.enableTransform(parseInt(offsetTop)+modalElePosition.height,"y");
                    }
                    else if(_this.getData('ltPropTransition').animation == "slideFromBottom"){
                        modalEle.style.left = offsetLeft + "px";
                        modalEle.style.top = h+1 + "px";
                        _this.enableTransform(-1 * (parseInt(offsetTop) + modalElePosition.height + 1),"y");
                    }
                    else if(_this.getData('ltPropTransition').animation == "slideFromLeft"){
                        modalEle.style.top = offsetTop + "px";
                        modalEle.style.left = (-1 * modalElePosition.width) + "px";
                        _this.enableTransform(parseInt(offsetLeft)+modalElePosition.width,'x');
                    }
                    else if(_this.getData('ltPropTransition').animation == "slideFromRight"){
                        modalEle.style.top = offsetTop + "px";
                        _modalEle.style.left = w + 1 + "px";
                        this.enableTransform(-1 * (parseInt(offsetLeft) + modalElePosition.width + 1),'x');
                    }
                    else if(_this.getData('ltPropTransition').animation == "fadeIn"){
                        _this.$node.ltProp('showCopy',true);
                        modalEle.style.left = offsetLeft + "px";
                        modalEle.style.top = offsetTop + "px";
                    }
                    if(_this.getData('first')){
                        _this.callOnShow();
                        _this.setData("first",false);
                    }
                },_this);
                /*------------------------------ MUTATE ENDS --------------------------*/
            }
            if(_this.$node.ltProp("transition").animation == "fadeIn"){
                 // $L.fastdom.mutate(() => {
                    modalEle.style.opacity = 1;
                // });
            }
            else{
                 // $L.fastdom.mutate(() => {
                    modalEle.style.opacity = "";
                // });
            }
            if(_this.$node.ltProp("freeze")){
                 // $L.fastdom.mutate(() => {
                    document.body.classList.add('bodyWrapper');
                // });    
            }
        },_this);
        /*------------------------------ MEASURE ENDS --------------------------*/
        modalEle = null;
    },
    onBeforeCloseHandling : function(){
        var result = true;
        var w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
        var h = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
        if(this.getMethods("onBeforeClose")){
            result = this.executeMethod("onBeforeClose",this); 
        }
        if(result === undefined || result){
            var animDur = parseFloat(this.$node.ltProp('transition').duration) * 1000;
            var self = this;
            setTimeout(function(){
                self.$node.ltProp({"showCopy":false,"show":false});
                LytePopup.closePopup(self);
                if(self.getMethods("onClose")){
                    self.executeMethod("onClose");  
                }
            },animDur);
            var modalEle = this.actualModalDiv;
            var modalElemOffset;
            /*------------------------------ MEASURE STARTS --------------------------*/
            $L.fastdom.measure(function(){
                modalElemOffset = modalEle.getBoundingClientRect();
            });
            /*------------------------------ MEASURE ENDS --------------------------*/
            var val = "";
            /*------------------------------ MUTATE STARTS --------------------------*/
            $L.fastdom.mutate(function(){
                modalEle.style.transitionDuration = this.$node.ltProp("transition").duration+"s";
                
                if(this.getData('ltPropTransition').animation == "slideFromTop"){
                    modalEle.style.transform = "translateY(-100%)";
                }
                else if(this.getData('ltPropTransition').animation == "slideFromBottom"){
                    modalEle.style.transform = "translateY(100%)";
                }
                else if(this.getData('ltPropTransition').animation == "slideFromLeft"){
                    modalEle.style.transform = "translateX(-100%)";
                }
                else if(this.getData('ltPropTransition').animation == "slideFromRight"){
                    modalEle.style.transform = "translateX(100%)";
                }
                else{
                    modalEle.style.opacity = 0;
                }
            },this);
            /*------------------------------ MUTATE ENDS --------------------------*/
            // switch(this.$node.ltProp("transition").animation){
            //     case "slideFromTop":
            //         /*------------------------------ MUTATE STARTS --------------------------*/
            //         $L.fastdom.mutate(function(){
            //             modalEle.style.top = "-"+(modalEle.getBoundingClientRect().height)+"px";
            //         });
            //         /*------------------------------ MUTATE ENDS --------------------------*/
            //         break;
            //     case "slideFromBottom":
            //         modalEle.style.top = h+"px";
            //         break;
            //     case "slideFromLeft":
            //         /*------------------------------ MUTATE STARTS --------------------------*/
            //         $L.fastdom.mutate(function(){
            //             modalEle.style.left = "-"+(modalEle.getBoundingClientRect().width)+"px";
            //         });
            //         /*------------------------------ MUTATE ENDS --------------------------*/
            //         break;
            //     case "slideFromRight":
            //         modalEle.style.left = w+"px";
            //         break;
            //     case "fadeIn":
            //         modalEle.style.opacity = 0;
            //         break;
            // }
            /*------------------------------ MUTATE STARTS --------------------------*/
            $L.fastdom.mutate(function(){
                modalEle = null;
            });
            /*------------------------------ MUTATE ENDS --------------------------*/
            
            modalEle.classList.remove('lyteModalFromTop','lyteModalFromBottom','lyteModalFromLeft','lyteModalFromRight','lyteModalFadeIn');
            if(this.$node.ltProp('freeze') && this.childComp.querySelector("lyte-modal-freeze")){
                this.childComp.querySelector("lyte-modal-freeze").style.opacity = 0;
            }
            this.setData("first",true);
            this.childComp.querySelector(".modalWrapper").style.position = "fixed";
            document.body.classList.remove('bodyWrapper');
            this.$node.alignModal = null;
        }
        else{
            this.setData('returnedFalse',true);
            this.$node.ltProp('show',true);
        }
    },
    onBeforeShowHandling : function(){
        var result = true;
        if(this.getMethods("onBeforeShow")){
            result = this.executeMethod("onBeforeShow") ; 
        }
        if(result === undefined || result){
            this.addDragHandler();
            this.updateScrollHandling();
            var modalEle = this.actualModalDiv;
            var val = "";
            modalEle.style.transitionDuration = this.$node.ltProp("transition").duration+"s";
            var classVal = "lyteModalFrom";
            var modalStyle = this.actualModalDiv.style;
            /*------------------------------ MEASURE STARTS --------------------------*/
            $L.fastdom.measure(function(){   //Measures modal's dimensions for transition effect
                // debugger
                var modalElemOffset = this.actualModalDiv.getBoundingClientRect();
            
                // switch(this.$node.ltProp("transition").animation){
                //     case "slideFromTop":
                //         /*------------------------------ MUTATE STARTS --------------------------*/
                //         $L.fastdom.mutate(function(){
                //             modalStyle.top = "-"+(modalElemOffset.height)+"px";
                //         });
                //         /*------------------------------ MUTATE ENDS --------------------------*/
                //         classVal += "Top";
                //         break;
                //     case "slideFromBottom":
                //         modalStyle.top = "100%";
                //         classVal += "Bottom";
                //         break;
                //     case "slideFromLeft":
                //         /*------------------------------ MUTATE STARTS --------------------------*/
                //         $L.fastdom.mutate(function(){
                //             modalStyle.left = "-"+(modalElemOffset.width)+"px";
                //         });
                //         /*------------------------------ MUTATE ENDS --------------------------*/
                //         classVal += "Left";
                //         break;
                //     case "slideFromRight":
                //         modalStyle.left = "100%";
                //         classVal += "Right";
                //         break;
                //     case "fadeIn":
                //         classVal = "lyteModalFadeIn";
                //         break;
                // }
                /*------------------------------ MUTATE STARTS --------------------------*/
                $L.fastdom.mutate(function(){
                    this.actualModalDiv.classList.add(classVal);
                    modalEle = null;
                },this);
                /*------------------------------ MUTATE ENDS --------------------------*/
            },this);
            /*------------------------------ MEASURE ENDS --------------------------*/
            
            var self = this;
            setTimeout(function(){
                // self.setInitialDimensions();
                // self.computeOffsetImpl();
                /*------------------------------ MUTATE STARTS --------------------------*/
                 $L.fastdom.mutate(function(){
                    // self.$node.ltProp('showCopy',true);
                    // self.childComp.style.visibility = "visible";
                    if(self.$node.ltProp('freeze')){
                        var freezeStyle = self.childComp.querySelector("lyte-modal-freeze").style;
                        freezeStyle.opacity = self.getData('ltPropDimmer').opacity;
                        freezeStyle.background = self.getData('ltPropDimmer').color;
                        if(self.getData('ltPropTransition').duration){
                            freezeStyle.transitionDuration = self.getData('ltPropTransition').duration + "s";
                        }
                    }
                },self);
                /*------------------------------ MUTATE ENDS --------------------------*/
            },0);

            LytePopup.addPopup(this);
            this.$node.alignModal = this.computeOffsetImpl;
        }
        else{
            this.setData('returnedFalse',true);
            this.$node.ltProp({"showCopy":false,"show":false});
        }
    },
    didDestroy : function(){
        if(this.childComp){
            this.childComp.remove();    
        }
        LytePopup.components = [];
    },
    actions: {
        wormholeDidConnect : function(){
            this.childComp = this.$node.querySelector('lyte-wormhole');
            this.actualModalDiv = this.childComp.querySelector(".lyteModal");
            // this.addDragHandler();
            var anim = this.$node.ltProp('transition');
            LyteComponent.appendChild(document.body,this.childComp);
            // this.updateScrollHandling();
        },
        close : function(){
           this.$node.ltProp("show",false);
        }
    }
});

if (document.readyState === "complete" || document.readyState === "interactive"){
    addModalEvent();
}
else{
    document.addEventListener("DOMContentLoaded", function(event){
        addModalEvent(event);
    });
}
function addModalEvent(event){
    window.addEventListener('resize',function(event){
        if(LytePopup._lyteModalRTId){
            // console.log(LytePopup._lyteModalRTId);
            clearTimeout(LytePopup._lyteModalRTId);
            LytePopup._lyteModalRTId = false;
        }
        LytePopup._lyteModalRTId = setTimeout(function(){
            for(var i = LytePopup.components.length - 1 ; i >= 0 ; i--){
                if(LytePopup.components[i].$node && LytePopup.components[i].$node.nodeName == "LYTE-MODAL" && LytePopup.components[i].childComp.style.visibility == "visible" && LytePopup.components[i].childComp.querySelector('.lyteModal')){
                    LytePopup.components[i].$node.component.setData('resizeCalled',true);
                    LytePopup.components[i].$node.component.updateScrollHandling();
                    LytePopup.components[i].$node.component.computeOffsetImplOnResize();
                    LytePopup.components[i].$node.component.callOnResize();
                }
            }
            LytePopup._lyteModalRTId = false;
        },100);
    },true);
}
;

