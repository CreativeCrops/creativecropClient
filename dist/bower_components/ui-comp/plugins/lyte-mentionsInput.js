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
		          if (cloneTextarea.width() !== curatedWidth) {
		            cloneTextarea.css({'width': curatedWidth + 'px'});

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

		        
		        // debugger
		        // Update textarea size on keyup, change, cut and paste
		        mITextarea.e.addEventListener('input', updateTextarea);
		        mITextarea.e.addEventListener('change', updateTextarea);
		        document.addEventListener('resize', setCloneDivWidth);

		    }

		}

		$L.prototype.mentionsInput = function(object) {


			/*--------------------------------  UTILITY FUNCTIONS START  ----------------------------------*/
			var lyteMIList,
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
		      var syntaxMessage = lyteMIList._mIData._inputDiv.value;

		      lyteMIList._mIData.lyteMICollection.forEach(function(mention) {
		        var textSyntax = lyteMIList._mIData.triggerChar+mIManager.mentionsSyntax(mention);
		        syntaxMessage = syntaxMessage.replace(mention.value, textSyntax);
		      });

		      var mentionText = mIManager.htmlEncode(syntaxMessage);

		      lyteMIList._mIData.lyteMICollection.forEach(function (mention) {
		        var textSyntax = lyteMIList._mIData.triggerChar+mIManager.mentionsSyntax(mention);
		        var textHighlight = "<strong><span>"+mention.value+"</span></strong>";

		        mentionText = mentionText.replace(textSyntax, textHighlight);
		      });

		      mentionText = mentionText.replace(/\n/g, '<br />');
		      mentionText = mentionText.replace(/ {2}/g, '&nbsp; ');

		      lyteMIList._mIData.syntaxMessage = syntaxMessage;
		      $L(lyteMIList._mIData._overlayDiv).html(mentionText);
		    }

		    var updatelyteMICollection = function() {
		      var inputText = lyteMIList._mIData._inputDiv.value;
		      lyteMICollection = lyteMIList._mIData.lyteMICollection;
		      var newCollection = [], removedCollection = [];
		      for(var i = 0; i<lyteMICollection.length; i++){
		      	if(lyteMICollection[i].value && inputText.indexOf(lyteMICollection[i].value) != -1 ){
		      		newCollection.push(lyteMICollection[i]);
		      	}
		      	else{
		      		removedCollection.push(lyteMICollection[i]);
		      	}
		      }
		      lyteMIList._mIData.lyteMICollection = newCollection;
		      if(removedCollection.length){
		      	callonRemove(lyteMIList._mIData,removedCollection);
		      }
		    }

			var updateCollection = function(value, id, type) {
		      var currentMessage = lyteMIList._mIData._inputDiv.value;

		      // Using a regex to figure out positions
		      var regex = new RegExp("\\" + lyteMIList._mIData.triggerChar + mIManager.currentDataQuery, "gi");
		      regex.exec(currentMessage);

		      var startCaretPosition = regex.lastIndex - currentDataQuery.length - 1;
		      var currentCaretPosition = regex.lastIndex;

		      var start = currentMessage.substr(0, startCaretPosition);
		      var end = currentMessage.substr(currentCaretPosition, currentMessage.length);
		      var startEndIndex = (start + value).length;

		      var updatedMessageText = start + value + end;

		      lyteMIList._mIData.lyteMICollection.push({
		        id    : id,
		        type  : type,
		        value : value
		      });

		      // Cleaning before inserting the value, otherwise auto-complete would be triggered with "old" inputbuffer
		      resetBuffer();
		      mIManager.currentDataQuery = '';
		      hideDropdown();

		      // Mentions - syntax message
		      lyteMIList._mIData._inputDiv.value = updatedMessageText;
		      modifyNodeContent();

		      // Set correct focus and selection
		      lyteMIList._mIData._inputDiv.focus();
		      mIManager.setCaratPosition(lyteMIList._mIData._inputDiv, startEndIndex);
		      if(lyteMIList._mIData.onAdd){
		      	callOnAdd(lyteMIList._mIData,{
		        id    : id,
		        type  : type,
		        value : value
		      });
		      }
		    }

			var hideDropdown = function(input){
				lyteMIActiveItem = [];
				if(!lyteMIList){
					lyteMIList = getDropdown(input);
				}
				$L(lyteMIList).empty();
				$L(lyteMIList).removeClass('lyteMIDisplayBlock');
			};

			var getDropdown = function(input){
				return input.nextElementSibling.nextElementSibling;
			};

			var createLiElement = function(data){
				var ele = mIManager.createElement('li');
				$L(ele).attr('data-display',data[lyteMIList._mIData.searchBy]);
				$L(ele).attr('data-ref-id',data.id + "");
				$L(ele).attr('data-ref-type',data.type);
				var value = mIManager.highlightContent(data[lyteMIList._mIData.searchBy],mIManager.currentDataQuery);
				ele.innerHTML = value;
				return ele;
			};

			var onSelect = function(event) {
		    	var elmTarget = $L(this);
		    	if(!lyteMIList){
		    		lyteMIList = this.closest('.lyteMIDropdown');
		    	}

		    	updateCollection(elmTarget.attr('data-display'), elmTarget.attr('data-ref-id'), elmTarget.attr('data-ref-type'));
		    	lyteMIList._mIData._inputDiv.dispatchEvent(new InputEvent('change'));
		    	event.stopPropagation();
		    }


			var onKeyUpOrDown = function(ele){
				if($L('li',lyteMIList).e.length){
					$L('li',lyteMIList).removeClass(lyteMIList._mIData.activeItem);
				}
				$L(ele).addClass(lyteMIList._mIData.activeItem);
				lyteMIActiveItem = [];
		    	lyteMIActiveItem.push(ele);
			};

			var findLastIndex = function(inputBuffer, char){
				var index = inputBuffer.slice().reverse().findIndex(function(x) { return x === char });
				return index >= 0 ? inputBuffer.length - 1 - index : index;
			};

			//Create the dropdown
			var populateDropdown = function(results){
				
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
			      	  liEle.addEventListener('click',onSelect);
			          
				      if(lyteMIList._mIData.avatars && results[i].avatar){
				      	  var elmIcon = new Image();
				      	  elmIcon.src = results[i].avatar;
				      	  liEle.prepend(elmIcon);
				      }
				      elmDropDownList.append(liEle);
				      liEle = null;
			      }
			      lyteMIList.append(elmDropDownList);
			      onKeyUpOrDown(elmDropDownList.children[0]);
			      $L(lyteMIList).addClass('lyteMIDisplayBlock');
			};

			var filterData = function(responseData){
				var mode = lyteMIList._mIData.mode,
					searchBy = lyteMIList._mIData.searchBy,
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

                    populateDropdown(filterDuplicateResult(results,lyteMIList._mIData.lyteMICollection));
                }
			};

			var trigerSearch = function(){
				var query = mIManager.currentDataQuery;
				if (query && query.length && query.length >= lyteMIList._mIData.minChars) {
      				var responseData = lyteMIList._mIData.onDataRequest(query);
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

			/*--------------------------- UTILITY FUNCTIONS END ----------------------------*/

			/*--------------------------- INITIALIZATION STARTS -------------------------*/

			if(typeof object === "string"){
				if(object === "setMessage"){
					var textarea =  this.e.length ? (this.e[0].tagName === "LYTE-INPUT" && this.e[0].ltProp('type') == "textarea" ? this.e[0].querySelector('textarea') : this.e[0]) : (this.e.tagName === "LYTE-INPUT" && this.e.ltProp('type') == "textarea" ? this.e.querySelector('textarea') : this.e);
					if(textarea.getAttribute('data-lyte-mentions')){
						if(typeof arguments[1] === "object"){
							if(!lyteMIList){
								lyteMIList = getDropdown(textarea);
							}
							var message = arguments[1].message;
							var mentionText = message;
							var collection = arguments[1].collection ? arguments[1].collection : lyteMIList._mIData.onDataRequest();
							var newCollection = [];
							collection.forEach(function(mention){
								var mentionObj = {id : mention.id, value : mention[lyteMIList._mIData.searchBy], type : mention.type};
								var textSyntax = lyteMIList._mIData.triggerChar+mIManager.mentionsSyntax(mentionObj);
		        
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
						    lyteMIList._mIData.syntaxMessage = arguments[1].message;
						    $L(lyteMIList._mIData._overlayDiv).html(mentionText);
						    lyteMIList._mIData.lyteMICollection = newCollection;
							// modifyNodeContent();
							textarea.dispatchEvent(new InputEvent('change'));
							textarea.focus();	
						}
						else{
							console.error("Inappropriate arguments passed. Please pass an object containing a message and a collection to be set.");
						}
					}
					else{
						console.error(this + " is not Initialized using lyte-mentions plugin.Please check.");
					}
				}

				if(object === "getMessage"){
					var textarea =  this.e.length ? (this.e[0].tagName === "LYTE-INPUT" && this.e[0].ltProp('type') == "textarea" ? this.e[0].querySelector('textarea') : this.e[0]) : (this.e.tagName === "LYTE-INPUT" && this.e.ltProp('type') == "textarea" ? this.e.querySelector('textarea') : this.e);
					if(textarea.getAttribute('data-lyte-mentions')){
						return getDropdown(textarea)._mIData.syntaxMessage;
					}
					else{
						console.error(this + " is not Initialized using lyte-mentions plugin.Please check.");
					}
				}

				if(object === "getCollection"){
					var textarea =  this.e.length ? (this.e[0].tagName === "LYTE-INPUT" && this.e[0].ltProp('type') == "textarea" ? this.e[0].querySelector('textarea') : this.e[0]) : (this.e.tagName === "LYTE-INPUT" && this.e.ltProp('type') == "textarea" ? this.e.querySelector('textarea') : this.e);
					if(textarea.getAttribute('data-lyte-mentions')){
						return getDropdown(textarea)._mIData.lyteMICollection;
					}
					else{
						console.error(this + " is not Initialized using lyte-mentions plugin.Please check.");
					}
				}

				if(object === "destroy"){
					var textarea =  this.e.length ? (this.e[0].tagName === "LYTE-INPUT" && this.e[0].ltProp('type') == "textarea" ? this.e[0].querySelector('textarea') : this.e[0]) : (this.e.tagName === "LYTE-INPUT" && this.e.ltProp('type') == "textarea" ? this.e.querySelector('textarea') : this.e);
					if(textarea.getAttribute('data-lyte-mentions')){
						var wrapper = textarea.parentElement;
						LyteComponent.insertBefore(wrapper,textarea);
						wrapper.remove();
					}
					else{
						console.error(this + " is not Initialized using lyte-mentions plugin.Please check.");
					}
				}

				if(object === "reset"){
					var textarea =  this.e.length ? (this.e[0].tagName === "LYTE-INPUT" && this.e[0].ltProp('type') == "textarea" ? this.e[0].querySelector('textarea') : this.e[0]) : (this.e.tagName === "LYTE-INPUT" && this.e.ltProp('type') == "textarea" ? this.e.querySelector('textarea') : this.e);
					if(textarea.getAttribute('data-lyte-mentions')){
						if(!lyteMIList){
							lyteMIList = getDropdown(textarea);
						}
						textarea.value = "";
						modifyNodeContent();
						updatelyteMICollection();
						textarea.dispatchEvent(new InputEvent('change'));
					}
					else{
						console.error(this + " is not Initialized using lyte-mentions plugin.Please check.");
					}
				}

				return;
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
			data._inputDiv = element;
			data.mode = data.mode ? data.mode : "contains"; //contains,startsWith, endsWith
			data.activeItem = data.activeItem ? data.activeItem : "lyteMIActive";
			data.triggerChar = data.triggerChar ? data.triggerChar : '@';
			data.minChars = data.minChars ? data.minChars : 1;
			data.avatars = data.avatars ? data.avatars : true;
			data.searchBy = data.searchBy ? data.searchBy : "name";
			data.lyteMICollection = [];

			var clickEvent = function(event){
				resetBuffer();
			};

			var inputEvent = function(event){
				if(!lyteMIList){
					lyteMIList = getDropdown(this);
				}
				 modifyNodeContent();
	        	 updatelyteMICollection();
	        	 hideDropdown();

	        	 if(!lyteMIList){
	        	 	lyteMIList = getDropdown(event.target);
	        	 }

	        	 var triggerCharIndex = findLastIndex(mIManager.inputBuffer, lyteMIList._mIData.triggerChar); //Returns the last match of the triggerChar in the inputBuffer
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
	            	lyteMIList = getDropdown(event.target);
	            }
	            if (!lyteMIList.offsetParent) {
	                return ;
	            }

	            switch (event.keyCode) {
	                case KEY.UP: //If the key pressed was UP or DOWN
	                case KEY.DOWN:
	                    var lyteMICurrentItem = null;
	                    if (event.keyCode === KEY.DOWN) { //If the key pressed was DOWN
	                        if (lyteMIActiveItem && lyteMIActiveItem.length) { //If lyteMIActiveItem exits
	                            lyteMICurrentItem = lyteMIActiveItem[0].nextElementSibling; //Gets the next li element in the list
	                        } else {
	                            lyteMICurrentItem = $L('li',lyteMIList).e[0]; //Gets the first li element found
	                        }
	                    } else {
	                        lyteMICurrentItem = lyteMIActiveItem[0].previousElementSibling; //The key pressed was UP and gets the previous li element
	                    }
	                    if (lyteMICurrentItem) {
	                        onKeyUpOrDown(lyteMICurrentItem);
	                    }
	                    event.stopPropagation();
	                    break;
	                case KEY.RETURN: //If the key pressed was RETURN or TAB
	                case KEY.TAB:
	                    if (lyteMIActiveItem && lyteMIActiveItem.length) {
				            lyteMIActiveItem[0].click();
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

			lyteMIList = mIManager.init(element);
			data._overlayDiv = element.previousElementSibling.children[0];
			if (!data.isLyteInput) {
				$L(element.previousElementSibling).addClass('lyteMentionsNormalTextarea');
			}
	        lyteMIList._mIData = data;
	    	$L(element).bind('keydown', keydownEvent);
	    	$L(element).bind('keypress', keypressEvent);
	    	$L(element).bind('input', inputEvent);
	    	$L(element).bind('click', clickEvent);
	    	$L(element).bind('blur', blurEvent);
	    	/*---------------------------------------------------------*/

	    	/*--------------------------- INITIALIZATION ENDS -------------------------*/


		}
		
	}

})( window );
