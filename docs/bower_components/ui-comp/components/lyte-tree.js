Lyte.Component.register("lyte-tree", {
_template:"<template tag-name=\"lyte-tree\">  <template is=\"for\" items=\"{{ltPropData}}\" item=\"item\" index=\"index\">    <lyte-tree-body data-value=\"{{lyteUiTreeHelp(tempVar, index)}}\">      <div class=\"mainContainer\">        <template is=\"if\" value=\"{{ltPropYield}}\"><template case=\"true\">            <lyte-yield yield-name=\"content\" list-value=\"{{item}}\" list-index=\"{{lyteUiTreeHelp(tempVar, index)}}\" class=\"{{lyteUiTreeChildHelp(item, 'noChildTree')}}\"></lyte-yield>        </template></template>        <template is=\"if\" value=\"{{expHandlers(expHandlers(expHandlers(item.children.length,'!==',0),'&amp;&amp;',expHandlers(item.children,'!==',undefined)),'&amp;&amp;',expHandlers(item.collapsed,'!'))}}\"><template case=\"true\">          <lyte-tree temp-var=\"{{lyteUiTreeHelp(tempVar, index)}}\" lt-prop-data=\"{{item.children}}\" id=\"{{ltPropId}}\" lt-prop-tree-lines=\"{{ltPropTreeLines}}\" lt-prop-yield=\"{{ltPropYield}}\" lt-prop-open-class=\"{{ltPropOpenClass}}\" lt-prop-close-class=\"{{ltPropCloseClass}}\" on-toggle=\"{{method('onToggle')}}\">            <template is=\"registerYield\" yield-name=\"content\" from-parent=\"\">             </template>          </lyte-tree>       </template></template>      </div>    </lyte-tree-body>  </template></template>",
_dynamicNodes : [{"type":"attr","position":[1]},{"type":"for","position":[1],"dynamicNodes":[{"type":"attr","position":[1]},{"type":"attr","position":[1,1,1]},{"type":"if","position":[1,1,1],"cases":{"true":{"dynamicNodes":[{"type":"attr","position":[1]},{"type":"insertYield","position":[1]}]}},"default":{}},{"type":"attr","position":[1,1,3]},{"type":"if","position":[1,1,3],"cases":{"true":{"dynamicNodes":[{"type":"attr","position":[1]},{"type":"registerYield","position":[1,1],"dynamicNodes":[]},{"type":"componentDynamic","position":[1]}]}},"default":{}},{"type":"componentDynamic","position":[1]}]}],
_observedAttributes :["ltPropData","ltPropOpenClass","ltPropCloseClass","ltPropNochildClass","ltPropYield","treeHeight","tempVar"],
	data : function(){
		return {
			'ltPropData' : Lyte.attr('array' , {
				'default'  : []
			}),
			'ltPropOpenClass' : Lyte.attr('string' , {
				'default'  : ''
			}),
			'ltPropCloseClass' : Lyte.attr('string' , {
				'default'  : ''
			}),
			'ltPropNochildClass' : Lyte.attr('string' , {
				'default'  : ''
			}),
			'ltPropYield' 		: Lyte.attr('boolean' , {
				'default'  : false
			}),
			'treeHeight' :  Lyte.attr('number' , {
				'default'  : 0
			}),
			tempVar : Lyte.attr('string', { default : ''})

		}
	} ,

	methods : {
		onToggle : function(){

		}
	}
});

