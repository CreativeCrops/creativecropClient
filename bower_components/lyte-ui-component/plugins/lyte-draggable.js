/*
	Optimized by reading the values first and then writting
	Added - 27/07/2014 - documentation not done yet
		1. Added draggable + sortable compatibility - Drag any draggable element to sort it with a list of sortable elements and sort it with them
		2. Added helper options - can be string or any function
		3. Added connectToSortable options
		4. Added onBeforeStop callback - return false to exit
	Date - 28/08/2018
  	1. Added method to destroy draggable.

*/

(function( window ) {

	if($L){	
		manageDraggable = {
			init : false,
			isRestricted : function(restrict,element){
				restrict = restrict instanceof Array ? restrict : restrict.split(",");
				for(var i = 0; i<restrict.length; i++){
					var elements = document.querySelectorAll(restrict[i]);
					for(var j = 0; j < elements.length; j++){
						if(element.isEqualNode(elements[i])){
							return true;
						}
					}
				}
				return false;
			},

			destroy : function(element){
				if(element._draggableData){
					element._draggableData = null;
				}
				element.classList.remove('draggable-element');
			}

		};
		
		$L.prototype.draggable = function(object) {

			if(!manageDraggable.init){
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
				manageDraggable.init = true;
			}

			if(typeof object === "string" && object === "destroy"){
				if(this.e.length){
					var elemArray = this.e;
					for(var i = 0; i<elemArray.length; i++){
						manageDraggable.destroy(elemArray[i]);
					}
				}
				else{
					manageDraggable.destroy(this.e);
				}
				return;
			}

			var data = object ? object : {};

			if(this.e.length){
				var elemArray = this.e;
				for(var i = 0; i<elemArray.length; i++){
					$L(elemArray[i]).draggable(Object.assign({},data));
				}
				return;
			}
			//Parent Element
			if(data.restrict && manageDraggable.isRestricted(data.restrict,this.e)){
				return;
			}
			data._element = this.e;
			$L(data._element).addClass('draggable-element');

			var _handleElement;
			var _initialPos = {};
			var _offset = [0,0];
			var _marginTop = 0;
			var _marginLeft = 0;
			var _mousePosition;
			var _placeholder;
			var _sortableElemClass;
			var _positionedPlceholder = false;
			var _requestId1;
			var _animationFrameFired1;
			var _elemBelow;
			var droppablePlace;
			var returnVal;
			var _mousePosition;
			var prevDimension = null;
			//Data initialization
			data.placeholder = data.placeholder ? data.placeholder : "lyteDraggablePlaceholder";
			data.containment = (data.containment === undefined) ? document : $L(data.containment).e;
			data.orientation = (data.orientation === undefined) ? "default" : data.orientation;
			data.handle = (data.handle === undefined) ? this.e : data.handle;
			data.restrict = data.restrict === undefined ? [] : data.restrict instanceof Array ? data.restrict : data.restrict.split(",");
			data.helper = data.helper ? data.helper : "original";
			data.connectToSortable = data.connectToSortable ? data.connectToSortable : null;
			data.cursorAt = data.cursorAt;
			data.disabled = data.disabled ? data.disabled : "lyteDraggableDisabledPlaceholder";
			

			

			function mouseDownEvent(event){
				// event.preventDefault();
				// console.log("calling mousedown from draggable");
				//Disable right click on the sortable elements to avoid unwanted behaviour
				if(event.which == 3){
					return;
				}
				var _handleElement = event.target.closest('.draggable-handle-element');
				if(_handleElement){
					var data = _handleElement._draggableData;
					var elem = data._element;
					var elemOffset = elem.getBoundingClientRect();
					var cs = window.getComputedStyle(elem);
					var width = elemOffset.width;
					var height = elemOffset.height;
					data._offParent = elem.offsetParent;
					data._parent = elem.parentElement;

					//Callback fired
					if(data.onStart){
						onStart(data);
					}

					_initialPos = {
						x : elem.offsetLeft,
						y : elem.offsetTop,
						pos : $L(elem).css('position')
					};
					if(event.type == "mousedown"){
						_offset = [
							event.clientX - elemOffset.left,
							event.clientY - elemOffset.top
						];
					}
					else if(event.type == "touchstart"){
						_offset = [
							event.touches[0].clientX - elemOffset.left,
							event.touches[0].clientY - elemOffset.top
						];

						//Binding touch events
						// $L(elem).bind("touchmove",data.__mousemove);
						// $L(elem).bind("touchend",data.__mouseup);
						elem.addEventListener('touchmove',data.__mousemove);
						elem.addEventListener('touchend',data.__mouseup);
					}
					
					if(cs.marginTop){
						_marginTop = cs.marginTop;
					}
					if(cs.marginLeft){
						_marginLeft = cs.marginLeft;
					}
					// var parent = elem.offsetParent;

					data._isDown = true;
					data._initialPos = _initialPos;
					data._offset = _offset;
					data._marginLeft = _marginLeft;
					data._marginTop = _marginTop;
					$L(_handleElement).addClass('selected-element');
					
					//Set the current element for manager to manage draggables and droppables
					if(typeof managerDD !== "undefined"){
						managerDD._current = data._element;
					}

					// $L(data.containment).bind("mousemove",mouseMoveEvent);
					// $L(data.containment).bind("mouseup",mouseUpEvent);
					document.addEventListener('mousemove',mouseMoveEvent);
					document.addEventListener('mouseup',mouseUpEvent);
				}
				// console.log(event.target, "selected");
			}

			var mouseMoveEvent = function(event){
				// console.log("calling mousemove from draggable");
				var target = event.target;
				while(target){
					if($L(target).hasClass("selected-element")){
						_handleElement = target;
						break;
					}
					target = target.parentElement;
				}
				if(_handleElement){
					// console.log(event.target, "moving");
					var data = _handleElement._draggableData;
					if(data && data._isDown){
						event.preventDefault();
						var elem = data._element;
						_offset = data._offset;
						_marginLeft = data._marginLeft;
						_marginTop = data._marginTop;
						orientation = data.orientation;
						var parent = data._offParent;
						var elemOffset = elem.getBoundingClientRect();
						var parentOffset = parent.getBoundingClientRect();

						if(!data._isMoved){
							var cs = window.getComputedStyle(elem);
				            var borderDimensionY = ((cs.borderTop ? parseFloat(cs.borderTop) : 0) +
				                                     (cs.borderBottom ? parseFloat(cs.borderBottom) : 0));
				            var borderDimensionX = ((cs.borderLeft ? parseFloat(cs.borderLeft) : 0) +
				                                     (cs.borderRight ? parseFloat(cs.borderRight) : 0));
							if(typeof data.helper == "string"){
								if(data.helper == "clone"){
									var helper = elem.cloneNode(true);
									LyteComponent.insertAfter(elem,helper);
									$L(elem).removeClass('selected-element');
									if(!($L(helper).hasClass('draggable-handle-element'))){
										$L(helper).addClass('draggable-handle-element');
									}
									helper._draggableData = Object.assign({},data);
									data = helper._draggableData;
									data._element = data.handle = helper;
									_handleElement = helper;
									elem = helper;
									elem.addEventListener("mousedown",mouseDownEvent);
									if(data.connectToSortable){
										data._prevTop = event.clientY;
									}
								}
							}
							else{
								var helper = data.helper(elem);
								if(helper){
									$L(elem).removeClass('selected-element');
									if(!($L(helper).hasClass('draggable-handle-element'))){
										$L(helper).addClass('draggable-handle-element');
									}
									helper._draggableData = Object.assign({},data);
									data = helper._draggableData;
									data._element = data.handle = helper;
									_handleElement = helper;
									elem = helper;
									elem.addEventListener("mousedown",mouseDownEvent);
									if(data.connectToSortable){
										data._prevTop = event.clientY;
									}
								}
							}
							if(typeof managerDD != "undefined"){
								managerDD._current = elem;
							}

							data = elem._draggableData || _handleElement._draggableData;
							
							//Create placeholder and append it to the DOM
							if(data.connectToSortable){
								_placeholder = elem.cloneNode(true);
								$L(_placeholder).removeClass('selected-element');
								$L(_placeholder).html("");
								$L(_placeholder).attr('id','lyteDraggableDummy');
								$L(_placeholder).addClass('lyteDraggablePlaceholder');
								if(cs.boxSizing == "border-box"){
									$L(_placeholder).width(elemOffset.width);
									$L(_placeholder).height(elemOffset.height);
								}
								else{
									$L(_placeholder).width(elemOffset.width - borderDimensionX);
									$L(_placeholder).height(elemOffset.height - borderDimensionY);
								}
								_placeholder.style.padding = "0px";
							}
							elem.style.top = elemOffset.top - parentOffset.top /*- parseInt(cellSpacing)*/ - parseInt(_marginTop) + 'px';
							elem.style.left = elemOffset.left - parentOffset.left - parseInt(_marginLeft) + 'px';
							elem.style.zIndex = 200000;
							if(cs.boxSizing == "border-box"){
								elem.style.width = elemOffset.width /*- borderDimensionX */+'px';
								elem.style.height = elemOffset.height /*- borderDimensionY*/ +'px';
							}
							else{
								elem.style.width = elemOffset.width - borderDimensionX +'px';
								elem.style.height = elemOffset.height - borderDimensionY +'px';
							}
							elem.style.position = "absolute";
						}

						if(event.type == "mousemove"){
							_mousePosition = {
								x : event.clientX,
								y : event.clientY
							};
							data._mousePosition = _mousePosition;
						}
						else if(event.type == "touchmove"){
							data._mousePosition = {
								x : event.touches[0].clientX,
								y : event.touches[0].clientY
							};
						}

						//Callback fired
						if(data.onDrag){
							returnVal = onDrag(data,_handleElement);
						}
						if(returnVal){
							if(orientation === "vertical"){
								elem.style.top = data._mousePosition.y - data._offset[1] - parentOffset.top - parseInt(_marginTop) + 'px';
							}
							else if(orientation === "horizontal"){
								elem.style.left = data._mousePosition.x - data._offset[0] - parentOffset.left - parseInt(_marginLeft) + 'px';
							}
							else if(orientation === "default"){
								if(data.cursorAt){
									elem.style.left = data._mousePosition.x - (data.cursorAt.left ? data.cursorAt.left : _offset[0]) - parentOffset.left - parseInt(_marginLeft) + 'px';
									elem.style.top = data._mousePosition.y - (data.cursorAt.top ? data.cursorAt.top : _offset[1]) - parentOffset.top - parseInt(_marginTop) + 'px';
								}
								else{
									elem.style.left = data._mousePosition.x - _offset[0] - parentOffset.left - parseInt(_marginLeft) + 'px';
									elem.style.top = data._mousePosition.y - _offset[1] - parentOffset.top - parseInt(_marginTop) + 'px';
								}
								
								elemOffset = elem.getBoundingClientRect();
								if(data.connectToSortable){
									var sortableData = $L(data.connectToSortable).e.length ? $L(data.connectToSortable).e[0]._sortableData : $L(data.connectToSortable).e._sortableData;
									_sortableElemClass = sortableData.sortableElemClass;
									if(_positionedPlceholder){
										var scrollDiv = findScrollDiv(_placeholder);
										var scrollDivOffset = scrollDiv ? scrollDiv.getBoundingClientRect() : null;
										if(scrollDiv && (elemOffset.left <= scrollDivOffset.right) && (elemOffset.right >= scrollDivOffset.left)){
											_requestId1 = requestAnimationFrame(callForScrollY.bind(this,data,scrollDiv,scrollDivOffset));
											_animationFrameFired1 = true;
										}
									}
									//Find the below element over which the sortable element is being dragged
									elem.style.display = "none";
									_elemBelow = document.elementFromPoint(_mousePosition.x,_mousePosition.y);
									elem.style.display = "";
									

									if(!_elemBelow){
										return;
									}

									//Find the closest sortable element to sort with
									droppablePlace = _elemBelow.closest('.'+_sortableElemClass);
									if(document.getElementById('lyteDraggableDummy')){
										document.getElementById('lyteDraggableDummy').style.display = "";
									}

									if(droppablePlace/* && checkDroppable(droppablePlace,_sortableElem.parentElement,_sortableElem,data.connectedWith,data.containmentDimensions,_mousePosition)*/){
										
										if($L(_elemBelow).hasClass('sortable-parent') && checkParentDroppable(_elemBelow,data) && checkForIntersect(_elemBelow,_mousePosition)){
											// $L(_elemBelow).append(_placeholder);
											LyteComponent.appendChild(_elemBelow,_placeholder);
										}
										else{
											if(elem.getBoundingClientRect().top < droppablePlace.getBoundingClientRect().top){
												LyteComponent.insertBefore(droppablePlace,_placeholder);
											}
											else if(elem.getBoundingClientRect().bottom > droppablePlace.getBoundingClientRect().bottom){
												LyteComponent.insertAfter(droppablePlace,_placeholder);
											}
										}
										_positionedPlceholder = true;
									}
									else if(_elemBelow && $L(_elemBelow).hasClass('sortable-parent') && checkParentDroppable(_elemBelow,data) && checkForIntersect(_elemBelow,_mousePosition)){
										// $L(_elemBelow).append(_placeholder);
										LyteComponent.appendChild(_elemBelow,_placeholder);
										_positionedPlceholder = true;
									}
									else{
										if(_elemBelow.id != "lyteDraggableDummy"){
											// console.log("placeholder set to false");
											if(document.getElementById('lyteDraggableDummy')){
												document.getElementById('lyteDraggableDummy').style.display = "none";
											}
											_positionedPlceholder = false;
										}
									}

									if(_positionedPlceholder){
										if(!data.onPlaceholder || checkValidDroppable(data,_placeholder)){
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
									
									// else{
									// 	console.log("checkParentDroppable",checkParentDroppable(_elemBelow,data._parentElem,_sortableElem,data.connectedWith));
									// 	console.log("checkForIntersect",checkForIntersect(_elemBelow,_mousePosition));
									// 	console.log("came here",_elemBelow);
									// }
									data._placeholder = _placeholder;
									data._positionedPlceholder = _positionedPlceholder;
								}
							}
						}
						
						//Check for any droppable element and if present execute its drag function
						if(typeof managerDD !== "undefined"){
							managerDD._drag(event);
						}
						data._isMoved = true;
					}
				}
			}

			var mouseUpEvent = function(event){
				// console.log("calling mouseup from draggable");
				// event.preventDefault();
				// _handleElement = event.target.closest('.selected-element') ? event.target.closest('.selected-element') : document.querySelector('.selected-element');
				var target = event.target;
				_handleElement = null;
				while(target){
					if($L(target).hasClass("selected-element")){
						_handleElement = target;
						break;
					}
					target = target.parentElement;
				}
				if(_handleElement){
					var data = _handleElement._draggableData;
					document.removeEventListener('mousemove',mouseMoveEvent);
					document.removeEventListener('mouseup',mouseUpEvent);
					_placeholder = data._placeholder;
					if(data && data._isDown){
						data._isDown = false;
						var elem = data._element;
						if(data._isMoved){
							var placed = false;
							data._isMoved = false;
							_initialPos = data._initialPos;
							_marginTop = parseInt(data._marginTop);
							_marginLeft = parseInt(data._marginLeft);
							
							var returnVal = true;
							if(data.onBeforeStop){
								returnVal = onBeforeStop(data);
							}
							if(!returnVal){
								if(data.helper == "clone"){
									elem.remove();
									if(document.getElementById('lyteDraggableDummy')){
										_placeholder.remove();
									}
									return;
								}
								if(_initialPos.pos === "absolute"){
									elem.style.left = _initialPos.x + "px";
									elem.style.top = _initialPos.y + "px";
								}
								else{
									elem.style.left = "";
									elem.style.top = "";
									elem.style.position = "";
								}
							}
							else{
								if(data.connectToSortable && data._positionedPlceholder){
									var sibling = (findPreviousElem(_placeholder) ? findPreviousElem(_placeholder) : findNextElem(_placeholder));
									var elementData = sibling ? sibling._sortableData : _placeholder.parentElement._sortableData;
									// $L(_placeholder).replace(_div);
									LyteComponent.replaceWith(_placeholder, elem);
									
									_placeholder = null;
									elem._sortableData = elementData;
									elem.removeEventListener('mousedown',mouseDownEvent);
									removeStyle(elem);
									placed = true;
								}
							}
							
							//Check for any droppable element & if present execute its drop function
							if(typeof managerDD !== "undefined"){
								managerDD._drop(event);
								managerDD._current = null;
							}

							//Callback fired
							if(data.onStop){
								returnVal = onStop(data, event);
							}

							if(!returnVal){
								if(data.helper == "clone" && !placed){
									elem.remove();
									if(document.getElementById('lyteDraggableDummy')){
										_placeholder.remove();
									}
									return;
								}
								if(_initialPos.pos === "absolute"){
									elem.style.left = _initialPos.x + "px";
									elem.style.top = _initialPos.y + "px";
								}
								else{
									elem.style.left = "";
									elem.style.top = "";
									elem.style.position = "";
								}
							}

						}
						elem.style.zIndex = "";
						$L(_handleElement).removeClass('selected-element');

						//Unbinding touch events
						if(event.type == "touchend"){
							elem.removeEventListener('touchmove',data.__mousemove);
							elem.removeEventListener('touchend',data.__mouseup);
						}
					}
					_handleElement = null;
					if(document.getElementById('lyteDraggableDummy')){
						_placeholder.remove();
					}
				}
			}

			/*---------------Callbacks Start--------------*/
			var onReady = function(data){
				data.onReady(data._element);
			}

			var onStart = function(data){
				data.onStart(data._element);
				// return ( returnVal === undefined) ? true : returnVal;
			}

			var onDrag = function(data, _handleElement){
				returnVal = data.onDrag(data._element,_handleElement);
				return (returnVal == undefined) ? true : returnVal;
			}

			var onBeforeStop = function(data){
				returnVal = data.onBeforeStop(data._element,data._placeholder,data._positionedPlceholder ? data._placeholder.parentElement : null);
				return (returnVal == undefined) ? true : returnVal;
			}

			var checkValidDroppable = function(data,placeholder){
				var returnVal = data.onPlaceholder(data._element,placeholder, data._element.parentElement, placeholder ? placeholder.parentElement : null);
				return (returnVal == undefined) ? true : returnVal;
			}

			var onStop = function(data,event){
				data._element.style.display = "none";
				_elemBelow = document.elementFromPoint(event.clientX, event.clientY);
				data._element.style.display = "";
				returnVal = data.onStop(data._element, data._positionedPlceholder ? data._element.parentElement : null, _elemBelow);
				return (returnVal === undefined) ? true : returnVal;
			}
			/*---------------Callbacks End--------------*/

			
			//Bind events
			data.__mousemove = mouseMoveEvent;
			data.__mouseup = mouseUpEvent;
			if(typeof data.handle !== "string" && data.handle.length){
				data.handle.forEach(function(item){
					ele = $L(item).e;
					ele._draggableData = data;
					$L(ele).addClass('draggable-handle-element');
					$L(ele).e.addEventListener('mousedown',mouseDownEvent);
					$L(ele).e.addEventListener('touchstart',mouseDownEvent);
					// $L(ele).bind("mousedown",mouseDownEvent);
					// $L(ele).bind("touchstart",mouseDownEvent);
				});
			}
			else{
				data.handle._draggableData = data; 
				$L(data.handle).addClass('draggable-handle-element');
				$L(data.handle).e.addEventListener('mousedown',mouseDownEvent);
				$L(data.handle).e.addEventListener('touchstart',mouseDownEvent);
				// $L(data.handle).bind("mousedown",mouseDownEvent);
				// $L(data.handle).bind("touchstart",mouseDownEvent);
			}
			

			//Callback fired
			if(data.onReady){
				onReady(data);
			}

			var checkParentDroppable = function(_elemBelow,data){
				if(_elemBelow.matches(data.connectToSortable)){
					return true;
				}
				return false;
			}

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

			var callForScrollY = function(){
				var scrollDiv = arguments[1];
				var parentOffset = arguments[2];
				var divOffset = arguments[0]._element.getBoundingClientRect();
				var topNBottom = arguments[3];
				
				if((divOffset.top <= parentOffset.top) && (scrollDiv.scrollTop > 0)){
					scrollDiv.scrollTop -= 10;
				}
				else if((divOffset.bottom >= parentOffset.bottom) && (scrollDiv.scrollTop <= (scrollDiv.scrollHeight - parentOffset.height))){
					scrollDiv.scrollTop += 10;
				}
				else{
					cancelAnimationFrame(_requestId1);
					_animationFrameFired1 = false;
					_requestId1 = null;
					return;
				}
				_requestId1 = requestAnimationFrame(callForScrollY.bind(this,arguments[0],scrollDiv,parentOffset,topNBottom));
				
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

			var checkForBetween = function(parentElem,mP,div){
				var childrens = parentElem.children;
				var templateTags = 0;
				var childElem = [];
				for(var i = 0;i<childrens.length;i++){
					if(childrens[i].tagName != "TEMPLATE" && childrens[i].id != "dummy"){
						childElem.push(childrens[i]);
					}
					else{
						templateTags++;
					}
				}
				if(templateTags == childrens.length){
					return true;
				}
				// else if(childElem.length > 0 && childElem[childElem.length - 1].isEqualNode(div)){
				// 	return true;
				// }
				else if(div.getBoundingClientRect().top > childElem[childElem.length - 1].getBoundingClientRect().bottom){
					return true;
				}
				return false;
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

			var removeStyle = function(elem){
				elem.style.left = "";
				elem.style.top = "";
				elem.style.zIndex = "";
				elem.style.position = "";
				$L(elem).addClass("sortable-element",elem._sortableData.sortableElemClass);
				elem.classList.remove('draggable-handle-element','draggable-element');
			};

			var findScrollDiv = function(elem){
				var parent = elem.parentElement;
				while(elem.parentElement){
					elem = elem.parentElement;
					if(parent.scrollHeight > elem.clientHeight && !(elem.style.overflow && elem.style.overflow == 'hidden')){
						return elem;
					}
				}
				return null;
			};

		}
	}

})( window );