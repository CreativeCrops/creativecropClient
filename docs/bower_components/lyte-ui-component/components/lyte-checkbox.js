Lyte.Component.register( 'lyte-checkbox', {
_template:"<template tag-name=\"lyte-checkbox\">\t<template is=\"switch\" value=\"{{ltPropType}}\">\t\t<template case=\"default\">\t\t\t<label class=\"lyteCheckbox lyteDefault\" onmouseup=\"{{action('mup',event)}}\" onclick=\"{{action('prevent',event)}}\">\t\t\t\t<input type=\"checkbox\" id=\"{{ltPropId}}\" name=\"{{ltPropName}}\" value=\"{{ltPropValue}}\" checked=\"{{ltPropChecked}}\" disabled=\"{{ltPropDisabled}}\" class=\"\" readonly=\"{{ltPropReadonly}}\" onclick=\"{{action('checkBoxClicked',event)}}\">\t\t\t\t<span class=\"{{ltPropClass}}\">\t\t\t\t\t<span class=\"{{ltPropLabelClass}}\">\t\t\t\t\t\t{{ltPropLabel}}\t\t\t\t\t</span>\t\t\t\t</span>\t\t\t</label>\t\t\t</template>\t\t<template case=\"primary\">\t\t\t<label class=\"lyteCheckbox lytePrimary\" onmouseup=\"{{action('mup',event)}}\" onclick=\"{{action('prevent',event)}}\">\t\t\t\t<input type=\"checkbox\" id=\"{{ltPropId}}\" name=\"{{ltPropName}}\" value=\"{{ltPropValue}}\" checked=\"{{ltPropChecked}}\" disabled=\"{{ltPropDisabled}}\" class=\"\" readonly=\"{{ltPropReadonly}}\" onclick=\"{{action('checkBoxClicked',event)}}\">\t\t\t\t<span class=\"{{ltPropClass}}\">\t\t\t\t\t<span class=\"{{ltPropLabelClass}}\">\t\t\t\t\t\t{{ltPropLabel}}\t\t\t\t\t</span>\t\t\t\t</span>\t\t\t</label>\t\t\t</template>\t\t<template case=\"switch\">\t\t\t<label class=\"\" onmouseup=\"{{action('mup',event)}}\" onclick=\"{{action('prevent',event)}}\">\t\t\t\t<input type=\"checkbox\" id=\"{{ltPropId}}\" name=\"{{ltPropName}}\" value=\"{{ltPropValue}}\" checked=\"{{ltPropChecked}}\" disabled=\"{{ltPropDisabled}}\" class=\"lyteHide on-off-sw\" readonly=\"{{ltPropReadonly}}\" onclick=\"{{action('checkBoxClicked',event)}}\">\t\t\t\t<span class=\"{{ltPropClass}}\">\t\t\t\t\t<span class=\"on-btn\"></span>\t\t\t\t</span>\t\t\t\t<span class=\"{{ltPropLabelClass}}\">\t\t\t\t\t{{ltPropLabel}}\t\t\t\t</span>\t\t\t</label>\t\t\t</template>\t\t<template case=\"slider\">\t\t\t<label class=\"lyteCheckSliderLabel\" onmouseup=\"{{action('mup',event)}}\" onclick=\"{{action('prevent',event)}}\">\t\t\t\t<input type=\"checkbox\" id=\"{{ltPropId}}\" name=\"{{ltPropName}}\" value=\"{{ltPropValue}}\" checked=\"{{ltPropChecked}}\" disabled=\"{{ltPropDisabled}}\" class=\"lyteHide\" readonly=\"{{ltPropReadonly}}\" onclick=\"{{action('checkBoxClicked',event)}}\">\t\t\t\t<span class=\"{{ltPropClass}}\">\t\t\t\t\t<span class=\"{{ltPropLabelClass}}\">\t\t\t\t\t\t{{ltPropLabel}}\t\t\t\t\t</span>\t\t\t\t</span>\t\t\t\t\t\t\t</label>\t\t\t</template>\t</template></template>",
_dynamicNodes : [{"type":"attr","position":[1]},{"type":"switch","position":[1],"cases":{"default":{"dynamicNodes":[{"type":"attr","position":[1]},{"type":"attr","position":[1,1]},{"type":"attr","position":[1,3]},{"type":"attr","position":[1,3,1]},{"type":"text","position":[1,3,1,1]}]},"primary":{"dynamicNodes":[{"type":"attr","position":[1]},{"type":"attr","position":[1,1]},{"type":"attr","position":[1,3]},{"type":"attr","position":[1,3,1]},{"type":"text","position":[1,3,1,1]}]},"switch":{"dynamicNodes":[{"type":"attr","position":[1]},{"type":"attr","position":[1,1]},{"type":"attr","position":[1,3]},{"type":"attr","position":[1,5]},{"type":"text","position":[1,5,1]}]},"slider":{"dynamicNodes":[{"type":"attr","position":[1]},{"type":"attr","position":[1,1]},{"type":"attr","position":[1,3]},{"type":"attr","position":[1,3,1]},{"type":"text","position":[1,3,1,1]}]}},"default":{}}],
_observedAttributes :["ltPropType","ltPropId","ltPropDisabled","ltPropChecked","ltPropLabel","ltPropName","ltPropValue","ltPropReadonly","ltPropFireOnInit","ltPropClass","ltPropLabelClass"],
	data: function() {
    	return {
			'ltPropType': Lyte.attr( 'string', { 
				'default': 'default' 
			} ),
			'ltPropId': Lyte.attr( 'string', { 
				'default': undefined
			} ),
			'ltPropDisabled': Lyte.attr( 'boolean', {
				'default': false
			} ),
			'ltPropChecked': Lyte.attr( 'boolean', { 
				'default': false 
			} ),
			'ltPropLabel': Lyte.attr( 'string', { 
				'default': undefined
			} ),
			'ltPropName': Lyte.attr( 'string', {
				'default': undefined
			} ),
			'ltPropValue': Lyte.attr( 'string', { 
				'default': undefined
			} ),
			'ltPropReadonly': Lyte.attr( 'boolean', {
				'default': false
			} ),
			'ltPropFireOnInit': Lyte.attr( 'boolean', { 
				'default': false
			} ),
			'ltPropClass': Lyte.attr( 'string', {
				'default': ''
			} ),
			'ltPropLabelClass': Lyte.attr( 'string', { 
				'default': '' 
			} )
		}
	},

	reduceOpacity: function() {
		if( this.getData( 'ltPropDisabled' ) ) {
			this.$node.style.opacity = '0.5';
		}
		else {
			this.$node.style.opacity = '';
		}
	},

	disabledChange: function() {
		this.reduceOpacity();
	}.observes( 'ltPropDisabled' ),

	init: function() {
		var type = this.getData( 'ltPropType' ), cls = this.getData( 'ltPropClass' ),
		label = this.getData( 'ltPropLabelClass' );

		this.reduceOpacity();
		if( type === 'switch' && cls === '' ) {
			this.setData( 'ltPropClass', 'lyteCheckSwitch' );
		}
		else if( type === 'default' && cls === '' ) {
			this.setData( 'ltPropClass', 'lyteCheckBoxDefault' );
		}
		else if( type === 'primary' && cls === '' ) {
			this.setData( 'ltPropClass', 'lyteCheckBoxPrimary' );
		}
		else if( type === 'slider' && cls === '' ){
			this.setData( 'ltPropClass', 'lyteCheckSlider' );
		}

		if( type === 'slider' && label === '' ){
			this.setData( 'ltPropLabelClass', 'lyteCheckSliderText' );
		}
	},

	didConnect: function() {
		this.fireCallBacksFunction.call( this, undefined, true );
	},

	fireCallbacks:function(arg1,onrender) {
		if( this.getData( 'preventRefire' ) ) {
			return ;
		}
		
		this.fireCallBacksFunction.call( this, arg1, onrender );
	}.observes( 'ltPropChecked' ),

	fireCallBacksFunction: function( arg1, onrender ) {
		var checked = this.getData( 'ltPropChecked' ), 
		foi = this.getData( 'ltPropFireOnInit' ), returnval,
		eventCache = this.getData( 'eventCache' );

		this.$node.checked = checked ? checked : false;

		if( checked && onrender ) {
			if( !foi ) {
				return ;
			}

			var input = this.$node.querySelector( 'input' );
			if( this.getMethods( 'onBeforeChecked' ) ) {
				this.executeMethod( 'onBeforeChecked', input, this, eventCache );
			}

			if( this.getMethods( 'onChecked' ) ) {
				this.executeMethod( 'onChecked', input, this, eventCache )
			}

			if( this.getMethods( 'onChanged' ) ) {
				this.executeMethod('onChanged', input, this, eventCache )
			}
		}
		else if( this.$node.checked && !onrender ) {
			var input = this.$node.querySelector( 'input' )
			if( !this.clicked ) {
				if( this.getMethods( 'onBeforeChecked' ) ) {
					returnval = this.executeMethod( 'onBeforeChecked', input, this, eventCache ) == false ? false : true;
					if( !returnval ) {
						this.set( 'preventRefire', true );
						this.setData( 'ltPropChecked', false );
						this.set( 'preventRefire', false );
						return ;
					}
				}
			}

			input.checked = true
			if( this.getMethods( 'onChecked' ) ) {
				this.executeMethod( 'onChecked', input, this, eventCache );
			}

			if( this.getMethods( 'onChanged' ) ) {
				this.executeMethod( 'onChanged', input, this, eventCache );
			}
		}
		else if( !this.$node.checked && !onrender ) {
			var input = this.$node.querySelector( 'input' )
			if( !this.clicked ){
				if( this.getMethods( 'onBeforeUnchecked' ) ) {
					returnval = this.executeMethod( 'onBeforeUnchecked', input, this, eventCache ) == false ? false : true;
					if( !returnval ) {
						this.setData( 'preventRefire', true );
						this.setData( 'ltPropChecked', true);
						this.setData( 'preventRefire', false);
						return ;
					}
				}
			}

			input.checked = false
			if( this.getMethods( 'onUnchecked' ) ) {
				this.executeMethod( 'onUnchecked', input, this, eventCache );
			}

			if( this.getMethods( 'onChanged' ) ) {
				this.executeMethod( 'onChanged', input, this, eventCache );
			}
		}

	},

	actions: {
		mup: function( event ) {
			this.setData( 'sendEvent', false );
			var disabled = this.getData( 'ltPropDisabled' ), checked, returnval;
			if( disabled ) {
				return ;
			}

			var ele =  this.$node.querySelector( 'input' )
			checked = ele.checked
			if( this.getMethods( 'onBeforeChecked' ) && !checked ) {
				returnval = this.executeMethod( 'onBeforeChecked', ele, this, event ) == false ? false : true;
				if( !returnval ) {
					this.setData( 'prevented', true );
					event.preventDefault();
				}
			}

			if( this.getMethods( 'onBeforeUnchecked' ) && checked ) {
				returnval = this.executeMethod( 'onBeforeUnchecked', ele, this, event ) == false ? false : true;
				if( !returnval ) {
					this.setData( 'prevented', true )
					event.preventDefault();
				}
			}
		},

		prevent: function( event ) {
			var se = this.getData( 'sendEvent' );

			if( !se ) {
				event.stopPropagation();
			}
		},

		checkBoxClicked: function( event ) {
			this.setData( 'sendEvent', true );
			this.setData( 'eventCache', event );
			this.clicked = true
			var input;
			if( this.getData( 'prevented' ) ) {
				input = this.$node.querySelector( 'input' );
				this.setData( 'prevented', false )
				this.setData( 'preventRefire', true )
				if( input.checked ) {
					input.checked = false
				}
				else {
					input.checked = true
				}

				this.setData( 'preventRefire', false )
				this.clicked = false
				this.setData( 'eventCache', undefined );
				return;
			}

			if( this.getData( 'ltPropDisabled' ) ) {
				this.clicked = false
				event.preventDefault()
				this.setData( 'eventCache', undefined );
				return ;
			}

			var checked
			var ele = event.target
			checked = ele.checked;

			if( !checked ) {
				this.setData( 'ltPropChecked', false )
			}
			else{
				this.setData( 'ltPropChecked', true ) 
			}

			this.setData( 'eventCache', undefined );

			this.clicked = false
		}
	}
});
