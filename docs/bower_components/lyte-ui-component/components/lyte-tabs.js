/*
    Notes :
        1. Added ltPropHeight property to set the height of the tab.
*/

Lyte.Component.register("lyte-tabs", {
_template:"<template tag-name=\"lyte-tabs\">\t<template is=\"if\" value=\"{{ltPropYield}}\"><template case=\"true\">\t\t<lyte-yield yield-name=\"tabYield\"></lyte-yield>\t</template></template></template>",
_dynamicNodes : [{"type":"attr","position":[1]},{"type":"if","position":[1],"cases":{"true":{"dynamicNodes":[{"type":"insertYield","position":[1]}]}},"default":{}}],
_observedAttributes :["ltPropYield","ltPropHover","ltPropActiveClass","ltPropPosition","ltPropOpenTabOn","ltPropNewContent","ltPropCloseIcon","prevTarget","ltPropHeight"],
    init : function(){
        this.$node.addTab = function(newTab){
            this.component.constructTabs(this,newTab);
        };
        this.$node.deleteTab = function(tabId){
            this.component.deleteTabContent(tabId);
        };
        this.$node.openTab = function(tabId){
            this.component.openTabContent(tabId);
        };
    },

    data : function(){
        return {
            "ltPropYield" : Lyte.attr("boolean",{"default":true}),
            "ltPropHover" : Lyte.attr("string",{"default":"lyteTabHover"}),
            "ltPropActiveClass" : Lyte.attr("string",{"default":"lyteTabActive"}),
            "ltPropPosition" : Lyte.attr("object",{"default":{'pos' : 'top', 'align' : 'left'}}),
            "ltPropOpenTabOn" : Lyte.attr("string",{"default":"click"}),
            "ltPropNewContent" : Lyte.attr("array",{"default":[]}),
            "ltPropCloseIcon" : Lyte.attr("boolean",{"default":false}),
            // "ltPropChangedHeader" : Lyte.attr("boolean",{"default":false}),
            "prevTarget" : Lyte.attr("object",{"default":null}),
            "ltPropHeight" : Lyte.attr("string",{"default":"400px"})
        }       
    },

    initialFunc : function(){
        
        //Checking whether the lyte-tabs is having any content or not by counting its child element for avoiding unnecessary error
        if(this.$node.childElementCount > 1 || this.$node.children[0].tagName === "LYTE-TAB"){

            //Checking the format provided by user for lyte-tabs
            /* **-- NOT REQUIRED NOW --**   --   If the format is Format 2 then convert it to format 1 
            if(this.$node.firstElementChild.tagName === "LYTE-TAB"){
                var node = this.$node.cloneNode(true);
                this.$node.innerHTML = "";
                this.$node.append(document.createElement('lyte-tab-head'));
                this.$node.append(document.createElement('lyte-tab-body'));
                var childNodes = node.querySelectorAll('lyte-tab');
                for(var v=0; v<childNodes.length ; v++){
                    this.constructTabs(this.$node,childNodes[v]);
                }
            }
            **-- NOT REQUIRED NOW --** */
            var head = this.$node.querySelector('lyte-tab-head');
            $L(head).addClass('lyteTabNav');
            var position = this.getData("ltPropPosition");
            var labels = this.getHeader(head.children);
            var contents = this.getContent(this.$node.querySelector('lyte-tab-body').children);
            var active = this.getData('ltPropActiveClass');
            var pos;
            this.setPosition(position);
            if(position.pos === "bottom"){
                $L.fastdom.measure(function() {
                    var navHeight = this.$node.querySelector('.lyteTabNav').getBoundingClientRect().height;
                    var thisHeight = this.$node.clientHeight;
                    $L.fastdom.mutate(function() {
                        this.$node.querySelector('.lyteTabNav').style.top = (thisHeight - navHeight) + "px";
                    },this);
                },this);
            }
            // debugger
            if(this.getData('ltPropCloseIcon')){
                this.createCloseIcon(this.$node.querySelector('lyte-tab-head').querySelectorAll('lyte-tab-title'));
            }
            
            var clickFn = function(event){this.showTab(event)};
            var mouseoverFn = function(event){this.mouseOver(event)};
            var mouseoutFn = function(event){this.mouseOut(event)};

            //Binds the events to tab-head
            head.addEventListener('click',clickFn.bind(this),true);
            head.addEventListener('mouseover',mouseoverFn.bind(this),true);
            head.addEventListener('mouseout',mouseoutFn.bind(this),true);

            //To open a tab content
            for(var i=0;i<labels.length;i++){
                if($L(labels[i]).hasClass(active)){
                    pos = i;
                }
            }
            for(var i=0;i<contents.length;i++){
                if(pos && pos === i){
                    // contents[i].classList.add('lyteTabShow');
                    this.executeOnBeforeOpen(labels[pos].getAttribute('lt-prop-id'),null);
                    $L(contents[i]).addClass('lyteTabShow');
                    this.executeOnOpen(labels[pos].getAttribute('lt-prop-id'),null);
                }
                else{
                    // contents[i].classList.add('lyteTabHide');
                    $L(contents[i]).addClass('lyteTabHide');
                }
            }
            if(!pos){
                pos=0;
                this.executeOnBeforeOpen(labels[0].getAttribute('lt-prop-id'),null);
                labels[0].classList.add(active);
                $L(contents[0]).removeClass('lyteTabHide');
                $L(contents[0]).addClass('lyteTabShow');
                this.executeOnOpen(labels[0].getAttribute('lt-prop-id'));
            }
            this.setData('prevTarget',labels[pos]);

            $L.fastdom.measure(function() {    //Sets the height and width of the tab label and content based on the given values and positions.
                var cs = window.getComputedStyle(this.$node);
                var borderDimensionY = ((cs.borderTop ? parseFloat(cs.borderTop) : 0) +
                                     (cs.borderBottom ? parseFloat(cs.borderBottom) : 0));
                var navHeight = this.$node.querySelector('.lyteTabNav').getBoundingClientRect().height;
                var thisHeight = parseInt(this.getData('ltPropHeight')) - borderDimensionY;
                $L.fastdom.mutate(function() {
                    if(position.pos === "left" || position.pos === "right"){
                        this.$node.querySelector('.lyteTabNav').style.height = thisHeight + "px";
                        this.$node.querySelector('lyte-tab-body').style.height = thisHeight + "px";
                    }
                    if(position.pos === "top" || position.pos === "bottom"){
                        this.$node.querySelector('lyte-tab-body').style.height = (thisHeight - navHeight) + "px";
                    }
                    this.makeAlignment(this.getData("ltPropPosition"));
                },this);
            },this);
            
            this.customizeTitleTab(position.pos);
        }
        else{
            console.error("No content detected");
        }
        
    }.observes('ltPropPosition').on('didConnect'),

    showTab : function(event){
        var target = event.target;
        while(target.parentElement && target.tagName != 'LYTE-TAB-TITLE'){
            target = target.parentElement;
        }
        if(target.tagName == 'HTML'){
            return;
        }
        var id = target.getAttribute('lt-prop-id');

        //If user has clicked on the close icon
        if($L(event.target).hasClass('lyteTabCloseIcon')){
            this.deleteTabContent(id);
            this.makeAlignment(this.getData('ltPropPosition'));
            target = (this.$node.querySelector('lyte-tab-head').querySelectorAll('lyte-tab-title').length > 0) ? this.$node.querySelector('lyte-tab-head').querySelectorAll('lyte-tab-title')[0] : null;
            if(!target){
                this.setData('prevTarget',null);
                return
            }
            id = target.getAttribute('lt-prop-id');
        }
        // this.executeOnBeforeOpen(id,this.getData('prevTarget').getAttribute('lt-prop-id'));
        this.openTabContent(id);
        // this.executeOnOpen(id);
        this.setData('prevTarget',target);
    },

    mouseOver : function(event){
        // console.log("over");
        var target = event.target;
        // console.log(target);
        while(target.parentElement && target.tagName != 'LYTE-TAB-TITLE'){
            target = target.parentElement;
        }
        if(target.tagName == 'HTML'){
            return;
        }
        var hover = this.getData('ltPropHover');
        // event.currentTarget.classList.add(hover);
        $L(target).addClass(hover);
    },

    mouseOut : function(event){
        // console.log("out");
        var target = event.target;
        while(target.parentElement && target.tagName != 'LYTE-TAB-TITLE'){
            target = target.parentElement;
        }
        if(target.tagName == 'HTML'){
            return;
        }
        var hover = this.getData('ltPropHover');
        // event.currentTarget.classList.remove(hover);
        $L(target).removeClass(hover);
    },

    getContent : function(children){
        var contents = [];
        for(var i = 0; i<children.length; i++){
            if(children[i].tagName == "LYTE-TAB-CONTENT"){
                contents.push(children[i]);
            }
        }
        return contents;
    },
    getHeader : function(children){
        var headers = [];
        for(var i = 0; i<children.length; i++){
            if(children[i].tagName == "LYTE-TAB-TITLE"){
                headers.push(children[i]);
            }
        }
        return headers;
    },


    //Changes tabs in Format 2 to Format 1 structure
    //Also creates new tab if called from the addTab function
    constructTabs : function(parentEle,node){
        var title = "";
        var content = "";
        var id;
        var isObject = false;
        var titleEle = document.createElement('lyte-tab-title');
        var contentEle = document.createElement('lyte-tab-content');
        if(typeof node === "object" && node.tagName === "LYTE-TAB"){
            title = node.getAttribute("lt-prop-title");
            content = node.innerHTML;
            id = node.getAttribute("lt-prop-id");
        }
        else{
            title = node.title;
            content = node.content;
            id = node.id;
            isObject = true;
        }
        if(!id){
            id = this.generateId(title);
        }
        titleEle.innerHTML = title;
        contentEle.innerHTML = content;
        titleEle.setAttribute('lt-prop-id',id);
        contentEle.id = id;
        $L(contentEle).addClass('lyteTabHide');
        parentEle.querySelector('lyte-tab-head').append(titleEle);
        parentEle.querySelector('lyte-tab-body').append(contentEle);

        //Checks whether the format is changed or a new tab is added
        //If a new tab is added it will execute the code inside this if-block
        if(isObject){
            // var clickFn = function(event){this.showTab(event)};
            // var mouseoverFn = function(event){this.mouseOver(event)};
            // var mouseoutFn = function(event){this.mouseOut(event)};
            // titleEle.addEventListener('click',clickFn.bind(this));
            // titleEle.addEventListener('mouseover',mouseoverFn.bind(this));
            // titleEle.addEventListener('mouseout',mouseoutFn.bind(this));
            if(this.getData('ltPropCloseIcon')){
                this.createCloseIcon(new Array(titleEle));
            }
            this.makeAlignment(this.getData('ltPropPosition'));
        }
    },

    deleteTabContent : function(tabId){
        if(tabId){
            var content = this.$node.querySelector('#'+tabId);
            var headers = this.$node.querySelector('lyte-tab-head').querySelectorAll('lyte-tab-title');
            var isCustomized = false;
            for(var v=0 ; v<headers.length ;v++){
                if(headers[v].getAttribute('lt-prop-id') === tabId){
                    if($L(headers[v]).hasClass('lyteTabCustomTitleWidth')){
                        isCustomized = true;
                    }
                    this.$node.querySelector('lyte-tab-head').removeChild(headers[v]);
                    if(content){
                        this.$node.querySelector('lyte-tab-body').removeChild(content);
                    }
                    break;
                }
            }
            if(isCustomized){
                this.customizeTitleTab("afterDelete");
            }
        }
    },

    openTabContent : function(tabId){
        if(tabId){
            this.hideAll();
            var headers = this.$node.querySelector('lyte-tab-head').querySelectorAll('lyte-tab-title');
            var content = this.$node.querySelector('#'+tabId);
            for(var v=0 ; v<headers.length ;v++){
                if(headers[v].getAttribute('lt-prop-id') === tabId){
                    this.executeOnBeforeOpen(tabId,this.getData('prevTarget') ? this.getData('prevTarget').getAttribute('lt-prop-id') : null);
                    $L(headers[v]).addClass(this.getData('ltPropActiveClass'));
                    if(content){
                        $L(content).removeClass('lyteTabHide');
                        $L(content).addClass('lyteTabShow');
                    }
                    this.executeOnOpen(tabId);
                    break;
                }
            }
        }
    },

    createCloseIcon : function(headers){
        for(var v=0;v<headers.length;v++){
            var span = document.createElement('span');
            span.innerHTML = headers[v].innerHTML;
            // span.style.float = "left";
            headers[v].innerHTML = "";
            headers[v].appendChild(span);
            var closeSpan = document.createElement('span');
            closeSpan.classList.add('lyteTabCloseIcon');
            // closeSpan.style.marginTop = (headers[0].getBoundingClientRect().height - 9 - 2) / 2 + 'px';
            headers[v].appendChild(closeSpan);
        }
    },

    setPosition : function(position){
        switch(position.pos){
            case "left" : $L(this.$node).addClass('lyteTabDefaultLeft');/*this.setHeight("left");*/break;
            case "right" : $L(this.$node).addClass('lyteTabDefaultRight');/*this.setHeight("right");*/break;
            case "top" : $L(this.$node).addClass('lyteTabDefaultTop');/*this.setHeight("top");*/break;
            case "bottom" : $L(this.$node).addClass('lyteTabDefaultBottom');/*this.setHeight("bottom");*/break;
        }

    },

    setHeight : function(prop){
    	$L.fastdom.measure(function() {
    		var thisHeight = this.$node.clientHeight;
    		var navHeight = this.$node.querySelector('.lyteTabNav').getBoundingClientRect().height;
	        $L.fastdom.mutate(function() {
		        if(prop === "left" || prop === "right"){
		            this.$node.querySelector('.lyteTabNav').style.height = thisHeight + 'px';
		            this.$node.querySelector('lyte-tab-body').style.height = thisHeight + 'px';
		        }
		        else{
		            this.$node.querySelector('lyte-tab-body').style.height = (thisHeight - navHeight) + 'px';
		        }
		    },this);
	    },this);
    },

    hideAll : function(){
        var labels = this.getHeader(this.$node.querySelector('lyte-tab-head').children);
        var contents = this.getContent(this.$node.querySelector('lyte-tab-body').children);
        var active = this.getData('ltPropActiveClass');
        for(var i=0;i<labels.length;i++){
            if($L(labels[i]).hasClass(active)){
                $L(labels[i]).removeClass(active);
            }
        }
        for(var v=0;v<contents.length;v++){
            if($L(contents[v]).hasClass('lyteTabShow')){
                $L(contents[v]).removeClass('lyteTabShow');
                $L(contents[v]).addClass('lyteTabHide');
            }
            if(!$L(contents[v]).hasClass('lyteTabHide')){
                $L(contents[v]).addClass('lyteTabHide');
            }
        }
    },

    customizeTitleTab : function(prop){
    	$L.fastdom.measure(function() {
    		var compWidth = this.$node.querySelector('lyte-tab-head').getBoundingClientRect().width;
	        if(prop === "top" || prop === "bottom"){
	            var totalWidth = 0;
	            var width = 0;
	            var titles = this.$node.querySelector('lyte-tab-head').querySelectorAll('lyte-tab-title');
	            for(var i=0;i<titles.length;i++){
	                totalWidth = totalWidth + titles[i].getBoundingClientRect().width;
	            }
	            if(totalWidth > compWidth){
	                width = compWidth / titles.length;
	                $L.fastdom.mutate(function() {
		                for(var i=0;i<titles.length;i++){
		                    titles[i].style.width = width + "px";
		                    $L(titles[i]).addClass('lyteTabCustomTitleWidth');
		                }
	           		});
	            }

	        }
	        if(prop === "afterDelete"){
	            var titles = this.$node.querySelector('lyte-tab-head').querySelectorAll('lyte-tab-title');
	            var width = compWidth / titles.length;
	            $L.fastdom.mutate(function() {
		            for(var i=0;i<titles.length;i++){
		                titles[i].style.width = width + "px";
		            }
		        });
	        }
    	},this);
    },

    makeAlignment : function(position){
        var headers = this.$node.querySelector('lyte-tab-head').querySelectorAll('lyte-tab-title');
        if(headers.length > 0){
        	$L.fastdom.measure(function() {
        		var lastHeader = headers[headers.length - 1].getBoundingClientRect();
        		var firstHeader = headers[0].getBoundingClientRect();
        		var head = this.$node.querySelector('lyte-tab-head').getBoundingClientRect();

	            var headersWidth = lastHeader.right - firstHeader.left;
	            var headersHeight = lastHeader.bottom - firstHeader.top;
	            var compWidth = head.width;
	            var compHeight = head.height;
	            if(position.pos === "left" || position.pos === "right"){
	                if(headersHeight+1 < compHeight){
	                    var diff = compHeight - (headersHeight);
	                    $L.fastdom.mutate(function() {
		                    if(position.align === "center"){
		                        headers[0].style.marginTop = diff/2 + "px";
		                    }
		                    if(position.align === "bottom"){
		                        headers[0].style.marginTop = diff + "px";
	                    	}
	                	});
	                }
	            }
	            if(position.pos === "top" || position.pos === "bottom"){
	                if(headersWidth+1 < compWidth){
	                    var diff = compWidth - (headersWidth+1);
	                    $L.fastdom.mutate(function() {
		                    if(position.align === "center"){
		                        headers[0].style.marginLeft = diff/2 + "px";
		                    }
		                    else if(position.align === "right"){
		                        for(var i =0;i< headers.length;i++){
		                            headers[i].style.float = "right";
		                        }
		                    }
		                });
	                }
	            }
            },this);
        }
    },

    executeOnBeforeOpen : function(targetId,prevEleId){
        if(this.getMethods('onBeforeOpen')){
            this.executeMethod('onBeforeOpen',this.$node.querySelector("#"+targetId),this.$node.querySelector("#"+prevEleId));
        }
    },

    executeOnOpen : function(targetId){
        if(this.getMethods('onOpen')){
            this.executeMethod('onOpen',this.$node.querySelector("#"+targetId));
        }
    },

    generateId : function(text){
        while(text.indexOf(" ") !== -1){
            text = text.replace(" ","_");
        }
        return text;
    }
});
