
Lyte.Component.register( 'lyte-nav', {
_template:"<template tag-name=\"lyte-nav\"></template>",
_dynamicNodes : [],
_observedAttributes :["arrowTop","arrowBot","ltPropClick","ltPropAlignment"],
	didDestroy: function() {
		var allNodes = this.$node.querySelectorAll('lyte-nav-item'), i = 0, curValue;

		for( ; i < allNodes.length; i++ ) {
			curValue = allNodes[ i ].getAttribute( 'lyte-shortcut' );
			if( curValue ){
				allNodes[ i ].setAttribute( 'lyte-shortcut', JSON.stringify( {} ) );
			}
		}
	},

	// Creating outer div 
	createOuterDiv: function() {
		var div = document.createElement( 'div' );

		div.setAttribute( 'class', 'lyteNavDiv' );
		div.style.overflow = 'hidden';
		return div;
	},

	show: function( arrows, outer ) { 
		this.setData( 'topH', arrows[0].getBoundingClientRect().height );
		this.setData( 'botH', arrows[1].getBoundingClientRect().height );
		this.dispArrow.call( this, arrows, outer );
		if( this.getMethods( 'afterRender' ) ) {
			this.executeMethod( 'afterRender', this );
		}
	},

	didConnect: function() {
		var align = this.getData( 'ltPropAlignment' ), 
		tag = this.$node,
		children = tag.children, 
		length = children.length,
		outer, arrows, i, div;

		if( align === 'vertical' ) {
			outer = this.createOuterDiv();
			arrows = tag.querySelectorAll( 'lyte-arrow' )
			for( i = 0; i < length; i++ ) {
				LyteComponent.appendChild( outer, children[ 0 ] );
			}

			/* 
			 * Did connect executes before the constructors of the children but 
			 * since we are performing an append over here the children are executed first 
			 */
			LyteComponent.appendChild( tag, outer );
			if( arrows.length == 0 ) {
				this.addArrow( 'arrow-up' );
				this.addArrow( 'arrow-down' );
			}
			else {
				tag.insertBefore( arrows[ 0 ], tag.children[ 0 ] );
				tag.appendChild( arrows[ 1 ] );
			}

			arrows = tag.querySelectorAll( 'lyte-arrow' )

			$L.fastdom.measure( this.show.bind( this, arrows, outer ) );

			div = tag.querySelector( '.lyteNavDiv' );
			arrows[0].addEventListener( 'mouseenter', this.moveup.bind( this ) );
			arrows[1].addEventListener( 'mouseenter', this.movedown.bind( this ) );

			var that = this;
			div.addEventListener( 'wheel', function( e ) {
				var topHeight, botHeight, total, 
				deltaY = e.deltaY,
				scrollH = div.scrollHeight, 
				height = div.getBoundingClientRect().height, 
				scrollT = div.scrollTop;

				e.preventDefault();

				if( Math.floor( scrollH ) == Math.floor( height ) ) {
					return ;
				}

				topHeight = arrows[ 0 ].getBoundingClientRect().height;
				botHeight = arrows[ 1 ].getBoundingClientRect().height;

				if ( deltaY < 0 ) {
    				scrollT = div.scrollTop = div.scrollTop - 6;

    				if( arrows[ 1 ].style.display === 'none' ) {
    					arrows[ 1 ].style.display = 'inline-block';
    					botHeight = that.getData( 'botH' );
    					total = topHeight + botHeight;
    					div.style.height = 'calc(100% - ' + total + 'px)';
    				}

    				if( scrollT <= 0 ) {
    					arrows[ 0 ].style.display = "none"
    					div.style.height = 'calc(100% - ' + botHeight + 'px)';
    				}
  				}

  				if ( deltaY > 0 ) {
    				scrollT = div.scrollTop = div.scrollTop + 6;

    				if( arrows[ 0 ].style.display === 'none' ) {
    					arrows[ 0 ].style.display = 'inline-block';
    					topHeight = that.getData( 'topH' );
    					total = topHeight + botHeight;
    					div.style.height = 'calc(100% - ' + total + 'px)';
    				}

    				if( Math.floor( height ) + Math.floor( scrollT ) >= Math.floor( scrollH ) ) {
    					arrows[ 1 ].style.display = 'none';
    					div.style.height = 'calc(100% - ' + topHeight + 'px)';
    				}
  				}
			} );

			arrows[ 0 ].addEventListener( 'mouseleave', this.removeup.bind( this ) );
			arrows[ 1 ].addEventListener( 'mouseleave', this.removedown.bind( this ) );

			
		}
	},

	removedown: function() {
		window.cancelAnimationFrame( this.getData( 'arrowdid' ) )
	},

	removeup: function() {
		window.cancelAnimationFrame( this.getData( 'arrowuid' ) );
	},

	down: function( div, ar, bot ) {
		var id,
		scrollT = div.scrollTop, 
		scrollH = div.scrollHeight, 
		height = div.getBoundingClientRect().height;

		if( scrollT + height < scrollH ) {
			scrollT = div.scrollTop = div.scrollTop + 3
		}

    	if( Math.floor( height ) + Math.floor( scrollT ) >= scrollH ) {
    		ar[ 1 ].style.display = 'none';
    		div.style.height = 'calc(100% - ' + bot + 'px)';
    	}

    	id = window.requestAnimationFrame( this.down.bind( this, div, ar, bot ) );
		this.setData( 'arrowdid', id );
	},

	up: function( div, ar, top ) {
		var scrollT = div.scrollTop, id;

		if( scrollT !== 0 ) {
			scrollT = div.scrollTop = div.scrollTop - 3;
		}

   		if( scrollT <= 0 ) {
   			ar[ 0 ].style.display = 'none';
   			div.style.height = 'calc(100% - ' + top + 'px)';
   		}

		id = window.requestAnimationFrame( this.up.bind( this, div, ar, top ) );
		this.setData( 'arrowuid', id );
	},

	movedown: function() {
		var top, bot, total,
		tag = this.$node, 
		div = tag.querySelector( '.lyteNavDiv' ), 
		ar = tag.querySelectorAll( 'lyte-arrow' ), 
		height = div.getBoundingClientRect().height, 
		scroll = div.scrollHeight;

		ar[ 0 ].style.display = 'inline-block';
		top = this.getData( 'topH' );
		bot = this.getData( 'botH' );
		total = top + bot;
		div.style.height = 'calc(100% - ' + total + 'px)';

		// Call Animation inside a rAF.
		window.requestAnimationFrame( this.down.bind( this, div, ar, bot ) );		
	},

	moveup: function() {
		var top, bot, total,
		tag = this.$node, 
		div = tag.querySelector( '.lyteNavDiv' ), 
		ar = tag.querySelectorAll( 'lyte-arrow' ), 
		height = div.getBoundingClientRect().height, 
		scroll = div.scrollHeight;

		ar[ 1 ].style.display = 'inline-block';
		top = this.getData( 'topH' );
		bot = this.getData( 'botH' );
		total = top + bot;
		div.style.height = 'calc(100% - ' + total + 'px)';

		// Call Animation inside a rAF
		window.requestAnimationFrame( this.up.bind( this, div, ar, top ) );			
	},

	addArrow: function( cls ) {
		var i = document.createElement( 'i' ),
		ar = document.createElement( 'lyte-arrow' ), 
		tag = this.$node;

		i.setAttribute( 'class', cls ); 
		ar.appendChild( i );

		if( cls.indexOf('up') !== - 1 ) {
			tag.insertBefore( ar, tag.children[ 0 ] );
		}
		else {
			tag.appendChild( ar )
		}
	},

	dispArrow: function( arrows, div ) {
		var which = 0, topHeight = 0, botHeight = 0, total = 0;
		
		if( this.getData( 'arrowTop' ) ) {
			topHeight = this.getData( 'topH' );
			which = 1;
		}

		if( this.getData( 'arrowBot' ) ) {
			botHeight = this.getData( 'botH' );
			if( which == 1 ) {
				which = 3
			}
			else {
				which = 2
			}
		}

		switch( which ) {
			case 1:
				div.style.height = 'calc(100% - ' + topHeight + 'px)'
				arrows[ 1 ].style.display = "none"
				break;
			case 2:
				div.style.height = 'calc(100% - ' + botHeight + 'px)'
				arrows[ 0 ].style.display = "none"
				break
			case 3:
				total = topHeight + botHeight
				div.style.height = 'calc(100% - ' + total + 'px)'
				break;
		}
	},

	data: function() {
		return {
			'arrowTop': Lyte.attr( 'boolean', { 
				'default': false 
			} ),
			'arrowBot':Lyte.attr( 'boolean', { 
				'default': false 
			} ),
			'ltPropClick': Lyte.attr( 'string', { 
				'default': 'lyteNavActive' 
			} ),
			'ltPropAlignment':Lyte.attr( 'string', { 
				'default': 'horizontal' 
			} )
		}
	}
})



