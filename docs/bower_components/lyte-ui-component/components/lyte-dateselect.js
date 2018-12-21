Lyte.Component.register("lyte-dateselect", {
_template:"<template tag-name=\"lyte-dateselect\">\t<lyte-popover lt-prop-show=\"{{lbind(ltPropShow)}}\" lt-prop-type=\"{{ltPropType}}\" lt-prop-freeze=\"{{ltPropFreeze}}\" lt-prop-show-close-button=\"{{ltPropShowCloseButton}}\" lt-prop-close-on-escape=\"{{ltPropCloseOnEscape}}\" lt-prop-origin-elem=\"{{ltPropOriginElem}}\" lt-prop-placement=\"{{ltPropPlacement}}\" lt-prop-scrollable=\"{{ltPropScrollable}}\" lt-prop-draggable=\"{{ltPropDraggable}}\" lt-prop-allow-multiple=\"{{ltPropAllowMultiple}}\" lt-prop-max-height=\"{{ltPropMaxHeight}}\" lt-prop-max-width=\"{{ltPropMaxWidth}}\" lt-prop-width=\"{{ltPropWidth}}\" lt-prop-height=\"{{ltPropHeight}}\" lt-prop-wrapper-class=\"{{concat(ltPropWrapperClass, if(showOpen, 'lyteDateSelectWrapper opened', 'lyteDateSelectWrapper'))}}\" lt-prop-boundry=\"{{ltPropBoundry}}\" lt-prop-duration=\"{{ltPropDuration}}\" lt-prop-offset=\"{{ltPropOffset}}\" lt-prop-bind-to-body=\"{{ltPropBindToBody}}\" lt-prop-content-padding=\"{{ltPropContentPadding}}\" lt-prop-dimmer=\"{{ltPropDimmer}}\" on-before-show=\"{{method( 'beforeShow' )}}\" on-show=\"{{method( 'show' )}}\" on-before-close=\"{{method( 'beforeClose' )}}\" on-close=\"{{method( 'close' )}}\" on-resize=\"{{method( 'resize' )}}\" on-scroll=\"{{method( 'scroll' )}}\"> \t\t<template is=\"registerYield\" yield-name=\"popover\">\t\t\t<template is=\"if\" value=\"{{ltPropHeaderYield}}\"><template case=\"true\">\t\t\t\t<lyte-popover-header>\t\t\t\t\t<lyte-yield yield-name=\"header\"></lyte-yield>\t\t\t\t</lyte-popover-header>\t\t\t</template></template>\t\t\t<lyte-popover-content class=\"lyteDateSelect\">\t\t\t\t<div class=\"lytelist\">\t\t\t\t\t<template is=\"forIn\" object=\"{{ltPropOptions}}\" value=\"value\" key=\"key\">\t\t\t\t\t\t<lyte-item key-val=\"{{key}}\" onclick=\"{{action('itemclick', key, this, event)}}\">{{lyteUiI18n(key)}}</lyte-item>\t\t\t\t\t</template>\t\t\t\t</div>\t\t\t\t<div>\t\t\t\t\t<template is=\"if\" value=\"{{ltPropOptions.customRange}}\"><template case=\"true\">\t\t\t\t\t\t<div id=\"lyteRangeCalendar\" style=\"max-width: 0;width: 630px;\" class=\"lyteDateSelectHidden\">\t\t\t\t\t\t\t\t<lyte-daterangepicker lt-prop-current-date=\"{{ltPropCurrentDate}}\" lt-prop-format=\"{{ltPropFormat}}\" lt-prop-month-header-format=\"{{ltPropMonthHeaderFormat}}\" short-month-names=\"{{shortMonthNames}}\" long-month-names=\"{{longMonthNames}}\" lt-prop-start-year=\"{{ltPropStartYear}}\" lt-prop-end-year=\"{{ltPropEndYear}}\" lt-prop-start-date=\"{{lbind(ltPropStartDate)}}\" lt-prop-end-date=\"{{lbind(ltPropEndDate)}}\" cal-view-date1=\"{{lbind(ltPropStartDateObject)}}\" cal-view-date2=\"{{lbind(ltPropEndDateObject)}}\" on-navigation=\"{{method('navigation')}}\" on-date-selected=\"{{method('dateselected')}}\" dd-option-selected=\"{{method( 'ddoption' )}}\" second-selection=\"{{method('secondDateSelectd')}}\" first-selection=\"{{method('ddoption')}}\"></lyte-daterangepicker>\t\t\t\t\t\t\t<lyte-button lt-prop-name=\"{{ltPropName}}\" lt-prop-autofocus=\"{{ltPropAutofocus}}\" lt-prop-appearance=\"{{ltPropAppearance}}\" lt-prop-id=\"{{ltPropId}}\" lt-prop-button-type=\"{{ltPropButtonType}}\" lt-prop-value=\"{{ltPropValue}}\" lt-prop-tabindex=\"{{ltPropTabindex}}\" lt-prop-style=\"{{ltPropStyle}}\" lt-prop-size=\"{{ltPropSize}}\" lt-prop-background-color=\"{{ltPropBackgroundColor}}\" lt-prop-color=\"{{ltPropColor}}\" lyte-shortcut=\"{{lyteShortcut}}\" lt-prop-class=\"{{ltPropClass}}\" onclick=\"{{action('singleClick', 'customRange', event)}}\" lt-prop-disabled=\"{{ltPropDisabled}}\">\t\t\t\t\t\t\t\t<template is=\"registerYield\" yield-name=\"text\">\t\t\t\t\t\t\t\t\tdone\t\t\t\t\t\t\t\t</template>\t\t\t\t\t\t\t</lyte-button>\t\t\t\t\t\t</div>\t\t\t\t\t</template></template>\t\t\t\t\t<template is=\"if\" value=\"{{ltPropOptions.specificDate}}\"><template case=\"true\">\t\t\t\t\t \t<div id=\"lyteSingleCalendar\" style=\"max-width: 0;width: 300px;\" class=\"lyteDateSelectHidden\">\t\t\t\t\t\t\t <lyte-calendar lt-prop-fill-rows=\"{{ltPropFillRows}}\" lt-prop-number-of-rows=\"{{ltPropNumberOfRows}}\" lt-prop-yield=\"{{ltPropYield}}\" lt-prop-format=\"{{ltPropFormat}}\" lt-prop-end-date=\"{{lbind(ltPropEndDate)}}\" lt-prop-start-date=\"{{lbind(ltPropStartDate)}}\" lt-prop-current-date=\"{{lbind(ltPropCurrentDate)}}\" lt-prop-year=\"{{lbind(ltPropYear)}}\" lt-prop-month-header=\"{{lbind(ltPropMonthHeader)}}\" on-date-selected=\"{{method('dateselected1')}}\" lt-prop-min-date=\"{{lbind(ltPropMinDate)}}\" lt-prop-max-date=\"{{lbind(ltPropMaxDate)}}\" lt-prop-start-week-day=\"{{lbind(ltPropStartWeekDay)}}\">\t\t                             <template is=\"if\" value=\"{{ltPropYield}}\"><template case=\"true\"> \t\t                                <template is=\"registerYield\" yield-name=\"footer\">\t\t                                    <lyte-yield yield-name=\"footer\"></lyte-yield>\t\t                                </template>\t\t                             </template></template>   \t\t                      </lyte-calendar> \t\t                      <lyte-button lt-prop-name=\"{{ltPropName}}\" lt-prop-autofocus=\"{{ltPropAutofocus}}\" lt-prop-appearance=\"{{ltPropAppearance}}\" lt-prop-id=\"{{ltPropId}}\" lt-prop-button-type=\"{{ltPropButtonType}}\" lt-prop-value=\"{{ltPropValue}}\" lt-prop-tabindex=\"{{ltPropTabindex}}\" lt-prop-style=\"{{ltPropStyle}}\" lt-prop-size=\"{{ltPropSize}}\" lt-prop-background-color=\"{{ltPropBackgroundColor}}\" lt-prop-color=\"{{ltPropColor}}\" lyte-shortcut=\"{{lyteShortcut}}\" lt-prop-class=\"{{ltPropClass}}\" onclick=\"{{action('singleClick', 'specificDate', event)}}\" lt-prop-disabled=\"{{ltPropDisabled}}\">\t\t\t\t\t\t\t\t<template is=\"registerYield\" yield-name=\"text\">\t\t\t\t\t\t\t\t\tdone\t\t\t\t\t\t\t\t</template>\t\t\t\t\t\t\t</lyte-button>\t\t\t\t\t\t</div>\t\t\t\t\t</template></template>\t\t\t\t\t</div>\t\t\t</lyte-popover-content>\t\t\t<template is=\"if\" value=\"{{ltPropFooterYield}}\"><template case=\"true\">\t\t\t\t<lyte-popover-footer>\t\t\t\t\t<lyte-yield yield-name=\"footer\"></lyte-yield>\t\t\t\t</lyte-popover-footer>\t\t\t</template></template>\t\t</template>\t</lyte-popover>\t</template>",
_dynamicNodes : [{"type":"attr","position":[1]},{"type":"registerYield","position":[1,1],"dynamicNodes":[{"type":"attr","position":[1]},{"type":"if","position":[1],"cases":{"true":{"dynamicNodes":[{"type":"insertYield","position":[1,1]},{"type":"componentDynamic","position":[1]}]}},"default":{}},{"type":"attr","position":[3,1,1]},{"type":"forIn","position":[3,1,1],"dynamicNodes":[{"type":"attr","position":[1]},{"type":"text","position":[1,0]},{"type":"componentDynamic","position":[1]}]},{"type":"attr","position":[3,3,1]},{"type":"if","position":[3,3,1],"cases":{"true":{"dynamicNodes":[{"type":"attr","position":[1,1]},{"type":"componentDynamic","position":[1,1]},{"type":"attr","position":[1,3]},{"type":"registerYield","position":[1,3,1],"dynamicNodes":[]},{"type":"componentDynamic","position":[1,3]}]}},"default":{}},{"type":"attr","position":[3,3,3]},{"type":"if","position":[3,3,3],"cases":{"true":{"dynamicNodes":[{"type":"attr","position":[1,1]},{"type":"attr","position":[1,1,1]},{"type":"if","position":[1,1,1],"cases":{"true":{"dynamicNodes":[{"type":"registerYield","position":[1],"dynamicNodes":[{"type":"insertYield","position":[1]}]}]}},"default":{}},{"type":"componentDynamic","position":[1,1]},{"type":"attr","position":[1,3]},{"type":"registerYield","position":[1,3,1],"dynamicNodes":[]},{"type":"componentDynamic","position":[1,3]}]}},"default":{}},{"type":"componentDynamic","position":[3]},{"type":"attr","position":[5]},{"type":"if","position":[5],"cases":{"true":{"dynamicNodes":[{"type":"insertYield","position":[1,1]},{"type":"componentDynamic","position":[1]}]}},"default":{}}]},{"type":"componentDynamic","position":[1]}],
_observedAttributes :["ltPropSelected","ltPropOptions","ltPropFooterYield","ltPropHeaderYield","ltPropDisabled","ltPropName","ltPropAutofocus","ltPropAppearance","ltPropId","ltPropButtonType","ltPropValue","ltPropTabindex","ltPropStyle","ltPropSize","ltPropBackgroundColor","ltPropColor","lyteShortcut","ltPropClass","ltPropCurrentDate","ltPropFormat","ltPropMonthHeaderFormat","shortMonthNames","longMonthNames","ltPropStartYear","ltPropEndYear","ltPropStartDate","ltPropEndDate","ltPropFillRows","ltPropNumberOfRows","ltPropMinDate","ltPropMaxDate","ltPropStartWeekDay","daysOfWeek","ltPropYear","viewDate","ltPropShow","ltPropType","ltPropFreeze","ltPropShowCloseButton","ltPropCloseOnEscape","ltPropOriginElem","ltPropPlacement","ltPropScrollable","ltPropDraggable","ltPropAllowMultiple","ltPropMaxHeight","ltPropMaxWidth","ltPropWidth","ltPropHeight","ltPropWrapperClass","ltPropBoundry","ltPropCloseOnBodyClick","ltPropDuration","ltPropOffset","ltPropBindToBody","ltPropContentPadding","ltPropDimmer","showOpen"],

	init : function(){
		if( this.getMethods( 'beforeRender' ) ) {
			this.executeMethod( 'beforeRender', this.$node )
		}
	},

	didConnect : function(){
		this._end = this.transitionEndEventHide.bind( this )
		this._start = this.transitionEndEventShow.bind( this )
		this._popover = this.$node.querySelector( 'lyte-popover' )
		if( this.getMethods( 'afterRender' ) ) {
			this.executeMethod( 'afterRender', this.$node )
		}
	},

	data : function(){
		return {

			ltPropSelected : Lyte.attr('string', { default : 'specificDate'}),
			ltPropOptions : Lyte.attr( 'object', { default : {
				today :  true,
				yesterday : true,
				last7days : true,
				last30days : true,
				thisWeek : true,
				thisMonth : true,
				specificDate : true,
				customRange : true
			}}),
			ltPropFooterYield : Lyte.attr( 'boolean', { default : false } ),
			ltPropHeaderYield : Lyte.attr( 'boolean', { default : false } ),

			// button props

			ltPropDisabled : Lyte.attr( 'boolean', { default : true } ),
			'ltPropName': Lyte.attr( 'string', {
				'default': undefined
			} ),
			'ltPropAutofocus': Lyte.attr( 'boolean', {
				'default': false
			} ),
			'ltPropAppearance': Lyte.attr( 'string', {
				'default': 'primary'
			} ),
			'ltPropId': Lyte.attr( 'string', {
				'default': undefined
			} ),
			'ltPropButtonType': Lyte.attr( 'string', {
				'default': 'button'
			} ),
			'ltPropValue': Lyte.attr( 'string', {
				'default': undefined
			} ),
			'ltPropTabindex': Lyte.attr( 'string', {
				'default': undefined
			} ),
			'ltPropStyle': Lyte.attr( 'string', {
				'default': undefined
			} ),
			'ltPropSize': Lyte.attr( 'string', {
				'default': undefined
			} ),
			'ltPropBackgroundColor': Lyte.attr( 'string', {
				'default': undefined
			} ),
			'ltPropColor': Lyte.attr( 'string', {
				'default': undefined
			} ),
			'lyteShortcut': Lyte.attr( 'object', {
				'default': {}
			} ),
			'ltPropClass':Lyte.attr( 'string', {
				'default': ''
			} ),

			// data for date range picker
			ltPropCurrentDate : Lyte.attr( "string" , { "default" :'' } ),
			ltPropFormat : Lyte.attr( "string", { "default" : "MM/DD/YYYY" } ),
			ltPropMonthHeaderFormat : Lyte.attr( "string", { "default" : "MMM YYYY" } ),
			shortMonthNames : Lyte.attr( "array" , { "default" : [ 'Jan', 'Feb', 'Mar', 'Apr', 'short.may', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec' ]}),
			longMonthNames : Lyte.attr( 'array', { 
				'default': [
				'January',
				'February',
				'March',
				'April',
				'May',
				'June',
				'July',
				'August',
				'September',
				'October',
				'November',
				'December' 
				]
			} ),
			ltPropStartYear : Lyte.attr( "number" , { "default" : 1900 } ),
			ltPropEndYear : Lyte.attr( "number", { "default" : 2100 } ),
			ltPropStartDate : Lyte.attr( "string", { "default" : "" } ),
			ltPropEndDate : Lyte.attr( "string", { "default" : "" } ),
			// ltPropStartDateObject : Lyte.attr( "object" ),
			// ltPropEndDateObject : Lyte.attr("object"),

			// data for single calendar
			ltPropFillRows : Lyte.attr('boolean', {default : false}),
			ltPropNumberOfRows : Lyte.attr('number', {default : 6}),
			ltPropMinDate : Lyte.attr('string', { default : ""}),
			ltPropMaxDate : Lyte.attr('string', { default : ""}),
			ltPropStartWeekDay : Lyte.attr('number', { default : 1}),
			daysOfWeek : Lyte.attr("array",{"default":['Sun','Mon','Tue','Wed','Thu','Fri','Sat']}),
			ltPropYear : Lyte.attr("boolean",{"default":true}),
			viewDate : Lyte.attr("object",{"default":{}}),

			// data for popover
			ltPropShow : Lyte.attr("boolean", { "default" : false } ),
            ltPropType : Lyte.attr( "string", { "default" : "box" } ),
            ltPropFreeze : Lyte.attr( "boolean", { "default" : false } ),
            ltPropShowCloseButton : Lyte.attr( "boolean", { "default" : false } ),
            ltPropCloseOnEscape : Lyte.attr( "boolean", { "default" : true } ),
            ltPropOriginElem : Lyte.attr( "string", { "default" : "" } ),
            "ltPropPlacement":Lyte.attr("string",{"default":""}),
            "ltPropScrollable":Lyte.attr("boolean",{"default": false}),
            "ltPropDraggable":Lyte.attr("boolean",{"default": true}),
            "ltPropAllowMultiple":Lyte.attr("boolean",{"default": false}),
            "ltPropMaxHeight":Lyte.attr("string",{"default":""}),
            "ltPropMaxWidth":Lyte.attr("string",{"default":""}),
            "ltPropWidth":Lyte.attr("string",{"default":""}),
            "ltPropHeight":Lyte.attr("string",{"default":"370px"}),
            "ltPropWrapperClass":Lyte.attr("string",{"default":""}),
            "ltPropBoundry" : Lyte.attr("object",{"default":{}}),
            "ltPropCloseOnBodyClick" : Lyte.attr("boolean",{"default" : false}),
            "ltPropDuration" : Lyte.attr("number",{"default" : 800}),
            "ltPropOffset" : Lyte.attr("object",{"default" : {}}),
            "ltPropBindToBody" : Lyte.attr("boolean",{"default":false}),
            "ltPropContentPadding":Lyte.attr("string",{"default":"0"}),
            "ltPropDimmer":Lyte.attr("object",{"default":{"color":"black","opacity":"0.4"}}),

            // system

            showOpen : Lyte.attr( 'boolean', { default : false} )

		}		
	},

	didDestroy : function(){
		// document.body.removeChild( this.childComp );
	},

	selectedValFunc : function(arg){
		if( !this.getData( 'ltPropShow' ) ) {
			return;
		}
		var selected = this.getData( 'ltPropSelected' );
		arg = arg || {};
		var el = this._popover.component.actualModalDiv || this.$node.querySelector( '.lytePopover' )
		$L.fastdom.mutate(function(){
			var elem, val1 = el.querySelector( '#lyteRangeCalendar' ), val2 = el.querySelector( '#lyteSingleCalendar' );
			if( selected == 'specificDate'){
				this.animate( val2, val1 )
			} else if ( selected == 'customRange' ) {
				this.animate( val1, val2 )
			}
			else if( arg.oldValue == 'specificDate' && val2 ){
				this.animate( null, val2 )
			} else if ( arg.oldValue == 'customRange' && val1 ){
				this.animate( null, val1 )
			} 
			else {
				if([ 'customRange', 'specificDate' ].indexOf( arg.newValue ) == -1 ) {
					this.setData( 'ltPropShow', false )
				}
			}

			if( arg && arg.oldValue == 'customRange' ) {
				this.setData( 'ltPropStartDate' , '')
				this.setData( 'ltPropStartDate' , '')
			} else if( arg && arg.oldValue == "specificDate" ) {
				this.setData( 'ltPropCurrentDate', '' )
			}
		}.bind( this )) 
	},

	selectionObs : function(arg){
		this.selectedValFunc( arg )
	}.observes( 'ltPropSelected' ),

	animate : function( animate, hide ){
		// show hide animation starts here can't use fastdom due to delay
		if( hide && !hide.classList.contains( 'lyteDateSelectHidden' ) && !hide._hideStart ) {
			hide._hideStart = true;
			if( animate ){
				hide._animate = animate;
				animate.addEventListener( 'transitionend', this._start )
				// this.setCrctPos( animate )
			} 
			else if( animate == null ) {
				this._hide = true
				hide.addEventListener( 'transitionend', this._end )
				hide.style.maxWidth = 0;
				return
			}
			hide.addEventListener( 'transitionend', this._end )
			hide.style.maxWidth = 0;
			return;
		}
	   if( animate && !animate._showstart && animate.classList.contains( 'lyteDateSelectHidden' ) ) {
	   		animate.addEventListener( 'transitionend', this._start )
	   	    this.startAnime( animate )
	   	    // setTimeout( function(){
	   	    // 	this.setCrctPos( animate )
	   	    // }.bind( this ) , 40 )
	   }
	},

	// setCrctPos : function( elem ) {
	// 	// adjusting positions
	// 	$L.fastdom.measure(function(){
	// 		var pos = this._popover.ltProp( 'positionNew' ),
	// 		act = this._popover.component.actualModalDiv || this.$node.querySelector( '.lytePopover' ), currLeft = parseInt( act.style.left ), originElem = document.querySelector( this.getData( 'ltPropOriginElem' ).trim() ).getBoundingClientRect(),
	// 		elemWidth = act.querySelector('.lytelist').getBoundingClientRect().width, actWid = act.getBoundingClientRect(), currLeft, gcstyle = window.getComputedStyle(act.querySelector('lyte-popover-content'));
	// 		if( currLeft < originElem.left ){
	// 			if( pos == 'left' ){
	// 				currLeft = Math.max( 0, originElem.left - this._callout - elemWidth - parseInt( gcstyle.paddingRight ) - parseInt( gcstyle.paddingLeft ))
	// 			} else {
	// 				currLeft = Math.min( originElem.left, window.innerWidth - elemWidth);
	// 			}
	// 		}
	// 		$L.fastdom.mutate(function(){
				
	// 			if( currLeft != undefined ) {
	// 				act.style.left = currLeft + 'px';
	// 			}
	// 		}.bind( this ))
	// 	}.bind( this ))
	// },

	getCrctLeft : function( elem ){
		// calculating positions
	   var act = this._popover.component.actualModalDiv || this.$node.querySelector( '.lytePopover' ), currLeft = parseInt( act.style.left ), originElem = document.querySelector( this.getData( 'ltPropOriginElem' ).trim() ).getBoundingClientRect()
	   if( this._popover.ltProp( 'positionNew' ) == 'left' ) {
		   if( currLeft < originElem.left ){
		   		var elemWidth = parseInt( elem.style.width ), actWid = act.getBoundingClientRect();
		   		currLeft = originElem.left - elemWidth - actWid.width - this._callout;
		   }
	   } else {
	   		var wwidth = window.innerWidth;
	   		if( currLeft > wwidth ) {
	   			currLeft = wwidth - elemWidth - actWid.width - this._callout
	   		}
	   }
	   if( currLeft != undefined ) {
	   	  act.style.left = Math.max( currLeft, 0 ) + 'px';
	   }
	},

	startAnime : function(elem){
		// animation start
		elem.classList.remove( 'lyteDateSelectHidden' )
		setTimeout(function(){
			elem.style.removeProperty('max-width')
			elem._showstart = true;
		}.bind( this ), 20)
		this.getCrctLeft(elem)
	},

	transitionEndEventHide : function(event){
		// animation end
		 if( event.propertyName != 'max-width' ) {
		 	return
		 }
		var _this = event.target;
		_this.classList.add( 'lyteDateSelectHidden' );
		_this.removeEventListener( 'transitionend', this._end );
		delete _this._hideStart;
		if( _this._animate ){
			this.startAnime(_this._animate)
			delete _this._animate;
		} else if( this._hide ) {
			delete this._hide;
			this.setData( 'ltPropShow', false )
		}
	},

	transitionEndEventShow : function(event){
		// animation end
		if( event.propertyName != 'max-width' ) {
		 	return
		 }
		var _this = event.target
		delete _this._showstart;
		_this.removeEventListener('transitionend', this._start )
		if( this._arg ) {
			if( this.getMethods( 'onShow' ) ){
				this.executeMethod( 'onShow', this._arg)
			}
			delete this._arg;
		}
	},

	methods : {
		beforeShow : function(){
			var selected = this.getData( 'ltPropSelected' )
			var el = this._popover.component.actualModalDiv || this.$node.querySelector( '.lytePopover' ), elem;
			if( selected == 'customRange' ) {
				elem = el.querySelector( '#lyteRangeCalendar')
			} else if( selected == 'specificDate' ) {
				elem = el.querySelector( '#lyteSingleCalendar')
			}
			if( elem ) {
				$L.fastdom.mutate(function(){
					elem.classList.remove( 'lyteDateSelectHidden' )
					elem.style.removeProperty('max-width')
				})
			}
			if( this.getMethods( 'onBeforeShow' ) ){
				return this.executeMethod( 'onBeforeShow' )
			}
		},

		show : function( arg){
			var el = this._popover.component.actualModalDiv || this.$node.querySelector( '.lytePopover' )
			$L.fastdom.measure(function(){
				if( this._popover.ltProp('positionNew') == 'left' ) {
					var elBcr = el.getBoundingClientRect(), originElem = document.querySelector( this.getData( 'ltPropOriginElem' ).trim() ).getBoundingClientRect()
					if( elBcr.right < originElem.left){
						this._callout = originElem.left - elBcr.right;
					} else {
						this._callout = 0
					}
				} else {
					this._callout = 0
				}
			}.bind(this))
			$L.fastdom.mutate(function(){
				var selected = this.getData( 'ltPropSelected' )
				var selEl = el.querySelector("[key-val = '"+ selected +"']:not(.lyteCalendarSelected)");
				if( selEl ) {
					selEl.classList.add('lyteCalendarSelected')
				}
				this.setData( 'showOpen' , true)

				if( this.getMethods( 'onShow' ) ){
					this.executeMethod( 'onShow', arg)
				}
			}.bind(this))
		},

		beforeClose : function(){
			if( this.getMethods( 'onBeforeClose' ) ){
				return this.executeMethod( 'onBeforeClose', arguments[ 0 ], arguments[ 1 ] )
			}
		},

		close : function(){
			this.setData( 'ltPropDisabled', true )
			this.setData( 'showOpen' , false)
			if( this.getMethods( 'onClose' ) ){
				this.executeMethod( 'onClose', arguments[ 0 ] )
			}
			this.setData( 'ltPropCurrentDate', '' )
			this.setData( 'ltPropStartDate' , '')
			this.setData( 'ltPropStartDate' , '')
		},

		resize : function(){
			if( this.getMethods( 'onResize' ) ){
				this.executeMethod( 'onResize', arguments[ 0 ], arguments[ 1 ] )
			}
		},

		scroll : function(){
			if( this.getMethods( 'onScroll' ) ){
				return this.executeMethod( 'onScroll', arguments[ 0 ], arguments[ 1 ] )
			}
		},

		dateselected : function( event, date, object){
			this.setData( 'ltPropDisabled', false )
			if( this.getMethods( 'onRangeDateSelected' ) ){
				return this.executeMethod( 'onRangeDateSelected', event, data, object )
			}
		},

		dateselected1 : function( event, date, object){
			this.setData( 'ltPropDisabled', false )
			if( this.getMethods( 'onSingleDateSelected' ) ){
				return this.executeMethod( 'onSingleDateSelected', event, data, object )
			}
		},

		navigation : function( arg1, arg2, arg3 ) {
			this.setData( 'ltPropDisabled', true )
			this.setData( 'ltPropCurrentDate', '' )
			this.setData( 'ltPropStartDate' , '')
			this.setData( 'ltPropStartDate' , '')
			if( this.getMethods( 'onNavigation' ) ) {
				this.executeMethod( 'onNavigation', arg1, arg2, arg3 )
			}
		},

		secondDateSelectd : function(){
			this.setData( 'ltPropDisabled', false )
		},

		ddoption : function(){
			this.setData( 'ltPropDisabled', true )
		}
	},

	actions : {
		itemclick : function( key, _this, event){
			this.setData( 'ltPropDisabled', true )
			var prevSel = $L('.lyteCalendarSelected', _this.parentElement)
			if( prevSel.e.length ) {
				prevSel.removeClass( 'lyteCalendarSelected' )
			}
			_this.classList.add('lyteCalendarSelected')
			this.$node.ltProp( 'selected', key );
			if([ 'customRange', 'specificDate' ].indexOf( key ) == -1 ) {
				if( this.getMethods( 'onSelect' ) ) {
					this.executeMethod( 'onSelect', key, event, this.$node)
				}
			}
		},

		singleClick : function(key, event ){
			if( this.getMethods( 'onSelect' ) ) {
				if( key == 'customRange' ) {
					this.executeMethod( 'onSelect', key, event, this.$node, this.getData( 'ltPropStartDate' ), this.getData( 'ltPropEndDate' ) )
				} else {
					this.executeMethod( 'onSelect', key, event, this.$node, this.getData( 'ltPropCurrentDate' ) )
				}
			}
			this.setData( 'ltPropShow', false )
		}
	}
});
