/*------------------------   NOTES   ------------------------*/
/*
  Date - 22/06/2018 - Documented
  1. Added scrollDivX property to check for horizontal scrolling.
  Date - 24/07/2018
  1. Added multiSelect option - to sort multiple items at a time.
  Date - 28/08/2018
  1. Added method to destroy sortable.
  Date - 13/09/2018
  1. Added omitRestricted - to exclude the restricted elements from list while calculating from and to index position.
*/
/*
	Issues with relative Horizontal scroll div - Fixed
*/


(function( window ) {

	if($L){	
		
		manageSortable = {
			keyPressed : false,
			keyValue : 0,
			countSortable : 0,
			init : false,
			isEqual : function (value, other) {
				if(value.length != other.length){
					return false;
				}
				for(var i = 0 ; i < value.length ; i++){
					if(other.indexOf(value[i]) == -1){
						return false;
					}
				}
				// If nothing failed, return true
				return true;
			},

			convertToArrayOfItems : function(selector){
				if(typeof selector != "string" && selector.length > 0){
					return selector;
				}
				var selectorArray = selector.split(',');
				var retArray = [];
				selectorArray.forEach(function(item,indexVal){
					var items = $L(item.trim()).e;
					if(items.length){
						for(var i=0;i < items.length ;i++){
							if(retArray.indexOf(items[i]) == -1){
								retArray.push(items[i]);
							}
						}
					}
					else{
						if(retArray.indexOf(items) == -1){
							retArray.push(items);
						}
					}
				});
				return retArray;
			},

			// keydown : function(event){
			// 	manageSortable.keyPressed = true;
			// 	manageSortable.keyValue = event.which;
			// 	// console.log(manageSortable.keyValue);
			// },

			// keyup : function(event){
			// 	manageSortable.keyPressed = false;
			// 	manageSortable.keyValue = 0;
			// },

			destroy : function(element){
				var childrens = Array.from(element.children).filter(function(node) { return node.tagName != 'TEMPLATE'});
				var sortableElemClass = element.getSortableClass();
				for(var i = 0; i<childrens.length; i++){
					childrens[i].classList.remove('sortable-element',sortableElemClass);
					if(childrens[i]._sortableData){
						childrens[i]._sortableData = null;
					}
				}
				element.classList.remove('sortable-parent');
				element._sortableData = null;
			},

			alreadySortable : function(elements){
				for(var i = 0; i<elements.length; i++){
					if($L(elements[i]).hasClass('sortable-parent') && elements[i]._sortableData){
						return {found : true, class : elements[i]._sortableData.sortableElemClass}
					}
				}
				return {found : undefined};
			}
		};

		// $L(document).bind('keydown',manageSortable.keydown);
		// $L(document).bind('keyup',manageSortable.keyup);
		
		$L.prototype.sortable = function(object) {
			if(!manageSortable.init){
				if (!Element.prototype.matches) {
				    Element.prototype.matches = 
				        Element.prototype.matchesSelector || 
				        Element.prototype.mozMatchesSelector ||
				        Element.prototype.msMatchesSelector || 
				        Element.prototype.oMatchesSelector || 
				        Element.prototype.webkitMatchesSelector ||
				        function(s) {
				            var matches = (this.document || this.ownerDocument).querySelectorAll(s),
				                i = matches.length - 1;
				            while (i >= 0 && matches.item(i) !== this){
				            	--i;
				            	//gets the index of the matched item
				            }
				            return i > -1;            
				        };
				}
				manageSortable.init = true;
			}
			if(typeof object === "string" && object === "destroy"){
				if(this.e.length){
					var elemArray = this.e;
					for(var i = 0; i<elemArray.length; i++){
						manageSortable.destroy(elemArray[i]);
					}
				}
				else{
					manageSortable.destroy(this.e);
				}
				return;
			}
			var data = object ? object : {};
			
			if(this.e.length){
				var elemArray = this.e;
				if(!data.changed){
					++manageSortable.countSortable;
					data.changed = true;
				}
				var check = manageSortable.alreadySortable(this.e);
				if(check.found){
					data.sortableElemClass = check.class;
				}
				for(var i = 0 ; i < elemArray.length ; i++){
					$L(elemArray[i]).sortable(Object.assign({},data));
				};
				return;
			}

			var element = this.e.length == undefined ? this.e : this.e[0];

			if(this.e._sortableData){
				var _sortableData = this.e._sortableData;
				data._parentElem = data._parentElem == undefined ? _sortableData._parentElem : data._parentElem;

				//Data overriding
				data.containment = data.containment ? data.containment : _sortableData.containment;
				data.connected = data.connectedWith ? manageSortable.isEqual(data.connectedWith, _sortableData.connectedWith) : _sortableData.connected;
				data.connectedWith = data.connectedWith ? data.connectedWith : _sortableData.connectedWith;
				data.orientation = data.orientation ? data.orientation : _sortableData.orientation;
				data.droppable = (data.droppable == undefined) ? _sortableData.droppable : data.droppable;
				data.draggable = (data.draggable == undefined) ? _sortableData.draggable : data.draggable;
				data.sortableElemClass = _sortableData.sortableElemClass;	
				data.placeholder = data.placeholder ? data.placeholder : _sortableData.placeholder;
				data.disabled = data.disabled ? data.disabled : _sortableData.disabled;
				data.onReady = data.onReady ? data.onReady : _sortableData.onReady;
				data.onSelect = data.onSelect ? data.onSelect : _sortableData.onSelect;
				data.onDragStart = data.onDragStart ? data.onDragStart : _sortableData.onDragStart;
				data.onDrag = data.onDrag ? data.onDrag : _sortableData.onDrag;
				data.onPlaceholder = data.onPlaceholder ? data.onPlaceholder : _sortableData.onPlaceholder;
				data.onBeforeDrop = data.onBeforeDrop ? data.onBeforeDrop : _sortableData.onBeforeDrop;
				data.onDrop = data.onDrop ? data.onDrop : _sortableData.onDrop;
				data.cancel = data.cancel == undefined ? _sortableData.cancel : data.cancel instanceof Array ? data.cancel : data.cancel.split(",") ;
				data.tolerance = data.tolerance ? data.tolerance : _sortableData.tolerance;
				data.items = data.items == undefined ? _sortableData.items : data.items instanceof Array ? data.items : data.items.split(",");
				data.cursorAt = data.cursorAt == undefined ? _sortableData.cursorAt : data.cursorAt;
				data.restrict = data.restrict == undefined ? _sortableData.restrict : data.restrict instanceof Array ? data.restrict : data.restrict.split(",");
				data.scrollDivX = data.scrollDivX == undefined ? _sortableData.scrollDivX : typeof data.scrollDivX === "string" ? document.querySelector(data.scrollDivX) : data.scrollDivX;
				data.multiSelect = data.multiSelect == undefined ? _sortableData.multiSelect : data.multiSelect === true ? true : false;
				data.omitRestricted = data.omitRestricted == undefined ? _sortableData.omitRestricted : data.omitRestricted;
				// data.scrollDivY = data.scrollDivY == undefined ? _sortableData.scrollDivY : typeof data.scrollDivY === "string" ? this.e.closest(data.scrollDivY) : data.scrollDivY;
				// data.parentScrollDivX = data.scrollDivX ? data.scrollDivX.parentElement : _sortableData.scrollDivX;

				if(data.executeOnReady){
					data._parentElem.executedOnReady = false;
				}
			}
			else{

				if(!data.connected && !data.changed){
					// console.log(data,++manageSortable.countSortable);
					++manageSortable.countSortable;
					data.changed = true;
				}
				//Parent Element
				data._parentElem = this.e;
				var element = this.e;
				$L(data._parentElem).addClass('sortable-parent');

				//Data initialization
				data.containment = data.containment;
				data.connectedWith = data.connectedWith ? data.connectedWith : [];
				data.orientation = data.orientation ? data.orientation : "vertical";
				data.droppable = (data.droppable == undefined) ? true : data.droppable;
				data.draggable = (data.draggable == undefined) ? true : data.draggable;
				data.sortableElemClass = data.sortableElemClass ? data.sortableElemClass : element.parentElement && element.parentElement._sortableData ? element.parentElement._sortableData.sortableElemClass : (data.orientation === "horizontal") ? "sortable-element-h"+manageSortable.countSortable : "sortable-element-v"+manageSortable.countSortable;
				data.placeholder = data.placeholder ? data.placeholder : "lyteSortablePlaceholder";
				data.disabled = data.disabled ? data.disabled : "lyteSortableDisabledPlaceholder";
				data.cancel = data.cancel == undefined ? [] : data.cancel instanceof Array ? data.cancel : data.cancel.split(",");
				data.tolerance = data.tolerance ? data.tolerance : "intersect";
				data.items = data.items == undefined ? [] : data.items instanceof Array ? data.items : data.items.split(",");
				data.cursorAt = data.cursorAt;
				data.restrict = data.restrict == undefined ? [] : data.restrict instanceof Array ? data.restrict : data.restrict.split(",");
				data.scrollDivX = data.scrollDivX ? ( typeof data.scrollDivX === "string" ? document.querySelector(data.scrollDivX) : data.scrollDivX) : undefined;
				data.multiSelect = data.multiSelect === true ? true : false;
				data.omitRestricted = data.omitRestricted == undefined ? false : data.omitRestricted;
				// data.scrollDivY = data.scrollDivY ? ( typeof data.scrollDivY === "string" ? element.closest(data.scrollDivY) : data.scrollDivY) : undefined;
				// data.parentScrollDivX = data.scrollDivX ? data.scrollDivX.parentElement : undefined;
			}


			var _offset = [0,0];
			var _isDown = false;
			var _isMoved = false;
			var _mousePosition;
			var _elemBelow;
			var _droppablePlace;
			var _marginTop = 0;
			var _marginLeft = 0;
			var _sortableElemClass;
			var _sortableElem;
			var _placeholder = "";
			var _div = "";
			var _returnElemBelow;
			var _scrollLeft = 0;
			var _scrollTop = 0;
			var _requestId1 = null;
			var _requestId2 = null;
			var _animationFrameFired1 = false;
			var _animationFrameFired2 = false;
			var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
                            window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
			var cancelAnimationFrame = window.cancelAnimationFrame || window.mozCancelAnimationFrame;
			var _maxScrollWidth = 0;
			var _maxScrollHeight = 0;
			var _multiSelectedItems = [];
			var _prevMode = null;
			var _checkSelection = false;
			var prevTop = null;
			var _fromIndex = null;
			var _source = null;
			var _prevScrollDiv = null;

			function mouseDownEvent(event){
				
		
				//Disable right click on the sortable elements to avoid unwanted behaviour
				if(event.which == 3){
					return;
				}
				
				var target = event.target;

				while(target){
					if($L(target).hasClass("sortable-element")){
						_sortableElem = target;
						break;
					}
					target = target.parentElement;
				}

				if(_sortableElem && checkForSortable(_sortableElem._sortableData || _sortableElem.parentElement._sortableData, event.target) && checkForItems(_sortableElem._sortableData || _sortableElem.parentElement._sortableData, event.target)){
					event.preventDefault();
					if(!$L(_sortableElem).hasClass(_sortableElem.parentElement._sortableData.sortableElemClass)){
						$L(_sortableElem).addClass(_sortableElem.parentElement._sortableData.sortableElemClass)
					}
					var data = _sortableElem._sortableData || _sortableElem.parentElement._sortableData;
					_placeholder = _sortableElem.cloneNode(true);
					_placeholder.classList.remove('sortable-element-selected');
					data._div = _div = _sortableElem;
					var returnVal = true;
					storeFromAndSource(data);
					if(data.multiSelect){
						_multiSelectedItems = _div.parentElement._multiSelectedItems ? _div.parentElement._multiSelectedItems : [];
						if(_multiSelectedItems.length > 0 && _multiSelectedItems.indexOf(_div) != -1 ){
							// console.log("here came");
							data._checkSelection = true;
							returnVal = true;
						}
						else{
							//Callback fired
							if(data.onSelect,event){
								returnVal = onSelect(data);
							}
							if(returnVal){
								// var keyValue = manageSortable.keyValue;
								if(event.metaKey || event.ctrlKey /*keyValue == 91 || keyValue == 93 || keyValue == 224*/){
									if(_div.classList.contains('sortable-element-selected')){
										_div.classList.remove('sortable-element-selected');
										removeFromArray(_div);
									}
									else{
										// console.log('here 1')
										addToArray(_div,'single',_div.parentElement);
									}
								}
								else if(event.shiftKey){
									if(_div.classList.contains('sortable-element-selected')){
										_div.classList.remove('sortable-element-selected');
									}
									// console.log('here 2')
									addToArray(_div,'multiple',_div.parentElement);
								}
								else{
									if(_div.classList.contains('sortable-element-selected')){
										if(_prevMode = 'multiple'){
											removeClass(_multiSelectedItems);
											_multiSelectedItems = [];
											_div.parentElement._multiSelectedItems = [];
											// _div.classList.add('sortable-element-selected');
											addToArray(_div,'single',_div.parentElement);
											// console.log('here 3')
										}
										else{
											_div.classList.remove('sortable-element-selected');
											removeFromArray(_div);
											// console.log('here 4');
										}
										_prevMode = 'single';
									}
									else{
										// console.log('here 5')
										removeClass(_multiSelectedItems);
										_multiSelectedItems = [];
										_div.parentElement._multiSelectedItems = [];
										// _div.classList.add('sortable-element-selected');
										addToArray(_div,'single',_div.parentElement);
										// console.log(_multiSelectedItems);
									}
								}

							}
						}
					}
					else{
						//Callback fired
						if(data.onSelect){
							returnVal = onSelect(data,event);
						}
						if(returnVal){
							$L(_div).addClass("sortable-element-selected");
						}
					}
					if(returnVal){
						var sortableElemCS = window.getComputedStyle(_sortableElem);
						var divOffset = _div.getBoundingClientRect();
						if(data.scrollDivX && window.getComputedStyle(data.scrollDivX).position == "relative"){
							data._isRelative = true; 
						}
						else{
							data._isRelative = false;
						}
						
						if(sortableElemCS.marginTop){
							_marginTop = sortableElemCS.marginTop;
						}
						if(sortableElemCS.marginLeft){
							_marginLeft = sortableElemCS.marginLeft;
						}
						if(event.type == "mousedown"){
							_offset = [
								event.clientX - divOffset.left,
								event.clientY - divOffset.top
							];
						}
						else if(event.type == "touchstart"){
							_offset = [
								event.touches[0].clientX - divOffset.left,
								event.touches[0].clientY - divOffset.top
							];
							
							//Binding eventlistener for touch
							$L(_sortableElem).bind('touchmove',data._parentElem.__mouseMoveEvent);
							$L(_sortableElem).bind('touchend',data._parentElem.__mouseUpEvent);
						}

						if(data.multiSelect && (!_div.parentElement._multiSelectedItems || _div.parentElement._multiSelectedItems.length == 0)){
							_div.parentElement._multiSelectedItems = [_div];

						}
						//Binding the values to the draggable element
						data._isDown = true;
						data._placeholder = _placeholder;
						data._offset = _offset;
						data._marginTop = _marginTop;
						data._marginLeft = _marginLeft;
						data._event = event;
						data._placedPlaceholder = false;

						if(!_sortableElem._sortableData){
							_sortableElem._sortableData = data;
						}
						_placeholder = null;
						_div = null;
						_sortableElem = null;
						// console.log(_multiSelectedItems);
					}
					//Binding mousedown and mouseup event
					document.addEventListener('mousemove',mouseMoveEvent);
					document.addEventListener('mouseup',mouseUpEvent);
					
				}
				else{
					_sortableElem = null;
				}
			}

			var mouseMoveEvent = function(event){
				if(event.type == "touchmove"){
					event.preventDefault();
				}
				if(_animationFrameFired1 && _requestId1){
					cancelAnimationFrame(_requestId1);
					_animationFrameFired1 = false;
					_requestId1 = null;
				}
				if(_animationFrameFired2 && _requestId2){
					cancelAnimationFrame(_requestId2);
					_animationFrameFired2 = false;
					_requestId2 = null;
				}
				var target = event.target;
				while(target){
					if($L(target).hasClass("sortable-element-selected")){
						_sortableElem = target;
						break;
					}
					target = target.parentElement;
				}
				
				if(_sortableElem){

					var data = _sortableElem._sortableData;
					if(data && data._isDown){
						event.preventDefault();
						if(typeof document.body.style.MozUserSelect!="undefined"){
							document.body.style.MozUserSelect = "none";
						}
						_div = data._div;
						_placeholder = data._placeholder;
						_offset = data._offset;
						_marginTop = data._marginTop;
						_marginLeft = data._marginLeft;
						_sortableElemClass = data.sortableElemClass;

						var divOffset = _sortableElem.getBoundingClientRect(); 
						if(data.multiSelect){
							_multiSelectedItems = _div.parentElement._multiSelectedItems;
						}
						if(data.scrollDivX){
							_scrollLeft = data.scrollDivX.scrollLeft;
						}
						else{
							_scrollLeft = 0;
						}
						if(!data._placedPlaceholder){
							//onDragStart
							if(data.onDragStart){
								onDragStart(data);
							}
							divOffset = _sortableElem.getBoundingClientRect(); 

							//set containment properties
							if(data.containment){
								data.containmentDimensions = setContainment(data,_sortableElem);
							}
							else{
								data.containmentDimensions = null;
							}

							// console.log("getting called");
							var width = divOffset.width;
							var height = divOffset.height;
							var cellSpacing = 0;
							var parent = _sortableElem.offsetParent;
							if(data.scrollDivX){
								_maxScrollWidth = data.scrollDivX.scrollWidth - data.scrollDivX.getBoundingClientRect().width;
							}
							else{
								_maxScrollWidth = 0;
							}
							data._maxScrollWidth = _maxScrollWidth;
							if(parent.tagName.toLowerCase() == "table"){
								cellSpacing = parent.cellSpacing;
								if(cellSpacing == ""){
									cellSpacing = 2;
								}
							}
							while((parent.tagName.toLowerCase() == "table" || parent.tagName.toLowerCase() == "lyte-table-structure") && parent.style.position == ""){
								parent = parent.offsetParent;
							}
							var relativeParent = getRelativeParent(_div);
							if(relativeParent && !(parent.isEqualNode(relativeParent))){
								parent = relativeParent;
							}
							var parentOffset = parent.getBoundingClientRect();
							_div.style.top = divOffset.top - (parentOffset.top + parseInt(cellSpacing) + parseInt(_marginTop)) + 'px';
							_div.style.left = (divOffset.left + _scrollLeft) - (parentOffset.left + parseInt(_marginLeft)) + 'px';
							_div.style.boxSizing = "border-box";
							_div.style.zIndex = 3001;
							$L(_div).width(width);
							$L(_div).height(height);
							
							if(_sortableElem.tagName.toLowerCase() == "tr" || _sortableElem.tagName.toLowerCase() == "lyte-tr"){
								fixWidth(_sortableElem);
							}
							
							//Create placeholder and append it to the DOM
							$L(_placeholder).html("");
							$L(_placeholder).attr('id','dummy');
							$L(_placeholder).removeClass('sortableElem');
							$L(_placeholder).width(divOffset.width /*calculateWidth(_sortableElem)*/);
							if(data.multiSelect){
								$L(_placeholder).height(divOffset.height * _multiSelectedItems.length /*calculateHeight(_sortableElem)*/);
								for(var i = 0; i<_multiSelectedItems.length; i++){
									_multiSelectedItems[i].classList.add('lyteSortableElem');
								}
							}
							else{
								$L(_placeholder).height(divOffset.height /*calculateHeight(_sortableElem)*/);
								_div.classList.add('lyteSortableElem');
							}
							
							_placeholder.style.padding = "0px";

							//Insert the placeholder in the DOM and make the selected element's position absolute
							// _div.parentElement.insertBefore(_placeholder,_div);
							LyteComponent.insertBefore(_div,_placeholder)
							_div.style.position = "absolute";
							data._placedPlaceholder = true;
							// if(window.getComputedStyle(_placeholder).display == "inline"){
							// 	_placeholder.style.display = "inherit";
							// }
							data._div = _div;
							data._placeholder = _placeholder;
							data._prevTop = event.clientY;

						}

						//Find scroll div
						var scrollDiv;
						// if(data.scrollDivY){
						// 	scrollDiv = data.scrollDivY;
						// }
						// else{
							scrollDiv = findScrollDiv(_placeholder);
						// }
						if(scrollDiv && (!_prevScrollDiv || (_prevScrollDiv && !_prevScrollDiv.isEqualNode(scrollDiv)))){
							_maxScrollHeight = scrollDiv.scrollHeight - scrollDiv.offsetHeight;
							_prevScrollDiv = scrollDiv;
						}
						

						//Find scrollDiv is relative or contains any relative parent
						var isRelativeY = false;
						if(scrollDiv && window.getComputedStyle(scrollDiv).position == "relative"){
							isRelativeY = true;
							_scrollTop = scrollDiv.scrollTop;
						}
						else{
							_scrollTop = 0;
						}

						if(event.type == "mousemove"){
							_mousePosition = {
								x : event.clientX,
								y : event.clientY
							};
						}
						else if(event.type == "touchmove"){
							_mousePosition = {
								x : event.touches[0].clientX,
								y : event.touches[0].clientY
							};
						}
						
						if(data.multiSelect & _multiSelectedItems.length > 1){
							var width = divOffset.width;
							var height = divOffset.height;
							var parent = _div.offsetParent;
							var relativeParent = getRelativeParent(_div);
							if(relativeParent && !(parent.isEqualNode(relativeParent))){
								parent = relativeParent;
							}
							var parentOffset = parent.getBoundingClientRect();
							var placeholderOffset = _placeholder.getBoundingClientRect();
							var leftVal;
							var topVal;
							var scrollLeftValue = 0;
							if(data._isRelative){
								scrollLeftValue = _scrollLeft;
							}
							_div.style.left = _mousePosition.x - _offset[0] - parentOffset.left - parseInt(_marginLeft) + scrollLeftValue + "px";
							_div.style.top = _mousePosition.y - _offset[1] - parentOffset.top - parseInt(_marginTop) + _scrollTop + "px";
							var index = _multiSelectedItems.indexOf(_div);
							for(var i = index - 1; i >= 0; i--){
								_multiSelectedItems[i].style.left = _div.offsetLeft + "px";
								_multiSelectedItems[i].style.top = _multiSelectedItems[i+1].offsetTop - divOffset.height + "px";
								_multiSelectedItems[i].style.boxSizing = "border-box";
								_multiSelectedItems[i].style.zIndex = 3001;
								_multiSelectedItems[i].style.height = height + "px";
								_multiSelectedItems[i].style.width = width + "px";
								_multiSelectedItems[i].style.position = "absolute";
							}
							for(var i = index + 1; i < _multiSelectedItems.length; i++){
								_multiSelectedItems[i].style.left = _div.offsetLeft + "px";
								_multiSelectedItems[i].style.top = _multiSelectedItems[i-1].offsetTop + divOffset.height + "px";
								_multiSelectedItems[i].style.boxSizing = "border-box";
								_multiSelectedItems[i].style.zIndex = 3001;
								_multiSelectedItems[i].style.height = height + "px";
								_multiSelectedItems[i].style.width = width + "px";
								_multiSelectedItems[i].style.position = "absolute";
							}

							var topNBottom = getTopNBottom();
							divOffset = _div.getBoundingClientRect();
							var scrollDivOffset = scrollDiv ? scrollDiv.getBoundingClientRect() : 0;
							if(scrollDiv && (divOffset.left <= scrollDivOffset.right) && (divOffset.right >= scrollDivOffset.left)){
								_requestId1 = requestAnimationFrame(callForScrollY.bind(this,data,scrollDiv,scrollDivOffset,_maxScrollHeight,topNBottom,isRelativeY,_mousePosition,_offset,parentOffset));
								_animationFrameFired1 = true;
							}

							//Find the below element over which the sortable element is being dragged
							// _div.style.display = "none";
							var prevDisplay = [];
							for(var i = 0; i<_multiSelectedItems.length; i++){
								prevDisplay.push(_multiSelectedItems[i].style.display ? _multiSelectedItems[i].style.display : "");
								_multiSelectedItems[i].style.display = "none";
							}
							_elemBelow = document.elementFromPoint(_mousePosition.x,_mousePosition.y);
							for(var i = 0; i<_multiSelectedItems.length; i++){
								_multiSelectedItems[i].style.display = prevDisplay[i];
							}

							if(!_elemBelow){
								return;
							}

							//Find the closest sortable element to sort with
							droppablePlace = _elemBelow.closest('.'+_sortableElemClass);

							if(droppablePlace && checkDroppable(droppablePlace,_sortableElem.parentElement,_sortableElem,data.connectedWith,data.containmentDimensions,_mousePosition)){
								// console.log("inside 1");
								if($L(_elemBelow).hasClass('sortable-parent') && checkParentDroppable(_elemBelow,_sortableElem.parentElement,_sortableElem,data.connectedWith,data.containmentDimensions,_mousePosition) && checkForIntersect(_elemBelow,_mousePosition) && checkForBetween(_elemBelow,_mousePosition,_sortableElem,isRelativeY,scrollDiv)){
									// $L(_elemBelow).append(_placeholder);
									// console.log("inside 2");
									LyteComponent.appendChild(_elemBelow,_placeholder);
								}
								else{
									if((topNBottom.bottom - topNBottom.top) >= droppablePlace.offsetHeight){
										// console.log("inside 3");
										LyteComponent.insertBefore(droppablePlace,_placeholder);
									}
									else{
										if(data.tolerance == "pointer"){
											if(event.clientY < data._prevTop){
												LyteComponent.insertBefore(droppablePlace,_placeholder);
											}
											else{
												LyteComponent.insertAfter(droppablePlace,_placeholder);
											}
											data._prevTop = event.clientY;
										}
										if(data.tolerance == "intersect"){
											scrollDivOffset = droppablePlace.getBoundingClientRect();
											if(topNBottom.top < (scrollDivOffset.top)){
												// $L(droppablePlace).insertBefore(_placeholder);
												// console.log("inside 4");
												LyteComponent.insertBefore(droppablePlace,_placeholder);
											}
											else if(topNBottom.bottom > (scrollDivOffset.bottom)){
												// $L(droppablePlace).insertAfter(_placeholder);
												// console.log("inside 5");
												LyteComponent.insertAfter(droppablePlace,_placeholder);
											}
										}
									}
								}
							}
							else{
								if(prevTop && prevTop > topNBottom.top){
									_elemBelow = document.elementFromPoint(_mousePosition.x,topNBottom.top - 1);
									if(!_elemBelow){
										return;
									}
									droppablePlace = _elemBelow.closest('.'+_sortableElemClass);
									if(droppablePlace && droppablePlace.id != 'dummy' && topNBottom.top < (droppablePlace.getBoundingClientRect().top + (droppablePlace.getBoundingClientRect().height/2))){
										// console.log("inside 6");
										LyteComponent.insertBefore(droppablePlace,_placeholder);
									}
									else if(_elemBelow && $L(_elemBelow).hasClass('sortable-parent') && checkParentDroppable(_elemBelow,_sortableElem.parentElement,_sortableElem,data.connectedWith,data.containmentDimensions,_mousePosition) && checkForIntersect(_elemBelow,_mousePosition) && checkForBetween(_elemBelow,_mousePosition,_sortableElem,isRelativeY,scrollDiv)){
										// $L(_elemBelow).append(_placeholder);
										// console.log("inside 7");
										LyteComponent.appendChild(_elemBelow,_placeholder);
									}
								}
								else{
									_elemBelow = document.elementFromPoint(_mousePosition.x,topNBottom.bottom + 1);
									if(!_elemBelow){
										return;
									}
									droppablePlace = _elemBelow.closest('.'+_sortableElemClass);
									if(droppablePlace && droppablePlace.id != 'dummy' && topNBottom.bottom > (droppablePlace.getBoundingClientRect().bottom - (droppablePlace.getBoundingClientRect().height/2))){
										// console.log("inside 8");
										LyteComponent.insertAfter(droppablePlace,_placeholder);
									}
									else if(_elemBelow && $L(_elemBelow).hasClass('sortable-parent') && checkParentDroppable(_elemBelow,_sortableElem.parentElement,_sortableElem,data.connectedWith,data.containmentDimensions,_mousePosition) && checkForIntersect(_elemBelow,_mousePosition) && checkForBetween(_elemBelow,_mousePosition,_sortableElem,isRelativeY,scrollDiv)){
										// $L(_elemBelow).append(_placeholder);
										// console.log("inside 9");
										LyteComponent.appendChild(_elemBelow,_placeholder);
									}
								}
							}
							if(!data.onPlaceholder || checkValidDroppable(data,_elemBelow)){
								if($L(_placeholder).hasClass(data.disabled)){
									$L(_placeholder).removeClass(data.disabled);
								}
								$L(_placeholder).addClass(data.placeholder);
							}
							else{
								if($L(_placeholder).hasClass(data.placeholder)){
									$L(_placeholder).removeClass(data.placeholder);
								}
								$L(_placeholder).addClass(data.disabled);
							}
							prevTop = topNBottom.top;


						}
						else{
							var parent = _div.offsetParent;
							var relativeParent = getRelativeParent(_div);
							if(relativeParent && !(parent.isEqualNode(relativeParent))){
								parent = relativeParent;
							}
							var parentOffset = parent.getBoundingClientRect();
							var leftVal;
							var topVal;
							var scrollLeftValue = 0;
							if(data._isRelative){
								scrollLeftValue = _scrollLeft;
							}
							if(data.cursorAt){
								leftVal = _mousePosition.x - data.cursorAt.left - parentOffset.left - parseInt(_marginLeft) + scrollLeftValue;
								topVal = _mousePosition.y - data.cursorAt.top - parentOffset.top - parseInt(_marginTop) + _scrollTop;

								if(data.containment){
									if(leftVal >= data.containmentDimensions.offsetLeft && leftVal <= (data.containmentDimensions.offsetLeft + (data.containmentDimensions.width - divOffset.width))){
										_div.style.left = leftVal + 'px';
									}
									if(topVal >= data.containmentDimensions.offsetTop && topVal <= (data.containmentDimensions.offsetTop + (data.containmentDimensions.height - divOffset.height) + _scrollTop)){
										_div.style.top = topVal + 'px';
									}
								}
								else{
									_div.style.left = leftVal + 'px';
									_div.style.top = topVal + 'px';
								}
							}
							else{
								leftVal = _mousePosition.x - _offset[0] - parentOffset.left - parseInt(_marginLeft) + scrollLeftValue;
								topVal = _mousePosition.y - _offset[1] - parentOffset.top - parseInt(_marginTop) + _scrollTop;
								// console.log("left",leftVal);
								// console.log("top",topVal);
								// console.log("bottom",(data.containmentDimensions.offsetTop + (data.containmentDimensions.height - divOffset.height) + _scrollTop))
								if(data.containment){
									if(leftVal >= data.containmentDimensions.offsetLeft && leftVal <= (data.containmentDimensions.offsetLeft + (data.containmentDimensions.width - divOffset.width))){
										_div.style.left = leftVal + 'px';
									}
									if(topVal >= data.containmentDimensions.offsetTop && topVal <= (data.containmentDimensions.offsetTop + (data.containmentDimensions.height - divOffset.height) + _scrollTop)){
										// console.log("calculating");
										_div.style.top = topVal + 'px';
									}
								// 	if(topVal > (data.containmentDimensions.offsetTop + (data.containmentDimensions.height - divOffset.height) + _scrollTop)){
								// 		debugger
								// 	}
								}
								else{
									_div.style.left = leftVal + 'px';
									_div.style.top = topVal + 'px';
								}
							}

							divOffset = _div.getBoundingClientRect();
							var scrollDivOffset = scrollDiv ? scrollDiv.getBoundingClientRect() : 0;

							//Animation Frame fired for vertical scrolling
							if(scrollDiv && (divOffset.left <= scrollDivOffset.right) && (divOffset.right >= scrollDivOffset.left)){
								_requestId1 = requestAnimationFrame(callForScrollY.bind(this,data,scrollDiv,scrollDivOffset,_maxScrollHeight,null,isRelativeY,_mousePosition,_offset,parentOffset));
								_animationFrameFired1 = true;
							}

							//Animation Frame fired for horizontal scrolling
							if(data.scrollDivX){
								scrollDivOffset = data.scrollDivX.getBoundingClientRect();
								if(divOffset.left <= scrollDivOffset.left || divOffset.right >= scrollDivOffset.right){
									_requestId2 = requestAnimationFrame(callForScrollX.bind(this,data,scrollDivOffset,_mousePosition,_offset,parentOffset,data._isRelative));
									_animationFrameFired2 = true; 
								}
							}
							
							//Find the below element over which the sortable element is being dragged
							var prevDisplay = _div.style.display ? _div.style.display : "";
							_div.style.display = "none";
							_elemBelow = document.elementFromPoint(_mousePosition.x,_mousePosition.y);
							_div.style.display = prevDisplay;
							

							if(!_elemBelow){
								return;
							}

							//Find the closest sortable element to sort with
							droppablePlace = _elemBelow.closest('.'+_sortableElemClass);

							if(droppablePlace && checkDroppable(droppablePlace,_sortableElem.parentElement,_sortableElem,data.connectedWith,data.containmentDimensions,_mousePosition)){
								
								if($L(_elemBelow).hasClass('sortable-parent') && checkParentDroppable(_elemBelow,_sortableElem.parentElement,_sortableElem,data.connectedWith,data.containmentDimensions,_mousePosition) && checkForIntersect(_elemBelow,_mousePosition) && checkForBetween(_elemBelow,_mousePosition,_sortableElem/*,isRelativeY,scrollDiv*/)){
									// $L(_elemBelow).append(_placeholder);
									LyteComponent.appendChild(_elemBelow,_placeholder);
								}
								else{
									if(data.tolerance == "pointer"){
										if(event.clientY < data._prevTop){
											LyteComponent.insertBefore(droppablePlace,_placeholder);
										}
										else{
											LyteComponent.insertAfter(droppablePlace,_placeholder);
										}
										data._prevTop = event.clientY;
									}
									if(data.tolerance == "intersect"){
										scrollDivOffset = droppablePlace.getBoundingClientRect();
										if(divOffset.top < (scrollDivOffset.top)){
											// $L(droppablePlace).insertBefore(_placeholder);
											LyteComponent.insertBefore(droppablePlace,_placeholder);
										}
										else if(divOffset.bottom > (scrollDivOffset.bottom)){
											// $L(droppablePlace).insertAfter(_placeholder);
											LyteComponent.insertAfter(droppablePlace,_placeholder);
										}
									}
								}
							}
							else if(_elemBelow && $L(_elemBelow).hasClass('sortable-parent') && checkParentDroppable(_elemBelow,_sortableElem.parentElement,_sortableElem,data.connectedWith,data.containmentDimensions,_mousePosition) && checkForIntersect(_elemBelow,_mousePosition) && checkForBetween(_elemBelow,_mousePosition,_sortableElem,isRelativeY,scrollDiv)){
								// $L(_elemBelow).append(_placeholder);
								LyteComponent.appendChild(_elemBelow,_placeholder);
							}
							// else{
							// 	console.log("checkParentDroppable",checkParentDroppable(_elemBelow,data._parentElem,_sortableElem,data.connectedWith));
							// 	console.log("checkForIntersect",checkForIntersect(_elemBelow,_mousePosition));
							// 	console.log("came here",_elemBelow);
							// }
							if(!data.onPlaceholder || checkValidDroppable(data,_elemBelow)){
								if($L(_placeholder).hasClass(data.disabled)){
									$L(_placeholder).removeClass(data.disabled);
								}
								$L(_placeholder).addClass(data.placeholder);
							}
							else{
								if($L(_placeholder).hasClass(data.placeholder)){
									$L(_placeholder).removeClass(data.placeholder);
								}
								$L(_placeholder).addClass(data.disabled);
							}
						}
						

						//Callback fired
						if(data.onDrag){
							onDrag(data,droppablePlace,_elemBelow,event);
						}

						data._isMoved = true;
						droppablePlace = null;
						_elemBelow = null;
					}
				}
			}

			var mouseUpEvent = function(event){
				var target = event.target;
				if(_animationFrameFired1 && _requestId1){
					cancelAnimationFrame(_requestId1);
					_animationFrameFired1 = false;
					_requestId1 = null;
				}
				if(_animationFrameFired2 && _requestId2){
					cancelAnimationFrame(_requestId2);
					_animationFrameFired2 = false;
					_requestId2 = null;
				}

				while(target){
					if($L(target).hasClass("sortable-element-selected")){
						_sortableElem = target;
						break;
					}
					target = target.parentElement;
				}
				if(_sortableElem){
					var data = _sortableElem._sortableData;
					var prevParent = _sortableElem.parentElement;
					//UnBinding mousedown and mouseup event
					document.removeEventListener('mousemove',mouseMoveEvent);
					document.removeEventListener('mouseup',mouseUpEvent);
					if(data.multiSelect){
						_multiSelectedItems = prevParent._multiSelectedItems;
					}
					// debugger
					if(data._isDown){
						data._isDown = false;
						_div = data._div;
						_placeholder = data._placeholder;
						if(data._isMoved){
							data._isMoved = false;
							var returnVal = true;

							if(data.multiSelect){
								//Callback fired
								if(data.onBeforeDrop){
									returnVal = onBeforeDrop(data,event);
								}
								removeClass(_multiSelectedItems);
								if($L(_placeholder).hasClass(data.disabled)){
									callRevertBack(data,"multiple");
									return;
								}

								if(!returnVal){
									callRevertBack(data,"multiple");
									return;
								}
								var sibling = (findPreviousElem(_placeholder) ? findPreviousElem(_placeholder) : findNextElem(_placeholder));
								var elementData = sibling && sibling._sortableData ? sibling._sortableData : _placeholder.parentElement._sortableData;
								// $L(_placeholder).replace(_div);
								
								var previousElementSibling = findPreviousElem(_placeholder);
								if(previousElementSibling){
									_placeholder.remove();
									for(var v=0; v<_multiSelectedItems.length; v++){
										removeStyle(_multiSelectedItems[v]);
										LyteComponent.insertAfter(previousElementSibling,_multiSelectedItems[v]);
										_multiSelectedItems[v]._sortableData = elementData;
										previousElementSibling = findNextElem(previousElementSibling);
									}
								}
								else{
									var nextElementSibling = findNextElem(_placeholder);
									if(nextElementSibling){
										_placeholder.remove();
										for(var v=_multiSelectedItems.length-1; v>=0; v--){
											removeStyle(_multiSelectedItems[v]);
											LyteComponent.insertBefore(nextElementSibling,_multiSelectedItems[v]);
											_multiSelectedItems[v]._sortableData = elementData;
											nextElementSibling = findPreviousElem(nextElementSibling);
										}
									}
									else{
										var parent = _placeholder.parentElement;
										_placeholder.remove();
										for(var v=0; v < _multiSelectedItems.length; v++){
											removeStyle(_multiSelectedItems[v]);
											LyteComponent.appendChild(parent,_multiSelectedItems[v]);
											_multiSelectedItems[v]._sortableData = elementData;
										}
									}
								}
								
								_multiSelectedItems = [];
								_placeholder = null;
								_prevMode = null;
								_checkSelection = false;
								prevParent._multiSelectedItems = [];

								//Callback fired
								if(data.onDrop){
									onDrop(data,event);
								}
							}
							else{
								//Callback fired
								if(data.onBeforeDrop){
									returnVal = onBeforeDrop(data,event);
								}

								if($L(_placeholder).hasClass(data.disabled)){
									callRevertBack(data);
									return;
								}

								if(!returnVal){
									callRevertBack(data);
									return;
								}
								
								var sibling = (findPreviousElem(_placeholder) ? findPreviousElem(_placeholder) : findNextElem(_placeholder));
								var elementData = sibling && sibling._sortableData ? sibling._sortableData : _placeholder.parentElement._sortableData;
								// $L(_placeholder).replace(_div);
								LyteComponent.replaceWith(_placeholder, _div);
								removeStyle(_div);

								_placeholder = null;

								_div._sortableData = elementData;

								//Callback fired
								if(data.onDrop){
									onDrop(data,event);
								}
								// if(!elementData.draggable){
								// 	$L(_div).unbind("mousedown",mouseDownEvent);
								// }
							}
						}
						else{
							if(data._checkSelection){
								// var keyValue = manageSortable.keyValue;
								if(event.metaKey || event.ctrlKey /*keyValue == 91 || keyValue == 93 || keyValue == 224*/){
									_div.classList.remove('sortable-element-selected');
									removeFromArray(_div);
								}
								else if(event.shiftKey /*keyValue == 16*/){
									removeClass(_multiSelectedItems);
									_multiSelectedItems = [];
									_div.parentElement._multiSelectedItems = [];
									addToArray(_div,"multiple",_div.parentElement);
								}
								else{
									removeClass(_multiSelectedItems);
									_multiSelectedItems = [];
									_div.parentElement._multiSelectedItems = [];
									addToArray(_div,'single',_div.parentElement);
								}
								data._checkSelection = false;
							}
							else if(!data.multiSelect){
								removeStyle(_div);
								if(_sortableElem.tagName.toLowerCase() == 'a'){
									window.location.href = _sortableElem.href;
								}
							}
						}
						data._div = null;
						data._placeholder = null;
						data._placedPlaceholder = false;

						//Unbinding the eventlisteners for touch
						if(event.type == "touchend"){
							$L(_sortableElem).unbind('touchmove',data._parentElem.__mouseMoveEvent);
							$L(_sortableElem).unbind('touchend',data._parentElem.__mouseUpEvent);
						}
					}
					else if(_multiSelectedItems.length > 0){
						removeClass(_multiSelectedItems);
						_multiSelectedItems = [];
						prevParent._multiSelectedItems = [];
					}
					if(!data.multiSelect){
						$L(_sortableElem).removeClass('sortable-element-selected');
					}
					_fromIndex = null;
					_source = null;
					_offset = null;
					_isDown = null;
					_isMoved = null;
					_mousePosition = null;
					_elemBelow = null;
					_droppablePlace = null;
					_marginTop = null;
					_marginLeft = null;
					_sortableElemClass = null;
					_sortableElem = null;
					_placeholder = null;
					_div = null;

					
				}
			}

			element.addToSortable = function(elem){
				elem._sortableData = element._sortableData;
				$L(elem).addClass("sortable-element",element._sortableData.sortableElemClass);
				// $L(elem).bind("mousedown",mouseDownEvent);
			};

			element.getSortableClass = function(){
				return element._sortableData.sortableElemClass;
			};

			var callForScrollX = function(data,parentOffset,_mousePosition,_offset,parent,isRelative){
				// console.log("Scroll X getting called");
				var divOffset = data._div.getBoundingClientRect();
				_scrollLeft = data.scrollDivX.scrollLeft;
				_maxScrollWidth = data._maxScrollWidth;
				if((divOffset.right >= parentOffset.right) && (_scrollLeft < _maxScrollWidth)){
					if((_maxScrollWidth - _scrollLeft) >= 5){
						data.scrollDivX.scrollLeft += 5;
						if(isRelative){
							data._div.style.left = _mousePosition.x - _offset[0] - parent.left + 5 + _scrollLeft + "px";
						}
					}
					else{
						data.scrollDivX.scrollLeft += (5 - (_maxScrollWidth - _scrollLeft));
						if(isRelative){
							data._div.style.left = _mousePosition.x - _offset[0] - parent.left + (5 - (_maxScrollWidth - _scrollLeft)) + _scrollLeft + "px";
						}
					}
				}
				else if((divOffset.left <= parentOffset.left) && (_scrollLeft > 0)){
					if(isRelative){
						data._div.style.left = _mousePosition.x - _offset[0] - parent.left - ((_maxScrollWidth - _scrollLeft) > 5 ? 5 : (5 - (_maxScrollWidth - _scrollLeft))) + _scrollLeft + "px";
					}
					data.scrollDivX.scrollLeft -= 5;
				}
				else{
					cancelAnimationFrame(_requestId2);
					_animationFrameFired2 = false;
					_requestId2 = null;
					return;
				}
				_requestId2 = requestAnimationFrame(callForScrollX.bind(this,data,parentOffset,_mousePosition,_offset,parent,isRelative)); 
			};

			var callForScrollY = function(data,scrollDiv,parentOffset,_maxScrollHeight,topNBottom,isRelativeY,_mousePosition,_offset,parent){
				// var scrollDiv = arguments[1];
				// var parentOffset = arguments[2];
				var divOffset = data._div.getBoundingClientRect();
				var diff = data._placeholder.parentElement.offsetTop - scrollDiv.offsetTop + 5;
				// var _maxScrollHeight = arguments[3];
				// var topNBottom = arguments[4];
				// var isRelativeY = arguments[5];
				var scrollTop = scrollDiv.scrollTop;
				if(data.multiSelect && topNBottom){
					if((topNBottom.top - parseInt(data._marginTop) <= parentOffset.top + diff) && (scrollTop > 0)){
						scrollDiv.scrollTop -= 10;
					}
					else if((topNBottom.bottom >= parentOffset.bottom) && (scrollTop < (scrollDiv.scrollHeight - parentOffset.height))){
						scrollDiv.scrollTop += 10;
					}
					else{
						cancelAnimationFrame(_requestId1);
						_animationFrameFired1 = false;
						_requestId1 = null;
						return;
					}
					_requestId1 = requestAnimationFrame(callForScrollY.bind(this,data,scrollDiv,parentOffset,_maxScrollHeight,topNBottom,isRelativeY,_mousePosition,_offset,parent));
				}
				else{
					if((divOffset.top - parseInt(data._marginTop) <= parentOffset.top + diff) && (scrollTop > 0)){
						if(isRelativeY){
							data._div.style.top = _mousePosition.y - _offset[1] - parent.top - (_maxScrollHeight - scrollTop >= 10 ? 10 : _maxScrollHeight - scrollTop) + scrollTop + "px";
						}
						scrollDiv.scrollTop -= 10;
					}
					else if((divOffset.bottom >= (parentOffset.bottom - 3)) && (scrollTop < _maxScrollHeight)){
						if(_maxScrollHeight - scrollTop > 10){
							if(isRelativeY){
								data._div.style.top = _mousePosition.y - _offset[1] - parent.top + 10 + scrollTop + "px";
							}
							scrollDiv.scrollTop += 10;
						}
						else{
							if(isRelativeY){
								data._div.style.top = _mousePosition.y - _offset[1] - parent.top + _maxScrollHeight - scrollTop + scrollTop + "px";
							}
							scrollDiv.scrollTop += (_maxScrollHeight - scrollTop);
						}
					}
					else{
						cancelAnimationFrame(_requestId1);
						_animationFrameFired1 = false;
						_requestId1 = null;
						return;
					}
					_requestId1 = requestAnimationFrame(callForScrollY.bind(this,data,scrollDiv,parentOffset,_maxScrollHeight,topNBottom,isRelativeY,_mousePosition,_offset,parent));
				}
				
			};


			var isNotRestricted = function(data,targetElem){
				for(var i = 0; i<data.restrict.length ; i++){
					// var elements = document.querySelectorAll(data.restrict[i]);
					// for(var j = 0; j<elements.length; j++){
					// 	if(elements[j].isEqualNode(targetElem)){
					// 		return false;
					// 	}
					// }
					if(targetElem.matches(data.restrict[i])){
						return false;
					}
				}
				return true;
			};

			var checkForSortable = function(data,targetElem){
				for(var i = 0; i<data.cancel.length ; i++){
					// var elements = document.querySelectorAll(data.cancel[i]);
					// for(var j = 0; j<elements.length ; j++){
					// 	if(elements[j].isEqualNode(targetElem)){
					// 		return false;
					// 	}
					// }
					var elem = targetElem;
					while(elem.parentElement){
						if(elem.matches(data.cancel[i])){
							return false;
						}
						if($L(elem).hasClass('sortable-element')){
							break;
						}
						elem = elem.parentElement;
					}
				}
				return true;
			};

			var checkDroppedItemPosition = function(data, ele,siblings){
				if(data.omitRestricted){
					for(var y = 0; y<siblings.length; y++){
                        if(!isNotRestricted(data,siblings[y])){
                            siblings.splice(y,1);
                            --y;
                        }
                    }
				}
				for(var i = 0; i<siblings.length; i++){
					if(siblings[i].tagName != "TEMPLATE" && ele.isEqualNode(siblings[i])){
						return i;
					}
				}
			};

			var storeFromAndSource = function(data){
				_source = data._parentElem;
				if(data.omitRestricted){
					var siblings = Array.from(data._parentElem.children).filter( function(ele) { return ele.tagName != "TEMPLATE" } );
					for(var y = 0; y<siblings.length; y++){
                        if(!isNotRestricted(data,siblings[y])){
                            siblings.splice(y,1);
                            --y;
                        }
                    }
                    _fromIndex = siblings.indexOf(data._div);
				}
				else{
					_fromIndex = Array.from(data._parentElem.children).filter( function(ele) { return ele.tagName != "TEMPLATE" } ).indexOf(data._div);
				}
			}

			/*---------------Callbacks Start--------------*/
			var onReady = function(data){
				data.onReady(data._parentElem);
			}

			var onSelect = function(data,event){
				var returnVal = data.onSelect(data._div, _fromIndex, data._parentElem,event);
				return ( returnVal == undefined) ? true : returnVal;
			}

			var onDragStart = function(data){
				data.onDragStart(data._div,data._parentElem);
			}

			var onDrag = function(data,droppableElem,elemBelow,event){

				_returnElemBelow = droppableElem || elemBelow;
				data.onDrag(data._div,_returnElemBelow,event);
			}

			var onBeforeDrop = function(data,event){

				var returnVal = data.onBeforeDrop(data._div,_returnElemBelow,data._placeholder,_fromIndex, checkDroppedItemPosition(data, data._placeholder,Array.from(data._placeholder.parentElement.children).filter(function(ele){ return ele.tagName != "TEMPLATE" && !($L(ele).hasClass('sortable-element-selected')) })), _source, data._placeholder ? data._placeholder.parentElement : null,event);
				return (returnVal == undefined) ? true : returnVal;
			}

			var onDrop = function(data,event){
				data.onDrop(data._div, data._div._sortableData._parentElem, _returnElemBelow, _fromIndex, checkDroppedItemPosition(data, data._div,Array.from(data._div._sortableData._parentElem.children).filter(function(ele){ return ele.tagName != "TEMPLATE" })), _source, event);
			}
			/*---------------Callbacks End--------------*/

			var checkValidDroppable = function(data,destination){
				if(destination.id && destination.id == "dummy"){
					destination = destination.parentElement;
				}
				else{
					while(destination){
						if($L(destination).hasClass('sortable-parent')){
							break;
						}
						destination = destination.parentElement;
					}
				}
				var returnVal = data.onPlaceholder(data._div,data._placeholder, data._parentElem, data._placeholder ? data._placeholder.parentElement : null);
				return (returnVal == undefined) ? true : returnVal;
			}


			//Bind events to the child elements that will be sortable
			var childrens = data._parentElem.children;
			data._parentElem.__mouseMoveEvent = mouseMoveEvent;
			data._parentElem.__mouseUpEvent = mouseUpEvent;
			data._parentElem._sortableData = data;
			for(var i = 0 ; i < childrens.length ; i++){
				if(childrens[i].tagName != "TEMPLATE" && isNotRestricted(data,childrens[i])){
					childrens[i]._sortableData = data;
					$L(childrens[i]).addClass("sortable-element",data.sortableElemClass);
				}
			}
			if(data.draggable){
				data._parentElem.addEventListener("mousedown",mouseDownEvent);
				$L(data._parentElem).bind("touchstart",mouseDownEvent);
			}
			else{
				if(data._parentElem._mousedown){
					data._parentElem.removeEventListener("mousedown",mouseDownEvent);
					$L(data._parentElem).unbind("touchstart",mouseDownEvent);
				}
			}
			

			
			
			//Check whether the arrays are connected or not and has connectedWith
			if(!data.connected && data.connectedWith.length > 0){
				data.connectedWith = manageSortable.convertToArrayOfItems(data.connectedWith);
				data.connectedWith.forEach(function(id){
					var connectedWith = data.connectedWith.concat();
					index = connectedWith.indexOf(id);
					connectedWith.splice(index,1);
					connectedWith.push(data._parentElem);
					$L(id).sortable({
						_parentElem : $L(id).e,
						connectedWith : connectedWith,
						connected : true,
						droppable : data.droppable,
						draggable : data.draggable,
						placeholder : data.placeholder,
						disabled : data.disabled,
						orientation : data.orientation,
						cancel : data.cancel,
						items : data.items,
						cursorAt : data.cursorAt,
						restrict : data.restrict,
						scrollDivX : data.scrollDivX,
						multiSelect : data.multiSelect,
						omitRestricted : data.omitRestricted
					});
				});
				
			}

			if(data.onReady && !data._parentElem.executedOnReady){
				onReady(data);
				data._parentElem.executedOnReady = true;
			}

			var setContainment = function(data,sortableElem){
				if(data.containment == "parent"){
					var dimensions = sortableElem.parentElement.getBoundingClientRect();
					return ({left : dimensions.left,
							right : dimensions.right,
							top : dimensions.top,
							bottom : dimensions.bottom,
							height : dimensions.height,
							width : dimensions.width,
							offsetLeft : sortableElem.parentElement.offsetLeft,
							offsetTop : sortableElem.parentElement.offsetTop});
				}
				else{
					var containment = $L(data.containment).e.length == undefined ? $L(data.containment).e : $L(data.containment).e[0];
					var dimensions = containment.getBoundingClientRect();
					return ({left : dimensions.left,
							right : dimensions.right,
							top : dimensions.top,
							bottom : dimensions.bottom,
							height : dimensions.height,
							width : dimensions.width,
							offsetLeft : containment.offsetLeft,
							offsetTop : containment.offsetTop});
				}
			};

			/*----------------------- UTILITY FUNCTIONS FOR SORTABLE ---------------------*/

			/*----------------------- UTILITY FUNCTIONS FOR MULTISELECT SORTABLE - START ---------------------*/
			//Removes some items from the array
			var removeFromArray = function(item){
				var _multiSelectedItems = item.parentElement._multiSelectedItems;
				if(_multiSelectedItems.length > 0){
					var index = _multiSelectedItems.indexOf(item);
					_multiSelectedItems.splice(index,1);
				}
				item.parentElement._multiSelectedItems = _multiSelectedItems;
			};


			//Adds the selected items to an array for multiselected drag and drop
			var addToArray = function(item,mode,parent){
				var _multiSelectedItems = parent._multiSelectedItems ? parent._multiSelectedItems : [];
				if(mode === "single"){
					if(_multiSelectedItems.length > 0){
						var lastItem = _multiSelectedItems[_multiSelectedItems.length - 1];
						if(lastItem.parentElement != parent){
							removeClass(_multiSelectedItems);
							_multiSelectedItems = [];
							lastItem.parentElement._multiSelectedItems = _multiSelectedItems;
							addToArray(item,mode,parent);
						}
						else{
							item.classList.add('sortable-element-selected');
							positionalPush(item);
						}
					}
					else{
						_multiSelectedItems.push(item);
						item.classList.add('sortable-element-selected');
					}
					_prevMode = mode;
				}
				if(mode == "multiple"){
					if(_prevMode == "multiple" || _prevMode == null){
						if(_multiSelectedItems.length > 0){
							var lastItem = _multiSelectedItems[_multiSelectedItems.length-1];
							if(lastItem.parentElement != parent){
								removeClass(_multiSelectedItems);
								_multiSelectedItems = [];
								lastItem.parentElement._multiSelectedItems = _multiSelectedItems;
								_prevMode = 'multiple';
								addToArray(item,mode,parent);
							}
							else{
								var childrens = Array.from(parent.children).filter(function(ele){ return ele.tagName != 'TEMPLATE'});
								var lastItemIndex = childrens.indexOf(lastItem);
								var index = childrens.indexOf(item);
								var index = childrens.indexOf(item);
								if(index > lastItemIndex){
									for(var v = lastItemIndex+1 ; v <= index; v++){
										_multiSelectedItems.push(childrens[v]);
										childrens[v].classList.add('sortable-element-selected');
									}
								}
								else{
									removeClass(_multiSelectedItems);
									_multiSelectedItems = [];
									for(var v = index; v<= lastItemIndex; v++){
										_multiSelectedItems.push(childrens[v]);
										childrens[v].classList.add('sortable-element-selected');
									}
								}
							}
						}
						else{
							var childrens = Array.from(parent.children).filter(function(ele) { return ele.tagName != 'TEMPLATE'});
							var index = childrens.indexOf(item);
							
							for(var v = 0;v <= index; v++){
								_multiSelectedItems.push(childrens[v]);
								childrens[v].classList.add('sortable-element-selected');
							}
						}
					}
					if(_prevMode == "single"){
						var lastItem;
						if(_multiSelectedItems.length > 0 && _multiSelectedItems[_multiSelectedItems.length - 1].parentElement == parent){
							lastItem = _multiSelectedItems[_multiSelectedItems.length - 1];
							var childrens = Array.from(parent.children).filter(function(ele){ return ele.tagName != 'TEMPLATE'});
							var lastItemIndex = childrens.indexOf(lastItem);
							var index = childrens.indexOf(item);
							if(index > lastItemIndex){
								for(var v = lastItemIndex+1 ; v <= index; v++){
									_multiSelectedItems.push(childrens[v]);
									childrens[v].classList.add('sortable-element-selected');
								}
							}
							else{
								removeClass(_multiSelectedItems);
								_multiSelectedItems = [];
								for(var v = index; v<= lastItemIndex; v++){
									_multiSelectedItems.push(childrens[v]);
									childrens[v].classList.add('sortable-element-selected');
								}
							}
						}
						else{
							removeClass(_multiSelectedItems);
							_multiSelectedItems = [];
							if(lastItem){
								lastItem.parentElement._multiSelectedItems = _multiSelectedItems;
							}
							_prevMode = 'multiple';
							addToArray(item,mode,parent);
						}
					}
					_prevMode = mode;
				}
				checkForUnwanted(_multiSelectedItems);
				parent._multiSelectedItems = _multiSelectedItems;
			};

			var checkForUnwanted = function(items){
				var newItems = Array.from(document.querySelectorAll('.sortable-element-selected'));
				if(newItems.length != items.length){
					for(var i = 0; i<newItems.length; i++){
						if(items.indexOf(newItems[i]) == -1){
							newItems[i].classList.remove('sortable-element-selected');
							newItems[i].parentElement._multiSelectedItems = [];
						}
					}
				}
			};

			var removeClass = function(arrayItems){
				for(var i = 0; i<arrayItems.length; i++){
					arrayItems[i].classList.remove('sortable-element-selected');
				}
			};

			var positionalPush = function(item){
				var pos = 0;
				for(var v = 0 ; v < _multiSelectedItems.length ; v++){
					if(_multiSelectedItems[v].offsetTop > item.offsetTop){
						break;
					}
					else{
						++pos;
					}
				}
				_multiSelectedItems.splice(pos,0,item);
			};

			//Gets the top and bottom for multiSelected items
			var getTopNBottom = function(prop){
				return {top :_multiSelectedItems[0].getBoundingClientRect().top,
						bottom :_multiSelectedItems[_multiSelectedItems.length - 1].getBoundingClientRect().bottom};
			};

			var findPlaceholderPosition = function(placeholder){
				var childrens = Array.from(placeholder.parentElement.children).filter(function(ele){ return ele.tagName != 'TEMPLATE'});
				return childrens.indexOf(placeholder);
			}
			/*----------------------- UTILITY FUNCTIONS FOR MULTISELECT SORTABLE - END ---------------------*/

			var findScrollDiv = function(elem){
				var parent = elem.parentElement;
				while(elem.parentElement){
					elem = elem.parentElement;
					if((parent.scrollHeight > elem.clientHeight) && ((window.getComputedStyle(elem).overflow != "hidden" && window.getComputedStyle(elem).overflow != "visible") || elem.matches('.lyteScrollBar')) /*!(elem.style.overflow && elem.style.overflow == 'hidden')*/){
						return elem;
					}
				}
				return null;
			};

			var fixWidth = function(element){
				var childrens = element.children;
				for(var i = 0; i<childrens.length; i++){
					if(childrens[i].tagName.toLowerCase() == "td" || childrens[i].tagName.toLowerCase() == "lyte-td"){
						if(childrens[i].style.width){
							childrens[i].style.width = childrens[i].style.width;
						}
						else{
							$L(childrens[i]).width($L(childrens[i]).width());
						}
					}
				}
			};

			var calculateHeight = function(element) {
				var cs = getComputedStyle(element);

				var paddingY = parseFloat(cs.paddingTop) + parseFloat(cs.paddingBottom);

				var borderY = parseFloat(cs.borderTopWidth) + parseFloat(cs.borderBottomWidth);

				// Element height minus padding and border
				elementHeight = element.offsetHeight - paddingY - borderY;
				return elementHeight;
			};

			var calculateWidth = function(element) {
				var cs = getComputedStyle(element);

				var paddingX = parseFloat(cs.paddingLeft) + parseFloat(cs.paddingRight);

				var borderX = parseFloat(cs.borderLeftWidth) + parseFloat(cs.borderRightWidth);

				// Element width minus padding and border
				elementWidth = element.offsetWidth - paddingX - borderX;
				return elementWidth;
			};

			var getRelativeParent = function(element){
				while(element.parentElement){
					element = element.parentElement;
					var cs = getComputedStyle(element);
					if(cs.position == "relative"){
						return element;
					}
				}
				return null;
			};

			//Checks whether the element can be dropped or not
			var checkDroppable = function(element,parentElem,sortableElem,connectedWith,containmentDimensions,mP){
				if(element.id != "dummy"){
					var sortableParentId = sortableElem.parentElement.id;
					var droppableParentId = element.parentElement.id;
					if(containmentDimensions){
						if(mP.x < containmentDimensions.left || mP.x > containmentDimensions.right || mP.y < containmentDimensions.top || mP.y > containmentDimensions.bottom){
							return false;
						}
					}
					if(sortableElem.parentElement.isEqualNode(element.parentElement) || element.parentElement.isEqualNode(sortableElem._sortableData._parentElem)){
						return true;
					}
					if(((connectedWith).indexOf(element.parentElement) != -1) && element._sortableData.droppable){
						return true;
					}
				}
				return false;
			};

			//Checks whwther the element can be dropped or not 
			var checkParentDroppable = function(element,parentElem,sortableElem,connectedWith,containmentDimensions,mP){
				var sortableParentId = sortableElem.parentElement.id;
				if(containmentDimensions){
					if(mP.x < containmentDimensions.left || mP.x > containmentDimensions.right || mP.y < containmentDimensions.top || mP.y > containmentDimensions.bottom){
						return false;
					}
				} 
				if(sortableElem.parentElement.isEqualNode(element) || element.isEqualNode(parentElem)){
					return true;
				}
				if(((connectedWith).indexOf(element) != -1) && checkDroppableValue(element)){
					return true;
				}
				return false;
			};

			var checkDroppableValue = function(element){
				var childrens = element.children;
				var childElem;
				for(var v= 0; v<childrens.length; v++){
					if(childrens[v] != element.querySelector("#dummy") && childrens[v].tagName != "TEMPLATE" && $L(childrens[v]).hasClass('sortable-element')){
						childElem = childrens[v];
						break;
					}
				}
				return (childElem && childElem._sortableData ? childElem._sortableData.droppable : element._sortableData.droppable);
			};

			//Checks for appending the sortable elements at the end of the div
			var checkPossiblePosition = function(element,sortableElem){
				if(element.childElementCount > 0){
					var lastChild = element.lastElementChild;
					if(sortableElem.getBoundingClientRect().top > lastChild.getBoundingClientRect().bottom){
						return true
					}
				}
				else{
					return true;
				}
				return false;
			};

			var checkIfDroppable = function(parentElem,ele){
				if(ele.parentElement === parentElem && parentElem.childElementCount === 1 && (((ele.getBoundingClientRect().right > (parentElem.getBoundingClientRect().left + ele.getBoundingClientRect().width / 2)) && 
					(ele.getBoundingClientRect().right <= parentElem.getBoundingClientRect().right)) || ((ele.getBoundingClientRect().left < (parentElem.getBoundingClientRect().right - ele.getBoundingClientRect().width / 2)) && 
					(ele.getBoundingClientRect().left >= parentElem.getBoundingClientRect().left)))){
					return true;
				}
				return false;
			};

			var checkForIntersect = function(parentElem,mP){
				var cs = window.getComputedStyle(parentElem);
				var offset = parentElem.getBoundingClientRect();
				// console.log("cs",cs);
				// console.log("offset",offset);
				// console.log("_mousePosition",mP.x,mP.y);
				if(mP.x > (offset.left + parseFloat(cs.paddingLeft || 0)) && mP.x < (offset.right - parseFloat(cs.paddingRight || 0)) && mP.y > (offset.top + parseFloat(cs.paddingTop || 0)) && mP.y < (offset.bottom - parseFloat(cs.paddingBottom || 0))){
					return true;
				}
				return false; 
			};

			var checkForBetween = function(parentElem,mP,div,isRelativeY,scrollDiv){
				var childrens = parentElem.children;
				var templateTags = 0;
				var childElem = [];
				for(var i = 0;i<childrens.length;i++){
					if(childrens[i].tagName != "TEMPLATE" && childrens[i].id != "dummy" && isNotRestricted(parentElem._sortableData,childrens[i])){
						childElem.push(childrens[i]);
					}
					else{
						templateTags++;
					}
				}
				if(templateTags == childrens.length){
					return true;
				}
				else if((childElem.length == 1 && childElem[childElem.length - 1].isEqualNode(div)) || (childElem.length > 1 && childElem[childElem.length - 1].isEqualNode(div) && div.getBoundingClientRect().top > (childElem[childElem.length - 2].getBoundingClientRect().bottom + (isRelativeY ? scrollDiv.scrollTop : 0)))){
					return true;
				}
				else if(div.getBoundingClientRect().top > (childElem[childElem.length - 1].getBoundingClientRect().bottom + (isRelativeY ? scrollDiv.scrollTop : 0))){
					return true;
				}
				return false;
			};

			var callRevertBack = function(data) {
				$L(data._div).removeClass("sortable-element-selected");
				removeStyle(data._div);
				data._placeholder.remove();
			};

			var removeStyle = function(element){
				element.style.position = '';
				element.style.top = '';
				element.style.left = '';
				element.style.width = '';
				element.style.height = '';
				// element.style.display = '';
				element.style.zIndex = '';
				element.style.boxSizing = '';
				$L(element).removeClass('lyteSortableElem');
			};

			var findPreviousElem = function(elem){
				while(elem.previousElementSibling){
					elem = elem.previousElementSibling;
					if(elem.tagName != "TEMPLATE" && $L(elem).hasClass('sortable-element')){
						return elem;
					}
				}
				return null;
			};

			var findNextElem = function(elem){
				while(elem.nextElementSibling){
					elem = elem.nextElementSibling;
					if(elem.tagName != "TEMPLATE" && $L(elem).hasClass('sortable-element')){
						return elem;
					}
				}
				return null;
			};

			var checkForItems = function(data,targetElem){
				if(data.items.length > 0){
					for(var i = 0 ; i<data.items.length ; i++){
						var elements = document.querySelectorAll(data.items[i]);
						for(var j = 0; j<elements.length; j++){
							if(elements[j].isEqualNode(targetElem)){
								return true;
							}
						}
					}
				}
				else{
					return true;
				}
				return false;
			};

		}
		
	}

})( window );
