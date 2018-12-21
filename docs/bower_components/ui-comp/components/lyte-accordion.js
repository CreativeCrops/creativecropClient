/* Needs more thought and testing */
Lyte.Component.register( 'lyte-accordion', {
_template:"<template tag-name=\"lyte-accordion\">\t<lyte-yield yield-name=\"yield\">\t</lyte-yield></template>",
_dynamicNodes : [{"type":"insertYield","position":[1]}],
_observedAttributes :["ltPropDuration","ltPropHeight","ltPropExclusive","ltPropYield"],
	data: function() {
		return { 
			'ltPropDuration': Lyte.attr( 'string', { 
				'default': '0.2s' 
			} ),
			'ltPropHeight': Lyte.attr( 'string' ),
			'ltPropExclusive': Lyte.attr( 'boolean', { 
				'default': true
			} ),
			'ltPropYield': Lyte.attr( 'boolean', { 
				'default': true 
			} )
		}
	},

	execAndCheck: function( name, event ) {
		var arg, ret;

		arg = _lyteAccordion.findProperParent( event.target ).parentElement;
	 	ret = this.executeMethod( name, event, arg, this );
	 	ret = ret == undefined ? true : ret;
	 	return ret;
	},

	initiateClose: function( activeElement, cb, event ) {
		activeElement.style.height = '0px';
	 	activeElement.style.paddingTop = '0px';
	 	activeElement.style.paddingBottom = '0px';
		activeElement.style.overflow = 'hidden';	
		activeElement.parentElement.classList.remove( 'lyteAccordionActive' );
		if( cb ) {
			$L.fastdom.measure( function() {
				cb.call( this, event );
			}, this );
		}
	},

	execNonRetCalls: function( arr ) {
		if( this.getMethods( arr[ 0 ] ) ) {
			this.executeMethod.apply( this, arr );
	 	}
	},

	initiateOpen: function( sibling, configuration, event ) {
		var heightToSet =  configuration.height, ret;

	 	if( 
	 		this.getData( 'heights' )[ sibling.getAttribute( 'map' ) ].conf 
	 		&& heightToSet 
	 	) {
	 		sibling.style.height = heightToSet
	 	}
	 	else{
	 		sibling.style.height = this.getData( 'heights' )[ sibling.getAttribute( 'map' ) ].height
	 	}

	 	sibling.style.overflow = 'auto';
	 	sibling.style.paddingTop = '15px';
	 	sibling.style.paddingBottom = '15px';
	 	sibling.parentElement.classList.add( 'lyteAccordionActive' );
	 	ret = _lyteAccordion.findProperParent( event.target );
	 	$L.fastdom.measure( function() {
	 		this.execNonRetCalls( [  'onOpen', event, ret.parentElement, this ] );
	 		this.execNonRetCalls( [ 'onChanged', event, ret.parentElement, this ] );
	 	}, this );
	},

	didDestroy: function() {
		var allNodes = this.$node.querySelectorAll( 'lyte-accordion-item' ), i = 0, curValue;
		for( ; i < allNodes.length; i++ ) {
			curValue = allNodes[ i ].getAttribute( 'lyte-shortcut' );
			if( curValue ) {
				allNodes[ i ].setAttribute( 'lyte-shortcut', JSON.stringify( {} ) );
			}
		}
	},

	getAllHeights: function() {
		this.setData( 'heights', {} );		
		$L.fastdom.measure( function() {
			var node = this.$node.querySelector( 'lyte-yield' ), nodes = node.children, 
			i = 0, body, isStyle, inlineHeight = false, exclusive;
			for( ; i < nodes.length; i++ ) {
				if( nodes[ i ].tagName == 'TEMPLATE' ) {
					continue;
				}

				body = nodes[ i ].children[ 1 ];
				if( !body || body.tagName == 'TEMPLATE' ) {
					continue;
				}

				isStyle = body.style.height;
				this.getData( 'heights' )[ i ] = {};
				if( !isStyle ) {
					this.getData( 'heights' )[ i ].height = body.getBoundingClientRect().height + 'px';
					this.getData( 'heights' )[ i ].conf = true;
				}
				else {
					this.getData( 'heights' )[ i ].height = isStyle;
					this.getData( 'heights' )[ i ].conf = false;
				}

				if( 
					nodes[ i ].classList.contains( 'lyteAccordionActive' ) 
					&& this.getData( 'ltPropExclusive' ) 
				) {
					this.flag = i;
				}
			}
		}, this );
		
		$L.fastdom.mutate( function() {
			var node = this.$node.querySelector( 'lyte-yield' ), nodes = node.children,
			exclusive = this.getData( 'ltPropExclusive' ), i = 0, body;

			for( ; i < nodes.length; i++ ) {
				if( nodes[i].tagName == 'TEMPLATE' ) {
					continue;
				}

				body = nodes[ i ].children[ 1 ];
				if( !body || body.tagName == 'TEMPLATE' ) {
					continue;
				}
				
				body.setAttribute( 'map', i );
				if( !nodes[ i ].classList.contains( 'lyteAccordionActive' ) ) {
					body.style.height = '0px';
					body.style.paddingTop = '0px';
					body.style.paddingBottom = '0px';
				}
				else if( exclusive ) {
					if( this.flag != i ) {
						nodes[ i ].classList.remove( 'lyteAccordionActive' );
						body.style.height = '0px';
						body.style.paddingTop = '0px';
						body.style.paddingBottom = '0px';
					}
					else {
						
						// Doing this to achieve this precedence: inline style > ltPropHeight > boundingClientRect
						body.style.height = !this.getData( 'heights' )[ i ].conf ? 
												this.getData( 'heights' )[ i ].height :
												this.getData( 'ltPropHeight' ) ? 
													this.getData( 'ltPropHeight' ) : 
													this.getData( 'heights' )[ i ].height
					}
				}
				else {
					body.style.height = !this.getData( 'heights' )[ i ].conf ? 
											this.getData( 'heights' )[ i ].height :
											this.getData( 'ltPropHeight' ) ? 
												this.getData( 'ltPropHeight' ) : 
												this.getData( 'heights' )[ i ].height
				}
			}

			$L.fastdom.measure( function() {
				this.execNonRetCalls( [ 'afterRender', this ] );
			}, this );
		}, this );
		
	},

	didConnect: function() {		
		this.getAllHeights()
	},

	getConfiguration: function() {
		var config = {};
		
		config.transition = this.getData( 'ltPropDuration' )
		config.height = this.getData( 'ltPropHeight' )
		config.exclusive = this.getData( 'ltPropExclusive' )
		return config;
	}
} );

