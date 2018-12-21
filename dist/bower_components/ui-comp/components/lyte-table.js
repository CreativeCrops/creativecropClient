Lyte.Component.register('lyte-table',{
_template:"<template tag-name=\"lyte-table\">\t<div class=\"lyteTableScroll\">\t\t<template is=\"if\" value=\"{{expHandlers(ltPropYield,'==',false)}}\"><template case=\"true\">\t\t<lyte-table-structure id=\"{{ltPropId}}\" class=\"{{ltPropClass}}\">\t\t   <template is=\"if\" value=\"{{ltPropHeaderLabelKey}}\"><template case=\"true\">\t\t\t   <lyte-colgroup>\t\t\t\t   <template is=\"for\" items=\"{{ltPropHeader}}\" item=\"list\" index=\"indexVal\">\t\t\t\t\t\t\t<lyte-col></lyte-col>\t\t\t\t\t</template> \t\t\t\t</lyte-colgroup>\t\t\t\t\t<lyte-thead>\t\t\t\t\t<lyte-tr>\t\t\t\t\t   <template is=\"if\" value=\"{{ltPropHeader.length}}\"><template case=\"true\"><template is=\"for\" items=\"{{ltPropHeader}}\" item=\"list\" index=\"indexVal\">\t\t\t\t\t\t<lyte-th id=\"{{list.id}}\" class=\"{{list.class}}\" index=\"{{indexVal}}\" resize=\"{{list.resize}}\" fixed=\"{{list.fixed}}\" icon=\"{{list.icon}}\">\t\t\t\t\t\t\t{{unescape(list[ltPropHeaderLabelKey])}}\t\t\t\t\t\t</lyte-th>\t\t\t\t\t\t\t</template></template></template>\t\t\t\t\t\t</lyte-tr>\t\t\t\t</lyte-thead>\t\t\t</template></template>\t\t\t\t<lyte-tbody>\t\t\t\t<template is=\"if\" value=\"{{ltPropInfiniteScroll}}\"><template case=\"true\">\t\t\t\t\t<template is=\"for\" items=\"{{ltPropData}}\" item=\"list\" index=\"indexVal\">\t\t\t\t\t\t\t <lyte-tr id=\"{{list.body.id}}\" class=\"{{list.body.class}}\">\t\t\t\t\t\t\t<template is=\"for\" items=\"{{ltPropHeader}}\" item=\"header\">\t\t\t\t\t\t\t\t<lyte-td>\t\t\t\t\t\t\t\t\t<div style=\"height: {{ltPropCellHeight}}\">\t\t\t\t\t\t\t\t\t\t{{unescape(lyteUiGetValue(list.body,header[ltPropBodyLabelKey]))}}\t\t\t\t\t\t\t\t\t</div>\t\t\t\t\t\t\t\t</lyte-td>\t\t\t\t\t\t\t</template>\t\t\t\t\t \t</lyte-tr>\t\t\t\t\t</template>\t\t\t\t</template><template case=\"false\">\t\t\t\t<template is=\"for\" items=\"{{ltPropContent}}\" item=\"list\" index=\"indexVal\">\t\t\t\t\t\t <lyte-tr id=\"{{list.id}}\" class=\"{{list.class}}\">\t\t\t\t\t\t<template is=\"for\" items=\"{{ltPropHeader}}\" item=\"header\">\t\t\t\t\t\t\t<lyte-td>{{unescape(lyteUiGetValue(list,header[ltPropBodyLabelKey]))}}</lyte-td>\t\t\t\t\t\t</template>\t\t\t\t \t</lyte-tr>\t\t\t\t</template>\t\t\t\t</template></template>\t\t    </lyte-tbody> \t\t    <template is=\"if\" value=\"{{expHandlers(ltPropResize.vertical,'||',ltPropResize.horizontal)}}\"><template case=\"true\">\t\t    \t<lyte-table-resize onmousedown=\"{{action('tableResize', event, this)}}\"></lyte-table-resize>\t\t    \t<template is=\"if\" value=\"{{ltPropResize.vertical}}\"><template case=\"true\">\t\t    \t\t<lyte-table-vertical-resize onmousedown=\"{{action('tableResize', event, this)}}\"></lyte-table-vertical-resize>\t\t    \t</template></template><template is=\"if\" value=\"{{ltPropResize.horizontal}}\"><template case=\"true\">\t\t    \t\t<lyte-table-horizontal-resize onmousedown=\"{{action('tableResize', event, this)}}\"></lyte-table-horizontal-resize>\t\t    \t</template></template></template></template>\t\t</lyte-table-structure>\t</template><template case=\"false\"><template is=\"if\" value=\"{{ltPropInfiniteScroll}}\"><template case=\"true\">\t\t<lyte-yield yield-name=\"yield\" lt-prop-data=\"{{ltPropData}}\"></lyte-yield>\t</template><template case=\"false\">\t <lyte-yield yield-name=\"yield\"></lyte-yield>\t </template></template></template></template></div></template>",
_dynamicNodes : [{"type":"attr","position":[1,1]},{"type":"if","position":[1,1],"cases":{"true":{"dynamicNodes":[{"type":"attr","position":[1]},{"type":"attr","position":[1,1]},{"type":"if","position":[1,1],"cases":{"true":{"dynamicNodes":[{"type":"attr","position":[1,1]},{"type":"for","position":[1,1],"dynamicNodes":[{"type":"componentDynamic","position":[1]}]},{"type":"componentDynamic","position":[1]},{"type":"attr","position":[3,1,1]},{"type":"if","position":[3,1,1],"cases":{"true":{"dynamicNodes":[{"type":"attr","position":[0]},{"type":"for","position":[0],"dynamicNodes":[{"type":"attr","position":[1]},{"type":"text","position":[1,1]},{"type":"componentDynamic","position":[1]}]}]}},"default":{}},{"type":"componentDynamic","position":[3,1]},{"type":"componentDynamic","position":[3]}]}},"default":{}},{"type":"attr","position":[1,3,1]},{"type":"if","position":[1,3,1],"cases":{"true":{"dynamicNodes":[{"type":"attr","position":[1]},{"type":"for","position":[1],"dynamicNodes":[{"type":"attr","position":[1]},{"type":"attr","position":[1,1]},{"type":"for","position":[1,1],"dynamicNodes":[{"type":"attr","position":[1,1],"attr":{"style":{"name":"style","helperInfo":{"name":"concat","args":["'height: '","ltPropCellHeight"]}}}},{"type":"text","position":[1,1,1]},{"type":"componentDynamic","position":[1]}]},{"type":"componentDynamic","position":[1]}]}]},"false":{"dynamicNodes":[{"type":"attr","position":[1]},{"type":"for","position":[1],"dynamicNodes":[{"type":"attr","position":[1]},{"type":"attr","position":[1,1]},{"type":"for","position":[1,1],"dynamicNodes":[{"type":"text","position":[1,0]},{"type":"componentDynamic","position":[1]}]},{"type":"componentDynamic","position":[1]}]}]}},"default":{}},{"type":"componentDynamic","position":[1,3]},{"type":"attr","position":[1,5]},{"type":"if","position":[1,5],"cases":{"true":{"dynamicNodes":[{"type":"attr","position":[1]},{"type":"componentDynamic","position":[1]},{"type":"attr","position":[3]},{"type":"if","position":[3],"cases":{"true":{"dynamicNodes":[{"type":"attr","position":[1]},{"type":"componentDynamic","position":[1]}]}},"default":{}},{"type":"attr","position":[4]},{"type":"if","position":[4],"cases":{"true":{"dynamicNodes":[{"type":"attr","position":[1]},{"type":"componentDynamic","position":[1]}]}},"default":{}}]}},"default":{}},{"type":"componentDynamic","position":[1]}]},"false":{"dynamicNodes":[{"type":"attr","position":[0]},{"type":"if","position":[0],"cases":{"true":{"dynamicNodes":[{"type":"attr","position":[1]},{"type":"insertYield","position":[1]}]},"false":{"dynamicNodes":[{"type":"insertYield","position":[1]}]}},"default":{}}]}},"default":{}}],
_observedAttributes :["ltPropContent","ltPropHeader","ltPropId","ltPropClass","ltPropBorder","ltPropHeaderLabelKey","ltPropBodyLabelKey","ltPropWidth","ltPropHeight","ltPropResize","ltPropFixedColumnClass","ltPropYield","ltPropScroll","ltPropColumnSortable","ltPropScrollbarOption","ltPropData","ltPropInfiniteScroll","ltPropCellHeight","ltPropCellWidth","ltPropContentLength","columns","nonFixedColumn","minWidth1","minWidth2","secondaryData","boundary","rowHeights"],
	init : function(){	
		if(this.getMethods('beforeRender'))
            {
                this.executeMethod('beforeRender', this.$node);
            }	
	},

	initProcess1 : function( arg ) {
		if( this._prevent ) {
			return
		}
		if( this.getData( 'ltPropInfiniteScroll' ) ) {
			var table = $L( 'lyte-table-structure', this.$node ).e[ 0 ],
			ltPropContent = this.getData('ltPropContent'), len  = this.getData( 'ltPropContentLength' ) || ltPropContent.length,
			ltPropData = [];
			if( ltPropContent.length == 0 ) {
				return;
			}
			if( table ) {
				table.style.height =  'auto';
			}
			for( var i = 0; i < len; i++ ) {
				ltPropData[ i ] = { body : ltPropContent[ i ] }
			}
			this.setData( 'ltPropData', ltPropData )
			if( arg && this._dummy ) {
				this._dummy.style.height = 0;
				this._dummy.style.transform = "translateY(0px)";
			}
			if( arg && this.scrollDiv ) {
				this.scrollDiv.scrollTop = 0;
				this.scrollDiv.scrollLeft = 0;
			}
			this._top = 0;
			this._bottom = Math.max( len - 1, 0 ) 
			this._boundary = { top : 0, bottom : len - 1 }
		}
	}.observes( 'ltPropContent' ).on( 'init' ),


	didConnect : function (){
		var ltPropInfiniteScroll = this.getData('ltPropInfiniteScroll'), secData = this.getData('secondaryData');	
		var ltPropResize = this.getData('ltPropResize')
		if(this.getData('ltPropYield') && (ltPropResize.vertical || ltPropResize.horizontal))
			{
				this.resizeComponentAppend.call(this);
			}
		else if(this.getData('ltPropYield')){
			var resize = $L('lyte-table-resize', this.$node).e[0];
			if(resize){
				resize.parentElement.removeChild(resize);
			}
		}
		try{
			var scrollDiv = $L('div.lyteTableScroll', this.$node).e[0];
			this.scrollDiv = scrollDiv;
			scrollDiv.comp = this;
			scrollDiv.addEventListener('scroll', this.scroll, true);
			$L(scrollDiv).scroll(this.getData('ltPropScrollbarOption'));
			var scrollbar = $L('.lyteScrollContainer.lyteScrollContainerY', this.$node).e[0];
			var header = $L('lyte-th', this.$node).e[0], hgt;
			$L.fastdom.measure(function(){
				// while applying scroll plugin vertical scrollbar needs some offset for enabling the virtual of only body part is scrolling. If it is zero we have to set height of the header as offset
				if(header && scrollbar && scrollbar.offsetTop == 0)
					{
						hgt = header.getBoundingClientRect().height;
						$L.fastdom.mutate(function(){
							scrollbar.style.top = hgt + 'px';
						}.bind(this))
					}
				$L.fastdom.mutate(function(){
					if(this.getMethods('afterRender'))
			            {
			                this.executeMethod('afterRender', this.$node);
			            }
				}.bind(this))	
			}.bind(this))	
		}catch(err){
		}
		if(ltPropInfiniteScroll)
			{
				this.$node.classList.add( 'infinitescroll' )
				scrollDiv._infiniteScroll = true;
				this.$node.setValue = function(ret){
					if( this._stopScroll ){
						this.appendAddData1.call(this, ret)
					}
				}.bind(this)
			}
	},

	// width calculation for positioning
	columnWidth : function(fixedColumn, i, j){
		var width = 0;
		if(!j)
			{
				j = 0
			}
		for(; j < i; j++)
			{
				width += fixedColumn[j].property.width;
			}
		return width;	
	},

	heightCalc : function(rows, upper, hgtLimit){
		var hgt = 0, j = upper;
		for(;j > 0; j--)
			{
				hgt += rows[j];
				if(hgtLimit < hgt)
					{
						break;
					}
			}
		return [hgt, j];	
	},

	scrollTable : function( event ) {
		$L.fastdom.measure(function(){
			var b = event.yScroll, ltPropData = this.getData( 'ltPropData' ), ltPropContent = this.getData( 'ltPropContent' ), scrollDiv = this.scrollDiv, divClientRect = $L('lyte-table-structure lyte-tbody', this.$node ).e[ 0 ].getBoundingClientRect(), tableClient = this.$node.getBoundingClientRect(), table = $L(' lyte-table-structure ', this.$node).e[ 0 ];
			var head = $L( 'lyte-th', this.$node ).e[ 0 ];
			head = head ? head.getBoundingClientRect().height : 0;
			var topElem = $L( 'lyte-tbody lyte-tr:nth-of-type(' + ( this._top + 1 ) + ')', this.$node ).e[ 0 ], top1 = topElem.getBoundingClientRect();

			if( table.style.height.indexOf( 'px' ) == -1 ) {
				table.style.height = divClientRect.height + 'px';
				this._rowHgt = topElem.getBoundingClientRect().height;
				this._step = divClientRect.height;
			}
			if( !this._dummy ) {
				var dummy = document.createElement( 'lyte-tr' );
				dummy.classList.add( 'dummy' );
				$L( 'lyte-tbody ', this.$node ).e[0].appendChild( dummy )
				dummy.setAttribute( 'style', 'transform:translateY(0px);height:0px' )
				this._dummy = dummy;
			}
			if( b > 0 ) {
				if( ( tableClient.top + head ) >= top1.bottom ) {
					$L.fastdom.mutate(function(){
						if( this._boundary.bottom < ltPropContent.length - 2 ) {
							var diff = Math.max( parseInt( ( tableClient.top + head - top1.bottom ) / this._rowHgt ), 1 );
							if( this._boundary.bottom + diff > ltPropContent.length - 1 ) {
								diff = ltPropContent.length - 1 - this._boundary.bottom
							}
							for( var i = 0; i < diff; i++ ) {
								this._boundary.bottom += 1;
								if( i >= diff - ltPropData.length ) {
									Lyte.Component.set(ltPropData[ this._top ], 'body', ltPropContent[ this._boundary.bottom ])
									// Lyte.objectUtils( ltPropData[ this._top ], 'add', 'body', ltPropContent[ this._boundary.bottom ] )	
								}
								this._boundary.top = this._boundary.bottom - ltPropData.length;
								if( topElem.style.transform ) {
									this.regex( topElem )
								} else {
									topElem.style.transform = "translateY(" + ( divClientRect.height ) +'px)';
								}
								this._dummy.style.transform = 'translateY(' + ( parseInt( this._dummy.style.transform.match( /\d+/ig )[ 0 ] ) + this._rowHgt ) + 'px)'
								this._dummy.style.height = Math.max( parseInt( this._dummy.style.height ) - this._rowHgt, 0 ) + 'px';
								this._bottom = this._top
								this._top = ( this._top + 1 ) % ltPropData.length;
								if( this._boundary.bottom >= ltPropContent.length ) {
									this._boundary.bottom = ltPropContent.length - 1;
									this._top = ( this._top + 1 ) % ltPropData.length;
									break
								}
								topElem = $L( 'lyte-tbody lyte-tr:nth-of-type(' + ( this._top + 1 ) + ')', this.$node ).e[ 0 ]
							}
						} else {
							this.scrollEndMethod1();
						}
				  }.bind(this))	
				}

			} else if( b < 0 ) {
				var bottmElem = $L( 'lyte-tbody lyte-tr:nth-of-type(' + ( this._bottom + 1 ) + ')', this.$node ).e[ 0 ],  bottom =  bottmElem.getBoundingClientRect();
				$L.fastdom.mutate(function(){
					 if( tableClient.bottom <= bottom.top ) {
								var mat  = bottmElem.style.transform.match( /\d+/ig );
								if( !mat || ( mat && mat[ 0 ] == '0' )) {
									return
								}
								var diff = Math.max( parseInt( ( bottom.top - tableClient.bottom )/ this._rowHgt ), 1);
								for( var i = diff - 1; i >= 0; i-- ) {
									if( i <= ltPropData.length - 1 ) {
										Lyte.Component.set(ltPropData[ this._bottom ], 'body', ltPropContent[ this._boundary.top ])
										// Lyte.objectUtils( ltPropData[ this._bottom ], 'add', 'body', ltPropContent[ this._boundary.top ] )	
									}
									this._boundary.top -= 1;
									this._boundary.bottom = this._boundary.top + ltPropData.length - 1;
									if( bottmElem.style.transform ) {
										this.regex( bottmElem, true )
									}
									this._dummy.style.height = ( parseInt( this._dummy.style.height ) + this._rowHgt ) + 'px';
									this._dummy.style.transform = 'translateY(' + ( parseInt( this._dummy.style.transform.match( /\d+/ig )[ 0 ] ) - this._rowHgt ) + 'px)'
									this._top = this._bottom;
									this._bottom = ( ltPropData.length + this._bottom - 1 ) % ltPropData.length;
									if( this._boundary.top == -1 ) {
										this._boundary.top = 0;
										this._boundary.bottom = this._boundary.top + ltPropData.length - 1;
										break
									}
									bottmElem = $L( 'lyte-tbody lyte-tr:nth-of-type(' + ( this._bottom + 1 ) + ')', this.$node ).e[ 0 ]
								}
					}
				}.bind(this))	
			}
		}.bind(this))
	},

	regex : function(elem, flag){
		if( flag ) {
			elem.style.transform = elem.style.transform.replace( /\d+/ig, function(){ return Math.max( parseInt( arguments[ 0 ] ) - this._step, 0 ) }.bind( this ) )
		} else {
			elem.style.transform = elem.style.transform.replace( /\d+/ig, function(){ return parseInt( arguments[ 0 ] ) + this._step }.bind( this ) )
		}
	},

	scrollEndMethod1 : function( ) {
		if( this._stopScroll ) {
			return
		}
		this._stopScroll = true;
		if( this.getMethods( 'scrollEnd' ) ) {
			this.appendAddData1( this.executeMethod( 'scrollEnd' ) )
		}
	},

	appendAddData1 : function( ret ){
		if( ret )
			{
				if( ret.then ) {
					Promise.resolve( ret ).then( function( arg ) {
						arr[ 0 ] = arg
						this.apd1.call( this, arr );
					}.bind( this ), function() {
							
					}.bind( this ) );
				} else {
					this.apd1.call( this, ret )
				}
			}	
	},

	apd1 : function( ret ){
		var ltPropContent = this.getData( 'ltPropContent' ), ltPropData = this.getData( 'ltPropData' )
		this._prevent = true
		if(ret.constructor == Array)
			{
				Lyte.arrayUtils( ltPropContent, 'concat', ret );
			}
		else if(ret.constructor == Object)
			{
				Lyte.arrayUtils( ltPropContent, 'push', ret );
			}
		delete this._prevent;	
		delete this._stopScroll;
	},

	scroll : function (event) {
		$L.fastdom.measure(function(){
			var component =  this.comp;
			// scrollleft and top are required for process like fixing columns and infinite scroll. If scroll is dispatched by plugin event object contains these properties or it is calculated
			this._scrollLeft = event.scrollLeft != undefined ? event.scrollLeft : this.scrollLeft;
			this._scrollTop = event.scrollTop != undefined ? event.scrollTop : this.scrollTop;
			var direction = this._direction;
			component.scrollCheck.call(this, event);
			if(this._scrollLeft == 0 && direction != 'rtl' && component.getData('ltPropInfiniteScroll'))
				{
					var ary = component.getData('columns');
					Lyte.arrayUtils(ary, 'remove', 0, ary.length);
					var fixedd = $L('.lyteTableFixed', this).e
					if(fixedd.length)
						{
							for(var i = 0; i < fixedd.length; i++)
								{
									fixedd[i].style.left = '0px';
									fixedd[i].classList.remove('lyteTableFixed');
								}
						}
				}
			if( component.getData( 'ltPropInfiniteScroll' ) ) {
				component.scrollTable.call( component, event )
			}	
			delete this._scrollLeft; delete this._scrollTop;
		}.bind(this))
	},

	// fixed column checks and removals
	scrollCheck : function(event){
		var tablee = $L('lyte-table-structure',this).e[0], scrollDiv = this;
		var scrollTop = this._scrollTop, scrollLeft = this._scrollLeft;
		var scrollDir = this.parentElement.component.getData('ltPropScroll');
		var direction = this._direction;
		// for vertical scroll
		if(scrollTop != this.prevScollTop && scrollDir.vertical)
			{
				$L.fastdom.mutate(function(){
					$L('lyte-th', this).addClass('tableRowFixed');
					var colsNos = $L('lyte-th', this).e;
					for(var i = 0; i < colsNos.length; i++){
						colsNos[i].style.top = (scrollTop) + 'px';
					}
					if(!scrollTop){
						$L('lyte-th', this).removeClass('tableRowFixed');
					}
				}.bind(this))
			}
		// for horizontal scroll	
		if(scrollLeft != this.prevScollLeft && scrollDir.horizontal)
			{	
				var component = this.parentElement.component, table = $L('lyte-table-structure', this).e[0], columns = component.getData('columns');
				var headerList = $L('lyte-th', component.$node).e, fixedColumn = $L('lyte-th.lyteFixedColumn', component.$node).e, ltPropFixedColumnClass = component.getData('ltPropFixedColumnClass')
				// marks as fixed colums on hori scroll
				$L.fastdom.measure(function(){
					for(var k = 0; k < headerList.length; k++)
						{
							// for fixing columns each column dimensions are required
							headerList[k].property = headerList[k].getBoundingClientRect();
							headerList[k].order = k
						}
					scrollDiv.property = scrollDiv.getBoundingClientRect();
					$L.fastdom.mutate(function(){
						for(var i = columns.length; i < fixedColumn.length; i++)
							{
								if(((fixedColumn[i].property.right  + component.columnWidth.call(component, fixedColumn, i) > (scrollDiv.property.right)) && direction == 'rtl') || ((fixedColumn[i].property.left < (scrollDiv.property.left + component.columnWidth.call(component, fixedColumn, i))) && direction != 'rtl'))
									{
										var width = fixedColumn[i].property.width
										var order = fixedColumn[i].order
										if(order + 1 < headerList.length)
											{
												fixedColumn[i].classList.add('lyteTableFixed')
												columns.push(fixedColumn[i])
												$L('lyte-tbody lyte-td:nth-of-type(' + (order + 1) + ')', component.$node).addClass('lyteTableFixed')
												if(ltPropFixedColumnClass)
													{	
														$L('lyte-tbody lyte-td:nth-of-type(' + (order + 1) + ')', component.$node).addClass(ltPropFixedColumnClass)
													}
											}
									}
							}	
						for(var n = columns.length - 1; n >= 0; n--)
							{
								j = columns.length - 1;
								if(((((headerList[columns[j].order + 1].property.right  + columns[j].property.width + component.columnWidth.call(component, columns, columns.length - 1)) < (scrollDiv.property.right)) || (headerList[columns[j].order + 1].property.right + 2 < columns[j].property.left)) && direction == 'rtl') || ((headerList[columns[j].order + 1].property.left >= (scrollDiv.property.left + columns[j].property.width + component.columnWidth.call(component, columns, columns.length - 1))) && (columns[j].property.left >= (scrollDiv.property.left + component.columnWidth.call(component, fixedColumn, columns.length - 1))) && direction != 'rtl'))
								  {
										$L('lyte-tbody lyte-td:nth-of-type(' + (columns[j].order + 1) + ')', component.$node).removeClass('lyteTableFixed')
										var innerElem = $L('lyte-th-data', headerList[columns[j].order]).e[0]
										headerList[columns[j].order].classList.remove('lyteTableFixed')
										if(ltPropFixedColumnClass)
											{	
												innerElem.parentElement.classList.remove(ltPropFixedColumnClass)
												$L('lyte-tbody lyte-td:nth-of-type(' + (columns[j].order + 1) + ')', component.$node).removeClass(ltPropFixedColumnClass)
											}
										columns[j].style.removeProperty('left');
										var currCols = $L('lyte-tbody lyte-td:nth-of-type(' + (columns[j].order + 1) + ')', component.$node).e;
										for(var z = 0; z < currCols.length; z++)
											{
												currCols[z].style.removeProperty('left');
											}
										Lyte.arrayUtils(columns, 'removeAt', j)
									}
								else
									{
										break;
									}		
							}	
						for(var j = 0; j < columns.length; j++)
							{
								//positioning on scroll
								var left, cells = $L('lyte-tbody lyte-td:nth-of-type(' + (columns[j].order + 1) + ')', component.$node).e
								if(j == 0)
							    	{
							    		if(direction == 'rtl')
							    			{
							    				if(navigator.userAgent.toLowerCase().indexOf('firefox') != -1 || (navigator.userAgent.toLowerCase().indexOf('safari') != -1 && !(navigator.userAgent.toLowerCase().indexOf('chrome') != -1) && !(navigator.userAgent.toLowerCase().indexOf('chromium') != -1)))
							    					{
							    						left = scrollLeft - (component.columnWidth.call(component, headerList, columns[j].order, 0))
							    					}
							    				else if(navigator.userAgent.toLowerCase().indexOf('edge') != -1 || navigator.userAgent.toLowerCase().indexOf('trident') != -1 || navigator.userAgent.toLowerCase().indexOf('msie') != -1)
							    					{
							    						left = -scrollLeft - (component.columnWidth.call(component, headerList, columns[j].order, 0))
							    					}	
							    				else
							    					{
							    						left = scrollLeft - 1 - (event.scrollWidth) + this.property.width + (component.columnWidth.call(component, headerList, columns[j].order, 0))
							    					}	
							    			}
							    		else
							    			{
							    				left = scrollLeft - (component.columnWidth.call(component, headerList, columns[j].order, 0))
							    			}
							    	}
							    else
							    	{
							    		if(direction == 'rtl')
							    			{
							    				if(navigator.userAgent.toLowerCase().indexOf('firefox') != -1 || (navigator.userAgent.toLowerCase().indexOf('safari') != -1 && !(navigator.userAgent.toLowerCase().indexOf('chrome') != -1) && !(navigator.userAgent.toLowerCase().indexOf('chromium') != -1)))
							    					{
							    						left = parseInt(columns[j - 1].style.left) + component.columnWidth.call(component, headerList, columns[j].order, columns[j-1].order + 1)
							    					}
							    				else
							    					{	
							    						left = parseInt(columns[j - 1].style.left) + component.columnWidth.call(component, headerList, columns[j].order, columns[j-1].order + 1);
							    					}
							    			}
							    		else
							    			{
							    				left = parseInt(columns[j - 1].style.left) - component.columnWidth.call(component, headerList, columns[j].order, columns[j-1].order + 1)
							    			}
							    	}	
								for(var x = 0; x < cells.length; x++)
							    	{
							    		cells[x].style.left = left + 'px';
							    	}
					    		 columns[j].style.left = left + 'px';
							}
					}.bind(this))
				}.bind(this))
			  }
		this.prevScollLeft = scrollLeft;
		this.prevScollTop = scrollTop; 
		delete scrollDiv.property;
	},
	// border 

	borderChangeObs : function(){
		this.borderChange.call(this);
	}.observes('ltPropBorder').on('didConnect'),

    borderChange : function() {
		if(this.getData('ltPropBorder'))
			{
				this.$node.classList.add('border');
			}
		else
			{
				this.$node.classList.remove('border');
			}
	},

	widthObsObs : function(){
		this.widthObs.call(this);
	}.observes('ltPropWidth').on('didConnect'), 

	widthObs : function(){
		$L('lyte-table-structure',this.$node).e[0].style.width = this.getData('ltPropWidth');
	},

	heightObsObs : function(){
		this.heightObs.call(this);
	}.observes('ltPropHeight').on('didConnect'),

	heightObs : function(){
		$L('lyte-table-structure',this.$node).e[0].style.height = this.getData('ltPropHeight');
	}, 

	sortableObs : function(){
		this.sortable.call(this);
	}.observes('ltPropColumnSortable').on('didConnect'),

	sortable : function(){
		var row = $L('lyte-thead', this.$node).e[0];
		if(row)
			{
				if(this.getData('ltPropColumnSortable'))
					{
						this.colSort = this.sortableColumns.bind(this)
						row.addEventListener('mousedown', this.colSort);
					}
				else
					{
						row.removeEventListener('mousedown', this.colSort);
					}	
			}
	},

	composePath : function(event){
		var arr = [], node = event.target;
		while(node.tagName != 'HTML')
			{
				arr.push(node);
				node = node.parentElement;
			}
		return arr;	
	},

	sortableColumns : function(event){
		var target = this.closestFind.call(this, event.path ? event.path : this.composePath.call(this, event), 'lyte-th:not(.lyteTableFixed)');
		if(target && this.$node.contains(target))
			{
				var ret;
				if( this.executeMethod( 'onBeforeSelect' ) ) {
					ret = this.executeMethod( 'onBeforeSelect', target, event, this.$node )
				}
				if( ret != false ) {
					this.mousemove = this.sortableMouseMove.bind(this);
					this.offLeft = event.clientX - target.getBoundingClientRect().left;
					this.colHead = target;
					document.documentElement.addEventListener('mousemove',this.mousemove);
					this.mouseup = this.sortableMouseup.bind(this);
					document.documentElement.addEventListener('mouseup',this.mouseup);
					this.flag = true;
					event.preventDefault();
					if( this.getMethods( 'onSelect' ) ) {
						this.executeMethod( 'onSelect', target, event, this.$node )
					}
				}
			}
	},

	sortableMouseMove : function(event){
		if(this.flag)
			{
				var target = this.colHead
				var clientRect = target.getBoundingClientRect();
				var div = document.createElement('div');
				div.classList.add('lyteTableDummy');
				var xscroll = window.pageXOffset || document.documentElement.scrollLeft
      			var yscroll = window.pageYOffset || document.documentElement.scrollTop  
				div.style.height = clientRect.height + 'px';
				div.style.width = clientRect.width + 'px';
				div.style.left = (xscroll + clientRect.left) + 'px';
				div.style.top = (yscroll + clientRect.top) + 'px';
				document.body.appendChild(div);
				this.flag = false;
			}
		var dummyDiv = $L('div.lyteTableDummy').e[0];
		if(dummyDiv)
			{
				dummyDiv.style.left = (event.clientX - this.offLeft) + 'px';
				if( this.getMethods( 'onDrag' ) ) {
					this.executeMethod( 'onDrag', this.colHead, dummyDiv, event, this.$node )
				}
			}
		event.preventDefault();
		event.stopPropagation();	
	},

	sortableMouseup : function(event){
		if(!this.flag)
			{
				var dummyDiv = $L('div.lyteTableDummy').e[0], clientRect = dummyDiv.getBoundingClientRect(), x = clientRect.left + clientRect.width/2 + 2, y = clientRect.top + clientRect.height/2;
				var adjCol = this.closestFind.call(this, document.elementsFromPoint ? document.elementsFromPoint(x, y) : this.elementsFromPointCal.call(this, x, y), 'lyte-th:not(.lyteTableFixed)');
				if(adjCol != this.colHead && adjCol)
					{
						var Heads = $L('lyte-th', this.colHead.parentElement).e
						var colOrder = Array.prototype.indexOf.call(Heads, this.colHead);
						var adjOrder = Array.prototype.indexOf.call(Heads, adjCol);
						var ltPropHeader = this.getData('ltPropHeader'), ret;
						if( this.getMethods( 'onBeforeDrop' ) ) {
							ret = this.executeMethod( 'onBeforeDrop', this.colHead, adjCol, colOrder, adjOrder, ltPropHeader, event, this.$node )
						}
						if( ret != false ) {
							if(!ltPropHeader)
								{
									this.colHead.parentElement.insertBefore(this.colHead, adjOrder > colOrder ? adjCol.nextSibling : adjCol);
									var colGrp = $L('lyte-tbody lyte-td:nth-of-type(' + (colOrder + 1) +')', this.$node).e;
									var AdjColGrp = $L('lyte-tbody lyte-td:nth-of-type(' + (adjOrder + 1) +')', this.$node).e;
									for(var i = 0; i < colGrp.length; i++)
										{
											colGrp[i].parentElement.insertBefore(colGrp[i], adjOrder > colOrder ? AdjColGrp[i].nextSibling : AdjColGrp[i]);
										}
								}
							else
								{
									var flag = adjOrder > colOrder ? true : false;
									var temp = Lyte.arrayUtils(ltPropHeader, 'removeAt',colOrder), newOrder = Array.prototype.indexOf.call($L('lyte-th', adjCol.parentElement).e, adjCol);
									Lyte.arrayUtils(ltPropHeader,'insertAt', colOrder < adjOrder ? (newOrder + 1) : newOrder, temp);
									var newCol = $L('lyte-th', adjCol.parentElement).e[colOrder < adjOrder ? (newOrder + 1) : newOrder];
									if(adjCol.classList.contains('tableRowFixed'))
										{
											newCol.classList.add('tableRowFixed');
											newCol.style.top = adjCol.style.top;
										}	
								}
							if( this.getMethods( 'onDrop' ) ) {
								this.executeMethod( 'onDrop', this.colHead, adjCol, colOrder, adjOrder, ltPropHeader, event, this.$node )
							}	
						}
					}
				document.body.removeChild(dummyDiv);
			}
		document.documentElement.removeEventListener('mouseup',this.mouseup);
		document.documentElement.removeEventListener('mousemove',this.mousemove);
		delete this.mouseup;
		delete this.mousemove;	
		delete this.offLeft;
		delete this.colHead;
		delete this.flag;
		event.preventDefault();
		event.stopPropagation();
		event.stopImmediatePropagation();
	},

	elementsFromPointCal : function(x, y){
		var arr = [], element = document.elementFromPoint(x, y);
		while(element != document && element != document.documentElement && element != document.body && element != this.$node)
			{
				element.style.pointerEvents = 'none';
				arr.push(element);
				element = document.elementFromPoint(x, y);
			}
		for(var i = 0; i < arr.length; i++)
			{
				arr[i].style.pointerEvents = 'initial';
			}
		return arr;		
	},

	resizeComponentAppendObs : function(){
		this.resizeComponentAppend.call(this);
	}.observes('ltPropResize'),

	resizeComponentAppend : function(){
		if(this.getData('ltPropYield'))
			{
				var ltPropResize = this.getData('ltPropResize');
				if(ltPropResize.vertical || ltPropResize.horizontal)
					{
						var comp = document.createElement('lyte-table-resize')
						$L('lyte-table-structure', this.$node).e[0].appendChild(comp)
						comp.addEventListener('mousedown',function(event){this.$node.constructor._actions.tableResize.call(this, event)}.bind(this));
					}
				if(ltPropResize.vertical)
					{
						var comp = document.createElement('lyte-table-vertical-resize')
						$L('lyte-table-structure', this.$node).e[0].appendChild(comp)
						comp.addEventListener('mousedown',function(event){this.$node.constructor._actions.tableResize.call(this, event)}.bind(this))
					}
				else
					{
						var comp = $L('lyte-table-vertical-resize', this.$node).e[0];
						if(comp)
							{
								comp.parentElement.removeChild(comp);
							}
					}	
				if(ltPropResize.horizontal)
					{
						var comp = document.createElement('lyte-table-horizontal-resize')
						$L('lyte-table-structure', this.$node).e[0].appendChild(comp)
						comp.addEventListener('mousedown',function(event){this.$node.constructor._actions.tableResize.call(this, event)}.bind(this))
					}
				else
					{
						var comp = $L('lyte-table-horizontal-resize', this.$node).e[0];
						if(comp)
							{
								comp.parentElement.removeChild(comp);
							}
					}	
			}
	},

	data : function(){
		return {
			//user data
			ltPropContent:Lyte.attr("array",{"default":[]}),
			ltPropHeader:Lyte.attr("array",{"default":[]}),
			ltPropId:Lyte.attr("string",{"default":''}),
			ltPropClass:Lyte.attr("string",{"default":''}),
			ltPropBorder:Lyte.attr("boolean",{"default":false}),
			ltPropHeaderLabelKey : Lyte.attr("string",{"default":''}),
			ltPropBodyLabelKey : Lyte.attr("string",{"default":''}),
			ltPropWidth : Lyte.attr('string',{'default' : '100%'}),
			ltPropHeight : Lyte.attr('string',{'default' : '100%'}),
			ltPropResize : Lyte.attr('object',{'default' : {}}),
			ltPropFixedColumnClass : Lyte.attr('string',{'default':''}),
			ltPropYield : Lyte.attr('boolean',{'default':false}),
			ltPropScroll : Lyte.attr('object', {'default' : {horizontal : true , vertical : true}}),
			ltPropColumnSortable : Lyte.attr('boolean', {'default' : false}),
			ltPropScrollbarOption : Lyte.attr('object', {'default' : {}}),

			// scroll table test data
			ltPropData : Lyte.attr( "array", { "default" : [ ] } ),
			ltPropInfiniteScroll : Lyte.attr('boolean', {'default' : false}),
			ltPropCellHeight : Lyte.attr( 'string', { default : '20px' } ),
			ltPropCellWidth : Lyte.attr( 'string', { default : 'auto' } ),
			ltPropContentLength : Lyte.attr( 'number'),

			// system data
			columns : Lyte.attr('array',{'default' : []}),
			nonFixedColumn : Lyte.attr('array',{'default' : []}),
			minWidth1 : Lyte.attr('string',{'default' : ''}),
			minWidth2 : Lyte.attr('string',{'default' : ''}),
			secondaryData : Lyte.attr('array',{'default' : []}),
			boundary : Lyte.attr('object', {'default' : {}}),
			rowHeights : Lyte.attr('array', {'default' : []})
		}
	},
	actions:{
	     //  resize initialization 	
 	     'tableResize' : function(event){
 	     		$L.fastdom.measure(function(){
 	     			var resizeComponent = event.target.parentElement, Component = this, prevSibling = resizeComponent.previousElementSibling;
	 	    		document.Component = this; this.resizeComponent = resizeComponent, this.targetElem = event.target;
	 	    		if(($L('lyte-th:last-of-type',resizeComponent.parentElement).e[0] != resizeComponent && resizeComponent.tagName == 'LYTE-TH')|| resizeComponent.tagName != 'LYTE-TH')
	 	    			{
	 	    				resizeComponent.offLeft = resizeComponent.getBoundingClientRect().width + resizeComponent.getBoundingClientRect().left
			 	    		resizeComponent.offTop = event.clientY
			 	    		document.addEventListener('mouseup',this.mouseup)
			 	    		document.addEventListener('mousemove',this.resizeFunc)
			 	    		if(resizeComponent.tagName == 'LYTE-TH')
				 	    		{
				 	    			var headerList = $L('lyte-th', this.$node).e;
		 	    					var arr = [];
		 	    					$L.fastdom.measure(function(){
		 	    						for(var i = 0; i < headerList.length; i++)
			 	    						{	
			 	    							if(!headerList[i].style.width)
			 	    								{
			 	    									arr.push(headerList[i].clientWidth)
			 	    								}
			 	    							else{
			 	    								arr.push(null);
			 	    							}	
			 	    						}
			 	    					$L.fastdom.mutate(function(){
			 	    						for(var i = 0; i < headerList.length; i++)
				 	    						{	
				 	    							if(arr[i])
				 	    								{
				 	    									headerList[i].style.width = arr[i] + 'px';
				 	    								}	
				 	    						}
				 	    					var dummyWid = resizeComponent.nextElementSibling.style.width;
				 	    					var dummyWid1 = resizeComponent.style.width;
				 	    					$L.fastdom.measure(function(){
				 	    						resizeComponent.nextElementSibling.style.removeProperty('width')
					 	    					this.minWidth.call(this, resizeComponent, 'minWidth1')
					 	    					resizeComponent.nextElementSibling.style.width = dummyWid
							 	    			resizeComponent.style.removeProperty('width')
					 	    					this.minWidth.call(this, resizeComponent.nextElementSibling, 'minWidth2')
					 	    					resizeComponent.style.width = dummyWid1;	
				 	    					}.bind(this))
			 	    					}.bind(this))
		 	    					}.bind(this))
		 	    					// var table = $L('lyte-table-structure', this.$node).e[0]
				 	    		}	
				 	    }
 	     		}.bind(this))
			 	 event.preventDefault();
      			 event.stopPropagation();
      			 event.stopImmediatePropagation();
 	    	 }
	},
	//min - width calculation
	minWidth : function(resizeComponent, arg){
		// for find original min width of a cell its width is set to its minumum width and width calculated 
		var minWidth = window.getComputedStyle(resizeComponent, null).getPropertyValue('min-width')
		width  = resizeComponent.offsetWidth + 'px'
		resizeComponent.style.width = minWidth == '0px' ? '50px' : minWidth;
		minWidth = resizeComponent.offsetWidth + 'px'
		resizeComponent.style.width = width
		this.setData(arg, minWidth)		
	},
	// resize finishing
	mouseup : function(event){
		var component = document.Component, resizeComponent = component.resizeComponent;
		document.removeEventListener('mouseup', component.mouseup)
		document.removeEventListener('mousemove', component.resizeFunc)
		delete document.Component;
		event.stopPropagation()
	},
	// resizing
	resizeFunc : function(event){
		var component = document.Component, resizeComponent = component.resizeComponent, ltPropResize = component.getData('ltPropResize'),offset = event.clientX - resizeComponent.offLeft;
		resizeComponent.width = resizeComponent.getBoundingClientRect().width;
		if((ltPropResize.horizontal || resizeComponent.tagName == 'LYTE-TH') && offset) 
			{
				var width = offset + resizeComponent.width , tableWidth = component.getData('tableWidth');
				if(resizeComponent.tagName == 'LYTE-TH')
					{
						if(width > Math.ceil(parseFloat(component.getData('minWidth1'))))	
							{	
								var next = resizeComponent.nextElementSibling, width1 = next.getBoundingClientRect().width - offset
								if(width1 >  Math.ceil(parseFloat(component.getData('minWidth2'))))	
									{
								    	next.style.width = (width1) + 'px'
										resizeComponent.style.width = (width) + 'px'
									}
							}	
				    }
			    else if(resizeComponent.tagName != 'LYTE-TH' && (component.targetElem.tagName == 'LYTE-TABLE-HORIZONTAL-RESIZE' || component.targetElem.tagName == 'LYTE-TABLE-RESIZE'))
					{
						var elem = resizeComponent.parentElement;
						if(elem.tagName == 'LYTE-YIELD')
							{
								elem = elem.parentElement;
							}
						resizeComponent.style.width = (width) + 'px'
						component.$node.style.width = resizeComponent.style.width;
					}
				resizeComponent.offLeft = event.clientX
				delete resizeComponent.width;
			}
		if(ltPropResize.vertical && resizeComponent.tagName != 'LYTE-TH' && (component.targetElem.tagName == 'LYTE-TABLE-VERTICAL-RESIZE' || component.targetElem.tagName == 'LYTE-TABLE-RESIZE'))	
			{
				resizeComponent.style.height = (event.clientY + resizeComponent.getBoundingClientRect().height - resizeComponent.offTop) + 'px'
				resizeComponent.offTop = event.clientY
			}
		event.preventDefault(); 
		event.stopPropagation();
	},

	arrayFrom : function(nodeList){
	 	var arrayList = [];
	 	for(var i = 0; i < nodeList.length; i++)
	 		{
	 			arrayList.push(nodeList[i]);
	 		}
	 	return arrayList.slice();	
	 },

	closestFind : function(path, query){
			var elements = this.arrayFrom.call(this, document.querySelectorAll(query));
			for(var i = 0; i < path.length; i++)
				{
					if(Array.prototype.indexOf.call(elements, path[i]) != -1)
						{
							return path[i];
						}
				}
			return null;	
		}

});
Lyte.createCustomElement("lyte-th", {
	static : {
		 "observedAttributes" : {
			get : function() {
				return ['fixed', 'resize', 'icon'];
			}
		}
	},
	"attributeChangedCallback" : function(attr, oldVal, newVal) {
		if (attr == 'fixed') {
      	var scrollingDiv = this;
      	 while(scrollingDiv.tagName != 'DIV')
	      	{
	      		scrollingDiv = scrollingDiv.parentElement;
	      	}  
        if (newVal == 'enable') {
          this.classList.add('lyteFixedColumn');
        } else {
          this.classList.remove('lyteFixedColumn');
        }
      } else if (attr == 'resize') {
        if (newVal == 'enable') {
          var tabHead = document.createElement('lyte-tablehead-resize');
          tabHead.addEventListener('mousedown', this.resize);
          this.appendChild(tabHead);
        } else {
          var tabHead = this.querySelector('lyte-tablehead-resize');
          if (tabHead) {
            this.removeChild(tabHead);
          }
        }
      } else if(attr == 'icon'){
      	if(newVal == 'disable'){
      		this.classList.add('lytePreventIcon');
      	} else {
      		this.classList.remove('lytePreventIcon');
      	}
      }
	},
	resize : function(event){
		  var resizeComponent = event.target.parentElement, table = event.target;
	      while(table.tagName != 'LYTE-TABLE')
	      	{
	      		table = table.parentElement;
	      	}    
	      table.constructor._actions.tableResize.call(table.component, event);
	}
});

