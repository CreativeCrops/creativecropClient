Lyte.Component.register("lyte-search",{
_template:"<template tag-name=\"lyte-search\">    <lyte-input lt-prop-auto-update=\"{{ltPropAutoUpdate}}\" lt-prop-tab-index=\"{{ltPropTabIndex}}\" lt-prop-id=\"{{ltPropId}}\" lt-prop-wrapper-style=\"{{ltPropWrapperStyle}}\" lt-prop-class=\"{{ltPropClass}}\" lt-prop-autofocus=\"{{ltPropAutofocus}}\" lt-prop-autocomplete=\"{{ltPropAutocomplete}}\" lt-prop-type=\"{{ltPropType}}\" lt-prop-name=\"{{ltPropName}}\" lt-prop-placeholder=\"{{ltPropPlaceholder}}\" lt-prop-width=\"{{ltPropWidth}}\" lt-prop-height=\"{{ltPropHeight}}\" onkeyup=\"{{action('keyup', event, this)}}\" lt-prop-style=\"{{ltPropStyle}}\" lt-prop-value=\"{{lbind(ltPropValue)}}\" onkeypress=\"{{action('keypress', event, this)}}\" lt-prop-appearance=\"{{ltPropAppearance}}\" lt-prop-direction=\"{{ltPropDirection}}\" lt-prop-disabled=\"{{ltPropDisabled}}\" lt-prop-readonly=\"{{ltPropReadonly}}\" on-value-change=\"{{method('valuechange')}}\" lt-prop-input-title=\"{{ltPropInputTitle}}\" lt-prop-pattern=\"{{ltPropPattern}}\"></lyte-input></template>",
_dynamicNodes : [{"type":"attr","position":[1]},{"type":"componentDynamic","position":[1]}],
_observedAttributes :["ltPropAutocomplete","ltPropPlaceholder","ltPropAutofocus","ltPropDisabled","ltPropStyle","ltPropMaxlength","ltPropReadonly","ltPropId","ltPropClass","ltPropType","ltPropName","ltPropWidth","ltPropHeight","ltPropValue","ltPropAppearance","ltPropDirection","ltPropQuerySelector","ltPropMinLength","ltPropMethod","ltPropWrapperStyle","ltPropTabIndex","ltPropAjaxRequest","ltPropAutoUpdate","ltPropPattern","ltPropInputTitle","timeout"],
   init : function(){
        if(this.getMethods('beforeRender'))
            {
                this.executeMethod('beforeRender', this.$node);
            }
        this.$node.focus = function(){
              this.$node.querySelector( 'input' ).focus();
        }.bind( this )      
      },
     didConnect : function(){
        this.$node.setValue = function(value){
              $L('lyte-input',this.$node).e[0].ltProp({'value' : value});
              this.pressFunc.call(this, value != undefined ? value : '', {})
        }.bind(this);
        if(this.getMethods('afterRender'))
            {
                this.executeMethod('afterRender', this.$node);
            }
     },

     data : function (){
      //user data
            return {
               ltPropAutocomplete : Lyte.attr("string",{"default" : 'off'}),
               ltPropPlaceholder : Lyte.attr("string",{"default" : ''}),
               ltPropAutofocus : Lyte.attr("boolean",{"default" : false}),
               ltPropDisabled : Lyte.attr("boolean",{"default" : false}),
               ltPropStyle : Lyte.attr("string",{"default" : ''}),
               ltPropMaxlength : Lyte.attr("number",{"default" : 25}),
               ltPropReadonly : Lyte.attr("boolean",{"default" : false}),
               ltPropId : Lyte.attr("string",{"default" : 'inputId'}),
               ltPropClass : Lyte.attr("string",{"default" : ''}),
               ltPropType : Lyte.attr("string",{"default" : 'search'}),
               ltPropName : Lyte.attr("string",{"default" : ''}),
               ltPropWidth : Lyte.attr("string",{"default" : '100%'}),
               ltPropHeight  : Lyte.attr("string",{"default" : ''}),
               ltPropValue : Lyte.attr("string",{"default" : ''}),
               ltPropAppearance : Lyte.attr("string",{"default" : 'flat'}),
               ltPropDirection : Lyte.attr("string",{"default" : 'vertical'}),
               ltPropQuerySelector : Lyte.attr("object",{"default" : {}}),
               ltPropMinLength : Lyte.attr('number',{'default' : 1}),
               ltPropMethod : Lyte.attr('string',{'default' : 'contains'}),
               ltPropWrapperStyle : Lyte.attr('string', {'default' : ''}),
               ltPropTabIndex : Lyte.attr('string',{default : '0'}),
               ltPropAjaxRequest : Lyte.attr("object",{"default":{}}),
               ltPropAutoUpdate : Lyte.attr('boolean', { default : true}),
               ltPropPattern : Lyte.attr('string', { default : '.+'}),
               ltPropInputTitle : Lyte.attr('string', { default : '' }),

               //system data
               timeout : Lyte.attr("number",{"default" : undefined}),

             }
         },

      methods : {

        valuechange : function(arg1){
            if(this.getMethods('onValueChange')){
               this.executeMethod('onValueChange', arg1, this.$node);
            }
        }
      },   

       arrayFrom : function(nodeList){
              var arrayList = [];
              for(var i = 0; i < nodeList.length; i++)
                {
                  arrayList.push(nodeList[i]);
                }
              return arrayList.slice(); 
             },  

// Function for finding textContents when data were not properly given for DOM search
      searchList : function(nodeName){
              var searchList=[];
              var target=[];
              query=this.getData('ltPropQuerySelector')
              if(typeof query =="string")
                  {
                      query=JSON.parse(query);
                  }
              for(var i=0;i<nodeName.childElementCount;i++)
                {
                  while(nodeName.children[i].childElementCount)
                     {
                        returnedVal=this.searchList.call(this,nodeName.children[i]);
                        searchList=searchList.concat(returnedVal[0]);
                        target=target.concat(returnedVal[1]);
                        break;
                     }
                  if(!nodeName.children[i].childElementCount) 
                      {
                        searchList.push(nodeName.children[i].textContent);
                        if(query.target)
                          {
                            var scope = typeof query.scope == 'string' ? ((/^#/g.test(query.scope.trim()) && !/\s/g.test(query.scope.trim())) ? $L(query.scope).e : $L(query.scope).e[0]) : query.scope
                            targetList=$L(query.target, scope).e;
                            node=nodeName.children[i];
                            while(node != scope)
                              {
                                var flag=false;
                                for(var j=0;j<targetList.length;j++)
                                  {
                                      if(node==targetList[j])
                                         {
                                            target.push(node);
                                            flag=true;
                                            break;
                                         }
                                  }
                                if(flag)
                                    {
                                        break;
                                    }
                                 else
                                   {
                                      node=node.parentElement;
                                   }
                              }
                          }
                        else
                          {
                            target.push(nodeName.children[i]);
                          }
                    }
                }
              return [searchList,target];
         },

     actions : {
         "keypress":function(event){             
               var keyCode = event.keyCode    
               if(!(keyCode >= 37 && keyCode <= 40) && keyCode != 13)  
                    {
                      event.stopPropagation() 
                    }  
            },
        //filtering process  checks
        "keyup":function(event, lyteInput){
              if([37,13,38,39,40,91,27,16,18].indexOf(event.keyCode) > -1){ 
                return
              }
              if(this.getData('timeout') != undefined)
                { 
                    clearTimeout(this.getData('timeout'))
                }
              var val = $L('input', this.$node).e[0].value;
              if(val.length >= this.getData('ltPropMinLength') || event.keyCode == 8)
                  {
                         this.setData('timeout', setTimeout(function(){  
                             this.pressFunc.call(this, val, event)
                           }.bind(this, event),100))
                  }    
            }
          },
        filteringArray : function(searchList, targetList, val, searchComp, evt){
            var flag, method = this.getData('ltPropMethod'), visibleList = [], hiddenList = [];
             if(val.length)
                {
                   for(var i = 0; i < searchList.length; i++)
                     {
                        switch(method)
                          {
                            case 'contains' : {
                                if(searchList[i].trim().toLowerCase().indexOf(val.toLowerCase()) >= 0)
                                    {
                                        visibleList.push(searchComp[i]);
                                    } else {
                                      hiddenList.push(searchComp[i])
                                    }
                                break;    
                             }
                             case 'startsWith' : {
                                  if(searchList[i].trim().toLowerCase().startsWith(val.toLowerCase()))
                                      {
                                        visibleList.push(searchComp[i]);
                                     }  else {
                                      hiddenList.push(searchComp[i])
                                    }
                                  break;
                             }
                             case 'endsWith' : {
                                  if(searchList[i].trim().toLowerCase().endsWith(val.toLowerCase()))
                                      {
                                          visibleList.push(searchComp[i]);
                                     }  else {
                                      hiddenList.push(searchComp[i])
                                    }
                                  break;
                             }
                          }  
                      }
                }
             else
                {
                   visibleList = searchComp;
                }
              if(this.getMethods('onSearch'))
                {
                  flag = this.executeMethod('onSearch',visibleList, this.$node, evt, val, hiddenList)
                }
              if(flag != false)
                {
                  var lyteSearchHidden = this.getData('ltPropHideClass')
                  $L.fastdom.mutate(function(){
                    // mismatched elements are hided here
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
                  }.bind(this)) 
                }   
        },  
        pressFunc : function (val, evt){ 
                  var retVal;
                  if(this.getMethods("onBeforeSearch"))
                      { 
                         retVal = this.executeMethod('onBeforeSearch', evt, this);
                      }  
                   if(retVal != false)   
                    {
                       var content = [], searchList = [], target = [], query = this.getData('ltPropQuerySelector');
                       var scope = typeof query.scope == 'string' ? ( (/^#/g.test(query.scope.trim()) && !/\s/g.test(query.scope.trim())) ? $L(query.scope).e : $L(query.scope).e[0]) : query.scope;
                       if(query.search)
                          {
                            (/^#/g.test(query.search.trim()) && !/\s/g.test(query.search.trim())) ? searchList.push($L(query.search, scope).e) : searchList = searchList.concat(this.arrayFrom.call(this, $L(query.search, scope).e));
                          }
                       query.target ? ((/^#/g.test(query.target.trim()) && !/\s/g.test(query.target.trim())) ? target.push($L(query.target, scope).e) : target = target.concat(this.arrayFrom.call(this, $L(query.target, scope).e))) : (target = target.concat(searchList.slice()));  
                       if(!query.search)
                          {
                              returnedVal=this.searchList.call(this,scope);
                              content = returnedVal[0];
                              target = returnedVal[1];
                              searchList = target.slice();
                          }
                        else
                          {
                            for(var j=0;j<searchList.length;j++)
                             {
                                content[j]=searchList[j].textContent;
                             }
                          }
                      this.filteringArray.call(this, content, target, val, searchList, evt) 
                      this._prevVal = val; 
                }   
        }  
  });
