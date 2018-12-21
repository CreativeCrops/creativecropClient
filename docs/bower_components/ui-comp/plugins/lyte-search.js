(function(){
    if($L){
        $L.prototype.search = function(data){
            data = data ? data : {};
            if(!data.scope)
                {
                    console.error('scope is not given');
                    return;
                }
            var scope = typeof data.scope == 'string' ? ((/^#/g.test(data.scope.trim()) && !/\s/g.test(data.scope.trim()))? $L(data.scope).e : $L(data.scope).e[0]) : data.scope, timeout;    
            var element = this.e.length == undefined ? this.e : this.e[0];
            var searchList = [], targetList = [], searchComp = [];
            element._searchPluginData = data;

            element.setValue = function(value){
                element = this
                value = value != undefined ? value : '';
                element.tagName == 'LYTE-INPUT' ? element.ltProp({'value' : value}) : element.value = value;
                var evt = new Event('keyup');
                evt.keyCode = 8;
                element.dispatchEvent(evt);
            }

            var arrayFrom = function(nodeList){
              var arrayList = [];
              for(var i = 0; i < nodeList.length; i++)
                {
                  arrayList.push(nodeList[i]);
                }
              return arrayList.slice(); 
             };

            var pressFunc = function(event){
                var element = this
                var data = this._searchPluginData;
                var ret = findingList.call(this,event); 
                var searchList = ret[0]; 
                var targetList = ret[1];
                var searchComp = ret[2]; 
                var minLength = data.minLength ? data.minLength : 0;
                var method = data.method ? data.method : 'contains';
                var val = (element.tagName == 'LYTE-INPUT' ? $L('input', element).e[0].value : element.value);
                var visibleList = [], flag; 
                if(val.length >= minLength || event.keyCode == 8)
                  { 
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
                                            }
                                        break;    
                                     }
                                     case 'startsWith' : {
                                          if(searchList[i].trim().toLowerCase().startsWith(val.toLowerCase()))
                                              {
                                                visibleList.push(searchComp[i]);
                                             }
                                          break;
                                     }
                                     case 'endsWith' : {
                                          if(searchList[i].trim().toLowerCase().endsWith(val.toLowerCase()))
                                              {
                                                  visibleList.push(searchComp[i]);
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
                    if(data.hasOwnProperty('onSearch'))
                        {
                          flag = data.onSearch(visibleList);
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
                        }    
                }                 
            };

        var searchListFind = function(nodeName){
              var searchList = [];
              var target = [];
              for(var i = 0; i < nodeName.childElementCount; i++)
                {
                  while(nodeName.children[i].childElementCount)
                     {
                        returnedVal = searchListFind(nodeName.children[i]);
                        searchList = searchList.concat(returnedVal[0]);
                        target = target.concat(returnedVal[1]);
                        break;
                     }
                  if(!nodeName.children[i].childElementCount) 
                      {
                        searchList.push(nodeName.children[i].textContent);
                        target.push(nodeName.children[i]);
                      }
                }
              return [searchList,target];
         };

      var findingList = function(){
            var data = this._searchPluginData;
            var scope = typeof data.scope == 'string' ? document.querySelector(data.scope) : data.scope;
            var searchList = [], targetList = [], searchComp = [];
            if(data.search)   
                {
                    (/^#/g.test(data.search.trim()) && !/\s/g.test(data.search.trim())) ? searchComp.push($L(data.search, scope).e) : searchComp = searchComp.concat(arrayFrom($L(data.search, scope).e));
                    var target = data.target ? data.target : data.search;
                    for(var j = 0; j < searchComp.length; j++){
                        searchList.push(searchComp[j].textContent)
                    }
                    (/^#/g.test(target.trim()) && !/\s/g.test(target.trim())) ? targetList.push($L(target, scope).e) : targetList = targetList.concat(arrayFrom($L(target, scope).e));
                }
            else
                {
                    var callSearchList = searchListFind(scope)
                    searchList = callSearchList[0];
                    targetList = callSearchList[1];
                    searchComp = targetList.slice();
                } 
              return [searchList, targetList, searchComp];  
          };

        element.addEventListener('keyup', function(event){
                       if([37,13,38,39,40,91,27,16,18].indexOf(event.keyCode) > -1){ 
                        return
                      }
                      var element = this;
                      var data = element._searchPluginData;
                      clearTimeout(timeout);
                      timeout = setTimeout(function(){ 
                         pressFunc.call(this,event);
                       }.bind(this),100)
                    });           

        }

    }
})();
