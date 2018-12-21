/*------------------------   NOTES   ------------------------*/
/*
  
*/


(function( window ) {

	if($L){	
		var postpone = (function () {
		    var fnMap = new Map(), idMap = new Map(), fnId = 0;
		    var msg = { fnId: 0 };
		    function _postpone(fn) {
		        if (!fnMap[fn]) {
		            fnId++;
		            fnMap[fn] = fnId;
		            idMap[fnId] = fn;
		        }
		        msg.fnId = fnMap[fn];
		        postMessage(msg, '*');
		    }
		    function _postponeListener(e) {
		        var fnId = e.data.fnId;
		        if (fnId) {idMap[fnId]()};
		    }
		    window.addEventListener("message", _postponeListener);
		    return _postpone;
		}());
		
		mIManager = {
			KEY : { BACKSPACE : 8, TAB : 9, RETURN : 13, ESC : 27, LEFT : 37, UP : 38, RIGHT : 39, DOWN : 40, COMMA : 188, SPACE : 32, HOME : 36, END : 35 }, // Keys "enum"
			inputBuffer : [],
			currentDataQuery : null,
			textarea : null,
			escapeMap : { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#x27;', '`': '&#x60;'},
			bindResize : false,
			id : null,
			htmlEncode : function (str) {
			  var escaper = function(match){
			  	return mIManager.escapeMap[match];
			  }
			  var src = '(?:' + Object.keys(mIManager.escapeMap).join('|') + ')';
			  var testRegexp = RegExp(src);
    		  var replaceRegexp = RegExp(src, 'g');
    		  str = str == null ? '' : '' + str;
		      return testRegexp.test(str) ? str.replace(replaceRegexp, escaper) : str;
		    },
		    mentionsSyntax : function(mention){
		    	return "["+mention.value+"]("+mention.type+":"+mention.id+")";
		    },
			createElement : function(tagName,id,className){
				var element = document.createElement(tagName);
				if (id) {
					element.id = id;
				}
				if (className) {
					$L(element).addClass(className);
				}
				return element;
			},
			setCaratPosition : function (domNode, caretPos) {
		      if (domNode.createTextRange) {
		        var range = domNode.createTextRange();
		        range.move('character', caretPos);
		        range.select();
		      } else {
		        if (domNode.selectionStart) {
		          domNode.focus();
		          domNode.setSelectionRange(caretPos, caretPos);
		        } else {
		          domNode.focus();
		        }
		      }
		    },
			init : function(element){
				var ele1 = mIManager.createElement("div",null,"lyteMIWrapper");
				LyteComponent.insertBefore(element,ele1);
				ele1.append(element);
				var ele = mIManager.createElement("div",null,"lyteMIDropdown");
				LyteComponent.insertAfter(element,ele);
				mIManager.copyTextarea(element);
				var cs = window.getComputedStyle(element);
				var ele2 = mIManager.createElement("div",null,"lyteMentions");
				ele2.style.fontFamily = cs.fontFamily;
				ele2.style.fontSize = cs.fontSize;
				ele2.style.fontWeight = cs.fontWeight;
				ele2.append(mIManager.createElement("div",null,null));
				LyteComponent.insertBefore(element,ele2);
				return ele;
			},
			rtrim : function(string) {
    			return string.replace(/\s+$/,"");
  			},
  			highlightContent : function (value, term) {
			    if (!term && !term.length) {
			      return value;
			    }
			    return value.replace(new RegExp("(?![^&;]+;)(?!<[^<>]*)(" + term + ")(?![^<>]*>)(?![^&;]+;)", "gi"), "<b>$1</b>");
		    },
		    copyTextarea : function(element) {

		      //	We will create a div clone of the textarea
		      //	by copying these attributes from the textarea to the div.
		      var attrs = [ 'paddingTop', 'paddingRight', 'paddingBottom', 'paddingLeft', 'marginTop', 'marginRight', 'marginBottom', 'marginLeft', 'fontSize', 'lineHeight', 'fontFamily', 'width', 'fontWeight', 'border-top-width', 'border-right-width', 'border-bottom-width', 'border-left-width', 'borderTopStyle', 'borderTopColor', 'borderRightStyle', 'borderRightColor', 'borderBottomStyle', 'borderBottomColor', 'borderLeftStyle', 'borderLeftColor', 'box-sizing', '-moz-box-sizing', '-webkit-box-sizing'];

		        // CopyTextarea only works on textareas
		        if (element.type !== 'textarea') {
		          return false;
		        }

		        var mITextarea = $L(element),
		          cloneTextarea = $L(mIManager.createElement('div')).css({'position': 'absolute','visibility':'hidden','display':'none','word-wrap':'break-word'}),
		          lineHeight = parseInt(mITextarea.css('line-height'), 10) || parseInt(mITextarea.css('font-size'), '10'),
		          minheight = parseInt(mITextarea.css('height'), 10) || lineHeight * 3,
		          maxheight = parseInt(mITextarea.css('max-height'), 10) || Number.MAX_VALUE,
		          goalheight = 0;


		        // Updates the width of the twin. (solution for textareas with widths in percent)
		        function setCloneDivWidth() {
		          var curatedWidth = Math.floor(parseInt(mITextarea.width(), 10));
		          if(mITextarea.e._mIData && mITextarea.e._mIData._overlayDiv){
		          	$L(mITextarea.e.previousElementSibling).css("fontSize",mITextarea.css("fontSize"));
		          }
		          if (cloneTextarea.width() !== curatedWidth) {
		            cloneTextarea.css({'width': curatedWidth + 'px', 'fontSize': mITextarea.css("fontSize")});

		            if(cloneTextarea.e.getAttribute('setHeight') === "true"){
		            	cloneTextarea.e.setAttribute('setHeight',"false");
		            }
		            else{
		            	// Update height of textarea
		            	updateTextarea(true);
		            }
		            
		          }
		        }

		        // Sets a given height and overflow state on the textarea
		        function setHeightAndOverflow(height, overflow) {

		          var curratedHeight = Math.floor(parseInt(height, 10));
		          if (mITextarea.height() !== curratedHeight) {
		            mITextarea.css({'height': curratedHeight + 'px','overflow':overflow});

		            // // Fire the custom event resize
		            setCloneDivWidth();

		          }
		        }

		        // This function will update the height of the textarea if necessary
		        function updateTextarea(forced) {
		        	cloneTextarea.show();

		          // Get curated content from the textarea.
		          var textareaContent = mITextarea.e.value.replace(/&/g, '&amp;').replace(/ {2}/g, '&nbsp;').replace(/<|>/g, '&gt;').replace(/\n/g, '<br />');

		          // Compare curated content with curated twin.
		          var cloneContent = cloneTextarea.html().replace(/<br>/ig, '<br />');

		          if (forced || textareaContent + '&nbsp;' !== cloneContent) {

		            // Add an extra white space so new rows are added when you are at the end of a row.
		            cloneTextarea.html(textareaContent + '&nbsp;');

		            // Change textarea height if twin plus the height of one line differs more than 3 pixel from textarea height
		            if (Math.abs(cloneTextarea.outerHeight() + lineHeight - mITextarea.outerHeight()) >= 3) {
		            	cloneTextarea.e.setAttribute('setHeight',"true");
		              var goalheight = cloneTextarea.outerHeight();
		              if (goalheight >= maxheight) {
		                setHeightAndOverflow(maxheight, 'auto');
		              } else if (goalheight <= minheight) {
		                setHeightAndOverflow(minheight, 'hidden');
		              } else {
		                setHeightAndOverflow(goalheight, 'hidden');
		              }

		            }
		            cloneTextarea.hide();

		          }

		        }

		        // Opera returns max-height of -1 if not set
		        if (maxheight < 0) {
		          maxheight = Number.MAX_VALUE;
		        }

		        // Append the twin to the DOM
		        // We are going to meassure the height of this, not the textarea.
		        LyteComponent.insertAfter(mITextarea.e,cloneTextarea.e);

		        // Copy the essential styles (attrs) from the textarea to the twin
		        var i = attrs.length;
		        while (i--) {

		          if (attrs[i].toString() === 'width' && mITextarea.css(attrs[i].toString()) === '0px') {
		            setCloneDivWidth();
		          } else {
		            cloneTextarea.css(attrs[i].toString(), mITextarea.css(attrs[i].toString()));
		            // console.log(attrs[i].toString() +"===" + mITextarea.css(attrs[i].toString()))
		          }
		        }

		        updateTextarea(true);

		        //Call setCloneDivWidth function at the end of the resize event so that the changes are available for calculation
		        function callAtTheEndOfResize(){
		        	clearTimeout(mIManager.id);
    				mIManager.id = setTimeout(setCloneDivWidth, 200);
		        }

		        // debugger
		        // Update textarea size on keyup, change, cut and paste
		        mITextarea.e.addEventListener('input', updateTextarea);
		        mITextarea.e.addEventListener('change', updateTextarea);
		        if(!mIManager.bindResize){
		        	window.addEventListener('resize', callAtTheEndOfResize);
		        	mIManager.bindResize = true;
		        }

		    }

		}

		$L.prototype.mentionsInput = function(object) {


			/*--------------------------------  UTILITY FUNCTIONS START  ----------------------------------*/
			var lyteMIList, textarea,
	            lyteMIActiveItem = [],
	            lyteMICollection = [],
	            currentDataQuery = '';


			var resetBuffer = function(){
				mIManager.inputBuffer = [];
			};

			var callOnAdd = function(data,selectedObj){
		    	data.onAdd(selectedObj);
		    };

		    var callonRemove = function(data,removedCollection){
		    	if(data.onRemove){
		    		data.onRemove(removedCollection);
		    	}
		    }

			var filterDuplicateResult = function(rArray,mArray){
				for(var i = 0; i<mArray.length; i++){
					for(var j = 0; j<rArray.length; j++){
						if(mArray[i].id == rArray[j].id){
							rArray.splice(j,1);
						}
					}
				}
				return rArray;
			};

			var modifyNodeContent = function() {
		      var syntaxMessage = textarea.value;

		      textarea._mIData.lyteMICollection.forEach(function(mention) {
		        var textSyntax = textarea._mIData.triggerChar+mIManager.mentionsSyntax(mention);
		        syntaxMessage = syntaxMessage.replace(mention.value, textSyntax);
		      });

		      var mentionText = mIManager.htmlEncode(syntaxMessage);

		      textarea._mIData.lyteMICollection.forEach(function (mention) {
		        var textSyntax = textarea._mIData.triggerChar+mIManager.mentionsSyntax(mention);
		        var textHighlight = "<strong><span>"+mention.value+"</span></strong>";

		        mentionText = mentionText.replace(textSyntax, textHighlight);
		      });

		      mentionText = mentionText.replace(/\n/g, '<br />');
		      mentionText = mentionText.replace(/ {2}/g, '&nbsp; ');

		      textarea._mIData.syntaxMessage = syntaxMessage;
		      $L(textarea._mIData._overlayDiv).html(mentionText);
		    }

		    var updatelyteMICollection = function() {
		      var inputText = textarea.value;
		      lyteMICollection = textarea._mIData.lyteMICollection;
		      var newCollection = [], removedCollection = [];
		      for(var i = 0; i<lyteMICollection.length; i++){
		      	if(lyteMICollection[i].value && inputText.indexOf(lyteMICollection[i].value) != -1 ){
		      		newCollection.push(lyteMICollection[i]);
		      	}
		      	else{
		      		removedCollection.push(lyteMICollection[i]);
		      	}
		      }
		      textarea._mIData.lyteMICollection = newCollection;
		      if(removedCollection.length){
		      	callonRemove(textarea._mIData,removedCollection);
		      }
		    }

			var updateCollection = function(value, id, type) {
		      var currentMessage = textarea.value;

		      // Using a regex to figure out positions
		      var regex = new RegExp("\\" + textarea._mIData.triggerChar + mIManager.currentDataQuery, "gi");
		      regex.exec(currentMessage);

		      var startCaretPosition = regex.lastIndex - currentDataQuery.length - 1;
		      var currentCaretPosition = regex.lastIndex;

		      var start = currentMessage.substr(0, startCaretPosition);
		      var end = currentMessage.substr(currentCaretPosition, currentMessage.length);
		      var startEndIndex = (start + value).length + 1;

		      var updatedMessageText = start + value + end + " ";

		      textarea._mIData.lyteMICollection.push({
		        id    : id,
		        type  : type,
		        value : value
		      });

		      // Cleaning before inserting the value, otherwise auto-complete would be triggered with "old" inputbuffer
		      resetBuffer();
		      mIManager.currentDataQuery = '';
		      hideDropdown();

		      // Mentions - syntax message
		      textarea.value = updatedMessageText;
		      modifyNodeContent();

		      textarea.dispatchEvent(new InputEvent('change'));
		      // Set correct focus and selection
		      textarea.focus();
		      setTimeout( function(){
			      mIManager.setCaratPosition(textarea, startEndIndex);
			  },100);
		      if(textarea._mIData.onAdd){
		      	callOnAdd(textarea._mIData,{
		        id    : id,
		        type  : type,
		        value : value
		      });
		      }
		    }

			var hideDropdown = function(input){
				lyteMIActiveItem = [];
				if(!lyteMIList){
					lyteMIList = input._mIData.lyteMIList;
				}
				$L(lyteMIList).empty();
				lyteMIList.style.height = "auto";
				$L(lyteMIList).removeClass('lyteMIDisplayBlock','lyteMIAddOverflow');
			};

			var getDropdown = function(input){
				return input._mIData.lyteMIList;
			};

			var createLiElement = function(data){
				var ele = mIManager.createElement('li');
				$L(ele).attr('data-display',data[textarea._mIData.searchBy]);
				$L(ele).attr('data-ref-id',data.id + "");
				$L(ele).attr('data-ref-type',data.type);
				var value = mIManager.highlightContent(data[textarea._mIData.searchBy],mIManager.currentDataQuery);
				ele.innerHTML = value;
				return ele;
			};

			var onSelect = function(event) {
		    	var elmTarget = $L(this);
		    	if(!lyteMIList){
		    		lyteMIList = this.closest('.lyteMIDropdown');
		    	}
		    	textarea = lyteMIList._textarea;
		    	updateCollection(elmTarget.attr('data-display'), elmTarget.attr('data-ref-id'), elmTarget.attr('data-ref-type'));
		    	// textarea.dispatchEvent(new InputEvent('change'));

		    	event.stopPropagation();
		        // textarea.setSelectionRange(textarea.value.length, textarea.value.length);
		        // setTimeout( function(){
		        // 	textarea.focus();
		        // }, 100)
		    }


			var onKeyUpOrDown = function(ele){
				if($L('li',lyteMIList).e.length){
					$L('li',lyteMIList).removeClass(textarea._mIData.activeItem);
				}
				$L(ele).addClass(textarea._mIData.activeItem);
				lyteMIActiveItem = [];
		    	lyteMIActiveItem.push(ele);
			};

			var findLastIndex = function(inputBuffer, char){
				var index = inputBuffer.slice().reverse().findIndex(function(x) { return x === char });
				return index >= 0 ? inputBuffer.length - 1 - index : index;
			};

			//Create the dropdown
			var populateDropdown = function(results){
				if(textarea._mIData.wrapper && !textarea._mIData.listAppended){
					var wrapper = textarea.closest(textarea._mIData.wrapper);
					var wrapperOffset = wrapper.getBoundingClientRect();
					// if(!textarea._mIData.listAppended){
						LyteComponent.insertAfter(wrapper, lyteMIList);
						lyteMIList.style.left = wrapperOffset.left + "px";
						lyteMIList.style.right = wrapperOffset.right + "px";
						lyteMIList.style.position = "fixed";
						lyteMIList.style.width = parseInt(wrapperOffset.width) - 2 + "px";
						textarea._mIData.listAppended = true;
					// }
				}
				  $L(lyteMIList).addClass('lyteMIDisplayBlock');

			      if (!results.length) {
			        hideDropdown();
			        return;
			      }

			      $L(lyteMIList).empty();
			      var elmDropDownList = mIManager.createElement('ul');
			      hideDropdown();

			      for(var i = 0; i<results.length; i++){
			      	  var liEle = createLiElement(results[i]);
			      	  liEle.addEventListener('mousedown',onSelect,true);
			          
				      if(textarea._mIData.avatars && results[i].avatar){
				      	  var elmIcon = new Image();
				      	  elmIcon.src = results[i].avatar;
				      	  liEle.prepend(elmIcon);
				      }
				      elmDropDownList.append(liEle);
				      liEle = null;
			      }
			      lyteMIList.append(elmDropDownList);
			      onKeyUpOrDown(elmDropDownList.children[0]);
			      $L(lyteMIList).addClass('lyteMIHide');
			      $L(lyteMIList).addClass('lyteMIDisplayBlock');
			      var listOffset = lyteMIList.getBoundingClientRect();
			      var winH = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
			      if(winH - listOffset.top < listOffset.height){
			      	$L(lyteMIList).height(winH - listOffset.top - 5);
			      	$L(lyteMIList).addClass('lyteMIAddOverflow');
			      	lyteMIList.scrollTop = 0;
			      }
			      $L(lyteMIList).removeClass('lyteMIHide');
			};

			var filterData = function(responseData){
				var mode = textarea._mIData.mode,
					searchBy = textarea._mIData.searchBy,
					query = mIManager.currentDataQuery,
					results = [];
				if(responseData.length)
                {
                   for(var i = 0; i < responseData.length; i++){
                      	switch(mode){
                          	case 'contains' : {
                              	if(responseData[i][searchBy].trim().toLowerCase().indexOf(query.toLowerCase()) >= 0)
                               	  {
                                      results.push(responseData[i]);
                                  }
                              break;    
                           	}
                           	case 'startsWith' : {
                                if(responseData[i][searchBy].trim().toLowerCase().startsWith(query.toLowerCase()))
                                   {
                                      results.push(responseData[i]);
                                   }
                                break;
                           	}
                           	case 'endsWith' : {
                                if(responseData[i][searchBy].trim().toLowerCase().endsWith(query.toLowerCase()))
                                   {
                                        results.push(responseData[i]);
                                   }
                                break;
                           	}
                        }  
                    }

                    populateDropdown(filterDuplicateResult(results,textarea._mIData.lyteMICollection));
                }
			};

			var trigerSearch = function(){
				var query = mIManager.currentDataQuery;
				if (query && query.length && query.length >= textarea._mIData.minChars) {
      				var responseData = textarea._mIData.onDataRequest(query);
      				if(responseData){
  						if( responseData.then ) {
							Promise.resolve( responseData ).then( function( arg ) {
								// arr[ 0 ] = arg
								populateDropdown(arg);
							}, function(e) {
								console.error(e);
							});
						} else {
							filterData(responseData);
						}
      				}
    			}
			};

			var scrollIntoView = function(parent, element, move ) {
				var offsetTop = element.offsetTop,
				scrollT = parent.scrollTop,
				height = parent.getBoundingClientRect().height,
				elementHeight = element.getBoundingClientRect().height;

				if( move === 'down' 
					&& scrollT + height < offsetTop + elementHeight 
				) {
					parent.scrollTop = parent.scrollTop + offsetTop + elementHeight - ( height + scrollT );
				}
				else if( move === 'up' 
						&& offsetTop < scrollT 
					) {
					parent.scrollTop = offsetTop
				}
			}

			/*--------------------------- UTILITY FUNCTIONS END ----------------------------*/

			/*--------------------------- INITIALIZATION STARTS -------------------------*/

			if(typeof object === "string"){
				if(object === "setMessage"){
					textarea =  this.e.length ? (this.e[0].tagName === "LYTE-INPUT" && this.e[0].ltProp('type') == "textarea" ? this.e[0].querySelector('textarea') : this.e[0]) : (this.e.tagName === "LYTE-INPUT" && this.e.ltProp('type') == "textarea" ? this.e.querySelector('textarea') : this.e);
					if(textarea.getAttribute('data-lyte-mentions')){
						if(typeof arguments[1] === "object"){
							// if(!lyteMIList){
							// 	lyteMIList = getDropdown(textarea);
							// }
							var message = arguments[1].message;
							var mentionText = message;
							var collection = arguments[1].collection ? arguments[1].collection : textarea._mIData.onDataRequest();
							var newCollection = [];
							collection.forEach(function(mention){
								var mentionObj = {id : mention.id, value : mention[textarea._mIData.searchBy], type : mention.type};
								var textSyntax = textarea._mIData.triggerChar+mIManager.mentionsSyntax(mentionObj);
		        
								if(message.indexOf(textSyntax) != -1){
									newCollection.push(mentionObj);
									var textHighlight = "<strong><span>"+mentionObj.value+"</span></strong>";
									message = message.replace(textSyntax,mentionObj.value);
									mentionText = mentionText.replace(textSyntax,textHighlight);
								}
							});

							mentionText = mentionText.replace(/\n/g, '<br />');
						    mentionText = mentionText.replace(/ {2}/g, '&nbsp; ');
						    textarea.value = message;
						    textarea._mIData.syntaxMessage = arguments[1].message;
						    $L(textarea._mIData._overlayDiv).html(mentionText);
						    textarea._mIData.lyteMICollection = newCollection;
							// modifyNodeContent();
							textarea.dispatchEvent(new InputEvent('change'));
							textarea.focus();	
						}
						else{
							console.error("Inappropriate arguments passed. Please pass an object containing a message and a collection to be set.");
							return null;
						}
					}
					else{
						console.error(this + " is not Initialized using lyte-mentions plugin.Please check.");
						return null;
					}
				}

				if(object === "getMessage"){
					textarea =  this.e.length ? (this.e[0].tagName === "LYTE-INPUT" && this.e[0].ltProp('type') == "textarea" ? this.e[0].querySelector('textarea') : this.e[0]) : (this.e.tagName === "LYTE-INPUT" && this.e.ltProp('type') == "textarea" ? this.e.querySelector('textarea') : this.e);
					if(textarea.getAttribute('data-lyte-mentions')){
						return textarea._mIData.syntaxMessage;
					}
					else{
						console.error(this + " is not Initialized using lyte-mentions plugin.Please check.");
						return null;
					}
				}

				if(object === "getCollection"){
					textarea =  this.e.length ? (this.e[0].tagName === "LYTE-INPUT" && this.e[0].ltProp('type') == "textarea" ? this.e[0].querySelector('textarea') : this.e[0]) : (this.e.tagName === "LYTE-INPUT" && this.e.ltProp('type') == "textarea" ? this.e.querySelector('textarea') : this.e);
					if(textarea.getAttribute('data-lyte-mentions')){
						return textarea._mIData.lyteMICollection;
					}
					else{
						console.error(this + " is not Initialized using lyte-mentions plugin.Please check.");
						return null;
					}
				}

				if(object === "destroy"){
					textarea =  this.e.length ? (this.e[0].tagName === "LYTE-INPUT" && this.e[0].ltProp('type') == "textarea" ? this.e[0].querySelector('textarea') : this.e[0]) : (this.e.tagName === "LYTE-INPUT" && this.e.ltProp('type') == "textarea" ? this.e.querySelector('textarea') : this.e);
					if(textarea.getAttribute('data-lyte-mentions')){
						var wrapper = textarea.parentElement;
						LyteComponent.insertBefore(wrapper,textarea);
						textarea._mIData.lyteMIList.remove();
						textarea._mIData = null;
						wrapper.remove();
					}
					else{
						console.error(this + " is not Initialized using lyte-mentions plugin.Please check.");
						return null;
					}
				}

				if(object === "reset"){
					textarea =  this.e.length ? (this.e[0].tagName === "LYTE-INPUT" && this.e[0].ltProp('type') == "textarea" ? this.e[0].querySelector('textarea') : this.e[0]) : (this.e.tagName === "LYTE-INPUT" && this.e.ltProp('type') == "textarea" ? this.e.querySelector('textarea') : this.e);
					if(textarea.getAttribute('data-lyte-mentions')){
						// if(!lyteMIList){
						// 	lyteMIList = getDropdown(textarea);
						// }
						textarea.value = "";
						modifyNodeContent();
						updatelyteMICollection();
						textarea.dispatchEvent(new InputEvent('change'));
					}
					else{
						console.error(this + " is not Initialized using lyte-mentions plugin.Please check.");
						return null;
					}
				}

				return true;
			}
			var data = object ? object : {};
			var element;

			if(this.e.length){
				var elemArray = this.e;
				for(var i=0; i<elemArray.length; i++){
					if(elemArray[i].tagName == "LYTE-INPUT" && elemArray[i].ltProp('type') == "textarea"){
						var elem = elemArray[i].querySelector('textarea');
						var copyData = Object.assign({},data);
						copyData.isLyteInput = true;
						// elem.setAttribute('data-lyte-mentions',true);
						$L(elem).mentionsInput(Object.assign({},copyData));
					}
					else{
						// elemArray[i].setAttribute('data-lyte-mentions',true);
						$L(elemArray[i]).mentionsInput(Object.assign({},data));
					}
					
				}
				return;
			}
			else{
				if(this.e.tagName == "LYTE-INPUT" && this.e.ltProp('type') == "textarea"){
					element = this.e.querySelector('textarea');
					data.isLyteInput = true;
				}
				else{
					element = this.e;
				}
			}
			element.setAttribute('data-lyte-mentions',true);
			//Initialize values
			// data._textarea = element;
			data.mode = data.mode ? data.mode : "contains"; //contains,startsWith, endsWith
			data.activeItem = data.activeItem ? data.activeItem : "lyteMIActive";
			data.triggerChar = data.triggerChar ? data.triggerChar : '@';
			data.minChars = data.minChars == undefined ? 1 : parseInt(data.minChars);
			data.avatars = data.avatars == undefined ? true : data.avatars;
			data.searchBy = data.searchBy ? data.searchBy : "name";
			data.lyteMICollection = [];

			var clickEvent = function(event){
				resetBuffer();
			};

			var inputEvent = function(event){
				textarea = this;
				lyteMIList = textarea._mIData.lyteMIList;
				 modifyNodeContent();
	        	 updatelyteMICollection();
	        	 hideDropdown();

	        	 var triggerCharIndex = findLastIndex(mIManager.inputBuffer, textarea._mIData.triggerChar); //Returns the last match of the triggerChar in the inputBuffer
	        	 if (triggerCharIndex > -1) { //If the triggerChar is present in the inputBuffer array
	        	     currentDataQuery = mIManager.inputBuffer.slice(triggerCharIndex + 1).join(''); //Gets the currentDataQuery
	        	     mIManager.currentDataQuery = mIManager.rtrim(currentDataQuery); //Deletes the whitespaces
	        	     trigerSearch(); //Invoking the function trigerSearch
	        	 }
			};

			var keypressEvent = function(event){
				var typedValue = String.fromCharCode(event.which || event.keyCode);
      			mIManager.inputBuffer.push(typedValue);
			};

			var keydownEvent = function(event){
				textarea = this;
				var KEY = mIManager.KEY;
				// This also matches HOME/END on OSX which is CMD+LEFT, CMD+RIGHT
	            if (event.keyCode === KEY.LEFT || event.keyCode === KEY.RIGHT || event.keyCode === KEY.HOME || event.keyCode === KEY.END) {
	                // Defer execution to ensure carat pos has changed after HOME/END keys then call the resetBuffer function
	                // _.defer(resetBuffer);
	                postpone(resetBuffer);

	                return;
	            }

	            //If the key pressed was the backspace
	            if (event.keyCode === KEY.BACKSPACE) {
	                mIManager.inputBuffer = mIManager.inputBuffer.slice(0, -1 + mIManager.inputBuffer.length); // Can't use splice, not available in IE
	                return;
	            }

	            //If the lyteMIList is hidden
	            if(!lyteMIList){
	            	lyteMIList = textarea._mIData.lyteMIList;
	            }
	            if ($L(lyteMIList).css("display") != "block") {
	                return ;
	            }

	            switch (event.keyCode) {
	                case KEY.UP: //If the key pressed was UP or DOWN
	                case KEY.DOWN:
	                    var lyteMICurrentItem = null, move;
	                    if (event.keyCode === KEY.DOWN) { //If the key pressed was DOWN
	                        if (lyteMIActiveItem && lyteMIActiveItem.length) { //If lyteMIActiveItem exits
	                            lyteMICurrentItem = lyteMIActiveItem[0].nextElementSibling; //Gets the next li element in the list
	                        	move = "down";
	                        } else {
	                            lyteMICurrentItem = $L('li',lyteMIList).e[0]; //Gets the first li element found
	                        	move = "up";
	                        }
	                    } else {
	                        lyteMICurrentItem = lyteMIActiveItem[0].previousElementSibling; //The key pressed was UP and gets the previous li element
	                    	move = "up";
	                    }
	                    if (lyteMICurrentItem) {
	                        onKeyUpOrDown(lyteMICurrentItem);
	                        scrollIntoView(lyteMIList, lyteMICurrentItem, move);
	                    }
	                    event.stopPropagation();
	                    break;
	                case KEY.RETURN: //If the key pressed was RETURN or TAB
	                case KEY.TAB:
	                    if (lyteMIActiveItem && lyteMIActiveItem.length) {
				            // lyteMIActiveItem[0].click();
				            lyteMIActiveItem[0].dispatchEvent(new Event('mousedown'));
				            event.preventDefault();
				            event.stopPropagation();
				          }
	                	break;
	            }

	            return;
			};

			var blurEvent = function(event){
				hideDropdown(event.target);
			};

			/*---------------- BIND EVENTS AND DATA ------------------*/

			data.lyteMIList = mIManager.init(element);
			data.lyteMIList._textarea = element;
			data._overlayDiv = element.previousElementSibling.children[0];
			if (!data.isLyteInput) {
				$L(element.previousElementSibling).addClass('lyteMentionsNormalTextarea');
			}
	        element._mIData = data;
	    	// $L(element).bind('keydown', keydownEvent);
	    	// $L(element).bind('keypress', keypressEvent);
	    	// $L(element).bind('input', inputEvent);
	    	// $L(element).bind('click', clickEvent);
	    	// $L(element).bind('blur', blurEvent);
	    	element.addEventListener('keydown', keydownEvent);
	    	element.addEventListener('keypress', keypressEvent);
	    	element.addEventListener('input', inputEvent);
	    	element.addEventListener('click', clickEvent);
	    	element.addEventListener('blur', blurEvent);
	    	/*---------------------------------------------------------*/

	    	/*--------------------------- INITIALIZATION ENDS -------------------------*/


		}
		
	}

})( window );
