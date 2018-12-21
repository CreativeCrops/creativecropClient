Lyte.Component.register("lyte-dragdrop", {
_template:"<template tag-name=\"lyte-dragdrop\">\t<div class=\"lyteDragDropFields\">\t\t<div class=\"lyteDragDropColumns\">\t\t\t<div class=\"lyteDragDropFL lytePosRel\">\t\t\t\t<span class=\"lyteDragDropHeading\">{{ltPropAvailableLabel}}</span>\t\t\t\t\t<div class=\"lyteDragDropAvailable\">\t\t\t\t\t<span class=\"lyteSelectedNone\" id=\"AvailableNone\">{{ltPropAvailablelistEmptyMessage}}</span>\t\t\t\t\t<template is=\"if\" value=\"{{ltPropEnableSearch}}\">\t\t\t\t\t<template case=\"true\">\t\t\t\t\t<div class=\"lytePosRel\">\t\t\t\t\t\t<lyte-search style=\"display: block;\" lt-prop-style=\"{{ltPropSearchStyle}}\" lt-prop-query-selector=\"{{querySelector}}\" lt-prop-appearance=\"box\" lt-prop-error=\"{{ltPropErrorMessage}}\" lt-prop-width=\"464px\"></lyte-search>\t\t\t\t\t\t</div>\t\t\t\t\t<ul class=\"lyteAvailableUL\" id=\"sortableSec\">\t\t\t\t\t<template is=\"for\" items=\"{{ltPropAvailablelist}}\" item=\"item\">                     \t<li class=\"filterlabel sortableElem\" data-pos=\"{{item.pos}}\" data-propvalue=\"{{item}}\" onmousedown=\"{{action('mouseDown', event)}}\" onmouseover=\"{{action('mouseOver',event)}}\" onmouseout=\"{{action('mouseOut', event)}}\">                     \t\t<span class=\"item\">{{item.name}}</span>                     \t\t<template is=\"if\" value=\"{{ltPropDraggable}}\">                     \t\t\t<template case=\"true\">                     \t\t\t\t<template is=\"if\" value=\"{{ltPropEnableIcon}}\">                     \t\t\t\t\t<template case=\"true\"><span class=\"lyteDragDropAdd\"></span></template>                     \t\t\t\t</template>                     \t\t\t</template>                     \t\t</template>                     \t</li>\t\t\t\t\t</template>                    </ul>                    </template>                    <template case=\"false\">\t\t\t\t\t<ul class=\"lyteAvailableUL\" id=\"sortableSec\" style=\"height: 336px;\">\t\t\t\t\t<template is=\"for\" items=\"{{ltPropAvailablelist}}\" item=\"item\">                     \t<li class=\"filterlabel sortableElem\" data-pos=\"{{item.pos}}\" data-propvalue=\"{{item}}\" onmousedown=\"{{action('mouseDown', event)}}\" onmouseover=\"{{action('mouseOver',event)}}\" onmouseout=\"{{action('mouseOut', event)}}\">                     \t\t<span class=\"item\">{{item.name}}</span>                     \t\t<template is=\"if\" value=\"{{ltPropDraggable}}\">                     \t\t\t<template case=\"true\">                     \t\t\t\t<template is=\"if\" value=\"{{ltPropEnableIcon}}\">                     \t\t\t\t\t<template case=\"true\"><span class=\"lyteDragDropAdd\"></span></template>                     \t\t\t\t</template>                     \t\t\t</template>                     \t\t</template>                     \t</li>\t\t\t\t\t</template>                    </ul>                    </template>\t\t\t\t\t</template>\t\t\t\t</div>\t\t\t</div>\t\t\t<template is=\"if\" value=\"{{ltPropDraggable}}\">\t\t\t\t<template case=\"true\">\t\t\t\t\t<div class=\"lyteDragDropFL lytePosRel\">\t\t\t\t\t\t<span class=\"lyteDragDropHeading\">{{ltPropSelectedLabel}}</span>\t\t\t\t\t\t\t<div class=\"lyteDragDropSelected\">\t\t\t\t\t\t\t<span class=\"lyteSelectedNone\" id=\"SelectedNone\">{{ltPropSelectedlistEmptyMessage}}</span>\t\t\t\t\t\t\t<ul class=\"lyteSelectedUL\" id=\"dropSec\">\t\t\t\t\t\t\t<template is=\"for\" items=\"{{ltPropSelectedlist}}\" item=\"item\">\t\t                     \t<li data-pos=\"{{item.pos}}\" data-propvalue=\"{{item}}\" onmousedown=\"{{action('mouseDown', event)}}\" onmouseover=\"{{action('mouseOver',event)}}\" onmouseout=\"{{action('mouseOut', event)}}\">\t\t                     \t\t<span>{{item.name}}</span>\t\t                     \t\t<template is=\"if\" value=\"{{ltPropEnableIcon}}\">\t\t                     \t\t\t<template case=\"true\"><span class=\"lyteDragDropRemove\"></span></template>\t\t                     \t\t</template>\t\t                     \t</li>\t\t\t\t\t\t\t</template>\t\t\t\t\t\t\t</ul>\t\t\t\t\t\t</div>\t\t\t\t\t</div>\t\t\t\t</template>\t\t\t</template>\t\t</div>\t</div></template>",
_dynamicNodes : [{"type":"text","position":[1,1,1,1,0]},{"type":"text","position":[1,1,1,3,1,0]},{"type":"attr","position":[1,1,1,3,3]},{"type":"if","position":[1,1,1,3,3],"cases":{"true":{"dynamicNodes":[{"type":"attr","position":[1,1]},{"type":"componentDynamic","position":[1,1]},{"type":"attr","position":[3,1]},{"type":"for","position":[3,1],"dynamicNodes":[{"type":"attr","position":[1]},{"type":"text","position":[1,1,0]},{"type":"attr","position":[1,3]},{"type":"if","position":[1,3],"cases":{"true":{"dynamicNodes":[{"type":"attr","position":[1]},{"type":"if","position":[1],"cases":{"true":{"dynamicNodes":[]}},"default":{}}]}},"default":{}}]}]},"false":{"dynamicNodes":[{"type":"attr","position":[1,1]},{"type":"for","position":[1,1],"dynamicNodes":[{"type":"attr","position":[1]},{"type":"text","position":[1,1,0]},{"type":"attr","position":[1,3]},{"type":"if","position":[1,3],"cases":{"true":{"dynamicNodes":[{"type":"attr","position":[1]},{"type":"if","position":[1],"cases":{"true":{"dynamicNodes":[]}},"default":{}}]}},"default":{}}]}]}},"default":{}},{"type":"attr","position":[1,1,3]},{"type":"if","position":[1,1,3],"cases":{"true":{"dynamicNodes":[{"type":"text","position":[1,1,0]},{"type":"text","position":[1,3,1,0]},{"type":"attr","position":[1,3,3,1]},{"type":"for","position":[1,3,3,1],"dynamicNodes":[{"type":"attr","position":[1]},{"type":"text","position":[1,1,0]},{"type":"attr","position":[1,3]},{"type":"if","position":[1,3],"cases":{"true":{"dynamicNodes":[]}},"default":{}}]}]}},"default":{}}],
_observedAttributes :["ltPropAvailablelist","ltPropSelectedlist","ltPropMultiselect","ltPropEnableSearch","ltPropEnableIcon","ltPropDraggable","ltPropErrorMessage","ltPropAvailablelistEmptyMessage","ltPropSelectedlistEmptyMessage","ltPropSearchStyle","ltPropAvailableLabel","ltPropSelectedLabel","clickCount","component","placeholder","div","offset","isDown","isMoved","top","bottom","prevScrollTop","multiSelectedItems","keyPressed","keyValue","prevMode","checkSelection","querySelector","left","right","availableList","selectedList","checkOnDidconnect","draggedItems"],
	init : function(){
		if(!this.getData('ltPropErrorMessage')){
			this.setData('ltPropErrorMessage',_lyteUiUtils.i18n("no.results.found"));
		}
		this.setData('ltPropAvailableLabel',_lyteUiUtils.i18n("Available"));
		this.setData('ltPropSelectedLabel',_lyteUiUtils.i18n("Selected"));
	},
	didConnect : function() {

		var dragdrops = document.querySelectorAll('lyte-dragdrop');
		for(var v = 0 ; v < dragdrops.length; v++){
			if(dragdrops[v] == this.$node){
				// console.log(v);
				this.$node.querySelector('#sortableSec').classList.add('searchable'+v);
				this.setData('querySelector',{'scope':'.searchable'+v,'target':'.filterlabel','search':'.item'});
				// console.log(this.getData('querySelector'));
				break;
			}
		}
		this.setData('checkOnDidconnect',true);
	},
	data : function(){
        return {
			"ltPropAvailablelist" : Lyte.attr("array",{"default":[]}),
			"ltPropSelectedlist" : Lyte.attr("array",{"default":[]}),
			"ltPropMultiselect" : Lyte.attr("boolean",{"default":true}),
			"ltPropEnableSearch" : Lyte.attr("boolean",{"default":true}),
			"ltPropEnableIcon" : Lyte.attr("boolean",{"default":true}),
			"ltPropDraggable" : Lyte.attr("boolean",{"default":true}),
			"ltPropErrorMessage" : Lyte.attr("string",{"default":""}),
			"ltPropAvailablelistEmptyMessage" : Lyte.attr("string",{"default" : "Empty List"}),
			"ltPropSelectedlistEmptyMessage" : Lyte.attr("string",{"default" : "Drop Here"}),
			"ltPropSearchStyle" : Lyte.attr("string",{"default" : ""}),
			"ltPropAvailableLabel" : Lyte.attr("string"),
			"ltPropSelectedLabel" : Lyte.attr("string"),

			/*local variables of the component*/
			"clickCount" : Lyte.attr("number",{"default":0}),
			"component" : Lyte.attr("object",{"default":null}),
			"placeholder" : Lyte.attr("object",{"default":null}),
			"div" : Lyte.attr("object",{"default":null}),
			"offset" : Lyte.attr("array",{"default":[0,0]}),
			"isDown" : Lyte.attr("boolean",{"default":false}),
			"isMoved" : Lyte.attr("boolean",{"default":false}),
			"top" : Lyte.attr("number",{"default":0}),
			"bottom" : Lyte.attr("number",{"default":0}),
			"prevScrollTop" : Lyte.attr("number",{"default":0}),
			"multiSelectedItems" : Lyte.attr("array",{"default":[]}),
			"keyPressed" : Lyte.attr("boolean",{"default":false}),
			"keyValue" : Lyte.attr("number",{"default":0}),
			"prevMode" : Lyte.attr("string",{"default":""}),
			"checkSelection" : Lyte.attr("boolean",{"default":false}),
			"querySelector" : Lyte.attr("object",{"default":{'scope':'#sortableSec','target':'.filterlabel','search':'.item'}}),
			"left" : Lyte.attr("boolean",{"default":false}),
			"right" : Lyte.attr("boolean",{"default":false}),
			"availableList" : Lyte.attr("array",{"default" : []}),
			"selectedList" : Lyte.attr("array",{"default" : []}),
			"checkOnDidconnect" : Lyte.attr("boolean",{"default" : false}),
			"draggedItems" : Lyte.attr("array",{"default" : []})
		}
	},

	makeDroppable : function(current){
		var dropables1 = this.$node.querySelectorAll('#sortableSec>li');
		var dropables2 = this.$node.querySelectorAll('#dropSec>li');
		if(dropables1.length > 0){
			for(var i = 0; i<dropables1.length ; i++){
				if(dropables1[i] !== current){
					dropables1[i].classList.add('dropable');
				}
			}
		}
		if(dropables2.length > 0){
			for(var i = 0; i<dropables2.length ; i++){
				if(dropables2[i] !== current){
					dropables2[i].classList.add('dropable');
				}
			}
		}
	},

	showMsgForEmpty : function(){
		if(this.getData('ltPropAvailablelist').length > 0){
			this.$node.querySelector('#AvailableNone').style.visibility = "hidden";
		}
		if(this.getData('ltPropAvailablelist').length == 0){
			this.$node.querySelector('#AvailableNone').style.visibility = "visible";
		}
		if(this.getData('ltPropDraggable')){
			if(this.getData('ltPropSelectedlist').length == 0){
		    	this.$node.querySelector('#SelectedNone').style.visibility = "visible";
		    }
		    if(this.getData('ltPropSelectedlist').length > 0){
		    	this.$node.querySelector('#SelectedNone').style.visibility = "hidden";
		    }
		}
	}.observes('ltPropAvailablelist.[]','ltPropSelectedlist.[]','checkOnDidconnect'),

	removeDropable : function(current){
		var dropables1 = this.$node.querySelectorAll('#sortableSec>li');
		var dropables2 = this.$node.querySelectorAll('#dropSec>li');
		if(dropables1.length > 0){
			for(var i = 0; i<dropables1.length ; i++){
				if(dropables1[i] !== current){
					dropables1[i].classList.remove('dropable');
				}
			}
		}
		if(dropables2.length > 0){
			for(var i = 0; i<dropables2.length ; i++){
				if(dropables2[i] !== current){
					dropables2[i].classList.remove('dropable');
				}
			}
		}
	},


	generateArray : function(){
		// this.hideOrShowMessageOnEmpty("availableList","Empty Array");
		var array1 = Array.from(this.$node.querySelectorAll("#sortableSec>li"));
		var array2 = Array.from(this.$node.querySelectorAll("#dropSec>li"));
		//console.log(array2);
		ltPropAvailablelist = [];
		ltPropSelectedlist = [];
		for(var i = 1 ; i<=array1.length ; i++){
			var obj = this.getElement(array1[i-1]);
			if(obj){
				obj.pos = i;
				ltPropAvailablelist.push(obj);
			}
		}
		for(var i = 1 ; i<=array2.length; i++){
			var obj = this.getElement(array2[i-1]);
			obj.pos = i;
			ltPropSelectedlist.push(obj);
		}
	    this.setData('availableList',ltPropAvailablelist);
	    this.setData('selectedList',ltPropSelectedlist);
	},

	removeClass : function(){
		var array1 = Array.from(this.$node.querySelectorAll("#sortableSec>li"));
		var array2 = Array.from(this.$node.querySelectorAll("#dropSec>li"));
		for(var v = 0 ; v< array1.length ; v++){
			if(array1[v].classList.contains('lyteDraggableElem')){
				array1[v].classList.remove('lyteDraggableElem');
			}
		}
		for(var v = 0 ; v< array2.length ; v++){
			if(array2[v].classList.contains('lyteDraggableElem')){
				array2[v].classList.remove('lyteDraggableElem');
			}
		}
	},

	//Push the selected items in the array based on their position in DOM
	positionalPush : function(item,tempArray){
		var multiSelectedItems = this.getData('multiSelectedItems');
		var pos = 0;
		for(var v = 0 ; v < multiSelectedItems.length ; v++){
			if(multiSelectedItems[v].offsetTop > item.offsetTop){
				break;
			}
			else{
				++pos;
			}
		}
		multiSelectedItems.splice(pos,0,item);
		this.setData('multiSelectedItems',multiSelectedItems);
	},


	//Adds the selected items to an array for multiselected drag and drop
	addToArray : function(item,mode){
		if(mode === "single"){
			var multiSelectedItems = this.getData('multiSelectedItems');
			var emptyArray = [];
			if(multiSelectedItems.length > 0){
				var array1 = Array.from(this.$node.querySelectorAll("#sortableSec>li"));
				var array2 = Array.from(this.$node.querySelectorAll("#dropSec>li"));
				var lastItem = multiSelectedItems[multiSelectedItems.length - 1];
				var indexOfLastItem = array1.indexOf(lastItem);
				if(indexOfLastItem == -1){
					indexOfLastItem = array2.indexOf(lastItem);
					var index = array2.indexOf(item);
					if(index == -1){
						this.setData('multiSelectedItems',emptyArray);
						this.removeClass();
						this.addToArray(item,mode);
					}
					else{
						this.positionalPush(item);
						if(!(item.classList.contains('lyteDraggableElem'))){
							item.classList.add('lyteDraggableElem');
						}
					}
				}
				else{
					var index = array1.indexOf(item);
					if(index == -1){
						this.setData('multiSelectedItems',emptyArray);
						this.removeClass();
						this.addToArray(item,mode);
					}
					else{
						this.positionalPush(item);
						if(!(item.classList.contains('lyteDraggableElem'))){
							item.classList.add('lyteDraggableElem');
						}
					}
				}
			}
			else{
				this.getData('multiSelectedItems').push(item);
				if(!(item.classList.contains('lyteDraggableElem'))){
					item.classList.add('lyteDraggableElem');
				}
			}
			this.setData('prevMode',mode);
		}
		if(mode == "multiple"){
			if(this.getData('prevMode') == "multiple" || this.getData('prevMode')== ""){
				this.removeClass();
				var newMultiSelectedItems = [];
				var array1 = Array.from(this.$node.querySelectorAll("#sortableSec>li"));
				var array2 = Array.from(this.$node.querySelectorAll("#dropSec>li"));
				var index = array1.indexOf(item);
				if(index == -1){
					index = array2.indexOf(item);
					for(var v = 0;v <= index; v++){
						newMultiSelectedItems.push(array2[v]);
						array2[v].classList.add('lyteDraggableElem');
					}
				}
				else{
					for(var v = 0;v <= index; v++){
						newMultiSelectedItems.push(array1[v]);
						array1[v].classList.add('lyteDraggableElem');
					}
				}
				this.setData('multiSelectedItems',newMultiSelectedItems);
			}
			if(this.getData('prevMode') == "single"){
				var array1 = Array.from(this.$node.querySelectorAll("#sortableSec>li"));
				var array2 = Array.from(this.$node.querySelectorAll("#dropSec>li"));
				var multiSelectedItems = this.getData('multiSelectedItems');
				if(multiSelectedItems.length > 0){
					var lastItem = multiSelectedItems[multiSelectedItems.length - 1];
					var indexOfLastItem = array1.indexOf(lastItem);
					if(indexOfLastItem == -1){
						indexOfLastItem = array2.indexOf(lastItem);
						var index = array2.indexOf(item);
						if(index == -1){
							this.setData('prevMode',mode);
							this.removeClass();
							this.addToArray(item,mode);
						}
						else{
							if(indexOfLastItem != -1){
								if(indexOfLastItem <= index){
									for(var v = indexOfLastItem; v <= index ; v++){
										if(multiSelectedItems.indexOf(array2[v]) == -1){
											array2[v].classList.add('lyteDraggableElem');
											this.positionalPush(array2[v]);
										}
									}
								}
								else{
									for(var v = index; v <= indexOfLastItem ; v++){
										if(multiSelectedItems.indexOf(array2[v]) == -1){
											array2[v].classList.add('lyteDraggableElem');
											this.positionalPush(array2[v]);
										}
									}
								}
							}
						}
					}
					else{
						var index = array1.indexOf(item);
						if(index === -1){
							this.setData('prevMode',mode);
							this.removeClass();
							this.addToArray(item,mode);
						}
						else{
							if(indexOfLastItem != -1){
								if(indexOfLastItem <= index){
									for(var v = indexOfLastItem; v <= index ; v++){
										if(multiSelectedItems.indexOf(array1[v]) == -1){
											array1[v].classList.add('lyteDraggableElem');
											this.positionalPush(array1[v]);
										}
									}
								}
								else{
									for(var v = index; v <= indexOfLastItem ; v++){
										if(multiSelectedItems.indexOf(array1[v]) == -1){
											array1[v].classList.add('lyteDraggableElem');
											this.positionalPush(array1[v]);
										}
									}
								}
							}
						}
					}
				}
				else{
					this.setData('prevMode',mode);
					this.removeClass();
					this.addToArray(item,mode);
				}
				
			}
			this.setData('prevMode',mode);
		}
	},

	//Removes some items from the array
	removeFromArray : function(item){
		if(this.getData('multiSelectedItems').length > 0){
			var index = this.getData('multiSelectedItems').indexOf(item);
			this.getData('multiSelectedItems').splice(index,1);
		}
	},
	
	//Gets the top and bottom for multiSelected items
	getTopNBottom : function(prop){
		if(prop === "top"){
			return this.getData('multiSelectedItems')[0].getBoundingClientRect().top;
		}
		if(prop == "bottom"){
			return this.getData('multiSelectedItems')[this.getData('multiSelectedItems').length - 1].getBoundingClientRect().bottom;
		}
	},

	//Adds class to the selected items to identify them as droppable
	makeDroppableMultiple : function(array){
		var dropables1 = Array.from(this.$node.querySelectorAll('#sortableSec>li'));
		var dropables2 = Array.from(this.$node.querySelectorAll('#dropSec>li'));
		if(dropables1.indexOf(array[0]) == -1){
			if(dropables1.length > 0){
				for(var i = 0; i<dropables1.length ; i++){
					dropables1[i].classList.add('dropable');
				}
			}
			if(dropables2.length > 0){
				for(var i = 0; i<dropables2.length ; i++){
					flag = false;
					for(var j = 0; j<array.length; j++){
						if(dropables2[i] == array[j]){
							flag = true;
							break;
						}
					}
					if(!flag){
						dropables2[i].classList.add('dropable');
					}
				}
			}
		}
		else{
			if(dropables1.length > 0){
				for(var i = 0; i<dropables1.length ; i++){
					flag = false;
					for(var j = 0; j<array.length; j++){
						if(dropables1[i] == array[j]){
							flag = true;
							break;
						}
					}
					if(!flag){
						dropables1[i].classList.add('dropable');
					}
				}
			}
			if(dropables2.length > 0){
				for(var i = 0; i<dropables2.length ; i++){
					dropables2[i].classList.add('dropable');
				}
			}
		}
	},

	//Removes class from the selected items after they are dropped
	removeDropableMultiple : function(array){
		var dropables1 = Array.from(this.$node.querySelectorAll('#sortableSec>li'));
		var dropables2 = Array.from(this.$node.querySelectorAll('#dropSec>li'));
		if(dropables1.indexOf(array[0]) == -1){
			if(dropables1.length > 0){
				for(var i = 0; i<dropables1.length ; i++){
					dropables1[i].classList.remove('dropable');
				}
			}
			if(dropables2.length > 0){
				for(var i = 0; i<dropables2.length ; i++){
					flag = false;
					for(var j = 0; j<array.length; j++){
						if(dropables2[i] == array[j]){
							flag = true;
							break;
						}
					}
					if(!flag){
						dropables2[i].classList.remove('dropable');
					}
				}
			}
		}
		else{
			if(dropables1.length > 0){
				for(var i = 0; i<dropables1.length ; i++){
					flag = false;
					for(var j = 0; j<array.length; j++){
						if(dropables1[i] == array[j]){
							flag = true;
							break;
						}
					}
					if(!flag){
						dropables1[i].classList.remove('dropable');
					}
				}
			}
			if(dropables2.length > 0){
				for(var i = 0; i<dropables2.length ; i++){
					dropables2[i].classList.remove('dropable');
				}
			}
		}
	},

	checkElement : function(ele){
		if((ele == this.$node.querySelector('#sortableSec')) || (ele == this.$node.querySelector('#dropSec'))){
			return true;
		}
		return false;
	},

	checkPossiblePosition : function(ele,prop){
		var array = Array.from(this.$node.querySelectorAll('#'+ele.id+' > li'));
		if(prop == "single"){
			if(array.length > 0){
				var lastChild = array[array.length - 1];
				if(this.getData('div').getBoundingClientRect().top > lastChild.getBoundingClientRect().bottom){
					return true
				}
			}
			else{
				return true;
			}
		}
		if(prop == "multiple"){
			if(array.length > 0){
				var lastChild = array[array.length - 1];
				var top = this.getTopNBottom("top");
				if(top > lastChild.getBoundingClientRect().bottom){
					return true;
				} 
			}
			else{
				return true;
			}
		}
		return false;
	},

	checkIfDroppable : function(elem,prop){
		if(prop === "multiple"){
			var multiSelectedItems = this.getData('multiSelectedItems');
			if((multiSelectedItems[0].parentElement.id === elem.id) && elem.id === "sortableSec" && (elem.querySelectorAll('li').length === multiSelectedItems.length) && multiSelectedItems[0].getBoundingClientRect().left < (elem.getBoundingClientRect().left + multiSelectedItems[0].getBoundingClientRect().width / 2)){
				return true;
			}
			if((multiSelectedItems[0].parentElement.id === elem.id) && elem.id === "dropSec" && (elem.querySelectorAll('li').length === multiSelectedItems.length) && multiSelectedItems[0].getBoundingClientRect().right > (elem.getBoundingClientRect().right - multiSelectedItems[0].getBoundingClientRect().width / 2)){
				return true;
			}
		}
		if(prop === "single"){
			var div = this.getData('div');
			if((div.parentElement.id === elem.id) && elem.id === "sortableSec" && (elem.querySelectorAll('li').length === 1) && div.getBoundingClientRect().left < (elem.getBoundingClientRect().left + div.getBoundingClientRect().width / 2)){
				return true;
			}
			if((div.parentElement.id === elem.id) && elem.id === "dropSec" && (elem.querySelectorAll('li').length === 1) && div.getBoundingClientRect().right > (elem.getBoundingClientRect().right - div.getBoundingClientRect().width / 2)){
				return true;
			}
		}
		return false;
	},

	//Moves the item from one div to another when the icon is clicked or double click happens on the item
	appendElement : function(event,prop){
		// console.log(event.target.parentElement);
		var elem = event.target;
		var element;
		if(prop == 'span'){
			if(elem.classList.contains('lyteDragDropAdd') && this.onClickFunction(event,this.getElement(elem.parentElement),"availableList")){
				// this.$node.querySelector('#dropSec').appendChild(elem.parentElement);
				element = this.getElement(elem.parentElement);
				Lyte.arrayUtils(this.getData('ltPropAvailablelist'),'removeAt',this.getElementPosition(this.getData('ltPropAvailablelist'),element),1);
				Lyte.arrayUtils(this.getData('ltPropSelectedlist'),'push',element);
				element = null;
				this.generateArray();
				this.onDropFunction(event);
			}
			if(elem.classList.contains('lyteDragDropRemove') && this.onClickFunction(event,this.getElement(elem.parentElement),"selectedList")){
				// this.$node.querySelector('#sortableSec').appendChild(elem.parentElement);
				element = this.getElement(elem.parentElement);
				Lyte.arrayUtils(this.getData('ltPropSelectedlist'),'removeAt',this.getElementPosition(this.getData('ltPropSelectedlist'),element),1);
				Lyte.arrayUtils(this.getData('ltPropAvailablelist'),'push',element);
				element = null;
				this.generateArray();
				this.onDropFunction(event);
			}
		}
		else{
			while(elem){
				if(elem.parentElement && elem.parentElement.id == 'sortableSec' && this.onClickFunction(event,this.getElement(elem),"availableList")){
					element = this.getElement(elem);
					Lyte.arrayUtils(this.getData('ltPropAvailablelist'),'removeAt',this.getElementPosition(this.getData('ltPropAvailablelist'),element),1);
					Lyte.arrayUtils(this.getData('ltPropSelectedlist'),'push',element);
					element = null;
					this.generateArray();
					this.onDropFunction(event);
					break;
				}
				if(elem.parentElement && elem.parentElement.id == 'dropSec' && this.onClickFunction(event,this.getElement(elem),"selectedList")){
					element = this.getElement(elem);
					Lyte.arrayUtils(this.getData('ltPropSelectedlist'),'removeAt',this.getElementPosition(this.getData('ltPropSelectedlist'),element),1);
					Lyte.arrayUtils(this.getData('ltPropAvailablelist'),'push',element);
					element = null;
					this.generateArray();
					this.onDropFunction(event);
					break;
				}
				elem = elem.parentElement;
			}
		}
		
	},

	removeStyle : function(obj){
		obj.style.left = "";
    	obj.style.top = "";
    	// obj.style.zIndex = "";
    	obj.style.boxSizing = "";
    	obj.style.width = "";
    	obj.style.height = "";
    	obj.style.position = "";
    	obj.style.visibility = "";
	},

	getElement : function(elem){
		if(elem.dataset.propvalue){
			return JSON.parse(elem.dataset.propvalue);
		}
		return null;
	},

	getElementPosition : function(arrayElm,elem){
		for(var i =0;i<arrayElm.length;i++){
			var flag = true;
			for (var key in arrayElm[i]){
				if(arrayElm[i][key] != elem[key]){
					flag = false;
					break;
				}
			}
			if(flag){
				return i;
			}
		}
		return -1;
	},

	hideOrShowMessageOnEmpty : function(prop,msg){
		if(prop == "availableList"){
			if(this.getData('ltPropAvailablelist').length > 0){
				this.$node.querySelector('#AvailableNone').style.visibility = "hidden";
			}
			else{
				if(msg){
					this.$node.querySelector('#AvailableNone').innerHTML = msg;
				}
				this.$node.querySelector('#AvailableNone').style.visibility = "visible";
			}
		}
		else if(prop == "selectedList"){
			if(this.getData('ltPropSelectedlist').length > 0){
				this.$node.querySelector('#SelectedNone').style.visibility = "hidden";
			}
			else{
				if(msg){
					this.$node.querySelector('#SelectedNone').innerHTML = msg;
				}
				this.$node.querySelector('#SelectedNone').style.visibility = "visible";
			}
		}
		
	},

	selectFunction : function(event,target){
		var fromList = target.parentElement.id == "sortableSec" ? "availableList" : "selectedList"; 
		var returnVal;
		if(this.getMethods("onSelect")){
			returnVal = this.executeMethod("onSelect",event,this.getElement(target),this.getData('ltPropAvailablelist'),this.getData('ltPropSelectedlist'),fromList);	
		}
		return (returnVal == undefined) ? true : returnVal;
	},

	onDragFunction : function(event){
		var items;
		if(this.getData('ltPropMultiselect')){
			items = this.getData('multiSelectedItems');
		}
		else{
			items = this.getData('div');
		}
		if(this.getMethods("onDrag")){
			this.executeMethod("onDrag",event,items);	
		}
	},

	onBeforeDropFunction : function(event){
		var returnVal;
		var items = [];
		if(this.getData('ltPropMultiselect')){
			for(var i = 0; i<this.getData('multiSelectedItems').length ;i++){
				items.push(this.getElement(this.getData('multiSelectedItems')[i]));
			}
		}
		else{
			items.push(this.getElement(this.getData('div')));
		}
		this.setData("draggedItems",items);
		if(this.getMethods("onBeforeDrop")){
			returnVal = this.executeMethod("onBeforeDrop",event,items,this.getData('ltPropAvailablelist'),this.getData('ltPropSelectedlist'));	
		}
		return (returnVal == undefined) ? true : returnVal;
	},

	onDropFunction : function(event){
		if(this.getMethods("onDrop")){
			this.executeMethod("onDrop",event,this.getData('draggedItems'),this.getData('availableList'),this.getData('selectedList'));	
		}
	},

	onClickFunction : function(event,element,fromList){
		var returnVal;
		var items = [];
		items.push(element);
		this.setData('draggedItems',items);
		if(this.getMethods("onClick")){
			returnVal = this.executeMethod("onClick",event,element,this.getData('ltPropAvailablelist'),this.getData('ltPropSelectedlist'),fromList);
		}
		return (returnVal == undefined) ? true : returnVal;
	},

	 actions : {
	 	mouseDown : function(event){
	 		if(event.which == 3){
	 			return;
	 		}
	 		event.preventDefault();

	 		//Disable right click on the sortable elements to avoid unwanted behaviour
	 		if(event.which == 3){
	 			return;
	 		}
		 	var clickCount = this.getData('clickCount');
		 	clickCount++;
		 	this.setData('clickCount',clickCount);
		 	var self = this;
		    if (clickCount === 1) {
		        singleClickTimer = setTimeout(function() {
		            clickCount = 0;
		            self.setData('clickCount',clickCount);
		        }, 400);
		    } else if (clickCount === 2) {
		        clearTimeout(singleClickTimer);
		        clickCount = 0;
		        this.setData('clickCount',clickCount);
		        this.appendElement(event);
		        return;
		    }
	 		var target;
			var elem = event.target;
			// console.log(elem);
			if(elem.classList.contains('lyteDragDropAdd')){
				this.appendElement(event,'span');
			}
			else if(elem.classList.contains('lyteDragDropRemove')){
				this.appendElement(event,'span');
			}
			else{
				if(elem.tagName.toLowerCase() == 'span'){
					target = event.target.parentElement;
					// console.log(target);
				}
				else{
					target = event.target;
				}
			}
			
			if(target && this.selectFunction(event,target)){
				var targetOffset = target.getBoundingClientRect();
				var parentOffset = target.offsetParent.getBoundingClientRect();
				var height = target.clientHeight;
				var width = target.clientWidth;
				var multiSelectedItems = this.getData('multiSelectedItems');
				/*---- Multiple DragDrop ----*/
				if(this.getData('ltPropMultiselect')){
		 			if(multiSelectedItems.length > 0 && (multiSelectedItems.indexOf(target) != -1)){
						this.setData('offset',[
							event.clientX - targetOffset.left,
					        event.clientY - targetOffset.top
						]);
			 			this.setData('div',target);
						// console.log(this.getData('div'));
						var div = this.getData('div');
						var height = target.clientHeight;
						var width = target.clientWidth;
						// div.style.zIndex = 1001;
						div.style.left = (targetOffset.left - parentOffset.left) + 'px';
						div.style.top = (targetOffset.top - parentOffset.top) + 'px';
						// console.log('pointedItem left->',target.getBoundingClientRect().left)
						// console.log('pointedItem top->',target.getBoundingClientRect().top)
						div.style.boxSizing = "border-box";
						div.style.width = width +'px';
						div.style.height = height +'px';
						div.style.position = "absolute";
						div.classList.add('lyteDraggableElem');

						this.setData('placeholder',document.createElement('li'));
						var placeholder = this.getData('placeholder');
						placeholder.setAttribute("id","dummy");
						placeholder.style.width = width +'px';
						placeholder.style.height = height +'px';
						placeholder.style.boxSizing = "border-box";
						
						
						div.parentNode.insertBefore(placeholder, div);
						this.setData('checkSelection', true);
					}
					else{
						var keyValue = this.getData('keyValue');
			 			if(keyValue == 91 || keyValue == 93 || keyValue == 224){
			 				//console.log("here");
			 				//this.setData('keyValue',"");
		 					if(target.classList.contains('lyteDraggableElem')){
					    		target.classList.remove('lyteDraggableElem');
					    		this.removeFromArray(target);
					    	}
					    	else{
					    		target.classList.add('lyteDraggableElem');
					    		this.addToArray(target,'single');
					    	}

			 			}
			 			else if(keyValue == 16){
			 				//this.setData('keyValue',"");
		 					if(target.classList.contains('lyteDraggableElem')){
					    		target.classList.remove('lyteDraggableElem');
					    		this.addToArray(target,'multiple');
					    	}
					    	else{
					    		target.classList.add('lyteDraggableElem');
					    		this.addToArray(target,'multiple');
					    	}
			 			}
			 			else if(keyValue == 0){
		 					if(target.classList.contains('lyteDraggableElem')){
		 						if(this.getData('prevMode') == "multiple"){
		 							this.removeClass();
		 							this.setData('multiSelectedItems',[]);
						    		target.classList.add('lyteDraggableElem');
						    		this.getData('multiSelectedItems').push(target);
		 						}
		 						else{
		 							target.classList.remove('lyteDraggableElem');
					    			this.removeFromArray(target);
		 						}
		 						this.setData('prevMode','single');
					    	}
					    	else{
					    		this.removeClass();
					    		this.setData('multiSelectedItems',[]);
					    		target.classList.add('lyteDraggableElem');
					    		this.getData('multiSelectedItems').push(target);
					    		this.setData('prevMode','single');
					    	}
			 			}
			 			this.setData('offset',[
							event.clientX - targetOffset.left,
					        event.clientY - targetOffset.top
						]);
			 			this.setData('div',target);
						// console.log(this.getData('div'));
						var div = this.getData('div');
						var height = target.clientHeight;
						var width = target.clientWidth;
						// div.style.zIndex = 1001;
						div.style.left = (targetOffset.left - parentOffset.left) + 'px';
						div.style.top = (targetOffset.top - parentOffset.top) + 'px';
						// console.log('pointedItem left->',target.getBoundingClientRect().left)
						// console.log('pointedItem top->',target.getBoundingClientRect().top)
						div.style.boxSizing = "border-box";
						div.style.width = width +'px';
						div.style.height = height +'px';
						div.style.position = "absolute";
						div.classList.add('lyteDraggableElem');

						this.setData('placeholder',document.createElement('li'));
						var placeholder = this.getData('placeholder');
						placeholder.setAttribute("id","dummy");
						placeholder.style.width = width +'px';
						placeholder.style.height = height +'px';
						placeholder.style.boxSizing = "border-box";
						
						
						div.parentNode.insertBefore(placeholder, div);
			 		}
			 		this.setData('isDown',true);
				}
				 /*----Single drag and drop----*/
		 		 else{
		 			this.removeClass();
					//source = event.target;
					target.classList.add('lyteDraggableElem');
					this.setData('offset',[
						event.clientX - targetOffset.left,
				        event.clientY - targetOffset.top
					]);
					var isScrolled = false;
					
					this.setData('div',target);
					var div = this.getData('div');
					this.setData('isDown',true);//isDown = true;
					// div.style.zIndex = 1001;
					div.style.left = (targetOffset.left - parentOffset.left) + 'px';
					// var parentScrollTop = target.parentElement.scrollTop;
					// if(target.offsetTop > target.parentElement.offsetTop + target.parentElement.getBoundingClientRect().height){
					// 	div.style.top = (targetOffset.top - parentTop /*- parentScrollTop - height*/) + 'px';
					// 	// isScrolled = true;
					// }
					// else{
					div.style.top = (targetOffset.top - parentOffset.top) + 'px';
					// }
					// console.log('left->',target.getBoundingClientRect().left)
					// console.log('top->',target.getBoundingClientRect().top)
					div.style.boxSizing = "border-box";
					//debugger;
					div.style.width = width +'px';
					div.style.height = height +'px';
					div.style.position = "absolute";
					div.classList.add('lyteDraggableElem');

					this.setData('placeholder', document.createElement('li'));//placeholder = document.createElement('li');
					var placeholder = this.getData('placeholder');
					placeholder.setAttribute('id','dummy');
					
					placeholder.style.width = width +'px';
					placeholder.style.height = height +'px';
					placeholder.style.boxSizing = "border-box";
					
					
					div.parentNode.insertBefore(placeholder, div);
		 		}
		 		
				
		 		// this.selectFunction(event);
			}
			// console.log(this.getData('multiSelectedItems'));
		},

		mouseOver : function(event){
			// console.log(event.target);
			var target;
			var elem = event.target;
			if(elem.tagName.toLowerCase() == 'span'){
				target = event.target.parentElement;
				// console.log(target);
			}
			else{
				target = event.target;
			}
			if(target.classList.contains('lyteDraggableElem')){
				if(target.parentElement.id == "sortableSec"){
					if(target.querySelector('.lyteDragDropAdd')){
						target.querySelector('.lyteDragDropAdd').style.visibility = "hidden";
					}
				}
				if(target.parentElement.id == "dropSec"){
					if(target.querySelector('.lyteDragDropRemove')){
						target.querySelector('.lyteDragDropRemove').style.visibility = "hidden";
					}
				}
			}
			else{
				if(target.parentElement.id == "sortableSec"){
					if(target.querySelector('.lyteDragDropAdd')){
						target.querySelector('.lyteDragDropAdd').style.visibility = "visible";
					}
				}
				if(target.parentElement.id == "dropSec"){
					if(target.querySelector('.lyteDragDropRemove')){
						target.querySelector('.lyteDragDropRemove').style.visibility = "visible";
					}
				}
			}

		},

		mouseOut : function(event){
			var elem = event.target;
			if(elem.tagName.toLowerCase() == 'span'){
				target = event.target.parentElement;
				// console.log(target);
			}
			else{
				target = event.target;
			}
			if(target.parentElement.id == "sortableSec"){
				if(target.querySelector('.lyteDragDropAdd')){
					target.querySelector('.lyteDragDropAdd').style.visibility = "hidden";
				}
			}
			if(target.parentElement.id == "dropSec"){
				if(target.querySelector('.lyteDragDropRemove')){
					target.querySelector('.lyteDragDropRemove').style.visibility = "hidden";
				}
			}
		}	
	}


	
});

