Lyte.Component.register( 'lyte-button', {
_template:"<template tag-name=\"lyte-button\">\t<button type=\"{{ltPropType}}\" onclick=\"{{action('check',event)}}\" class=\"{{finalClass}}\" value=\"{{ltPropValue}}\" tabindex=\"{{ltPropTabindex}}\" id=\"{{ltPropId}}\" name=\"{{ltPropName}}\" autofocus=\"{{ltPropAutofocus}}\" disabled=\"{{ltPropDisabled}}\" style=\"{{finalStyle}}\">\t\t\t<lyte-yield yield-name=\"text\"></lyte-yield>\t\t</button></template>",
_dynamicNodes : [{"type":"attr","position":[1],"attr":{"style":{"name":"style","dynamicValue":"finalStyle"}}},{"type":"insertYield","position":[1,1]}],
_observedAttributes :["ltPropName","ltPropDisabled","ltPropAutofocus","ltPropAppearance","ltPropId","ltPropType","ltPropValue","ltPropTabindex","ltPropStyle","ltPropSize","ltPropBackgroundColor","ltPropColor","lyteShortcut","ltPropClass"],
	data: function() {
		return {
			'ltPropName': Lyte.attr( 'string', {
				'default': undefined
			} ),
			'ltPropDisabled': Lyte.attr( 'boolean', {
				'default': false
			} ),
			'ltPropAutofocus': Lyte.attr( 'boolean', {
				'default': false
			} ),
			'ltPropAppearance': Lyte.attr( 'string', {
				'default': 'default'
			} ),
			'ltPropId': Lyte.attr( 'string', {
				'default': undefined
			} ),
			'ltPropType': Lyte.attr( 'string', {
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
				'default': 'default'
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
			} )
		}
	},

	init: function() {
		this.pushValue();
	},

	didDestroy: function() {
		var val = this.getData('lyteShortcut');
		if( val ) {
			if( typeof shortcut === 'function' ) {
				shortcut.push( {
					newKey: undefined,
					type: undefined,
					wait: undefined,
					oldKey: val.key
				} );
			}
		}
	},

	shortcutChanged: function() {
		this.pushValue();
	}.observes( 'lyteShortcut' ),

	pushValue: function() {
		var key = this.getData( 'lyteShortcut' ),
		node = this.$node;

		if( !key.key ) {
			return ;
		}

		if( typeof shortcut === 'function' ) {
			shortcut.push( {
				newKey : key.key,
				type : key.type,
				wait : key.wait,
				oldKey:undefined,
				value:node
			} );
		}
	},

	changeClass: function() {
		var cls = this.getData( 'ltPropClass' ), tempStyle = '', 
		tempClass = 'lyte-button' + ( cls ? ' ' + cls : '' ),
		app = this.getData( 'ltPropAppearance' ), size = this.getData( 'ltPropSize' ),
		color = this.getData( 'ltPropColor' ), bg = this.getData( 'ltPropBackgroundColor' );
		size = size ? size.toLowerCase() : '';
		app = app ? app : 'default';

		if( bg ) {
			tempClass = tempClass + ' lyteBackgroundColorBtn';
		}
		else if( color ) {
			tempClass = tempClass + ' lyteColorBtn';
		}
		else if( app.indexOf( 'default' ) !== -1 ) {
			tempClass = tempClass + ' lyteDefaultBtn';
		}
		else if( app.indexOf( 'primary' ) !== -1 ) {
			tempClass = tempClass + ' lytePrimaryBtn';
		}
		else if( app.indexOf( 'secondary' ) !== -1 ) {
			tempClass = tempClass + ' lyteSecondary';
		}

		if( app.indexOf( 'success' ) !== -1 ) {
			tempClass = tempClass + ' lyteSuccess';
		}
		else if( app.indexOf( 'failure' ) !== -1 ) {
			tempClass = tempClass + ' lyteFailure';
		}

		if( size === 'extra-small' ) {
			tempClass = tempClass + ' lyteExsm';
		}
		else if( size === 'small' ) {
			tempClass = tempClass + ' lyteSm';
		}
		else if( size === 'large' ) {
			tempClass = tempClass + ' lyteLg';
		}

		if( color ) {
			if( !bg ) {
				tempStyle = tempStyle + 'color:' + color + ';border-color:' + color + ';';
			}
			else {
				tempStyle = tempStyle + 'background-color:' + bg + ';border-color:' + bg + ';color:' + color + ';';
			}
		}
		else if( bg ) {
			tempStyle = tempStyle + 'background-color:' + bg + ";border-color:" + bg + ";color:white;";
		}

		if( this.getData( 'ltPropStyle' ) ) {
			tempStyle = tempStyle + this.getData( 'ltPropStyle' );
		}

		this.setData( 'finalStyle', tempStyle );
		this.setData( 'finalClass', tempClass );
	}.observes(
		'ltPropClass',
		'ltPropBackgroundColor',
		'ltPropColor',
		'ltPropStyle',
		'ltPropSize',
		'ltPropAppearance'
	).on( 'init' ),
	actions: {
		check: function( event ) {
			var button = this.$node.querySelector( 'button' )
			if( button.disabled ) {
				event.stopPropagation()
			}
		}
	}
});
