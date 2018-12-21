Lyte.Component.register( 'lyte-radiobutton', {
_template:"<template tag-name=\"lyte-radiobutton\">\t<template is=\"switch\" value=\"{{ltPropType}}\"><template case=\"default\"></template><template case=\"primary\"></template><template case=\"secondary\">\t\t\t<label class=\"{{radioclass}}\" onmouseup=\"{{action('mup',event)}}\">\t\t\t\t<input type=\"radio\" name=\"{{ltPropName}}\" value=\"{{ltPropValue}}\" class=\"lyteHide\" onclick=\"{{action('valueChanged',event)}}\" disabled=\"{{ltPropDisabled}}\" checked=\"{{ltPropChecked}}\">\t\t\t\t<span class=\"{{ltPropClass}}\">\t\t\t\t\t<span class=\"lyteRadioCheck\">\t\t\t\t\t</span>\t\t\t\t</span>\t\t\t\t<span class=\"{{ltPropLabelClass}}\">\t\t\t\t\t{{ltPropLabel}}\t\t\t\t</span>\t\t\t</label>\t\t\t</template><template case=\"switch\">\t\t\t<label class=\"\" onmouseup=\"{{action('mup',event)}}\">\t\t\t\t<input type=\"radio\" name=\"{{ltPropName}}\" value=\"{{ltPropValue}}\" checked=\"{{unbound(ltPropChecked)}}\" disabled=\"{{ltPropDisabled}}\" class=\"lyteHide on-off-sw\" readonly=\"{{ltPropReadonly}}\" onclick=\"{{action('valueChanged',event)}}\">\t\t\t\t<span class=\"{{ltPropClass}}\">\t\t\t\t\t<span class=\"on-btn\"></span>\t\t\t\t</span>\t\t\t\t<span class=\"{{ltPropLabelClass}}\">\t\t\t\t\t{{ltPropLabel}}\t\t\t\t</span>\t\t\t</label>\t\t\t</template><template case=\"slider\">\t\t\t<label class=\"lyteRadioSliderLabel\" onmouseup=\"{{action('mup',event)}}\">\t\t\t\t<input type=\"radio\" id=\"{{ltPropId}}\" name=\"{{ltPropName}}\" value=\"{{ltPropValue}}\" checked=\"{{unbound(ltPropChecked)}}\" disabled=\"{{ltPropDisabled}}\" class=\"lyteHide\" readonly=\"{{ltPropReadonly}}\" onclick=\"{{action('valueChanged',event)}}\">\t\t\t\t<span class=\"{{ltPropClass}}\">\t\t\t\t\t<span class=\"{{ltPropLabelClass}}\">\t\t\t\t\t\t{{ltPropLabel}}\t\t\t\t\t</span>\t\t\t\t</span>\t\t\t\t\t\t\t</label>\t\t</template></template></template>",
_dynamicNodes : [{"type":"attr","position":[1]},{"type":"switch","position":[1],"cases":{"default":{"dynamicNodes":[],"additional":{"next":"primary"}},"primary":{"dynamicNodes":[],"additional":{"next":"secondary"}},"secondary":{"dynamicNodes":[{"type":"attr","position":[1]},{"type":"attr","position":[1,1]},{"type":"attr","position":[1,3]},{"type":"attr","position":[1,5]},{"type":"text","position":[1,5,1]}]},"switch":{"dynamicNodes":[{"type":"attr","position":[1]},{"type":"attr","position":[1,1]},{"type":"attr","position":[1,3]},{"type":"attr","position":[1,5]},{"type":"text","position":[1,5,1]}]},"slider":{"dynamicNodes":[{"type":"attr","position":[1]},{"type":"attr","position":[1,1]},{"type":"attr","position":[1,3]},{"type":"attr","position":[1,3,1]},{"type":"text","position":[1,3,1,1]}]}},"default":{}}],
_observedAttributes :["ltPropType","ltPropName","ltPropDisabled","ltPropChecked","ltPropLabel","ltPropValue","ltPropFireOnInit","ltPropLabelClass","ltPropClass","ltPropColor"],
	data: function() {
		return {
			'ltPropType': Lyte.attr( 'string', { 
				'default': 'default'
			} ),
			'ltPropName': Lyte.attr( 'string', { 
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
			'ltPropValue': Lyte.attr( 'string', { 
				'default': undefined
			} ),
			'ltPropFireOnInit': Lyte.attr( 'boolean', { 
				'default': false
			} ),
			'ltPropLabelClass': Lyte.attr( 'string', { 
				'default':'' 
			} ),
			'ltPropClass': Lyte.attr( 'string', { 
				'default': '' 
			} ),

			/* Experimental Feature */

			'ltPropColor': Lyte.attr( 'string', { 
				'default': '#72C98A'
			} )

			/* Experimental Feature */
		}
	},

	changeStyle: function() {
		this.changeStyleFunction()
	}.observes( 'ltPropType' ),

	changeStyleFunction: function() {

		var type = this.getData( 'ltPropType' ), 
		checked = this.getData('ltPropChecked'),
		cls = this.getData( 'ltPropClass' ), 
		labelCls = this.getData( 'ltPropLabelClass' );

		if( 
			type.indexOf( 'slider' ) === -1 
			&& type.indexOf( 'switch' ) === -1 
			&& type.indexOf( 'default' ) === -1 
			&& type.indexOf( 'primary' ) === -1 
			&& type.indexOf( 'secondary' ) === -1 
		) {
			this.setData( 'ltPropType', 'default' );
		}

		if( type.indexOf( 'default' ) !== -1 ) {
			this.setData( 'radioclass', 'lyteRadioBtn lyteDefault' )
			this.setData( 'ltPropClass', cls ? cls : 'lyteRadioLayer' ) 
			this.setData( 'ltPropLabelClass', labelCls ? labelCls : 'lyteRadioLabel' )
		}
		else if( type.indexOf( 'primary' ) !== -1 && !cls ) {
			this.setData( 'radioclass', 'lyteRadioBtn lytePrimary' )
			this.setData( 'ltPropClass', cls ? cls : 'lyteRadioLayer' )
			this.setData( 'ltPropLabelClass', labelCls ? labelCls : 'lyteRadioLabel' )
		}
		else if( type.indexOf( 'secondary' ) !== -1 && !cls ) {
			this.setData( 'radioclass', 'lyteRadioBtn lyteSecondary' )
			this.setData( 'ltPropClass', cls ? cls : 'lyteRadioLayer' )
			this.setData( 'ltPropLabelClass', labelCls ? labelCls : 'lyteRadioLabel' )
		}
		else if( type.indexOf( 'switch' ) !== -1 ) {
			this.setData( 'ltPropClass', cls ? cls : 'lyteRadioSwitch' )	
		}
		else if( type.indexOf('slider') !== -1 ) {
			this.setData( 'ltPropClass', cls ? cls : 'lyteRadioSlider' )	
			this.setData( 'ltPropLabelClass', labelCls ? labelCls : 'lyteRadioSliderText' )	
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
		this.reduceOpacity();
		this.changeStyleFunction();
	},

	didConnect: function() {
		this.colorizeSwitch( true );
		this.callMethodsOnInit( true );
	},

	colorizeSwitch: function( onrender ) {
		/* Experimental Features */

		var type = this.getData( 'ltPropType' ), 
		checked = this.getData( 'ltPropChecked' ),
		colorElement = this.$node.querySelector( '.lyteRadioSwitch' );

		if( type.indexOf( 'switch' ) !== -1 
			&& ( onrender && checked ) 
			|| !onrender 
		) {
			if( colorElement ) {
				colorElement.style.backgroundColor = this.getData( 'ltPropColor' );
			}
		}

		/* Experimental Features */
	},

	check: function( inp, comp ) {
		if( this.getMethods( 'onChecked' ) ) {
			this.executeMethod( 'onChecked', inp, comp );
		}
	},

	uncheck: function( inp, comp ) {
		if( this.getMethods( 'onUnchecked' ) ) {
			this.executeMethod( 'onUnchecked', inp, comp );
		}
	},

	beforeCheck: function( inp, comp ) {
		if( this.getMethods( 'onBeforeChecked' ) ) {
			this.executeMethod( 'onBeforeChecked', inp, comp );
		}
	},

	beforeUncheck: function( inp, comp ) {
		if( this.getMethods( 'onBeforeUnchecked' ) ) {
			this.executeMethod( 'onBeforeUnchecked', inp, comp );
		}
	},

	onchanged: function( inp, comp ) {
		if( this.getMethods( 'onChanged' ) ) {
			this.executeMethod( 'onChanged', inp, comp );
		}
	},

	extractRadios: function() {
		var name = this.getData( 'ltPropName' ), i = 0, tag,
		inp = document.querySelectorAll( 'input[type="radio"][name="' + name + '"]' );

		for( ; i < inp.length; i++ ) {
			tag = inp[ i ];
			while( tag.tagName !== 'LYTE-RADIOBUTTON' 
					&& tag.tagName !== 'HTML' 
			) {
				tag = tag.parentElement;
			}

			if( tag.tagName === 'LYTE-RADIOBUTTON'
				&& tag.ltProp( 'checked' ) 
				&& tag != this.$node
			) {
				return tag;
			}
		}
	},

	changeChecks: function( change ) {
		var radio = this.extractRadios(), 
		inp = radio && radio.querySelector( 'input' ),
		comp = radio && radio.component,
		cur = this.$node.querySelector( 'input' );

		// A checked radiobutton is checked
		// This check probably never executes because 
		// observers never fire when oldValue and newValue are the same. Its just a safety check
		if( change.newValue && change.oldValue ) {
			return ;
		}

		// A radiobutton that is different from the currently checked radiobutton is checked
		else if( change.newValue ) {
			this.setData( 'prevent', true );
			this.setData( 'ltPropChecked', false );

			// Unchecking the previously checked radiobutton and calling before uncheck callbacks
			if( radio ) {
				this.beforeUncheck( cur, this );
				comp.setData( 'prevent', true );
				radio.ltProp( 'checked', false );
				comp.setData( 'prevent', false );
			}

			this.beforeCheck( cur, this );
			this.setData( 'ltPropChecked', true );
			this.setData( 'prevent', false );

			// calling the uncheck callback of the previously checked radiobutton 
			if( radio ) {
				this.uncheck( cur, this );
			}

			this.check( cur, this );
			this.onchanged( cur, this );
		}

		// A radiobutton is unchecked but it was not previously unchecked
		else if( !change.newValue && change.oldValue ) {
			this.setData( 'prevent', true );
			this.setData( 'ltPropChecked', true );
			this.beforeUncheck( cur, this );
			this.setData( 'ltPropChecked', false );
			this.uncheck( cur, this );
			this.onchanged( cur, this );
			this.setData( 'prevent', false );
		}
 
	},

	change: function( change ) {

		var name = this.getData( 'ltPropName' ),
		input = document.querySelector( 'input[type="radio"][name="' + name + '"]:checked' );

		if( !this.getData( 'onChange' ) ) {
			this.changeChecks( change );
		}
		else {
			if( !change.newValue ) {
				this.uncheck( input, this.getData( 'second' ) );
			}
			else {
				this.check( input, this );
			}
		}	
	},

	unColorize: function( node ) {
		var type = this.getData( 'ltPropType' );

		if( type.indexOf( 'switch' ) !== -1 ) {
			node.nextElementSibling.style.backgroundColor = '';
		}
	},

	valueChanged: function( change ) {
		if( this.getData( 'prevent' ) ) {
			return ;
		}

		this.change( change );	
	}.observes( 'ltPropChecked' ),

	callMethodsOnInit: function() {
		var foi = this.getData( 'ltPropFireOnInit' ), 
		checked = this.getData( 'ltPropChecked' );

		if(	!foi ) {
			return ;
		}

		if( checked ) {
			var element = this.$node.querySelector( 'input' ),
			value = element.getAttribute( 'value' );

			this.beforeCheck( element, this );
			this.check( element, this );
			this.onchanged( element, this );
		}
	},

	actions: {
		mup: function( event ) {
			var name = this.getData( 'ltPropName' ), 
			checkedNode = document.querySelector( 'input[type="radio"][name="' + name + '"]:checked' );

			this.setData( 'shouldCallUnChecked', false );
			if( checkedNode ) {
				this.setData( 'prev', checkedNode.getAttribute( 'value' ) );
				this.setData( 'node', checkedNode );
				this.setData( 'shouldCallUnChecked', true );
			} 

			var element = this.$node.querySelector( 'input' ), checked = element.checked;

			if( element.disabled ) {
				return ;
			}

			if( !checked ) {
				if( this.getData( 'shouldCallUnChecked' ) ) {
					this.beforeUncheck( element, this );
				}

				this.beforeCheck( element, this );
			}
		},

		valueChanged: function( event ) {
			var ele = event.target, 
			val = ele.getAttribute( 'value' ), 
			prev = this.getData( 'prev' ), 
			node = this.getData( 'node' ),
			comp = node && node.parentElement.parentElement.component,
			parent = ele.parentElement.parentElement;

			event.stopPropagation();
			this.colorizeSwitch( false );
			if( val === prev ) {
				return ;
			}

			if( node ) {
				while( node.tagName !== 'LYTE-RADIOBUTTON' ) {
					node = node.parentElement;
				}

				comp.setData( 'onChange', true );

				// We are using a variable called second so that we can pass the current radiobutton's this to the callback.
				// We won't get the current radiobutton's this in a different radiobutton's observer - we are setting ltPropChecked to false below.
				comp.setData( 'second', this );
				node.ltProp( 'checked', false );
				comp.setData( 'second', undefined );
				comp.setData( 'onChange', false );
			}

			node = this.getData( 'node' );
			if( node ) {
				this.unColorize( node );
				this.setData( 'node', undefined );
			}

			this.setData( 'onChange', true );
			this.setData( 'ltPropChecked', true );
			this.setData( 'onChange', false );
			this.onchanged( ele, this );	
		}
	}
});
 
