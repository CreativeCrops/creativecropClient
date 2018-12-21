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
                    thisFreeze = '.lyteModalFreeze';
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


//component
Lyte.Component.register("lyte-alert",{
_template:"<template tag-name=\"lyte-alert\">\t<template is=\"if\" value=\"{{ltPropShowCopy}}\">\t\t<template case=\"true\"><lyte-wormhole>\t\t\t<template is=\"registerYield\" yield-name=\"lyte-content\">\t\t\t\t<div class=\"alertWrapper {{ltPropWrapperClass}}\">\t\t\t\t\t\t<div class=\"alertPopup\">\t\t\t\t\t\t<template is=\"if\" value=\"{{ltPropShowCloseButton}}\">\t\t\t\t\t\t\t<template case=\"true\"><span class=\"lyte-svg alertClose\" onclick=\"{{action('closeAlert')}}\"></span></template>\t\t\t\t\t\t</template>\t\t\t\t\t\t<template is=\"if\" value=\"{{ltPropYield}}\"><template case=\"true\">\t\t\t\t\t\t\t<lyte-yield yield-name=\"alert\"></lyte-yield>\t\t\t\t\t\t</template><template case=\"false\">\t\t\t\t\t\t\t<template is=\"if\" value=\"{{lyteUiIfEquals(ltPropHeading,'')}}\">\t\t\t\t\t\t\t\t<template case=\"false\"><div class=\"alertHeader\">\t\t\t\t\t\t\t\t\t<span class=\"dBlock\">{{ltPropHeading}}</span>\t\t\t\t\t\t\t\t</div></template>\t\t\t\t\t\t\t</template>\t\t\t\t\t\t\t<div class=\"alertContent\">\t\t\t\t\t\t\t\t<template is=\"if\" value=\"{{lyteUiIfEquals(ltPropType,'')}}\">\t\t\t\t\t\t\t\t\t<template case=\"false\"><div class=\"alertContentMiddle\">\t\t\t\t\t\t\t\t\t\t<span class=\"{{lyteUiConcatTypeClass(ltPropType,'AlertIcon','lyteStatusIcon')}}\"></span>\t\t\t\t\t\t\t\t\t</div></template>\t\t\t\t\t\t\t\t</template>\t\t\t\t\t\t\t\t<div class=\"alertContentMiddle\">\t\t\t\t\t\t\t\t\t<template is=\"if\" value=\"{{lyteUiIfEquals(ltPropPrimaryMessage,'')}}\">\t\t\t\t\t\t\t\t\t\t<template case=\"false\"><div>\t\t\t\t\t\t\t\t\t\t\t<span class=\"alertPrimaryMsg\">{{ltPropPrimaryMessage}}</span>\t\t\t\t\t\t\t\t\t\t</div></template>\t\t\t\t\t\t\t\t\t</template>\t\t\t\t\t\t\t\t\t<template is=\"if\" value=\"{{lyteUiIfEquals(ltPropSecondaryMessage,'')}}\">\t\t\t\t\t\t\t\t\t\t<template case=\"false\"><div>\t\t\t\t\t\t\t\t\t\t\t<span class=\"alertSecondaryMsg\">{{ltPropSecondaryMessage}}</span>\t\t\t\t\t\t\t\t\t\t</div></template>\t\t\t\t\t\t\t\t\t</template>\t\t\t\t\t\t\t\t</div>\t\t\t\t\t\t\t\t<div class=\"clearFloat\"></div>\t\t\t\t\t\t\t</div>\t\t\t\t\t\t</template></template>\t\t\t\t\t\t<template is=\"if\" value=\"{{lyteUiIsEmptyArray(ltPropButtons)}}\">\t\t\t\t\t\t\t<template case=\"false\"><div class=\"{{lyteUiConcat('alertFooter ',ltPropButtonPosition)}}\">\t\t\t\t\t\t\t\t<template is=\"for\" items=\"{{ltPropButtons}}\">\t\t\t\t\t\t\t\t\t<template is=\"if\" value=\"{{lyteUiIfEquals(item.type,'accept')}}\">\t\t\t\t\t\t\t\t\t\t<template case=\"true\"><lyte-button class=\"lyteAlertBtn\" onclick=\"{{action('accept',item.text)}}\">\t\t\t\t\t\t\t\t\t\t\t<template is=\"registerYield\" yield-name=\"text\">{{item.text}}</template>\t\t\t\t\t\t\t\t\t\t</lyte-button></template>\t\t\t\t\t\t\t\t\t</template>\t\t\t\t\t\t\t\t\t<template is=\"if\" value=\"{{lyteUiIfEquals(item.type,'reject')}}\">\t\t\t\t\t\t\t\t\t\t<template case=\"true\"><lyte-button class=\"lyteAlertBtn\" onclick=\"{{action('reject',item.text)}}\">\t\t\t\t\t\t\t\t\t\t\t<template is=\"registerYield\" yield-name=\"text\">{{item.text}}</template>\t\t\t\t\t\t\t\t\t\t</lyte-button></template>\t\t\t\t\t\t\t\t\t</template>\t\t\t\t\t\t\t\t</template>\t\t\t\t\t\t\t</div></template>\t\t\t\t\t\t</template>\t\t\t\t\t</div>\t\t\t\t\t<div class=\"{{lyteUiAddShowClass(ltPropShowCopy,'','alertFreezeLayer')}}\" style=\"{{lyteUiConcat('background:',ltPropDimmer.color,';','opacity:',ltPropDimmer.opacity)}}\"></div>\t\t\t\t</div>\t\t\t</template>\t\t</lyte-wormhole></template>\t</template></template>",
_dynamicNodes : [{"type":"attr","position":[1]},{"type":"if","position":[1],"cases":{"true":{"dynamicNodes":[{"type":"registerYield","position":[0,1],"dynamicNodes":[{"type":"attr","position":[1]},{"type":"attr","position":[1,1,1]},{"type":"if","position":[1,1,1],"cases":{"true":{"dynamicNodes":[{"type":"attr","position":[0]}]}},"default":{}},{"type":"attr","position":[1,1,3]},{"type":"if","position":[1,1,3],"cases":{"true":{"dynamicNodes":[{"type":"insertYield","position":[1]}]},"false":{"dynamicNodes":[{"type":"attr","position":[1]},{"type":"if","position":[1],"cases":{"false":{"dynamicNodes":[{"type":"text","position":[0,1,0]}]}},"default":{}},{"type":"attr","position":[3,1]},{"type":"if","position":[3,1],"cases":{"false":{"dynamicNodes":[{"type":"attr","position":[0,1]}]}},"default":{}},{"type":"attr","position":[3,3,1]},{"type":"if","position":[3,3,1],"cases":{"false":{"dynamicNodes":[{"type":"text","position":[0,1,0]}]}},"default":{}},{"type":"attr","position":[3,3,3]},{"type":"if","position":[3,3,3],"cases":{"false":{"dynamicNodes":[{"type":"text","position":[0,1,0]}]}},"default":{}}]}},"default":{}},{"type":"attr","position":[1,1,5]},{"type":"if","position":[1,1,5],"cases":{"false":{"dynamicNodes":[{"type":"attr","position":[0]},{"type":"attr","position":[0,1]},{"type":"for","position":[0,1],"dynamicNodes":[{"type":"attr","position":[1]},{"type":"if","position":[1],"cases":{"true":{"dynamicNodes":[{"type":"attr","position":[0]},{"type":"registerYield","position":[0,1],"dynamicNodes":[{"type":"text","position":[0]}]},{"type":"componentDynamic","position":[0]}]}},"default":{}},{"type":"attr","position":[3]},{"type":"if","position":[3],"cases":{"true":{"dynamicNodes":[{"type":"attr","position":[0]},{"type":"registerYield","position":[0,1],"dynamicNodes":[{"type":"text","position":[0]}]},{"type":"componentDynamic","position":[0]}]}},"default":{}}]}]}},"default":{}},{"type":"attr","position":[1,3],"attr":{"style":{"name":"style","helperInfo":{"name":"lyteUiConcat","args":["'background:'","ltPropDimmer.color","';'","'opacity:'","ltPropDimmer.opacity"]}}}}]},{"type":"componentDynamic","position":[0]}]}},"default":{}}],
_observedAttributes :["ltPropType","ltPropShow","ltPropWrapperClass","ltPropHeading","ltPropPrimaryMessage","ltPropSecondaryMessage","ltPropButtons","ltPropButtonPosition","ltPropShowCloseButton","ltPropCloseOnEscape","ltPropDimmer","ltPropAllowMultiple","ltPropTop","ltPropYield"],
	data: function(){
        return {
    		//config from callee
    		"ltPropType":Lyte.attr("string",{"default": "success"}),
    		"ltPropShow":Lyte.attr("boolean",{"default": false}),
            "ltPropWrapperClass":Lyte.attr("string",{"default": ""}),
    		"ltPropHeading":Lyte.attr("string",{"default": ""}),
    		"ltPropPrimaryMessage":Lyte.attr("string",{"default": ""}),
    		"ltPropSecondaryMessage":Lyte.attr("string",{"default": ""}),
    		"ltPropButtons":Lyte.attr("array",{"default": [{"type":"accept","text":"Ok"}]}),
    		"ltPropButtonPosition":Lyte.attr("string",{"default": "right"}),
    		"ltPropShowCloseButton":Lyte.attr("boolean",{"default": true}),
    		"ltPropCloseOnEscape":Lyte.attr("boolean",{"default": true}),
    		"ltPropDimmer":Lyte.attr("object",{"default":{"color":"black","opacity":"0.4"}}),
            "ltPropAllowMultiple":Lyte.attr("boolean",{"default": false}),
            "ltPropTop":Lyte.attr("string",{"default":"40px"}),
            "ltPropYield":Lyte.attr("boolean",{"default":false})
        }
	},
	showToggled : function() {
		if(this.$node.ltProp("show")){
			this.showAlert();
		}
		else{
			this.closeAlert();
		}
	}.observes('ltPropShow'),
	closeAlertFn : function(){
		if(this.getMethods("onClose")){
			this.executeMethod("onClose");	
		}
	},
    showAlert : function(){
        var self = this;
        setTimeout(function(){
            if(self.getData('ltPropTop') == "center"){
                var h = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
                self.actualModalDiv.style.top = (h - self.actualModalDiv.getBoundingClientRect().height)/2 + "px";
            }
            else{
                self.actualModalDiv.style.top = self.getData('ltPropTop');
            }
        },10);
        this.setData('ltPropShowCopy',true);
        if(this.getData('ltPropButtons')){
            var buttons = this.getData('ltPropButtons');
            var buttonComp;
            for(var i=0; i<buttons.length; i++){
                buttonComp = this.actualModalDiv.querySelectorAll(".lyteAlertBtn")[i];
                if(buttons[i].appearance){
                    buttonComp.setData('ltPropAppearance',buttons[i].appearance);
                }
                if(buttons[i].disabled){
                    buttonComp.setData('ltPropDisabled',buttons[i].disabled);
                }
                if(buttons[i].style){
                    buttonComp.setData('ltPropStyle',buttons[i].style);
                }
                if(buttons[i].color){
                    buttonComp.setData('ltPropColor',buttons[i].color);
                }
                if(buttons[i].backgroundColor){
                    buttonComp.setData('ltPropBackgroundColor',buttons[i].backgroundColor);
                }
                if(buttons[i].tabIndex){
                    buttonComp.setData('ltPropTabIndex',buttons[i].tabIndex);
                }
                if(buttons[i].type){
                    buttonComp.setData('ltPropType',buttons[i].type);
                }
                if(buttons[i].id){
                    buttonComp.setData('ltPropId',buttons[i].id);
                }
                if(buttons[i].class){
                    buttonComp.setData('ltPropClass',buttons[i].class);
                }
                if(buttons[i].autoFocus){
                    buttonComp.setData('ltPropAutoFocus',buttons[i].autoFocus);
                }
                if(buttons[i].lyteShortcut){
                    buttonComp.setData('ltPropLyteShortcut',buttons[i].lyteShortcut);
                }
                if(buttons[i].name){
                    buttonComp.setData('ltPropName',buttons[i].name);
                }
                if(buttons[i].value){
                    buttonComp.setData('ltPropValue',buttons[i].value);
                }
            }
            buttonComp = null;
        }
        LytePopup.addPopup(this);
    },
    closeAlert : function(){
        this.actualModalDiv.style.top = "-"+(this.actualModalDiv.getBoundingClientRect().height+this.actualModalDiv.getBoundingClientRect().top+40)+"px";
        var animDur = parseFloat(document.defaultView.getComputedStyle(this.actualModalDiv).getPropertyValue("transition-duration")) * 1000;
        var self = this;
        setTimeout(function(){
            self.setData('ltPropShowCopy',false);
        },animDur-100);
        this.closeAlertFn();

        LytePopup.closePopup(this);
        // this.actualModalDiv = null;
        // this.childComp = null;
    },
	actions: {
        wormholeDidConnect : function(){
            this.childComp = this.$node.querySelector('lyte-wormhole');
            this.actualModalDiv = this.childComp.querySelector(".alertPopup");
            LyteComponent.appendChild(document.body,this.childComp);
        },
		closeAlert : function(){
            this.$node.ltProp("show",false);            
		},
		accept : function(buttonText){
			if(this.getMethods("onAccept")){
				this.executeMethod("onAccept",buttonText);	
			}
            this.$node.ltProp("show",false);            
		},
		reject : function(buttonText){
			if(this.getMethods("onReject")){
				this.executeMethod("onReject",buttonText);	
			}
            this.$node.ltProp("show",false);
		}
	}
});