Lyte.createCustomElement( 'lyte-nav-item', {
	constructor: function() {
		var parent = this, component, align, div = this;

    	while( 
    		parent.tagName != 'LYTE-NAV' 
    		&& parent.tagName != 'HTML' 
    	) {
      		parent = parent.parentElement
    	}

    	if( parent.tagName == 'HTML' ) {
    		return ;
  		}

    	component = parent.component;
    	align = component.getData( 'ltPropAlignment' );
    	if( align === 'vertical' ) {
        	while( !div.classList.contains( 'lyteNavDiv' ) ) {
          		div = div.parentElement
        	}  
   	 	}

   	 	$L.fastdom.measure( function() {
   	 		var offsetTop, newElemOffset;

   	 		if( 
    			this.hasAttribute( 'selected' ) 
    			&& this.getAttribute( 'selected' ) 
    		) {
        		if( align === 'vertical' ) {   
          			offsetTop = this.offsetTop;
          			div.scrollTop = offsetTop
          			if( offsetTop != 0 ) {
            			component.setData( 'arrowTop', true );
          			} 
          			
          			component.setData( 'arrowBot', false );
        		}

        		this.classList.add( component.getData( 'ltPropClick' ) );
    		}
    		else if( align === 'vertical' ) {
      			newElemOffset = this.offsetTop;
      			if( newElemOffset + this.getBoundingClientRect().height > div.getBoundingClientRect().height + div.scrollTop ) {
           			component.setData( 'arrowBot', true )    
        		}
    		}
   	 	}, this )

    	

    	this.addEventListener( 'click', function() {
      		this.setAttribute( 'selected', true );
    	}.bind( this ) );
	},

	static : {
		"observedAttributes" : {
			get : function() {
				return [ 'selected', 'lyte-shortcut' ];
			}
		}
	},

	"attributeChangedCallback" : function( attributeName, oldValue, newValue, namespace ) {
		var parent = this, component, click, prevSelected, val;
		if ( attributeName === 'lyte-shortcut' ) {
        	if ( typeof shortcut === 'function' ) {
          		if ( !newValue ) {
            		return;
         	 	}
          		newValue = JSON.parse( newValue );
          		oldValue = oldValue ? JSON.parse( oldValue ) : {};
          		shortcut.push( {
           			newKey: newValue.key,
            		type: newValue.type,
            		wait: newValue.wait,
            		oldKey: oldValue.key,
            		value: this
          		} );
        	}
      	} 
      	else if ( attributeName == 'selected' && newValue && newValue !== 'false' ) {
        	val = this.getAttribute( 'selected' );
        	while (
        		parent.tagName != 'LYTE-NAV' 
        		&& parent.tagName != 'HTML' 
        	) {
          		parent = parent.parentElement;
        	}

        	if ( parent.tagName == 'HTML' ) {
          		return;
        	}

        	component = parent.component;
        	click = component.getData('ltPropClick');
        	prevSelected = parent.querySelector('.' + click);
        	if ( prevSelected && prevSelected != this ) {
          		prevSelected.setAttribute( 'selected', '' );
        	}

        	if ( val ) {
          		this.classList.add( click );
          		if( component.getMethods( 'onItemSelected' ) ){
          			component.executeMethod( 'onItemSelected', this, component )
          		}
        	}
      	} 
      	else if ( attributeName == 'selected' ) {
        	parent = this;
        	while ( 
        		parent.tagName != 'LYTE-NAV' 
        		&& parent.tagName != 'HTML' 
        	) {
          		parent = parent.parentElement;
        	}

        	if (parent.tagName == 'HTML') {
          		return;
        	}

        	component = parent.component;
        	click = component.getData( 'ltPropClick' );
        	this.classList.remove( click );
      	}
	}
});
