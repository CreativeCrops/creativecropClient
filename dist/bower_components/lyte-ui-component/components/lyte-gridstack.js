Lyte.Component.register('lyte-gridstack', {
_template:"<template tag-name=\"lyte-gridstack\">\t\t<lyte-yield yield-name=\"lyteGridStack\">\t\t</lyte-yield></template>",
_dynamicNodes : [{"type":"insertYield","position":[1]}],
_observedAttributes :["ltPropScope","ltPropHandler","ltPropMarginLeft","ltPropMarginTop","ltPropUnitX","ltPropUnitY","ltPropResizeDirection","ltPropFloat","ltPropDirection","ltPropUndo","ltPropResize","ltPropBestfit","ltPropMinUnitX","ltPropMinMarginLeft","ltPropBestfitClass","ltPropFreezeMode","ltPropDefaultLength","ltPropDefaultHeight","ltPropDefaultMinLength","ltPropDefaultMinHeight","ltPropDefaultMaxHeight","ltPropDefaultMaxLength","ltPropColumnMode","ltPropColumn","ltPropPrevent","ltPropGridLength","ltPropBestfitType","ltPropForcedReposition","ltPropSquareGrid","ltPropGridSpaceColor","ltPropHitBottom","ltPropGridSelectionClass","ltPropVisibleBoundary","ltPropVisible","gridLength","ltPropGridHeight","ltPropMarginLeftCopy","ltPropUnitXCopy","lyteGridStack","elements","oriNode","xElements","yElements","iniData","lyteQuerySelector"],
    init : function(){
        this._childGrids = [];
        this.freeezeModeObs.call(this, this.getData('ltPropFreezeMode'));
        if(this.getMethods('beforeRender'))
            {
                this.executeMethod('beforeRender', this.$node);
            }
    }, 
    didDestroy : function(){
        document.removeEventListener('keydown', this.getData('lyteQuerySelector').keydown);
        window.removeEventListener('resize', this._resizeFunc, true);
        document.removeEventListener( 'click', this._click );
        this.$node.removeEventListener( 'scroll', this._scroll, true);
        if(this._parentGrid){
            Lyte.arrayUtils(this._parentGrid.component._childGrids, 'removeAt',  this._parentGridIndex)
        }

        if(this._parentComp){
            delete this._parentComp._childGrid;
        }
         
        if(document._lyteCurrentGrid == this){
            delete document._lyteCurrentGrid;
        }
    },

    windowResize : function(){
        clearTimeout(window._gridResize)
        window._gridResize = setTimeout(function(){
            var minX = this.getData('ltPropMinUnitX'), minLeft = this.getData('ltPropMinMarginLeft'), maxX = this.getData('ltPropUnitX'), maxLeft = this.getData('ltPropMarginLeft') 
            if(this._initialWindowWidth > window.innerWidth)
                {
                     var wid = this.scopeElement.getBoundingClientRect().width;
                     var ltPropUnitX = this.getData('ltPropUnitX');
                     var temp1 = parseInt((this._initialXRatio * wid).toFixed(1)), temp2 = parseInt((this._initialXRatio * wid * this._initialMarginRatio).toFixed(1));
                     this.setData('ltPropUnitXCopy', Math.min(Math.max(temp1 ,minX), maxX))
                     this.setData('ltPropMarginLeftCopy', Math.min(Math.max(temp2 ,minLeft), maxLeft));
                }
            else if(this._initialWindowWidth <= window.innerWidth)
                {
                    this._initialWindowWidth = window.innerWidth;
                    this.setData('ltPropUnitXCopy', this.getData('ltPropUnitX'));
                    this.setData('ltPropMarginLeftCopy', this.getData('ltPropMarginLeft'));
                }  
            // if(this._initialWindowWidth != window.innerWidth) {     
                this.MarginLeftAndXObs.call(this, true);
                this.observerFunc.call(this); 
            // }
            delete window._gridResize;
            if(this.getMethods('onWindowResize'))
                {
                    this.executeMethod('onWindowResize', event, this.$node);
                }
        }.bind(this), 250);    
    },

    MarginLeft : function(){
       this.MarginLeftAndXObs.apply(this, arguments);
    }.observes('ltPropMarginLeft', 'ltPropUnitX'),

    MarginLeftAndXObs : function(flag){
        if(flag.constructor == Object)
            {
                this.setData('ltPropUnitXCopy', this.getData('ltPropUnitX'));
                this.setData('ltPropMarginLeftCopy', this.getData('ltPropMarginLeft'));
            }
        var ltPropUnitXCopy = this.getData('ltPropUnitXCopy')
        var margin = this.getData('ltPropMarginLeftCopy')
        this.setData('gridLength', parseInt(((this.scopeElement.getBoundingClientRect().width - margin) / (ltPropUnitXCopy + margin)).toFixed(0)))
    },

    squareGridObs :  function() {
        if(arguments[0].newValue) {
            this._originalY = this.getData( 'ltPropUnitY' );
            this.setData( 'ltPropUnitY', this.getData( 'ltPropUnitX' ) );
        } else {
            if(this._originalY) {
                this.setData( 'ltPropUnitY', this._originalY );
                delete this._originalY;
            } else {
                this.setData( 'ltPropUnitY', 50 );
            }
        }
    }.observes( 'ltPropSquareGrid' ),

    obsfunc : function(){
        if(this.getData('ltPropSquareGrid')){
            if(arguments[0].item == "ltPropUnitX"){
                this.setData('ltPropUnitY', arguments[0].newValue)
            }else if(arguments[0].item == "ltPropUnitY"){
                this.setData('ltPropUnitX', arguments[0].newValue)
            }
       }
      if(!this._prevObs){
            this.observerFunc.apply(this, arguments);
        }
    }.observes('ltPropUnitX', 'ltPropUnitY', 'ltPropMarginLeft', 'ltPropMarginTop'),

    observerFunc : function(flag){
        var style = this._style;
        if(style){
            this.$node.removeChild(style);
            delete this._style;
            this.initialValSet.call(this, null, !flag);
        }
    },

    freezeobs : function(){
        this.freeezeModeObs.apply(this, arguments);
    }.observes('ltPropFreezeMode'),

    freeezeModeObs : function(arg){
        if(arg.constructor == Object || arg.constructor == Boolean){
            if(arg.oldValue == false || arg == true){
                this.$node.classList.add('gridFreezeMode');
            }
            else if(arg.oldValue == true || arg == false){
                this.$node.classList.remove('gridFreezeMode');
            }
        }
    },

    columnMode : function(arg){
        if(arg.newValue == false)
            {
                 var handQuer = this.getData('ltPropHandler');
                 var iniData = this.getData('iniData');
                 var elements = (/^#/g.test(handQuer) && !/\s/g.test(handQuer)) ? this.scopeElement.querySelectorAll(handQuer) : $L(handQuer, this.scopeElement).e;
                 for(var i = 0; i < elements.length; i++)
                    {
                        for(var yy in iniData[i])
                            {
                                // elements[i].removeAttribute('lyte-grid-' + yy);
                                if(iniData[i][yy])
                                    {
                                        elements[i].setAttribute('lyte-grid-' + yy, iniData[i][yy]);
                                    }
                            }
                    }
                if( this.data.ltPropUnitX == ( this._originalX || this.getData( 'ltPropUnitXCopy' ) )){
                    this.initialValSet( true )
                } else {
                    this.setData('ltPropUnitX', this._originalX || this.getData( 'ltPropUnitXCopy' ));
                }    
            } else {
                this._originalX = this.getData('ltPropUnitXCopy')
                if( arg.item != 'ltPropForcedReposition' ) {
                    this.columnModeLengthFind();
                    this.setData('gridLength', this.gridLength(null, this.getData('ltPropUnitXCopy')));
                }
                this.initialValSet.call(this);
            }
    }.observes('ltPropColumn', 'ltPropColumnMode', 'ltPropForcedReposition' ),

    bestFitObs : function(arg){
        var bestfit  = this._bestfit;
        if(bestfit){
                if(arg.newValue){
                        bestfit.classList.add(arg.newValue);
                    }
                if(arg.oldValue){
                        bestfit.classList.remove(arg.oldValue);
                    }
            }
    }.observes('ltPropBestfitClass'),

    bfObs : function() {
        var bf = this.getData( 'ltPropBestfit' ), bftype = this.getData( 'ltPropBestfitType' )
        if( bf && bftype == 'grid' ) {
                var color = this.getData( 'ltPropGridSpaceColor' ), MarginLeft = this.getData( 'ltPropMarginLeftCopy' ), marginTop = this.getData( 'ltPropMarginTop' ), unitX = this.getData( 'ltPropUnitXCopy' ), unitY = this.getData( 'ltPropUnitY' );
                this.scopeElement.style.backgroundImage = 'linear-gradient(to right,' + color +' ' + MarginLeft + 'px,transparent 0px),linear-gradient(to bottom,'+ color + ' ' + marginTop + 'px,transparent 0px)'; 
                this.scopeElement.style.backgroundSize = ( unitX + MarginLeft ) + 'px ' + ( unitY + marginTop ) + 'px';
                if( this._bestfit ) {
                    if( arguments[0].newValue == 'grid' ) {
                        this._bestfit.classList.add('lyteGrid')
                    }
                    this._bestfit.style.transform = "translate(-" + MarginLeft + "px,-" + marginTop +"px)"

                }
        } else if( !bf || bftype == 'default' ) {
            this.scopeElement.style.removeProperty( 'background-image' );
            this.scopeElement.style.removeProperty( 'background-size' )
            if( this._bestfit ) {
                this._bestfit.style.removeProperty( 'background-image' );
                this._bestfit.style.removeProperty( 'background-size' );
                this._bestfit.style.removeProperty( 'transform' );
                if( arguments[0].newValue == 'default' ) {
                    this._bestfit.classList.remove('lyteGrid')
                }
            }
        }
    }.observes( 'ltPropBestfit', 'ltPropBestfitType' ),

    lengthObs : function(){
        this.setData('gridLength', 0);
        this.$node.reRender();
    }.observes('ltPropGridLength'),

    gridColorObs :  function(arg) {
          if( this.getData( 'ltPropBestfitType' ) == 'grid' && this.getData( 'ltPropBestfit' )) {
                this.scopeElement.style.backgroundImage = 'linear-gradient(to right,' + arg.newValue +' ' + this.getData( 'ltPropMarginLeftCopy' ) + 'px,transparent 0px),linear-gradient(to bottom,'+ arg.newValue + ' ' + this.getData( 'ltPropMarginTop' ) + 'px,transparent 0px)'; 
            }
    }.observes('ltPropGridSpaceColor'), 

    dataSetting : function(elements1, i, columnMode, column,gridLength){
        var data1 = {x : undefined, y : undefined, length : 1, height : 1, nodeName : '', preX : [], preY : [], preLength : [], preHeight : [], component : undefined}
        if(!columnMode)
            {
                data1 = this.initialPosFind.call(this, elements1);
            }
        else
            {
                var tem = parseInt(gridLength / column);
                data1.x = undefined;
                data1.y = undefined;
                data1.length = tem;
                data1.height = parseInt(this.getData('ltPropDefaultHeight'));
                this._dopeHgt = data1.height;
            }    
        data1.nodeName = elements1;
        data1.nodeName.dataSet = {};
        data1.oldX = []; 
        data1.oldY = []; 
        data1.oldLength = []; 
        data1.oldHeight = []; 
        elements1.elemNum = i;
        data1.minLength = elements1.getAttribute('lyte-grid-min-length') ? this.returnWid(elements1.getAttribute('lyte-grid-min-length'), true) : this.returnWid(this.getData('ltPropDefaultMinLength'), true);
        data1.minHeight = elements1.getAttribute('lyte-grid-min-height') ? this.returnWid(elements1.getAttribute('lyte-grid-min-height')) : this.returnWid(this.getData('ltPropDefaultMinHeight'));
        data1.maxLength = elements1.getAttribute('lyte-grid-max-length') ? this.returnWid(elements1.getAttribute('lyte-grid-max-length'), true) : this.returnWid(this.getData('ltPropDefaultMaxLength'), true);
        data1.maxHeight = elements1.getAttribute('lyte-grid-max-height') ? this.returnWid(elements1.getAttribute('lyte-grid-max-height')) : this.returnWid(this.getData('ltPropDefaultMaxHeight'));
        data1.component = this;
        return data1;
    },

    append : function(element, classes, clsName, resizeDir){
        $L.fastdom.mutate(function(){
             var divElem = document.createElement('div');
             divElem.setAttribute('class', classes[clsName.indexOf(resizeDir)] + " lyteGridResize");
             element.appendChild(divElem);
        })
    },

    maxPosFind : function(elements, lyteQuerySelector, columnMode, data, flag){
        var  b = [], a = [], c = [], d = [];
        for(var i = 0; i < elements.length; i++ )
                {
                    if(!flag){
                        var retVal = this.emptySpaceFind.call(this, {length : data[i].length, height : data[i].height, x : data[i].x, y : data[i].y, nodeName : data[i].nodeName});
                        if(!elements[ i ]._addGrid || columnMode )
                            {
                                data[i].x = retVal[0].x;
                                data[i].y = retVal[0].y;
                            }  
                        if( elements[ i ]._addGrid ){
                            delete elements[ i ]._addGrid;
                          }  
                        }
                    a.push(data[i].length);             
                    b.push(data[i].height);
                    c.push(data[i].y + data[i].height) 
                    d.push(data[i].x + data[i].length) 
                }
         if(!flag){           
            this.previousPos.call(this, elements, true)
        }
        lyteQuerySelector.MaxLength = Math.max.apply(null, a.length ? a : [ 0 ]); 
        lyteQuerySelector.MaxHeight = Math.max.apply(null, b.length ? b : [ 0 ]); 
        lyteQuerySelector.MaxBottom = Math.max.apply(null, c.length ? c : [ 0 ]);
        lyteQuerySelector.MaxLeft = Math.max.apply(null, d.length ? d : [ this.getData('gridLength') ]);
    },

    // default css construction and getting data from grids
    initialValSet : function(styleFlag, resizeFlag){
    // collecting data and calculating max height and width of the scope
        var lyteQuerySelector = this.getData('lyteQuerySelector');
        var data = this.getData('lyteGridStack');
        var scope = $L(this.getData('ltPropScope'), this.$node).e[0];
        var ltPropUnitXCopy =  parseInt(this.getData('ltPropUnitXCopy')), ltPropUnitY =  parseInt(this.getData('ltPropUnitY')), ltPropUnitX =  parseInt(this.getData('ltPropUnitX'));
        var ltPropMarginTop = parseInt(this.getData('ltPropMarginTop')), ltPropMarginLeftCopy = parseInt(this.getData('ltPropMarginLeftCopy'))
        var gridLength  = parseInt(this.getData('gridLength')), columnMode = this.getData('ltPropColumnMode'), column = this.getData('ltPropColumn');
        var thisnodeClient = this.bcrrelem ? this.bcrrelem : this.scopeElement.getBoundingClientRect();
        var resizeDir = this.getData('ltPropResizeDirection');
        lyteQuerySelector.occupied = [];
        lyteQuerySelector.currentPos = 0;
        lyteQuerySelector.verticalMove = true;
        var elements = $L(this.getData('ltPropHandler'),scope).e;
        scope.dataSet = {};
        lyteQuerySelector.elementCount = [];
        if(!resizeFlag)
            {
                for(var i = 0; i < elements.length; i++ )
                    {
                        data[i] = this.dataSetting.call(this, elements[i], i, columnMode, column, gridLength);
                        lyteQuerySelector.elementCount.push(i);
                        if(this.getData('ltPropResize') == true)
                            {
                                var prevResize = $L('.lyteGridResize', data[i].nodeName).e;
                                if(prevResize.length == 0 && data[i].nodeName.getAttribute('lyte-grid-resize') != "disabled")
                                    {
                                        for(var j = 0;j < resizeDir.length;j++ )
                                            {
                                                var classes = ['lyteGridStackLeft', 'lyteGridStackRight', 'lyteGridStackBottom', 'lyteGridStackBottomLeft', 'lyteGridStackBottomRight', 'lyteGridStackTop', 'lyteGridStackTopLeft', 'lyteGridStackTopRight'];
                                                var clsName = ['left', 'right', 'bottom', 'bottomLeft', 'bottomRight', 'top', 'topLeft', 'topRight']
                                                if(clsName.indexOf(resizeDir[j]) != -1)
                                                    {
                                                        this.append(elements[i], classes, clsName, resizeDir[j])
                                                    }
                                            }
                                    }
                            }
                    }
                 this.maxPosFind(elements, lyteQuerySelector, columnMode, data)   
                 
        }
        if(this._initialWindowWidth == window.innerWidth){
            this._initialXRatio = ltPropUnitX / thisnodeClient.width;
            this._initialMarginRatio = this.getData('ltPropMarginLeft') / ltPropUnitX  
        }
        $L.fastdom.mutate(function(){
            scope.style.height = ((lyteQuerySelector.MaxBottom) * ltPropUnitY + ((lyteQuerySelector.MaxBottom + 1) * parseInt(this.getData('ltPropMarginTop')))) + 'px'  
            if(this.getData('ltPropBestfitType') == "grid" && this.getData( 'ltPropBestfit' )){
                var color = this.getData('ltPropGridSpaceColor');
                this.scopeElement.style.backgroundImage = 'linear-gradient(to right,' + color +' ' + ltPropMarginLeftCopy + 'px,transparent 0px),linear-gradient(to bottom,'+ color + ' ' + ltPropMarginTop + 'px,transparent 0px)'; 
                this.scopeElement.style.backgroundSize = ( ltPropUnitXCopy + ltPropMarginLeftCopy ) + 'px ' + ( ltPropUnitY + ltPropMarginTop ) + 'px';
            }
        }.bind(this))
        if(!styleFlag)    
                {
                    var style = this._style, elem
                    if(!style)     
                        {
                            style = document.createElement('style');
                            style.type = "text/css";
                            style.id = "lyteGridStack";
                            this._style = style;
                            $L.fastdom.mutate(function(){
                                this.$node.appendChild(style)
                            }.bind(this))
                        }
                     var hand = $L(this.getData('ltPropHandler'), this.$node).e;
                     if(hand && hand.length){
                        $L(this.getData('ltPropHandler'), this.$node).addClass('lyteGridstackHandler');
                     }   
                    // Constructing initial CSS     
                    var totalWid = thisnodeClient.width, elem;
                    this._initialXRatio = ltPropUnitXCopy / thisnodeClient.width;
                    this._initialMarginRatio = this.getData('ltPropMarginLeft') / ltPropUnitX 
                    for(var i = 1;i <= Math.max(gridLength , lyteQuerySelector.MaxBottom) + 1;i++ )
                        {
                            if(i <= gridLength)
                                {
                                    if( $L( '.' + this.getData('ltPropHandler').replace(/[.|#]/gi,'') + "lytegridx" + (i-1), this.$node).e.length == 0 ) {
                                        elem = this.getData('ltPropScope') + " " + this.getData('ltPropHandler') + "[lyte-grid-x = \"" + (i-1) + "\"]{left:" +  (((i - 1) * ltPropUnitXCopy + (i * ltPropMarginLeftCopy )) *100/totalWid) + "%;}"
                                        this.styleFormation.call(this, elem, this.getData('ltPropHandler').replace(/[.|#]/gi,'') + "lytegridx" + (i-1))
                                    }
                                    if( i <= gridLength && $L( '.' + this.getData('ltPropHandler').replace(/[.|#]/gi,'') + "lytegridlength" + (i-1), this.$node).e.length == 0 )
                                        {
                                            elem = this.getData('ltPropScope') + " " +this.getData('ltPropHandler') + "[lyte-grid-length = \"" + i + "\"]{width:" +  ((i * ltPropUnitXCopy + ((i - 1) * ltPropMarginLeftCopy)) * 100 / totalWid) + "%;}"
                                            this.styleFormation.call(this, elem, this.getData('ltPropHandler').replace(/[.|#]/gi,'') + "lytegridlength" + (i-1) )
                                        }
                                }
                            if(i <= lyteQuerySelector.MaxBottom + 1)
                                {
                                    if( $L( '.' + this.getData('ltPropHandler').replace(/[.|#]/gi,'') + "lytegridy" + (i-1) , this.$node).e.length == 0 ) {
                                        elem =this.getData('ltPropScope') + " " + this.getData('ltPropHandler') + "[lyte-grid-y = \"" + (i-1) + "\"]{top:" + ((i - 1) * ltPropUnitY + (i * ltPropMarginTop)) + "px;}"
                                        this.styleFormation.call(this, elem, this.getData('ltPropHandler').replace(/[.|#]/gi,'') + "lytegridy" + (i-1))
                                    }
                                    if(i <= lyteQuerySelector.MaxHeight && $L( '.' + this.getData('ltPropHandler').replace(/[.|#]/gi,'') + "lytegridheight" + (i-1), this.$node).e.length == 0)
                                        {
                                            elem =this.getData('ltPropScope') + " " + this.getData('ltPropHandler') + "[lyte-grid-height = \"" + i + "\"]{height:" + (i * ltPropUnitY + (i - 1) * ltPropMarginTop) + "px;}"
                                            this.styleFormation.call(this, elem, this.getData('ltPropHandler').replace(/[.|#]/gi,'') + "lytegridheight" + (i-1))
                                        }
                                }   
                        }
                    this.setData('ltPropGridHeight', lyteQuerySelector.MaxBottom)
            }
        this.displayGrid.call(this, null);  
        if(this.bcrrelem){
            delete this.bcrrelem;
        }
    }, 
    // function for finding maximum height of the scope 
    maxHeight : function(data){
            var elements = $L(this.getData('ltPropHandler'), $L(this.getData('ltPropScope'), this.$node).e[0]).e;
            var b = [], a = [], c = [];
            for(var i = 0;i < elements.length;i++ )
                {   
                    a.push(data[i].length);             
                    b.push(data[i].height);
                    c.push(data[i].y + data[i].height)
                }
            return [Math.max.apply(null,a), Math.max.apply(null,b), Math.max.apply(null,c)] 
    }, 
    // function for Constructing css dynamically while changing lyte-grid-y && lyte-grid-length && lyte-grid-height
    styleFormation : function(elem, id){
                 $L.fastdom.mutate(function(){
                    if( $L( '.' + id, this.$node).e.length == 0 ) {
                        var style = document.createElement('style');
                        style.type = "text/css";
                        style.setAttribute('class',id)
                        this._style.appendChild(style)
                        style.append(elem)
                    }
                }.bind(this))
    }, 
    // Checking and initiating css construction
    cssConstruct : function(target, attributeName, faldd){
        var data = this.getData('lyteGridStack'), scope = $L(this.getData('ltPropScope'), this.$node).e[0], lyteQuerySelector = this.getData('lyteQuerySelector'), elem;
        var lyteGridHeight  = this.returnWid(target.getAttribute('lyte-grid-height'), null, target), lyteGridLength  = this.returnWid(target.getAttribute('lyte-grid-length'), true, target), lyteGridX  = parseInt(target.getAttribute('lyte-grid-x')),lyteGridY = parseInt(target.getAttribute('lyte-grid-y'))
        var ltPropUnitXCopy = this.getData('ltPropUnitXCopy'), ltPropUnitY = this.getData('ltPropUnitY'), ltPropMarginTop = this.getData('ltPropMarginTop'), ltPropMarginLeftCopy = this.getData('ltPropMarginLeftCopy')
        // Checking for height
        if(attributeName == "lyte-grid-height")
            {   
                 if(lyteGridHeight > lyteQuerySelector.MaxHeight)
                    {   
                        for(var i = lyteQuerySelector.MaxHeight + 1;i <= (lyteGridHeight);i++ )
                            {
                                if( $L( '.' + this.getData('ltPropHandler').replace(/[.|#]/gi,'') + "lytegridheight" + (i + 1), this.$node).e.length == 0  ) {
                                    elem =this.getData('ltPropScope') + " " + this.getData('ltPropHandler') + "[lyte-grid-height = \"" + ((i) + "\"]{height:" + (i * ltPropUnitY + ((i - 1) * ltPropMarginTop))) + "px;}"
                                    this.styleFormation.call(this, elem, this.getData('ltPropHandler').replace(/[.|#]/gi,'') + "lytegridheight" + (i + 1))
                                }
                            }
                    }
            }
        // Checking for top position    
        else if(attributeName == "lyte-grid-y")
            {
                if((lyteGridY + (lyteGridHeight)) >= (lyteQuerySelector.MaxBottom))
                    {
                        for(var i = lyteQuerySelector.MaxBottom - lyteGridHeight; i <= (lyteGridY + lyteGridHeight); i++ )
                            {
                                if( $L( '.' + this.getData('ltPropHandler').replace(/[.|#]/gi,'') + "lytegridy" + (i), this.$node).e.length == 0 ) {
                                    elem =this.getData('ltPropScope') + " " + this.getData('ltPropHandler') + "[lyte-grid-y = \"" + (i) + "\"]{top:" + ((i) * ltPropUnitY + (i + 1) * ltPropMarginTop) + "px;}"
                                    this.styleFormation.call(this, elem, this.getData('ltPropHandler').replace(/[.|#]/gi,'') + "lytegridy" + (i))
                                }
                            }
                        lyteQuerySelector.previousNode = target   
                    }
            }
         if(["lyte-grid-height", "lyte-grid-y"].indexOf(attributeName) != -1){
               var ret = this.maxHeight(data);
               this.setData('ltPropGridHeight', ret[2])
               if(lyteQuerySelector.MaxBottom > ret[ 2 ])
                    {
                        for(var j = lyteQuerySelector.MaxBottom;j > ret[2];j--)
                            {
                                if($L('.'+this.getData('ltPropHandler').replace(/[.|#]/gi,'') + "lytegridy" + (j), this.$node).e[0])
                                    {
                                        var temporary = this._style
                                        if(temporary)
                                            {
                                                var dummy = $L('.'+this.getData('ltPropHandler').replace(/[.|#]/gi,'') + "lytegridy" + (j), this.$node).e[0]
                                                if(dummy && dummy.parentElement == temporary)
                                                    {
                                                        // unused styles are removed here
                                                        temporary.removeChild(dummy)
                                                    }
                                            }
                                    }
                            }
                    } 
               lyteQuerySelector.MaxBottom = ret[2]   
           }   
            scope.style.height = ((lyteQuerySelector.MaxBottom) * ltPropUnitY + ((lyteQuerySelector.MaxBottom + 1) * ltPropMarginTop)) + 'px'        
        }, 
    // initiating css construction  
    setVal : function(target, attributeName, attributeValue){
        // $L.fastdom.mutate(function(){t 
            // can't use fastdom here because of delay causes issue caching previous data
            // if( target.getAttribute( attributeName ) != attributeValue ) {
                target.setAttribute(attributeName, attributeValue);
            // }
                if(attributeName == 'lyte-grid-y' || attributeName == 'lyte-grid-height' || attributeName == 'lyte-grid-length' || attributeName == 'lyte-grid-x')
                    {
                        this.cssConstruct.call(this, target, attributeName)
                    }
                target.dataSet[attributeName] = attributeValue; 
        // }.bind(this))
    }, 
    // initiating css construction  and finding grid positions
    displayGrid : function(x, flag){
                var elements = $L(this.getData('ltPropHandler'), this.scopeElement).e, lyteQuerySelector = this.getData('lyteQuerySelector');
                var data = this.getData('lyteGridStack');
                for(var k = 0;k < elements.length;k++ )
                    {
                        if((k != x) && !flag || (flag && k == x))
                            {
                                this.setVal(elements[k], 'lyte-grid-y', data[k].y)  
                                this.setVal(elements[k], 'lyte-grid-x', data[k].x)
                                if(data[k].length != data[k].nodeName.getAttribute('lyte-grid-length-old'))
                                    {   
                                        this.setVal(elements[k], 'lyte-grid-length', data[k].length, true)
                                    }
                                if(data[k].height != data[k].nodeName.getAttribute('lyte-grid-height-old'))
                                    {
                                        this.setVal(elements[k], 'lyte-grid-height', data[k].height)
                                    }
                            }
                    }
                this.scopeElement.dataSet['lt-prop-grid-height'] = lyteQuerySelector.MaxBottom
                this.scopeElement.dataSet['lt-prop-grid-length'] = parseInt(this.getData('gridLength'))   
                 $L.fastdom.mutate(function(){
                     this.positionFind.call(this, elements)
                 }.bind(this))
                        
        }, 
    // To find all grid positions   
    positionFind : function(elements){
                elements = elements || $L(this.getData('ltPropHandler'), this.scopeElement).e;
                var xCor = [], yCor = [], xCorEnd = [], yCorEnd = [], x = [], y = [], a = [], b = [], Max, data = this.getData('lyteGridStack');
                for(var k = 0;k < elements.length;k++ )
                    {
                        x.push(data[k].x);
                        y.push(data[k].y);
                        a.push(data[k].x + data[k].length);
                        b.push(data[k].y + data[k].height);
                    }
                Max = Math.max(Math.max.apply(null,x), Math.max.apply(null,y), Math.max.apply(null,a), Math.max.apply(null,b));
                for(var j = 0;j <= Max;j++ )
                    {
                        x = [], y = [], a = [], b = [];
                        for(var i = 0;i < data.length;i++ )
                            {   
                                if(data[i].x <= j && j <= data[i].x + data[i].length)
                                    {
                                        x.push(i);
                                    }   
                                if(data[i].y <= j && j <= data[i].y + data[i].height)
                                    {
                                        y.push(i);
                                    }               
                            }
                        xCor.push(x);
                        yCor.push(y);
                    }
                Lyte.arrayUtils(this.data.xElements, 'remove', 0, this.data.xElements.length)
                Lyte.arrayUtils(this.data.xElements, 'concat', xCor)    
                Lyte.arrayUtils(this.data.yElements, 'remove', 0, this.data.yElements.length)
                Lyte.arrayUtils(this.data.yElements, 'concat', yCor)      
       
    }, 
    // To remove same elements from Checking    
    multipleRemoval : function(elementsToCheck){
            elementsToCheck = elementsToCheck || [];
            for(var z = 0;z < elementsToCheck.length;z++ )
                {
                    for(var y = z + 1;y < elementsToCheck.length;y++ )
                    {
                        if(elementsToCheck[z] == elementsToCheck[y])
                        {
                            Lyte.arrayUtils(elementsToCheck, 'removeAt', y)
                            y--;
                        }
                    }
                }
             return elementsToCheck 
    }, 
    // To check elements in hori and vertical directions
    similarData : function(elementsToCheck1, elementsToCheck2){
            var temp = []
            if(!(elementsToCheck1 == undefined || elementsToCheck2 == undefined))
                {
                    for(var i = 0;i < elementsToCheck1.length;i++ )
                        {
                            for(var j = 0;j < elementsToCheck2.length;j++ )
                                {
                                    if(elementsToCheck1[i] == elementsToCheck2[j])
                                        {
                                            temp.push(elementsToCheck1[i]);
                                            break;
                                        }
                                }
                        }
                }
            else
                {
                    temp = elementsToCheck1 ? elementsToCheck1 : elementsToCheck2;
                }   
            return temp;    
    }, 
    // To find the other elements on selected element
    elementCheck : function(element, node, flag){
            var elementsToCheck = [], k, xElements = this.getData('xElements'), dum = 1;
             var data = this.getData('lyteGridStack');
            if(data[node.elemNum].length > 1)
                {
                    if(flag)
                        {
                            k = data[node.elemNum].x
                            dum = 0;
                        }
                    else
                        {
                             k = data[node.elemNum].x + 1;
                        } 
                   elementsToCheck = this.yElementsFind( k, data[node.elemNum].x + data[node.elemNum].length - dum, xElements)       
                }
            else
                {
                    elementsToCheck = this.similarData.call(this, xElements[data[node.elemNum].x], xElements[data[node.elemNum].x + 1])
                }
            if(elementsToCheck)                 
                {
                    return this.multipleRemoval.call(this, elementsToCheck);    
                }
            else
                {
                    return [];
                }   
    }, 
    // To find clicked Pos
    nodeName : function(event){
            var nodeName = event.target;
            if(nodeName)
            {
                var flag = false, val;
                var element = $L(this.getData('ltPropScope'), this.$node).e[0];
                if( event.type == 'mousedown') {
                    while(nodeName != element && nodeName.tagName != "BODY" && nodeName.tagName != "HTML")
                        {
                            if(nodeName.classList.contains('lyteGridStackLeft'))
                                {
                                    val = 'left'
                                    flag = true
                                    break;
                                }
                            else if(nodeName.classList.contains('lyteGridStackRight'))
                                {
                                    val = 'right'
                                    flag = true
                                    break;
                                }
                            else if(nodeName.classList.contains('lyteGridStackBottom'))
                                {
                                    val = 'bottom'
                                    flag = true
                                    break;
                                }
                            else if(nodeName.classList.contains('lyteGridStackBottomLeft'))
                                {
                                    val = 'BottomLeft'
                                    flag = true
                                    break;
                                }
                            else if(nodeName.classList.contains('lyteGridStackBottomRight'))
                                {
                                    val = 'BottomRight'
                                    flag = true
                                    break;
                                } 
                            else if(nodeName.classList.contains('lyteGridStackTop'))
                                {
                                    val = 'top'
                                    flag = true
                                    break;
                                }
                            else if(nodeName.classList.contains('lyteGridStackTopLeft'))
                                {
                                    val = 'topLeft'
                                    flag = true
                                    break;
                                }
                            else if(nodeName.classList.contains('lyteGridStackTopRight'))
                                {
                                    val = 'topRight'
                                    flag = true
                                    break;
                                }       
                            else if(nodeName.tagName == 'LYTE-GRID-CONTENT')
                                {
                                    val = 'content'
                                    flag = true
                                    break;
                                }           
                            else
                                {
                                    nodeName = nodeName.parentElement;
                                } 
                        }
                    if(nodeName != element && flag)
                        {
                            return [val, nodeName.parentElement, nodeName.parentElement.parentElement];
                        }
                } else if( event.type == 'click' ) {
                    while( nodeName != element && nodeName.tagName != "BODY" && nodeName.tagName != "HTML" ) {
                        if( nodeName.classList.contains( 'lyteGridstackHandler' )  && $L( '.lyteGridResize', nodeName ).e.length) {
                            flag = true;
                            break;
                        } else {
                            nodeName = nodeName.parentElement;
                        } 
                    }
                    if( flag ) {
                        return nodeName
                    }
                }
            }
         return null;
    },
    // updating value on every changes 
    valueUpdating : function(i, x, attributeName){
        var data = this.getData('lyteGridStack')
        if(data[i][x] != data[i].nodeName.dataSet[attributeName])
            {
                data[i].nodeName.dataSet[attributeName + '-old'] =  data[i].nodeName.dataSet[attributeName]
                data[i].nodeName.dataSet[attributeName] = parseInt(data[i][x])
            }
    }, 
    // Number of elements adjacent around selected elements
    bottomElementsCount : function(node, direction){
        var x, y, length, height, yElements1, xElements1, offsetLeft, initialLeft, lytegridlength, x, ltPropMarginLeftCopy ;
        if(direction == 'vertical')
            {
                x = 'y', y = 'x', length = 'height', height = 'length', yElements1 = 'xElements', xElements1 = 'yElements', offsetLeft = 'offsetTop', initialLeft = 'initialTop', lytegridlength = 'lyte-grid-height', ltPropMarginLeftCopy ='ltPropMarginTop', ltPropUnit = 'ltPropUnitY'
            }
        else
            {
                x = 'x', y = 'y', length = 'length', height = 'height', yElements1 = 'yElements', xElements1 = 'xElements', offsetLeft = 'offsetLeft', initialLeft = 'initialLeft', lytegridlength = 'lyte-grid-length', ltPropMarginLeftCopy ='ltPropMarginLeftCopy', ltPropUnit = 'ltPropUnitXCopy'
            }
        var data = this.getData('lyteGridStack'), yElements = this.getData(yElements1), xElements = this.getData(xElements1), elementsToCheck = [], elementsToCheck1 = [], elementsToCheck2 = [];
        if(data[node.elemNum][length] > 1)
            {
                elementsToCheck = this.yElementsFind(data[node.elemNum][x] + 1, data[node.elemNum][x] + data[node.elemNum][length] - 1, xElements)
            }
        else
            {
                elementsToCheck = this.similarData.call(this, xElements[data[node.elemNum][x]], xElements[data[node.elemNum][x] + data[node.elemNum][length]])
            }  
        elementsToCheck1 = this.multipleRemoval.call(this, elementsToCheck1.concat(yElements[data[node.elemNum][y] + data[node.elemNum][height]]))
        elementsToCheck2 = this.multipleRemoval.call(this,elementsToCheck2.concat(yElements[data[node.elemNum][y]]))
        elementsToCheck = this.multipleRemoval.call(this, elementsToCheck)  
        if(elementsToCheck1.length)
            {
                Lyte.arrayUtils(elementsToCheck1, 'removeAt', elementsToCheck1.indexOf(node.elemNum));
            }
        if(elementsToCheck2.length)
            {
                Lyte.arrayUtils(elementsToCheck2, 'removeAt', elementsToCheck2.indexOf(node.elemNum));
            }
        if(elementsToCheck.length)
            {    
                Lyte.arrayUtils(elementsToCheck, 'removeAt', elementsToCheck.indexOf(node.elemNum));
            }
        var array = [];
        array[array.length] = this.similarData.call(this, elementsToCheck, elementsToCheck1).length
        array[array.length] = this.similarData.call(this, elementsToCheck, elementsToCheck2).length
        return array;
    },

    // where selected grid direction changes
    contraFlexure : function(node,direction){
            var movement, instantPrevious, offsetTop, initialTop
            if(direction == 'x')
                {   
                     instantPrevious = 'instantPreviousX', offsetTop = 'offLeft', initialTop = 'initialLeft'
                }
            else
                {
                     instantPrevious = 'instantPreviousY', offsetTop = 'offTop', initialTop = 'initialTop'
                } 
            if((node[instantPrevious] > node[offsetTop]))
                {
                    node[initialTop][0] = node[offsetTop] 
                }
            else if(( node[offsetTop] >= node[instantPrevious]))
                {
                    node[initialTop][0] = node[offsetTop]
                }
            node[instantPrevious] = node[offsetTop] 
        },

     returnY : function(node, flag){
        var offtop, margin, unit, ret;
        if(flag) {
            offtop = "offTop", margin = this.getData('ltPropMarginTop'), unit = this.getData('ltPropUnitY')
        } else {
            offtop = "offLeft", margin = this.getData('ltPropMarginLeftCopy'), unit = this.getData('ltPropUnitXCopy')
        }
        return  parseInt( ( ( node[ offtop ] - margin ) / ( unit + margin ) ).toFixed( 0 ) );
     }, 

     scrollCheckY : function( node , thisClientRect, unitY, nodeClientRect, innHgt, event, scrollWidth, flag, flag2) {
        if( this._scrollCheck && !flag2) {
            return
        }
        this._scrollCheck = true;
        var scrollTop = "scrollTop", topPos = "top", clientY = "clientY", bottom = "bottom", prevEvY = 'prevEvY', prevEvX = 'prevEvX', clientX = "clientX", width = "height", scrWid = "scrollHeight";
        if( flag ) {
            scrollTop = "scrollLeft", topPos = "left", clientY = "clientX", bottom = "right", prevEvY = 'prevEvX', prevEvX = 'prevEvY', clientX = "clientY", width = "width", scrWid = "scrollWidth";
        }
        $L.fastdom.mutate(function(){
            if( this.$node[scrollTop] != 0 && Math.max( thisClientRect[ topPos ], 0 ) > Math.min( nodeClientRect[ topPos ], event[ clientY ] ) && !( thisClientRect[ bottom ] < nodeClientRect[ bottom ] ) && ( event[ clientY ] < node[ prevEvY ] || node[ prevEvY ] == undefined)  && Math.abs( event[ clientY ] - node[ prevEvY ]) > Math.abs( event[ clientX ] - node[ prevEvX ] )) {
                this.$node[ scrollTop ] -= 1 * unitY;
            } else if( this.$node[ scrollTop ] + thisClientRect[ width ] < ( scrollWidth - 10 ) && Math.min( thisClientRect[ bottom ], innHgt ) < Math.max( nodeClientRect[ bottom ], event[ clientY ] ) && !( thisClientRect[ topPos ] > nodeClientRect[ topPos ] ) && ( event[ clientY ] > node[ prevEvY ] || node[ prevEvY ] == undefined) && Math.abs( event[ clientY ] - node[ prevEvY ]) > Math.abs( event[ clientX ] - node[ prevEvX ] ) ) {
                this.$node[ scrollTop ] += 1 * unitY;
            } else {
                window.cancelAnimationFrame( this._reqId );
                delete this._reqId;
                delete  this._scrollCheck;
                node.prevEvX = event.clientX, node.prevEvY = event.clientY;
                return;
            }
           this._reqId = window.requestAnimationFrame( function() {
                nodeClientRect = node.getBoundingClientRect();
                this.scrollCheckY.call(this, node , thisClientRect, unitY, nodeClientRect, innHgt, event, scrollWidth, flag, true )
           }.bind( this ) ) 
        }.bind( this ) )
     },

    // Initial function on mousemove    
    mousemoveFun : function(element, event){
    event.preventDefault()    
    if( this._scrollCheck ) {
        return
    }
    var lyteQuerySelector = this.elementSorting.call(this, this.getData( 'lyteQuerySelector' ) ), data = this.getData('lyteGridStack');
    if( !lyteQuerySelector.previousPosFind ) {
        lyteQuerySelector.previousPosFind = true;
        if( this.getMethods( 'onDragStart' ) ) {
            this.executeMethod( 'onDragStart', this.retNode( lyteQuerySelector.SelectedNodes, data ), this.$node )
        }
    }
    for(var z = 0;z < lyteQuerySelector.SelectedNodes.length; z++)
        {   
            var i, j, k, flag = true, stackElements = [], stackElements1 = [], flag1 = true, flag2 = true, elementsToCheck = [], elementsToCheck1 = [], btmEl, btmEl1;
            var node = data[lyteQuerySelector.SelectedNodes[z]].nodeName;
            var xIni = node.xPos;
            var yIni = node.yPos;
            var elements = $L(this.getData('ltPropHandler'), element).e;
            var xPos = event.clientX;
            var yPos = event.clientY;
            var gridLength = this.getData('gridLength'), gridHeight = this.getData('ltPropGridHeight');
            var xElements = this.getData('xElements');
            var yElements = this.getData('yElements');
            var unitX = this.getData('ltPropUnitXCopy'), unitY = this.getData('ltPropUnitY');
            var marginTop = this.getData('ltPropMarginTop');
            var MarginLeft = this.getData('ltPropMarginLeftCopy'), dumm, prevent = this.getData('ltPropPrevent');
            node.offLeft = node.offsetLeft, node.offTop = node.offsetTop;
            node.classList.add( 'lyteGridStackMove' );
            var thisClientRect = this.$node.getBoundingClientRect(), scrollWidth = this.$node.scrollWidth, scrollHeight = this.$node.scrollHeight, nodeClientRect = node.getBoundingClientRect(), innWid = window.innerWidth, innHgt = window.innerHeight;
            if(((node.initialLeft[1]- node.offLeft) < 0))
                {
                    node.initialLeft[1] += parseInt(((-node.initialLeft[1] + node.offLeft)/unitX).toFixed(0)) * unitX
                }
            else if(((node.initialLeft[1]- node.offLeft) > 0))
                {
                    node.initialLeft[1] -= parseInt(((node.initialLeft[1]- node.offLeft)/unitX).toFixed(0))* unitX
                }   
            if(((node.initialTop[1]- node.offTop) < 0))
                {
                    node.initialTop[1] += parseInt(((-node.initialTop[1] + node.offTop)/ unitY).toFixed(0))* unitY
                }
            else if(((node.initialTop[1]- node.offTop) > 0))
                {
                    node.initialTop[1] -= parseInt(((node.initialTop[1]- node.offTop)/unitY).toFixed(0))* unitY
                }
            i = node.elemNum;
            if(data[i].length != parseInt(node.getAttribute('lyte-grid-length')) || data[i].height != parseInt(node.getAttribute('lyte-grid-height')) || ((node.offLeft < node.initialLeft[0]) && (node.offTop < node.initialTop[0])))
                {
                    flag2 = true
                }
            else if((data[i].x) == parseInt(node.getAttribute('lyte-grid-x')))
                {
                    flag2 = false
                }
            else if(node.offTop > (node.initialTop[0] + unitY))
                {
                    flag2 = false
                }           
            if(node.flag)   
                {
                    left = xPos-xIni;
                    topPos = yPos-yIni; 
                    if(!prevent.horizontal){
                        node.style.left = (left) + 'px';
                        node.offLeft = left;
                    }
                    if(!prevent.vertical){
                        node.style.top = topPos + 'px'; 
                        node.offTop = topPos;
                    }
                    var temppp = this.returnY( node );
                    if(temppp != data[i].x){
                        dumm = true
                    }
                    data[i].x = temppp > 0 ? temppp : 0;
                    data[i].x = data[i].x > (gridLength - data[i].length) ? (gridLength - data[i].length) : data[i].x;
                    this.scrollCheckY.call( this, node , thisClientRect, unitY, nodeClientRect, innHgt, event, scrollHeight)
                    this.scrollCheckY.call( this, node , thisClientRect, unitX, nodeClientRect, innWid, event, scrollWidth, true )
                }
            else
                {
                    // resizing functions
                    var minWidth = (data[i].minLength * unitX + ((data[i].minLength-1) * MarginLeft))
                    var maxWidth = (data[i].maxLength * unitX + ((data[i].maxLength-1) * MarginLeft))
                    var minHgt = (data[i].minHeight * unitY + ((data[i].minHeight-1) * marginTop));
                    var maxHgt = (data[i].maxHeight * unitY + ((data[i].maxHeight-1) * marginTop));
                    if(!prevent.horizontal && ([ 'right', 'BottomRight', 'topRight' ].indexOf( node.value ) != -1 ) && (node.xOff + xPos- nodeClientRect.left) >= unitX)
                        {
                            var tempWid = node.xOff + xPos- nodeClientRect.left;
                            if(maxWidth >= minWidth)
                                {
                                     node.style.width = Math.min(Math.max(tempWid, minWidth), maxWidth) + 'px';
                                }
                            else
                                {
                                     node.style.width = Math.max(tempWid, minWidth) + 'px';
                                }    
                            data[i].x = this.returnY( node );
                            if((node.offLeft + parseInt(node.style.width)) > ((gridLength) * unitX + ((gridLength + 1) * MarginLeft)))
                                {
                                    data[i].x = gridLength - data[i].length
                                }
                            else 
                                { 
                                    data[node.elemNum].length = parseInt(((parseInt(node.style.width) + MarginLeft)/(MarginLeft + unitX)).toFixed(0))
                                }      
                        }
                    else if(!prevent.horizontal && ([ 'left', 'BottomLeft', 'topLeft' ].indexOf( node.value ) != -1 ) && (node.xOff + Math.abs(xPos - nodeClientRect.left - nodeClientRect.width)) >= unitX)
                        {
                            var twid = nodeClientRect.width - (-node.xOff + xPos - nodeClientRect.left);
                            if(twid > 0 && twid >= minWidth && (twid <= maxWidth || maxWidth < 0))
                                {
                                    node.style.width = twid + 'px'
                                    node.style.left = (-node.xOff + xPos - nodeClientRect.left + node.offLeft) + 'px';
                                    node.offLeft = parseInt(node.style.left);
                                }
                            var newLeft = this.returnY( node)
                            if((node.offLeft + ( node.style.width ? parseInt(node.style.width) : nodeClientRect.width ) ) > ((gridLength) * unitX + ((gridLength + 1) * MarginLeft)))
                                {
                                    newLeft = gridLength - data[i].length
                                }
                            else 
                                { 

                                    data[node.elemNum].length +=  data[ i ].x - newLeft;
                                }  
                            data[ i ].x = newLeft;    
                        }   
                    data[i].x = data[i].x > (gridLength - data[i].length) ? (gridLength - data[i].length) : data[i].x; 
                    if(!prevent.vertical && ([ 'BottomRight' , 'BottomLeft', 'bottom' ].indexOf(node.value) != -1) && (node.yOff + yPos - nodeClientRect.top) >= unitY)
                        {
                            var tempHgt = node.yOff + yPos - nodeClientRect.top;
                            if(maxHgt >= minHgt)
                                {
                                    node.style.height = Math.min(Math.max(tempHgt, minHgt), maxHgt) + 'px';
                                }
                            else
                                {
                                    node.style.height = Math.max(tempHgt, minHgt) + 'px';
                                }   
                            data[node.elemNum].height = parseInt(((( node.style.height ? parseInt( node.style.height ) : nodeClientRect.height ) + marginTop)/(marginTop + unitY)).toFixed(0))                              
                        } 
                   else if(!prevent.vertical && (['top', 'topRight', 'topLeft' ].indexOf(node.value) != -1) && ( node.yOff + Math.abs( yPos - nodeClientRect.top - nodeClientRect.height ) ) >= unitY ) {
                        var twid = nodeClientRect.height - (-node.yOff + yPos - nodeClientRect.top);
                        if( twid > 0 && twid >= minHgt && ( twid <= maxHgt || maxHgt < 0 ) )
                            {
                                node.style.height = twid + 'px'
                                node.style.top = (-node.yOff + yPos - nodeClientRect.top + node.offTop) + 'px';
                                node.offTop = parseInt(node.style.top);
                            }
                        var newLeft = this.returnY( node, true)
                        newLeft  = Math.max( newLeft, 0 );
                        data[node.elemNum].height +=  data[ i ].y - newLeft;
                        data[ i ].y = newLeft; 
                   }

                   if( this._parentGrid ) {
                        node._percentHeight = ( ( node.style.height ? parseInt( node.style.height )  : nodeClientRect.height + 2 * marginTop ) * 100 / thisClientRect.height ) + '%';
                        node._percentLength = ( ( node.style.width ? parseInt( node.style.width )  : nodeClientRect.width + 2 * MarginLeft) * 100 / thisClientRect.width ) + '%';
                   }        
                } 
            var btmEl = this.bottomElementsCount.call(this, node, 'horizontal'),btmEl1 = this.bottomElementsCount.call(this, node, 'vertical')
            if(node.initialTop[0] > node.offTop && !prevent.vertical)
                {
                    this.verticalMoveBottomToTop.call(this, element, node)
                }
            else if(node.initialTop[0] < node.offTop && !prevent. vertical)
                {
                    this.verticalMoveTopToBottom.call(this, element, node)
                }
            if(!prevent.horizontal){    
                if((btmEl1[0] != 0 && (node.offLeft > node.initialLeft[0])) || !node.flag || (btmEl1[1] != 0 && node.initialLeft[0] > node.offLeft && data[node.elemNum].height <= parseInt(node.getAttribute('lyte-grid-height'))) || ((data[i].length) > node.dataSet['lyte-grid-length-old']) && data[node.elemNum].height <= parseInt(node.getAttribute('lyte-grid-height')))       
                    {
                        this.topCheck.call(this, node, element);  
                        if(!this.getData('ltPropFloat'))
                            {
                                this.topMoveFunc.call(this, node, null, null, null, true);
                            }
                    }
            }   
              // offsets are continuously changing during mousemove and grid interchanges. so it is nescessary to calculate offsets 
            if(!prevent.vertical){
                if(flag2|| (btmEl[0] == 0 && node.initialTop[0] < node.offTop) || (btmEl[1] == 0 && node.initialTop[0] > node.offTop) || !this.getData('ltPropFloat'))
                    {
                        var temp = parseInt(((node.offTop - marginTop)/(unitY + marginTop)).toFixed(0))
                        if( [ 'top', 'topLeft', 'topRight' ].indexOf( node.value ) != -1 ) {
                             data[i].y = temp
                        } else {
                            if( ( btmEl[ 0 ] == 0 && node.initialTop[ 0 ] < node.offTop ) )
                                {
                                    if( data[ i ].y <= temp ) {
                                            data[i].y = temp
                                    }
                                }
                            else if( ( btmEl[ 1 ] == 0 && node.initialTop[ 0 ] > node.offTop ) )
                                {
                                    if( data[ i ].y >= temp ){
                                            data[i].y = temp
                                    }
                                }
                        }
                        data[ i ].y = data[ i ].y > 0 ? data[ i ].y : 0;
                    }
            }
            if(dumm || data[node.elemNum].x != parseInt(node.getAttribute('lyte-grid-x')) || data[node.elemNum].length != parseInt(node.getAttribute('lyte-grid-length')) || data[node.elemNum].height != parseInt(node.getAttribute('lyte-grid-height')))    
                {    
                    this.valueUpdating.call(this, i, 'x', 'lyte-grid-x')
                    this.valueUpdating.call(this, i, 'y', 'lyte-grid-y')
                    this.valueUpdating.call(this, i, 'length', 'lyte-grid-length')
                    this.valueUpdating.call(this, i, 'height', 'lyte-grid-height')        
                    this.positionFind.call(this, elements)        
                    var l, count = 0, stackElements = [];
                    var data = this.getData('lyteGridStack');
                    if((node.initialLeft[0] > node.offLeft || node.initialLeft[0] < node.offLeft) || (node.dataSet['lyte-grid-length-old'] > data[node.elemNum].length))
                        {
                            elementsToCheck =  xElements[data[node.elemNum].x].concat(xElements[data[node.elemNum].x + data[node.elemNum].length])
                        }   
                    elementsToCheck1 = this.yElementsFind.call(this, data[node.elemNum].y + data[node.elemNum].height, lyteQuerySelector.MaxBottom, yElements)    
                    elementsToCheck = this.multipleRemoval.call(this, this.similarData.call(this, elementsToCheck, elementsToCheck1))
                    if(elementsToCheck.indexOf(node.elemNum) != -1) 
                        {
                            Lyte.arrayUtils(elementsToCheck, 'removeAt', elementsToCheck.indexOf(node.elemNum))
                        }
                    for(l = 0;l < elementsToCheck.length;l++ )
                        {
                            if(data[node.elemNum].y + data[node.elemNum].height <= data[elementsToCheck[l]].y + 1)
                                {
                                    if((((node.initialLeft[0] > node.offLeft) && data[elementsToCheck[l]].x == data[node.elemNum].x + data[node.elemNum].length)) || ((node.initialLeft[0] < node.offLeft) && data[node.elemNum].x == data[elementsToCheck[l]].x + data[elementsToCheck[l]].length) || (node.dataSet['lyte-grid-length-old'] - data[node.elemNum].length == 1))
                                        {
                                            var valMove = this.heightGet.call(this, data[elementsToCheck[l]].nodeName)
                                            if(!!valMove)
                                                {
                                                    flag1 = false
                                                    count = data[elementsToCheck[l]].y;
                                                    data[elementsToCheck[l]].y = data[elementsToCheck[l]].y - ( this.getData('ltPropFloat')? (data[elementsToCheck[l]].y - valMove < data[node.elemNum].y) ? data[elementsToCheck[l]].y - data[node.elemNum].y :valMove : valMove )
                                                    this.valueUpdating.call(this, elementsToCheck[l], 'y', 'lyte-grid-y')
                                                    this.positionFind.call(this, elements );
                                                    this.topMoveFunc.call(this, data[elementsToCheck[l]].nodeName, count, false, node);
                                                    this.displayGrid.call(this, node.elemNum);
                                                    break;
                                                }
                                        }
                                }
                        }
                    // this.contraFlexure.call(this, node)
                    // this.contraFlexure.call(this, node, 'x')
                    if((data[node.elemNum].y < (parseInt(node.getAttribute('lyte-grid-y'))) || (node.initialTop[0] - node.offTop > parseInt(marginTop))) && !this.getData('ltPropFloat'))
                        {
                            this.topMoveFunc.call(this, node, parseInt(node.getAttribute('lyte-grid-y')), false, node);
                        }
                    if((data[node.elemNum].height > node.dataSet['lyte-grid-height-old'] && !node.flag))
                        {
                             lyteQuerySelector.verticalMove = false
                            node.setAttribute('lyte-grid-height', data[node.elemNum].height)
                            this.verticalCheck.call(this, data[node.elemNum], data[node.elemNum].y + data[node.elemNum].height, data[node.elemNum].y + data[node.elemNum].height, node, true)
                            this.displayGrid.call(this, node.elemNum);
                        }   
                    else if((data[node.elemNum].height < node.dataSet['lyte-grid-height-old'] && !node.flag))
                        {
                            lyteQuerySelector.verticalMove = false
                            node.setAttribute('lyte-grid-height', data[node.elemNum].height)
                            this.topMoveFunc.call(this, node, data[node.elemNum].y, true);
                            this.displayGrid.call(this, node.elemNum);
                        }       
                    event.preventDefault();
                    if(!this.getData('ltPropFloat'))   
                        {
                            this.topMoveAllGrid.call(this, node, data)
                        }
            }
        if(!this.getData('ltPropFloat'))   
            {
                valMove = this.heightGet.call(this, node)
            }
        else
            {
                valMove = 0
            }     
        if(this.getMethods('onDrag'))
            {
                this.executeMethod('onDrag', node, event, this.$node);
            }
    }
    var bestFit = this._bestfit;
    if(bestFit && node && this.getData('ltPropBestfit') && lyteQuerySelector.SelectedNodes.length == 1)
        {
                var offsetBestfit = this.getData('ltPropBestfitType');
                bestFit.style.left = (data[node.elemNum].x * unitX + ( ( data[node.elemNum].x + 1) * MarginLeft )) + 'px';
                bestFit.style.top = (( data[node.elemNum].y - valMove ) * unitY + ((data[node.elemNum].y + 1 - valMove) * marginTop)) + 'px';
                bestFit.style.width = (data[node.elemNum].length * unitX + (data[node.elemNum].length - 1) * MarginLeft + (offsetBestfit == "grid" ? MarginLeft : 0)) + 'px';
                bestFit.style.height = ((data[node.elemNum].height) * unitY + (data[node.elemNum].height-1) * marginTop + (offsetBestfit == "grid" ? marginTop : 0)) + 'px';
                bestFit.style.display = "block";
                if(offsetBestfit == 'grid'){
                     var color = this.getData('ltPropGridSpaceColor')
                     bestFit.style.backgroundImage = 'linear-gradient(to right,' + color +' ' + MarginLeft + 'px,transparent 0px),linear-gradient(to bottom,'+ color + ' ' + marginTop + 'px,transparent 0px)' 
                     bestFit.style.backgroundSize = ( MarginLeft + unitX ) + 'px ' + ( unitY + marginTop ) + 'px';
                     bestFit.style.transform = "translate(-" + MarginLeft + "px,-" + marginTop +"px)"
                 }
        
        }
    },

    topMoveAllGrid : function(node, data){
        // this.positionFind.call(this, elements)
        var yElements = this.getData('yElements');
        var max = node.constructor == Number ? node : data[ node.elemNum ].y + data[ node.elemNum .height * 2];
        var elementCount = this.similarData(this.elementSorting(this.yElementsFind( node.constructor == Number ? node : ( data[ node.elemNum ].y + data[ node.elemNum ].height ), Math.min(this.getData('lyteQuerySelector').MaxBottom, isNaN(max) ? this.getData('lyteQuerySelector').MaxBottom : max ), yElements)));
        for(var j = 0; j < elementCount.length; j++){
            if(elementCount[j] != node.elemNum){
                var htmve = this.heightGet.call(this, data[elementCount[j]].nodeName)
                if(htmve)
                    {
                        data[elementCount[j]].y = data[elementCount[j]].y - htmve/*( this.getData('ltPropFloat')? htmve >= data[node.elemNum].height ? data[elementCount[j]].y - data[node.elemNum].y :htmve : htmve )*/
                        this.valueUpdating.call(this, elementCount[j], 'y', 'lyte-grid-y')
                        this.topMoveFunc.call(this, data[elementCount[j]].nodeName, data[elementCount[j]].y);
                        this.displayGrid.call(this, elementCount[j], true);
                    }
            }

        }
    },
    // check for movement from bottom to top
    verticalMoveBottomToTop : function(element, node){
            $L.fastdom.measure(function(){
                var topElements = [], i, temp1 = 0, ht = 0, flag = true, elementsToCheck = [], elementsToCheck1 = [];
                var ltPropFloat = this.getData('ltPropFloat'), ltPropMarginTop = this.getData('ltPropMarginTop'),data = this.getData('lyteGridStack');   
                elementsToCheck = this.elementCheck.call(this, element, node)
                temp1 = data[node.elemNum].y                           
                elementsToCheck1 = this.getData('yElements')[temp1];
                // offsets are continuously changing during mousemove and grid interchanges. so it is nescessary to calculate offsets 
                var nodeOff = node.offTop;
                if(elementsToCheck1)
                    {
                        elementsToCheck = this.similarData.call(this, elementsToCheck, elementsToCheck1)
                    }
                if(elementsToCheck.indexOf(node.elemNum) != -1) 
                    {
                        Lyte.arrayUtils(elementsToCheck, 'removeAt', elementsToCheck.indexOf(node.elemNum))
                    }
                for(i = 0;i < elementsToCheck.length;i++ )
                    {
                        // height and other grids offset are required here
                        var topPos = data[elementsToCheck[i]].nodeName.offsetTop;
                        if((nodeOff < (topPos + data[elementsToCheck[i]].nodeName.offsetHeight - 0.5 * ltPropMarginTop)) && (nodeOff > (topPos + ltPropMarginTop)) &&(data[node.elemNum].y == data[elementsToCheck[i]].y + data[elementsToCheck[i]].height) && (node.initialTop[0] > nodeOff))
                            {
                                topElements[topElements.length] = elementsToCheck[i];
                            }
                    }
                if(topElements.length)
                    {
                        topElements = this.elementSorting.call(this, topElements || [ ])
                        this._occupied = topElements.slice();
                        for(var i = 0; i < topElements.length; i++)
                          { 
                            ht = this.heightGet.call(this, node, data[topElements[i]].nodeName)
                            if(ltPropFloat)
                                {
                                    ht = data[topElements[i]].height > ht ? ht : data[topElements[i]].height
                                }   
                            var iniHgt = data[topElements[i]].y + data[topElements[i]].height
                            if( [ 'top' , 'topLeft', 'topRight' ].indexOf(node.value) == -1 ) {
                                data[node.elemNum].y = iniHgt - ht;
                                this.valueUpdating.call(this, node.elemNum, 'y', 'lyte-grid-y')
                            }
                            var temp =(data[node.elemNum].y + data[node.elemNum].height) < (data[topElements[i]].y-this.heightGet.call(this, data[topElements[i]].nodeName))?(data[topElements[i]].y-this.heightGet.call(this, data[topElements[i]].nodeName)):(data[node.elemNum].y + data[node.elemNum].height);
                            this.verticalCheck.call(this, data[topElements[i]],iniHgt, temp + data[topElements[i]].height, node, true)
                            data[topElements[i]].y = temp
                            this.valueUpdating.call(this, topElements[i], 'y', 'lyte-grid-y')
                            if(!ltPropFloat || (i == topElements.length -1 && i != 0))
                                {
                                    this.topMoveFunc.call(this, node, data[node.elemNum].y + ht, false)
                                }
                            if(!ltPropFloat)
                                {
                                    this.topMoveFunc.call(this, data[topElements[i]].nodeName, data[topElements[i]].y, true)
                                }
                        }
                        delete this._occupied;
                        this.displayGrid.call(this)
                    }  
                 }.bind( this ) )        
    }, 
    // check for movement top to bottom
    verticalMoveTopToBottom : function(element, node){
            $L.fastdom.measure(function(){
                var topElements = [], bottomElements = [], i, j, temp1 = 0, flag = true, elementsToCheck = [], elementsToCheck1 = [], upHeight = 0;
                var data = this.getData('lyteGridStack');
                var ltPropUnitY = this.getData('ltPropUnitY');
                elementsToCheck = this.elementCheck.call(this, element, node)
                temp1 = data[node.elemNum].y                           
                elementsToCheck1 = this.getData('yElements')[temp1 + data[node.elemNum].height];
                if(elementsToCheck1)
                    {
                        elementsToCheck = this.similarData.call(this, elementsToCheck, elementsToCheck1)
                    }
                if(elementsToCheck.indexOf(node.elemNum) != -1)
                    {
                        Lyte.arrayUtils(elementsToCheck, 'removeAt', elementsToCheck.indexOf(node.elemNum))
                    }   
                for(i = 0;i < elementsToCheck.length;i++ )
                    {
                        // height and other grids offset are required here
                        var topPos = data[elementsToCheck[i]].nodeName.offsetTop, height = data[elementsToCheck[i]].nodeName.offsetHeight, left = data[elementsToCheck[i]].nodeName.offsetLeft, width = data[elementsToCheck[i]].nodeName.offsetWidth, nodeHgt = node.offsetHeight;
                        if((node.offTop  > (topPos + ( !this.getData( 'ltPropHitBottom' ) ? ( parseInt(this.getData('ltPropMarginTop') ) - nodeHgt ) : ( height - parseInt(this.getData('ltPropMarginTop') ) ))))  && (node.initialTop[0] <= node.offTop) && ((left + width > node.initialLeft[0]) && (node.initialLeft[0] + node.clientWidth > left) && (node.initialTop[0] + nodeHgt < topPos ||node.initialTop[0] > topPos + height))) 
                            {
                                topElements[topElements.length] = elementsToCheck[i];
                            }
                    }
                if(topElements.length)
                    { 
                        var arr = [], max;
                        for(i = 0;i < topElements.length;i++ )
                            {
                                arr.push(data[topElements[i]].height + data[topElements[i]].y);
                            }
                        ht = arr.reduce(function(a, b){return Math.max(a, b);});        
                        for(var j = 0;j < topElements.length;j++ )
                            {
                                if(!this.getData('ltPropFloat'))
                                    {
                                        upHeight = this.heightGet.call(this, data[topElements[j]].nodeName, node); 
                                        if(upHeight)
                                            {
                                                data[topElements[j]].y -= upHeight;
                                                this.valueUpdating.call(this, topElements[j], 'y', 'lyte-grid-y')
                                                if(j == 0)
                                                    {
                                                        ht = data[topElements[j]].height + data[topElements[j]].y
                                                    }
                                                else
                                                    {
                                                        ht = (data[topElements[j]].height + data[topElements[j]].y) > (data[topElements[j-1]].height + data[topElements[j-1]].y)?(data[topElements[j]].height + data[topElements[j]].y):(data[topElements[j-1]].height + data[topElements[j-1]].y);
                                                    }
                                            }
                                        data[node.elemNum].y = ht
                                        if(i == topElements.length -1 || i != 0)
                                            {
                                                this.topMoveFunc.call(this,data[topElements[j]].nodeName)
                                            }   
                                    }
                                else
                                    {
                                        data[node.elemNum].y = parseInt(((node.offsetTop - ltPropUnitY) / (ltPropUnitY + parseInt(this.getData('ltPropMarginTop')))).toFixed(0))
                                        this.verticalCheck.call(this, data[node.elemNum], parseInt(node.getAttribute('lyte-grid-y')) + data[node.elemNum].height, data[node.elemNum].y + data[node.elemNum].height, node, true)
                                    }
                                }
                        this.valueUpdating.call(this, node.elemNum, 'y', 'lyte-grid-y')
                        this.verticalCheck.call(this, data[node.elemNum], parseInt(node.getAttribute('lyte-grid-y')) + data[node.elemNum].height, data[node.elemNum].y + data[node.elemNum].height, data[node.elemNum].nodeName, true)      
                        this.displayGrid.call(this)
                    }  
                }.bind( this ) )                   
    }, 
    // to check any free space available above the particular grid
    heightGet : function(node, oldNode,flag){
        if(node.elemNum >= 0)
            {
                var topElements = [], i, j, temp = 0, elementsToCheck = [], elementsToCheck1 = [], data = this.getData('lyteGridStack');
                if(!oldNode)
                    {
                        oldNode = node
                    }
                var xElements = this.getData('xElements');
                var yElements = this.getData('yElements');
                if(data[node.elemNum].length > 1)
                    {
                        elementsToCheck = this.yElementsFind(data[node.elemNum].x + 1, data[node.elemNum].length + data[node.elemNum].x - 1, xElements)
                    }   
                else
                    {
                        elementsToCheck = this.similarData.call(this, xElements[data[node.elemNum].x], xElements[data[node.elemNum].x])
                    }   
                for(var k = data[node.elemNum].y + data[node.elemNum].height-1;k >= 0;k--)
                    {
                        elementsToCheck1 = this.yElementsFind(0, data[node.elemNum].y + data[node.elemNum].height-1, yElements)
                    }   
                elementsToCheck = this.multipleRemoval(this.elementSorting.call(this, this.similarData.call(this, elementsToCheck, elementsToCheck1)))
                if(elementsToCheck.indexOf(node.elemNum) != -1) 
                    {
                        Lyte.arrayUtils(elementsToCheck, 'removeAt', elementsToCheck.indexOf(node.elemNum))
                    }
                for(i = 0;i < elementsToCheck.length;i++ )
                    {
                        if(elementsToCheck[i] != oldNode.elemNum || flag)
                            {
                                if(data[node.elemNum].y >= data[elementsToCheck[i]].y)
                                    {
                                        if(((data[elementsToCheck[i]].x > data[node.elemNum].x) && (data[elementsToCheck[i]].x < (data[node.elemNum].x + data[node.elemNum].length))) || (((data[elementsToCheck[i]].x + data[elementsToCheck[i]].length) > (data[node.elemNum].x)) && (((data[elementsToCheck[i]].x + data[elementsToCheck[i]].length) < (data[node.elemNum].x + data[node.elemNum].length)))) || ((data[elementsToCheck[i]].x > data[node.elemNum].x) && ((data[elementsToCheck[i]].x + data[elementsToCheck[i]].length) < (data[node.elemNum].x + data[node.elemNum].length))) || ((data[elementsToCheck[i]].x < data[node.elemNum].x) && ((data[elementsToCheck[i]].x + data[elementsToCheck[i]].length) > (data[node.elemNum].x + data[node.elemNum].length))) || ((data[elementsToCheck[i]].x == data[node.elemNum].x) || (data[elementsToCheck[i]].x + data[elementsToCheck[i]].length == data[node.elemNum].length + data[node.elemNum].x)))
                                                {
                                                    topElements[topElements.length] = elementsToCheck[i];
                                                }
                                    }
                            }
                    }
                for(j = 0;j < topElements.length;j++ )
                    {
                        if(j == 0)
                            {
                                temp += -data[topElements[0]].y-data[topElements[0]].height + data[node.elemNum].y;
                            }
                        else if((-data[topElements[j]].y-data[topElements[j]].height + data[node.elemNum].y) < temp)
                            {
                                temp = -(data[topElements[j]].y + data[topElements[j]].height-data[node.elemNum].y);
                            }
                    }
                if(topElements.length == 0)
                    {
                        temp = data[node.elemNum].y;
                    }
                if(temp < 0)
                    {
                        temp = 0;
                    }   
                return temp;    
            }       

    },
    // vertical movement towards top 
    topMoveFunc : function(node, count, flagie, currentNode, finalfg){
            var i, elementsToCheck = [],lyteQuerySelector = this.getData('lyteQuerySelector'), occupied = lyteQuerySelector.occupied, element = lyteQuerySelector.element, data = this.getData('lyteGridStack');
            occupied.push(node.elemNum)
            currentNode = currentNode ? currentNode : node;
            elementsToCheck = this.elementSorting.call(this, this.elementCheck.call(this, element, node, finalfg))
            if(elementsToCheck.indexOf(node.elemNum) != -1) 
                {
                    Lyte.arrayUtils(elementsToCheck, 'removeAt', elementsToCheck.indexOf(node.elemNum))
                }
            occupied =occupied.concat(elementsToCheck)  
            for(i = 0; i < elementsToCheck.length; i++ )
                {
                    if(!data[elementsToCheck[i]].nodeName.classList.contains('gridSelected'))
                         {
                            if((data[node.elemNum].x >= data[elementsToCheck[i]].x && data[node.elemNum].x + data[node.elemNum].length <= data[elementsToCheck[i]].x) || (data[node.elemNum].x + data[node.elemNum].length >= data[elementsToCheck[i]].x && (data[node.elemNum].x + data[node.elemNum].length <= data[elementsToCheck[i]].x + data[elementsToCheck[i]].length)) || (data[node.elemNum].x > data[elementsToCheck[i]].x) || ((data[node.elemNum].x + data[node.elemNum].length) > (data[elementsToCheck[i]].x + data[elementsToCheck[i]].length)))
                                {
                                    if(data[node.elemNum].y + data[node.elemNum].height <= data[elementsToCheck[i]].y + data[elementsToCheck[i]].height ||flagie)
                                        {
                                            valMove = this.heightGet.call(this, data[elementsToCheck[i]].nodeName,null,!flagie)
                                            data[elementsToCheck[i]].y = data[elementsToCheck[i]].y-valMove;
                                            this.valueUpdating.call(this, elementsToCheck[i], 'y', 'lyte-grid-y')
                                            this.positionFind.call(this);
                                            if(valMove)
                                                {
                                                    this.topMoveFunc.call(this, data[elementsToCheck[i]].nodeName, data[elementsToCheck[i]].y + valMove, flagie, currentNode);
                                                    if(!flagie)
                                                        {
                                                            this.displayGrid.call(this, currentNode.elemNum)
                                                        }
                                                }
                                        }
                                }
                        }
                }
    }, 
    // to sort selected elements according to directions
    elementSorting : function(stackElements, flag){
            if(flag)
                {
                    y = 'x';
                }
            else
                {
                    y = 'y';
                }   
            var data = this.getData('lyteGridStack')
            for(var j = 0;j < stackElements.length;j++ )
                    {
                        for(var k = j + 1;k < stackElements.length;k++ )
                            {
                                if(data[stackElements[j]][y] > data[stackElements[k]][y])
                                    {
                                        var temp = stackElements[j];
                                        stackElements[j] = stackElements[k];
                                        stackElements[k] = temp;
                                    }
                            }
                    }
             return stackElements    
    }, 
    // horizontal movement check
    topCheck : function(node, element,timeoutFlag, fourth, allowHorizontal, width){
                var i, flag = false, stackElements = [], temp1, elementsToCheck = [], elementsToCheck1 = [], hgt, ht=0;
                    var data = this.getData('lyteGridStack'), currentTop;
                    var xElements = this.getData('xElements');
                    var yElements = this.getData('yElements');
                    temp1 = data[node.elemNum].y
                    if(data[node.elemNum].length > 1)   
                        {
                            elementsToCheck = this.elementSorting(this.multipleRemoval(this.yElementsFind.call(this, data[node.elemNum].x + 1, data[node.elemNum].x + data[node.elemNum].length-1, xElements)));
                        }
                    else
                        {
                            elementsToCheck = this.similarData.call(this, xElements[data[node.elemNum].x], xElements[data[node.elemNum].x + 1])
                        }
                    if(data[node.elemNum].height > 1)   
                        {
                            elementsToCheck1 = this.yElementsFind(temp1 + 1, data[node.elemNum].y + data[node.elemNum].height - 1, yElements)
                        }
                    else
                        {
                            elementsToCheck1 = this.similarData.call(this, yElements[data[node.elemNum].y], yElements[data[node.elemNum].y + 1])
                        }
                    if(elementsToCheck1)        
                        {
                            elementsToCheck = this.similarData.call(this, elementsToCheck, this.multipleRemoval.call(this, elementsToCheck1))
                        }
                    elementsToCheck = this.elementSorting.call(this, this.multipleRemoval.call(this, elementsToCheck))  
                    if(elementsToCheck.indexOf(node.elemNum) != -1) 
                        {
                            Lyte.arrayUtils(elementsToCheck, 'removeAt', elementsToCheck.indexOf(node.elemNum))
                        }
                    for(i = elementsToCheck.length - 1; i > -1; i-- )
                        {
                            if(timeoutFlag)
                                {
                                    if(data[node.elemNum].x != node.getAttribute('lyte-grid-x') || data[node.elemNum].length != node.getAttribute('lyte-grid-length'))
                                        {   
                                            flag=true
                                        }
                                }
                            else
                                {
                                    if(((data[node.elemNum].x + data[node.elemNum].length > data[elementsToCheck[i]].x && data[node.elemNum].x < data[elementsToCheck[i]].x) || (data[node.elemNum].x < data[elementsToCheck[i]].x + data[elementsToCheck[i]].length && data[elementsToCheck[i]].x + data[elementsToCheck[i]].length <= data[node.elemNum].x + data[node.elemNum].length)) && (temp1 + data[node.elemNum].height > data[elementsToCheck[i]].y && temp1 < data[elementsToCheck[i]].y) || (temp1 < data[elementsToCheck[i]].y + data[elementsToCheck[i]].height && data[elementsToCheck[i]].y + data[elementsToCheck[i]].height < temp1 + data[node.elemNum].height) || (temp1 >= data[elementsToCheck[i]].y && data[elementsToCheck[i]].y + data[elementsToCheck[i]].height >= temp1 + data[node.elemNum].height) || (data[elementsToCheck[i]].y + data[elementsToCheck[i]].height < temp1 + data[node.elemNum].height && temp1 < data[elementsToCheck[i]].y ))
                                        {
                                            flag=true
                                        }
                                }   
                            if(flag && !data[elementsToCheck[i]].nodeName.classList.contains('gridSelected'))    
                                {
                                    if(((data[node.elemNum].x <= (data[elementsToCheck[i]].x + data[elementsToCheck[i]].length-1))) || ((data[elementsToCheck[i]].x + 1 >= (data[node.elemNum].x + data[node.elemNum].length))))   
                                            {
                                                stackElements[stackElements.length] = elementsToCheck[i]
                                                ht += data[elementsToCheck[i]].height
                                                if(this.getData('ltPropDirection') != 'horizontal' && !fourth)
                                                    {
                                                        break;
                                                    }
                                            }   
                                }
                            flag=false  
                        }
                    if(stackElements.length)
                        {
                            if(!timeoutFlag)
                                {
                                    this.valueUpdating.call(this, node.elemNum, 'x', 'lyte-grid-x')  
                                } 
                            stackElements = this.elementSorting.call(this, stackElements, true)
                            for(var z = 0 ; z < stackElements.length ; z++)
                                {
                                    var valMove = this.heightGet.call(this, data[stackElements[z]].nodeName), totalHeight = data[node.elemNum].height + data[node.elemNum].y -valMove, ret = true;
                                    hgt = totalHeight;
                                    if(this.getData('ltPropDirection') != 'horizontal' && !allowHorizontal) 
                                        {
                                            this.verticalCheck.call(this, data[stackElements[z]], data[stackElements[z]].y + data[stackElements[z]].height, totalHeight + valMove + data[stackElements[z]].height, node, data[node.elemNum].height < data[stackElements[z]].height);  
                                            data[stackElements[z]].y = (hgt > (data[node.elemNum].height + data[node.elemNum].y)?hgt:(data[node.elemNum].height + data[node.elemNum].y)) - (this.getData('ltPropFloat')? 0 : this.heightGet.call(this,data[node.elemNum].nodeName));
                                            this.valueUpdating.call(this, stackElements[z], 'y', 'lyte-grid-y')
                                        }
                                    else
                                        {
                                            if(z > 0 &&  ((parseInt(data[stackElements[z]].nodeName.getAttribute('lyte-grid-x')) + parseInt(data[stackElements[z]].nodeName.getAttribute('lyte-grid-length'))) == (this.getData('gridLength')) || parseInt(data[stackElements[z]].nodeName.getAttribute('lyte-grid-x')) == 0))
                                                {
                                                    break;
                                                }
                                            if((node.offsetLeft > data[stackElements[z]].nodeName.offsetLeft) && !allowHorizontal)
                                                {
                                                    this.horiMovement.call(this, node, stackElements[z], 'left', ht, stackElements.length == 1 || (stackElements.length > 2 && z != 1), width)                                                   
                                                }
                                            else if((node.offsetLeft < data[stackElements[z]].nodeName.offsetLeft) || allowHorizontal) 
                                                {
                                                    this.horiMovement.call(this, node, stackElements[z], 'right', ht, stackElements.length == 1 || (stackElements.length > 2 && z != 1), width)                                                  
                                                }   
                                        }
                                    if(!this.getData('ltPropFloat'))    
                                        {
                                            this.topMoveFunc.call(this, data[stackElements[z]].nodeName, z == 0 || (data[stackElements[z]].x != 0 && data[stackElements[z]].x + data[stackElements[z]].length != parseInt(this.getData('gridLength')))) 
                                        }
                                    this.displayGrid.call(this, node.elemNum);
                                }
                    }
},
// if given direction is horizontal
    horiMovement : function(node, stackElements, direction, ht, flag, wid){
            var data = this.getData('lyteGridStack'), lyteQuerySelector = this.getData('lyteQuerySelector');
            data[stackElements].x = direction == "left"?(data[stackElements].x - ( wid ? wid : 1 )):(data[stackElements].x + ( wid ? wid : 1 ));
            if(data[stackElements].x < 0 || (data[stackElements].x + data[stackElements].length) > parseInt(this.getData('gridLength')))
                {
                    if(data[stackElements].x < 0)
                        {
                            data[stackElements].x = 0;
                        }
                    else
                        {
                            data[stackElements].x = parseInt(this.getData('gridLength')) - data[stackElements].length;
                        }
                    this.valueUpdating.call(this, stackElements, 'x', 'lyte-grid-x')
                    var dumHgt = data[stackElements].y + data[stackElements].height
                    data[stackElements].y = data[node.elemNum].y + data[node.elemNum].height;   
                    var handQuer = this.getData('ltPropHandler');
                    this.positionFind.call(this, (/^#/g.test(handQuer) && !/\s/g.test(handQuer)) ? this.scopeElement.querySelectorAll(handQuer) : $L(handQuer, this.scopeElement).e);
                    this.verticalCheck.call(this, data[stackElements], dumHgt, data[node.elemNum].y + data[node.elemNum].height + data[stackElements].height /*ht*/, node);
                    this.valueUpdating.call(this, stackElements, 'y', 'lyte-grid-y')
                    this.displayGrid.call(this);    
                }
            else
                {
                    this.valueUpdating.call(this, stackElements, 'x', 'lyte-grid-x')
                    data[stackElements].nodeName.initialLeft = []
                    data[stackElements].nodeName.initialTop = []
                    for(var k = 0; k < 3; k++)
                        {
                            data[stackElements].nodeName.initialLeft[k] = data[stackElements].nodeName.offsetLeft;
                            data[stackElements].nodeName.initialTop[k] = data[stackElements].nodeName.offsetTop;
                        }
                    this.topCheck.call(this, data[stackElements].nodeName, lyteQuerySelector.element, true, null, wid ? true : false, wid)
                    if(flag)
                        {
                            var valMove = this.heightGet.call(this, data[stackElements].nodeName)
                            if(! this.getData('ltPropFloat'))
                                {
                                    data[stackElements].y -= valMove
                                    if(valMove)
                                        {
                                            this.topMoveFunc.call(this, data[stackElements].nodeName)
                                        }   
                                }
                        }
                    this.displayGrid.call(this)
                }
    },
    // vertical movement top to bottom  
    verticalCheck : function(node, currentHeight, totalHeight, currentNode, flagie, direction){
            var topElements = [], elementsToCheck = [], elementsToCheckDum = [], i, count, ht, flag = false, flag2 = false, elementsToCheck1 = [], maxElem = [], temp = [], data = this.getData('lyteGridStack'), fixFlag;
            currentNode = currentNode ? currentNode : node.nodeName;
            var xElements = this.getData('xElements'), yElements = this.getData('yElements'), element = this.scopeElement;
            if(direction == 'left')
                {   
                    elementsToCheck = elementsToCheck.concat(xElements[node.x] || [])
                }
            else if(direction == "right")
                {
                    elementsToCheck = elementsToCheck.concat(xElements[node.x + node.length] || [])
                }   
            else
                {   
                    if(node != data[currentNode.elemNum])
                        {
                            if(node.length > 1)
                                {
                                    elementsToCheck = this.yElementsFind(node.x + 1, node.x + node.length - 1, xElements)
                                }
                            else
                                {
                                    elementsToCheck = this.similarData.call(this, xElements[node.x] || [], xElements[node.x + 1] || [])
                                }   
                        }
                    else
                        {
                            elementsToCheck = this.elementCheck.call(this, element, node.nodeName)
                        }
                }
            elementsToCheck = this.multipleRemoval.call(this, elementsToCheck); 
            // elementsToCheckDum = elementsToCheckDum.concat(elementsToCheck); 
             for(var z = totalHeight - node.height; z <= totalHeight; z++)
                {
                    elementsToCheck1 = elementsToCheck1.concat(yElements[z] || [])
                }
            if(elementsToCheck1)
                {
                    elementsToCheck = this.similarData.call(this, elementsToCheck, this.multipleRemoval.call(this, elementsToCheck1))    
                }
            elementsToCheck = this.elementSorting.call(this, elementsToCheck);  
            if(elementsToCheck.indexOf(node.nodeName.elemNum) != -1)
                {
                    Lyte.arrayUtils(elementsToCheck, 'removeAt', elementsToCheck.indexOf(node.nodeName.elemNum))
                }
            if(elementsToCheck.indexOf(currentNode.elemNum) != -1)  
                {
                    Lyte.arrayUtils(elementsToCheck, 'removeAt', elementsToCheck.indexOf(currentNode.elemNum))
                } 
            if(direction)
                {
                    if(!this.similarData.call(this, elementsToCheck, yElements[node.y + node.height].concat(yElements[node.y])).length)
                        {
                            elementsToCheck = []
                        }
                }       
            for(i = 0;i < elementsToCheck.length;i++ )
                {
                    if(elementsToCheck[i] != node.nodeName.elemNum && elementsToCheck[i] != currentNode.elemNum)
                        {
                            if(flagie)
                                {
                                    if((node.y) == data[elementsToCheck[i]].y)
                                        {
                                            flag2 = true;
                                        }
                                }
                            if((node.y) < (data[elementsToCheck[i]].y + data[elementsToCheck[i]].height) || flag2)
                                {   
                                    topElements[topElements.length] = elementsToCheck[i];
                                    flag = true
                                }
                            else if(flagie && ((data[elementsToCheck[i]].y + data[elementsToCheck[i]].height) >= (node.y + node.height)))
                                {
                                    topElements[topElements.length] = elementsToCheck[i];
                                    flag = true
                                }       
                        }
                    if(flag)
                        {
                            flag = false
                            maxElem.push(data[topElements[topElements.length-1]].height + data[topElements[topElements.length-1]].y)
                            if(topElements.length > 1)
                                {
                                    temp.push(data[topElements[topElements.length - 1]].y-(data[topElements[0]].y + data[topElements[0]].height))     
                                }
                        }   
                }
             if(topElements.length)
                {   
                    topElements = this.elementSorting.call(this, topElements)
                    ht = totalHeight;
                    var elem = [], elem1 = [];
                    totalHeight = Math.max.apply(null,maxElem) - data[topElements[0]].y + ht   
                        for(var j = 0;j < topElements.length;j++ )
                            {
                                var htmove = this.heightGet.call(this, data[topElements[j]].nodeName)
                                if(j == 0)
                                    {
                                        if((ht <= data[topElements[j]].y) && flagie)
                                            {
                                                break
                                            }
                                        else    
                                            {
                                                if(data[topElements[j]].y-ht < 1)
                                                    {
                                                        data[topElements[j]].y = ht
                                                        htmove = this.heightGet.call(this, data[topElements[j]].nodeName)
                                                        if((data[topElements[j]].y-htmove >= ht))
                                                            {
                                                                data[topElements[j]].y -= htmove
                                                            }
                                                    }   
                                            }
                                    }
                                else
                                    {
                                        data[topElements[j]].y = data[topElements[0]].y + data[topElements[0]].height + temp[j-1];
                                        htmove = this.heightGet.call(this, data[topElements[j]].nodeName)
                                        if((data[topElements[j]].y - htmove >= ht))
                                            {
                                                data[topElements[j]].y -= htmove
                                            }
                                    }   
                                this.valueUpdating.call(this, topElements[j], 'y', 'lyte-grid-y')      
                            }
                        elem = this.yElementsFind.call(this,Math.min(node.x, data[currentNode.elemNum].x), Math.max((node.x + node.length), data[currentNode.elemNum].x + data[currentNode.elemNum].length), xElements)
                        elem = this.elementSorting.call(this,this.multipleRemoval.call(this, this.similarData.call(this, elem, topElements)))
                        for(var i = elem.length - 1;i >= 0 ;i-- )
                            {
                                var elem1 = [], elem2 = [], elem3 = [];
                                for(var j = data[elem[i]].x + 1;j < (data[elem[i]].x + data[elem[i]].length);j++ )
                                    {
                                        elem1 = elem1.concat(xElements[j])
                                    }
                                 if(data[elem[i]].length == 1)
                                    {
                                         elem1 = this.similarData.call(this, xElements[data[elem[i]].x], xElements[data[elem[i]].x + 1])
                                    }
                                if(flagie)   
                                    {
                                        elem2 = this.elementSorting.call(this,this.multipleRemoval.call(this,this.similarData.call(this, elem1, this.yElementsFind.call(this, parseInt(data[elem[i]].nodeName.getAttribute('lyte-grid-y')) + 1 ,parseInt(data[elem[i]].nodeName.getAttribute('lyte-grid-y')) + data[elem[i]].height, yElements))));
                                    }
                                else
                                    {
                                        elem2 = this.elementSorting.call(this, this.multipleRemoval.call(this,this.similarData.call(this, elem1, this.yElementsFind.call(this, parseInt(data[elem[i]].nodeName.getAttribute('lyte-grid-y')) + 1 ,parseInt(data[elem[i]].nodeName.getAttribute('lyte-grid-y')) + data[elem[i]].height, yElements)).concat(this.similarData.call(this, elem1, this.yElementsFind.call(this, parseInt(data[elem[i]].y) + 1 ,parseInt(data[elem[i]].y) + data[elem[i]].height, yElements)))))                                   
                                    }   
                                for(var k = 0;k < elem2.length;k++ )
                                    {
                                        if(topElements.indexOf(elem2[k]) == -1 && node.nodeName.elemNum != elem2[k] && currentNode.elemNum != elem2[k])
                                            {
                                                if( this._occupied && this._occupied.indexOf( elem2[ k ] ) != -1 ) {
                                                    continue;
                                                }
                                                this.additionalCheck.call(this, elem2[k], data[elem[i]].y + data[elem[i]].height, topElements);
                                            }
                                    }   
                            }
                    }               
},
// to find elements on given height 
yElementsFind : function(start, end, yElements){
    var elements = [];
    for(var i = start;i <= end;i++ )
        {
            elements = elements.concat(yElements[i] || [])
        }
    return elements;    
}, 
// to propagate vertical check 
additionalCheck : function(element, height, topElements1){
        var xElements = this.getData('xElements'), yElements = this.getData('yElements'), data = this.getData('lyteGridStack'), elem1 = [], elem2 = [], hgt = height, elementNo = element;
        elem1 = elem1.concat(this.yElementsFind.call(this, parseInt(data[element].nodeName.getAttribute('lyte-grid-y')) + data[element].height, data[element].y + data[element].height, yElements))
        if(data[element].length>1)
            {
                elem2 = elem2.concat(xElements[data[element].x + 1])
                elem2 = elem2.concat(xElements[data[element].x + data[element].length - 1])
            }
        else
            {
                elem2 =elem2.concat(this.similarData.call(this, xElements[data[element].x], xElements[data[element].x + 1]))
            }   
        elem1 = this.similarData.call(this, elem1, elem2);
        if(elem1.indexOf(element) != -1)
            {
                Lyte.arrayUtils(elem1, 'removeAt', elem1.indexOf(element))
            }   
        for(var i = 0;i < elem1.length;i++ )
            {
                if(topElements1.indexOf(elem1[i]) == -1)
                    {
                        topElements1.push(elem1[i])
                        this.additionalCheck.call(this, elem1[i], height + data[element].height, topElements1)
                    }
            }
        if(data[elementNo].y > hgt)
            {
                 var htmove = this.heightGet.call(this, data[elementNo].nodeName);
                 if(data[elementNo].y - htmove <= hgt)
                    {
                        data[elementNo].y = hgt
                    }
                else
                    {
                        data[elementNo].y -= htmove
                    }
                    
            }
          else  
            {
               data[elementNo].y = hgt
            }
        topElements1.push(elementNo); 
        this.valueUpdating.call(this, elementNo, 'y', 'lyte-grid-y'); 
}, 
// finding previous position for undo
previousPos : function(elementCount, flag){
    if(!elementCount || !elementCount.length){
        return;
    }
    var data = this.getData('lyteGridStack'), lyteQuerySelector = this.getData('lyteQuerySelector');
    for(var i = 0;i < elementCount.length;i++ )
        {
            if(lyteQuerySelector.currentPos < data[i].oldX.length)
                {
                    Lyte.arrayUtils(data[i].oldX, 'remove', lyteQuerySelector.currentPos + 1, data[i].oldX.length)
                    Lyte.arrayUtils(data[i].oldY, 'remove', lyteQuerySelector.currentPos + 1, data[i].oldY.length)
                    Lyte.arrayUtils(data[i].oldLength, 'remove', lyteQuerySelector.currentPos + 1, data[i].oldLength.length)
                    Lyte.arrayUtils(data[i].oldHeight, 'remove', lyteQuerySelector.currentPos + 1, data[i].oldHeight.length)
                }
            data[i].oldX[data[i].oldX.length] = flag ? data[i].x : data[i].nodeName.getAttribute('lyte-grid-x');
            data[i].oldY[data[i].oldY.length] = flag ? data[i].y : data[i].nodeName.getAttribute('lyte-grid-y');
            data[i].oldLength[data[i].oldLength.length] = flag ? data[i].length : data[i].nodeName.getAttribute('lyte-grid-length');
            data[i].oldHeight[data[i].oldHeight.length] = flag ? data[i].height : data[i].nodeName.getAttribute('lyte-grid-height');
        }
    lyteQuerySelector.currentPos = data[0].oldX.length-1;
},  

mousedown : function (evt){
        if(!this.getData('ltPropFreezeMode'))
            {
                var lyteQuerySelector = this.getData('lyteQuerySelector'), currentElement = this, data = this.getData('lyteGridStack') 
                var ret = this.nodeName.call(this, evt);   
                if(ret)
                    {
                        this.mvefunc = this.mMove.bind(this), this.upfunc = this.mouseup.bind(this),
                        evt.stopPropagation();
                        var val = ret[0];
                        var nodeName = ret[1]
                        var element = $L(this.getData('ltPropScope'), this.$node).e[0]
                        if(!evt.shiftKey)   
                            {
                                lyteQuerySelector.BottomToTopFlag = true, lyteQuerySelector.allowMovement = true, this.mvefunc = this.mMove.bind(this)  
                                if(($L(this.getData('ltPropHandler') + '.gridSelected', element).e.length == 0))
                                    {   
                                        var method;
                                        if(this.getMethods('onBeforeSelect'))
                                            {
                                                method = this.executeMethod('onBeforeSelect', ret[1], evt, this.$node);
                                            }
                                        if(nodeName && method != false)
                                            {
                                                lyteQuerySelector.SelectedNodes = [];
                                                $L.fastdom.mutate(function(){
                                                    nodeName.classList.add('gridSelected')
                                                })
                                                $L.fastdom.measure(function(){
                                                    lyteQuerySelector.SelectedNodes.push(nodeName.elemNum);
                                                    lyteQuerySelector.element = element
                                                    nodeName.initialLeft = [], nodeName.initialTop = []
                                                    for(var k = 0; k < 3; k++)
                                                        {
                                                            nodeName.initialLeft[k] = nodeName.offsetLeft;
                                                            nodeName.initialTop[k] = nodeName.offsetTop;
                                                        }
                                                    nodeName.initialy = data[nodeName.elemNum].y
                                                    nodeName.initialx = data[nodeName.elemNum].x
                                                    nodeName.xPos = evt.clientX - nodeName.offsetLeft;
                                                    nodeName.yPos = evt.clientY - nodeName.offsetTop;
                                                    nodeName.instantPreviousX = nodeName.initialLeft[0];
                                                    nodeName.instantPreviousY = nodeName.initialTop[0];
                                                    if(val == "content")
                                                        {
                                                            nodeName.flag = true;
                                                        }
                                                    else
                                                        {
                                                            nodeName.value = val;
                                                            var bccr = nodeName.getBoundingClientRect();
                                                            if( [ 'BottomRight', 'right', 'topRight' ].indexOf(val) != -1 )      
                                                                {
                                                                    nodeName.xOff = bccr.left + bccr.width - evt.clientX;
                                                                }
                                                            else
                                                                {
                                                                    nodeName.xOff = - bccr.left + evt.clientX;
                                                                }   
                                                            if( [ 'BottomRight', 'bottom', 'BottomLeft' ].indexOf(val) != -1 )      
                                                                {
                                                                    nodeName.yOff = bccr.top + bccr.height - evt.clientY;
                                                                }
                                                            else
                                                                {
                                                                    nodeName.yOff = - bccr.top + evt.clientY;
                                                                }       
                                                            nodeName.flag = false;
                                                        }
                                                })
                                                
                                                if(this.getData('ltPropBestfit'))     
                                                    {
                                                        if(!this._bestfit)
                                                            {
                                                                var ltPropBestfitClass = this.getData('ltPropBestfitClass');
                                                                var bestFit = document.createElement('div');
                                                                bestFit.classList.add('lyteBestFit');
                                                                if(this.getData('ltPropBestfitType') == 'grid'){
                                                                    bestFit.classList.add('lyteGrid')
                                                                }
                                                                if(ltPropBestfitClass){
                                                                    bestFit.classList.add(ltPropBestfitClass);
                                                                }
                                                                bestFit.style.display = "none"
                                                                this._bestfit = bestFit;
                                                                $L.fastdom.mutate(function(){
                                                                    element.appendChild(bestFit);
                                                                })
                                                            }
                                                             
                                                        
                                                    }
                                                document.body.addEventListener('mousemove', this.mvefunc, true);
                                                if(this.getMethods('onSelect')){
                                                    this.executeMethod('onSelect',nodeName, evt, this.$node)
                                                }

                                            }
                                    }
                                else
                                    {   
                                        lyteQuerySelector.SelectedNodes = [];
                                        var nodeName = $L(this.getData('ltPropHandler') + '.gridSelected', this.$node).e, evt = event
                                        $L.fastdom.measure(function(){
                                            for(var i = 0;i < nodeName.length; i++ )
                                                {
                                                    lyteQuerySelector.SelectedNodes.push(element.querySelectorAll(currentElement.getData('ltPropHandler') + '.gridSelected')[i].elemNum);
                                                    nodeName[i].left = nodeName[i].offsetLeft;
                                                    nodeName[i].top = nodeName[i].offsetTop;
                                                    nodeName[i].flag = true;
                                                    nodeName[i].initialLeft[0] = nodeName[i].offsetLeft;
                                                    nodeName[i].initialTop[0] = nodeName[i].offsetTop;
                                                    nodeName[i].xPos = evt.clientX-nodeName[i].offsetLeft;
                                                    nodeName[i].yPos = evt.clientY-nodeName[i].offsetTop;
                                                }
                                            lyteQuerySelector.SelectedNodes = this.elementSorting.call(this, lyteQuerySelector.SelectedNodes);
                                        }.bind(this))
                                        document.body.addEventListener('mousemove', this.mvefunc, true);
                                        if(this.getMethods('onSelect')){
                                            this.executeMethod('onSelect',nodeName, evt, this.$node)
                                        } 
                                    }
                            }
                        else if(!lyteQuerySelector.allowMovement)
                            {
                                var method;
                                if(this.getMethods('onBeforeSelect'))
                                    {
                                        method = this.executeMethod('onBeforeSelect', ret[1], evt, this.$node);
                                    }
                                if(method != false)
                                    {
                                        nodeName = ret[1]
                                        nodeName.initialLeft = [], nodeName.initialTop = []
                                        if(nodeName.classList.contains('gridSelected'))
                                            {
                                                nodeName.classList.remove('gridSelected')
                                            }
                                        else    
                                            {
                                                nodeName.classList.add('gridSelected')
                                            }
                                    }
                            }   
                        lyteQuerySelector.previousPosFind = false
                    } 
              evt.preventDefault()      
            }
},
mMove : function(evt){
    this.mousemoveFun.call(this, this.scopeElement, evt);
    evt.stopPropagation();
    evt.preventDefault();
} ,
mouseup : function (evt){   
    var lyteQuerySelector = this.getData('lyteQuerySelector'), data = this.getData('lyteGridStack')
    var ret = this.nodeName.call(this, evt);   
    var element = $L(this.getData('ltPropScope'), this.$node).e[0]
    var elementCount = this.elementSorting.call(this, lyteQuerySelector.elementCount)
    if(!evt.shiftKey || lyteQuerySelector.allowMovement)   
        {
            var method, nodes, bestfit = this._bestfit;
            lyteQuerySelector.verticalMove = true, lyteQuerySelector.allowMovement = false;
            if(lyteQuerySelector.SelectedNodes.length)
                {
                    nodes =  $L(this.getData('ltPropHandler') + '.gridSelected', this.$node).e;
                    if(this.getMethods('onBeforeDrop')){
                        method = this.executeMethod('onBeforeDrop', nodes, event, this.$node);
                    }
                    for(i = lyteQuerySelector.SelectedNodes.length-1;i >= 0;i--)    
                        {
                            var nodeName = data[lyteQuerySelector.SelectedNodes[i]].nodeName
                            if(nodeName.classList.contains('gridSelected'))
                                {
                                    if(!this.getData('ltPropFloat') && method != false)
                                        {
                                            var valMove = this.heightGet.call(this, nodeName)
                                            data[nodeName.elemNum].y -= (valMove);
                                            this.topCheck.call(this, nodeName, this.scopeElement);
                                            this.topMoveFunc.call(this, nodeName, data[nodeName.elemNum].y + valMove, false)
                                        }
                                    this.displayGrid.call(this);    
                                    nodeName.classList.remove('gridSelected');
                                    nodeName.classList.remove( 'lyteGridStackMove' );
                                    nodeName.style.removeProperty('left')
                                    nodeName.style.removeProperty('top')
                                    nodeName.style.removeProperty('height')
                                    nodeName.style.removeProperty('width')
                                    Lyte.arrayUtils(lyteQuerySelector.occupied, 'remove', 0, lyteQuerySelector.occupied.length)
                                    if(method != false)
                                        {
                                            this.topCheck.call(this,nodeName,element);
                                        }
                                      if(nodeName.flag == false && nodeName._childGrid){
                                            setTimeout(nodeName._childGrid.reRender, 150, true)
                                       } 
                                    delete nodeName.initialy; delete nodeName.xPos; delete nodeName.yPos; delete nodeName.flag; delete nodeName.offLeft; delete nodeName.offTop;
                                    delete nodeName.initialx; delete nodeName.instantPreviousX;delete nodeName.instantPreviousY;delete nodeName.val; delete nodeName.xOff; delete nodeName.yOff; delete  nodeName.initialLeft[0]; delete  nodeName.initialLeft[1];
                                    delete  nodeName.initialLeft[2]; delete  nodeName.initialTop[0]; delete  nodeName.initialTop[1]; delete  nodeName.initialTop[2]; delete nodeName.flag; delete nodeName.value; delete nodeName.prevEvX; delete nodeName.prevEvY;

                                }
                            if(bestfit)    
                                {
                                    bestfit.style.display = 'none' 
                                }
                             this.findGrid();   
                        }  
                    evt.stopPropagation();
                    evt.preventDefault();    
                }
            if(method != false)       
                {
                    this.displayGrid.call(this);
                    // $L.fastdom.mutate(function(){
                        if(lyteQuerySelector.SelectedNodes.length && lyteQuerySelector.previousPosFind) 
                            {
                                // this._preventClick = true
                                var handQuer = this.getData('ltPropHandler')
                                this.previousPos.call(this, (/^#/g.test(handQuer) && !/\s/g.test(handQuer)) ? element.querySelectorAll(handQuer) : $L(handQuer, element).e);
                            }
                        if(this.getMethods('onDrop')){
                            this.executeMethod('onDrop', nodes, event, this.$node);
                        } 
                    // }.bind(this))
                }
            else
                {    
                    lyteQuerySelector.currentPos += 1;
                    this.undoPrevious.call(this);
                }

            document.body.removeEventListener('mousemove', this.mvefunc, true)
            lyteQuerySelector.SelectedNodes = []    
       }
       document.removeEventListener('mouseup', this.upfunc, true)     
    },
    keydown : function (event){

        if(document._lyteCurrentGrid == this && this.getData('ltPropUndo') && !this.getData('ltPropFreezeMode'))
            {
                if((event.ctrlKey || event.metaKey) && event.shiftKey && event.keyCode == 90)
                    {
                        this.undoNext.call(this);
                    }
                else if((event.ctrlKey || event.metaKey) && !event.shiftKey && event.keyCode == 90)
                    {
                        this.undoPrevious.call(this);
                    }  
            }  
  },

  returnWid : function(length, x, div){
    if(!length){
        return
    }
    if(length.constructor != String){
        return length;
    }
    var match = length.match(/[\w|.]+(?=%)/gi)
    if(match && match.length){
        var unitX, margin, width;
        if(x){
            // if(div){
            //     div._percentLength = length; 
            // }
            width = "width";
            unitX = this.getData('ltPropUnitXCopy');
        }else{
            // if(div){
            //     div._percentHeight = length; 
            // }
            width = "height";
            unitX = this.getData('ltPropUnitY');
            margin = "ltPropMarginTop"
        }
        // grid length will be based on actual width
        return this.gridLength((this.bcrrelem ? this.bcrrelem[width] : this.scopeElement.getBoundingClientRect()[width]) * parseFloat(match[0]) / 100, unitX, margin)
    }else{
        // if(div){
        //     if(x && div._percentLength){
        //         return this.returnWid(div._percentLength, x, div);
        //     }else if(div._percentHeight){
        //         return this.returnWid(div._percentHeight, x, div);
        //     }
        // }
        return parseInt(length);
    }
  },

   initialPosFind : function(elementtt){
            var iniData1 = {}, repose = this.getData('ltPropForcedReposition')
            iniData1.x = (elementtt.getAttribute('lyte-grid-x') && !repose ) ? parseInt(elementtt.getAttribute('lyte-grid-x')) : undefined;
            iniData1.y = (elementtt.getAttribute('lyte-grid-y') && !repose ) ? parseInt(elementtt.getAttribute('lyte-grid-y')) : undefined;
            iniData1.length = elementtt.getAttribute('lyte-grid-length') ? this.returnWid(elementtt.getAttribute('lyte-grid-length'), true, elementtt) : this.returnWid(this.getData('ltPropDefaultLength'), true);
            iniData1.height = elementtt.getAttribute('lyte-grid-height') ? this.returnWid(elementtt.getAttribute('lyte-grid-height'), null, elementtt) : this.returnWid(this.getData('ltPropDefaultHeight'));
            return iniData1;
  },

  checkPreviousGrid : function(){
     var nodeName  = this.$node.parentElement;
     while(nodeName && nodeName.tagName != "BODY"){
        if(nodeName.tagName == "LYTE-GRIDSTACK"){
            this._parentGrid = nodeName;
            this._parentGridIndex = nodeName.component._childGrids.length;
            nodeName.component._childGrids.push(this.$node);
            break;
        }
        if(nodeName.tagName == "LYTE-GRID-CONTENT"){
            nodeName.parentElement._childGrid = this.$node
            this._parentComp = nodeName.parentElement;
        }
        nodeName = nodeName.parentElement;
     } 
     if(nodeName && nodeName.tagName == "LYTE-GRIDSTACK"){
        return true
     }
     return false;  
  },

  retNode : function(sim, data) {
    var arr = [];
    for( var i = 0; i < sim.length; i++ ) {
        arr.push( data[ sim[ i ] ].nodeName );
     }
    return arr; 
  },

  findGrid : function() {
     var bccr = this.$node.getBoundingClientRect(), sim, data = this.getData( 'lyteGridStack' ), arr;
     var x = this.$node.scrollLeft, y = this.$node.scrollTop, length = x + bccr.width, height = y + bccr.height;
     var vis = { left : this.returnY( { offLeft : x } ), top : this.returnY( { offTop : y } , true), right : this.returnY( { offLeft : length } ), bottom : this.returnY( { offTop : height }, true ) };
     this.setData('ltPropVisibleBoundary', vis)
     sim = this.similarData( this.multipleRemoval( this.yElementsFind( vis.top + 1, vis.bottom - 1, this.getData( 'yElements' ) ) ), this.multipleRemoval( this.yElementsFind( vis.left + 1, vis.right - 1, this.getData( 'xElements' ) ) ) );
     arr = this.retNode( sim, data );
     this.setData( 'ltPropVisible', arr );
  },

  scroll :  function( event ) {
    this.findGrid();
    if( this.getMethods( 'onScroll' ) ) {
        this.executeMethod( 'onScroll', this.getData( 'ltPropVisible' ), this.getData( 'ltPropVisibleBoundary' ), this.$node)
    }
  },

  click : function( event ) {
    var className =  this.getData( 'ltPropGridSelectionClass' );
    if( className ) {
        var nodeName = this.nodeName( event ), temp = $L( '.' + className , this.$node);
        if( temp.e.length ) {
            temp.removeClass( className );
        }
        // if( this._preventClick ) {
        //     delete this._preventClick;
        //     return;
        // }
        if( nodeName ) {
            nodeName.classList.add( className )
        }
    }
  },

// after rendering properties
    didConnect : function(){    
            var scopeDiv = this.getData('ltPropScope').trim(), ltPropUnitX = this.getData('ltPropUnitX'), ltPropMarginLeft = this.getData('ltPropMarginLeft');
            this.setData('ltPropUnitXCopy', ltPropUnitX);
            this.setData('ltPropMarginLeftCopy', ltPropMarginLeft);
            this._scroll = this.scroll.bind(this);
            this._click = this.click.bind(this);
            this.$node.addEventListener( 'scroll', this._scroll, true);
            document.addEventListener( 'click', this._click );
            var element = (/^#/g.test(scopeDiv) && !/\s/g.test(scopeDiv)) ? $L(scopeDiv).e : $L(scopeDiv).e[0];
            var lyteQuerySelector = this.getData('lyteQuerySelector');
            this.scopeElement = element;   
            $L(this.scopeElement).addClass('lyteGridstackScope');
            if(element.tabIndex == -1){
                 element.tabIndex = 0
            }     
            element.lyteData = {};
            element.component = this;
            element.addEventListener('mousedown',function(event){
                if(event.target != this && event.button != 2)
                    {
                        this.component.mousedown.call(this.component, event);
                        if(!event.shiftKey){
                            document.addEventListener('mouseup', this.component.upfunc, true)
                        }
                        event.stopPropagation();
                    }
                document._lyteCurrentGrid = this.component;                  
            })
            this.setData('lyteQuerySelector.keydown', this.keydown.bind(this));
            document.addEventListener('keydown',this.getData('lyteQuerySelector').keydown)
            this.$node.addGrid = function(div, obj) {
                $L.fastdom.mutate(function(){
                    div._addGrid  = true;
                    var ltPropColumnMode = this.getData('ltPropColumnMode');
                    obj = obj != undefined ? obj : {};
                    if(obj.length){
                        obj.length = this.returnWid(obj.length, true, div)
                    }
                    if(obj.height){
                        obj.height = this.returnWid(obj.height, null, div)
                    }
                    for(var i in obj){
                        if(obj[i])
                            {
                                if(i != 'resize')
                                    {
                                        obj[i] = parseInt(obj[i]);
                                    }
                            }
                    }
                    obj.nodeName = div;
                    div.classList.add('lyteGridstackHandler');
                    if(!ltPropColumnMode)
                        {
                            var newVal = this.emptySpaceFind.call(this, obj);
                            if(newVal[1])    
                                {
                                    div.setAttribute('lyte-grid-x', newVal[0].x);
                                    div.setAttribute('lyte-grid-y', newVal[0].y);
                                }
                            else
                                {
                                    div.setAttribute('lyte-grid-x', ( obj.x != undefined  && obj.x.constructor == Number) ? obj.x : newVal[0].x);
                                    div.setAttribute('lyte-grid-y', ( obj.y != undefined  && obj.y.constructor == Number) ? obj.y : newVal[0].y);
                                }    
                            div.setAttribute('lyte-grid-length', obj.length ? obj.length : this.returnWid(this.getData('ltPropDefaultLength'), true));
                            div.setAttribute('lyte-grid-height', obj.height ? obj.height : this.returnWid(this.getData('ltPropDefaultHeight')));
                            div.setAttribute('lyte-grid-min-length', obj.minLength ? obj.minLength : this.returnWid(this.getData('ltPropDefaultMinLength'), true));
                            div.setAttribute('lyte-grid-min-height', obj.minHeight ? obj.minHeight : this.returnWid(this.getData('ltPropDefaultMinHeight')));
                            div.setAttribute('lyte-grid-max-length', obj.maxLength ? obj.maxLength : this.returnWid(this.getData('ltPropDefaultMaxLength'), true));
                            div.setAttribute('lyte-grid-max-height', obj.maxHeight ? obj.maxHeight : this.returnWid(this.getData('ltPropDefaultMaxHeight')));
                        }
                    if(obj.resize == 'disabled')
                        {
                            div.setAttribute('lt-prop-resize', obj.resize)
                        }
                    // new grid is appended to the dom here  
                    if( !this.scopeElement.contains( div ) ) {  
                        this.scopeElement.appendChild(div);   
                    }
                    this.initialValSet.call(this, true);
                    this.cssConstruct.call(this, div, 'lyte-grid-y');
                    this.getData('iniData').push(this.initialPosFind.call(this, div));
                    var data = this.getData('lyteGridStack');
                    this.previousPos.call(this, data.length);
                    $L.fastdom.mutate(function(){
                        if(newVal && newVal[1] == false && !ltPropColumnMode)
                            {
                                this.topCheck.call(this, div, this.scopeElement);
                                if(!this.getData('ltPropFloat'))
                                    {
                                         var hgtMove = this.heightGet.call(this, div);
                                        if(hgtMove)
                                            {   
                                                data[div.elemNum].y -= hgtMove; 
                                                this.valueUpdating.call(this, div.elemNum, 'lyte-grid-y', data[div.elemNum].y);
                                                this.setVal.call(this, div, 'lyte-grid-y', data[div.elemNum].y);
                                                this.previousPos.call(this, data.length);
                                            }
                                        this.topMoveFunc.call(this, div, null, null, null, true);
                                    }
                                 this.findGrid();   
                            }
                        if(div._childGrid){
                           div._childGrid.reRender(null, true)
                       } 
                    }.bind(this))
                }.bind(this))                    
             }.bind(this); 
             this.$node.removeGrid = function(div){
                if(this.scopeElement.contains(div))
                    {
                        var handQuer = this.getData('ltPropHandler'), data = this.getData( 'lyteGridStack' ), hgt = data[ div.elemNum ].y + data[ div.elemNum ].height;
                        Lyte.arrayUtils(this.getData('iniData'), 'removeAt', div.elemNum);
                        // grid removed
                        div.parentElement.removeChild(div);
                        Lyte.arrayUtils( this.getData( 'lyteGridStack' ), 'remove', 0, data.length);
                        // called for removal of unused styles
                        this.initialValSet.call(this);
                        this.positionFind.call(this, (/^#/g.test(handQuer) && !/\s/g.test(handQuer)) ? this.scopeElement.querySelectorAll(handQuer) : $L(handQuer, this.scopeElement).e);
                        this.findGrid();
                        this.topMoveAllGrid( hgt , data)
                    }
             }.bind(this);
             this.$node.reRender = function(flag){
                // previous styles are removed and new will be constructed
                    if(this._style){
                        this.$node.removeChild(this._style);
                        delete this._style;
                    }
                    var data = this.getData('lyteGridStack');
                    Lyte.arrayUtils(data, 'remove', 0 , data.length);
                    this.didConnectWrk.call(this, true, flag);
             }.bind(this),
             this.$node.setProperty = function(targetDiv, propertyName, propValue){
                if(propertyName == "height" || propertyName == "length"){ 
                        propValue = this.returnWid(propValue, propertyName == "length" ? true : false, targetDiv)
                }else{
                    propValue = parseInt(propValue)
                }
                var data = this.getData('lyteGridStack');
                var comProp = ['x', 'y', 'length', 'height'];
                var dataVal = {};
                if(comProp.indexOf(propertyName) != -1){
                    for(var yy in data[targetDiv.elemNum]){
                        if(comProp.indexOf(yy) != -1)
                            {
                                dataVal[yy] = data[targetDiv.elemNum][yy];
                            }
                    }
                    
                    dataVal[propertyName] = propValue;
                    dataVal.nodeName = targetDiv;
                    var newVal = this.emptySpaceFind.call(this, dataVal);
                    if(newVal[1]){
                        for(var zz in newVal[0]){
                            this.setVal.call(this, targetDiv, 'lyte-grid-' + zz, newVal[0][zz]);
                        } 
                    }
                }
                this.setVal.call(this, targetDiv, 'lyte-grid-' + propertyName, propValue);
                var pp = propertyName.replace(/(-\w)/g, function (m) {
                        return m[1].toUpperCase();
                    });
                data[targetDiv.elemNum][pp] = propValue
                if(comProp.indexOf(propertyName) != -1)
                    {
                        this.valueUpdating.call(this, targetDiv.elemNum, 'lyte-grid-' + propertyName, propValue);
                        this.previousPos.call(this, data.length);
                        if(newVal[1] == false){
                            this.topCheck.call(this, targetDiv, this.scopeElement, null, true);
                        }
                        if(!this.getData('ltPropFloat')){
                            var hgtMove = this.heightGet.call(this, targetDiv);
                            if(hgtMove)
                                {   
                                    data[targetDiv.elemNum].y -= hgtMove; 
                                    this.valueUpdating.call(this, targetDiv.elemNum, 'lyte-grid-y', data[targetDiv.elemNum].y);
                                    this.setVal.call(this, targetDiv, 'lyte-grid-y', data[targetDiv.elemNum].y);
                                    this.previousPos.call(this, data.length);
                                }
                            this.topMoveFunc.call(this, targetDiv, null, null, null, true);
                        }
                        this.previousPos.call(this, $L(this.getData('ltPropHandler'), this.scopeElement).e);
                    }
                if(targetDiv._childGrid){
                        if((propertyName == "height" || propertyName == "length")){
                            targetDiv._childGrid.reRender(true)
                        }
                   }
                this.findGrid();       
             }.bind(this);
            this._resizeFunc = this.windowResize.bind(this);   
            this._initialWindowWidth = window.innerWidth
            window.addEventListener('resize', this._resizeFunc, true); 
            if(this.checkPreviousGrid()){
                return
            }
            this.didConnectWrk.call(this, true)
    },

    gridLength : function(width, ltPropUnitX1, ltPropMarginLeftCopy){
       ltPropMarginLeftCopy = ltPropMarginLeftCopy ? ltPropMarginLeftCopy : 'ltPropMarginLeftCopy';
       var margin = parseInt(this.getData(ltPropMarginLeftCopy));
       var ltPropUnitX = ltPropUnitX1 ? ltPropUnitX1 : this.getData('ltPropUnitX'), len = parseInt((((width ? width : (this.bcrrelem ? this.bcrrelem.width : this.scopeElement.getBoundingClientRect().width)) - (margin)) / (ltPropUnitX + margin)).toFixed(0));
       return len;
    },

    columnModeLengthFind : function(){
        this._prevObs = true;
        var length = this.getData('ltPropGridLength') || this.getData('ltPropColumn');
        var margin = this.getData('ltPropMarginLeftCopy');
        margin = margin ? margin : this.getData('ltPropMarginLeft');
        this.setData('ltPropUnitX', (( this.bcrrelem ? this.bcrrelem.width : this.scopeElement.getBoundingClientRect().width) - ( length + 1 ) * margin) / ( length ) )
        delete this._prevObs;
    },

    didConnectWrk : function(flag, flag2){
        $L.fastdom.measure(function(){
                if(!this.$node.offsetParent){
                    return
                }
                var bcrrelem = this.scopeElement.getBoundingClientRect(), element = this.scopeElement, lyteQuerySelector = this.getData('lyteQuerySelector');
                this.bcrrelem = bcrrelem;  
                var ltPropColumnMode = this.getData('ltPropColumnMode') 
                var handQuer = this.getData('ltPropHandler');
                var iniData = this.getData('iniData');
                var data = this.getData('lyteGridStack');
                Lyte.arrayUtils(iniData, 'remove', 0, iniData.length);
                var elements = (/^#/g.test(handQuer) && !/\s/g.test(handQuer)) ? element.querySelectorAll(handQuer) : $L(handQuer, element).e;
                if( this._parentGrid && !this.getData('ltPropGridLength')) {
                    var grL = this.gridLength();
                    this.setData( 'ltPropGridLength', grL);
                    this.setData('gridLength', grL);
                }
                if(ltPropColumnMode || this.getData('ltPropGridLength')){
                    this.columnModeLengthFind();
                }
                if(!this.getData('gridLength') || flag2 || ltPropColumnMode){
                    this.setData('gridLength', this.gridLength())
                }
                if(!this.$node.ltProp('gridHeight') && !flag2 || ltPropColumnMode){
                        this.$node.ltProp('gridHeight', this.getData('gridLength'));
                }else if(flag2){
                    this.$node.ltProp('gridHeight', this.getData('gridLength'));
                } 
             for(var i = 0; i < elements.length; i++)
                {
                    iniData.push(this.initialPosFind.call(this, elements[i]));
                }
                $L.fastdom.mutate(this.initialValSet.bind(this))    
                var elements = $L(this.getData('ltPropHandler'), element).e, ltPropUnitX = this.getData('ltPropUnitX');
                element.lyteData.gridLength = this.getData('gridLength')
                element.lyteData.gridHeight = lyteQuerySelector.maxHeight;
                
                this._initialXRatio = ltPropUnitX / bcrrelem.width;
                this._initialMarginRatio = this.getData('ltPropMarginLeft') / ltPropUnitX;
                $L.fastdom.mutate(function(){
                        if(this._childGrids.length){
                        for(var i = 0; i < this._childGrids.length; i++){
                               this._childGrids[i].reRender()
                            }
                        }
                        if(flag){
                            if(this.getMethods('afterRender')){
                                    this.executeMethod('afterRender', this.$node);
                                }
                        }
                    this.findGrid();
                }.bind(this))
            }.bind(this)) 
    },
    // data 
    data : function(){
        return {
            // user data
            ltPropScope : Lyte.attr("string",{"default": ''}), 
            ltPropHandler : Lyte.attr("string",{"default":''}), 
            ltPropMarginLeft : Lyte.attr("number",{"default":10}), 
            ltPropMarginTop : Lyte.attr("number",{"default":10}), 
            ltPropUnitX : Lyte.attr("number",{"default":50}), 
            ltPropUnitY : Lyte.attr("number",{"default":50}), 
            ltPropResizeDirection : Lyte.attr("array",{"default":['left', 'right', 'bottom', 'bottomRight', 'bottomLeft', 'top', 'topLeft', 'topRight']}), 
            ltPropFloat : Lyte.attr("boolean",{"default": false}), 
            ltPropDirection : Lyte.attr("string",{"default":"vertical"}), 
            ltPropUndo : Lyte.attr("boolean",{"default": true}), 
            ltPropResize : Lyte.attr("boolean",{"default": true}), 
            ltPropBestfit : Lyte.attr("boolean",{"default": true}), 
            ltPropMinUnitX : Lyte.attr('number',{default : 0}),
            ltPropMinMarginLeft : Lyte.attr('number',{default : 0}),
            ltPropBestfitClass : Lyte.attr('string', {default : ''}),
            ltPropFreezeMode : Lyte.attr('boolean', {default : false}),
            ltPropDefaultLength : Lyte.attr('string',{default : '2'}),
            ltPropDefaultHeight : Lyte.attr('string',{default : '2'}),
            ltPropDefaultMinLength : Lyte.attr('string',{default : '1'}),
            ltPropDefaultMinHeight : Lyte.attr('string',{default : '1'}),
            ltPropDefaultMaxHeight : Lyte.attr('string',{default : '0'}),
            ltPropDefaultMaxLength : Lyte.attr('string',{default : '0'}),
            ltPropColumnMode : Lyte.attr('boolean', {default : false}),
            ltPropColumn : Lyte.attr('number', {default : 3}),
            ltPropPrevent : Lyte.attr('object', { default : { horizontal : false, vertical : false }}),
            ltPropGridLength : Lyte.attr('number', {default : undefined}),
            ltPropBestfitType : Lyte.attr('string', { default : 'default'}),
            ltPropForcedReposition : Lyte.attr('boolean', { default : false}),
            ltPropSquareGrid : Lyte.attr('boolean', { default : false}),
            ltPropGridSpaceColor : Lyte.attr('string', { default : '#f8f8f8' }),
            ltPropHitBottom : Lyte.attr('boolean', { default : false}),
            ltPropGridSelectionClass: Lyte.attr( 'string', { default : '' } ),
            ltPropVisibleBoundary : Lyte.attr( 'object', { default : {} } ),
            ltPropVisible : Lyte.attr( 'array', { default : [] } ),

            // system data
            gridLength : Lyte.attr("number",{"default":undefined}), 
            ltPropGridHeight : Lyte.attr("number",{"default":undefined}),
            ltPropMarginLeftCopy : Lyte.attr("number",{"default":10}), 
            ltPropUnitXCopy : Lyte.attr("number",{"default":50}),  
            lyteGridStack : Lyte.attr("array",{"default":[]}), 
            // ltPropFlag : Lyte.attr("boolean",{"default": true}), 
            elements : Lyte.attr("object",{"default":undefined}), 
            oriNode : Lyte.attr("object",{"default":undefined}), 
            xElements : Lyte.attr("array",{"default":[]}), 
            yElements : Lyte.attr("array",{"default":[]}),
            iniData : Lyte.attr('array', {'default' : []}),
            lyteQuerySelector : Lyte.attr('object',{'default' : {}})
        }
    }, 
    // undo
    undoPrevious : function(){
            var data = this.getData('lyteGridStack'), lyteQuerySelector = this.getData('lyteQuerySelector') ;
            var elements = $L(this.getData('ltPropHandler'), this.scopeElement).e;
            if((lyteQuerySelector.currentPos) <= data[data.length - 1].oldHeight.length && lyteQuerySelector.currentPos >= 1)
                {
                    for(var i = 0;i < elements.length;i++ )
                        {
                            data[i].x = parseInt(data[i].oldX[lyteQuerySelector.currentPos-1])
                            data[i].nodeName.dataSet['lyte-grid-x-old'] = data[i].x
                            data[i].y = parseInt(data[i].oldY[lyteQuerySelector.currentPos-1])
                            data[i].nodeName.dataSet['lyte-grid-y-old'] = data[i].y
                            data[i].length = parseInt(data[i].oldLength[lyteQuerySelector.currentPos-1])
                            data[i].nodeName.dataSet['lyte-grid-length-old'] = data[i].length
                            data[i].height = parseInt(data[i].oldHeight[lyteQuerySelector.currentPos-1])
                            data[i].nodeName.dataSet['lyte-grid-height-old'] = data[i].height
                        }
                    this.displayGrid.call(this);
                    lyteQuerySelector.currentPos = (lyteQuerySelector.currentPos - 1) >= 0 ? (lyteQuerySelector.currentPos - 1) : 0;  
                }
        },
        // redo 
    undoNext : function(){
            var data = this.getData('lyteGridStack'), lyteQuerySelector = this.getData('lyteQuerySelector') ;
            var elements = $L(this.getData('ltPropHandler'), this.scopeElement).e;
            if((lyteQuerySelector.currentPos) <= (data[data.length - 1].oldHeight.length-1))
                {
                    var dumm = lyteQuerySelector.currentPos < (data[data.length - 1].oldHeight.length - 1) ? (lyteQuerySelector.currentPos + 1) : (data[data.length - 1].oldHeight.length - 1);
                    for(var i = 0; i < elements.length; i++)
                        {
                            data[i].x = parseInt(data[i].oldX[dumm]);
                            data[i].nodeName.dataSet['lyte-grid-x-old'] = data[i].x;
                            data[i].y = parseInt(data[i].oldY[dumm]);
                            data[i].nodeName.dataSet['lyte-grid-y-old'] = data[i].y;
                            data[i].length = parseInt(data[i].oldLength[dumm]);
                            data[i].nodeName.dataSet['lyte-grid-length-old'] = data[i].length;
                            data[i].height = parseInt(data[i].oldHeight[dumm]);
                            data[i].nodeName.dataSet['lyte-grid-height-old'] = data[i].height;
                        }
                    this.displayGrid.call(this);
                    lyteQuerySelector.currentPos = dumm;
                }
    },

     emptySpaceFind : function(objj, flagg, mappArray1, flag2){
        var data = this.getData('lyteGridStack');
        var mappArray = [], i ,j ,gridLength = this.getData('gridLength'), gridHeight = this.getData('ltPropGridHeight');
        if(!flagg)       
            {
                for(i = 0; i < gridLength; i++)
                    {
                        mappArray.push([]);
                        for(var z = 0; z < gridHeight; z++)
                            {
                                mappArray[i].push(false)
                            }
                    }
                for(i = 0; i < data.length; i++)
                    {   
                        if(data[i].x != undefined && data[i].y != undefined)
                            {
                                for(var k = data[i].x; k < (data[i].x + data[i].length); k++)
                                    {
                                        for(var m = data[i].y; m < (data[i].y + data[i].height); m++)
                                            {
                                                if(data[i].nodeName != objj.nodeName && mappArray[k] != undefined && mappArray[k][m] != 'res')
                                                    {
                                                        mappArray[k][m] = true;
                                                    }
                                                 else if(mappArray[k] && mappArray[k][m] == false)
                                                    {
                                                        mappArray[k][m] = 'res';
                                                    }   
                                            }
                                    }
                            }
                    } 
            }
          else
            {
                mappArray = mappArray.concat(mappArray1.slice());
            }  
        objj.length = objj.length != undefined ? objj.length : this.returnWid(this.getData('ltPropDefaultLength'), true);  
        objj.height = objj.height != undefined ? objj.height : this.returnWid(this.getData('ltPropDefaultHeight'));
        var xStar = objj.x ? objj.x : 0;    
        var yStar = objj.y ? objj.y : 0; 
        var xLim = objj.x != undefined && !isNaN(objj.x) ? (objj.x + 1) : (gridLength + 1 - objj.length);
        var yLim = objj.y != undefined && !isNaN(objj.x) ? (objj.y) : (gridHeight - 1);
        for(var i = yStar; i <= yLim; i++)
            {
                for(var j = xStar; j < xLim; j++)
                    {
                        var flag = true;
                        for(var k = j; k < (j + objj.length); k++)
                            {
                                for(var l = i; l < (i + objj.height); l++)
                                    {
                                        if(mappArray[k] && mappArray[k][l] == true)
                                            {
                                                flag = false;
                                                hgtShort = l - i;
                                                break;
                                            }
                                    }
                                 if(!flag)
                                    {
                                        break;
                                    }   
                            }
                        if(flag && j < (gridLength + 1 - objj.length))
                            {
                                return [{x : j, y : i}, !flagg];
                            }    
                    }   
            }
        var temp;
        if(!flagg){
                temp = this.emptySpaceFind.call(this, {length : objj.length, height : objj.height, nodeName : objj.nodeName}, true, mappArray);
            }
       if(!flag2){
                this.setData('ltPropGridHeight', gridHeight + objj.height);
                temp = this.emptySpaceFind.call(this, {length : objj.length, height : objj.height, nodeName : objj.nodeName}, true, mappArray, true);

            }  
          return (temp.constructor == Array ? temp : [temp, false]);   
    }

}); 
