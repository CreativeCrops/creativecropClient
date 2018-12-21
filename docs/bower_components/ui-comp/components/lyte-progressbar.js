Lyte.Component.register('lyte-progressbar',{
_template:"<template tag-name=\"lyte-progressbar\">\t<template is=\"if\" value=\"{{lyteUiIfEquals(ltPropType,'circle')}}\">\t\t<template case=\"true\"><div class=\"lyteProgressBar lyteCircle\">\t\t\t<div class=\"lyteCircleType\">\t\t\t\t<svg class=\"svgValueEle\" width=\"{{lyteUiSetWH(ltPropRadius)}}\" height=\"{{lyteUiSetWH(ltPropRadius)}}\">\t\t\t\t    <circle style=\"{{lyteUiConcat('transition:','stroke-dashoffset ',duration,' ',timingfn,';')}}\" cx=\"{{ltPropRadius}}\" cy=\"{{ltPropRadius}}\" r=\"{{lyteUiSetRadius(ltPropRadius,ltPropStroke)}}\" fill=\"none\" stroke=\"#DCE0E3\" stroke-width=\"{{ltPropStroke}}\"></circle>\t\t\t\t    <circle style=\"{{lyteUiConcat('transition:','stroke-dashoffset ',duration,' ',timingfn,';')}}\" cx=\"{{ltPropRadius}}\" cy=\"{{ltPropRadius}}\" r=\"{{lyteUiSetRadius(ltPropRadius,ltPropStroke)}}\" fill=\"none\" stroke=\"{{ltPropBackground}}\" stroke-width=\"{{ltPropStroke}}\" stroke-dasharray=\"{{lyteUiSetDashArray(ltPropRadius,ltPropStroke)}}\" stroke-dashoffset=\"{{lyteUiSetOffset(ltPropRadius,ltPropStroke,percentage)}}\"></circle>\t\t\t\t</svg>\t\t\t\t<svg width=\"{{lyteUiSetWH(ltPropRadius)}}\" height=\"{{lyteUiSetWH(ltPropRadius)}}\" transform=\"{{lyteUiTextTransform(ltPropRadius)}}\" viewBox=\"{{lyteUiConcat('0 ','0 ',lyteUiSetWH(ltPropRadius),' ',lyteUiSetWH(ltPropRadius))}}\">\t\t\t\t\t<text font-size=\"1.5rem\" text-anchor=\"middle\" dy=\".2em\" x=\"50%\" y=\"50%\">{{lyteUiConcat(percentageDisplay,\"%\")}}</text>\t\t\t\t</svg>\t\t\t</div>\t\t</div></template>\t\t<template case=\"false\"><div class=\"lyteProgressBar lyteHorizontal\" style=\"{{lyteUiConcat('width:',ltPropWidth,';height:',ltPropHeight)}}\">\t\t\t<span class=\"lyteProgressStatus\" style=\"{{lyteUiConcat('width: ',percentage,'% ;','transition:','width ',duration,' ',timingfn,';','background:',ltPropBackground)}}\">\t\t\t\t<template is=\"if\" value=\"{{ltPropAnimated}}\">\t\t\t\t\t<template case=\"true\"><span class=\"ltPropProgressAnimated progressMovingObj\"></span></template>\t\t\t\t</template>\t\t\t\t<template is=\"if\" value=\"{{ltPropShowPercentage}}\">\t\t\t\t\t<template case=\"true\"><span class=\"lyteProgressPercentage\">{{lyteUiConcat(percentageDisplay,\"%\")}}</span></template>\t\t\t\t</template>\t\t\t</span>\t\t</div></template>\t</template></template>",
_dynamicNodes : [{"type":"attr","position":[1]},{"type":"if","position":[1],"cases":{"true":{"dynamicNodes":[{"type":"attr","position":[0,1,1]},{"type":"attr","position":[0,1,1,1],"attr":{"style":{"name":"style","helperInfo":{"name":"lyteUiConcat","args":["'transition:'","'stroke-dashoffset '","duration","' '","timingfn","';'"]}}}},{"type":"attr","position":[0,1,1,3],"attr":{"style":{"name":"style","helperInfo":{"name":"lyteUiConcat","args":["'transition:'","'stroke-dashoffset '","duration","' '","timingfn","';'"]}}}},{"type":"attr","position":[0,1,3]},{"type":"text","position":[0,1,3,1,0]}]},"false":{"dynamicNodes":[{"type":"attr","position":[0],"attr":{"style":{"name":"style","helperInfo":{"name":"lyteUiConcat","args":["'width:'","ltPropWidth","';height:'","ltPropHeight"]}}}},{"type":"attr","position":[0,1],"attr":{"style":{"name":"style","helperInfo":{"name":"lyteUiConcat","args":["'width: '","percentage","'% ;'","'transition:'","'width '","duration","' '","timingfn","';'","'background:'","ltPropBackground"]}}}},{"type":"attr","position":[0,1,1]},{"type":"if","position":[0,1,1],"cases":{"true":{"dynamicNodes":[]}},"default":{}},{"type":"attr","position":[0,1,3]},{"type":"if","position":[0,1,3],"cases":{"true":{"dynamicNodes":[{"type":"text","position":[0,0]}]}},"default":{}}]}},"default":{}}],
_observedAttributes :["ltPropValue","ltPropType","ltPropProgressFillColor","ltPropCompletedFillColor","ltPropWidth","ltPropHeight","ltPropRadius","ltPropStroke","ltPropValueCopy","ltPropAnimated","ltPropShowPercentage","ltPropProgressProperty","percentage","duration","timingfn","percentageDisplay"],
	didConnect: function(){
		// this.setData('ltPropValueCopy',this.getData('ltPropValue'));
		$L.fastdom.mutate(this.setBackground.bind(this))
	},
	data: function(){
		return {
			ltPropValue:Lyte.attr("string",{"default":'0'}),
			ltPropType:Lyte.attr("string",{"default":'bar'}),
			ltPropProgressFillColor:Lyte.attr("string",{"default":'#42a2eb'}),
			ltPropCompletedFillColor:Lyte.attr("string",{"default":'#3fbd5f'}),
			ltPropWidth:Lyte.attr("string",{"default":'100%'}),
			ltPropHeight:Lyte.attr("string",{"default":'12px'}),
			ltPropRadius:Lyte.attr("string",{"default":'50'}),
			ltPropStroke:Lyte.attr("string",{"default":'5'}),
			ltPropValueCopy:Lyte.attr("string",{"default":'0'}),
			ltPropAnimated:Lyte.attr("boolean",{"default": true}),
			ltPropShowPercentage:Lyte.attr("boolean",{"default": true}),
			ltPropProgressProperty : Lyte.attr('object',{"default" : {"value" : "0", "duration" : "0s"}}),
			percentage : Lyte.attr('string',{"default" : '0'}),
			duration : Lyte.attr('string',{"default" : '2s'}),
			timingfn : Lyte.attr('string',{"default" : 'linear'}),
			percentageDisplay : Lyte.attr('string',{"default" : '0'})

		}
	},
	didDestroy: function(){
		window.clearTimeout(this.getData('sid'))
	},
	percentageChange : function(obj){
		this.setBackground();
	}.observes('ltPropProgressProperty'),
	setBackground : function(){
		// this.setData('ltPropValue',Math.round(this.getData('ltPropValue')));
		// this.setData('ltPropValueCopy',this.getData('ltPropValue'));
		var value = parseFloat(this.getData('ltPropProgressProperty').value);
		var duration = this.getData('ltPropProgressProperty').duration ? this.getData('ltPropProgressProperty').duration : this.getData('duration');
		if(this.getData('ltPropProgressProperty').timingfn){
			this.setData('timingfn',this.getData('ltPropProgressProperty').timingfn);
		}
		if(this.getData('ltPropType') === 'circle'){
			if(parseInt(value) >= 100){
				this.setData('duration',duration);
				this.setData('percentage','100');
				duration = parseFloat(duration) * 1000;
				var self = this;
				this.sid = setTimeout(function(){
					self.sid = false;
					self.$node.querySelector('.lyteProgressBar').classList.add('lyteProgressCompleted');
					self.setData('ltPropBackground',self.getData('ltPropCompletedFillColor'));
				},duration);
			}
			else{
				// console.log(this.sid);
				if(this.sid){
					clearTimeout(this.sid);
					this.sid = false;
				}
				this.$node.querySelector('.lyteProgressBar').classList.remove('lyteProgressCompleted');
				this.setData('ltPropBackground',this.getData('ltPropProgressFillColor'));
				this.setData('duration',duration);
				this.setData('percentage',value + "");
			}
		}
		else{
			if(parseInt(value) >= 100){
				this.setData('duration',duration);
				this.setData('percentage','100');
				// this.$node.querySelector('.lyteProgressStatus').style.width = "100%";
				duration = parseFloat(duration) * 1000;
				var self = this;
				this.sid = setTimeout(function(){
					this.sid = false;
					self.$node.querySelector('.lyteProgressBar').classList.add('lyteProgressCompleted');
					self.setData('ltPropBackground',self.getData('ltPropCompletedFillColor'));
					if(self.getData('ltPropAnimated')){
						self.$node.querySelector('.lyteProgressBar .ltPropProgressAnimated').classList.remove('progressMovingObj');	
					}
				},duration);
			}
			else{
				if(this.sid){
					clearTimeout(this.sid);
					this.sid = false;
				}
				this.$node.querySelector('.lyteProgressBar').classList.remove('lyteProgressCompleted');
				this.setData('ltPropBackground',this.getData('ltPropProgressFillColor'));
				if(this.getData('ltPropAnimated')){
					this.$node.querySelector('.lyteProgressBar .ltPropProgressAnimated').classList.add('progressMovingObj');	
				}
				// debugger
				this.setData('duration',duration);
				this.setData('percentage',value + "");

				// this.$node.querySelector('.lyteProgressStatus').style.width = value + "%";
			}
		}
		if(this.iId){
			clearInterval(this.iId);
			this.iId = false;
		}
		var p = parseFloat(this.getData('percentageDisplay')),
		self = this;
		if(parseInt(this.getData('duration')) == 0){
			this.setData('percentageDisplay', value+"");
		}
		else if(p > value){
			var diff = p - value;
			var margin = ((diff / (parseInt(this.getData('duration')) * 1000)) * 100);
			this.iId = setInterval(function(){
				p -= margin;
				self.setData('percentageDisplay',Math.max(parseFloat(p.toFixed(2)), value) + "");
				if(parseFloat(p) == value){
					clearInterval(self.iId);
					self.iId = false;
				}
			}, 100)
		}
		else if(p < value){
			var diff = value - p;
			var margin = ((diff / (parseInt(this.getData('duration')) * 1000)) * 100);
			this.iId = setInterval(function(){
				p += margin;
				// console.log(p, p.toFixed(2), value, Math.min(parseFloat(p.toFixed(2)), value),margin)
				self.setData('percentageDisplay',Math.min(parseFloat(p.toFixed(2)), value) + "");
				if(parseFloat(p) >= value){
					clearInterval(self.iId);
					self.iId = false;
				}
			}, 100)
		}
		
	},
	setCircleStroke: function(circle,val){
		var per = circle.getAttribute('stroke-dasharray') * (1 - parseInt(val)/100);
		circle.setAttribute('stroke-dashoffset', per);
	},
	actions:{
		
	}
});