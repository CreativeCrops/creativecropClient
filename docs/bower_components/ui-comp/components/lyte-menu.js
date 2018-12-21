Lyte.Component.register("lyte-menu",{
_template:"<template tag-name=\"lyte-menu\">\t<lyte-menu-box>\t<template is=\"if\" value=\"{{expHandlers(ltPropYield,'==',false)}}\"><template case=\"true\">\t\t\t<lyte-menu-body id=\"{{ltPropId}}\" class=\"{{ltPropClass}}\" tabindex=\"1\">\t\t\t\t<template is=\"for\" items=\"{{ltPropContent}}\" item=\"menu\" index=\"indexVal\"><template is=\"if\" value=\"{{lyteUiOptGroupCheck(menu)}}\"><template case=\"true\">\t\t\t\t\t\t\t        <lyte-menu-group elemorder=\"{{indexVal}}\">\t\t\t\t\t\t\t           <lyte-menu-header><b>{{lyteUiReturnOnlyKey(menu)}}</b></lyte-menu-header>\t\t\t\t\t\t\t              <template is=\"for\" items=\"{{lyteUiReturnOnlyValue(menu)}}\" item=\"menu1\" index=\"indexVal1\"><template is=\"if\" value=\"{{expHandlers(lyteUiIsObject(menu1),'==',false)}}\"><template case=\"true\">\t\t\t\t\t\t                                   <lyte-menu-item grporder=\"{{indexVal}}\" elemorder=\"{{indexVal1}}\" data-value=\"{{menu1}}\">\t\t\t\t\t\t                                          <lyte-menu-label>{{menu1}}</lyte-menu-label>\t\t\t\t\t\t                                    </lyte-menu-item>\t\t\t\t\t\t\t                          </template><template case=\"false\">\t\t\t\t\t                                      <lyte-menu-item grporder=\"{{indexVal}}\" elemorder=\"{{indexVal1}}\" id=\"{{menu1.id}}\" class=\"{{menu1.class}}\" data-value=\"{{menu1[ltPropSystemValue]}}\">\t\t\t\t\t                                          <lyte-menu-label>{{menu1[ltPropUserValue]}}</lyte-menu-label>\t\t\t\t\t                                              <template is=\"if\" value=\"{{menu1[ltPropDescription]}}\"><template case=\"true\">\t\t\t\t\t                                                  <lyte-menu-description> {{menu1[ltPropDescription]}}</lyte-menu-description>\t\t\t\t\t                                              </template></template>\t\t\t\t\t                                      </lyte-menu-item>\t\t\t\t\t                                </template></template></template>\t\t\t\t\t\t\t      </lyte-menu-group>\t\t\t\t\t      </template><template case=\"false\"><template is=\"if\" value=\"{{expHandlers(lyteUiIsObject(menu),'==',false)}}\"><template case=\"true\">\t\t\t                         <lyte-menu-item elemorder=\"{{indexVal}}\" data-value=\"{{menu}}\">\t\t\t                                <lyte-menu-label>{{menu}}</lyte-menu-label>\t\t\t                          </lyte-menu-item>\t\t\t\t                  </template><template case=\"false\">\t\t\t\t                        <lyte-menu-item elemorder=\"{{indexVal}}\" id=\"{{menu.id}}\" class=\"{{menu.class}}\" data-value=\"{{menu[ltPropSystemValue]}}\">\t\t\t\t                            <lyte-menu-label>{{menu[ltPropUserValue]}}</lyte-menu-label>\t\t\t\t                                <template is=\"if\" value=\"{{menu[ltPropDescription]}}\"><template case=\"true\">\t\t\t\t                                    <lyte-menu-description> {{menu[ltPropDescription]}}</lyte-menu-description>\t\t\t\t                                </template></template>\t\t\t\t                        </lyte-menu-item>\t\t\t\t                  </template></template></template></template></template>\t\t    </lyte-menu-body>\t      </template><template case=\"false\">\t   \t\t\t<lyte-yield yield-name=\"yield\"></lyte-yield>\t   \t   </template></template>\t   </lyte-menu-box>\t   \t    </template>",
_dynamicNodes : [{"type":"attr","position":[1,1]},{"type":"if","position":[1,1],"cases":{"true":{"dynamicNodes":[{"type":"attr","position":[1]},{"type":"attr","position":[1,1]},{"type":"for","position":[1,1],"dynamicNodes":[{"type":"attr","position":[0]},{"type":"if","position":[0],"cases":{"true":{"dynamicNodes":[{"type":"attr","position":[1]},{"type":"text","position":[1,1,0,0]},{"type":"componentDynamic","position":[1,1]},{"type":"attr","position":[1,3]},{"type":"for","position":[1,3],"dynamicNodes":[{"type":"attr","position":[0]},{"type":"if","position":[0],"cases":{"true":{"dynamicNodes":[{"type":"attr","position":[1]},{"type":"text","position":[1,1,0]},{"type":"componentDynamic","position":[1,1]},{"type":"componentDynamic","position":[1]}]},"false":{"dynamicNodes":[{"type":"attr","position":[1]},{"type":"text","position":[1,1,0]},{"type":"componentDynamic","position":[1,1]},{"type":"attr","position":[1,3]},{"type":"if","position":[1,3],"cases":{"true":{"dynamicNodes":[{"type":"text","position":[1,1]},{"type":"componentDynamic","position":[1]}]}},"default":{}},{"type":"componentDynamic","position":[1]}]}},"default":{}}]},{"type":"componentDynamic","position":[1]}]},"false":{"dynamicNodes":[{"type":"attr","position":[0]},{"type":"if","position":[0],"cases":{"true":{"dynamicNodes":[{"type":"attr","position":[1]},{"type":"text","position":[1,1,0]},{"type":"componentDynamic","position":[1,1]},{"type":"componentDynamic","position":[1]}]},"false":{"dynamicNodes":[{"type":"attr","position":[1]},{"type":"text","position":[1,1,0]},{"type":"componentDynamic","position":[1,1]},{"type":"attr","position":[1,3]},{"type":"if","position":[1,3],"cases":{"true":{"dynamicNodes":[{"type":"text","position":[1,1]},{"type":"componentDynamic","position":[1]}]}},"default":{}},{"type":"componentDynamic","position":[1]}]}},"default":{}}]}},"default":{}}]},{"type":"componentDynamic","position":[1]}]},"false":{"dynamicNodes":[{"type":"insertYield","position":[1]}]}},"default":{}},{"type":"componentDynamic","position":[1]}],
_observedAttributes :["ltPropContent","ltPropId","ltPropClass","ltPropQuery","ltPropEvent","ltPropYield","ltPropUserValue","ltPropSystemValue","ltPropCallout","ltPropPosition","ltPropDescription","ltPropTabIndex","ltPropFreeze","ltPropShow","ltPropWidth","ltPropHeight","ltPropQueryClass","ltPropBoundary","ltPropScope","ltPropPreventInsideClick","ltPropAnimate","ltPropSetCss","eventListeners","pos","parIndex"],
init : function(){
	var event = this.getData('ltPropEvent');
	var evt = this.checkElementForMenu.bind(this);
	this.setData('eventListeners.event', evt);
	this._close = this.closing.bind( this )
	document.addEventListener(event == 'mouseenter' ? 'mousemove' : event, evt, true);
	this.menuNodes = [];
	if(!document.querySelector('.lytemenufreezelayer') && this.$node.ltProp('freeze')){
			this.appendFreeze.call(this, 'lytemenufreezelayer left lyteMenuHidden')
			this.appendFreeze.call(this, 'lytemenufreezelayer top lyteMenuHidden')
			this.appendFreeze.call(this, 'lytemenufreezelayer bottom lyteMenuHidden')
			this.appendFreeze.call(this, 'lytemenufreezelayer right lyteMenuHidden')
			this.appendFreeze.call(this, 'lytemenufreezelayer nogroup lyteMenuHidden')
			$L('div.nogroup.lytemenufreezelayer').e[0].addEventListener('wheel', this.preventEvent);
		}
	if(!document.hasOwnProperty('_lyteMenu')){
		document.documentElement.addEventListener('click', lyteCloseMenu, true);
		document.documentElement.addEventListener('keydown', this.keydownCheck, true);
		window.addEventListener('resize', this.resizeFunc, true);
		document._lyteMenu = {};
		document._lyteMenu.eventFlag = true;
	}
	if(this.getMethods('beforeRender'))
        {
            this.executeMethod('beforeRender', this.$node);
        }		
},
 
 arrayFrom : function(nodeList){
 	var arrayList = [];
	for(var i = 0; i < nodeList.length; i++)
		{
			arrayList.push(nodeList[i]);
		}
 	return arrayList.slice();		
 },

// heightChange : function(){
// 	this.childComp.style.height = this.getData('ltPropHeight');	
// }.observes('ltPropHeight'),

heightObs : function(){
	this.menuBody.style.height = this.getData('ltPropHeight');
}.observes( 'ltPropHeight' ).on( 'didConnect' ),

appendFreeze : function(className){
	var freezeLayer ;
	freezeLayer = document.createElement('div')
	freezeLayer.setAttribute('class', className)
	document.body.appendChild(freezeLayer)
},

resizeFunc : function(event){
	clearTimeout( this._resizeTimeout )
	this._resizeTimeout = setTimeout( function(){
		var activeMenu = $L('lyte-menu:not(.lyteMenuClosed)').e
		for(var i = 0; i < activeMenu.length; i++){
			if(!activeMenu[i].component.hasOwnProperty('parentMenu')){
					activeMenu[i].component.setCss.call(activeMenu[i].component)
					var childMenu = activeMenu[i].component.childMenu
					if( childMenu )
						{
							childMenu.setCss.call( childMenu )
						}
					 var temp = activeMenu[i].component;
					 	if(temp.getData('ltPropFreeze')  && !temp.parentMenu)
							{
								setTimeout(temp.setZIndex.bind(temp), 100);
							}
						setTimeout(temp.heightCheck.bind(temp, temp.childComp), 100);
			}
		}
	}.bind(this), 16 )
},

keydownCheck : function(event){
	if(event.keyCode == 27){
		lyteCloseMenu(event, undefined, true);
	} else {
		var menus = $L('lyte-menu:not(.lyteMenuClosed)[lyte-rendered]').e;
		for( var i = 0; i < menus.length; i++ ) {
			var menu = menus[ i ].component;
			if( !menu.childMenu ) {
				menu.traverseList.call(menu, event);
				break;
			}
		}

	}
},

didDestroy : function(){
		var allNodes = this.childComp.querySelectorAll('lyte-menu-item')
		for(var i=0;i<allNodes.length;i++){
			var curValue = allNodes[i].getAttribute('lyte-shortcut')
			if(curValue){
				allNodes[i].setAttribute('lyte-shortcut',JSON.stringify({}))
			}
		}
		var removeEvents = this.getData('eventListeners'), event = this.getData('ltPropEvent');
	if(this.childComp)
		{
			this.childComp.parentElement.removeChild(this.childComp);
		}
	if($L('lyte-menu').e.length == 0)
		{
			var freezeLayers = $L('div.lytemenufreezelayer').e
			for(var i = 0; i < freezeLayers.length; i++)
				{
					document.body.removeChild(freezeLayers[i]);
				}
			if(document._lyteMenu)
				{
					delete document._lyteMenu
					document.documentElement.removeEventListener('keydown', this.keydownCheck, true);
					document.documentElement.removeEventListener('click', lyteCloseMenu, true);
					window.removeEventListener('resize', this.resizeFunc, true);
				}
			// window.lyteCloseMenu = undefined		
     }
	var ltPropQuery = this.getData('ltPropQuery'), parIndex = this.getData( 'parIndex' ), nodeList;
	if( ltPropQuery || parIndex != undefined ){
		if( ltPropQuery ){
			nodeList = document.querySelectorAll(ltPropQuery);
		}
		document.removeEventListener(event == 'mouseenter' ? 'mousemove' : event, removeEvents.event, true);
		if( ltPropQuery ) {
			for(var i = 0; i < nodeList.length; i++)
				{
					delete nodeList[i].menu;
				}
		}
	}
	delete this.menuNodes;	
},

closestFind : function(path, query){
	var parIndex = this.getData( 'parIndex' ),
	elements = this.arrayFrom.call(this, ( parIndex != undefined ? ( this.$node.parentElement.parentElement.querySelectorAll('lyte-menu-item:nth-of-type(' + ++parIndex + ')') ) : document.querySelectorAll( query.trim() ) ) );
	for(var i = 0; i < path.length; i++)
		{
			if(Array.prototype.indexOf.call(elements, path[i]) != -1)
				{
					return path[i];
				}
		}
	return null;	
},

checkElementForMenu : function(event){
	if(!event.menuFlag)
		{
			var query = this.getData('ltPropQuery');
			var closetElem = this.closestFind.call(this, event.path ? event.path : this.composePath.call(this, event), query);
			if(closetElem != null)
				{
				    if(!this.childComp.classList.contains('lyteMenuHidden')  && this.$node.element != closetElem)
						{
							// for opening same menu at diff position menu body should be hided and its animation need to be prevented
							this.childComp.classList.remove( 'lyteAnimate' )
							this._hideStarts = true
							this.hideMenu.call(this, true, event);
						}
					if( closetElem.tagName == "LYTE-MENU-ITEM" && event.type == 'click' ) {
						event.stopPropagation();
					}
					if( event.type == 'contextmenu' ) {
						event.preventDefault();
					}	
					event.menuFlag = true;
					$L.fastdom.mutate(function(){	
						this.$node.element = closetElem;
						closetElem.menu = this.$node;
						if(!this.parentMenu)
							{
								// closetElem.addEventListener('keydown', this.getData('eventListeners').keydown);
								this.$node.toggle(event || {});
							}
					}.bind(this))
				}		
		}
},

didConnect : function(){
	var menuBody = $L('lyte-menu-body', this.$node).e[0],menuBox = $L('lyte-menu-box', this.$node).e[0];
	this.$node.toggle = function(event, flag){
		if(this.childComp.classList.contains('lyteMenuHidden') || flag )
			{
				if(['mousedown', 'mouseup'].indexOf(event.type) > -1)
					{
						document._lyteMenu.preventClick = false;
					}
				this.openMenu.call(this, event)
			}
		else
			{
				if(!this.childMenu && event.type.indexOf('mouse') == -1 && !this._hideStarts)
					{
						this.hideMenu.call(this, true, event)
					}
			}	
	}.bind(this);
	menuBody.addEventListener('click', this.optionSelect.bind(this));
	menuBody.parent = this.$node;
	menuBox.parent = this.$node;
	this.childComp = menuBox;
	this.menuBody = menuBody;
	menuBox.classList.add('lyteMenuHidden');
	this.$node.classList.add('lyteMenuClosed');
	var span = document.createElement('span');
	span.setAttribute('class','lyteArrow');
	menuBody.insertBefore(span,menuBody.children[0]);
	menuBox.style.width = this.getData('ltPropWidth');
	LyteComponent.appendChild(document.body, menuBox);
	// this.contentChange.call(this);
	if(this.getMethods('afterRender'))
        {
            this.executeMethod('afterRender', this.$node);
        }
},

data : function(){
	return{
		// user data
		ltPropContent : Lyte.attr('array',{ 'default' : []}),
		ltPropId : Lyte.attr('string',{'default' : ''}),
		ltPropClass : Lyte.attr('string', { 'default' : ''}),
		ltPropQuery : Lyte.attr('string', {'default' : ''}),
		ltPropEvent : Lyte.attr('string', {'default' : 'click'}),
		ltPropYield : Lyte.attr('boolean', {'default' : false}),
		ltPropUserValue : Lyte.attr('string', {'default' : ''}),
		ltPropSystemValue : Lyte.attr('string', {'default' : ''}),
		ltPropCallout : Lyte.attr('boolean', {'default' : false}),
		ltPropPosition : Lyte.attr('string', { 'default' : 'down'}),
		ltPropDescription : Lyte.attr('string', {'default' : ''}),
		ltPropTabIndex : Lyte.attr('number',{'default' : 0}),
		ltPropFreeze : Lyte.attr('boolean',{'default' : true}),
		ltPropShow : Lyte.attr('boolean',{'default' : false}),
		ltPropWidth : Lyte.attr('string',{'default' : 'auto'}),
		ltPropHeight : Lyte.attr('string',{'default' : 'auto'}),
		ltPropQueryClass : Lyte.attr('string', {'default' : 'lyteMenuSelected'}),
		ltPropBoundary : Lyte.attr('object', {'default' : {}}),
		ltPropScope : Lyte.attr('string', {'default' : ''}),
		ltPropPreventInsideClick : Lyte.attr('boolean', {default : false}),
		ltPropAnimate : Lyte.attr( 'boolean', { default : false }),
		ltPropSetCss : Lyte.attr( 'boolean', { default : true }), 

		// system data 
		eventListeners : Lyte.attr('object', { 'default' : {}}),
		pos : Lyte.attr('string' , { default : ''}),
		parIndex : Lyte.attr( 'number' )
	}
},

firePosCallBack: function() {
	if( this.getMethods( 'onPositionChanged' )) {
		this.executeMethod( 'onPositionChanged', this.getData('pos'), this.$node);
	}
}.observes('pos'),

contentChangeObs : function(){
	this.contentChange.call(this);
}.observes('ltPropContent'),

contentChange : function(){
	if(!this.childComp.classList.contains('lyteMenuHidden'))
		{
			this.setCss.call(this);
			this.menuBody.style.removeProperty('height');
		}
},

setContextCss : function(evt, position){
	var element = this.$node.element;
	var menuBody = this.childComp;
	$L.fastdom.measure(function(){
		var clientRect = menuBody.getBoundingClientRect();
		var innerHeightt = window.innerHeight;
		var innerWidtht = window.innerWidth;
		$L.fastdom.mutate(function(){
			if(!position)
				{
					position = this.getData('ltPropPosition')
				}
			switch(position)
				{
					case 'top' :{
						menuBody.style.left = evt.clientX + 'px';
						menuBody.style.top = (evt.clientY - clientRect.height) + 'px';
						if(clientRect.top < 0)
							{
								menuBody.style.top = evt.clientY + 'px';
							}
						if((parseInt(menuBody.style.top) + clientRect.height) > innerHeightt)
							{
								menuBody.style.top = (evt.clientY - clientRect.height) + 'px';
							}	
						break;
					}
					default : {
						menuBody.style.left = evt.clientX + 'px';
						menuBody.style.top = evt.clientY + 'px';
						if((parseInt(menuBody.style.top) + clientRect.height) > innerHeightt)
							{
								menuBody.style.top = (evt.clientY - clientRect.height) + 'px';
							}
						if(parseInt(menuBody.style.top) < 0)
							{
								menuBody.style.top = evt.clientY + 'px';
							}	
					}
				}
			if(clientRect.left < 0)
				{
					menuBody.style.left = evt.clientX + 'px';
				}
			else if(clientRect.right > innerWidtht)
				{
					menuBody.style.left = (evt.clientX - clientRect.width) + 'px';
				}
		}.bind(this))
	}.bind(this))

},


openMenu : function(event, flagg){
	var onBeforeOpen, eventType = this.getData('ltPropEvent'), targetDiv;
	event = event ? event : {}
	if(!flagg)
		{
			targetDiv = this.targetElem.call(this, event.target);
			if( targetDiv[ 0 ] ) {
				targetDiv[ 0 ].originMenu = targetDiv[ 1 ].component
			}
		}
	if(flagg && eventType != 'contextmenu')
		{
			if(!this.$node.element)
				{
					var query = this.getData('ltPropQuery');
					this.$node.element = (/^#/g.test(query.trim()) && !/\s/g.test(query.trim())) ? $L(query).e : $L(query).e[0];
				}
			if(this.$node.element.tagName == 'LYTE-MENU-ITEM')
				{
					targetDiv = this.targetElem.call(this, this.$node.element);
				}	
			else if(!targetDiv)
				{
					targetDiv = [];
				}	
		}
	if(this.getMethods('onBeforeOpen'))
		{
			onBeforeOpen = this.executeMethod('onBeforeOpen', this.$node, event, this.$node.element);
		}
	if(onBeforeOpen != false)
		{
			//Actual opening process
			$L.fastdom.measure(function(){
				// to set initial position if its scrolled previously
				this.childComp.scrollTop = 0;	
			}.bind(this))
			$L.fastdom.mutate(function(){
				this.childComp.classList.remove('lyteMenuHidden')
				this.$node.classList.remove('lyteMenuClosed');
				this.childComp.style.display = 'block'
				if(!this.parentMenu)
					{
						this.$node.element.classList.add(this.getData('ltPropQueryClass'))
					}
				if( this.getData( 'ltPropHeight' ) ){	
					this.menuBody.style.height = this.getData( 'ltPropHeight' )
				} else {
					this.menuBody.style.removeProperty('height')
				}	
				if(this.getData('ltPropEvent') == 'contextmenu')
					{
						this.setContextCss.call(this, event);
					}	
				else
					{	
						this.setCss.call(this);
					}
				if(targetDiv[0])
					{
						 if(targetDiv[1].tagName == 'LYTE-MENU')
							{
								targetDiv[1].component.childMenu = this
								this.parentMenu = targetDiv[1].component
								targetDiv[1].component.childComp.addEventListener('mousemove',this.mouseleave)
							}
					}
				if(!this.parentMenu && this.$node.element.tagName != 'LYTE-MENU-ITEM')
					{
						lyteCloseMenu(event, this.$node)
					}
				if(this.getData('ltPropFreeze')  && !this.parentMenu)
					{
						this.setZIndex.call(this)
					}
				else if(!document.menu)
					{
						window.addEventListener('scroll',this.addScrollPos, true)
						document.menu = this
					}
				if((eventType == 'mouseenter' || eventType == 'mouseover' || eventType == 'mousemove') && !this.childMenu && !this.parentMenu && !targetDiv[0])
					{
						var evt = this.hoverClose.bind(this);
						this.setData('eventListeners.hoverClose', evt)
						document.addEventListener('mousemove', evt);
						this.$node.element.addEventListener('mousemove', this.preventEvent);
						this.menuBody.addEventListener('mousemove', this.preventEvent);
					}
				this._hgt =  this.heightCheck.call(this, this.menuBody, event);
				if( this.getData( 'ltPropAnimate' )  && this._hgt != 0 ){
					// for animating height height need to set as zero and animate class need to be added
					this.menuBody.style.height = 0;
					if( [ 'up', 'upLeft', 'upRight' ].indexOf( this.getData( 'pos' ) ) != -1 ) {
						this.childComp.style.top = parseInt( this.childComp.style.top ) + this._hgt + 'px';
					}
					setTimeout( function(){
						this.childComp.classList.add( 'lyteAnimate' );
						setTimeout( function(){
							// for invert animation
							if( [ 'up', 'upLeft', 'upRight' ].indexOf( this.getData( 'pos' ) ) != -1 ) {
								this.childComp.style.top = parseInt( this.childComp.style.top ) - this._hgt + 'px';
							}
							// animation start
							this.menuBody.style.height = this._hgt + 'px';
							
						}.bind(this), 20)	
					}.bind(this), 20)
				}
				if(this.getMethods('onOpen')){
					   this.executeMethod('onOpen', this.$node, event, this.$node.element);
					}
			}.bind(this))
			if(event.type == 'contextmenu'){
				event.preventDefault();
			}	

		} else {
			this._dontCall = true;
			delete this.$node.element;
			this.setData( 'ltPropShow', false )
			delete this._dontCall;
		}
},

heightCheck : function(menuBody, event){
		if(  !this.getData( 'ltPropSetCss' ) ) {
			return
		}
	// here fastdom is removed for proper on open callback
		// menu body properties are required for enable scroll when window size is too small to view full menu body
		var clientRect = menuBody.getBoundingClientRect(), hgt;
		var windowHgt = window.innerHeight;
		this.menuBody.addEventListener('wheel', this.preventEvent, true);
		hgt = clientRect.bottom - clientRect.top;
		if(clientRect.bottom > windowHgt)
			{
				this.menuBody.style.height = (windowHgt - clientRect.top) + 'px';
				hgt = windowHgt - clientRect.top;
			}		
		if(clientRect.top < 0)
			{
				this.menuBody.style.height = clientRect.bottom + 'px';
				this.childComp.style.top = '0px';
				hgt = clientRect.bottom;
			}	
		this._dontCall = true;
		this.$node.ltProp('show', true);
		delete this._dontCall;
		return hgt;
},

composePath : function(event){
		var arr = [], node = event.target;
		while(node.tagName != 'HTML')
			{
				arr.push(node);
				node = node.parentElement;
			}
		return arr;	
},

elementsFromPointCal : function(x, y){
	// for gettting elements from point on hover menu
		var arr = [], element = document.elementFromPoint(x, y);
		while(element != document && element != document.documentElement && element != document.body && element.tagName != 'LYTE-MENU-BODY' )
			{
				element.style.pointerEvents = 'none';
				arr.push(element);
				element = document.elementFromPoint(x, y);
			}
		for(var i = 0; i < arr.length; i++)
			{
				arr[i].style.pointerEvents = 'initial';
			}
		return arr;		
},

hoverClose : function(event){
	if(this.$node)
		{
			if((document.elementsFromPoint ? document.elementsFromPoint(event.clientX, event.clientY) : this.elementsFromPointCal.call(this, event.clientX, event.clientY)).indexOf(this.$node.element) == -1)
				{
					this.hideMenu.call(this, true, event);
				}
		}
},

mouseleave : function(event){
	var component = this.parent.component, target = component.targetElem.call(component, event.target);
	if(component.childMenu)
		{
			if(target[1] == component.$node && target[0] != component.childMenu.$node.element && target[0])
				{
					this.removeEventListener('mousemove',component.childMenu.mouseleave)	
					component.childMenu.hideMenu.call(component.childMenu, true, event)
				}
		}
},

hideToggle : function(arg){
	if(this._dontCall){
		return;
	}
	if(arg.newValue == false)
		{
			this.hideMenu.call(this, true, {});
		}
	else
		{
			this.openMenu.call(this, {}, true);
		}	
}.observes('ltPropShow'),

hideMenu : function(flag, event, flag2){
	var onBeforeClose;
	if(this.childMenu)
		{
			if( !this.childMenu.childComp.contains(event.target) || flag2 ){
				if( !this.childMenu.hideMenu.call( this.childMenu, flag, event, flag2 ) ){
					return
				}
			} else {
				return
			}
		}
		if(this.getMethods('onBeforeClose'))
			{ 
			   onBeforeClose = this.executeMethod('onBeforeClose', this.$node, event);
		    }
	if(onBeforeClose != false)	
		{
			if(this.parentMenu)	
				{
					delete this.parentMenu.childMenu 
					delete this.parentMenu
				}
			else 
				{	
					this.$node.element.classList.remove(this.getData('ltPropQueryClass'))	
					delete document.menu 
					window.removeEventListener('scroll',this.addScrollPos, true)
				}
			this._arguments = arguments;
			if( [ 'mouseenter', 'mousemove', 'mouseover' ].indexOf( this.getData( 'ltPropEvent' ) ) != -1 ) {
				var evt = this.getData('eventListeners.hoverClose');
				this.$node.element.removeEventListener('mousemove', this.preventEvent);
				this.menuBody.removeEventListener('mousemove', this.preventEvent);
				this.menuBody.removeEventListener('wheel', this.preventEvent, true);
				document.removeEventListener('mousemove', evt);
			}
			$L.fastdom.mutate( function(){
				if( this.childComp.classList.contains( 'lyteAnimate' ) ) {
					// for hide height is set to zero
					this.menuBody.style.height = 0;
					// for invert animation
					if( [ 'up', 'upLeft', 'upRight' ].indexOf( this.getData( 'pos' ) ) != -1 ) {
						this.childComp.style.top = parseInt( this.childComp.style.top ) + this._hgt + 'px';
					}
					this.menuBody.addEventListener( 'transitionend', this._close )
				} else {
					delete this._arguments;
					this.closing( flag, event )
				}	
			}.bind(this))
			return true	
		} else {
			this._dontCall = true;
			this.setData( 'ltPropShow', true )
			delete this._dontCall;
			delete this._hideStarts;
		}
},

closing : function( ){
	var flag, evt;
	if( this._arguments ) {
	 	flag = this._arguments[ 0 ];
	 	evt = this._arguments[ 1 ];
	 	// height set to its original
		this.menuBody.style.height = this._hgt + 'px';
		delete this._hgt;
		delete this._arguments;
	} else {
		flag = arguments[ 0 ];
	 	evt = arguments[ 1 ];
	}
	this.menuBody.removeEventListener( 'transitionend', this._close )
	this.childComp.classList.add('lyteMenuHidden')
	delete this._hideStarts;
	this.$node.classList.add('lyteMenuClosed');
	if(this.getData('ltPropFreeze') && !this.parentMenu)
		{
			this.setZIndex.call(this, flag)
		}
	this._dontCall = true;
	this.$node.ltProp('show', false);
	delete this._dontCall;
	delete this.$node.element
	this.childComp.classList.remove( 'lyteAnimate' )
	$L.fastdom.measure(function(){	
		if(this.getMethods('onClose'))
			{
			 	this.executeMethod('onClose', this.$node, evt);
			}
	}.bind(this))
},
 
targetElem : function(nodeName){
	var currNode
	while(nodeName.tagName != 'LYTE-MENU-BODY' && nodeName.tagName != 'BODY')
		{
			if(nodeName.tagName == 'LYTE-MENU-ITEM')
				{
					currNode = nodeName
				}
			nodeName = nodeName.parentElement;
		}
	return [currNode, nodeName.parent]	
},

optionSelect : function(event){
	var nodeName = this.targetElem.call(this, event.target)[0], flag
	if((event.ctrlKey == true || event.metaKey == true || event.which == 2) && event.target.href != undefined && event.target.href.indexOf('javascript:') != -1 && event.target.target == '_blank'){return false;}
	if(this.getMethods('onMenuClick') && nodeName)
        {
          var value;
          if(this.getData('ltPropYield'))
              {
                value = nodeName.getAttribute('data-value')
              }
           else
              {
                var ltPropContent = this.getData('ltPropContent')
                if(nodeName.hasAttribute('grporder'))
	                  {
	                     var grp = ltPropContent[parseInt(nodeName.getAttribute('grporder'))]
	                     value = grp[Object.keys(grp)[0]][parseInt(nodeName.getAttribute('elemorder'))]
	                  }
	              else
	                  {
	                      value = ltPropContent[parseInt(nodeName.getAttribute('elemorder'))]
	                  }    
              }   
           flag = this.executeMethod('onMenuClick', value, event, this.$node, this.$node.element, { element : nodeName, submenu : !!nodeName.originMenu } );
       }
    if(this.childMenu && !flag)
    	{
    		event.stopPropagation()
    	}
    if(nodeName || (!nodeName && this.getData('ltPropPreventInsideClick')))
    	{
    		lyteCloseMenu(event,undefined, true)
    		// this.hideMenu( false, event, true )
    	}	
  },
	/*
		Calculate left of menu container when it has to come below/above the select element when it exceeds window.innerWidth and there is space to the right
	*/
setLeftExceedForDown: function( element, container, bcr, containerbcr, xscroll ) {
		var scrolledLeft = xscroll,
		elementBCR = bcr,
		elementLeft = elementBCR.left,
		elementWidth = elementBCR.width,
		containerBCR = containerbcr,
		containerWidth = containerBCR.width,
		total = scrolledLeft + elementLeft + elementWidth - containerWidth;

		return total
	},
	/*
		Calculate left of menu container when it has to come below/above the select element when it doesn't exceed window.innerWidth
	*/
	setLeftNotExceedForDown: function( element, bcr, xscroll ) {
		var scrolledLeft = xscroll,
		elementBCR = bcr,
		elementLeft = elementBCR.left,
		total = scrolledLeft + elementLeft;

		return total
	},
	/*
		Calculate top of menu container when it has to come above the select element
	*/
	setTopAboveForDown: function( element, container, bcr, containerbcr, yscroll ) {
		var scrolledHeight = yscroll,
		elementBCR = bcr,
		elementTop = elementBCR.top,
		containerBCR = containerbcr,
		containerHeight = containerBCR.height,
		total = scrolledHeight + elementTop  - containerHeight;

		return total
	},
	/*
		Calculate top of menu container when it has to come below the select element
	*/
	setTopBelowForDown: function( element, bcr, yscroll ) {
		var scrolledHeight = yscroll,
		elementBCR = bcr,
		elementTop = elementBCR.top,
		elementHeight = elementBCR.height,
		total = scrolledHeight + elementTop + elementHeight;

		return total
	},
	/*
		Calculate left of menu container when it has to come to right of the select element
	*/
	setLeftForRight:function( element, bcr, xscroll ) {
		var scrolledWidth = xscroll,
		elementBCR = bcr,
		elementLeft = elementBCR.left,
		elementWidth = elementBCR.width,
		total = scrolledWidth + elementLeft + elementWidth;

		return total
	},
	/*
		Calculate right of menu container when it has to come to left of the select element of right menu
	*/
	setRightForRight: function( element, container, bcr, elembcr, xscroll ) {
		var scrolledWidth = xscroll,
		elementBCR = bcr,
		containerBCR = elembcr,
		elementLeft = elementBCR.left,
		containerWidth = containerBCR.width,
		total = scrolledWidth + elementLeft - containerWidth;

		return total
	},
	/*
		Calculate top of menu container when it has to come to right of menu and there is space below
	*/
	setTopForRight:function( element, bcr, yscroll ) {
		var scrolledHeight = yscroll,
		elementBCR = bcr,
		elementTop = elementBCR.top,
		total = scrolledHeight + elementTop;

		return total
	},
	/*
		Calculate top of menu container when it has to come to right of menu and there is no space below
	*/
	setTopForRightAbove:function( element, container, bcr, elembcr, yscroll ) {
		var scrolledHeight = yscroll,
		elementBCR = bcr,
		elementTop = elementBCR.top,
		elementHeight = elementBCR.height,
		containerBCR = elembcr,
		containerHeight = containerBCR.height,
		total = scrolledHeight + elementTop + elementHeight - containerHeight;

		return total
	},
	/**
		Remove wrong arrow and append proper arrow
		@param string correct - the correct class
	*/
	setCorrectClass: function( cls ) {
		var arrow = this.childComp.querySelector( '.lyteArrow' ),
		list = arrow.classList, i = 0;
		for( ; i < list.length; i++ ) {
			if( list[ i ] == 'lyteArrow' || list[ i ] == cls ) {
				continue;
			}
			else { 
				arrow.classList.remove( list[ i ] );
				i--;
			}
		}

		arrow.classList.add( cls );
		arrow.classList.add( 'lyteArrowIcon' );
	},
	/**
	 * Set the CSS for your menu
	 * refer commit ID 583ee6ccbeaa6b3729178bf9df0139032b016d19 and previous for the previous stable setCSS function.
	 * commit ID 583ee6ccbeaa6b3729178bf9df0139032b016d19 also gives a better understanding about the hard coded values in this function.
	 */ 
	setCss: function( onlyScroll ) {
		var link = this.childComp;

		if( !link 
			|| link.classList.contains( 'lyteMenuHidden' ) || !this.getData( 'ltPropSetCss' )
		) {
			return;
		}

		// Get properties
		var callout = this.getData( 'ltPropCallout' );


		// Get button
		var body = link,
		par = this.$node.element;

		// Get Geometric propotions
		var wwidth, wheight, wleft, wtop;
		var query = this.getData('ltPropScope'), flag;
		if(query)
			{
				var temp = {target : par};
				var elemm = this.closestFind.call(this, this.composePath.call(this, temp), query);
				if(elemm)
					{
						var rec = elemm.getBoundingClientRect();
						wleft = rec.left < 0 ? 0 : rec.left;
						wwidth =  window.innerWidth > rec.right ? rec.right : window.innerWidth;
						flag = true
					}
			}
		if(!flag)
			{
				wwidth = window.innerWidth
				wleft = 0;
			}
		var wheight= window.innerHeight;
		var wtop = 0,	
		drop = body.getBoundingClientRect(), 
		x = window.pageXOffset || document.documentElement.scrollLeft,
		y = window.pageYOffset || document.documentElement.scrollTop,
		height = body.offsetHeight,
		width = body.offsetWidth, 
		arrow = link.querySelector( '.lyteArrow' ),
		position = this.getData( 'ltPropPosition' ),
		offsets = par.getBoundingClientRect();

		// Intialize flags
		var downPos, 
		rightPos, 
		topPos, 
		leftPos; 

		// temp stores
		var tempStore,
		tempTop, 
		tempLeft, 
		tempMarginLeft, 
		tempMarginTop,
		tempNum, 
		tempDenom, 
		tempPer, 
		aHeight, 
		aWidth;

		arrow.style.removeProperty('left');
		arrow.style.removeProperty('top');
		if( position === 'down' ) {
			downPos = true;
			tempTop = offsets.top + offsets.height; 
			if( tempTop + height > wheight 
				&& offsets.top > height 
			) {
				downPos = false;		
			}
			else {
				downPos = true;
			}

			rightPos = true;
			tempLeft = offsets.left;
			if( tempLeft + width > wwidth 
				&& tempLeft > tempLeft + offsets.width - body.offsetWidth 
			) {
				rightPos = false;
				
			}
			else if( offsets.left + width <= wwidth ) {
				rightPos = true;
			}

			if( offsets.width > width ) {    
				arrow.style.left = ( ( width / 2 - 0 ) / width ) * 100 + "%"; 
			}

			if( downPos ) {
				this.setData( 'pos', 'down' );
				if( callout ) {
					this.setCorrectClass( 'lyteArrowTop' );
					// need to calculate arrow width
					aHeight = window.getComputedStyle( arrow, ':before' ).borderLeftWidth;
					tempStore = this.setTopBelowForDown( par, offsets, y ) + parseFloat( aHeight ? aHeight : '0px' ) + 'px';
				}
				else { 
					body.style.top = this.setTopBelowForDown( par, offsets, y ) + 'px';
				}
				
			}
			else {
				this.setData( 'pos', 'up' );
				if( callout ) {
					this.setCorrectClass( 'lyteArrowBottom' );
					aHeight = window.getComputedStyle( arrow, ':before' ).borderLeftWidth;
					tempStore = this.setTopAboveForDown( par, body, offsets, drop, y ) - parseFloat( aHeight ? aHeight : '0px' ) + 'px';					
				}
				else {
					body.style.top = this.setTopAboveForDown( par, body, offsets, drop, y ) + 'px';
				}
			}

			if( rightPos ) {
				if( callout ) {
					aWidth = window.getComputedStyle( arrow, ':before' ).borderLeftWidth;
					aWidth = parseFloat( aWidth ? aWidth : '0px' );
					tempMarginLeft = window.getComputedStyle( arrow, ':before' ).marginLeft;
					tempMarginLeft = Math.abs( parseFloat( tempMarginLeft ? tempMarginLeft : '0px' ) );
					tempNum = offsets.width / 2 - aWidth + tempMarginLeft; // We removed arrow.offsetWidth because it was giving width as 0 px
					tempDenom = width / 100;
					tempPer = tempNum / tempDenom;
					arrow.style.left = tempPer + '%'; 	
				}

				body.style.top = tempStore ? tempStore : body.style.top;
				body.style.left = this.setLeftNotExceedForDown( par, offsets, x ) + 'px';	
			}
			else {
				if( callout ) {
					aWidth = window.getComputedStyle( arrow, ':before' ).borderLeftWidth;
					aWidth = parseFloat( aWidth ? aWidth : '0px' );
					tempMarginLeft = window.getComputedStyle( arrow, ':before' ).marginLeft;
					tempMarginLeft = Math.abs( parseFloat( tempMarginLeft ? tempMarginLeft : '0px' ) );	
					tempDenom = width / 100;
					tempNum = width - ( offsets.width / 2 ) - aWidth + tempMarginLeft; // We removed arrow.offsetWidth because it was giving width as 0 px
					tempPer = tempNum / tempDenom;
					arrow.style.left = tempPer + '%'; 
				}

				body.style.top = tempStore ? tempStore : body.style.top;
				body.style.left = this.setLeftExceedForDown( par, body, offsets, drop, x ) + 'px'
			}

			
		}
		else if( position === 'right' ) {
			rightPos = true;
			if( offsets.left + offsets.width + width > wwidth 
				&& offsets.left - drop.width > wleft 
			) {   
				rightPos = false;
				
			}
			else{
				rightPos = true;
			}

			downPos = true;
			if( offsets.top + drop.height > wheight ) {
				downPos = false
			}
			else {
				downPos = true
			}

			if( rightPos ) {
				this.setData( 'pos', 'right' );
				if( callout ) {
					this.setCorrectClass( 'lyteArrowLeft' );
					aWidth = window.getComputedStyle( arrow, ':before' ).borderLeftWidth;
					aWidth = parseFloat( aWidth ? aWidth : '0px' );
					tempStore = this.setLeftForRight( par, offsets, x ) + aWidth + 'px';
				}
				else {
					body.style.left= this.setLeftForRight( par, offsets, x ) + 'px'
				}
			}
			else {
				this.setData( 'pos', 'left' );
				if( callout ) {
					this.setCorrectClass( 'lyteArrowRight' );
					aWidth = window.getComputedStyle( arrow, ':before' ).borderLeftWidth;
					aWidth = parseFloat( aWidth ? aWidth : '0px' );
					tempStore = this.setRightForRight( par, body, offsets, drop, x ) - aWidth + 'px';
				}
				else {
					body.style.left = this.setRightForRight( par, body, offsets, drop, x ) + 'px';
				}
			}

			if( downPos ) {
				if( callout ) {
					aHeight = window.getComputedStyle( arrow, ':before' ).borderLeftWidth;
					aHeight = parseFloat( aHeight ? aHeight : '0px' );
					tempMarginTop = window.getComputedStyle( arrow, ':before' ).marginTop;
					tempMarginTop = Math.abs( parseFloat( tempMarginTop ? tempMarginTop : '0px' ) );
					tempNum = ( ( offsets.height / 2 ) - aHeight  + tempMarginTop ) * 100; // Had arrow.getBoundingClientRect()/2 removed cos its value is 0
					tempDenom = drop.height;
					tempPer = tempNum / tempDenom;
					arrow.style.top = tempPer + '%';
				}

				body.style.left = tempStore ? tempStore : body.style.left;
				body.style.top = this.setTopForRight( par, offsets, y ) + 'px' 
			}
			else {
				if( callout ) {
					aHeight = window.getComputedStyle( arrow, ':before' ).borderLeftWidth;
					aHeight = parseFloat( aHeight ? aHeight : '0px' );
					tempMarginTop = window.getComputedStyle( arrow, ':before' ).marginTop;
					tempMarginTop = Math.abs( parseFloat( tempMarginTop ? tempMarginTop : '0px' ) ); 
					tempNum = ( drop.height - offsets.height / 2 - aHeight + tempMarginTop ) * 100; // Had arrow.getBoundingClientRect()/2 
					tempDenom = drop.height
					tempPer = tempNum / tempDenom;
					arrow.style.top = tempPer + '%';
				}

				body.style.left = tempStore ? tempStore : body.style.left;
				body.style.top = this.setTopForRightAbove( par, body, offsets, drop, y ) + 'px'
			}
		}
		else if( position === 'up' ) {
			topPos = true
			if( offsets.top - drop.height < wtop
				&& offsets.top + offsets.height + height < wheight 
			) {
				topPos = false
			}
			else {
				topPos = true
			}

			rightPos = true
			if( offsets.left + width > wwidth 
				&& offsets.left > offsets.left + offsets.width - body.offsetWidth 
			) {
				rightPos = false
			}
			else if( offsets.left + width <= wwidth ) {
				rightPos = true
			}

			if( offsets.width > width ) {      //Think this is for multiselect(CODE HELP)
				arrow.style.left = ( ( width / 2 - 0 ) / width ) * 100 +'%'; // Had arrow.offsetWidth/2 removed cos its value is 0
			}

			if( topPos ) {
				this.setData( 'pos', 'up' );
				if( callout ) {
					this.setCorrectClass( 'lyteArrowBottom' );
					aHeight = window.getComputedStyle( arrow, ':before' ).borderLeftWidth;
					aHeight = parseFloat( aHeight ? aHeight : '0px' );
					tempStore = this.setTopAboveForDown( par, body, offsets, drop, y ) - aHeight + 'px';	
				}
				else {
					body.style.top = this.setTopAboveForDown( par, body, offsets, drop, y ) + 'px';
				}
			}
			else {
				this.setData( 'pos', 'down' );
				if( callout ) {
					this.setCorrectClass( 'lyteArrowTop' );
					aHeight = window.getComputedStyle( arrow, ':before' ).borderLeftWidth;
					aHeight = parseFloat( aHeight ? aHeight : '0px' );
					tempStore = this.setTopBelowForDown( par, offsets, y ) + aHeight + 'px';
				}
				else {
					body.style.top = this.setTopBelowForDown( par, offsets, y ) + 'px'
				}
			}
			if( rightPos ) {
				if( callout ) {
					aWidth = window.getComputedStyle( arrow, ':before' ).borderLeftWidth;
					aWidth = parseFloat( aWidth ? aWidth : '0px' );
					tempMarginLeft = window.getComputedStyle( arrow, ':before' ).marginLeft;
					tempMarginLeft = Math.abs( parseFloat( tempMarginLeft ? tempMarginLeft : '0px' ) );
					tempNum = offsets.width / 2 + tempMarginLeft - aWidth; // We removed arrow.offsetWidth because it was giving width as 0 px
					tempDenom = width / 100;
					tempPer = tempNum / tempDenom;
					arrow.style.left = tempPer + '%' 
				}

				body.style.top = tempStore ? tempStore : body.style.top;
				body.style.left = this.setLeftNotExceedForDown( par, offsets, x ) + 'px';
			}
			else{
				if( callout ) {
					aWidth = window.getComputedStyle( arrow, ':before' ).borderLeftWidth;
					aWidth = parseFloat( aWidth ? aWidth : '0px' );
					tempMarginLeft = window.getComputedStyle( arrow, ':before' ).marginLeft;
					tempMarginLeft = Math.abs( parseFloat( tempMarginLeft ? tempMarginLeft : '0px' ) );
					tempDenom = width / 100;
					tempNum = width - ( offsets.width / 2 ) + tempMarginLeft - aWidth; // We removed arrow.offsetWidth because it was giving width as 0 px
					tempPer = tempNum / tempDenom; 
					arrow.style.left = tempPer +'%'; 
				}

				body.style.top = tempStore ? tempStore : body.style.top;
				body.style.left = this.setLeftExceedForDown( par, body, offsets, drop, x ) + 'px';
			}
		}
		else if( position === 'left' ) {
			leftPos = true;
			if( offsets.left - drop.width < wleft
				&& offsets.left + drop.width < wwidth 
			) {
				leftPos = false;
			}
			else {
				leftPos = true;
			}

			downPos = true;
			if( offsets.top + drop.height > wheight ) {
				downPos = false;
			}
			else {
				downPos = true;
			}

			if( leftPos ) {
				this.setData( 'pos', 'left' );
				if( callout ) {
					this.setCorrectClass( 'lyteArrowRight' );
					aWidth = window.getComputedStyle( arrow, ':before' ).borderLeftWidth;
					aWidth = parseFloat( aWidth ? aWidth : '0px' );
					tempStore = this.setRightForRight( par, body, offsets, drop, x ) - aWidth + 'px';
				}
				else {
					body.style.left = this.setRightForRight( par, body, offsets, drop, x ) + 'px';
				}	
			}
			else {
				this.setData( 'pos', 'right' );
				if( callout ) {
					this.setCorrectClass( 'lyteArrowLeft' );
					aWidth = window.getComputedStyle( arrow, ':before' ).borderLeftWidth;
					aWidth = parseFloat( aWidth ? aWidth : '0px' );
					tempStore = this.setLeftForRight( par, offsets, x ) + aWidth + 'px';
				}
				else {
					body.style.left = this.setLeftForRight( par, offsets, x ) + 'px';
				}
			}
			if( downPos ){
				if( callout ){
					aHeight = window.getComputedStyle( arrow, ':before' ).borderLeftWidth;
					aHeight = parseFloat( aHeight ? aHeight : '0px' );
					tempMarginTop = window.getComputedStyle( arrow, ':before' ).marginTop;
					tempMarginTop = Math.abs( parseFloat( tempMarginTop ? tempMarginTop : '0px' ) );
					tempNum = ( ( offsets.height / 2 ) - aHeight + tempMarginTop ) * 100; // Had arrow.getBoundingClientRect()/2 
					tempDenom = drop.height;
					tempPer = tempNum / tempDenom;
					arrow.style.top = tempPer + '%';
				}

				body.style.left = tempStore ? tempStore : body.style.left;
				body.style.top = this.setTopForRight( par, offsets, y ) + 'px';
			}
			else{
				if( callout ) {
					aHeight = window.getComputedStyle( arrow, ':before' ).borderLeftWidth;
					aHeight = parseFloat( aHeight ? aHeight : '0px' );
					tempMarginTop = window.getComputedStyle( arrow, ':before' ).marginTop;
					tempMarginTop = Math.abs( parseFloat( tempMarginTop ? tempMarginTop : '0px' ) );
					tempNum = ( drop.height - offsets.height / 2 - aHeight + tempMarginTop ) * 100; // Had arrow.getBoundingClientRect()/2 
					tempDenom = drop.height;
					tempPer = tempNum / tempDenom;
					arrow.style.top = tempPer + '%'; 
				}

				body.style.left = tempStore ? tempStore : body.style.left;
				body.style.top = this.setTopForRightAbove( par, body, offsets, drop, y ) + 'px';
			}
		} else if( position === 'downLeft' ) {
			downPos = true;
			tempTop = offsets.top + offsets.height;
			if( tempTop + height > wheight && offsets.top > height ) {
				tempTop = offsets.top - height;
				downPos = false
			} else {
				downPos = true;
			}
			rightPos = false

			var aHeight = 0
			if( callout ) {
				this.setCorrectClass( downPos ? 'lyteArrowTop' : 'lyteArrowBottom' );
				aHeight = parseInt(window.getComputedStyle( arrow, ':before' ).borderLeftWidth);
			} 
			tempLeft = Math.max( offsets.left + offsets.width / 2 - width, offsets.left - width + 2 * aHeight );
			if( tempLeft < wleft ) {
				tempLeft = wleft
				rightPos = true
			} else { 
				rightPos  = false
			}
			body.style.top = tempTop + aHeight * (downPos ? 1 : -1) + y + 'px';

			body.style.left = tempLeft + x + 'px';
			var newArrowLeft;
			if( rightPos ) {
				newArrowLeft = ( offsets.left + 0.25 * offsets.width - tempLeft ) + 'px';
			} else { 
				newArrowLeft = Math.min(width - 0.25 * offsets.width, width - aHeight, width - aHeight - 2)  + 'px';
			}
			arrow.style.left = newArrowLeft;
			if( downPos ){
				pos = 'downLeft';
			} else {
				pos = 'upLeft';
			}
			this.setData( 'pos', pos);

		} else if( position === 'downRight' ) {
			downPos = true;
			tempTop = offsets.top + offsets.height;
			if( tempTop + height > wheight && offsets.top > height ) {
				tempTop = offsets.top - height;
				downPos = false
			} else {
				downPos = true;
			}
			rightPos = true

			var aHeight = 0
			if( callout ) {
				this.setCorrectClass( downPos ? 'lyteArrowTop' : 'lyteArrowBottom' );
				aHeight = parseInt(window.getComputedStyle( arrow, ':before' ).borderLeftWidth);
			}
			tempLeft = Math.min( offsets.left + offsets.width / 2, offsets.left + offsets.width - 2 * aHeight );
			if( tempLeft + width > wwidth ) {
				tempLeft = wwidth - width;
				rightPos = false;
			} else { 
				rightPos  = true;
			}

			body.style.top = tempTop + aHeight * (downPos ? 1 : -1) + y + 'px';

			body.style.left = tempLeft + x + 'px';
			var newArrowLeft;
			if( rightPos ) {
				newArrowLeft = Math.max( 0.25 * offsets.width, aHeight + 2 ) + 'px';
			} else { 
				newArrowLeft = ( offsets.left + 0.25 * offsets.width - tempLeft ) + 'px';
			}
			arrow.style.left = newArrowLeft;
			if( downPos ){
				pos = 'downLeft';
			} else {
				pos = 'upLeft';
			}
			this.setData( 'pos', pos);
		} else if( position === 'upLeft' ) {
			downPos = false;
			tempTop = offsets.top - height;
			if( tempTop < wtop) {
				tempTop = offsets.top + offsets.height;
				downPos = true
			} else {
				downPos = false;
			}
			rightPos = false
			var aHeight = 0
			if( callout ) {
				this.setCorrectClass( downPos ? 'lyteArrowTop' : 'lyteArrowBottom' );
				aHeight = parseInt(window.getComputedStyle( arrow, ':before' ).borderLeftWidth);
			} 
			tempLeft = Math.max( offsets.left + offsets.width / 2 - width, offsets.left - width + 2 * aHeight );
			if( tempLeft < wleft ) {
				tempLeft = wleft
				rightPos = true
			} else { 
				rightPos  = false
			}
			body.style.top = tempTop + aHeight * (downPos ? 1 : -1) + y + 'px';

			body.style.left = tempLeft + x + 'px';
			var newArrowLeft;
			if( rightPos ) {
				newArrowLeft = ( offsets.left + 0.25 * offsets.width - tempLeft ) + 'px';
			} else { 
				newArrowLeft = Math.min( width - 0.25 * offsets.width, width - aHeight, width - aHeight - 2 )  + 'px';
			}
			arrow.style.left = newArrowLeft;
			if( downPos ){
				pos = 'downLeft';
			} else {
				pos = 'upLeft';
			}
			this.setData( 'pos', pos);

		} else if( position === 'upRight' ) {
			downPos = false;
			tempTop = offsets.top - height;
			if( tempTop < wtop) {
				tempTop = offsets.top + offsets.height;
				downPos = true
			} else {
				downPos = false;
			}
			rightPos = true

			var aHeight = 0
			if( callout ) {
				this.setCorrectClass( downPos ? 'lyteArrowTop' : 'lyteArrowBottom' );
				aHeight = parseInt(window.getComputedStyle( arrow, ':before' ).borderLeftWidth);
			}
			tempLeft = Math.min( offsets.left + offsets.width / 2, offsets.left + offsets.width - 2 * aHeight );
			if( tempLeft + width > wwidth ) {
				tempLeft = wwidth - width;
				rightPos = false;
			} else { 
				rightPos  = true;
			}

			body.style.top = tempTop + aHeight * (downPos ? 1 : -1) + y + 'px';

			body.style.left = tempLeft + x + 'px';
			var newArrowLeft;
			if( rightPos ) {
				newArrowLeft = Math.max( 0.25 * offsets.width, aHeight + 2 ) + 'px';
			} else { 
				newArrowLeft = ( offsets.left + 0.25 * offsets.width - tempLeft ) + 'px';
			}
			arrow.style.left = newArrowLeft;
			if( downPos ){
				pos = 'downLeft';
			} else {
				pos = 'upLeft';
			}
			this.setData( 'pos', pos);
		}
			
	},

	checkForBoundary : function(menuBody){
		var clientRect = this.$node.element.getBoundingClientRect();
		var boundary = this.getData('ltPropBoundary');
		if((boundary.hasOwnProperty('left') ? (clientRect.left < boundary.left) : false) || (boundary.hasOwnProperty('right') ? (clientRect.right > boundary.right) : false)  || (boundary.hasOwnProperty('top') ? (clientRect.top < boundary.top) : false)  || (boundary.hasOwnProperty('bottom') ? (clientRect.bottom > boundary.bottom) : false))		
			{	
				this.hideMenu.call(this);
			}
	},

	traverseList:function(event){
		var kc = event.keyCode
		if((this.childComp && this.childComp.classList.contains('lyteMenuHidden'))||(kc != 13 && kc != 40 && kc != 38)){
				return
		}
		// event.preventDefault();
		var cursel = this.childComp.querySelector('.lyteMenuSelection')
		if(!cursel){
			var elem = this.childComp.querySelector('lyte-menu-item')
			if(elem){
				elem.classList.add('lyteMenuSelection')
				return ;
			}
		}
		
			var elements = this.childComp.querySelectorAll('lyte-menu-item')
			for(var i=0;i<elements.length;i++){
				if(elements[i].classList.contains('lyteMenuSelection')){
					break;
				}
			}
			if(kc == 13){
					elements[i].dispatchEvent( new Event( 'click', { bubbles : true } ) )
			}
			else if(kc == 38 && i != 0){
					var j = i
					i=i-1
					for(;i>-1;i--){
						if(!elements[i].classList.contains('lyteMenuActive') && !elements[i].classList.contains('lyteMenuFiltered')){
							break;
						}
					}
					if(i != -1){
						elements[j].classList.remove('lyteMenuSelection')
						elements[i].classList.add('lyteMenuSelection')
					}							
			}
			else if(kc == 40 && i != elements.length -1){
					var j = i
					i=i+1
					for(;i<elements.length;i++){
						if(!elements[i].classList.contains('lyteMenuActive') && !elements[i].classList.contains('lyteMenuFiltered')){
							break;
						}
					}
					if(i != elements.length){
						elements[j].classList.remove('lyteMenuSelection')
						elements[i].classList.add('lyteMenuSelection')
					}
			}
	},
	setFreeze:function(nodeName){
		$L('.lytemenufreezelayer:not(.nogroup)').removeClass('lyteMenuHidden')
		// freeze bound calculation
		var node = $L('.lytemenufreezelayer.left').e[0], rect = nodeName.getBoundingClientRect()
		node.style.height = rect.height +"px"
		node.style.width = rect.left + "px"
		node.style.top = rect.top + "px"
		document.body.style.overflow = 'hidden'
		node = $L('.lytemenufreezelayer.right').e[0]
		node.style.height = rect.height +"px"
		node.style.width = rect.left + "px"
		node.style.top = rect.top + "px"
		node = $L('.lytemenufreezelayer.top').e[0]
		node.style.height = rect.top +"px"
		node = $L('.lytemenufreezelayer.bottom').e[0]
		node.style.height = (window.innerHeight - (rect.top + rect.height)) +"px"
		document.addEventListener('wheel', this.preventEvent);
		document.addEventListener('keydown',this.preventEvent);
	},
	preventEvent : function(event){
		if(!(event.metaKey || event.shiftKey || event.ctrlKey))
			{
				if(this != document && event.type == 'wheel')
					{
						if(this.tagName = 'LYTE-MENU-BODY')
							{
								this.scrollTop += event.deltaY;
								var evt = new Event('scroll',{bubbles : true});
								this.dispatchEvent(evt)
							}
					}
				event.preventDefault();
				event.stopPropagation();
			}
	},
	addScrollPos : function(){
		var component = document.menu;
		component.setCss.call(component)
		while(component.childMenu)
			{
				component = component.childMenu;
				component.setCss.call(component);
			}
		component.checkForBoundary.call(component, component.childComp);			

	},
	removeFreeze : function(){
		if(!document.menu)
			{
				document.removeEventListener('wheel', this.preventEvent)
				document.removeEventListener('keydown',this.preventEvent)
				$L('.lytemenufreezelayer').addClass('lyteMenuHidden')
			}
	},
	setZIndex : function(flag){
		var nodeName = this.$node.element;
		if(nodeName)
			{
				while(nodeName && nodeName.tagName != 'HTML')
					{
						if(nodeName.classList.contains('lyteMenuGroup'))
							{
								if(!flag)
									{
										this.setFreeze.call(this, nodeName)
									}
								else
									{
										this.removeFreeze.call(this)
									}
								break		
							}
						else
							{
								nodeName = nodeName.parentElement;
							}	
					}
				if(nodeName && nodeName.tagName == 'HTML')
					{
						if(flag && !document.menu)
							{
								this.removeFreeze.call(this)
							}
						else 
							{	
								var freezeLayer = $L('.lytemenufreezelayer.nogroup').e[0];
								freezeLayer.classList.remove('lyteMenuHidden');
							}
					}	
			}

	}
});

  var lyteCloseMenu = function(event, element, flag){
	if(document._lyteMenu.preventClick != false || element)
	  	{
	  		if((event && event.button != 2) || element || flag)
				{
					var menus = $L('lyte-menu:not(.lyteMenuClosed)[lyte-rendered]').e;
					for(var i = 0; i < menus.length; i++)
						{
							if(menus[i] != element && !menus[i].component.childComp.classList.contains('lyteMenuHidden'))
								{
									if(flag || (!menus[i].component.childComp.contains(event.target)))
										{
											if( !menus[i].component._hideStarts ){
												var ret = menus[i].component.hideMenu.call(menus[i].component, element ? false : true, event, flag)
												if( ret ){
													menus[i].component._hideStarts = true
												}
											}
										}
								}
						}
				}
		}
    if(event && event.type == 'click')
		{
			document._lyteMenu.preventClick = true;
		}	
};




Lyte.createCustomElement("lyte-menu-item", {
	static : {
		"observedAttributes" : {
			get : function() {
				return ['lyte-shortcut'];
			}
		}
	},
	"attributeChangedCallback" : function(attributeName,oldValue,newValue) {
		if (typeof shortcut == "function") {
        	newValue = JSON.parse(newValue);
        	var newKey = newValue.key;
        	var type = newValue.type;
        	var wait = newValue.wait;
        	if (!oldValue) {
          		oldValue = {};
       		}
        	else{
        		oldValue = JSON.parse(oldValue)
        	}
       		shortcut.push({
          		newKey: newKey,
          		type: type,
          		wait: wait,
          		oldKey: oldValue.key,
          		value: this
        	});
      	}
	}
});