var _lyteAccordion = {
	findProperParentS: function( elm ) {
		var properparent, stack = [], found = false, i;
		while( elm.tagName != "LYTE-YIELD" && elm.tagName != 'HTML'){
			properparent = elm;
			stack.push( elm );
			elm = elm.parentElement;
		}

		for( i = stack.length - 1; i > -1; i-- ) {
			if( stack[ i ].tagName === 'LYTE-ACCORDION-HEADER' 
				|| ( stack.length === 1 && stack[ i ].tagName === 'LYTE-ACCORDION-ITEM' ) 
			) {
				found = true
				break;
			}
		}

		if( !found ) {
			return null;
		}

		return properparent.children[ 0 ]

	},

	findProperParent: function( element ) {
		var properparent;

		if( !element ) {
			return ;
		}
		while( element.tagName != "LYTE-YIELD" && element.tagName != 'HTML' ) {
			properparent = element;
			element = element.parentElement;
		}
		return properparent.children[0];

	}
}

document.addEventListener( 'click', function( event ) {
	var elementClicked = _lyteAccordion.findProperParentS( event.target ), 
	parent, temp, childs, flag, i = 0, sibling, component, configuration, transition,
	openElement, bodyElement, returnval, itsStyle, activeElement;

	if( !elementClicked ) {
		return ;
	}

	parent  = elementClicked
	while(
		parent.tagName != 'HTML' 
		&& parent.tagName != 'LYTE-ACCORDION'
	) {
		parent = parent.parentElement
		if( !parent ) {
			return ;
		}
	}

	// This is a safety check because it is generally guaranteed to be a LYTE-ACCORDION Element
	if( parent.tagName == 'HTML' ) {
		return ;
	}

	temp  = parent.querySelector( 'lyte-yield' );
	childs = temp.children;
	flag = true;

	// why is this here??
	for( ; i < childs.length; i++ ) {
		if( childs[i].children[ 0 ] == elementClicked ) {
			flag = false
			break;
		}
	}

	if( flag ) {
		return ;
	}

	/* sibling - The lyte-accordion-body tag of current clicked accordion item */

	sibling = temp.children[ i ].children[ 1 ];
	component = temp.parentElement.component;
	configuration = component.getConfiguration();
	transition = configuration.transition;

	/* When they haven't provided a lyte-accordion-body tag */
	if(
		!sibling 
		|| sibling.tagName != 'LYTE-ACCORDION-BODY'
	) {
		// Close accordion
 		if( 
 			configuration 
 			&& configuration.exclusive 
 			&& ( openElement = component.$node.querySelector( '.lyteAccordionActive' ) )
 			&& ( bodyElement = openElement.querySelector( 'lyte-accordion-body' ) )
 		 ) {
 			
 			bodyElement.style.transitionDuration = transition;
 			if( component.getMethods( 'onBeforeClose' ) ) {
 				returnval = component.execAndCheck( 'onBeforeClose', event );
	 			if( returnval ){
	 				component.initiateClose( openElement.children[ 1 ], function( e ) {
	 					this.execNonRetCalls( [ 'onClose', e, _lyteAccordion.findProperParent( e.target ).parentElement, this ] );
	 				}, event );
	 			}
	 			else {
	 				return ;
	 			} 			
	 		}
	 		else {
	 			component.initiateClose( openElement.children[ 1 ], function( e ) {
	 				this.execNonRetCalls( [ 'onClose', e, _lyteAccordion.findProperParent( e.target ).parentElement, this ] );
	 			}, event );		
	 		}
 		}


 		if( temp.children[ i ].classList.contains( 'lyteAccordionActive' ) ) {
 			temp.children[ i ].classList.remove( 'lyteAccordionActive' )
 		}
 		else {
 			temp.children[i].classList.add( 'lyteAccordionActive' )
 		}

 		$L.fastdom.measure( function() {
 			component.execNonRetCalls( [ 'onChanged',event, _lyteAccordion.findProperParent( event.target ).parentElement, component ] );
 		} )
 		
		return ;
	}

	itsStyle = window.getComputedStyle( sibling ).height;
 	if( transition ) {
 		sibling.style.transitionDuration = transition

 		// Added so that it slides the first time as well
 		if( ( openElement = component.$node.querySelector( '.lyteAccordionActive' ) )
 			&& ( bodyElement = openElement.querySelector( 'lyte-accordion-body' ) ) ) {
 			 	bodyElement.style.transitionDuration = transition;
 		}
 	}

 	activeElement = component.$node.querySelector( '.lyteAccordionActive' );

 	// Close the already opened accordion-item in exclusive accordion. 
	if( 
		configuration 
		&& configuration.exclusive 
		&& activeElement 
		&& activeElement != sibling.parentElement
	) {	
		if( 
			activeElement.children[ 1 ] 
			&& activeElement.children[ 1 ].tagName == 'LYTE-ACCORDION-BODY' 
			&& component.getMethods( 'onBeforeClose' ) 
		) {
			returnval = component.execAndCheck( 'onBeforeClose', event );
	 		if( returnval ) {
	 			component.initiateClose( activeElement.children[ 1 ], function( e ) {
	 				this.execNonRetCalls( [ 'onClose', e, _lyteAccordion.findProperParent( e.target ).parentElement, this ] );
	 			}, event );
	 		}
	 		else {
	 			return ;
	 		} 			
		}
	 	else if( 
	 		activeElement.children[ 1 ] 
	 		&& activeElement.children[ 1 ].tagName == 'LYTE-ACCORDION-BODY' 
	 	) {
	 		component.initiateClose( activeElement.children[ 1 ], function( e ) {
	 			this.execNonRetCalls( [ 'onClose', e, _lyteAccordion.findProperParent( e.target ).parentElement, this ] );
	 		}, event );
	 	}

	 	// If the element has no bodyelement you still need to remove it.
 		if( activeElement.classList.contains( 'lyteAccordionActive' ) ) {
 			activeElement.classList.remove( 'lyteAccordionActive' )
 		}
		
	}
	
	// itsStyle.height = '0px' -> Meaning it is closed
	if( itsStyle == '0px' ) {
	 	
	 	if( component.getMethods( 'onBeforeOpen' ) ) {
	 		returnval = component.execAndCheck( 'onBeforeOpen', event );
	 		if( returnval ) {
	 			component.initiateOpen( sibling, configuration, event );
	 		}
	 		else {
	 			return ;
	 		}	 		
	 	}
	 	else {
	 		component.initiateOpen( sibling, configuration, event );
	 	}
	 }

	 // It is opened so close it
	 else {
	 	if( component.getMethods( 'onBeforeClose' ) ) {
	 		returnval = component.execAndCheck( 'onBeforeClose', event );
	 		if( returnval ) {
	 			component.initiateClose( sibling, function( e ) {
	 				var ret =  _lyteAccordion.findProperParent( e.target );
	 				this.execNonRetCalls( [ 'onClose', e, ret.parentElement, this ] );
	 				this.execNonRetCalls( [ 'onChanged', e, ret.parentElement, this ] );
	 			}, event );
	 		}
	 		else{
	 			return;
	 		}
	 	}
	 	else {
	 		component.initiateClose( sibling, function( e ) {
	 			var ret =  _lyteAccordion.findProperParent( e.target );
	 			this.execNonRetCalls( [ 'onClose', e, ret.parentElement, this ] );
	 			this.execNonRetCalls( [ 'onChanged', e, ret.parentElement, this ] );
	 		}, event );
	 	}
	 }
}, true );

Lyte.createCustomElement( "lyte-accordion-item", {
	static: {
		"observedAttributes": {
			get: function() {
				return [ 'lyte-shortcut' ]; 
			}
		}
	},

	"attributeChangedCallback": function( attributeName, oldValue, newValue, namespace ) {
		if( typeof shortcut == "function" ){
         	if( !newValue ) {
            	return ;
          	}

          	newValue = JSON.parse( newValue )
          	if( !newValue.key ){
            	return ;
          	}

          	var newKey = newValue.key, type = newValue.type, wait = newValue.wait;
          	if( !oldValue ){
            	oldValue = {};
          	}

          	shortcut.push( {
            	newKey: newKey,
            	type: type,
            	wait: wait,
            	oldKey: oldValue.key,
            	value: this
         	} )
      	}
	}
} );
