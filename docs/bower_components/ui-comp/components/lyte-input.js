Lyte.Component.register("lyte-input",{
_template:"<template tag-name=\"lyte-input\">     <template is=\"switch\" value=\"{{ltPropType}}\">       <template case=\"password\">              <template is=\"if\" value=\"{{ltPropLabel}}\"><template case=\"true\">                    <label for=\"{{ltPropId}}\" class=\"lyteLabel\">{{ltPropLabel}}</label>               </template></template>             <div class=\"lyteField\" style=\"{{ltPropWrapperStyle}}\">                 <input pattern=\"{{ltPropPattern}}\" tabindex=\"{{ltPropTabIndex}}\" type=\"{{ltPropType}}\" value=\"{{lbind(ltPropValue)}}\" id=\"{{ltPropId}}\" class=\"{{ltPropClass}}\" maxlength=\"{{ltPropMaxlength}}\" name=\"{{ltPropName}}\" placeholder=\"{{ltPropPlaceholder}}\" autocomplete=\"{{ltPropAutocomplete}}\" autofocus=\"{{ltPropAutofocus}}\" disabled=\"{{ltPropDisabled}}\" style=\"{{ltPropStyle}}\" readonly=\"{{ltPropReadonly}}\" onfocus=\"{{action('focusClass')}}\" onblur=\"{{action('blurThrow', event)}}\" onkeyup=\"{{action('keyup', event)}}\" title=\"{{ltPropInputTitle}}\">               </div>         </template>        <template case=\"number\">            <template is=\"if\" value=\"{{ltPropLabel}}\"><template case=\"true\">                  <label for=\"{{ltPropId}}\" class=\"lyteLabel\">{{ltPropLabel}}</label>              </template></template>              <div class=\"lyteField\" style=\"{{ltPropWrapperStyle}}\">                 <input pattern=\"{{ltPropPattern}}\" tabindex=\"{{ltPropTabIndex}}\" type=\"number\" value=\"{{lbind(ltPropValue)}}\" id=\"{{ltPropId}}\" class=\"{{ltPropClass}}\" maxlength=\"{{ltPropMaxlength}}\" name=\"{{ltPropName}}\" placeholder=\"{{ltPropPlaceholder}}\" autocomplete=\"{{ltPropAutocomplete}}\" autofocus=\"{{ltPropAutofocus}}\" disabled=\"{{ltPropDisabled}}\" readonly=\"{{ltPropReadonly}}\" style=\"{{ltPropStyle}}\" onfocus=\"{{action('focusClass')}}\" onblur=\"{{action('blurThrow', event)}}\" onkeyup=\"{{action('keyup', event)}}\" step=\"{{ltPropStep}}\" max=\"{{ltPropMax}}\" min=\"{{ltPropMin}}\" title=\"{{ltPropInputTitle}}\">               </div>         </template>                                                                                     <template case=\"textarea\">                <template is=\"if\" value=\"{{ltPropLabel}}\"><template case=\"true\">                     <label for=\"{{ltPropId}}\" class=\"lyteLabel\">{{ltPropLabel}}</label>                </template></template>                <div class=\"lyteField\" style=\"{{ltPropWrapperStyle}}\">                  <textarea autocomplete=\"{{ltPropAutocomplete}}\" pattern=\"{{ltPropPattern}}\" tabindex=\"{{ltPropTabIndex}}\" id=\"{{ltPropId}}\" class=\"{{ltPropClass}}\" value=\"{{lbind(ltPropValue)}}\" rows=\"{{ltPropRows}}\" cols=\"{{ltPropCols}}\" maxlength=\"{{ltPropMaxlength}}\" name=\"{{ltPropName}}\" placeholder=\"{{ltPropPlaceholder}}\" autofocus=\"{{ltPropAutofocus}}\" disabled=\"{{ltPropDisabled}}\" readonly=\"{{ltPropReadonly}}\" style=\"{{ltPropStyle}}\" onfocus=\"{{action('focusClass')}}\" onblur=\"{{action('blurThrow', event)}}\" onkeyup=\"{{action('keyup', event)}}\" title=\"{{ltPropInputTitle}}\"></textarea>                   <template is=\"if\" value=\"{{resize}}\"><template case=\"true\">                    <span class=\"lyteTextareaResize\"></span>                      </template></template>              </div>             </template>          <template case=\"date\">              <template is=\"if\" value=\"{{ltPropLabel}}\"><template case=\"true\">                  <label for=\"{{ltPropId}}\" class=\"lyteLabel\">{{ltPropLabel}}</label>              </template></template>                <div class=\"lyteField\" style=\"{{ltPropWrapperStyle}}\">                 <input pattern=\"{{ltPropPattern}}\" tabindex=\"{{ltPropTabIndex}}\" type=\"text\" id=\"{{ltPropId}}\" class=\"{{ltPropClass}}\" name=\"{{ltPropName}}\" placeholder=\"{{ltPropPlaceholder}}\" autocomplete=\"{{ltPropAutocomplete}}\" value=\"{{lbind(ltPropCurrentDate)}}\" autofocus=\"{{ltPropAutofocus}}\" disabled=\"{{ltPropDisabled}}\" readonly=\"{{ltPropReadonly}}\" onkeyup=\"{{action('keyup', event)}}\" onkeydown=\"{{action('calendarKeydown', event, this)}}\" onclick=\"{{action('calendarClick', event, this)}}\" onfocus=\"{{action('showcalendar', event, this)}}\" onblur=\"{{action('blurThrow', event)}}\" onfocusout=\"{{action('calFocusout')}}\" style=\"{{ltPropStyle}}\" title=\"{{ltPropInputTitle}}\">              </div>            <lyte-wormhole>                  <template is=\"registerYield\" yield-name=\"lyte-content\">                      <div id=\"lyteCalendar\" class=\"lyteCalendarHidden\" style=\"position: absolute;z-index: 1000;\">                          <lyte-calendar lt-prop-fill-rows=\"{{ltPropFillRows}}\" lt-prop-number-of-rows=\"{{ltPropNumberOfRows}}\" lt-prop-yield=\"{{ltPropYield}}\" lt-prop-format=\"{{ltPropFormat}}\" lt-prop-end-date=\"{{lbind(ltPropEndDate)}}\" lt-prop-start-date=\"{{lbind(ltPropStartDate)}}\" lt-prop-current-date=\"{{lbind(ltPropCurrentDate)}}\" lt-prop-year=\"{{lbind(ltPropYear)}}\" lt-prop-month-header=\"{{lbind(ltPropMonthHeader)}}\" on-date-selected=\"{{method('on-dateselected')}}\" lt-prop-min-date=\"{{lbind(ltPropMinDate)}}\" lt-prop-max-date=\"{{lbind(ltPropMaxDate)}}\" lt-prop-start-week-day=\"{{lbind(ltPropStartWeekDay)}}\">                             <template is=\"if\" value=\"{{ltPropYield}}\"><template case=\"true\">                                 <template is=\"registerYield\" yield-name=\"footer\">                                    <lyte-yield yield-name=\"footer\"></lyte-yield>                                </template>                             </template></template>                             </lyte-calendar>                       </div>                   </template>          </lyte-wormhole>          </template>         <template case=\"datetime\">              <template is=\"if\" value=\"{{ltPropLabel}}\"><template case=\"true\">                  <label for=\"{{ltPropId}}\" class=\"lyteLabel\">{{ltPropLabel}}</label>              </template></template>                <div class=\"lyteField\" style=\"{{ltPropWrapperStyle}}\">                 <input tabindex=\"{{ltPropTabIndex}}\" type=\"text\" id=\"date\" placeholder=\"{{ltPropPlaceholder}}\" value=\"{{lbind(ltPropCurrentDate)}}\" onkeyup=\"{{action('keyup', event)}}\" onkeydown=\"{{action('calendarKeydown', event, this)}}\" onclick=\"{{action('calendarClick', event, this)}}\" onfocus=\"{{action('showcalendar', event, this)}}\" onblur=\"{{action('blurThrow', event)}}\" onfocusout=\"{{action('calFocusout')}}\">                 <input tabindex=\"{{ltPropTabIndex}}\" type=\"text\" value=\"{{ltPropDefaultTime}}\" id=\"time\" onblur=\"{{action('timeBlur', event, this)}}\" onfocus=\"{{action('timeFocus', event, this)}}\" onkeydown=\"{{action('timeKeydown', event, this)}}\" onclick=\"{{action('timeClick', event, this)}}\" style=\"{{ltPropStyle}}\">              </div>              <lyte-wormhole>                    <template is=\"registerYield\" yield-name=\"lyte-content\">                        <div id=\"lyteCalendar\" class=\"lyteCalendarHidden\" style=\"position: absolute;z-index: 1000;\">                            <lyte-calendar lt-prop-fill-rows=\"{{ltPropFillRows}}\" lt-prop-number-of-rows=\"{{ltPropNumberOfRows}}\" lt-prop-yield=\"{{ltPropYield}}\" lt-prop-format=\"{{ltPropFormat}}\" lt-prop-end-date=\"{{lbind(ltPropEndDate)}}\" lt-prop-start-date=\"{{lbind(ltPropStartDate)}}\" lt-prop-current-date=\"{{lbind(ltPropCurrentDate)}}\" lt-prop-year=\"{{lbind(ltPropYear)}}\" lt-prop-month-header=\"{{lbind(ltPropMonthHeader)}}\" on-date-selected=\"{{method('on-dateselected')}}\" lt-prop-min-date=\"{{lbind(ltPropMinDate)}}\" lt-prop-max-date=\"{{lbind(ltPropMaxDate)}}\" lt-prop-start-week-day=\"{{lbind(ltPropStartWeekDay)}}\">                               <template is=\"if\" value=\"{{ltPropYield}}\"><template case=\"true\">                                   <template is=\"registerYield\" yield-name=\"footer\">                                      <lyte-yield yield-name=\"footer\"></lyte-yield>                                  </template>                               </template></template>                               </lyte-calendar>                         </div>                     </template>            </lyte-wormhole>             <lyte-dropdown style=\"display: none;\" lt-prop-position=\"{{ltPropPosition}}\" lt-prop-yield=\"true\" lt-prop-disabled=\"{{ltPropDropdownDisabled}}\" lt-prop-show=\"{{ltPropDropdownShow}}\" lt-prop-callout=\"{{ltPropDropdownShow}}\" lt-prop-boundary=\"{{ltPropBoundary}}\" lt-prop-freeze=\"{{ltPropDropdownFreeze}}\" on-hide=\"{{method('hide')}}\" on-show=\"{{method('show')}}\" on-before-hide=\"{{method('beforeHide')}}\" on-before-show=\"{{method('beforeShow')}}\" on-option-selected=\"{{method('optionSelected')}}\" on-position-changed=\"{{method('positionChange')}}\" on-scroll=\"{{method('scroll')}}\">               <template is=\"registerYield\" yield-name=\"yield\">                  <lyte-drop-button style=\"display: none;\"></lyte-drop-button>                  <lyte-drop-box id=\"{{ltPropDropdownId}}\" class=\"{{ltPropDropdownClass}}\">                    <lyte-drop-body>                      <template is=\"for\" items=\"{{dropdownData}}\" item=\"item\" index=\"index\">                          <lyte-drop-item data-value=\"{{item.time}}\">                            <template is=\"if\" value=\"{{ltPropYield}}\"><template case=\"true\">                                 <lyte-yield yield-name=\"yield\" item-value=\"{{item}}\"></lyte-yield>                            </template><template case=\"false\">                                <span>{{item.time}}</span>                                <template is=\"if\" value=\"{{ltPropShowInterval}}\"><template case=\"true\">                                   <span style=\"opacity: 0.5;float: right;margin-left: 5px; \">{{item.interval}}</span>                                 </template></template></template></template>                          </lyte-drop-item>                      </template>                    </lyte-drop-body>                  </lyte-drop-box>               </template>             </lyte-dropdown>          </template>         <template case=\"time\">            <template is=\"if\" value=\"{{ltPropLabel}}\"><template case=\"true\">                  <label for=\"{{ltPropId}}\" class=\"lyteLabel\">{{ltPropLabel}}</label>              </template></template>              <div class=\"lyteField\" style=\"{{ltPropWrapperStyle}}\">                 <input tabindex=\"{{ltPropTabIndex}}\" type=\"text\" value=\"{{ltPropDefaultTime}}\" id=\"{{ltPropId}}\" class=\"{{ltPropClass}}\" maxlength=\"{{ltPropMaxlength}}\" name=\"{{ltPropName}}\" placeholder=\"{{ltPropPlaceholder}}\" autocomplete=\"{{ltPropAutocomplete}}\" autofocus=\"{{ltPropAutofocus}}\" disabled=\"{{ltPropDisabled}}\" readonly=\"{{ltPropReadonly}}\" onblur=\"{{action('timeBlur', event, this)}}\" onfocus=\"{{action('timeFocus', event, this)}}\" onkeydown=\"{{action('timeKeydown', event, this)}}\" onclick=\"{{action('timeClick', event, this)}}\" style=\"{{ltPropStyle}}\" title=\"{{ltPropInputTitle}}\">              </div>              <template is=\"if\" value=\"{{ltPropDropdown}}\"><template case=\"true\">                   <lyte-dropdown style=\"display: none;\" lt-prop-position=\"{{ltPropPosition}}\" lt-prop-yield=\"true\" lt-prop-disabled=\"{{ltPropDropdownDisabled}}\" lt-prop-show=\"{{ltPropDropdownShow}}\" lt-prop-callout=\"{{ltPropDropdownShow}}\" lt-prop-boundary=\"{{ltPropBoundary}}\" lt-prop-freeze=\"{{ltPropDropdownFreeze}}\" on-hide=\"{{method('hide')}}\" on-show=\"{{method('show')}}\" on-before-hide=\"{{method('beforeHide')}}\" on-before-show=\"{{method('beforeShow')}}\" on-option-selected=\"{{method('optionSelected')}}\" on-position-changed=\"{{method('positionChange')}}\" on-scroll=\"{{method('scroll')}}\">                     <template is=\"registerYield\" yield-name=\"yield\">                        <lyte-drop-button style=\"display: none;\"></lyte-drop-button>                        <lyte-drop-box id=\"{{ltPropDropdownId}}\" class=\"{{ltPropDropdownClass}}\">                          <lyte-drop-body>                            <template is=\"for\" items=\"{{dropdownData}}\" item=\"item\" index=\"index\">                                <lyte-drop-item data-value=\"{{item.time}}\">                                  <template is=\"if\" value=\"{{ltPropYield}}\"><template case=\"true\">                                       <lyte-yield yield-name=\"yield\" item-value=\"{{item}}\"></lyte-yield>                                  </template><template case=\"false\">                                      <span>{{item.time}}</span>                                      <template is=\"if\" value=\"{{ltPropShowInterval}}\"><template case=\"true\">                                         <span style=\"opacity: 0.5;float: right;margin-left: 5px; \">{{item.interval}}</span>                                       </template></template></template></template>                                </lyte-drop-item>                            </template>                          </lyte-drop-body>                        </lyte-drop-box>                     </template>                   </lyte-dropdown>                </template></template>                </template>         <template default=\"\">              <template is=\"if\" value=\"{{ltPropLabel}}\"><template case=\"true\">                  <label for=\"{{ltPropId}}\" class=\"lyteLabel\">{{ltPropLabel}}</label>              </template></template>                <div class=\"{{if(ifEquals(ltPropAppearance == 'box'), if(ifEquals(ltPropType, 'search'), 'lyteInputBoxSearch lyteField','lyteField'), 'lyteField')}}\" style=\"{{ltPropWrapperStyle}}\">                 <input tabindex=\"{{ltPropTabIndex}}\" type=\"text\" value=\"{{lbind(ltPropValue)}}\" id=\"{{ltPropId}}\" class=\"{{ltPropClass}}\" maxlength=\"{{ltPropMaxlength}}\" name=\"{{ltPropName}}\" placeholder=\"{{ltPropPlaceholder}}\" autocomplete=\"{{ltPropAutocomplete}}\" autofocus=\"{{ltPropAutofocus}}\" disabled=\"{{ltPropDisabled}}\" readonly=\"{{ltPropReadonly}}\" onfocus=\"{{action('focusClass')}}\" onblur=\"{{action('blurThrow', event)}}\" onkeyup=\"{{action('keyup', event)}}\" style=\"{{ltPropStyle}}\" title=\"{{ltPropInputTitle}}\" pattern=\"{{ltPropPattern}}\">                 <template is=\"if\" value=\"{{expHandlers(ltPropType,'==','search')}}\"><template case=\"true\">                    <span class=\"searchIcon\"></span>                </template></template>              </div>          <template is=\"break\"></template></template>           </template></template>",
_dynamicNodes : [{"type":"attr","position":[1]},{"type":"switch","position":[1],"cases":{"password":{"dynamicNodes":[{"type":"attr","position":[1]},{"type":"if","position":[1],"cases":{"true":{"dynamicNodes":[{"type":"attr","position":[1]},{"type":"text","position":[1,0]}]}},"default":{}},{"type":"attr","position":[3],"attr":{"style":{"name":"style","dynamicValue":"ltPropWrapperStyle"}}},{"type":"attr","position":[3,1],"attr":{"style":{"name":"style","dynamicValue":"ltPropStyle"}}}]},"number":{"dynamicNodes":[{"type":"attr","position":[1]},{"type":"if","position":[1],"cases":{"true":{"dynamicNodes":[{"type":"attr","position":[1]},{"type":"text","position":[1,0]}]}},"default":{}},{"type":"attr","position":[3],"attr":{"style":{"name":"style","dynamicValue":"ltPropWrapperStyle"}}},{"type":"attr","position":[3,1],"attr":{"style":{"name":"style","dynamicValue":"ltPropStyle"}}}]},"textarea":{"dynamicNodes":[{"type":"attr","position":[1]},{"type":"if","position":[1],"cases":{"true":{"dynamicNodes":[{"type":"attr","position":[1]},{"type":"text","position":[1,0]}]}},"default":{}},{"type":"attr","position":[3],"attr":{"style":{"name":"style","dynamicValue":"ltPropWrapperStyle"}}},{"type":"attr","position":[3,1],"attr":{"style":{"name":"style","dynamicValue":"ltPropStyle"}}},{"type":"attr","position":[3,3]},{"type":"if","position":[3,3],"cases":{"true":{"dynamicNodes":[]}},"default":{}}]},"date":{"dynamicNodes":[{"type":"attr","position":[1]},{"type":"if","position":[1],"cases":{"true":{"dynamicNodes":[{"type":"attr","position":[1]},{"type":"text","position":[1,0]}]}},"default":{}},{"type":"attr","position":[3],"attr":{"style":{"name":"style","dynamicValue":"ltPropWrapperStyle"}}},{"type":"attr","position":[3,1],"attr":{"style":{"name":"style","dynamicValue":"ltPropStyle"}}},{"type":"registerYield","position":[5,1],"dynamicNodes":[{"type":"attr","position":[1,1]},{"type":"attr","position":[1,1,1]},{"type":"if","position":[1,1,1],"cases":{"true":{"dynamicNodes":[{"type":"registerYield","position":[1],"dynamicNodes":[{"type":"insertYield","position":[1]}]}]}},"default":{}},{"type":"componentDynamic","position":[1,1]}]},{"type":"componentDynamic","position":[5]}]},"datetime":{"dynamicNodes":[{"type":"attr","position":[1]},{"type":"if","position":[1],"cases":{"true":{"dynamicNodes":[{"type":"attr","position":[1]},{"type":"text","position":[1,0]}]}},"default":{}},{"type":"attr","position":[3],"attr":{"style":{"name":"style","dynamicValue":"ltPropWrapperStyle"}}},{"type":"attr","position":[3,1]},{"type":"attr","position":[3,3],"attr":{"style":{"name":"style","dynamicValue":"ltPropStyle"}}},{"type":"registerYield","position":[5,1],"dynamicNodes":[{"type":"attr","position":[1,1]},{"type":"attr","position":[1,1,1]},{"type":"if","position":[1,1,1],"cases":{"true":{"dynamicNodes":[{"type":"registerYield","position":[1],"dynamicNodes":[{"type":"insertYield","position":[1]}]}]}},"default":{}},{"type":"componentDynamic","position":[1,1]}]},{"type":"componentDynamic","position":[5]},{"type":"attr","position":[7]},{"type":"registerYield","position":[7,1],"dynamicNodes":[{"type":"componentDynamic","position":[1]},{"type":"attr","position":[3]},{"type":"attr","position":[3,1,1]},{"type":"for","position":[3,1,1],"dynamicNodes":[{"type":"attr","position":[1]},{"type":"attr","position":[1,1]},{"type":"if","position":[1,1],"cases":{"true":{"dynamicNodes":[{"type":"attr","position":[1]},{"type":"insertYield","position":[1]}]},"false":{"dynamicNodes":[{"type":"text","position":[1,0]},{"type":"attr","position":[3]},{"type":"if","position":[3],"cases":{"true":{"dynamicNodes":[{"type":"text","position":[1,0]}]}},"default":{}}]}},"default":{}},{"type":"componentDynamic","position":[1]}]},{"type":"componentDynamic","position":[3,1]},{"type":"componentDynamic","position":[3]}]},{"type":"componentDynamic","position":[7]}]},"time":{"dynamicNodes":[{"type":"attr","position":[1]},{"type":"if","position":[1],"cases":{"true":{"dynamicNodes":[{"type":"attr","position":[1]},{"type":"text","position":[1,0]}]}},"default":{}},{"type":"attr","position":[3],"attr":{"style":{"name":"style","dynamicValue":"ltPropWrapperStyle"}}},{"type":"attr","position":[3,1],"attr":{"style":{"name":"style","dynamicValue":"ltPropStyle"}}},{"type":"attr","position":[5]},{"type":"if","position":[5],"cases":{"true":{"dynamicNodes":[{"type":"attr","position":[1]},{"type":"registerYield","position":[1,1],"dynamicNodes":[{"type":"componentDynamic","position":[1]},{"type":"attr","position":[3]},{"type":"attr","position":[3,1,1]},{"type":"for","position":[3,1,1],"dynamicNodes":[{"type":"attr","position":[1]},{"type":"attr","position":[1,1]},{"type":"if","position":[1,1],"cases":{"true":{"dynamicNodes":[{"type":"attr","position":[1]},{"type":"insertYield","position":[1]}]},"false":{"dynamicNodes":[{"type":"text","position":[1,0]},{"type":"attr","position":[3]},{"type":"if","position":[3],"cases":{"true":{"dynamicNodes":[{"type":"text","position":[1,0]}]}},"default":{}}]}},"default":{}},{"type":"componentDynamic","position":[1]}]},{"type":"componentDynamic","position":[3,1]},{"type":"componentDynamic","position":[3]}]},{"type":"componentDynamic","position":[1]}]}},"default":{}}]}},"default":{"dynamicNodes":[{"type":"attr","position":[1]},{"type":"if","position":[1],"cases":{"true":{"dynamicNodes":[{"type":"attr","position":[1]},{"type":"text","position":[1,0]}]}},"default":{}},{"type":"attr","position":[3],"attr":{"style":{"name":"style","dynamicValue":"ltPropWrapperStyle"}}},{"type":"attr","position":[3,1],"attr":{"style":{"name":"style","dynamicValue":"ltPropStyle"}}},{"type":"attr","position":[3,3]},{"type":"if","position":[3,3],"cases":{"true":{"dynamicNodes":[]}},"default":{}}]}}],
_observedAttributes :["ltPropDisabled","ltPropAutofocus","ltPropAutocomplete","ltPropMaxlength","ltPropName","ltPropPlaceholder","ltPropReadonly","ltPropValue","ltPropWidth","ltPropTabIndex","ltPropType","ltPropAppearance","ltPropDirection","ltPropLabel","ltPropId","ltPropClass","ltPropText","ltPropStyle","ltPropText","ltPropWrapperStyle","ltPropHeight","ltPropPattern","ltPropInputTitle","ltPropAccept","ltPropMultiple","ltPropRows","ltPropCols","ltPropTextAreaResize","ltPropMax","ltPropMin","ltPropStep","ltPropTimeFormat","ltPropHourInterval","ltPropDefaultTime","ltPropMinuteInterval","ltPropDropdown","ltPropShowInterval","ltPropStartTime","ltPropEndTime","ltPropFillRows","ltPropNumberOfRows","ltPropMinDate","ltPropMaxDate","ltPropStartWeekDay","ltPropMonthHeaderFormat","daysOfWeek","ltPropYear","ltPropFormat","viewDate","ltPropStartDate","ltPropEndDate","ltPropCurrentDate","ltPropMonthHeader","ltPropDropdownDisabled","ltPropDropdownShow","ltPropDropdownCallout","ltPropDropdownFreeze","ltPropPosition","ltPropBoundary","ltPropWheel","ltPropYield","ltPropAutoUpdate","eventListeners","selectedField","endMinute","startMinute","dropdownData","originalData","dateRange","meridian","hour","min","selectedDateField","preventObs","resize","pos"],
	init:function(){ 
		var type = this.getData('ltPropType');
		  // if(type =='file'){
		  // 		if(!this.getData('ltPropId')){
		  // 				this.setData('ltPropId','lyteFile');
		  // 			}	
		  // 	}
		  if( type == 'time' || type == "datetime" ){
		  	this._prevent = true
		  	this.timeInValChange.call(this);
		  	this.startEndTimeObs.call(this);
		  	delete this._prevent;
		  	if(this.getData('ltPropDropdown')){
		  		this.dropdownConstruct();
		  	}
		  }	
		  if( type == 'date' || type == "datetime" ){
		  	this.dateRegexFind();
		  }
		  this.$node.classList.add('lyteInput');
		  this.$node.classList.add('horizontal');
		  if(this.getMethods('beforeRender'))
            {
                this.executeMethod('beforeRender', this.$node);
            }
          this.$node.focus = function(){
          	  var type = this.getData( 'ltPropType' ) == "textarea" ? "textarea" : 'input';
          	  this.$node.querySelector( type ).focus();
          }.bind( this )  
	},

	didConnect:function(){
		   var type = this.getData('ltPropType'), divIdInput= this.$node, lyteLabelDiv= $L('.lyteLabel', this.$node).e[0],lyteFieldDiv= $L('.lyteField', this.$node).e[0]; 
		   if( type == 'date' || type == "datetime" )
		    	{ 
		    		var func = this.calenderClickHide.bind(this)
		    		document.addEventListener('click', func, true);
		    		this.setData('eventListeners.calendar', func);
		    		var func1 = this.scrollFunc.bind(this);
		    		this.setData('eventListeners.scroll', func1);
		    		window.addEventListener('scroll', func1, true);
		    		window.addEventListener('resize', func1, true);
				}
			// if(type=='file'){
			//   	if(this.getData('ltPropMultiple')==false){
			//  			$L('input',this.$node).e[0].removeAtribute('multiple');
		 // 			}
		 // 		$L('input',this.$node).e[0].style.display="none";	
		 // 	}
		 	if(type == 'time' || type == "datetime" ){
	 			if(this.getData('ltPropDropdown')){
	 				this.dropdown = $L('lyte-dropdown', this.$node).e[0];
	 				this.dropbox =  this.dropdown.component.childComp ? this.dropdown.component.childComp : $L('lyte-drop-box', this.dropdown).e[0];
	 				this.dropdown.element = $L('input' + ( type == 'datetime' ? ":last-of-type" : '' ), this.$node).e[0];
	 			}
	 		}
		 	if(type == 'time' || type == 'date' || type == "datetime"){
		 		var func = this.handleWheel.bind(this);
		 		this.setData('eventListeners.timeWheel', func);
		 		if(this.getData('ltPropWheel')){
		 			this.$node.addEventListener('wheel', func);
				}
		 	}		
		   	if(this.getMethods('afterRender'))
	            {
	                this.executeMethod('afterRender', this.$node);
	            }	
	},

	didDestroy : function(){
		if(this.$node.calendarComp){
			this.$node.calendarComp.remove()
		}
		var evt = this.getData('eventListeners'), type = this.getData('ltPropType');
		if(type == 'date' || type == "datetime" ){
			document.removeEventListener('click', evt.calendar, true);
			window.removeEventListener('scroll', evt.scroll, true);
			window.removeEventListener('resize', evt.scroll, true);
			this.$node.removeEventListener('wheel', evt.timeWheel);
		}
		if(type == 'time' || type == "datetime" ){
			this.$node.removeEventListener('wheel', evt.timeWheel);
		}
		if(evt.hasOwnProperty('mouseup')){
			document.removeEventListener('mouseup', evt.mouseup);
		}	
	},

	calenderClickHide : function(event){
			var calendarComp = this.$node.calendarDiv;
			if(event.target != $L('input', this.$node).e[0] && !calendarComp.contains(event.target))
		    	{
	 				calendarComp.classList.add('lyteCalendarHidden');
	 			}
	},

	scrollFunc : function(event){
		var thisCalendar = this.$node.calendarDiv;
		 $L.fastdom.mutate(function(){
		 	this.setCss();
	 	     $L.fastdom.measure(function(){
	 	     	if(thisCalendar && event && event.type == 'scroll' && !thisCalendar.classList.contains('lyteCalendarHidden')){
					var boundary = this.getData('ltPropBoundary');
					if((boundary.hasOwnProperty('left') ? (input.left < boundary.left) : false) || (boundary.hasOwnProperty('right') ? (input.right > boundary.right) : false)  || (boundary.hasOwnProperty('top') ? (input.top < boundary.top) : false)  || (boundary.hasOwnProperty('bottom') ? (input.bottom > boundary.bottom) : false))		
						{	
							thisCalendar.classList.add('lyteCalendarHidden')
						}
		 	     }
	 	     }.bind(this))	
		 }.bind(this))
	},

	textareaFuncObs : function(){
		if(this.getData('ltPropType') == 'textarea'){
			var resize = this.getData('ltPropTextAreaResize');
			if(!(resize.horizontal || resize.vertical)){
				this.setData('resize', false);
			}else{
				this.setData('resize', true);
				if(!this._resizeBinded){
					this.textareaFunc();
					this._resizeBinded = true;
				}
			}
		}
	}.observes('ltPropTextAreaResize').on('didConnect'),

	textareaFunc : function () {
		var resizeFunc = this.textareaResize.bind(this), mouseup = this.mouseup.bind(this);
		this.setData('eventListeners.resizeFunc', resizeFunc);
		this.setData('eventListeners.mouseup', mouseup);
		if(this.getData('ltPropTextAreaResize')){
			var resizeSpan = $L('.lyteTextareaResize', this.$node).e[0];
			resizeSpan.addEventListener('mousedown', function(evt){
				var textarea=$L('textarea', this.$node).e[0]
				var resize = this.getData('ltPropTextAreaResize') || {};
				evt.preventDefault();
				evt.stopPropagation();
				evt.stopImmediatePropagation();
				document.addEventListener('mousemove', resizeFunc, true);
				document.addEventListener('mouseup', mouseup, true);
				var label = $L('label', this.$node).e[0],parHeight, parWidth, parPaddLeft, minWidth, maxWidth, minHeight, maxHeight, labelRect, thisRect, parentClient, clientRect, compStyle,  direction = this.getData('ltPropDirection');
				$L.fastdom.measure(function(){
					// for textarea manual resizing label width is fixed if it is present
					if(label){
						labelRect = label.getBoundingClientRect();	
					}
					compStyle = window.getComputedStyle(textarea);
					clientRect = textarea.getBoundingClientRect();
					parentClient = window.getComputedStyle(textarea.parentElement);
					thisRect = this.$node.getBoundingClientRect();
					this._resizeDirection = compStyle.resize;
					minWidth = compStyle.minWidth; maxWidth = compStyle.maxWidth;
					minHeight = compStyle.minHeight; maxHeight = compStyle.maxHeight;
					parHeight = parentClient.height; parWidth = parentClient.width;
					parPaddLeft = parentClient.paddingLeft;
				}.bind(this))
				$L.fastdom.mutate(function(){
					if(resize.horizontal){
						// for proper resizing width are calculated in pixels and set to corresponding elements
						this.$node.style.width = thisRect.width + 'px';
						if(label){
							label.style.width = labelRect.width + 'px';
						}
						textarea.style.width = clientRect.width + 'px';
						textarea.parentElement.style.width = 'auto';
						this._iniLeft = clientRect.left;
						this._offLeft = clientRect.right - evt.clientX;
						this._minWidth = (minWidth.indexOf('%') != -1 ? (parseInt(parWidth) * parseInt(minWidth) / 100) : parseFloat(minWidth)) + parseInt(parPaddLeft);
						this._maxWidth = maxWidth.indexOf('%') != -1 ? (parseInt(parWidth) * parseInt(maxWidth) / 100) : parseFloat(maxWidth);
					} 
					if(resize.vertical){
						this.$node.style.height = thisRect.height / (direction == 'vertical' && label ? 2 : 1) + 'px';
						if(label){
							label.style.height = labelRect.height + 'px';
						}
						textarea.style.height = clientRect.height + 'px';
						textarea.parentElement.style.height = "auto";
						this._iniTop = clientRect.top;
						this._offTop = clientRect.bottom - evt.clientY;
						this._minHeight = (minHeight.indexOf('%') != -1 ? (parseInt(parHeight) * parseInt(minHeight) / 100) : parseFloat(minHeight));
						this._maxHeight = maxHeight.indexOf('%') != -1 ? (parseInt(parHeight) * parseInt(maxHeight) / 100) : parseFloat(maxHeight);
					}
				}.bind(this))
			}.bind(this), true);
		}
  	},

  	mouseup : function(event){
		var events = this.getData('eventListeners');
		document.removeEventListener('mousemove', events.resizeFunc, true);
		document.removeEventListener('mouseup',events.mouseup, true);
		delete this._iniLeft; delete this._iniTop; delete this._offLeft; delete this._offTop; 
		delete this._minHeight; delete this._maxHeight; delete this._minWidth; delete this._maxWidth;
	},

	textareaResize:function(event){
		var textarea = $L('textarea', this.$node).e[0];
		$L.fastdom.measure(function(){
			var prevWidth = textarea.getBoundingClientRect();
			if(this._iniLeft){
				var newWid = ((event.clientX > this._iniLeft) ? event.clientX : this._iniLeft) - this._iniLeft + this._offLeft;
				var newOut = parseFloat(this.$node.style.width) + newWid - prevWidth.width;
				if(newWid >= this._minWidth && (isNaN(this._maxWidth) || (!isNaN(this._maxWidth) && newWid <= this._maxWidth))){
					// new calculated width is set to text area and lyte-input
					textarea.style.width = newWid + 'px'; 
					this.$node.style.width = newOut + 'px';
				}
			}
			if(this._iniTop){
				var newHgt = ((event.clientY > this._iniTop) ? event.clientY : this._iniTop) - this._iniTop + this._offTop;
				var newOut = parseFloat(this.$node.style.height) + newHgt - prevWidth.height;
				if(newHgt >= this._minHeight && (isNaN(this._maxHeight) || (!isNaN(this._maxHeight) && newHgt <= this._maxHeight))){
					// new calculated height is set to text area and lyte-input
					textarea.style.height = newHgt + 'px'; 
					this.$node.style.height = newOut + 'px';
				}
			}
		}.bind(this))
	},

  	heightFuncObs : function(){
  		this.heightFunc.call(this, arguments[0]);
  	}.observes('ltPropHeight').on('didConnect'),

  	heightFunc : function (arg){
  		var height = this.getData('ltPropHeight');
  		if(height)
  			{
  				// given height set to input tag
  				$L.fastdom.mutate(function(){
  					var ltPropType = this.getData('ltPropType')
					if(ltPropType != 'textarea')
				  		 {
				  		 	 var input = $L('input', this.$node).e[0];
					  		 var lyteFieldDiv= $L('.lyteField', this.$node).e[0]
						     input.style.height = height;
				   		}
				   	else
				   		{
				   			$L('textarea', this.$node).e[0].style.height = height;
				   		}
  				}.bind(this))
		   	}
	 },

	widthfunObs : function(){
		this.widthfun.call(this);
	}.observes('ltPropWidth').on('didConnect'),

  	widthfun : function (){
  		var width = this.getData('ltPropWidth');
  		if(width){
  			$L.fastdom.mutate(function(){
  				// given width set to input
  				this.$node.style.width = width;
  			}.bind(this))
  		}
  	},

  	appearanceFunObs : function(){
  		this.appearanceFun.call(this);
  	}.observes('ltPropAppearance').on('didConnect'),

  	appearanceFun : function () {
  		var type = this.getData('ltPropType'), lyteField = $L('.lyteField', this.$node).e[0]
  		if(this.getData('ltPropAppearance')=='box')
   			{
   				if(type =='search')
	   				{
	   					lyteField.classList.add('lyteInputBoxSearch');
	   				}
	   			var lyteInput = this.$node
	   			if(lyteInput)	
   					{
   						lyteInput.classList.add('lyteInputBox');
   						lyteInput.classList.remove('lyteInput');
   					}
   			}
   		else
   			{
   				if(type =='search')
	   				{
	   					lyteField.classList.remove('lyteInputBoxSearch');
	   				}
	   			var lyteInputBox = this.$node;	
	   			if(lyteInputBox)
	   				{
	   					lyteInputBox.classList.add('lyteInput');
	   					lyteInputBox.classList.remove('lyteInputBox');
	   				}
   			}		
  	},

  	directionfunObs : function(){
  		this.directionfun.call(this);
  	}.observes('ltPropDirection').on('didConnect'),

  	directionfun : function (){
  		var horizontal = this.$node;
  		if(horizontal)
		  	{
		  		// depending upon the direction classes are added
		  		if(this.getData('ltPropDirection')=='vertical')
		   			{
		   				horizontal.classList.add('vertical');
		   				horizontal.classList.remove('horizontal');
		   			}
		   		else 	
			   		{
			   			horizontal.classList.add('horizontal');
			   			horizontal.classList.remove('vertical');
			   		}
			 }	
	},
	data : function(){
		return {
		    ltPropDisabled :  Lyte.attr("boolean",{"default" : false}),
		    ltPropAutofocus : Lyte.attr("boolean",{"default" : false}),
		    ltPropAutocomplete : Lyte.attr("string",{"default" : 'off'}),
		    ltPropMaxlength : Lyte.attr("number",{"default" : undefined}),
		    ltPropName : Lyte.attr("string",{"default" : ''}),
		    ltPropPlaceholder : Lyte.attr("string",{"default" : ''}),
		    ltPropReadonly : Lyte.attr("boolean",{"default" : false}),
		    ltPropValue : Lyte.attr("string",{"default" : ''}),
		    ltPropWidth : Lyte.attr("string",{"default" : ''}),
		    ltPropTabIndex : Lyte.attr('string',{default : '0'}),
		    ltPropType : Lyte.attr("string",{"default" : ''}),
		    ltPropAppearance : Lyte.attr("string",{"default" : ''}),
		    ltPropDirection : Lyte.attr("string",{"default" : 'vertical'}),
		    ltPropLabel : Lyte.attr("string",{"default" : ''}),
		    ltPropId : Lyte.attr("string",{"default" : ''}),
		    ltPropClass : Lyte.attr("string",{"default" : ''}),
		    ltPropText : Lyte.attr("string",{"default" : ''}),
		    ltPropStyle : Lyte.attr("string",{"default" : ''}),
		    ltPropText : Lyte.attr("string",{"default" : 'upload'}),
		    ltPropWrapperStyle : Lyte.attr('string', {'default' : ''}),
		    ltPropHeight : Lyte.attr("string",{"default" : ''}),
		    ltPropPattern : Lyte.attr('string', { default : '.+'}),
		    ltPropInputTitle : Lyte.attr('string', { default : '' }),
		   	
		    // data for file
		     ltPropAccept : Lyte.attr("string",{"default" : ''}),
		     ltPropMultiple : Lyte.attr("boolean",{"default" : true}),

		    // data for textarea
		    ltPropRows : Lyte.attr("number",{"default" : undefined}),
     	    ltPropCols : Lyte.attr("number",{"default" : undefined}),
     	    ltPropTextAreaResize : Lyte.attr("object",{"default" : {vertical : true, horizontal : true}}),

		    // data for number
		    ltPropMax : Lyte.attr("number",{"default" : undefined}),
		    ltPropMin : Lyte.attr("number",{"default" : undefined}),
		    ltPropStep : Lyte.attr("number",{"default" : 1}),

			// data for time
			ltPropTimeFormat : Lyte.attr("number",{"default" : 12}),
		    ltPropHourInterval : Lyte.attr("number",{"default" : 1}),
		    ltPropDefaultTime : Lyte.attr("string",{"default" : ''}),
		    ltPropMinuteInterval : Lyte.attr("number",{"default" : 30}),
		    ltPropDropdown : Lyte.attr("boolean",{"default" : false}),
		    ltPropShowInterval : Lyte.attr("boolean",{"default" : false}),
		    ltPropStartTime : Lyte.attr("string",{"default" : ''}),
		    ltPropEndTime : Lyte.attr("string",{"default" : ''}),

		    // data for calendar
		    ltPropFillRows : Lyte.attr('boolean', {default : true}),
			ltPropNumberOfRows : Lyte.attr('number', {default : 6}),
			ltPropMinDate : Lyte.attr('string', { default : ""}),
			ltPropMaxDate : Lyte.attr('string', { default : ""}),
			ltPropStartWeekDay : Lyte.attr('number', { default : 1}),
			ltPropMonthHeaderFormat : Lyte.attr("string",{"default":'MMMM YYYY'}),
			daysOfWeek : Lyte.attr("array",{"default":['Sun','Mon','Tue','Wed','Thu','Fri','Sat']}),
			ltPropYear : Lyte.attr("boolean",{"default":true}),
			ltPropFormat : Lyte.attr("string",{"default":"MM/DD/YYYY"}),
			viewDate : Lyte.attr("object",{"default":{}}),
			ltPropStartDate : Lyte.attr("string",{"default" : ''}),
		    ltPropEndDate : Lyte.attr("string",{"default" : ''}),
		    ltPropCurrentDate : Lyte.attr("string",{"default" : ''}),
		    ltPropMonthHeader : Lyte.attr("string",{"default" : ''}),

			// data for dropdown
			ltPropDropdownDisabled : Lyte.attr('boolean', { default : false}),
			ltPropDropdownShow : Lyte.attr('boolean', { default : false}),
			ltPropDropdownCallout : Lyte.attr('boolean', { default : false}),
			ltPropDropdownFreeze : Lyte.attr('boolean', { default : false}),

			// for dropdown and calendar
			ltPropPosition : Lyte.attr('string', { default : 'down'}),
			ltPropBoundary : Lyte.attr('object', { default : {}}),

			// for date and time
		    ltPropWheel : Lyte.attr('boolean', {default : false}),
			ltPropYield : Lyte.attr('boolean', { default : false}),

			ltPropAutoUpdate : Lyte.attr('boolean', { default : true}),

		    // system data
		    // fileNo : Lyte.attr("number",{"default" : undefined}),
		    eventListeners : Lyte.attr('object', {default : {}}),
		    selectedField : Lyte.attr('object', { default : {}}),
		    endMinute : Lyte.attr('number', { default : ''}),
		    startMinute : Lyte.attr('number', { default : ''}),
		    dropdownData : Lyte.attr('array', { default : []}),
		    originalData : Lyte.attr('array', { default : []}),
		    // ltPropFilelist : Lyte.attr("array",{default : []}),
		    dateRange : Lyte.attr('object', { default : { day : [], month : [], year : []}}),
		    meridian : Lyte.attr('object', { default : {AM : (_lyteUiUtils ? _lyteUiUtils.i18n('AM') : 'AM'), PM : (_lyteUiUtils ? _lyteUiUtils.i18n('PM') : 'PM')}}),
		    hour : Lyte.attr('string', { default : _lyteUiUtils.i18n('hour')}),
		    min : Lyte.attr('string', { default : _lyteUiUtils.i18n('min')}),
		    selectedDateField : Lyte.attr('string', { default : ""}),
		    preventObs : Lyte.attr('boolean', { default : true}),
		    resize : Lyte.attr('boolean', { default : true}),
		    pos : Lyte.attr('string', { default : ""})
		}
	},

	getDateFromFormat:function(tdate,format){
		return this._assCalendar.component.getDateFromFormat(tdate, format);
	},

	dateValidation : function(date){
        var timeObj = new Date(date);
         if(timeObj.toString() == 'Invalid Date'){
        	return false
         }
         return timeObj;
         },

	dateRegexFind : function(arg){
		var format, dateRange = this.getData('dateRange');
		if(!arg){
			format = this.getData('ltPropFormat');
		}else{
			format = arg.newValue;
		}
		var dayReg = /D+/g.exec(format), monthReg = /M+/g.exec(format), yearReg = /Y+/g.exec(format);
		dateRange.day[0] = dayReg.index; dateRange.day[1] = dayReg.index + dayReg[0].length;
		dateRange.month[0] = monthReg.index; dateRange.month[1] = monthReg.index + monthReg[0].length;
		dateRange.year[0] = yearReg.index; dateRange.year[1] = yearReg.index + yearReg[0].length;

	},

	dateRegexObs : function(arg){
		this.dateRegexFind(arg);
	}.observes('ltPropFormat'),

	constructingArr : function(i, startTime, format){
		if(i < startTime){
			i += 1440;
		}
		var interval = (i - startTime) / 60;
		temp = {};
		temp.time = this.convertToRailway(i, true, format);
		temp.interval = interval < 1 ? ((i - startTime) + ' '+ this.getData('min')) : ((interval % 1 == 0 ? interval : interval.toFixed(1)) + ' ' + this.getData('hour'));
		return temp;
	},

	dropdownConstruct : function(){
		if( this._prevent ) {
			return
		}
		var startTime = this.getData('startMinute'), i, temp = [], endTime = this.getData('endMinute'), hrInter = this.getData('ltPropHourInterval'), minInt = this.getData('ltPropMinuteInterval'), format = this.getData('ltPropTimeFormat');
		if(startTime > endTime){
			endTime += 1440;
		}
		for(i = startTime; i <= endTime; i += minInt){
			 temp.push(this.constructingArr(i, startTime, format))
		}
		this.setData('originalData', temp);
	},

	constructNewDrop : function(input, format){
		var temp = [], startTime = this.getData('startMinute');
		if(format == 12){
			var min = this.convertToRailway(input.value.trim());
			var ret = this.maxValCheck(min);
			if(ret != false){
				temp.push(this.constructingArr(min, startTime, 12));
			}
			min += 720;
			ret = this.maxValCheck(min % 1440);
			if(ret != false){
				temp.push(this.constructingArr(min, startTime, 12));
			}
		}else{
			var min = this.convertToRailway(input.value.trim());
			var ret = this.maxValCheck(min);
			if(ret != false){
				temp.push(this.constructingArr(min, startTime, 24));
			}
		}
		this.setData('dropdownData', temp);
	},

	getCorrectTime : function(timeFormat){
		var time = new Date(), hr = time.getHours(), min = time.getMinutes().toString(), meridian = this.getData('meridian'), mer = hr > 11 ? meridian.PM : meridian.AM;
		if(min.length == 1){
			min = '0' + min;
		}
		if(timeFormat == 12){
			hr = (hr%12).toString();
			if(hr.length == 1){
				hr = '0' + hr;
			}
			return hr + ':' + min + " " + mer;
		}else{
			if(hr < 10){
				hr = '0' + hr;
			}
			return hr + ":" + min;
		}

	},

	timeFormatChange : function(){
		this.timeInValChange();
	}.observes('ltPropTimeFormat'),

	handleWheel : function(evt){
		var input = event.target, type = this.getData('ltPropType');
		if( input.tagName = 'INPUT' ) {
			return
		}
		if(type == 'time' || ( type == "datetime" && input.id == "time" ) ){
			$L.fastdom.mutate(function(){
				selectedField = this.getData('selectedField');
				if(!selectedField.prop || input.selectionStart > 3){
					// settting initial selection if input is not focused
					input.selectionStart = 0;
		            input.selectionEnd = 2;
					this.setData('selectedField', {prop : 'hour', val : 0});
					selectedField = {prop : 'hour', val : 0};
				}
				if(evt.deltaY < -10){
					this.timeDecrease.call(this, input, {}, selectedField.prop, input.selectionStart, input.selectionEnd)
				}else if(evt.deltaY > 10){
					this.timeIncrease.call(this, input, {}, selectedField.prop, input.selectionStart, input.selectionEnd)
				}
			}.bind(this))
		}else if( type == 'date' || ( type == "datetime" && input.id == "date" ) ){
			if(evt.deltaY < -10){
				evt.keyCode = 40;
				this.calendarKeydown.call(this, evt, input);
			}else if(evt.deltaY > 10){
				evt.keyCode = 38;
				this.calendarKeydown.call(this, evt, input);
			}
		}
		evt.preventDefault();	
	},                                            

	wheelObs : function(arg){
		if(arg.newValue){
		 	this.$node.addEventListener('wheel', this.getData('eventListeners.timeWheel'));
		}else{
			this.$node.removeEventListener('wheel', this.getData('eventListeners.timeWheel'));
		}
	}.observes('ltPropWheel'),

	convertToRailway : function(val, flag, format){
		var meridian = this.getData('meridian');
		if(!flag){
			var hr = parseInt(val.slice(0, 2));
			var min = parseInt(val.slice(3, 5));
			if(val.length != 5){
				var mer = val.slice(6, val.length);
				return (mer == meridian.PM ? ((hr % 12) + 12) : hr) * 60 + min;
			}else{
				return (hr * 60 + min);
			}
		}else{
			var hr = parseInt(val / 60) % 24;

			var min = val % 60;
			if(min < 10){
				min = '0' + min;
			}
			var mer = ''
			if(format == 12){
				if(parseInt(hr / 12) == 1){
					if(hr > 12){
						hr = hr % 12;
					}
					mer = meridian.PM;
				}else{
					mer = meridian.AM;
				}
			}
			if(hr < 10){
				hr = '0' + hr;
			}
			return (hr + ":" + min + " " + mer);
		}
	},

	maxValCheck : function(val){
		var endTime = this.getData('endMinute');
		var startTime = this.getData('startMinute');
		var toChangeTime;
		if(typeof val == 'string'){
			toChangeTime = 	this.convertToRailway(val);
		}else{
			toChangeTime = val
		}
		if(startTime < endTime){
			if(toChangeTime <= endTime && toChangeTime >= startTime){
				return true
			}
		}else{
			if((toChangeTime < 1440 && toChangeTime >= startTime) || (toChangeTime > 0 && toChangeTime <= endTime)){
				return true;
			}
		}
		return false
	},

	timeInValChange : function(arg){
		var timeFormat = this.getData('ltPropTimeFormat'), value;
		if(arg){
			value = arg.newValue;
		}else{
			value = this.getData('ltPropDefaultTime')
		}
		if(!value){
			var startTime =  this.getData('ltPropStartTime');
			if(startTime){
				value = startTime;
			}else{
				value = this.getCorrectTime(timeFormat);
			}
		}
		this.setData('ltPropDefaultTime', value.slice(0, timeFormat != 12 ? 5 : value.length));
	},

	startEndTimeObs : function(arg){
		if(!arg || arg.item == 'ltPropStartTime')
			{
				var defaultVal = this.getData('ltPropDefaultTime');
				var startTime = this.getData('ltPropStartTime')
				if(!startTime){
					this.setData('ltPropStartTime', defaultVal)
					startTime = defaultVal
				}
				this.setData('startMinute', this.convertToRailway(startTime));
			}
		if(!arg || arg.item == 'ltPropEndTime')	
			{
				var  endTime = this.getData('ltPropEndTime')
				if(!endTime){
					var min = Math.max(0, parseInt(startTime.slice(3, 5)) - 1).toString();
					if(min.length == 1){
						min = '0' + min;
					}
					endTime = startTime.slice(0, 3) + min + " " + startTime.slice(6, startTime.length);
					this.setData('ltPropEndTime', endTime)
				}
				this.setData('endMinute',  this.convertToRailway(endTime));
			}
		this.dropdownConstruct()	
	},

	timeBoundObs : function(arg){
		if(arg &&  arg.newValue == "" && arg.oldValue == undefined) {
			return
		}
		if(!arg || (arg && arg.item != 'ltPropDefaultTime')){
			this.startEndTimeObs(arg);
		}else{
			if(this.setData('preventObs')){
				this.setData('ltPropValue', arg.newValue);
			}
			if(this.getMethods('onTimeChange')){
				this.executeMethod('onTimeChange', arg, this.$node);
			}
		}
	}.observes('ltPropStartTime', 'ltPropEndTime', 'ltPropDefaultTime'),

	dateChangeCallback : function(){
		setTimeout(this.dateCallback.bind(this), 0 , arguments[0]);
	}.observes('ltPropCurrentDate'),

	dateCallback : function(arg){
		if( arg.newValue == "" && arg.oldValue == undefined) {
			return
		}
		if(this.getMethods('onDateChange')){
			this.executeMethod('onDateChange', arg, this.$node);
		}
	},

	timeCallback : function(arg){
		if( arg.newValue == "" && arg.oldValue == undefined) {
			return
		}
		if(this.getMethods('onValueChange')){
			this.executeMethod('onValueChange', arg, this.$node)
		}
	},

	valChangeObs : function(arg){
		setTimeout(this.timeCallback.bind(this), 0 , arg);
	}.observes('ltPropValue'),

	firePosCallBack: function() {
		if( this.getMethods( 'onPositionChanged' )) {
			this.executeMethod( 'onPositionChanged', this.getData('pos'), this.$node.calendarDiv);
		}
	}.observes('pos'),

	/*
		Calculate left of dropdown container when it has to come below/above the select element when it exceeds window.innerWidth and there is space to the right
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
		Calculate left of dropdown container when it has to come below/above the select element when it doesn't exceed window.innerWidth
	*/
	setLeftNotExceedForDown: function( element, bcr, xscroll ) {
		var scrolledLeft = xscroll,
		elementBCR = bcr,
		elementLeft = elementBCR.left,
		total = scrolledLeft + elementLeft;

		return total
	},
	/*
		Calculate top of dropdown container when it has to come above the select element
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
		Calculate top of dropdown container when it has to come below the select element
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
		Calculate left of dropdown container when it has to come to right of the select element
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
		Calculate right of dropdown container when it has to come to left of the select element of right dropdown
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
		Calculate top of dropdown container when it has to come to right of dropdown and there is space below
	*/
	setTopForRight:function( element, bcr, yscroll ) {
		var scrolledHeight = yscroll,
		elementBCR = bcr,
		elementTop = elementBCR.top,
		total = scrolledHeight + elementTop;

		return total
	},
	/*
		Calculate top of dropdown container when it has to come to right of dropdown and there is no space below
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
	 * Set the CSS for your calendar
	 * refer commit ID 583ee6ccbeaa6b3729178bf9df0139032b016d19 and previous for the previous stable setCSS function.
	 * commit ID 583ee6ccbeaa6b3729178bf9df0139032b016d19 also gives a better understanding about the hard coded values in this function.
	 */ 
	setCss : function(  ) {
		var link = this.$node.calendarDiv;

		if( !link 
			|| link.classList.contains( 'lyteCalendarHidden' ) 
		) {
			return;
		}

		// Get properties

		// Get button
		var body = link,
		par = $L( 'input', this.$node ).e[ 0 ].parentElement;

		// Get Geometric propotions
		var wwidth, wheight, flag, 
		wwidth = window.innerWidth,
		wheight= window.innerHeight,
		drop = body.getBoundingClientRect(), 
		x = window.pageXOffset || document.documentElement.scrollLeft,
		y = window.pageYOffset || document.documentElement.scrollTop,
		height = body.offsetHeight,
		width = body.offsetWidth, 
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

			if( downPos ) {
				this.setData( 'pos', 'down' );
				body.style.top = this.setTopBelowForDown( par, offsets, y ) + 'px';
				
			}
			else {
				this.setData( 'pos', 'up' );
				body.style.top = this.setTopAboveForDown( par, body, offsets, drop, y ) + 'px';
			}

			if( rightPos ) {
				body.style.top = tempStore ? tempStore : body.style.top;
				body.style.left = this.setLeftNotExceedForDown( par, offsets, x ) + 'px';	
			}
			else {
				body.style.top = tempStore ? tempStore : body.style.top;
				body.style.left = this.setLeftExceedForDown( par, body, offsets, drop, x ) + 'px'
			}

			
		}
		else if( position === 'right' ) {
			rightPos = true;
			if( offsets.left + offsets.width + width > window.innerWidth 
				&& offsets.left - drop.width > 0 
			) {   
				rightPos = false;
				
			}
			else{
				rightPos = true;
			}

			downPos = true;
			if( offsets.top + drop.height > window.innerHeight ) {
				downPos = false
			}
			else {
				downPos = true
			}

			if( rightPos ) {
				this.setData( 'pos', 'right' );
				body.style.left= this.setLeftForRight( par, offsets, x ) + 'px'
			}
			else {
				this.setData( 'pos', 'left' );
				body.style.left = this.setRightForRight( par, body, offsets, drop, x ) + 'px';
			}

			if( downPos ) {
				body.style.left = tempStore ? tempStore : body.style.left;
				body.style.top = this.setTopForRight( par, offsets, y ) + 'px' 
			}
			else {
				body.style.left = tempStore ? tempStore : body.style.left;
				body.style.top = this.setTopForRightAbove( par, body, offsets, drop, y ) + 'px'
			}
		}
		else if( position === 'up' ) {
			topPos = true
			if( offsets.top - drop.height < 0 
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

			if( topPos ) {
				this.setData( 'pos', 'up' );
				body.style.top = this.setTopAboveForDown( par, body, offsets, drop, y ) + 'px';
			}
			else {
				this.setData( 'pos', 'down' );
				body.style.top = this.setTopBelowForDown( par, offsets, y ) + 'px'
			}
			if( rightPos ) {
				body.style.top = tempStore ? tempStore : body.style.top;
				body.style.left = this.setLeftNotExceedForDown( par, offsets, x ) + 'px';
			}
			else{
				body.style.top = tempStore ? tempStore : body.style.top;
				body.style.left = this.setLeftExceedForDown( par, body, offsets, drop, x ) + 'px';
			}
		} else if( position === 'left' ) {
			leftPos = true;
			if( offsets.left - drop.width < 0 
				&& offsets.left + drop.width < wwidth 
			) {
				leftPos = false;
			}
			else {
				leftPos = true;
			}

			downPos = true;
			if( offsets.top + drop.height > window.innerHeight ) {
				downPos = false;
			}
			else {
				downPos = true;
			}

			if( leftPos ) {
				this.setData( 'pos', 'left' );
				body.style.left = this.setRightForRight( par, body, offsets, drop, x ) + 'px';
			}
			else {
				this.setData( 'pos', 'right' );
				body.style.left = this.setLeftForRight( par, offsets, x ) + 'px';
			}
			if( downPos ){
				body.style.left = tempStore ? tempStore : body.style.left;
				body.style.top = this.setTopForRight( par, offsets, y ) + 'px';
			}
			else{
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
			tempLeft = offsets.left + offsets.width / 2 - width;
			if( tempLeft < 0 ) {
				tempLeft = 0
				rightPos = true
			} else { 
				rightPos  = false
			}

			body.style.top = tempTop + y + 'px';

			body.style.left = tempLeft + x + 'px';
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
			tempLeft = offsets.left + offsets.width / 2;
			if( tempLeft + width > wwidth ) {
				tempLeft = wwidth - width;
				rightPos = false;
			} else { 
				rightPos  = true;
			}

			body.style.top = tempTop + y + 'px';

			body.style.left = tempLeft + x + 'px';
			if( downPos ){
				pos = 'downLeft';
			} else {
				pos = 'upLeft';
			}
			this.setData( 'pos', pos);
		} else if( position === 'upLeft' ) {
			downPos = false;
			tempTop = offsets.top - height;
			if( tempTop < 0) {
				tempTop = offsets.top + offsets.height;
				downPos = true
			} else {
				downPos = false;
			}
			rightPos = false
			tempLeft = offsets.left + offsets.width / 2 - width;
			if( tempLeft < 0 ) {
				tempLeft = 0
				rightPos = true
			} else { 
				rightPos  = false
			}

			body.style.top = tempTop + y + 'px';

			body.style.left = tempLeft + x + 'px';
			if( downPos ){
				pos = 'downLeft';
			} else {
				pos = 'upLeft';
			}
			this.setData( 'pos', pos);

		} else if( position === 'upRight' ) {
			downPos = false;
			tempTop = offsets.top - height;
			if( tempTop < 0) {
				tempTop = offsets.top + offsets.height;
				downPos = true
			} else {
				downPos = false;
			}
			rightPos = true
			tempLeft = offsets.left + offsets.width / 2;
			if( tempLeft + width > wwidth ) {
				tempLeft = wwidth - width;
				rightPos = false;
			} else { 
				rightPos  = true;
			}

			body.style.top = tempTop + y + 'px';

			body.style.left = tempLeft + x + 'px';
			if( downPos ){
				pos = 'downLeft';
			} else {
				pos = 'upLeft';
			}
			this.setData( 'pos', pos);
		}
			
	},

	methods: {
		"on-dateselected":function(){
               this.$node.calendarDiv.classList.add('lyteCalendarHidden');
               if( this.getMethods( 'onCalendarClose' ) ) {
 	     			this.executeMethod( 'onCalendarClose', this.$node.calendarDiv, this.$node )
 	     		}
         },
         hide : function(){
         	if(this.getMethods('onHide')){
         		this.executeMethod('onHide', arguments[0], arguments[1], this.$node);
         	}
         },
         beforeHide : function(){
         	if(this.getMethods('onBeforeHide')){
         		return this.executeMethod('onBeforeHide', arguments[0], arguments[1], this.$node);
         	}
         },
         show : function(){
         	if(this.getMethods('onShow')){
         		this.executeMethod('onShow', arguments[0], arguments[1], this.$node);
         	}
         },
         beforeShow : function(){
         	if(this.getMethods('onBeforeShow')){
         		return this.executeMethod('onBeforeShow', arguments[0], arguments[1], this.$node);
         	}
         },
         optionSelected : function(){
         	this.setData('ltPropDefaultTime', arguments[1].trim());
         },

         scroll : function(){
         	if(this.getMethods('onScroll')){
         		this.executeMethod('onScroll', arguments[0], arguments[1]);
         	}
         },

         positionChange : function(){
         	if(this.getMethods('onPositionChanged')){
         		this.executeMethod('onPositionChanged', arguments[0], arguments[1]);
         	}
         }
	},
   valUpdate : function(){
   		if( !this.$node || !this) {
   			return;
   		}
		delete this._timeout;
		var type = this.getData('ltPropType');
 		if( type == 'date' || type == "datetime" ){
 			var inn = $L('input',this.$node).e[0].value;
 			this.setData('ltPropCurrentDate', inn ? inn : "");
 		}else if(type == "textarea"){
 			var inn = $L('textarea',this.$node).e[0].value;
 			this.setData('ltPropValue', inn ? inn : "");
 		}else{
 			var inn = $L('input',this.$node).e[0].value;
 			this.setData('ltPropValue', inn ? inn : "");
 		}  
   },
   fixSelection : function(val, selectedField, input){
   	// changing selection range
   			input.selectionStart = selectedField.val + val;
			input.selectionEnd = input.selectionStart + 2;
			this.timeClick.call(this, {}, input);
   },
   replaceVal : function(input, val, start, end){
   		var value;
   		if(typeof input == 'string'){
   			value = input
   		}else{
   			value = input.value
   		}
   		var regex = new RegExp('('+ value.slice(start, start + end) +')','i');
		 return value.trim().replace(regex, val);	
   },

   retVal : function( val1, val2, limit ) {
   	 if( parseInt( val1 + val2 ) > limit ) {
   	 	return '0' + val2
   	 }
   	 return val1 + val2;
   },

   convertToPm :function( limit, val, meridian ){
   		if( limit == 12 ) {
   			var mer = val.slice( 6, val.length ), time = val.slice( 0, 5 ), hr = val.slice( 0, 2 ), min = val.slice( 3, 5 )
   			if( hr == '00' && mer == 'AM' || hr == '12' && mer == 'PM' ) {
   				return val
   			}
   			return hr + ':' + min + " " + ( meridian.AM == mer ? meridian.PM : meridian.AM )
   		}
   		return val
   },

   hourTimeSet : function(input, evt, selection, start, end){
   		 var inputVal = input.value.trim(), limit, meridian = this.getData('meridian');
   		 var typedValue  = evt.keyCode - 48;
   		 var newVal = inputVal.slice(start + 1, end) + typedValue;
   		 var timeFormat = this.getData('ltPropTimeFormat');
   		 if(selection == 'hour'){
   		 	limit = timeFormat == 12 ? 12 : 24;
   		 }else{
   		 	limit = 60
   		 }
	 	if(parseInt(newVal) > limit){
	 		newVal = '0' + typedValue;
	 		if((limit == 12 && newVal == '00' && inputVal.slice(6, 8) == meridian.PM)){
	 			inputVal = this.replaceVal.call(this, input, meridian.AM, 6, meridian.AM.length);
	 		}else if(limit == 60 && newVal == '60'){
	 			newVal = '00';
	 		}
	 	}else{
	 		if((limit == 12 && newVal == '12' && inputVal.slice(6, 8) == meridian.AM)){
	 		    inputVal = this.replaceVal.call(this, input, meridian.PM, 6, meridian.AM.length);
	 		} else if((limit == 12 && newVal == '00' && inputVal.slice(6, 8) == meridian.PM)){
	 		    inputVal = this.replaceVal.call(this, input, meridian.AM, 6, meridian.PM.length);
	 		}
	 	}
	 	var final = inputVal.slice(0, start) + newVal + inputVal.slice(end, inputVal.length);
   		var returnV1 = this.maxValCheck(final);
	 	if(returnV1 == false ){
	 		final = inputVal.slice(0, start) + this.retVal( inputVal.slice(start, start + 1), typedValue, limit ) + inputVal.slice(end, inputVal.length);
	 		returnV1 = this.maxValCheck(final);
	 		if(returnV1 == false){
	 			final = inputVal.slice(0, start) + '0' + typedValue + inputVal.slice(end, inputVal.length);
	 			returnV1 = this.maxValCheck(final);
	 			if(returnV1 == false){
	 				final = this.convertToPm( limit, final, meridian)
	 				returnV1 = this.maxValCheck(final);
	 				if(returnV1 == false){
	 					return false;
	 				}
	 			}
	 		}
	 	}
	 	this.setData('ltPropDefaultTime', final);
	 	// restore current selection
	 	$L.fastdom.mutate(function(){
	 		input.selectionStart = start;
			input.selectionEnd = end;
	 	})
   },
   timeIncrease : function(input, evt, selection, start, end, flag){
   		 var inputVal = input.value.trim(), limit, currentValue = parseInt(inputVal.slice(start, end)), interval, timeFormat = this.getData('ltPropTimeFormat'), final, meridian = this.getData('meridian');
   		 if(selection == 'hour'){
   		 	limit = timeFormat == 12 ? 12 : 24;
   		 	if(flag){
   		 		interval = 1;
   		 	}else{
   		 		interval =  this.getData('ltPropHourInterval');
   		 	}
   		 }else{
   		 	limit = 60;
   		 	interval =  this.getData('ltPropMinuteInterval');
   		 }
   		 var newVal = (currentValue + interval) % limit;
   		 if(limit == 12 && newVal < currentValue && inputVal.slice(6, inputVal.length) == meridian.AM){
   		 	if(newVal == 0){
   		 		newVal = '12';
   		 	}
	 	   inputVal = this.replaceVal.call(this, input, meridian.PM, 6, inputVal.length);
	 	 }else if(limit == 12 && newVal < currentValue && inputVal.slice(6, inputVal.length) == meridian.PM){
	 	 	if(currentValue != 12 || newVal == 0){
	 		 	inputVal = this.replaceVal.call(this, input, meridian.AM, 6, inputVal.length);
	 	 	}
	 	 }else if(limit == 12 && newVal == currentValue && inputVal.slice(6, inputVal.length) == meridian.AM){
	 	 		newVal = '12';
	 	 		inputVal = this.replaceVal.call(this, input, meridian.PM, 6, inputVal.length);
	 	 }else if(limit == 60 && newVal <= currentValue) {
	 	 	 var ret = this.timeIncrease.call(this, input, evt, 'hour', 0, 2, true);
	 	 	 if(ret == false){
	 	 	 	return false;
	 	 	 }
	 	 	 inputVal = input.value.trim();
	 	 }
 	 	newVal = newVal.toString();
 	 	if(newVal.length == 1){
 	 		newVal = '0' + newVal;
 	 	}
	 	final = inputVal.slice(0, start) + newVal + inputVal.slice(end, inputVal.length);
	 	var returnV = this.maxValCheck(final)
	 	if(returnV == false){
	 		return false
	 	}
	 	this.setData('ltPropDefaultTime', final);
	 	// restore current selection
	 	$L.fastdom.mutate(function(){
	 		input.selectionStart = start;
			input.selectionEnd = end;
	 	})
   },
    timeDecrease : function(input, evt, selection, start, end, flag){
   		 var inputVal = input.value.trim(), limit, currentValue = parseInt(inputVal.slice(start, end)), interval, timeFormat = this.getData('ltPropTimeFormat'), final, meridian = this.getData('meridian');
   		 if(selection == 'hour'){
   		 	limit = timeFormat == 12 ? 12 : 24;
   		 	if(flag){
   		 		interval = 1;
   		 	}else{
   		 		interval =  this.getData('ltPropHourInterval');
   		 	}
   		 }else{
   		 	limit = 60;
   		 	interval =  this.getData('ltPropMinuteInterval');
   		 }
   		 var newVal = (currentValue - interval + limit) % limit;
   		 if(limit == 12 && newVal > currentValue && inputVal.slice(6, inputVal.length) == meridian.AM){
	 		 inputVal = this.replaceVal.call(this, input, meridian.PM, 6, inputVal.length);
	 	 } else if(limit == 12 && (newVal > currentValue || currentValue == 12) && inputVal.slice(6, inputVal.length) == meridian.PM){
	 	 	inputVal = this.replaceVal.call(this, input, meridian.AM, 6, inputVal.length);
	 	 }else if(limit == 12 && newVal == 0){
	 	 	if(inputVal.slice(6, inputVal.length) == meridian.PM){
	 	 		newVal = '12';
	 	 	}
	 	 }else if(limit == 60 && newVal >= currentValue) {
	 	 	var ret = this.timeDecrease.call(this, input, evt, 'hour', 0, 2, true);
	 	 	if(ret == false){
	 	 		return false;
	 	 	}
	 	 	inputVal = input.value.trim()
	 	 }
 	 	newVal = newVal.toString();
 	 	if(newVal.length == 1){
 	 		newVal = '0' + newVal;
 	 	}
	 	final = inputVal.slice(0, start) + newVal + inputVal.slice(end, inputVal.length);
	 	var returnV = this.maxValCheck(final);
	 	if(returnV == false){
	 		return false
	 	}
	 	this.setData('ltPropDefaultTime', final);
	 	// restore current selection
	 	$L.fastdom.mutate(function(){
	 		input.selectionStart = start;
			input.selectionEnd = end;
	 	})
   },

   findCalendarRange : function(evt, input){
   		var flag = false;
   		if(input.value && this.dateValidation(input.value) != false){
         		var start = input.selectionStart, i;
         		var end = input.selectionEnd;
         		var range = this.getData('dateRange');
         		for(i in range){
         			// checking selected pos
         			if(range[i][0] <= start && range[i][1] >= start){
         				input.selectionStart = range[i][0];
         				input.selectionEnd = range[i][1];
         				this.setData('selectedDateField', i);
         				flag = true;
         				break;
         			}
         		}
         	}
         return flag;	
   },

   hideCalendar : function(){
			var inputs = $L('lyte-input').e;
			for(var i = 0; i < inputs.length; i++){
				if(inputs[i] != this.$node && inputs[i].calendarDiv && !inputs[i].calendarDiv.classList.contains('lyteCalendarHidden')){
					// hides calendar
					inputs[i].calendarDiv.classList.add('lyteCalendarHidden')
	 	     		if( inputs[i].component.getMethods( 'onCalendarClose' ) ) {
	 	     			inputs[i].component.executeMethod( 'onCalendarClose', inputs[ i ].calendarDiv, inputs[ i ] )
	 	     		}
				}
			}
   },

   showCalendar : function(event, input){
   	 this.hideCalendar();
   	 // removing hidden class
	 this.$node.calendarDiv.classList.remove('lyteCalendarHidden')
	 this.scrollFunc.call(this)
	 // initial selection
	 $L.fastdom.mutate(function(){
	 	 input.selectionStart = 0;
	     input.selectionEnd = 0;
		 this.findCalendarRange(event, input);
		 // $L.fastdom.mutate(function(){
		 	// $L.fastdom.mutate(function(){
				 if(this.getMethods('onCalendarOpen')){
				 	this.executeMethod('onCalendarOpen', this.$node.calendarDiv, this.$node);
				 }
			// }.bind(this)) 
		// }.bind(this))	 
	 }.bind(this))
   },

   calendarMousedown : function(event){
   		if( this.$node.calendarDiv.contains( event.target ) ) {
   			this.preventFocus = true
   		}
   },

   timeClick : function( evt, input ){
   		var start;
	 	// measuring clicked position
	 		start = parseInt(input.selectionStart / 3);
	 	// measuring selection
	 		switch(start){
	     		case 2 : {
	     			input.selectionStart = 6;
	     			input.selectionEnd = input.value.length;
	     			this.setData('selectedField', {prop : 'meridian', val : 6});
	     		}
	     		break;
	     		case 1 : {
	     			input.selectionStart = 3;
	     			input.selectionEnd = 5;
	     			this.setData('selectedField', {prop : 'minute', val : 3});
	     		}
	     		break;
	     		default : {
	     			input.selectionStart = 0;
	     			input.selectionEnd = 2;
	     			this.setData('selectedField', {prop : 'hour', val : 0});
	     		}
	      	}
	  if(this.dropbox && this.dropbox.classList.contains('lyteDropdownHidden') && evt.type == "click"){
	  		this.setData('dropdownData', this.getData('originalData'));
	 		this.dropdown.toggle();
	 	}
   },

   calendarKeydown : function( evt, input ){
   		var keyCode = evt.keyCode;
     	var time = this.dateValidation(input.value);
         	if(time != false){
         		var selected = this.getData('selectedDateField');	             		
             	if([37, 38, 39, 40, 9].indexOf(keyCode) != -1){
             			if(input.selectionEnd == input.selectionStart){
	             			this.findCalendarRange(evt, input);
	             		}
	             		var start = input.selectionStart;
	             		var end = input.selectionEnd;
	             		if([38, 40].indexOf(keyCode) != -1){
	             		   evt.preventDefault();
	             		switch(selected){
	             			case 'year' : {
	             				if(keyCode == 40){
	             					time.setFullYear(time.getFullYear() - 1);
	             				}else{
	             					time.setFullYear(time.getFullYear() + 1);
	             				}	
	             			}
	             			break;
	             			case 'month' : {
	             				if(keyCode == 40){
	             					time.setMonth(time.getMonth()  - 1);
	             				}else{
	             					time.setMonth(time.getMonth() + 1);
	             				}
	             			}
	             			break;
	             			default : {
	             				if(keyCode == 40){
	             					time.setDate(time.getDate() - 1);
	             				}else{
	             					time.setDate(time.getDate() + 1);
	             				}
	             			}
	             		}
	             		this.setData('ltPropCurrentDate', this.getDateFromFormat(time, this.getData('ltPropFormat')));
	             	}else{
	             		if((input.selectionEnd == input.value.length && (keyCode == 39 || (!evt.shiftKey && keyCode == 9))) || (input.selectionStart == 0 && (keyCode == 37 || (evt.shiftKey && keyCode == 9)))){
	             			return
	             		}else{
	             			daterange = this.getData('dateRange');
	             			if(keyCode == 39 || (!evt.shiftKey && keyCode == 9)){
	             				input.selectionStart = input.selectionEnd = daterange[selected][1] + 1;
	             			}else if(keyCode == 37 || (evt.shiftKey && keyCode == 9)){
	             				input.selectionStart = input.selectionEnd = daterange[selected][0] - 1;
	             			}
	             			this.findCalendarRange(evt, input);
	             			start = input.selectionStart;
	             			end = input.selectionEnd;
	             			evt.preventDefault();
	             		}
	             	}
	             	// restore current selection
	             	$L.fastdom.mutate(function(){
				 		input.selectionStart = start;
						input.selectionEnd = end;
				 	})
            	 }
             }
   },

	actions: {
			 wormholeDidConnect : function(){
			 	this.$node.calendarComp = $L('lyte-wormhole',this.$node).e[0];
			 	LyteComponent.appendChild(document.body,this.$node.calendarComp);
			 	this.$node.calendarComp.nodeN=this.$node;
			 	this.$node.calendarDiv = $L('div#lyteCalendar', this.$node.calendarComp).e[0];
			 	this._assCalendar = $L('lyte-calendar',this.$node.calendarDiv).e[0];
			 	var func1 = this.calendarMousedown.bind(this);
			 	this.$node.calendarDiv.addEventListener('mousedown', func1, true);
		    	this.setData('eventListeners.mousedown', func1);
			 },

			 focusClass : function(){
			 	this.$node.classList.add( 'lyteInputFocus' )
			 },

			 calFocusout : function(){
			 	if(!this.preventFocus){
			 		if( this.$node.calendarDiv.classList.contains('lyteCalendarHidden') ) {
			 			return
			 		}
	 	     		this.$node.calendarDiv.classList.add('lyteCalendarHidden')
	 	     		setTimeout( function(){
	 	     			if( this.getMethods( 'onCalendarClose' ) ) {
		 	     			this.executeMethod( 'onCalendarClose', this.$node.calendarDiv, this.$node )
		 	     		}
	 	     		}.bind( this ), 0  )
			 	}else {
			 		delete this.preventFocus;
			 	}
			 },

	 	     "blurThrow":function(event, flag){
	 	     	this.$node.classList.remove( 'lyteInputFocus' )
	 	     	if( !flag ) {
	 	     		var type = this.getData( 'ltPropType' )
	 	     		if( type == 'text' || type == "" ) {
	 	     			this.valUpdate()
	 	     		} else {
	 	     			setTimeout( this.valUpdate.bind( this ), 0 );
	 	     		}
	 	     	}
	 	     },
	 	     "keyup":function(event){
	 	     	if(this.getData('ltPropAutoUpdate')){
	 	     			if(event.keyCode != 9){
			 	     			clearTimeout(this._timeout);
			 	     			this._timeout = setTimeout(this.valUpdate.bind(this), 250);
					 	    }
					}
	 	     },
	 	     "showcalendar":function(event, input){
	 	     	this.$node.classList.add( 'lyteInputFocus' )
	 	     	this.showCalendar(event, input);
	 	     },
	 	    
            // "reset":function(){
            //  	$L('input',this.$node).e[0].value="";
            //  },
             // "fileChange":function(event){
             // 	fileList=$L('input', this.$node).e[0].files;
             // 	var i;
             // 	ErrorMsg=$L('span#preview', this.$node).e[0];
             // 	div=$L('div#lytePreview', this.$node).e[0];
             // 	if(fileList.length)
	            //  	{
	            //  	   if(ErrorMsg)
	            //  	   	{
	            //  	  		ErrorMsg.style.display="none";
	            //  	  		$L('.lyteFileUploadContainer', this.$node).e[0].style.display="block";
	            //  	  	}
	            //  	  var temp=[];
	            //  	  for(i=0;i<fileList.length;i++)
	            //  	  	{
	            //  	  		temp.push(fileList[i]);
	            //  	  	}
	            //  	  this.setData('ltPropFilelist',temp)
	            //  	  // this.setData('fileNo',temp.length)
	            //     }
             // },

             calendarClick : function(evt, input){
             	this.findCalendarRange(evt, input);
             },

             calendarKeydown : function(){
             	this.calendarKeydown.apply(this, arguments)
             },

             timeBlur : function(evt, input){
             	this.$node.classList.remove( 'lyteInputFocus' )
             	this.setData('selectedField', {});
             },

             timeFocus : function(evt, input){
             	this.$node.classList.add( 'lyteInputFocus' )
             	var value = input.value.trim();
             	this.setData('selectedField', {prop : 'hour', val : 0});
             	input.selectionStart = 0;
             	this.fixSelection.call(this, 0, {prop : 'hour', val : 0}, input);
             },

             timeKeydown : function(evt, input){
             	var selectedField = this.getData('selectedField'), meridian = this.getData('meridian'), timeFormat = this.getData('ltPropTimeFormat'), flag = true, oriDrop = this.getData('originalData'), rendered = this.getData('dropdownData');
             	if(selectedField.prop)
	             	{
	             		var start = input.selectionStart, end = input.selectionEnd;
	             		if(start == end){
	             			this.timeClick.call(this, {}, input);
	             			start = input.selectionStart, end = input.selectionEnd;
	             			selectedField = this.getData('selectedField');
	             		}
		         		var keyCode = evt.keyCode
		         		if(keyCode != 9){
		         			evt.preventDefault();
		         		}
		         		if([9, 37, 39].indexOf(keyCode) != -1){
		             		if((evt.shiftKey || keyCode == 37) && selectedField.prop != 'hour' && keyCode != 39){
		             			this.fixSelection.call(this, -3, selectedField, input);
		             			evt.preventDefault();
		             		}
		             		else if((((!evt.shiftKey || keyCode == 39) && selectedField.prop != 'minute' && timeFormat == 24) || (!evt.shiftKey && selectedField.prop != 'meridian' && timeFormat == 12)) && keyCode != 37){
		             			this.fixSelection.call(this, 3, selectedField, input);
		             			evt.preventDefault();
		             		} else{
		             		}
		             		flag = false;

		             	}else if(keyCode >=48 && keyCode <= 57 && selectedField.prop != 'meridian'){
		             		if(selectedField.prop == 'hour'){
		             			this.hourTimeSet.call(this, input, evt, "hour", start, end);
		             		}else if(selectedField.prop == 'minute'){
		             			this.hourTimeSet.call(this, input, evt, 'minute', start, end);
		             		}
		             		this.constructNewDrop(input, timeFormat);
		             	}else if((keyCode == 38 || keyCode == 40) && selectedField.prop != 'meridian'){
		             		if(keyCode == 38){
		             			this.timeIncrease.call(this, input, evt, selectedField.prop, start, end);
		             		}
		             		else{
		             			this.timeDecrease.call(this, input, evt, selectedField.prop, start, end);
		             		}
		             	}else if(selectedField.prop == 'meridian'){
		             		var val = input.value.trim().slice(6,input.value.length), final, key = String.fromCharCode(keyCode).toUpperCase();
		             		if(meridian.PM.toUpperCase().indexOf(key) == 0){
		             			val = meridian.PM;
		             		}else if(meridian.AM.toUpperCase().indexOf(key) == 0){
		             			val = meridian.AM;
		             		}
		             		else if([38, 40].indexOf(keyCode) != -1){
		             			if(val == meridian.PM){
		             				val = meridian.AM
		             			}else{
		             				val = meridian.PM
		             			}
		             		}
		             		if(val == meridian.AM){
		             			if(input.value.trim().slice(0, 2) == '12'){
		             				final = this.replaceVal.call(this, input, '00', 0, 2);
		             			}
		             		}else{
		             			if(input.value.trim().slice(0, 2) == '00'){
		             				final = this.replaceVal.call(this, input, '12', 0, 2);
		             			}
		             		}
		             		if(val){
		             			final = this.replaceVal.call(this, final ? final : input, val, start, end);
		             		}
		             		var returnV = this.maxValCheck(final);
						 	if(returnV == false){
						 		return false;
						 	}
						 	this.setData('ltPropDefaultTime', final);
		             	}
		             	this.fixSelection.call(this, 0, this.getData('selectedField'), input);
		             if(flag)
		             	{
		             		$L.fastdom.mutate(function(){
		             			// restore current selection
						 		input.selectionStart = start;
								input.selectionEnd = end;
						 	})
		             	}
		             if(oriDrop.length != rendered.length && (keyCode < 48 || keyCode > 57)){
		             	this.setData('dropdownData', oriDrop);
		             }	
		          } 
             },

             timeClick : function(){
             	this.timeClick.apply(this, arguments)
             }
     }
});