if (document.readyState === "complete" || document.readyState === "interactive"){
	addEvent();
}
else{
	document.addEventListener("DOMContentLoaded", function(event){
		addEvent(event);
	});
}

function addEvent(event){

var mousePosition;
var elemBelow;
var id;
var dropablePlace;
var prevTop = 0;
var component;
var side;
//console.log(component);
document.addEventListener('mouseup',function(event){
	var component;
	var target = event.target;
	while(target.parentElement){
		target = target.parentElement;
		if(target.tagName.toLowerCase() == 'lyte-dragdrop'){
			component=target.component;
			break;
		}
	}
	//component = component.component;
	if(component && component.getData('isDown')){
		component.setData('isDown',false);
		if(component.getData('isMoved')){
			component.setData('isMoved',false);
			var returnVal = component.onBeforeDropFunction(event);
			if(returnVal){
				if(component.getData('ltPropMultiselect') && component.getData('multiSelectedItems').length > 1 ){
					var placeholder = component.getData('placeholder');
					// console.log(placeholder);
					// console.log(placeholder.getBoundingClientRect().left)
					// console.log(placeholder.getBoundingClientRect().top)
					//debugger
					var placeholderOffset = placeholder.getBoundingClientRect();
					var multiSelectedItems = component.getData('multiSelectedItems');
					for(var v =0; v<multiSelectedItems.length ;v++){
						multiSelectedItems[v].style.visibility = "hidden";
					}
					var elem = document.elementFromPoint(placeholderOffset.left,placeholderOffset.top - 4);
					for(var v =0; v<multiSelectedItems.length ;v++){
						multiSelectedItems[v].style.visibility = "visible";
					}
					// console.log(elem);
					var parentListOfObjects = multiSelectedItems[0].parentElement.id == "sortableSec" ? "ltPropAvailablelist" : "ltPropSelectedlist";
					var parentListOfPlaceholder = placeholder.parentElement.id == "sortableSec" ? "ltPropAvailablelist" : "ltPropSelectedlist";
					var objects = [];
					for(var v = 0; v <multiSelectedItems.length ; v++){
						objects.push(component.getElement(multiSelectedItems[v]));
					}
					for(var i = 0 ; i < objects.length ; i++){
						Lyte.arrayUtils(component.getData(parentListOfObjects),'removeAt',component.getElementPosition(component.getData(parentListOfObjects),objects[i]),1);
					}
					var prevEle = placeholder.previousElementSibling;
					while(prevEle && prevEle.tagName == "TEMPLATE"){
						prevEle = prevEle.previousElementSibling;
					}
					if(prevEle){
						Lyte.arrayUtils(component.getData(parentListOfPlaceholder),'insertAt',component.getElementPosition(component.getData(parentListOfPlaceholder),component.getElement(prevEle))+1,objects);
					}
					else{
						var nextEle = placeholder.nextElementSibling;
						while(nextEle && nextEle.tagName == "TEMPLATE"){
							nextEle = nextEle.nextElementSibling;
						}
						if(nextEle){
							Lyte.arrayUtils(component.getData(parentListOfPlaceholder),'insertAt',component.getElementPosition(component.getData(parentListOfPlaceholder),component.getElement(nextEle)),objects);
						}
						else{
							Lyte.arrayUtils(component.getData(parentListOfPlaceholder),'push',objects);
						}
					}

					placeholder.parentElement.removeChild(placeholder);
					component.setData('multiSelectedItems',[]);
					component.setData('prevMode','');
					component.setData('keyPressed',false);
					component.setData('keyValue','');
					component.setData('placeholder','');
					component.generateArray();
					prevTop = 0;
				}
				else{
					var div = component.getData('div');
					var elemData = component.getElement(div);
					// component.getData('placeholder').parentElement.replaceChild(div,component.getData('placeholder'));
					var placeholder = component.getData('placeholder');
					var prevEle = placeholder.previousElementSibling;
					var parentListOfDiv = div.parentElement.id == 'sortableSec' ? "ltPropAvailablelist" : "ltPropSelectedlist";
					var parentListOfPlaceholder = placeholder.parentElement.id == 'sortableSec' ? "ltPropAvailablelist" : "ltPropSelectedlist";
					while(prevEle && prevEle.tagName == "TEMPLATE"){
						prevEle = prevEle.previousElementSibling;
					}
					if(prevEle){
						Lyte.arrayUtils(component.getData(parentListOfDiv),'removeAt',component.getElementPosition(component.getData(parentListOfDiv),elemData),1);
						Lyte.arrayUtils(component.getData(parentListOfPlaceholder),'insertAt',component.getElementPosition(component.getData(parentListOfPlaceholder),component.getElement(prevEle))+1,elemData);
					}
					else{
						var nextEle = placeholder.nextElementSibling;
						while(nextEle && (nextEle.tagName == "TEMPLATE" || nextEle.isEqualNode(div))){
							nextEle = nextEle.nextElementSibling;
						}
						if(nextEle){
							Lyte.arrayUtils(component.getData(parentListOfDiv),'removeAt',component.getElementPosition(component.getData(parentListOfDiv),elemData),1);
							Lyte.arrayUtils(component.getData(parentListOfPlaceholder),'insertAt',component.getElementPosition(component.getData(parentListOfPlaceholder),component.getElement(nextEle)),elemData);
						}
						else{
							Lyte.arrayUtils(component.getData(parentListOfDiv),'removeAt',component.getElementPosition(component.getData(parentListOfDiv),elemData),1);
							Lyte.arrayUtils(component.getData(parentListOfPlaceholder),'push',elemData);
						}
					}
					if(component.$node.querySelector('#sortableSec').contains(component.$node.querySelector('#dummy'))){
			    		component.$node.querySelector('#sortableSec').removeChild(component.$node.querySelector('#dummy'));
			    	}
			    	if( component.getData('ltPropDraggable') && component.$node.querySelector('#dropSec').contains(component.$node.querySelector('#dummy'))){
			    		component.$node.querySelector('#dropSec').removeChild(component.$node.querySelector('#dummy'));
			    	}
			    	// component.removeStyle(div);
			    	// div.classList.remove('lyteDraggableElem');
					component.removeDropable(div);
				    component.generateArray();
				}
				component.onDropFunction(event);
			}
			else{
				if(component.getData('ltPropMultiselect') && component.getData('multiSelectedItems').length > 1 ){
					var multiSelectedItems = component.getData('multiSelectedItems');
					for(var i = 0; i<multiSelectedItems.length;i++){
						component.removeStyle(multiSelectedItems[i]);
						multiSelectedItems[i].classList.remove('lyteDraggableElem');
					}
					component.removeDropableMultiple(multiSelectedItems);
					component.setData('multiSelectedItems',[]);
					component.setData('prevMode','');
					component.setData('keyPressed',false);
					component.setData('keyValue','');
					component.setData('placeholder','');
					prevTop = 0;
				}
				else{
					component.removeStyle(component.getData('div'));
			    	component.getData('div').classList.remove('lyteDraggableElem');
					component.removeDropable(component.getData('div'));
				}
				component.getData('placeholder').remove();
			}
		}
		else{
			var div = component.getData('div');
			component.getData('placeholder').parentElement.replaceChild(div,component.getData('placeholder'));
			if(component.$node.querySelector('#sortableSec').contains(component.$node.querySelector('#dummy'))){
	    		component.$node.querySelector('#sortableSec').removeChild(component.$node.querySelector('#dummy'));
	    	}
	    	if( component.getData('ltPropDraggable') && component.$node.querySelector('#dropSec').contains(component.$node.querySelector('#dummy'))){
	    		component.$node.querySelector('#dropSec').removeChild(component.$node.querySelector('#dummy'));
	    	}
			component.removeStyle(div);
			if(component.getData('checkSelection')){
				var keyValue = component.getData('keyValue');
				if(keyValue == 91 || keyValue == 93 || keyValue == 224){
					div.classList.remove('lyteDraggableElem');
					component.removeFromArray(div);
				}
				if(keyValue == 16){
					component.removeClass();
					component.setData('multiSelectedItems',[]);
					component.addToArray(div,"multiple");
					component.setData('prevMode','multiple');
				}
				if(keyValue == 0){
					component.removeClass();
					component.setData('multiSelectedItems',[]);
					component.getData('multiSelectedItems').push(div);
					// component.setData('multiSelectedItems',);
					div.classList.add('lyteDraggableElem');
					component.setData('prevMode','single');
				}
				component.setData('checkSelection',false);
			}
		}
	}
	else{
		var selectedElems = document.querySelectorAll('.lyteDraggableElem');
		if(selectedElems){
			for(var i = 0;i<selectedElems.length;i++){
				selectedElems[i].classList.remove('lyteDraggableElem');
			}
		}
	}
},false);

document.addEventListener('mousemove',function(event){
	//console.log("Here mouse move");
	var component;
	var target = event.target;
	while(target.parentElement){
		//console.log(target.parentElement);
		target = target.parentElement;
		if(target.tagName.toLowerCase() == 'lyte-dragdrop'){
			component=target.component;
			break;
		}
	}
	//component = component.component;
	if(component && component.getData('isDown')){
		component.setData('isMoved',true);
		// if(component.getData('ltPropDraggable')){
			var div = component.getData('div');
			var parentOffset = div.offsetParent.getBoundingClientRect();
			var divOffset = div.getBoundingClientRect();
			var width = divOffset.width;
			var height = divOffset.height;
			mousePosition = {
	            x : event.clientX,
	            y : event.clientY
	        };
	        div.style.left = (mousePosition.x - component.getData('offset')[0]) - parentOffset.left + 'px';
		    div.style.top  = (mousePosition.y - component.getData('offset')[1]) - parentOffset.top + 'px';
			if(component.getData('ltPropMultiselect') && component.getData('multiSelectedItems').length > 1){
			
				var multiSelectedItems = component.getData('multiSelectedItems');
				var index = multiSelectedItems.indexOf(div);
				
		        for(var v = index-1 ; v >= 0 ; v--){
		        	multiSelectedItems[v].style.left = div.offsetLeft + 'px' ;
		        	multiSelectedItems[v].style.top = (multiSelectedItems[v+1].offsetTop - height) + 'px';
		        	// multiSelectedItems[v].style.zIndex = 1001;
		        	multiSelectedItems[v].style.boxSizing = "border-box";
		        	multiSelectedItems[v].style.width = width + 'px';
		        	multiSelectedItems[v].style.height = height + 'px';
		        	multiSelectedItems[v].style.position = "absolute";
		        	multiSelectedItems[v].classList.add('lyteDraggableElem');
		        }
		        for(var v = index+1 ; v < multiSelectedItems.length ; v++){
		        	multiSelectedItems[v].style.left = div.offsetLeft + 'px';
		        	multiSelectedItems[v].style.top = (multiSelectedItems[v-1].offsetTop + height) + 'px';
		        	// multiSelectedItems[v].style.zIndex = 1001;
		        	multiSelectedItems[v].style.boxSizing = "border-box";
		        	multiSelectedItems[v].style.width = width + 'px';
		        	multiSelectedItems[v].style.height = height + 'px';
		        	multiSelectedItems[v].style.position = "absolute";
		        	multiSelectedItems[v].classList.add('lyteDraggableElem');
		        }

		        var placeholder = component.getData('placeholder');
		        var totalHeight = multiSelectedItems.length * height;
		        if(totalHeight > placeholder.getBoundingClientRect().height){
		        	if(document.getElementById('sortableSec').contains(document.getElementById('dummy'))){
			    		document.getElementById('sortableSec').removeChild(document.getElementById('dummy'));
			    	}
			    	if(component.getData('ltPropDraggable') && document.getElementById('dropSec').contains(document.getElementById('dummy'))){
			    		document.getElementById('dropSec').removeChild(document.getElementById('dummy'));
			    	}
			    	placeholder.style.height = totalHeight + 'px';
			    	placeholder.classList.add('lyteDragDropDropable');
			    	component.setData('placeholder',placeholder);
			    	div.parentElement.insertBefore(component.getData('placeholder'),div);
		        }
		        var top = component.getTopNBottom('top');
		        var bottom = component.getTopNBottom('bottom');
		        var placeholderOffset = placeholder.getBoundingClientRect();
		        var placeholderParentOffset = placeholder.parentElement.getBoundingClientRect();
		        divOffset = div.getBoundingClientRect();
		        
		        //for scrolling top or bottom
		        if(top < placeholderParentOffset.top){
		        	// console.log("scrolling up");
		        	if((placeholder.parentElement.scrollTop > 0) && (placeholder.parentElement.scrollTop <= (placeholder.parentElement.scrollHeight - placeholderParentOffset.height)) ){
		        		placeholder.parentElement.scrollTop -= placeholderParentOffset.top - top;
		        	}
		        }
		        if(bottom > placeholderParentOffset.bottom){
		        	// console.log("scrolling down");
		        	if(placeholder.parentElement.scrollTop <= placeholder.parentElement.scrollHeight - placeholderParentOffset.height ){
		        		placeholder.parentElement.scrollTop += bottom - placeholderParentOffset.bottom;
		        	}
		        }

		        component.makeDroppableMultiple(multiSelectedItems);

		        elementAtLeft = document.elementFromPoint(divOffset.left - 1, event.clientY);
		        elementAtRight = document.elementFromPoint(divOffset.right + 1, event.clientY);

		        // console.log("leftEle" , elementAtLeft);
		        // console.log("rightEle" , elementAtRight);
		        
		        dropablePlaceLeft = elementAtLeft.closest('.dropable');
		        dropablePlaceRight = elementAtRight.closest('.dropable');

		        if(!component.getData('left') && dropablePlaceLeft && (divOffset.left < (dropablePlaceLeft.getBoundingClientRect().right - divOffset.width / 2))){
					// console.log("inside left");
					
					if(divOffset.bottom > dropablePlaceLeft.getBoundingClientRect().bottom){
						
						dropablePlaceLeft.after(placeholder);
					}
					else{
						
						dropablePlaceLeft.parentElement.insertBefore(placeholder,dropablePlaceLeft);
					}
					component.setData('left',true);
					component.setData('right',false);
					side = "left";
				}
				else if(!component.getData('right') && dropablePlaceRight && (divOffset.right > (dropablePlaceRight.getBoundingClientRect().left + divOffset.width / 2))){
					// console.log("inside right");
					if(divOffset.bottom > dropablePlaceRight.getBoundingClientRect().bottom){
						
						dropablePlaceRight.after(placeholder);
					}
					else{
						
						dropablePlaceRight.parentElement.insertBefore(placeholder,dropablePlaceRight);
					}
					component.setData('right',true);
					component.setData('left',false);
					side = "right";
					
				}
				else if(elementAtLeft && component.checkElement(elementAtLeft) && component.checkPossiblePosition(elementAtLeft,"multiple") && (divOffset.left < (elementAtLeft.getBoundingClientRect().right - divOffset.width / 2))){
					
					elementAtLeft.appendChild(placeholder);
					component.setData('left',false);
					component.setData('right',false);
				}
				else if(elementAtRight && component.checkElement(elementAtRight) && component.checkPossiblePosition(elementAtRight,"multiple") && (divOffset.right > (elementAtRight.getBoundingClientRect().left + divOffset.width / 2))){
					
					elementAtRight.appendChild(placeholder);
					component.setData('left',false);
					component.setData('right',false);
				}
				else{
					// console.log("inside else");
					if(top < prevTop){
						// if(side){
							if(side == "left"){
								elemBelow = document.elementFromPoint(divOffset.left,top-1);
							}
							else if(side == "right"){
								elemBelow = document.elementFromPoint(divOffset.right,top-1);	
							}
							else{
								elemBelow = document.elementFromPoint(event.clientX,top-1);
							}
						// }
		        		if(!elemBelow){
		        			return;
		        		}
		        		dropablePlace = elemBelow.closest('.dropable');
		        		// console.log(dropablePlace);
		        		if(dropablePlace && (divOffset.left > (dropablePlace.parentElement.getBoundingClientRect().right - divOffset.width / 2) ||
							divOffset.right <(dropablePlace.parentElement.getBoundingClientRect().left + divOffset.width / 2))){
							// console.log("getting return");
							return
						}
						// console.log("top",dropablePlace);
		        		if(dropablePlace && dropablePlace != component.$node.querySelector('#dummy')){
		        			if(top < dropablePlace.getBoundingClientRect().bottom - 16){
		        				// console.log("going up");
		        	
						    	dropablePlace.parentElement.insertBefore(placeholder,dropablePlace);
		        			}
		        		}
		        		if((elemBelow.id === "sortableSec" || elemBelow.id === "dropSec") && component.checkIfDroppable(elemBelow,"multiple")){
		        			// console.log("top",elemBelow);
		        			elemBelow.appendChild(placeholder);
		        		}
			        }
		        	else{
		        		
							if(side == "left"){
								elemBelow = document.elementFromPoint(divOffset.left,bottom+1);
							}
							else if(side == "right"){
								elemBelow = document.elementFromPoint(divOffset.right,bottom+1);	
							}
							else{
								elemBelow = document.elementFromPoint(event.clientX,bottom+1);
							}
						
		        		if(!elemBelow){
		        			return;
		        		}
		        		
		        		dropablePlace = elemBelow.closest('.dropable');
		        		if(dropablePlace && (divOffset.left > (dropablePlace.parentElement.getBoundingClientRect().right - divOffset.width / 2) ||
							divOffset.right <(dropablePlace.parentElement.getBoundingClientRect().left + divOffset.width / 2))){
							// console.log("getting return");
							return
						}
						// console.log("down",dropablePlace);
		        		if(dropablePlace && dropablePlace != component.$node.querySelector('#dummy')){
		        			if(bottom >= dropablePlace.getBoundingClientRect().top + 16){
		        				// console.log('going down');
		        	
						    	dropablePlace.after(placeholder);
		        			}
		        		}
		        		if((elemBelow.id === "sortableSec" || elemBelow.id === "dropSec") && component.checkIfDroppable(elemBelow,"multiple")){
		        			// console.log("down",elemBelow);
		        			elemBelow.appendChild(placeholder);
		        		}
		        	}
				}
				// console.log("left ====>" + component.getData('placeholder').getBoundingClientRect().left);
		  //       console.log("top ====>" + component.getData('placeholder').getBoundingClientRect().top);
		        prevTop = top;
			}
			

			/*---Single drag and drop----*/
			else{
				// var div = component.getData('div');
				// mousePosition = {
		  //           x : event.clientX,
		  //           y : event.clientY
		  //       };
		        // var parent = div.offsetParent;
		        // div.style.left = (mousePosition.x - component.getData('offset')[0]) - parentOffset.left + 'px';
		        // div.style.top  = (mousePosition.y - component.getData('offset')[1]) - parentOffset.top + 'px';
		        //div.parentNode.insertBefore(component.getData('placeholder'), div);
		        var placeholder = component.getData('placeholder');
		        var placeholderParentOffset = placeholder.parentElement.getBoundingClientRect();
		        divOffset = div.getBoundingClientRect();
		        if(divOffset.top < placeholderParentOffset.top){
		        	if((placeholder.parentElement.scrollTop > 0) && (placeholder.parentElement.scrollTop <= (placeholder.parentElement.scrollHeight - placeholderParentOffset.height)) ){
		        		placeholder.parentElement.scrollTop -= placeholderParentOffset.top - divOffset.top;
		        	}
		        }
		        if(divOffset.bottom > placeholderParentOffset.bottom){
		        	if(placeholder.parentElement.scrollTop <= placeholder.parentElement.scrollHeight - placeholderParentOffset.height ){
		        		placeholder.parentElement.scrollTop += divOffset.bottom - placeholderParentOffset.bottom;
		        	}
		        }

		        component.makeDroppable(div);

		        elementAtLeft = document.elementFromPoint(divOffset.left - 1, event.clientY);
		        elementAtRight = document.elementFromPoint(divOffset.right + 1, event.clientY);

		        // console.log("leftEle" , elementAtLeft);
		        // console.log("rightEle" , elementAtRight);
		        droppableLeft = elementAtLeft.closest('.dropable');
		        droppableRight = elementAtRight.closest('.dropable');


		        maxAllowableWidth = divOffset.width / 2;

		        if(droppableLeft && (divOffset.left < (droppableLeft.getBoundingClientRect().right - maxAllowableWidth))){
		        	// console.log("inside left");
		        	if(divOffset.bottom > droppableLeft.getBoundingClientRect().bottom){
		        		droppableLeft.after(placeholder);
		        	}
		        	else{
		        		droppableLeft.parentElement.insertBefore(placeholder,droppableLeft);
		        	}
		        }
		        else if(droppableRight && (divOffset.right > (droppableRight.getBoundingClientRect().left + maxAllowableWidth))){
		        	// console.log("inside right");
		        	if(divOffset.bottom > droppableRight.getBoundingClientRect().bottom){
		        		droppableRight.after(placeholder);
		        	}
		        	else{
		        		droppableRight.parentElement.insertBefore(placeholder,droppableRight);
		        	}
		        }
		        else if(elementAtLeft && component.checkElement(elementAtLeft) && component.checkPossiblePosition(elementAtLeft,"single") && (divOffset.left < (elementAtLeft.getBoundingClientRect().right - maxAllowableWidth))){
		        	// console.log("inside parent left");
		        	elementAtLeft.appendChild(placeholder);
		        }
		        else if(elementAtRight && component.checkElement(elementAtRight) && component.checkPossiblePosition(elementAtRight,"single") && (divOffset.right > (elementAtRight.getBoundingClientRect().left + maxAllowableWidth))){
		        	// console.log("inside parent right");
		        	elementAtRight.appendChild(placeholder);
		        }
		        else{
		        	// console.log("inside here");
		        	div.style.visibility = "hidden";
		        	elemBelow = document.elementFromPoint(event.clientX,event.clientY);
		        	div.style.visibility = "visible";

		        	if(!elemBelow){
		        		return;
		        	}

		        	dropablePlace = elemBelow.closest('.dropable');
		        	if(dropablePlace && (divOffset.left > (dropablePlace.getBoundingClientRect().right - maxAllowableWidth) || divOffset.right < (dropablePlace.getBoundingClientRect().left + maxAllowableWidth))){
		        		return;
		        	}
		        	else{
		        		if(dropablePlace && dropablePlace != component.$node.querySelector('#dummy')){
		        			if(divOffset.top < dropablePlace.getBoundingClientRect().top){
		        				dropablePlace.parentElement.insertBefore(placeholder,dropablePlace);
		        			}
		        			if(divOffset.bottom > dropablePlace.getBoundingClientRect().bottom){
		        				dropablePlace.after(placeholder);
		        			}
		        		}
		        	}
		        	if((elemBelow.id === "sortableSec" || elemBelow.id === "dropSec") && component.checkIfDroppable(elemBelow,"single")){
	        			// console.log(elemBelow);
	        			elemBelow.appendChild(placeholder);
	        		}
		        }
				component.getData('placeholder').classList.add('lyteDragDropDropable');
			}
		component.onDragFunction(event);
	}


},false);

// document.addEventListener('dragstart',function(event){
// 	event.preventDefault();
// },false);


document.addEventListener('keydown',function(event){
	var component = document.querySelectorAll('lyte-dragdrop');
	for(var v = 0; v<component.length; v++){
		var elem = component[v].component;
		elem.setData('keyPressed',true);
		var keyValue = event.which;
		elem.setData('keyValue',keyValue);
		// console.log(keyValue);
	}
	
},false);

document.addEventListener('keyup',function(event){
	var component = document.querySelectorAll('lyte-dragdrop');
	for(var v = 0; v<component.length; v++){
		var elem = component[v].component;
		elem.setData('keyPressed',false);
		elem.setData('keyValue',0);
	}
	
},false);

};

