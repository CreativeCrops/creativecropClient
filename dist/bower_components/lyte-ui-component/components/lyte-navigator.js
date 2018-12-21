Lyte.Component.register('lyte-navigator', {
_template:"<template tag-name=\"lyte-navigator\"><template is=\"if\" value=\"{{expHandlers(ltPropType,'==','default')}}\"><template case=\"true\">\t<div class=\"lyteNavigator\" onclick=\"{{action('prevent', event)}}\">\t\t<div class=\"lyteNavigator lyteDoubleBack lyteIconDoubleBack\" onclick=\"{{action('goFirst',event)}}\"></div>\t\t<div class=\"lyteNavigator lyteSingleBack lyteIconSingleBack\" onclick=\"{{action('onBackward',event)}}\"></div>\t\t<div class=\"lyteNavigatorMidPoint\">{{startRecord}} <span class=\"lyteNavigatorText\">{{ltPropMiddleText}}</span> {{endRecord}}</div> \t\t<div class=\"lyteNavigator lyteSingleFront lyteIconSingleFront\" onclick=\"{{action('onForward',event)}}\"></div>\t\t<div class=\"lyteNavigator lyteDoubleFront lyteIconDoubleFront\" onclick=\"{{action('goLast',event)}}\"></div>\t</div></template></template><template is=\"if\" value=\"{{expHandlers(ltPropType,'==','simple')}}\"><template case=\"true\">\t<div class=\"lyteNavigator\" onclick=\"{{action('prevent', event)}}\">\t<div class=\"lytepagination\">\t\t<div class=\"lyteNavArrow lyteDoubleBack hover\" onclick=\"{{action('goFirst',event)}}\"></div>\t\t\t<div class=\"lyteNavArrow lyteSingleBack hover\" onclick=\"{{action('onBackward',event)}}\">\t\t\t<lyte-yield yield-name=\"nav-arrow\"></lyte-yield>\t\t\t</div>\t\t\t<div class=\"lytepage\">\t\t\t\t<template is=\"for\" items=\"{{ltPropPaginationRange}}\" item=\"page\" indexval=\"pageno\">\t\t\t\t\t<a href=\"\" id=\"{{page}}\" class=\"lytesimple\" onclick=\"{{action('onSelect',event)}}\">{{unescape(page)}}</a>                </template>             </div>            <div class=\"lyteNavArrow lyteSingleFront hover\" onclick=\"{{action('onForward',event)}}\">\t\t\t</div>\t\t\t<div class=\"lyteNavArrow lyteDoubleFront hover\" onclick=\"{{action('goLast',event)}}\"></div>\t\t\t</div>\t</div>    </template></template>    <template is=\"if\" value=\"{{expHandlers(ltPropType,'==','border')}}\"><template case=\"true\">\t<div class=\"lyteNavigator\" onclick=\"{{action('prevent', event)}}\">\t<div class=\"lytepagination\">\t\t<div class=\"lyteNavArrowBorder lyteDoubleBack hover lyteborder\" onclick=\"{{action('goFirst',event)}}\"></div>\t\t\t<div class=\"lyteNavArrowBorder lyteSingleBack hover lyteborder\" onclick=\"{{action('onBackward',event)}}\">\t\t\t<lyte-yield yield-name=\"nav-arrow\"></lyte-yield>\t\t\t</div>\t\t\t<div class=\"lytepage\">\t\t\t\t<template is=\"for\" items=\"{{ltPropPaginationRange}}\" item=\"page\" indexval=\"pageno\">\t\t\t\t\t<a href=\"\" id=\"{{page}}\" class=\"lyteborder\" onclick=\"{{action('onSelect',event)}}\">{{unescape(page)}}</a>                </template>             </div>            <div class=\"lyteNavArrowBorder lyteSingleFront hover lyteborder\" onclick=\"{{action('onForward',event)}}\">\t\t\t</div>\t\t\t<div class=\"lyteNavArrowBorder lyteDoubleFront hover lyteborder\" onclick=\"{{action('goLast',event)}}\"></div>\t\t\t</div>\t</div>    </template></template></template>",
_dynamicNodes : [{"type":"attr","position":[0]},{"type":"if","position":[0],"cases":{"true":{"dynamicNodes":[{"type":"attr","position":[1]},{"type":"attr","position":[1,1]},{"type":"attr","position":[1,3]},{"type":"text","position":[1,5,0]},{"type":"text","position":[1,5,2,0]},{"type":"text","position":[1,5,4]},{"type":"attr","position":[1,7]},{"type":"attr","position":[1,9]}]}},"default":{}},{"type":"attr","position":[1]},{"type":"if","position":[1],"cases":{"true":{"dynamicNodes":[{"type":"attr","position":[1]},{"type":"attr","position":[1,1,1]},{"type":"attr","position":[1,1,3]},{"type":"insertYield","position":[1,1,3,1]},{"type":"attr","position":[1,1,5,1]},{"type":"for","position":[1,1,5,1],"dynamicNodes":[{"type":"attr","position":[1]},{"type":"text","position":[1,0]}]},{"type":"attr","position":[1,1,7]},{"type":"attr","position":[1,1,9]}]}},"default":{}},{"type":"attr","position":[3]},{"type":"if","position":[3],"cases":{"true":{"dynamicNodes":[{"type":"attr","position":[1]},{"type":"attr","position":[1,1,1]},{"type":"attr","position":[1,1,3]},{"type":"insertYield","position":[1,1,3,1]},{"type":"attr","position":[1,1,5,1]},{"type":"for","position":[1,1,5,1],"dynamicNodes":[{"type":"attr","position":[1]},{"type":"text","position":[1,0]}]},{"type":"attr","position":[1,1,7]},{"type":"attr","position":[1,1,9]}]}},"default":{}}],
_observedAttributes :["ltPropPerpage","ltPropValue","ltPropRecords","ltPropMoreRecords","ltPropMiddleText","ltPropRecordValue","ltPropType","ltPropPaginationRange","ltPropSelected","ltPropShowOnlyIcon"],
	init : function(){

		if(this.getMethods('beforeRender'))
            {
                this.executeMethod('beforeRender', this.$node);
            }

	},
	didConnect:function(){
		// var a=document.querySelector("lyte-arrow").textContent.length;
		// this.setData('ltPropArrowCount',a);

		this.buttonDisable.call(this);
		this.checkButton.call(this);
		if(this.getData("ltPropType")!="default")
		{   
			 var elems=this.$node.querySelectorAll('lyte-nav-arrow');
			if(elems.length==4)
        	{   
        		
        		$L('div.lyteDoubleBack', this.$node).e[0].appendChild(elems[0]);
        		$L('div.lyteSingleBack', this.$node).e[0].appendChild(elems[1]);
        		$L('div.lyteSingleFront', this.$node).e[0].appendChild(elems[2]);
        		$L('div.lyteDoubleFront', this.$node).e[0].appendChild(elems[3]);
        		
        	}
        	if(elems.length==2)
        	{   
        		$L('div.lyteDoubleBack', this.$node).e[0].style.display = "none";
        		$L('div.lyteSingleBack', this.$node).e[0].appendChild(elems[0]);
        		$L('div.lyteSingleFront', this.$node).e[0].appendChild(elems[1]);
        		$L('div.lyteDoubleFront', this.$node).e[0].style.display = "none";
        	}
        	// this.pagination();
        	// this.activeAdd();
        }
			if(this.getMethods('afterRender'))
            {  
                this.executeMethod('afterRender', this.$node);
            }
       		
       	
	}, 
	data: function(){
		return {
			ltPropPerpage:Lyte.attr("number", {"default":10}), 
			ltPropValue:Lyte.attr("number", {"default":0}), 
			ltPropRecords:Lyte.attr("number", {"default":undefined}), 
			ltPropMoreRecords:Lyte.attr("boolean", {"default":false}),
			ltPropMiddleText : Lyte.attr('string', {'default' : 'to'}),
			ltPropRecordValue:Lyte.attr("number", {"default":1}),
			ltPropType:Lyte.attr("string", {"default":'default'}),
			ltPropPaginationRange:Lyte.attr("array",{"default":undefined}),
			ltPropSelected:Lyte.attr("number",{"default":0}),
			ltPropShowOnlyIcon:Lyte.attr("boolean",{"default":false})
		}
	}, 
	buttonDisable:function(){
		
        if(!this.getMethods('onNext'))
        	{
        		$L('div.lyteSingleFront', this.$node).e[0].style.display = "none";
        	}
        
		if(!this.getMethods('onHome'))
        	{
        		$L('div.lyteDoubleBack', this.$node).e[0].style.display = "none";
        	}
		if(!this.getMethods('onEnd'))
        	{
        		$L('div.lyteDoubleFront', this.$node).e[0].style.display = "none";
        	}
        if(!this.getMethods('onPrevious'))
        	{
        		$L('div.lyteSingleBack', this.$node).e[0].style.display = "none";
        	}
        	
        if(this.getData('ltPropShowOnlyIcon')&& this.getData('ltPropType')!='default')
        	{
        		//console.log($L('div.lytepage', this.$node).e[0]);
        		$L('div.lytepage', this.$node).e[0].style.display = "none";
        	}
       
        
        
	}, 
	activeAdd:function()
	{

		if(this.getData("ltPropType")!='default'&&!this.getData('ltPropShowOnlyIcon'))
		{
			var a=this.$node.querySelector('a[href=""][id="'+this.getData('ltPropSelected')+'"]');
			a.classList.add('lyteActiveAdd');
		}
	},

	pagination:function(){
		var current = this.getData('ltPropSelected'),
        propRecord = this.getData('ltPropRecords'),
        delta = 1,
        left = current - delta,
        right = current + delta + 1,
        range = [],
        rangeWithDots = [],
        l,last;
        last = Math.ceil(propRecord/this.getData('ltPropPerpage'));

        if(last>5)
        {
        	if(current==1&&current!=last){
        		right+=1;
        	}
        	if(current==last&&current!=1){
        		left-=1;
        	}
	    	for (var i = 1; i < last; i++)
	    	{
	        	if (i == 1 || i == last || i >= left && i < right)
	        	{
	            	range.push(i); 
	        	}
	        	else if(i>1&& i<left)
	        	{
	        		i=left-1;
	        	}
	        	else if(i>=right&&i<last)
	        	{
	        		i=last-1;
	        	}
	        	
	        	
	    	}
	    	range.push(last);
			for (var i of range)
			{
	        	if (l)
	        	{
	             	if (i - l !== 1) 
	             	{
	               	 	rangeWithDots.push("&#8230;");
	            	}
	        	}
	        rangeWithDots.push(i);
	        l = i;
	    	}
    }
    else
    {
    	for(var i=1;i<=last;i++)
    	{
    		rangeWithDots.push(i);
    	}	
    }
    	this.setData("ltPropPaginationRange",rangeWithDots);
    	this.activeAdd();
},
paginationObs:function(){
this.pagination();
}.observes('ltPropSelected','ltPropPerpage'),
	
	checkButtonObs : function(){
		this.checkButton.call(this);
	}.observes('ltPropPerpage', 'ltPropValue', 'ltPropRecords', 'ltPropMoreRecords'),

	checkButton:function(){
		var firstIndex = this.getData('ltPropValue'), perPage = this.getData('ltPropPerpage'), MaxRecords = this.getData('ltPropRecords')
		var singleFront = $L('div.lyteSingleFront', this.$node).e[0], singleBack = $L('div.lyteSingleBack', this.$node).e[0], doubleBack = $L('div.lyteDoubleBack', this.$node).e[0], doubleFront = $L('div.lyteDoubleFront', this.$node).e[0];
		$L.fastdom.mutate(function(){
			if(firstIndex <= 0)
				{
					doubleBack.classList.add('lyteDisabled')
				}
				else
				{
					doubleBack.classList.remove('lyteDisabled')
				}
				
			if(firstIndex <= 0)
				{
					singleBack.classList.add('lyteDisabled')
				}
			else
				{
					singleBack.classList.remove('lyteDisabled')
				}	
			if((firstIndex + perPage >= MaxRecords) && !this.getData('ltPropMoreRecords'))
				{
					singleFront.classList.add('lyteDisabled')
				}
			else
				{
					singleFront.classList.remove('lyteDisabled')
				}	
				
			if((firstIndex + perPage >= MaxRecords))
				{
					doubleFront.classList.add('lyteDisabled')
				}
				else
				{
					doubleFront.classList.remove('lyteDisabled')
				}
				
		   	 if(this.getData("ltPropType")!="default"&&!this.getMethods('onSelect'))
	        	{
	        		$L('div.lytepage', this.$node).e[0].classList.add("lyteDisabled");
	        	}
			// if(this.getData('ltPropMoreRecords'))
			// 	{
					this.setData('startRecord', (firstIndex + 1) > MaxRecords ? MaxRecords : (firstIndex + 1))
					this.setData('endRecord', (firstIndex + perPage) > MaxRecords ? MaxRecords : firstIndex + perPage)
					if(this.getData("ltPropType")!="default")
					{
						this.setData("ltPropSelected",Math.ceil(this.getData('startRecord')/this.getData('ltPropPerpage')));
						var ele=this.$node.querySelectorAll('a[href=""][id="&#8230;"]');
						for(var i=0;i<ele.length;i++)
						{   
							// ele[i].classList.remove("lyteSinglePage");
							ele[i].classList.add("lyteDisabled");
						}
					}
				// }
			// else
			// 	{	
			// 		this.setData('startRecord', Math.ceil((firstIndex + 1) / perPage))
			// 		this.setData('endRecord', Math.ceil(MaxRecords / perPage))
			// 		this.setData('middleText', 'of')
			// 	}
		}.bind(this))
				
	}, 
	actions : {
			  "onForward" : function(evt){
			  	
			       		var firstIndex = this.getData('ltPropValue'), perPage = this.getData('ltPropPerpage'), MaxRecords = this.getData('ltPropRecords')
			       		firstIndex += perPage
			       		var z = (firstIndex) > MaxRecords ? MaxRecords : firstIndex;
			        	var actionName = this.getMethods('onNext');
			        	
			        	if(actionName)
				    	 {
				    		this.executeMethod('onNext', z, this.$node, evt)
				   		 }
				   		 
				}, 			
			 "onBackward" : function(evt){
				    var firstIndex = parseInt(this.getData('ltPropValue')), perPage = parseInt(this.getData('ltPropPerpage'))
			        firstIndex -= perPage
			        var z = (firstIndex) < 0 ? 0 : firstIndex;
			        if(this.getMethods('onPrevious'))
				    {
				    	this.executeMethod('onPrevious', z, this.$node, evt)
				    }
				    
				}, 
			 "goFirst" : function(evt){
				    this.setData('ltPropValue', 0, this.$node, evt);
			       if( this.getMethods('onHome'))
				    	 {
				    		this.executeMethod('onHome', this.getData('ltPropValue'), this.$node, evt);
				    		var singleFront = $L('div.lyteSingleFront', this.$node).e[0];singleFront.classList.remove('lyteDisabled')
				    	 }
				    if(this.getData('ltPropType')!="default")
				    {
				    	if(this.getData('ltPropSelected')>=1)
				        {   
				        	this.setData('ltPropSelected',1);

				        	
				        }
				    	this.activeAdd();
				    }
				}, 
			 "goLast" : function(evt){
				    var firstIndex = this.getData('ltPropValue'), perPage = this.getData('ltPropPerpage'), MaxRecords = this.getData('ltPropRecords')
				    var x = Math.floor(MaxRecords / perPage) * perPage >= MaxRecords ? MaxRecords - perPage : Math.floor(MaxRecords / perPage) * perPage;
			        if(this.getMethods('onEnd'))
				    	 {
				    		this.executeMethod('onEnd', x, this.$node, evt);
				    	}
				    
				},
			"onSelect" : function(evt){
			  	
			       		var firstIndex = this.getData('ltPropValue'), perPage = this.getData('ltPropPerpage'), MaxRecords = this.getData('ltPropRecords')
			       		firstIndex += perPage
			       		var x = (parseInt(evt.target.id) * perPage)-perPage >= MaxRecords ? MaxRecords - perPage : (parseInt(evt.target.id)*perPage)-perPage;
			        	var actionName = this.getMethods('onSelect');
			        	if(actionName)
				    	 {
				    		this.executeMethod('onSelect', x, this.$node, evt)
				   		 }
				   		 
				 		
				},
			'prevent' : function(evt){
					evt.preventDefault();
			   }	
	}
});