Lyte.createCustomElement("lyte-tree-icon" , {
	connectedCallback : function(){
		// debugger
		if(!this.hasAttribute('lyte-custom-icon')){
			this.innerHTML = '<i class="arrow up"></i>';
		}
	} ,
	constructor : function(){
		var res;
		var classComponent = this._contextSwitchInfo.node._callee.component;
		var lyteTreeIcon = this;
		if(classComponent.getData('ltPropOpenClass').length > 0){
			lyteTreeIcon.className = classComponent.getData('ltPropOpenClass');
		}
		this.addEventListener( 'click', function(evt) {
				evt.preventDefault();
				var element, btn;
				element = btn = this;
				var n=1;
				var flag = 1;
				while(n==1){
					element = element.parentElement;
					if((element !== null)&&(element !== undefined)){
						if(element.nodeName === "LYTE-TREE-BODY"){
						break;
						}
					}
				}
				// console.log(element);
				if(element.nodeName === "LYTE-TREE-BODY"){
					var treeCont = element.querySelector('lyte-tree');
					if(treeCont){
						function trans(){
							this.style.display = "none";
							btn.style.pointerEvents = "auto";
							this.removeEventListener('transitionend' , trans);
							lyteTreeIcon.className = classComponent.getData('ltPropCloseClass');
						}
						function heightTrans(){
							this.style.height = "auto";
							btn.style.pointerEvents = "auto";
							this.removeEventListener('transitionend' , heightTrans);
						}
						if(element !== null){
							this.style.pointerEvents = "none";
							lyteTreeIcon.className = classComponent.getData('ltPropCloseClass');
							var thisBtn = treeCont.component;
							var display = window.getComputedStyle(treeCont).display;
							if(display === "none"){
								treeCont.style.display = "block";
								lyteTreeIcon.className = classComponent.getData('ltPropOpenClass');
								treeCont.addEventListener('transitionend' , heightTrans);
								setTimeout(function(){
									treeCont.style.height = thisBtn.getData('treeHeight') + "px";
									if(!this.hasAttribute('lyte-custom-icon')){
										btn.innerHTML = '<i class="arrow up"></i>';
									}
								}.bind(this), 20)
							} else {
								thisBtn.setData('treeHeight' , treeCont.getBoundingClientRect().height);
								treeCont.style.height = thisBtn.getData('treeHeight') + "px";
								treeCont.addEventListener('transitionend' , trans);
								setTimeout(function(){
									treeCont.style.height = "0px";
									if(!this.hasAttribute('lyte-custom-icon')){
										btn.innerHTML = '<i class="arrow down"></i>';
									}
								}.bind(this), 20)
							}
						}
					}
				}

				var clickedBtn = element.parentElement,retVal = true;
				if(clickedBtn && clickedBtn.component.getMethods('onToggle'))
							{
								res =	clickedBtn.component.executeMethod('onToggle', element, evt, clickedBtn);
							}
							// console.log( element, evt, clickedBtn);
						if(res !== undefined){
							if( res && res.then ) {
							Promise.resolve( res ).then( function( arg ) {
								var treeDt = clickedBtn.component.getData('ltPropData');
								var path = element.getAttribute('data-value').split("");
								if(path.length<=2){
									var pathIndex = path[1];
									var x = treeDt[pathIndex];
									Lyte.objectUtils(x, 'add', 'collapsed', false);
								} else {
									var x = treeDt;
									for(var pathIndex = 1;pathIndex<path.length;pathIndex++){
										var x = treeDt[path[pathIndex]];
									}
									Lyte.objectUtils(x, 'add', 'collapsed', false)
								}
							}, function() {

							} );
						}	else {
							if(res){
								var treeDt = clickedBtn.component.getData('ltPropData');
								var path = element.getAttribute('data-value').split("");
								if(path.length<=2){
									var pathIndex = path[1];
									var x = treeDt[pathIndex];
									Lyte.objectUtils(x, 'add', 'collapsed', false);
								} else {
									var x = treeDt;
									for(var pathIndex = 1;pathIndex<path.length;pathIndex++){
										var x = treeDt[path[pathIndex]];
									}
									Lyte.objectUtils(x, 'add', 'collapsed', false)
								}
							}
						}
					} else {
						var treeDt = clickedBtn.component.getData('ltPropData');
						var path = element.getAttribute('data-value').split("");
						if(path.length<=2){
							var pathIndex = path[1];
							var x = treeDt[pathIndex];
							if(x !== undefined){
								Lyte.objectUtils(x, 'add', 'collapsed', false);
							}
						} else {
							var x = treeDt;
							for(var pathIndex = 1;pathIndex<path.length;pathIndex++){
								var x = treeDt[path[pathIndex]];
							}
							Lyte.objectUtils(x, 'add', 'collapsed', false)
						}
					}
		}.bind(this));
	},
	static : {
		 "observedAttributes" : {

		}
	}
});
