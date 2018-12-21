(function(){

	if($L) {

		function returnElem(element){
			return $L('.lyteScrollBar', element).e[0];
		}

		function returnCorrectParent( element, checkList ){
			var elementChild = element.children;
			for( var i = 0; i < checkList.length; i++ ) {
				if( Array.prototype.indexOf.call( elementChild, checkList[ i ] ) != -1){
					return checkList[ i ]
				}
			}
		}

		function makeVisisble( divv, flag, event ){
			if( !divv ){
				return
			}
			event = event || {}
			if( flag ) {
				if( ( event.type != 'mouseenter' && event.type != 'resize' ) || this.parentElement._scrollData.showOn != 'scroll' ){
					divv.style.visibility = 'visible'
					divv.classList.add( 'visible' )
					setScrollPos(divv);
				}
				return true
			} else{
				divv.style.visibility = 'hidden'
				divv.classList.remove( 'visible' )
			}
			
		}

		function mousemove1( evt ){
			event.preventDefault()
			if( this._happened ){
				return
			}
			this._happened = true
			setTimeout( function(){
				if( !this.classList.contains( 'eventBinded' ) ) {
					mouseenter.call( this )
				}
				// this.removeEventListener( 'mousemove', mousemove1, true )
				this.removeEventListener( 'wheel', mousemove1, true )
				delete this._happened;
			}.bind( this ), 20)
		}

		function mouseenter(event){
         	this.parentElement.style.position = 'relative';
			var element = this;
			event = event || {}
			if( this._mouseleaveTimeout ){
				return
			}
			this._mouseenterTimeout = setTimeout( function(){
				delete this._mouseenterTimeout
				// dimensions and scroll levels of the element are calculated for enabling scrollbars
				element._direction = window.getComputedStyle(this).direction;
        		var clientRect = element.getBoundingClientRect(), flag = false;
        		var scrollWidth1 = element.scrollWidth;
        		var scrollHeight1 = element.scrollHeight;
        		flag = makeVisisble.call( this, returnCorrectParent( this.parentElement, $L('.lyteScrollContainer.lyteScrollContainerX', this.parentElement).e ), (scrollWidth1 - Math.round(parseInt(clientRect.width.toFixed(0)))) > 10, event )
        		flag = makeVisisble.call( this, returnCorrectParent( this.parentElement, $L('.lyteScrollContainer.lyteScrollContainerY', this.parentElement ).e ), (scrollHeight1 - Math.round(parseInt(clientRect.height.toFixed(0)))) > 10 || this._infiniteScroll, event )	|| flag
		        if(flag){
		        	element.addEventListener('wheel', wheelEvent);
		        	element.classList.add( 'eventBinded' )
		        	element.addEventListener('keydown', keydownFunc);
		        	element._tabindex = element.tabIndex;
		        	if(element.tabIndex == -1){
		        		element.tabIndex = 0;
		        	}
		        }
		        if( ( event.type != 'mouseenter' && event.type != 'resize' ) && this.parentElement._scrollData.showOn == 'scroll' ) {
		        	// setTimeout( function(){
		        		this._enableScroll = true
		        	// }.bind( this ), 16)
		        }
			}.bind( this ), event.constructor == Boolean ? 0 : 16 )
				
       }

       function  mouseleave(event){
	        	var element = returnElem(this);
       			clearTimeout( element._mouseenterTimeout );delete element._mouseenterTimeout;		
	        	event = event || {}
	        	if(event && event.type == 'mouseleave')
	        		{
	        			if(element.contains(event.relatedTarget)){
	        				return;
	        			}
	        		}
	        	if( event.timeout && document._scrollmousedown ) {
	        		return
	        	}	
        		if(( event.flag == undefined && !document._scrollmousedown ) || ( document._scrollmousedown && event.flag == false  ) || ( event.flag && this._scrollData.showOn == 'scroll' ) )	
	        		{
	        			clearTimeout( element._mouseleaveTimeout )
	        			element._mouseleaveTimeout = setTimeout( function(){
		        			var bars = $L( '.lyteScrollContainer', this );
		        			if( bars.e.length )
		        				{
		        					bars.css('visibility','hidden');
		        					bars.removeClass( 'visible' )
		        					if( event.flag == undefined || ( !event.flag && this._scrollData.showOn == 'scroll' ) || this._scrollData.showOn != 'scroll' ){
		        						element.removeEventListener('wheel', wheelEvent);
		        						element.removeEventListener('keydown', keydownFunc);
		        						element.classList.remove( 'eventBinded' )
		        						element.tabIndex = element._tabindex;
		        						delete element._tabindex;
		        					}
		        					delete element._enableScroll;delete element._scrollTimeout;
		        				}
		        			delete element._mouseleaveTimeout;	
		        		}.bind( this, event ), 100)	
	        		}
	     }

	     function infiniteWheel (event){
	     		var fact = 1;
	     		var a = event.deltaX;
			    var b = event.deltaY;
			    if( this.parentElement._scrollData.showOn == 'scroll' ){
			    	if( !this._enableScroll ){
			    		mouseenter.call( this )
			    		return
			    	}
			    	clearTimeout( this._scrollTimeout )	
			    	this._scrollTimeout = setTimeout(mouseleave.bind( this.parentElement ), 500, { flag : true, timeout : true } )
			    }
			    // clientRect need to be taken for positioning
				var divClientRect = this.getBoundingClientRect();
				var direction = this._direction;
				var factor = 1;
				this._scrollFlag = true
				if((navigator.userAgent.toLowerCase().indexOf('edge') != -1 && direction == 'rtl') || ((navigator.userAgent.toLowerCase().indexOf('trident') != -1 || navigator.userAgent.toLowerCase().indexOf('msie') != -1) && direction == 'rtl'))
					{
						factor = -1;
					}
				var scrollWid = this.scrollWidth, scrollHgt = this.scrollHeight, scrollLeft = this.scrollLeft, scrollTop = this.scrollTop;	
				if((divClientRect.height + scrollTop >= scrollHgt && b > 0) && this._scrollEnd /*&& (divClientRect.width + scrollLeft >= scrollWid)*/ && !this._infiniteScroll){
					delete this._scrollFlag
					return;
				}
				this.scrollLeft = parseInt(this.scrollLeft) + a * factor;
				if(this._infiniteScroll){
					if(b < 0){
						b = Math.abs(b) > 20 ? -20 : b;
					}else{
						b = b > 20 ? 20 : b;
					}
				}else{
					if(b < 0){
						b = Math.abs(b) > 100 ? -100 : b;
					}else{
						b = b > 100 ? 100 : b;
					}
				}
				this.scrollTop = parseInt(this.scrollTop) + (b);
				this._scrollLeft = this.scrollLeft;
				this._scrollTop = this.scrollTop;
				var scrollbars = $L('.lyteScrollContainer.visible', this.parentElement).e;
				var newScrollWid = scrollWid - scrollLeft + this.scrollLeft;
				var newScrollHgt = scrollHgt - scrollTop + this.scrollTop;
				this._scrollWidth = newScrollWid;
				this._scrollHeight = newScrollHgt;
				for(var i = 0; i < scrollbars.length; i++)
					{
						if( scrollbars[ i ].parentElement == this.parentElement ){
							setScrollPos(scrollbars[i]);
						}
					}		
				triggerScroll(a * factor, b, this)
	     }

	     function wheelEvent(event){
	     	if( this.classList.contains( 'lyteTableScroll' ) ) {
	     		var thead = $L( 'lyte-thead', this ).e[ 0 ];
	     		if( thead ) {
	     			var el = event.target;
	     			while( el != this ) {
	     				if( el.classList.contains( 'preventWheel' ) ) {
	     					break;
	     				}
	     				el = el.parentElement
	     			}
	     			if( el.classList.contains( 'preventWheel' ) ){
	     				return
	     			}
	     		}
	     	}
	     	if(this._infiniteScroll && (event.deltaY < 0 || !this._preventScroll) && !this._allow){
	     		clearTimeout(this._timeId)
		     	this._timeId = setTimeout(infiniteWheel.bind(this), 10, event)
	     	}else if(!this._infiniteScroll){
	     		setTimeout(infiniteWheel.bind(this), 16, event)
	     	}
	     	event.preventDefault();
		}

		function keydownFunc(evt){
			var keyCode = evt.keyCode, clientRect = this.getBoundingClientRect();
			if([37, 38, 39, 40].indexOf(keyCode) != -1){
				var step = this.parentElement._scrollData.keyStep, pos, x, y;
				if(keyCode == 37){
					this.scrollLeft -= step;
					x = -step; y = 0;
					pos = 'X';
				}else if(keyCode == 38){
					y = -step; x = 0;
					this.scrollTop -= step;
					pos = 'Y';
				}else if(keyCode == 39){
					x = step; y = 0;
					this.scrollLeft += step;
					pos = 'X';
				}else{
					y = step; x = 0;
					this.scrollTop += step;
					pos = 'Y';
				}
				setScrollPos( returnCorrectParent( this.parentElement, $L('.lyteScrollContainer.lyteScrollContainer'+ pos, this.parentElement).e ) )
				if(pos == 'Y'){
					if(!(this.scrollTop == 0 || parseInt(this.scrollTop + clientRect.height) >= this.scrollHeight - 2)){
						evt.preventDefault();
					}
				}else{
					if(!(this.scrollLeft == 0 || parseInt(this.scrollLeft + clientRect.width) >= this.scrollWidth - 2)){
						evt.preventDefault();
					}
				}
				triggerScroll(x, y, this);
			}
		}


		 function triggerScroll(a, b, comp){
		 	// $L.fastdom.measure( function(){
		 		var evt = new Event('scroll', {bubbles : true}), flag = true;
		 		// wheel event continuosly applied after reaching scroll end (it requires for table with infinite scroll so some basic needs are calculated same will be used in table column fixing)
		 		evt.scrollLeft = comp.scrollLeft; evt.scrollTop = comp.scrollTop; evt.scrollWidth = comp.scrollWidth, evt.scrollHeight = comp.scrollHeight, bccr = comp.getBoundingClientRect();
		 		if(evt.scrollLeft == comp._prevScrollLeft && evt.scrollTop == comp._prevScrollTop){
		 			if(!comp._infiniteScroll){
		 				if(!comp._scrollEnd){
		 					comp._scrollEnd = true;
		 				}else{
		 					flag = false;
		 				}
		 			}
		 			evt.scrollEnd = true;
		 		}else{
		 			if(comp._scrollEnd){
		 					delete comp._scrollEnd;
		 				}
		 		}
		 		if(!flag){
		 			return;
		 		}
		 		comp._prevScrollLeft = evt.scrollLeft; comp._prevScrollTop = evt.scrollTop;
		    	evt.xScroll = a;
		    	evt.yScroll = b;
		    	evt.flag = true
		    	if( evt.scrollLeft && evt.scrollLeft + bccr.width >= evt.scrollWidth ){
		    		evt.horiScrollEnd = true
		    	}
		    	if( evt.scrollTop && evt.scrollTop + bccr.height >= evt.scrollHeight ){
		    		evt.vertScrollEnd = true
		    	}
		    	if(flag){
		    		evt._byPlugin = true
		    		comp.dispatchEvent(evt);
		    	}
		    	clearTimeout( comp._timeout )
		    	comp._timeout = setTimeout( function(){
		    		delete comp._scrollFlag; delete comp._timeout
		    	}, 100 )
		    	
		 	// }.bind( this ) )
	    } 

	   function setScrollPos(outerDiv){
	    	var element = returnElem(outerDiv.parentElement), fact = 1;
			var scrollBar = $L('.lyteScrollDiv', outerDiv).e[0];
			var scrollHeight = 'scrollHeight', scrollTop = 'scrollTop', scrollLeft = 'scrollLeft', height = 'height',top1 = 'top', left = 'bottom', offsetHeight = 'clientHeight';
			var scrollHeight1, scrollTop1, height1, rect, offsetWidth, scrollWidth;
			$L.fastdom.measure(function(){
				var compStyleElem = element.getBoundingClientRect();
				if(scrollBar._direction)
					{
						var direction = element._direction;
						if(direction == 'rtl')
							{	
								fact = -1;
							}
						scrollHeight = 'scrollWidth', scrollTop = 'scrollLeft', scrollLeft = 'scrollTop', height = 'width',top1 = 'left', left = 'right', offsetHeight = 'clientWidth';
					}
				// element dimesions are measured here	
				rect = parseInt(compStyleElem[height])				
				scrollHeight1 = element[scrollHeight];
				scrollTop1 = Math.abs(element[scrollTop]);
				offsetWidth = compStyleElem.offsetWidth;
				scrollWidth = element.scrollWidth;
				height1 = rect - Math.round(parseInt(window.getComputedStyle(outerDiv).getPropertyValue(top1)));
				$L.fastdom.mutate(function(){
					// setting scroll bar height / width  && top / left depending upon scrolling
					scrollBar.style[height] = (rect / scrollHeight1 * 100) + '%';
					if(navigator.userAgent.toLowerCase().indexOf('chrome') != -1 && fact == -1)
						{
							scrollBar.style[top1] = -((scrollWidth - rect - scrollTop1)/scrollHeight1 * 100) + '%';
						}
					else if(fact == -1)
						{
							scrollBar.style[top1] = -(scrollTop1/scrollHeight1 * 100) + '%';
						}	
					else	
						{
							scrollBar.style[top1] = (scrollTop1/scrollHeight1 * height1) + 'px';
						}
				}.bind(this))
			}.bind(this))
	    }

	    function scrollFunc( evt ){
	    	if( this._scrollFlag || evt._byPlugin ) {
	    		return
	    	}
	    	clearTimeout( this._contTimeout )
	    	this._contTimeout = setTimeout( function(){
	    		mouseenter.call( this, true )
	    		delete this._contTimeout;
	    	}.bind( this ) , 10 )
	    }

		$L.prototype.removeScroll = function(){
			var elements = []
			if(this.e.length == undefined){
			 		elements.push(this.e);
			 }else{
		 		for(var i = 0; i < this.e.length; i++){
		 			elements.push(this.e[i])
		 		}
			}
			for(var j = 0; j < elements.length; j++){
				var wrapp = elements[j].parentElement;
				if(wrapp._scrollData){
					elements[j].removeEventListener('mouseenter', mouseenter);
					wrapp.removeEventListener('mouseleave', mouseleave);
					elements[j].removeEventListener('scroll', scrollFunc, true);
					var scrollDivs = $L('div.lyteScrollContainer', wrapp).e;
					for(var k = 0; k < scrollDivs.length; k++){
						if( scrollDivs[k].parentElement == wrapp ) {
							wrapp.removeChild(scrollDivs[k]);
						}
					}
					returnElem(wrapp).classList.remove('lyteScrollBar');
					delete wrapp._scrollData; delete elements[ j ]._scrollTimeout;
					delete elements[ j ].resetScrollbar;delete elements[ j ]._scrollFlag;
				}
			}
			elements = undefined;
		}

		$L.prototype.scroll = function(obj){
			obj = obj == undefined ? {} : obj;
			obj.keyStep = obj.keyStep ? obj.keyStep : 30;
			obj.showOn = obj.showOn ? obj.showOn : 'hover';
			var elements = []

			function appendSpan(className, element, wrapperDiv){
	        	var outerDiv = document.createElement('div');
				outerDiv.classList.add('lyteScrollContainer');
				if(obj.containerClass)
					{
						outerDiv.classList.add(obj.containerClass);
					}
				outerDiv.style.visibility = 'hidden'
				var innerDiv = document.createElement('div');
				innerDiv.classList.add('lyteScrollDiv');
				if(obj.handlerClass)
					{
						innerDiv.classList.add(obj.handlerClass);
					}
				outerDiv.appendChild(innerDiv);
				outerDiv.classList.add(className);
				if(className == 'lyteScrollContainerX')
					{
						innerDiv._direction = true;
						if(obj.horizontalContainerClass)
							{	
								outerDiv.classList.add(obj.horizontalContainerClass);
							}
						if(obj.horizontalHandlerClass)
							{
								innerDiv.classList.add(obj.horizontalHandlerClass);
							}	
					}
				else
					{
						if(obj.verticalContainerClass)
							{	
								outerDiv.classList.add(obj.verticalContainerClass);
							}
						if(obj.verticalHandlerClass)
							{
								innerDiv.classList.add(obj.verticalHandlerClass);
							}
					}
				wrapperDiv.appendChild(outerDiv);
				outerDiv.addEventListener('click', outerDivClick);
				innerDiv.addEventListener('mousedown', innerDivClick);
				outerDiv._wrapper = wrapperDiv;
				return outerDiv;
	        }

	        function outerDivClick(event){
				var parent = returnElem(this.parentElement);
				var child = this.children[0]; parent._scrollFlag = true
				if(!child.dontAllow)
					{
						$L.fastdom.measure(function(){
							var childBound = child.getBoundingClientRect(), val, thisBound = this.getBoundingClientRect(), parentBound = parent.getBoundingClientRect(), iniS = parent.scrollLeft, iniT = parent.scrollTop;
							var hgt = 'width', top1 = 'left', scrollTop = 'scrollLeft', scrollHeight = 'scrollWidth', maxScroll = 'maxScrollWidth', bottom = 'right', clientY = 'clientX';
							if(!child._direction){
								hgt = 'height', top1 = 'top', scrollTop = 'scrollTop', scrollHeight = 'scrollHeight', maxScroll = 'maxScrollHeight', bottom = 'bottom', clientY = 'clientY';
							}
							var prevHgt = parseInt(child.style[top1]), newHgt = Math.max( event[clientY] - thisBound[top1] - childBound[hgt] / 2, 0 );
							prevHgt = prevHgt == NaN ? 0 : prevHgt;
							$L.fastdom.mutate(function(){
								child.style[top1] = (newHgt) + 'px';
								if((childBound[bottom] -prevHgt + newHgt) > thisBound[bottom])
									{
										newHgt = thisBound[hgt] - childBound[hgt];
										child.style[top1] = newHgt + 'px';
									}
								val =  thisBound[ top1 ] + parseInt( child.style[ top1 ] )
								prevHgt = newHgt - prevHgt;	
								 if(parseInt(parent[scrollTop]) <= parseInt((parent[scrollHeight] - parentBound[hgt]).toFixed(0)))
									{
										parent[scrollTop] = parent[ scrollHeight ] * ( val - thisBound[ top1 ] ) / parentBound[ hgt ] - ( ( navigator.userAgent.toLowerCase().indexOf('chrome') == -1 && parent._direction == 'rtl' && this.classList.contains( 'lyteScrollContainerX' ) ) ? ( parent.scrollWidth - parentBound.width )  : 0 ) ;
									} 
								$L.fastdom.measure(function(){
									setScrollPos( this );
									setTimeout( triggerScroll, 16 , parent.scrollLeft - iniS, parent.scrollTop - iniT, parent )
								}.bind( this ))	
							}.bind( this ))
						}.bind( this ))
					}
				delete child.dontAllow;
			}

			function innerDivClick(event){
				if( !this.parentElement.classList.contains( 'visible' ) ){
					return
				}
				document.scrollMousemove = mousemove.bind(this);
				document._scrollPlugin = this;
				document.addEventListener('mousemove', document.scrollMousemove);
				document.addEventListener('mouseup', mouseup, true);
				var parent =  returnElem(this.parentElement.parentElement);
				var wrapperDiv = this.parentElement._wrapper;
				if(this._direction)
					{
						this._offsetLeft = this.offsetLeft;
						this._offLeft = event.clientX;
						this._prev = event.clientX;
						this.maxScrollWidth = parent.scrollWidth;
						this._iniScrollLeft = parent.scrollLeft;
						wrapperDiv.classList.add('lyteScrollingX');
					}
				else
					{
						this._offsetTop = this.offsetTop;
						this._offTop = event.clientY;
						this._prev = event.clientY;
						this.maxScrollHeight = parent.scrollHeight;
						this._iniScrollTop = parent.scrollTop;
						wrapperDiv.classList.add('lyteScrollingY');
					}
				event.preventDefault();
				event.stopPropagation();
				document._scrollmousedown = true;	
			}

			function mouseup(event){
				document.removeEventListener('mousemove', document.scrollMousemove);
				document._scrollPlugin.dontAllow = true;
				var comp = document._scrollPlugin.parentElement._wrapper;
				comp.classList.remove('lyteScrollingX');
				comp.classList.remove('lyteScrollingY');
				document.removeEventListener('mouseup', mouseup, true);
				event.preventDefault();
				event.stopPropagation();
				event.stopImmediatePropagation();
				if( comp._scrollData.showOn != 'always' ){
					mouseleave.call(comp, { flag : comp.contains( event.target ) });
				}
				var el = document._scrollPlugin;	
				delete el._offsetLeft; delete el._prev; delete el._offLeft; delete el._offTop; delete el._offsetTop; delete el.maxScrollWidth; delete el.maxScrollHeight; delete el._iniScrollTop; delete el._iniScrollLeft;	
				delete document._scrollmousedown;
				delete document._scrollPlugin;
				delete document.scrollMousemove;	

			}

			function mousemove(event){
				var parent = returnElem(this.parentElement.parentElement), scrollLevel1, scrollLevel2, newTop = 0;
				var hgt = 'width', top1 = 'left', scrollTop = 'scrollLeft', scrollHeight = 'scrollWidth', maxScroll = 'maxScrollWidth', topToSet, oldTop;
				var compStyle = parent._direction, thisParent = this.parentElement.getBoundingClientRect(), parentClientRect = parent.getBoundingClientRect(), clientRect = this.getBoundingClientRect();
				if(!this._direction){
					hgt = 'height', fact = 1, top1 = 'top', scrollTop = 'scrollTop', scrollHeight = 'scrollHeight', maxScroll = 'maxScrollHeight';
				}
				if(this._direction)
					{
						topToSet, oldTop = parseInt(this.style.left);
						oldTop = isNaN(oldTop) ? 0 : oldTop;
						scrollLevel1 = event.clientX - this._offLeft;
						if(navigator.userAgent.toLowerCase().indexOf('chrome') != -1 && compStyle == 'rtl')
							{
								if(parent.scrollLeft > 0 && parseInt(parent.scrollWidth - parentClientRect.width) > parent.scrollLeft)
									{
										topToSet = -(-clientRect.right + thisParent.right - scrollLevel1);
										this.style.left = topToSet + 'px';
									}else{
										topToSet = oldTop;
									}
								this._offLeft = event.clientX;	
							}
						else
							{
								topToSet = /*clientRect.left - thisParent.left*/ this._offsetLeft + scrollLevel1;	
								this.style.left = topToSet + 'px';
								scrollLevel1 = event.clientX - this._prev;
								this._prev = event.clientX	
							}						
					}
				else	
					{
						scrollLevel2 = event.clientY - this._offTop;
						// this._offTop = event.clientY;
						topToSet = /*clientRect.top - thisParent.top*/ this._offsetTop + scrollLevel2, oldTop = parseInt(this.style.top);
						oldTop = isNaN(oldTop) ? 0 : oldTop;
						scrollLevel2 = event.clientY - this._prev;
						this._prev = event.clientY
						this.style.top = topToSet + 'px';
					}
				 newTop = topToSet - oldTop;		
				 if(parseInt(parent[scrollTop]) <= parseInt(this[maxScroll] - parentClientRect[hgt]) || (scrollLevel1 == -1 && scrollLevel1 != undefined) || (scrollLevel2 == -1 && scrollLevel2 != undefined))
					{
						if(compStyle == 'rtl' && this.parentElement.classList.contains('lyteScrollContainerX'))
							{
								parent.scrollLeft += (scrollLevel1 = scrollLevel1 ? scrollLevel1 : 0);
							}
						else	
							{
								parent[scrollTop] = parent[scrollHeight] * (clientRect[top1] + newTop - thisParent[top1])/thisParent[hgt]
							}
					} 
				setScrollPos(this.parentElement);
				triggerScroll(scrollLevel1, scrollLevel2, parent);
				event.preventDefault();
				event.stopPropagation();
			}


			if(this.e.length == undefined){
			 		elements.push(this.e);
			 }else{
			 		for(var i = 0; i < this.e.length; i++)
			 			{
			 				elements.push(this.e[i])
			 			}
			}
			for(var j = 0; j < elements.length; j++)
				{
						var wrapperDiv = elements[j].parentElement, outerDiv, outerDiv1;
						wrapperDiv.style.position = 'relative';
						if(wrapperDiv._scrollData){
							$L(elements[j]).removeScroll();
						}
						elements[ j ].resetScrollbar = mouseenter.bind( elements[ j ] );
						wrapperDiv._scrollData = obj;
						if(!obj.preventVertical){
								outerDiv = appendSpan('lyteScrollContainerY', elements[j], wrapperDiv);
								if(obj.verticalPosition == 'left'){
										outerDiv.classList.add('left');
									}
							}
						if(!obj.preventHorizontal){
								outerDiv1 = appendSpan('lyteScrollContainerX', elements[j], wrapperDiv);
								if(obj.horizontalPosition == 'top'){
										outerDiv1.classList.add('top');
									}
							}
						elements[j].addEventListener('scroll', scrollFunc, true);
						elements[j].addEventListener('mouseenter', mouseenter);
						// elements[j].addEventListener('mousemove', mousemove1, true);
						elements[j].addEventListener('wheel', mousemove1, true);
						elements[j].classList.add('lyteScrollBar');
						if(navigator.userAgent.toLowerCase().indexOf('firefox') != -1){
								elements[j].scrollLeft = 0;
								elements[j].scrollTop = 0;
						  }	
						if( obj.showOn == 'hover' || obj.showOn == 'scroll' ) {
							wrapperDiv.addEventListener('mouseleave', mouseleave);
							$L.fastdom.mutate( mouseleave.bind(wrapperDiv) )  
						} else if( obj.showOn == 'always' ) {
							mouseenter.call( elements[j] )
						}
						outerDiv = undefined; outerDiv1 = undefined;
			   }
			elements = undefined;   
		}
	}

})();