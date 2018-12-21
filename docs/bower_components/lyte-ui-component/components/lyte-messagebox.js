Lyte.Component.register("lyte-messagebox", {
_template:"<template tag-name=\"lyte-messagebox\">\t<template is=\"if\" value=\"{{ltPropShow}}\">\t\t<template case=\"true\"><lyte-wormhole style=\"visibility: hidden\">\t\t\t<template is=\"registerYield\" yield-name=\"lyte-content\">\t\t\t\t<div class=\"{{lyteUiConcatTypeClass(ltPropType,'MessageIcon','lyteMessageBox')}}\">\t\t\t\t\t<span class=\"lyteMessageBoxSymbol\"></span>\t\t\t\t\t<template is=\"if\" value=\"{{lyteUiIfEquals(ltPropMessage,'')}}\">\t\t\t\t\t\t<template case=\"false\"><div>\t\t\t\t\t\t\t<span class=\"lyteMessageBoxContent\">{{ltPropMessage}}</span>\t\t\t\t\t\t</div></template>\t\t\t\t\t</template>\t\t\t\t\t<span class=\"lyteMessageBoxClose\" onclick=\"{{action('closeMessageBox')}}\"></span>\t\t\t\t</div>\t\t\t</template>\t\t</lyte-wormhole></template>\t</template></template>",
_dynamicNodes : [{"type":"attr","position":[1]},{"type":"if","position":[1],"cases":{"true":{"dynamicNodes":[{"type":"registerYield","position":[0,1],"dynamicNodes":[{"type":"attr","position":[1]},{"type":"attr","position":[1,3]},{"type":"if","position":[1,3],"cases":{"false":{"dynamicNodes":[{"type":"text","position":[0,1,0]}]}},"default":{}},{"type":"attr","position":[1,5]}]},{"type":"componentDynamic","position":[0]}]}},"default":{}}],
_observedAttributes :["ltPropType","ltPropShow","ltPropMessage","ltPropDuration","ltPropOffset","ltPropTransition"],
	init : function() {

	},
	data : function(){
		return {
			"ltPropType":Lyte.attr("string",{"default":"success"}),
			"ltPropShow":Lyte.attr("boolean",{"default":false}),
			"ltPropMessage":Lyte.attr("string",{"default":""}),
			"ltPropDuration":Lyte.attr("string",{"default":"2000"}),
			"ltPropOffset":Lyte.attr("object",{"default":null}),
			"ltPropTransition":Lyte.attr("object",{"default":{"animation" : "fadeIn","duration" : "0.2s"}})
		}
	},
	setDuration : function(){
		var durationVal = this.$node.ltProp("duration");
		if(durationVal != ""){
			this.setData("ltPropDuration",durationVal);
		}
	}.observes('ltPropDuration'),
	computeOffsetImpl : function(){        
        // $L.fastdom.measure(function(){
        	var messageEle = this.actualMessageDiv;
	        var messageElePosition = messageEle.getBoundingClientRect();
	        var offsetObj = this.$node.ltProp('offset');
	        //console.log(offsetObj);

	        var w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
	        var h = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);

	        if(this.$node.ltProp('offset')){
	            if(offsetObj.left === "center" || offsetObj.right === "center" || offsetObj.left == undefined || offsetObj.left == ""){
	                var offLeft = (w - messageElePosition.width)/2;
	                if(offLeft < 0){
	                    offLeft = 20;
	                }
	                offsetObj.left = offLeft + "px";
	            }
	            if(offsetObj.top === "center" || offsetObj.bottom === "center"){
	                var offTop = (h - messageElePosition.height)/2;
	                if(offTop < 0){
	                    offTop = 20;
	                }
	                offsetObj.top = offTop + "px";
	            }            
	            if(offsetObj.right && offsetObj.right !== "center"){
	                if(offsetObj.right.indexOf("%") > -1){
	                    offsetObj.left = w-(messageElePosition.width+(w/parseFloat(offsetObj.right)))+"px";
	                }
	                else{
	                    offsetObj.left = w-(messageElePosition.width+parseFloat(offsetObj.right))+"px";   
	                }
	            }
	            if(offsetObj.bottom && offsetObj.bottom !== "center"){
	                if(offsetObj.bottom.indexOf("%") > -1){
	                    offsetObj.top = h-(messageElePosition.height+(h/parseFloat(offsetObj.bottom)))+"px";
	                }
	                else{
	                    offsetObj.top = h-(messageElePosition.height+parseFloat(offsetObj.bottom))+"px";   
	                }
	            }
	            if(!offsetObj.top){
	            	offsetObj.top = 20;
	            }
	            // $L.fastdom.mutate(function(){
	            	messageEle.style.left = parseFloat(offsetObj.left) + "px";
		            if(this.getData('ltPropTransition').animation != "slideFromTop"){
		            	this.actualMessageDiv.style.visibility = "visible";
		            	messageEle.style.top = parseFloat(offsetObj.top) + "px";
		            }
		            else{
		            	// messageEle.style.transitionDuration = this.getData('ltPropTransition').duration ? this.getData('ltPropTransition').duration : '0.2s';
		            	messageEle.style.top = -1 * messageElePosition.height + "px";
		            	this.childComp.style.visibility = "visible";
		            	this.actualMessageDiv.style.visibility = "visible";
		            	// $L.fastdom.mutate(function(){
		            		messageEle.style.transform = "translate(0px,"+ (parseFloat(offsetObj.top) + messageElePosition.height) +"px)";
		            	// })
		            }
	            // },this);
	        }
	        else{
	            var offsetLeft="",offsetTop="";
	            offsetLeft = (document.body.clientWidth - messageElePosition.width)/2;
	            // $L.fastdom.mutate(function(){
	            	messageEle.style.left = parseFloat(offsetLeft)+"px";
		            if(this.getData('ltPropTransition').animation != "slideFromTop"){
		            	this.actualMessageDiv.style.visibility = "visible";
		            	messageEle.style.top = "20px";
		            }
		            else{
		            	// messageEle.style.transitionDuration = this.getData('ltPropTransition').duration ? this.getData('ltPropTransition').duration : '0.2s';
		            	messageEle.style.top = -1 * messageElePosition.height + "px";
		            	this.childComp.style.visibility = "visible";
		            	this.actualMessageDiv.style.visibility = "visible";
		            	// $L.fastdom.mutate(function(){
		            		messageEle.style.transform = "translate(0px,"+ (messageElePosition.height + 20) +"px)";
		            	// });
		            }
	            // },this);
	        }
        // },this);
    },
    closeMessageBoxFn : function(){
    	//console.log("Here");
		if(this.getMethods("onClose")){
			this.executeMethod("onClose");	
		}
	},
	showToggled : function() {
		if(this.$node.ltProp("show")){
			var duration = parseInt(this.getData("ltPropDuration"));
	        var self = this;
	        this.timeOutId = setTimeout(function(){
	        	//console.log("timeOut");
	        	if(self.getData('ltPropTransition').animation != "slideFromTop"){
	        		self.actualMessageDiv.classList.remove('lyteMessageBoxFadeIn');
	        		self.actualMessageDiv.classList.add('lyteMessageBoxFadeOut');
	        		setTimeout(function(){
		        		self.setData("ltPropShow",false);	
		        	},500);
	        	}
	        	else{
	        		self.actualMessageDiv.style.transform = "";
	        		setTimeout(function(){
		        		self.setData("ltPropShow",false);	
		        	},500);
	        	}
	        	
	        },duration);
		}
		else{
			this.closeMessageBoxFn();
		}
	}.observes('ltPropShow'),
	actions : {
		wormholeDidConnect : function(){
			this.childComp = this.$node.querySelector("lyte-wormhole");
			this.actualMessageDiv = this.childComp.querySelector(".lyteMessageBox");
			this.actualMessageDiv.style.position = "fixed";
			LyteComponent.appendChild(document.body,this.childComp);
			// $L.fastdom.mutate(function(){
				if(this.getData('ltPropTransition').animation == "slideFromTop"){
					this.actualMessageDiv.classList.add('lyteMessageBoxSlideFromTop');
					this.computeOffsetImpl();
				}
				else{
					this.computeOffsetImpl();
					this.actualMessageDiv.classList.add('lyteMessageBoxFadeIn');
					this.childComp.style.visibility = "visible";
				}
			// },this);
			
		},
		closeMessageBox : function(){
			clearTimeout(this.timeOutId);
			var self = this;
			if(self.getData('ltPropTransition').animation != "slideFromTop"){
        		self.actualMessageDiv.classList.remove('lyteMessageBoxFadeIn');
        		self.actualMessageDiv.classList.add('lyteMessageBoxFadeOut');
        		setTimeout(function(){
	        		self.setData("ltPropShow",false);	
	        	},500);
        	}
        	else{
        		self.actualMessageDiv.style.transform = "";
        		setTimeout(function(){
	        		self.setData("ltPropShow",false);	
	        	},200);
        	}
		}
	}
	

});
