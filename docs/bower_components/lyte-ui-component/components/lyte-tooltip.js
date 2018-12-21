Lyte.Component.register('lyte-tooltip',{
_template:"<template tag-name=\"lyte-tooltip\">   </template>",
_dynamicNodes : [],
_observedAttributes :["ltPropId","ltPropClass","ltPropKeepAlive","eventListeners"],
  init : function(){
    if(this.getMethods('beforeRender'))
        {
            this.executeMethod('beforeRender', this.$node);
        }
  },
  
  data : function(){
    return {
      //user data
      ltPropId : Lyte.attr('string', {default : ''}),
      ltPropClass : Lyte.attr('string', {default : ''}),
      ltPropKeepAlive : Lyte.attr('boolean', {default : false}),
      // system data
      eventListeners : Lyte.attr('object', {default : {}})
    }
  },

  didConnect : function(){
      var tooltips = $L('lyte-tooltip').e
      this._clickHide = this.clickHide;
      if(tooltips.length > 1)
          {
            for(var mn = 0; mn < tooltips.length; mn++)
                {
                  if(!(tooltips[mn].getAttribute('lt-prop-class') || tooltips[mn].getAttribute('lt-prop-id')) && tooltips[mn] != this.$node)
                      {
                         tooltips[mn].parentElement.removeChild(tooltips[mn]);  
                      }
                }
          }
      var evt = this.mousemove.bind(this);
      this.setData('eventListeners.mousemove', evt);
      document.addEventListener('mousemove', evt, true);   
      window.addEventListener('scroll',this.tooltipScroll , true); 
      this._mousedown = this.mousedown.bind( this );
      this._mouseup = this.mouseup.bind( this );
      this._keydown = this.keydown.bind( this );
      document.addEventListener( 'keydown', this._keydown, true);
      document.addEventListener( 'mousedown', this._mousedown, true );
      if(this.getMethods('afterRender'))
            {
                this.executeMethod('afterRender', this.$node);
            }

  },

  tooltipScroll : function(event){
    if($L('span.lyteTooltip:not(.lyteTooltipHidden)').e.length) {
        $L( 'span.lyteTooltip:not(.lyteTooltipHidden)' ).addClass( 'lyteTooltipHidden' )
    }
  },

  mousedown : function(event){
      this._mousedownFlag = true;
      if( event.target.classList.contains( 'lyteSliderHandler' ) ){
        delete  this.prevTooltipNode;
        this._slider = true;
      }
      this.closeAllTooltip();
      document.addEventListener( 'mouseup', this._mouseup, true)
  },

  mouseup : function( event ) {
    delete this._mousedownFlag;
    document.removeEventListener('mouseup', this._mouseup, true);
    if( this._slider ){
      delete this._slider;
      if( event.target.classList.contains( 'lyteSliderHandler' ) ){
        this.mousemove({ target : event.target});
      }
    }
  },

  keydown : function( evt ) {
     delete  this.prevTooltipNode;
     this.closeAllTooltip();
  },

  tooltipOpenCallback : function( arg1, arg2 ) {
      if( arg1.onTooltipShow ) {
          arg1.onTooltipShow.apply(this, arguments)     
      }
      if(this.getMethods( 'onTooltipShow' ) ) {
          this.executeMethod( 'onTooltipShow', arg1, arg2, arg1.tooltip );
      }
  },

  tooltipCloseCallback : function( arg1 ) {
      if( arg1.onTooltipHide ) {
          arg1.onTooltipHide.apply(this, arguments)     
      }
     if(this.getMethods( 'onTooltipHide' ) ) {
          this.executeMethod( 'onTooltipHide', arg1 );
      }
  },

  didDestroy : function(){
        window.removeEventListener('scroll',this.tooltipScroll , true);
        document.removeEventListener('mousemove', this.getData('eventListeners').mousemove, true);
        document.removeEventListener('mouseup', this._mouseup, true);
        document.removeEventListener( 'keydown', this._keydown, true );
        var exsttools = $L( 'span.lyteTooltip').e;
        for( var i = 0; i < exsttools.length; i++ ) {
          delete exsttools[i].nodeName1.tooltipSpan;
          delete exsttools[i].nodeName1.tooltip;
          document.body.removeChild(exsttools[i]);
        }
  },

  propertySetting : function(nodeName1){
      var config = nodeName1.getAttribute('lt-prop-tooltip-config');
      if( config )
          {
                var config = JSON.parse( config );
                for(var key in config)
                  {
                     nodeName1.tooltip.config[key] = config[key];
                  }
          }
  },

  createTooltip : function(event, span, flag){
      if(flag){
             this.followcursor.call(this, event, span)
          }
       else{
             this.nonFollowcursor.call(this, event, span)
          }
      if(!this.getData('ltPropKeepAlive'))      
          {
            if((span.nodeName1.tooltip.config.keeptooltip != true && span.nodeName1.tooltip.config.keeptooltip != 'true'))
                 {
                    span.nodeName1.tooltip.maxdisp = setTimeout(function(){
                    if(document.body.contains(span))
                      {
                         if( this.prevTooltipNode == span.nodeName1 ) {
                            delete this.prevTooltipNode;
                         }
                         var node = span.nodeName1;
                         delete span.nodeName1.tooltipSpan;
                         delete span.nodeName1.tooltip;
                         document.body.removeChild(span);
                        this.tooltipCloseCallback( node );
                      }
                    }.bind( this ), span.nodeName1.tooltip.config.maxdisplaytime);
                }
          }
  },

  followcursor : function(event, span){
    // here tooltip changes its position on every mousemov. so fastdom can't  be used here
      if(document.body.contains(span))
          {
            // span.innerText = span.nodeName1.tooltip.title; 
            if( !span._callbackHandled ) {
                this.tooltipOpenCallback( span.nodeName1, span );
                span._callbackHandled = true;
            } 
            // $L.fastdom.measure(function(){
                  // calculating page off set
                  var xscroll = window.pageXOffset || document.documentElement.scrollLeft
                  var yscroll = window.pageYOffset || document.documentElement.scrollTop  
                  span.classList.remove( 'lyteTooltipHidden' )
                  // $L.fastdom.mutate(function(){
                      span.style.left = event.clientX + xscroll +'px';
                      span.style.top =(event.clientY + yscroll + 5 + span.nodeName1.tooltip.config.margin) + 'px';
                  // })  
            // }.bind(this))
          }
  },

  nonFollowcursor : function(event, span, position, prevent){
    // $L.fastdom.mutate(function(){
        span.classList.remove( 'lyteTooltipHidden' )
        if( !span._callbackHandled ) {
                this.tooltipOpenCallback( span.nodeName1, span );
                span._callbackHandled = true;
            } 
        // span.className = 'lyteTooltip ' + span.nodeName1.tooltip.classname + (this.getData('ltPropClass') ? ' ' +  this.getData('ltPropClass') : '');
         $L.fastdom.measure(function(){
            if(!position)
              {
                position = span.nodeName1.tooltip.config.position;
              }
              // calculating page off set 
            var xscroll = window.pageXOffset || document.documentElement.scrollLeft
            var yscroll = window.pageYOffset || document.documentElement.scrollTop  
            var spanClientRect = span.getBoundingClientRect();
            var nodeClientRect = span.nodeName1.getBoundingClientRect();
            var left = nodeClientRect.left + xscroll;
            var topPos = nodeClientRect.top + yscroll;
            var margin = span.nodeName1.tooltip.config.margin;
            margin = margin > 20 ? 20 : margin;         
            var toolwid = span.offsetWidth;
            var divWidth = nodeClientRect.width;
            var wid = nodeClientRect.height;
            var appearance = span.nodeName1.tooltip.config.appearance;
            var innWidth = window.innerWidth, innHeight = window.innerHeight;
            switch(position.toLowerCase())
              {
                case 'right' :
                 {
                    if(appearance=="callout")
                        {
                            span.classList.add('lyteRight');
                            // need to calculate arrow height after adding class
                            left+= parseInt(window.getComputedStyle(span, ':after').getPropertyValue('border-left-width'));
                        }
                    var newLeft = (left+divWidth+margin)+'px';
                    span.style.top=(topPos+wid/2-span.offsetHeight/2)+'px';
                    if( ( innWidth + xscroll ) < (parseInt(newLeft) + spanClientRect.width))
                      {
                         span.classList.remove('lyteRight');
                         if( !prevent ){
                          this.nonFollowcursor.call(this,event, span,'left', true);
                        }
                      }
                    else{
                      span.style.left = newLeft;
                    }
                    break; 
                 }
                 case 'left' :
                   {
                      if(appearance=="callout")
                          {
                              span.classList.add('lyteLeft');
                              // need to calculate arrow height after adding class
                              left-= parseInt(window.getComputedStyle(span, ':before').getPropertyValue('border-left-width'));
                          }
                       var newLeft = (left-margin- toolwid )+'px';
                       span.style.top=(topPos+wid/2-span.offsetHeight/2)+'px';
                      if(parseInt(newLeft) < xscroll)
                        {
                          span.classList.remove('lyteLeft');
                           if( !prevent ){
                              this.nonFollowcursor.call(this,event, span,'right', true);
                            }
                        }
                      else{
                           span.style.left = newLeft;
                      }  
                      break;  
                   }
                case 'bottom' :
                  {
                    if(appearance=="callout")            
                        {
                            span.classList.add('lyteBottom');
                            // need to calculate arrow height after adding class
                            topPos+= parseInt(window.getComputedStyle(span, ':after').getPropertyValue('border-left-width'));
                        }
                    span.style.left=(left+divWidth/2- toolwid /2)+'px';
                    var newTop = (topPos+wid+margin)+'px';
                    if(( yscroll + innHeight ) < (parseInt( newTop ) + spanClientRect.height))
                       {
                          span.classList.remove('lyteBottom');
                           if( !prevent ){
                              this.nonFollowcursor.call(this,event, span,'top', true);
                            }
                       }
                    else{
                       span.style.top = newTop;
                    }      
                    break;  
                  }     
                case 'top' :
                  {
                    if(appearance=="callout")
                       {
                            span.classList.add('lyteTop');
                            // need to calculate arrow height after adding class
                            topPos-= parseInt(window.getComputedStyle(span, ':after').getPropertyValue('border-left-width'));
                       }
                    span.style.left=(left+divWidth/2- toolwid /2)+'px';
                    var newTop = (topPos-margin-span.clientHeight)+'px';
                    if(parseInt( newTop ) < yscroll)
                       {
                         span.classList.remove('lyteTop');
                          if( !prevent ){
                            this.nonFollowcursor.call(this,event, span,'bottom', true);
                          }
                       } 
                    else{
                        span.style.top = newTop;
                    }    
                    break;     
                  }
                 case 'bottomright' :
                  {
                    if(appearance=="callout")
                       {
                           span.classList.add('lyteBottomright');
                           // need to calculate arrow height after adding class
                           topPos+= parseInt(window.getComputedStyle(span, ':after').getPropertyValue('border-left-width'));
                       }
                    var newLeft =(left+divWidth*.75-0.2* toolwid )+'px';
                    var newTop =(topPos+wid+margin)+'px';
                    if(( innWidth + xscroll ) < (parseInt(newLeft)+ spanClientRect.width))
                        {
                          span.classList.remove('lyteBottomright');
                          if( !prevent ){
                            this.nonFollowcursor.call(this,event, span,'BottomLeft',true);
                          }
                          break;
                        }
                    else{
                        span.style.left = newLeft;
                    }     
                   if( ( innHeight + yscroll ) < (parseInt(newTop)+ spanClientRect.height)) 
                       {
                         span.classList.remove('lyteBottomright');
                         if( !prevent ){
                            this.nonFollowcursor.call(this,event, span,'topright', true);
                          }
                         break
                       }
                     else{
                        span.style.top = newTop;
                     }  
                    break; 
                  }
                case 'topright' :
                  {
                    if(appearance=="callout")
                       {
                            span.classList.add('lyteTopright');
                            // need to calculate arrow height after adding class
                            topPos-=parseInt(window.getComputedStyle(span, ':after').getPropertyValue('border-left-width'));
                       }
                    var newLeft =( left + divWidth * .75 - 0.2 * toolwid ) + 'px';
                    var newTop =(topPos-span.clientHeight-margin)+'px';
                     if( ( innWidth + xscroll ) < (parseInt(newLeft) + spanClientRect.width))
                         {
                           span.classList.remove('lyteTopright');
                           if( !prevent ){
                              this.nonFollowcursor.call(this,event, span,'topleft', true);
                            }
                           break;
                        }
                    else{
                        span.style.left = newLeft;
                    } 
                    if(parseInt(newTop)< yscroll)
                        {
                           span.classList.remove('lyteTopright');
                           if( !prevent ){
                              this.nonFollowcursor.call(this,event, span,'bottomright', true);
                            }
                           break
                       }
                     else{
                        span.style.top = newTop;
                     }  
                     break;      
                 }
                case 'bottomleft' :
                   {
                     if(appearance=="callout")
                        {
                            span.classList.add('lyteBottomleft');
                            // need to calculate arrow height after adding class
                            topPos+=parseInt(window.getComputedStyle(span, ':after').getPropertyValue('border-left-width'));
                        }
                     var newLeft =(left- toolwid *.8+0.25*divWidth)+'px';
                     var newTop =(topPos+wid+margin)+'px';
                     if(parseInt(newLeft) < xscroll)
                        {
                            span.classList.remove('lyteBottomleft');
                            if( !prevent ){
                                this.nonFollowcursor.call(this,event, span,'bottomright', true);
                            }
                            break;
                        }
                    else{
                        span.style.left = newLeft;
                    } 
                    if(( innHeight + yscroll ) < (parseInt(newTop) + spanClientRect.height))
                        {
                            span.classList.remove('lyteBottomleft');
                            if( !prevent ){
                              this.nonFollowcursor.call(this,event, span,'topleft', true);
                            }
                            break
                       }
                     else{
                        span.style.top = newTop;
                     } 
                     break; 
                    }
                 case 'topleft' :
                    {
                        if(appearance=="callout")
                          {
                              span.classList.add('lyteTopleft');
                              // need to calculate arrow height after adding class
                              topPos-= parseInt(window.getComputedStyle(span, ':after').getPropertyValue('border-left-width'));
                          }
                        var newLeft = (left -  toolwid  * .8 + 0.25 * divWidth)+'px';
                        var newTop = (topPos-parseInt(span.clientHeight)-margin)+'px';
                        if(parseInt(newLeft)< xscroll)
                          {
                              span.classList.remove('lyteTopleft');
                              if( !prevent ){
                                  this.nonFollowcursor.call(this,event, span,'topright', true);
                              }
                              break;
                          }
                        else{
                              span.style.left = newLeft;
                          } 
                        if(parseInt(newTop)< yscroll)
                          {   
                              span.classList.remove('lyteTopleft');
                              if( !prevent ){
                                  this.nonFollowcursor.call(this,event, span,'bottomleft', true);
                              }
                              break
                           }
                         else{
                            span.style.top = newTop;
                         }
                        break;    
                       }
                default:
                   {
                    var tooltop=0;
                    if(appearance=="callout")
                        {
                            span.classList.add('lyteBottom');
                            // need to calculate arrow height after adding class
                            tooltop = parseInt(window.getComputedStyle(span, ':after').getPropertyValue('border-left-width'));
                        }
                      var newLeft =(parseInt(event.clientX)- toolwid / 2) + 'px';
                      var newTop =(topPos+tooltop+wid+margin)+'px';
                      if(parseInt(newLeft)< xscroll)
                        {
                           span.style.left = '0px';
                        }
                      else{
                          span.style.left = newLeft;
                      } 
                     if(( innHeight + yscroll) < (parseInt( newTop ) + spanClientRect.height))
                       {
                          span.classList.remove('lyteBottom');
                          if( !prevent ){
                            this.nonFollowcursor.call(this,event, span,'top', true);
                          }
                       }
                     else{
                        span.style.top = newTop;
                     }
                   }
                }
          }.bind(this))
    // }.bind(this))
  },

closeAllTooltip : function(current){
    var tooltipsopen = $L('span.lyteTooltip').e;
    for(var i = 0; i < tooltipsopen.length; i++)
      {
        if(tooltipsopen[i].nodeName1 != current){
          if(document.body.contains(tooltipsopen[i])){
              tooltipsopen[i].nodeName1.tooltip.bodyTimeout = setTimeout(this.removeTooltip.bind( this ), tooltipsopen[i].nodeName1.tooltip.config.hidedelay, tooltipsopen[i], event);
            }
        }
      }
},  

removeTooltip : function(span, event){
         if(document.body.contains(span))
            {
               clearTimeout(span.nodeName1.tooltip.disptime);
               clearTimeout(span.nodeName1.tooltip.settime);
               if( this.prevTooltipNode == span.nodeName1 ) {
                  delete this.prevTooltipNode;
               }
               var node = span.nodeName1
               delete span.nodeName1.tooltipSpan;
               delete span.nodeName1.tooltip;
               document.body.removeChild(span)
               this.tooltipCloseCallback( node )
            }
},
  mousemove : function(event){
        if( this._mousedownFlag ) {
          return
        }
        var nodeName1 = event.target;
        while(nodeName1 && nodeName1.tagName != 'BODY' && nodeName1 != document && nodeName1.tagName != 'HTML' ){
            if(nodeName1.getAttribute('lt-prop-title'))
                {
                  if(nodeName1.getAttribute('title'))
                      {
                        nodeName1.removeAttribute('title')
                      }
                   if(!nodeName1.hasOwnProperty('tooltip'))   
                      {
                        nodeName1.tooltip = {};
                      }
                   nodeName1.tooltip.config = {position : '', appearance : 'callout', margin : 0, showdelay : 0, hidedelay : 0, maxdisplaytime : 5000, keeptooltip : false}
                   nodeName1.tooltip.title = nodeName1.getAttribute('lt-prop-title');
                   this.propertySetting.call(this, nodeName1);
                   if(this.prevTooltipNode != nodeName1 && !nodeName1.tooltip.tooltipSpan)
                      {
                          this.prevTooltipNode = nodeName1;
                          var span = document.createElement('span'), toolclass = nodeName1.getAttribute( 'lt-prop-tooltip-class' );
                          var ltPropId = this.getData('ltPropId'), ltPropClass = this.getData('ltPropClass');
                          if(ltPropId)
                              {
                                 span.setAttribute('id', ltPropId);
                              }
                          if(ltPropClass)
                              {
                                  span.classList.add(ltPropClass);
                              }    
                          span.classList.add('lyteTooltip');
                          span.classList.add('lyteTooltipHidden');
                          if(nodeName1.getAttribute('lt-prop-tooltip-style'))
                              {
                                span.setAttribute('style', nodeName1.getAttribute('lt-prop-tooltip-style'));
                                if(!span.style.borderColor)
                                    { 
                                        span.style.borderColor = span.style.backgroundColor;
                                    }
                              }
                          nodeName1.tooltip.classname = nodeName1.tagName + 'tooltip' + $L('span.lyteTooltip').e.length + nodeName1.tooltip.config.appearance + nodeName1.tooltip.config.position
                          span.classList.add(nodeName1.tooltip.classname);
                          document.body.appendChild(span);
                          nodeName1.tooltip.tooltipSpan = span;
                          span.nodeName1 = nodeName1;
                          if( toolclass ) {
                            var arr = toolclass.split(" ");
                            for( var i = 0; i < arr.length; i++ ) {
                                span.classList.add( arr[ i ] );
                            } 
                          }

                          nodeName1.tooltip.settime = setTimeout(this.createTooltip.bind(this), span.nodeName1.tooltip.config.showdelay,event, span,  span.nodeName1.tooltip.config.position == 'followcursor' ? true : false);
                          span.innerText = span.nodeName1.tooltip.title; 
                      } 
                    else if(nodeName1.tooltip.config.position == 'followcursor' && this.prevTooltipNode == nodeName1 && nodeName1.tooltip.tooltipSpan)
                      {
                          var span = nodeName1.tooltip.tooltipSpan;
                          clearTimeout(span.nodeName1.tooltip.maxdisp);
                          clearTimeout(span.nodeName1.tooltip.settime);
                          if(!span._callbackHandled){
                            span.nodeName1.tooltip.settime = setTimeout(this.createTooltip.bind(this), span.nodeName1.tooltip.config.showdelay,event, span, true);
                          } else {
                            this.followcursor.call(this, event, span)
                          }
                      }
                   else if(nodeName1.tooltip.tooltipSpan && nodeName1.tooltip.tooltipSpan.style.display == 'none')
                      {
                          nodeName1.tooltip.tooltipSpan.style.display = '';
                          clearTimeout(nodeName1.tooltip.maxdisp);
                          clearTimeout(nodeName1.tooltip.settime);
                          clearTimeout(nodeName1.tooltip.bodyTimeout);
                          nodeName1.tooltip.settime = setTimeout(this.createTooltip.bind(this), nodeName1.tooltip.config.showdelay,event, nodeName1.tooltip.tooltipSpan, nodeName1.tooltip.config.position == 'followcursor' ? true : false);
                      }   
                   else
                      {
                          this.prevTooltipNode = nodeName1;
                      } 
                   this.closeAllTooltip.call(this, nodeName1)    
                   break;       
                }
              else {
                nodeName1 = nodeName1.parentElement;
              }  
        }
      if(nodeName1 && nodeName1.tagName == 'BODY' && this.prevTooltipNode != nodeName1)
          {
              delete this.prevTooltipNode;
              this.closeAllTooltip.call(this)
          } 

  }

});

if(document.readyState == "complete" || document.readyState == "interactive"){
  if(!$L('lyte-tooltip').e.length){
        document.body.appendChild(document.createElement('lyte-tooltip'));
  }
}else{
  document.addEventListener('DOMContentLoaded',function(event){
    if(!$L('lyte-tooltip').e.length){
        document.body.appendChild(document.createElement('lyte-tooltip'));
  }
});
}
;
