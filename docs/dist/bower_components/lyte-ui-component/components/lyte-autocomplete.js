Lyte.Component.register("lyte-autocomplete",{
_template:"<template tag-name=\"lyte-autocomplete\">         <lyte-dropdown lt-prop-set-pos=\"{{ltPropSetPos}}\" lt-prop-type=\"{{ltPropDropType}}\" lt-prop-yield=\"true\" lt-prop-freeze=\"{{ltPropFreeze}}\" lt-prop-callout=\"{{ltPropCallout}}\" lt-prop-show=\"{{ltPropShow}}\" lt-prop-position=\"{{ltPropPosition}}\" lt-prop-hover=\"{{ltPropHover}}\" lt-prop-disabled=\"{{ltPropDisabled}}\" lt-prop-boundary=\"{{ltPropBoundary}}\" lt-prop-tabindex=\"{{ltPropTabindex}}\" on-option-selected=\"{{method('valSet')}}\" on-show=\"{{method('show')}}\" on-hide=\"{{method('hide')}}\" on-before-show=\"{{method('beforeShow')}}\" on-before-hide=\"{{method('beforeHide')}}\" on-add=\"{{method('add')}}\" on-remove=\"{{method('remove')}}\" on-position-changed=\"{{'positionChanged'}}\" on-scroll=\"{{method('scroll')}}\">        <template is=\"registerYield\" yield-name=\"yield\">              <lyte-drop-button onkeyup=\"{{action('keyup', event)}}\" onclick=\"{{action('clickThrow', event)}}\">                     <lyte-input lt-prop-maxlength=\"{{ltPropMaxlength}}\" lt-prop-auto-update=\"{{ltPropAutoUpdate}}\" on-value-change=\"{{method('valuechange')}}\" lt-prop-tab-index=\"{{ltPropTabIndex}}\" lt-prop-id=\"{{ltPropId}}\" lt-prop-wrapper-style=\"{{ltPropWrapperStyle}}\" lt-prop-class=\"{{ltPropClass}}\" lt-prop-autofocus=\"{{ltPropAutofocus}}\" lt-prop-autocomplete=\"{{ltPropAutocomplete}}\" lt-prop-type=\"{{ltPropType}}\" lt-prop-name=\"{{ltPropName}}\" lt-prop-placeholder=\"{{ltPropPlaceholder}}\" lt-prop-value=\"{{lbind(ltPropValue)}}\" lt-prop-width=\"100%\" lt-prop-height=\"{{ltPropHeight}}\" lt-prop-style=\"{{ltPropStyle}}\" lt-prop-appearance=\"{{ltPropAppearance}}\" lt-prop-direction=\"vertical\" lt-prop-disabled=\"{{ltPropDisabled}}\" lt-prop-readonly=\"{{ltPropReadonly}}\" lt-prop-pattern=\"{{ltPropPattern}}\" rows=\"{{ltPropRows}}\" cols=\"{{ltPropCols}}\" title=\"{{ltPropInputTitle}}\" lt-prop-text-area-resize=\"{{ltPropTextAreaResize}}\" lt-prop-input-title=\"{{ltPropInputTitle}}\"></lyte-input>                     <div class=\"closeIconWrapper\" onclick=\"{{action('resetValue', event)}}\" style=\"{{if(ltPropValue, 'display: block;','display: none;')}}\">                        <span class=\"closeIcon\"></span>                    </div>                     <template is=\"if\" value=\"{{expHandlers(ltPropType,'==','search')}}\"><template case=\"true\">                        <span class=\"iconSeparator\" style=\"{{if(ltPropValue, 'display: block;','display: none;')}}\"></span>                     </template></template>              </lyte-drop-button>           <template is=\"if\" value=\"{{expHandlers(ltPropYield,'==',false)}}\"><template case=\"true\">            <lyte-drop-box class=\"{{ltPropDropdownClass}}\" id=\"{{ltPropDropdownId}}\">              <lyte-drop-body>              <template is=\"for\" items=\"{{ltPropContent}}\" item=\"list\" index=\"indexVal\"><template is=\"if\" value=\"{{lyteUiOptGroupCheck(list)}}\"><template case=\"true\">                      <lyte-drop-group elemorder=\"{{indexVal}}\">                         <lyte-drop-label>{{lyteUiReturnOnlyKey(list)}}</lyte-drop-label>                            <template is=\"for\" items=\"{{lyteUiReturnOnlyValue(list)}}\" item=\"list1\" index=\"indexVal1\"><template is=\"if\" value=\"{{expHandlers(lyteUiIsObject(list1),'==',false)}}\"><template case=\"true\">                                             <lyte-drop-item grporder=\"{{indexVal}}\" elemorder=\"{{indexVal1}}\" data-value=\"{{list1}}\">                                                    <lyte-autocomplete-label keywords=\"{{list1}}\">{{list1}}</lyte-autocomplete-label>                                              </lyte-drop-item>                                        </template><template case=\"false\">                                            <lyte-drop-item grporder=\"{{indexVal}}\" elemorder=\"{{indexVal1}}\" data-value=\"{{list1[ltPropLabel]}}\" class=\"{{list1.class}}\">                                                <lyte-autocomplete-label keywords=\"{{list1[ltPropKeyWords]}}\">{{list1[ltPropLabel]}}</lyte-autocomplete-label>                                                    <template is=\"if\" value=\"{{list1[ltPropDescription]}}\"><template case=\"true\">                                                        <lyte-autocomplete-description>, {{list1[ltPropDescription]}}</lyte-autocomplete-description>                                                    </template></template>                                            </lyte-drop-item>                                    </template></template></template>                    </lyte-drop-group>                    </template><template case=\"false\"><template is=\"if\" value=\"{{expHandlers(lyteUiIsObject(list),'==',false)}}\"><template case=\"true\">                                       <lyte-drop-item elemorder=\"{{indexVal}}\" data-value=\"{{list}}\">                                              <lyte-autocomplete-label keywords=\"{{list}}\">{{list}}</lyte-autocomplete-label>                                        </lyte-drop-item>                                </template><template case=\"false\">                                      <lyte-drop-item elemorder=\"{{indexVal}}\" data-value=\"{{list[ltPropLabel]}}\" class=\"{{list1.class}}\">                                          <lyte-autocomplete-label keywords=\"{{list[ltPropKeyWords]}}\">{{list[ltPropLabel]}}</lyte-autocomplete-label>                                              <template is=\"if\" value=\"{{list[ltPropDescription]}}\"><template case=\"true\">                                                  <lyte-autocomplete-description>, {{list[ltPropDescription]}}</lyte-autocomplete-description>                                              </template></template>                                      </lyte-drop-item>                                </template></template></template></template></template>                    </lyte-drop-body>                   </lyte-drop-box>          </template><template case=\"false\">                  <lyte-yield yield-name=\"yield\"></lyte-yield>            </template></template>        </template>      </lyte-dropdown>     </template>",
_dynamicNodes : [{"type":"attr","position":[1]},{"type":"registerYield","position":[1,1],"dynamicNodes":[{"type":"attr","position":[1]},{"type":"attr","position":[1,1]},{"type":"componentDynamic","position":[1,1]},{"type":"attr","position":[1,3],"attr":{"style":{"name":"style","helperInfo":{"name":"if","args":["ltPropValue","'display: block;'","'display: none;'"]}}}},{"type":"attr","position":[1,5]},{"type":"if","position":[1,5],"cases":{"true":{"dynamicNodes":[{"type":"attr","position":[1],"attr":{"style":{"name":"style","helperInfo":{"name":"if","args":["ltPropValue","'display: block;'","'display: none;'"]}}}}]}},"default":{}},{"type":"componentDynamic","position":[1]},{"type":"attr","position":[3]},{"type":"if","position":[3],"cases":{"true":{"dynamicNodes":[{"type":"attr","position":[1]},{"type":"attr","position":[1,1,1]},{"type":"for","position":[1,1,1],"dynamicNodes":[{"type":"attr","position":[0]},{"type":"if","position":[0],"cases":{"true":{"dynamicNodes":[{"type":"attr","position":[1]},{"type":"text","position":[1,1,0]},{"type":"componentDynamic","position":[1,1]},{"type":"attr","position":[1,3]},{"type":"for","position":[1,3],"dynamicNodes":[{"type":"attr","position":[0]},{"type":"if","position":[0],"cases":{"true":{"dynamicNodes":[{"type":"attr","position":[1]},{"type":"attr","position":[1,1]},{"type":"text","position":[1,1,0]},{"type":"componentDynamic","position":[1,1]},{"type":"componentDynamic","position":[1]}]},"false":{"dynamicNodes":[{"type":"attr","position":[1]},{"type":"attr","position":[1,1]},{"type":"text","position":[1,1,0]},{"type":"componentDynamic","position":[1,1]},{"type":"attr","position":[1,3]},{"type":"if","position":[1,3],"cases":{"true":{"dynamicNodes":[{"type":"text","position":[1,1]},{"type":"componentDynamic","position":[1]}]}},"default":{}},{"type":"componentDynamic","position":[1]}]}},"default":{}}]},{"type":"componentDynamic","position":[1]}]},"false":{"dynamicNodes":[{"type":"attr","position":[0]},{"type":"if","position":[0],"cases":{"true":{"dynamicNodes":[{"type":"attr","position":[1]},{"type":"attr","position":[1,1]},{"type":"text","position":[1,1,0]},{"type":"componentDynamic","position":[1,1]},{"type":"componentDynamic","position":[1]}]},"false":{"dynamicNodes":[{"type":"attr","position":[1]},{"type":"attr","position":[1,1]},{"type":"text","position":[1,1,0]},{"type":"componentDynamic","position":[1,1]},{"type":"attr","position":[1,3]},{"type":"if","position":[1,3],"cases":{"true":{"dynamicNodes":[{"type":"text","position":[1,1]},{"type":"componentDynamic","position":[1]}]}},"default":{}},{"type":"componentDynamic","position":[1]}]}},"default":{}}]}},"default":{}}]},{"type":"componentDynamic","position":[1,1]},{"type":"componentDynamic","position":[1]}]},"false":{"dynamicNodes":[{"type":"insertYield","position":[1]}]}},"default":{}}]},{"type":"componentDynamic","position":[1]}],
_observedAttributes :["ltPropAutocomplete","ltPropPlaceholder","ltPropAutofocus","ltPropDisabled","ltPropMaxlength","ltPropReadonly","ltPropId","ltPropClass","ltPropType","ltPropName","ltPropWidth","ltPropValue","ltPropContent","ltPropLabel","ltPropDescription","ltPropAppearance","ltPropDirection","ltPropExternalSearch","ltPropYield","ltPropHeight","ltPropHighlight","ltPropHighlightClass","ltPropKeyWords","ltPropMinLength","ltPropErrorClass","ltPropDropdownWidth","ltPropDropdownHeight","ltPropDropdownClass","ltPropDropdownId","ltPropMethod","ltPropWrapperStyle","ltPropAjaxRequest","ltPropTabIndex","ltPropTabindex","ltPropFreeze","ltPropCallout","ltPropShow","ltPropDisabled","ltPropHover","ltPropBoundary","ltPropPosition","ltPropDropType","ltPropSetPos","ltPropPattern","ltPropAutoUpdate","ltPropValueSet","ltPropPreventInsideClick","ltPropExtSearchOpen","ltPropInputTitle","ltPropRows","ltPropCols","ltPropTextAreaResize","timeout","optGroup","autocompleteFlag"],
    init : function(){
         this.$node.focus = function(){
              this.$node.querySelector( 'input' ).focus();
        }.bind( this ) 

        this.$node.toggle = function() {
           this.$node.querySelector( 'lyte-dropdown' ).toggle( arguments[ 0 ], arguments[ 1 ] )
        }.bind( this )   

        if( this.getMethods( 'beforeRender' ) ) {
                this.executeMethod( 'beforeRender', this.$node );
        }
    },

     didConnect : function(){
        var errorDiv = document.createElement( 'DIV' );
        errorDiv.classList.add( 'lyteautocompleteError' );
        errorDiv.style.display = 'none';
        this.autocompleteComp = errorDiv;
        $L( 'lyte-drop-body', this.$node ).e[ 0 ].appendChild( errorDiv );
        this.dropdown = $L( 'lyte-dropdown', this.$node ).e[ 0 ];
        this.dropbody = this.dropdown.childComp ? this.component.childComp : $L( 'lyte-drop-box', this.dropdown ).e[ 0 ];
        this.$node.setValue = function(value){
              value = value != undefined ? value : '';
              $L('lyte-input',this.$node).e[0].ltProp('value', value);
              this.pressFunc.call(this, value, {});
        }.bind(this);
        if(this.getMethods('afterRender'))
            {
                this.executeMethod('afterRender', this.$node);
            }
     },

     typeObs : function() {
      var type = this.getData( 'ltPropType' )
        if( type == 'textarea' ) {
            this.input = $L( 'textarea', this.$node ).e[ 0 ]
        } else {
            this.input =  $L( 'input', this.$node ).e[ 0 ];
            if( type == 'search' ) {
                this.$node.classList.add( 'searchPresent' )
                return
            }
            this.$node.classList.remove( 'searchPresent' )
        }

     }.observes( 'ltPropType' ).on( 'didConnect' ),

     arrayFrom : function( nodeList ) {
            var arrayList = [];
            for( var i = 0; i < nodeList.length; i++ ) {
                arrayList.push( nodeList[ i ] );
              }
            return arrayList.slice(); 
           },

     optGroupObs : function(){
        setTimeout( this.optGroup.bind( this ), 0 );
     }.observes( 'ltPropContent' ),      
     
     optGroup : function(){
          if( ( this.dropbody && !this.dropbody.classList.contains( 'lyteDropdownHidden' ) && $L( 'input', this.$node ).e[ 0 ].value.length ) || this.getData( 'ltPropExternalSearch' ) ) {
              this.contentFiltering.call( this, this.input.value )
          }

     },
     // setting height

     classObs : function(){
        if( this.getData( 'ltPropYield' ) ) {
              if( arguments[ 0 ] ) {
                 this.dropbody.classList.remove( arguments[ 0 ].oldValue )
              }  
              this.dropbody.classList.add( this.getData( 'ltPropDropdownClass' ) )
          }
      }.observes('ltPropDropdownClass').on('didConnect'),

     heigthSetObs : function(){
        this.heigthSet.call(this);
     }.observes('ltPropDropdownHeight').on('didConnect'),

     heigthSet : function(){
          var ltPropDropdownHeight = this.getData('ltPropDropdownHeight');
          if(ltPropDropdownHeight){
                $L('lyte-drop-body', this.dropbody).e[0].style.maxHeight = ltPropDropdownHeight;
          }
     },
     // setting width 

     widthSetObs : function(){
        this.widthSet.call(this);
     }.observes('ltPropDropdownWidth').on('didConnect'),

     widthSet : function(){
          var ltPropDropdownWidth = this.getData('ltPropDropdownWidth');
          if(ltPropDropdownWidth){
                 $L('lyte-drop-body', this.dropbody).e[0].style.width = ltPropDropdownWidth;
          }
     },

     data : function (){
      //user data
            return {
               ltPropAutocomplete : Lyte.attr("string",{"default" : 'off'}),
               ltPropPlaceholder : Lyte.attr("string",{"default" : ''}),
               ltPropAutofocus : Lyte.attr("boolean",{"default" : false}),
               ltPropDisabled : Lyte.attr("boolean",{"default" : false}),
               ltPropMaxlength : Lyte.attr("number",{"default" : 25}),
               ltPropReadonly : Lyte.attr("boolean",{"default" : false}),
               ltPropId : Lyte.attr("string",{"default" : 'inputId'}),
               ltPropClass : Lyte.attr("string",{"default" : ''}),
               ltPropType : Lyte.attr("string",{"default" : 'text'}),
               ltPropName : Lyte.attr("string",{"default" : ''}),
               ltPropWidth : Lyte.attr("string",{"default" : '100%'}),
               ltPropValue : Lyte.attr("string",{"default" : ''}),
               ltPropContent : Lyte.attr("array",{"default" : []}),
               ltPropLabel : Lyte.attr("string",{"default" : ''}),
               ltPropDescription : Lyte.attr("string",{"default" : ''}),
               ltPropAppearance : Lyte.attr("string",{"default" : 'flat'}),
               ltPropDirection : Lyte.attr("string",{"default" : 'vertical'}),
               ltPropExternalSearch : Lyte.attr("boolean",{"default" : false}),
               ltPropYield : Lyte.attr("boolean",{"default" : false}),
               ltPropHeight : Lyte.attr("string",{"default" : ''}),
               ltPropHighlight : Lyte.attr("boolean",{"default" : false}),
               ltPropHighlightClass : Lyte.attr("string",{"default" : 'lyteautocompleteHighlight'}),
               ltPropKeyWords : Lyte.attr("string",{"default" : ''}),
               ltPropMinLength : Lyte.attr('number',{'default' : 1}),
               ltPropErrorClass : Lyte.attr('string',{'default' : 'lyteautocompleteError'}),
               ltPropDropdownWidth : Lyte.attr('string',{'default' : 'auto'}),
               ltPropDropdownHeight : Lyte.attr('string',{'default' : '300px'}),
               ltPropDropdownClass : Lyte.attr('string', {'default' : 'lyteautocompleteDropdown'}),
               ltPropDropdownId : Lyte.attr('string', {'default' : 'lyteAutocomplete'}),
               ltPropMethod : Lyte.attr('string',{'default' : 'contains'}),
               ltPropWrapperStyle : Lyte.attr('string', {'default' : ''}),
               ltPropAjaxRequest : Lyte.attr("object",{"default":{}}),
               ltPropTabIndex : Lyte.attr('string',{default : '0'}),
               ltPropTabindex : Lyte.attr('string',{default : '0'}),
               ltPropFreeze : Lyte.attr('boolean', { default: false}),
               ltPropCallout : Lyte.attr('boolean',{default : false}),
               ltPropShow : Lyte.attr('boolean', { default : false}),
               ltPropDisabled : Lyte.attr('boolean', { default : false}),
               ltPropHover : Lyte.attr('boolean', { default : false}),
               ltPropBoundary : Lyte.attr('object', { default : {}}),
               ltPropPosition : Lyte.attr('string', { default : 'down'}),
               ltPropDropType : Lyte.attr('string', { default : 'default'}),
               ltPropSetPos : Lyte.attr('boolean', { default : false}),
               ltPropPattern : Lyte.attr('string', { default : ".+"}),
               ltPropAutoUpdate : Lyte.attr('boolean', { default : true}),
               ltPropValueSet : Lyte.attr('boolean', { default : true}),
               ltPropPreventInsideClick : Lyte.attr('boolean', { default : false}),
               ltPropExtSearchOpen :Lyte.attr('boolean', { default : false }),
               ltPropInputTitle : Lyte.attr('string', { default : '' }),

               //textarea
               ltPropRows : Lyte.attr("number",{"default" : undefined}),
               ltPropCols : Lyte.attr("number",{"default" : undefined}),
               ltPropTextAreaResize : Lyte.attr("object",{"default" : {vertical : true, horizontal : true}}),

               // system data
               timeout : Lyte.attr("number",{"default" : undefined}),
               optGroup : Lyte.attr("boolean",{"default" : false}),
               autocompleteFlag : Lyte.attr('boolean', {'default' : true})

             }
         },

// to Highlight selected text
     highlightText : function(targerArray, inputValue)
        {
            var regEx = new RegExp('('+inputValue+')','gi');
            var regEx2 = /(?!>)([^><]+)(?=<)/ig;
            for(var i = 0; i < targerArray.length; i++){
                    var autocompleteLabel = $L('lyte-autocomplete-label', targerArray[i]).e[0], span = $L('div.lyteAutoComplete', targerArray[i]).e[0];
                    if(!span){
                      span = document.createElement('div');
                      span.classList.add('lyteAutoComplete');
                      targerArray[i].insertBefore(span, targerArray[i].firstChild);
                    }
                    autocompleteLabel.style.display = 'none';
                    if(autocompleteLabel.children.length){
                             span.innerHTML = this.autoHighlight.call(this, autocompleteLabel, regEx, regEx2);
                      }
                    else{
                          span.innerHTML = autocompleteLabel.textContent.replace(regEx,'<span class ='+this.getData('ltPropHighlightClass')+'>$1</span>');
                    }
            } 
        }, 

      autoHighlight : function(autocompleteLabel,regEx, regEx2){
         return autocompleteLabel.innerHTML.replace(regEx2, function(){
                      return arguments[0].replace(regEx,'<span class ='+this.getData('ltPropHighlightClass')+'>$1</span>')
              }.bind(this));
      }, 

    //showing nd hiding error message
   errorMessage : function(flag){
      var errorDiv =  this.autocompleteComp
      if(flag)
          {
              errorDiv.style.display = 'block';
              if(!errorDiv.style.width){
                errorDiv.style.width = window.getComputedStyle(this.$node).getPropertyValue('width')
              }
          }
      else
          {
              errorDiv.style.display = 'none'
              errorDiv.innerHTML = ''
          }
    },

    actions : {
        resetValue : function( evt ) {
          // event.stopPropagation();
          this.$node.setValue( '' );
        },

        "clickThrow":function(event){
                if(this.getData('ltPropMinLength') == 0)
                      {
                         // this.allow = true;
                         if(!this.getData('ltPropExternalSearch')){
                              setTimeout(this.pressFunc.bind(this), 0 ,this.input.value, {})
                          }else{
                            setTimeout(function(){
                              if(this.getMethods('onExtSearch')){
                                    this.executeMethod('onExtSearch', this.input.value, this.$node);
                                }
                            }.bind(this), 0)
                          }
                      } else { 
                         event.stopPropagation();
                      }            
           },
          //filtering process  checks
        "keyup":function(event){
              if(event.keyCode == 37 || event.keyCode == 13 || event.keyCode == 38 || event.keyCode == 39 || event.keyCode == 40 || event.keyCode == 91 || event.keyCode == 27 || event.keyCode == 16 || event.keyCode == 18){
                return
              }
              var val = this.input.value;
               if( this.getData('timeout') != undefined ){ 
                      clearTimeout(this.getData('timeout'))
                }
              if((val.length >= this.getData('ltPropMinLength')|| event.keyCode == 8) && event.keyCode != 13)
                  {   
                         this.setData('timeout', setTimeout(function(){  
                             this.pressFunc.call(this, val, event)
                           }.bind(this),100))
                  }    
            }  
    },

     methods : {
             // when dropdown value selected  
        "valSet":function( event,selectedVal ){
                  var targetElem = (event||window.event).target
                  while(targetElem.tagName != 'LYTE-DROP-ITEM' && targetElem.tagName != "BODY"){
                      targetElem = targetElem.parentElement
                    }
                   if(targetElem.tagName == 'LYTE-DROP-ITEM'){
                        var autocompleteLabel = $L('lyte-autocomplete-label', targetElem).e[0]
                        selectedVal = autocompleteLabel.textContent
                      } 
                  if(selectedVal){
                        if( this.getData( 'ltPropValueSet' ) ) {
                          this.input.value = selectedVal
                        }
                        var ltPropContent = this.getData('ltPropContent');
                        if(this.getMethods('onSelect')){
                              var value;
                              if(this.getData('ltPropYield')){
                                    value = targetElem.getAttribute('data-value')
                                  }
                              else{
                                    var ltPropContent = this.getData('ltPropContent')
                                    var childrens = this.arrayFrom.call(this, $L('lyte-drop-body', $L('lyte-dropdown', this.$node).e[0].component.childComp).e[0].children);
                                    for(var i = 0; i < childrens.length; i++){
                                           if(['LYTE-DROP-GROUP', 'LYTE-DROP-ITEM'].indexOf(childrens[i].tagName) == -1){
                                                  Lyte.arrayUtils(childrens, 'removeAt', i);
                                                  i--;
                                              }
                                        }
                                     if(targetElem.parentElement.tagName == 'LYTE-DROP-GROUP'){
                                             var grp = ltPropContent[childrens.indexOf(targetElem.parentElement)];
                                             value = grp[Object.keys(grp)[0]][this.arrayFrom.call(this, $L('lyte-drop-item', targetElem.parentElement).e).indexOf(targetElem)];
                                      }
                                      else{
                                            value = ltPropContent[childrens.indexOf(targetElem)];
                                      }    
                                  }   
                               this.executeMethod('onSelect', value, event, this.$node)
                            }
                      }          
            },
           show :  function(){
              if(this.getMethods('onShow')){
                this.executeMethod('onShow', arguments[0], arguments[1])
              } 
           },
           hide :  function(){
              if(this.getMethods('onHide')){
                this.executeMethod('onHide', arguments[0], arguments[1])
              } 
           },
           beforeShow :  function(){
              if(this.getMethods('onBeforeShow')){
                return this.executeMethod('onBeforeShow', arguments[0], arguments[1])
              } 
           },
           beforeHide :  function(){
              if( this.getData( 'ltPropPreventInsideClick' ) && arguments[0] && arguments[0].keyCode != 27 ) {
                 if( this.$node.contains(arguments[0].target) ) {
                    return false
                 }
              }
              if(this.getMethods('onBeforeHide')){
                return this.executeMethod('onBeforeHide', arguments[0], arguments[1])
              } 
           },
           add : function(){
              if(this.getMethods('onAdd')){
                this.executeMethod('onAdd', arguments[0], arguments[1], arguments[2], arguments[3])
              }
           },
           remove : function(){
              if(this.getMethods('onRemove')){
                this.executeMethod('onRemove', arguments[0], arguments[1], arguments[2], arguments[3])
              }
           },
           positionChanged : function(){
              if(this.getMethods('onPositionChanged')){
                this.executeMethod('onPositionChanged', arguments[0], arguments[1])
              }
           },
           scroll : function(){
              if(this.getMethods('onScroll')){
                this.executeMethod('onScroll', arguments[0], arguments[1]);
              }
           },
          valuechange : function(arg1){
            if(this.getMethods('onValueChange')){
                 this.executeMethod('onValueChange', arg1, this.$node);
              }
          }

        },
        filteringArray : function(searchList, targetList, val, event){
             var flag, method = this.getData('ltPropMethod'), visibleList = [];
             if(val.length)
                {
                   for(var i = 0; i < searchList.length; i++)
                     {
                          switch(method)
                            {
                              case 'contains' : {
                                  if(searchList[i].trim().toLowerCase().indexOf(val.toLowerCase()) >= 0)
                                      {
                                          visibleList.push(targetList[i]);
                                      }
                                  break;    
                               }
                               case 'startsWith' : {
                                    if(searchList[i].trim().toLowerCase().startsWith(val.toLowerCase()))
                                        {
                                          visibleList.push(targetList[i]);
                                       }
                                    break;
                               }
                               case 'endsWith' : {
                                    if(searchList[i].trim().toLowerCase().endsWith(val.toLowerCase()))
                                        {
                                            visibleList.push(targetList[i]);
                                       }
                                    break;
                               }
                            }  
                      }
                }
             else
                {
                   visibleList = targetList;
                }
             if(this.getMethods('onSearch'))   
                {
                  flag = this.executeMethod('onSearch',visibleList,this.autocompleteComp, this.$node, val, event);
                }
             if(flag != false)
                {
                  for(var i = 0; i < searchList.length; i++)
                     {  
                        switch(method)
                          {
                            case 'contains' : {
                                if(searchList[i].trim().toLowerCase().indexOf(val.toLowerCase()) < 0)
                                    {
                                       targetList[i].classList.add('lyteSearchHidden')
                                    }
                                  else
                                    {
                                       targetList[i].classList.remove('lyteSearchHidden')
                                    }  
                                break;    
                             }
                             case 'startsWith' : {
                                  if(!searchList[i].trim().toLowerCase().startsWith(val.toLowerCase()))
                                      {
                                          targetList[i].classList.add('lyteSearchHidden')
                                      }
                                     else
                                      {
                                         targetList[i].classList.remove('lyteSearchHidden')
                                      }  
                                  break;
                             }
                             case 'endsWith' : {
                                  if(!searchList[i].trim().toLowerCase().endsWith(val.toLowerCase()))
                                      {
                                          targetList[i].classList.add('lyteSearchHidden')
                                      }
                                    else
                                     {
                                        targetList[i].classList.remove('lyteSearchHidden')
                                     }  
                                  break;
                             }
                          }      
                     }
                    this.optGroupHide.call(this)
                    this.errorMessage.call(this, !visibleList.length) 
                   if(visibleList.length && this.getData('ltPropHighlight'))  
                      {
                          this.highlightText.call(this, targetList, val)
                      }   
                } 
        },  
        // hiding category
        optGroupHide : function(){
              var categories = $L('lyte-drop-group', this.dropbody).e
              for(var i = 0; i < categories.length; i++){
                    if($L('lyte-drop-item.lyteSearchHidden', categories[i]).e.length == $L('lyte-drop-item', categories[i]).e.length){
                            categories[i].style.display = 'none'
                    }else{
                        categories[i].style.display = 'block'
                    }   
                  }
        },
        contentFiltering : function(val, event){
              var dropdown = this.dropdown, content = [], target = [];
               var lyteDropdownContainer =  this.dropbody;
               if((lyteDropdownContainer.classList.contains('lyteDropdownHidden') && val.length >= this.getData('ltPropMinLength'))|| (!lyteDropdownContainer.classList.contains('lyteDropdownHidden') && val.length < this.getData('ltPropMinLength')))
                    {
                        // this.allow = true;
                        dropdown.toggle()
                        // delete this.allow;
                        if(lyteDropdownContainer.classList.contains('lyteDropdownHidden')){
                          return;
                        }
                    }
               var target = $L('lyte-drop-item:not(.lyteDropdownActive)', lyteDropdownContainer).e
               for(var k = 0; k < target.length; k++)
                  {
                      var autocompleteLabel = $L('lyte-autocomplete-label', target[k]).e[0]
                      var keyword = autocompleteLabel.getAttribute('keywords')
                      if(keyword)
                         {
                            try
                               {
                                 keyword = JSON.parse(keyword).join(' ')
                               }
                             catch(err){
                             } 
                         }
                      content.push(keyword ? keyword : autocompleteLabel.textContent.trim())
                  }
               this.filteringArray.call(this, content, target, val, event)
               dropdown.component.setAlignment.call(dropdown.component)
        },
        // filtering process  
        pressFunc : function ( val, event){
            if(!this.getData('ltPropExternalSearch') && Lyte.Component.registeredHelpers.lyteUiIsEmptyObject(this.getData("ltPropAjaxRequest")))
                {
                    this.contentFiltering.call(this, val, event)
                }
              else
                 {
                    if(val.length >= this.getData('ltPropMinLength') || !event.target)
                        {
                            if(!Lyte.Component.registeredHelpers.lyteUiIsEmptyObject(this.getData('ltPropAjaxRequest')))
                              {
                                  var request = this.getData('ltPropAjaxRequest');
                                  var xhttp = new XMLHttpRequest();
                                  var method = request.method;
                                  var param = request.param ? request.param + '=' + val : null;
                                  var reqHeader = request.header && request.header.name ? request.header.name : "Content-type";
                                  var reqHeaderVal = request.header && request.header.value ? request.header.value : "application/x-www-form-urlencoded";
                                  var comp = this;
                                  xhttp.onreadystatechange = function(){
                                    if(this.readyState == 4 && this.status == 200)
                                      {
                                        if(this.responseText)
                                            {
                                              x = JSON.parse(this.responseText)[comp.getData('ltPropAjaxRequest').key];
                                              if(!x)
                                                {
                                                  x = [];
                                                }
                                              comp.setData('ltPropContent',x);
                                              if(comp.getMethods('onSuccess')){
                                                comp.executeMethod('onSuccess',this.response,comp,this,arguments);
                                              }
                                            }
                                      }
                                  };
                                  var addParams  = request.additionalParams || {};
                                  var str = '';
                                  var x = 0;
                                  for(var i in addParams){
                                    if(x == 0){
                                      str = i + "=" + addParams[i];
                                    }
                                    else{
                                      str += '&' + i + "=" + addParams[i];
                                    }
                                    x++;
                                  }
                                  if(param){
                                    if(str){
                                      param += '&' + str;
                                    }
                                  }
                                  else{
                                    if(str){
                                      param = str;
                                    }
                                  }
                                  if(method === "GET" && param){
                                    xhttp.open("GET", request.url+'?'+param, true);
                                    param = null;
                                  }
                                  else{
                                    xhttp.open(method, request.url, true);
                                  }
                                  xhttp.setRequestHeader(reqHeader, reqHeaderVal);
                                  xhttp.send(param);
                              }
                          else
                              {
                                if(this.dropbody.classList.contains('lyteDropdownHidden') && this.getData( 'ltPropExtSearchOpen' )){
                                      // this.allow = true;
                                      this.dropdown.toggle()
                                      // delete this.allow;
                                      if(this.dropbody.classList.contains('lyteDropdownHidden')){
                                        return;
                                      }
                                  }
                                 if(this.getMethods('onExtSearch')){
                                      this.executeMethod('onExtSearch',val, this.$node, event);
                                  }
                              }
                      }
                     else
                        {
                          if(!this.dropbody.classList.contains('lyteDropdownHidden')){
                              this.dropdown.toggle();
                            }
                        } 

                  }   
        },
        someServerWork : function(data,val){
          var list = [];
          for(var i = 0; i<data.length; i++){
            if(data[i].indexOf(val+"") > -1){
              list.push(data[i]);
            }
          }
          return list;
        }  
  });