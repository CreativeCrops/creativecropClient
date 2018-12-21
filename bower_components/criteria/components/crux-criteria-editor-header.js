Lyte.Component.register("crux-criteria-editor-header",{_template:'<template tag-name="crux-criteria-editor-header"><div class="header"><lyte-th style="opacity:1;">       \t\t\t\t<div class="patternNumDiv" style="height: auto; opacity: 1; overflow: visible;">       \t\t\t\t\t<template is="if" value="{{ifNotEquals(criteriaIndex,1)}}"><template case="true">\t\t       \t\t\t\t<div class="andOr" style="opacity: 1; height: auto;">\t\t       \t\t\t\t\t<lyte-input lt-prop-style="color:blue;cursor:pointer; transform:scale(0.75)" lt-prop-readonly="true" lt-prop-value="{{andOrCondition}}" onclick="{{action(\'changeAndOr\')}}"></lyte-input>\t\t       \t\t\t\t</div>\t       \t\t\t\t</template></template>               \t\t\t<input type="hidden" id="match" value="">               \t\t\t<input type="text" id="patternNum" class="patterNum" value="{{criteriaIndex}}" readonly="">               \t\t</div>                </lyte-th>                <lyte-th>       \t\t\t\t<div class="patternNumDiv" style="height: auto; opacity: 1; overflow: visible;">\t\t\t\t\t\t<div class="dropdownDiv">\t\t\t\t\t\t\t<lyte-dropdown class="gBB fields" lt-prop-yield="true" lt-prop-tabindex="1" on-option-selected="{{method(\'changeField\')}}" on-show="{{method(\'onFieldDropdownShow\')}}">\t\t\t\t\t\t\t\t<template is="registerYield" yield-name="yield">\t\t\t\t\t\t\t\t\t<lyte-drop-box>\t\t\t\t\t\t\t\t\t\t<template is="if" value="{{expHandlers(fields.length,\'>\',9)}}"><template case="true">\t\t\t\t\t\t\t\t\t\t\t<lyte-drop-header>\t\t\t\t\t\t\t\t \t\t\t\t<lyte-search id="fieldSearchBox" onfocus="{{action(\'onFocusFieldSearch\', event, this)}}" onfocusout="{{action(\'onFocusOutFieldSearch\', event, this)}}" class="fieldSearchStyle{{criteriaIndex}}" lt-prop-style="padding-left:8px" lt-prop-placeholder="{{cruxGetI18n(\'crm.globalsearch.search.title\')}}" lt-prop-query-selector="{&quot;scope&quot;:&quot;.lyteFieldsDropbody{{criteriaIndex}}&quot;,&quot;search&quot;:&quot;lyte-drop-item:not(.prevent)&quot;, &quot;target&quot; : &quot;lyte-drop-item:not(.prevent)&quot;}" style="width:100%" on-search="{{method(&quot;onFieldSearch&quot;)}}" lt-prop-appearance="box"> \t\t\t\t\t\t\t\t\t\t\t\t</lyte-search> \t\t\t\t\t\t\t\t\t\t\t</lyte-drop-header>\t\t\t\t\t\t\t\t\t\t</template></template>\t\t\t\t\t\t\t\t\t\t<lyte-drop-body class="lyteFieldsDropbody{{criteriaIndex}}">\t\t\t\t\t\t\t\t\t\t\t<lyte-drop-item class="selector{{criteriaIndex}}" data-value="-1" id="none" value="{{cruxGetI18n(\'None\')}}">\t\t\t\t\t\t\t\t\t\t\t<span class="{{if(ifEquals(criteriaArray.api_name,cruxGetI18n(\'None\')),\'selectedTick\',\'\')}}"></span>\t\t\t\t\t\t\t\t\t\t\t{{cruxGetI18n(\'None\')}}\t\t\t\t\t\t\t\t\t\t\t</lyte-drop-item>\t\t\t\t\t\t\t\t\t\t\t<template is="for" items="{{fields}}" item="item" index="index">\t\t\t\t\t\t\t\t\t\t\t\t<lyte-drop-item class="selector{{criteriaIndex}}" data-value="{{index}}" id="{{item.data_type}}" value="{{module}}.{{item.api_name}}">\t\t\t\t\t\t\t\t\t\t\t\t<span class="{{if(ifEquals(criteriaArray.api_name,concat(module,\'.\',item.api_name)),\'selectedTick\',\'\')}}"></span>\t\t\t\t\t\t\t\t\t\t\t    {{item.field_label}}\t\t\t\t\t\t\t\t\t\t\t\t</lyte-drop-item>\t\t\t\t\t\t\t\t\t\t\t</template>\t\t\t\t\t\t\t\t\t\t\t<template is="if" value="{{emptyFieldShow}}"><template case="true">\t\t\t\t\t\t\t\t\t\t\t\t<lyte-drop-item class="prevent">{{ cruxGetI18n("crm.label.no.options.found") }}</lyte-drop-item>\t\t\t\t\t\t\t\t\t\t\t</template></template>\t\t\t\t\t\t\t\t\t\t</lyte-drop-body>\t\t\t\t\t\t\t\t\t</lyte-drop-box>\t\t\t\t\t\t\t\t</template>\t\t\t\t\t\t\t</lyte-dropdown>\t\t\t\t\t\t</div>\t\t\t\t\t</div>              </lyte-th>                <lyte-th>       \t\t\t\t<div class="patternNumDiv" style="height: auto; opacity: 1; overflow: visible;">               \t\t<div class="dropdownDiv shown" id="nonecondition">                  \t\t\t<lyte-dropdown class="gBB" lt-prop-yield="true" lt-prop-tabindex="1" id="textcondition" lt-prop-disabled="true" on-option-selected="{{method(\'changeCondition\')}}">\t\t\t\t\t\t\t<template is="registerYield" yield-name="yield">\t\t\t\t\t\t\t\t<lyte-drop-box>\t\t\t\t\t\t\t\t\t<lyte-drop-body>\t\t\t\t\t\t\t\t\t\t<lyte-drop-item data-value="0" value="none">{{cruxGetI18n("None")}}\t\t\t\t\t\t\t\t\t\t</lyte-drop-item>\t\t\t\t\t\t\t\t\t</lyte-drop-body>\t\t\t\t\t\t\t\t</lyte-drop-box>\t\t\t\t\t\t\t</template>\t\t\t\t\t\t</lyte-dropdown>                  \t\t</div>                  \t\t<div class="dropdownDiv hiden" id="conditionDiv">                  \t\t\t<lyte-dropdown class="gBB" lt-prop-yield="true" lt-prop-tabindex="1" id="textcondition" on-option-selected="{{method(\'changeCondition\')}}" on-show="{{method(\'onConditionDropdownShow\')}}">\t\t\t\t\t\t\t<template is="registerYield" yield-name="yield">\t\t\t\t\t\t\t\t<lyte-drop-box>\t\t\t\t\t\t\t\t\t<template is="if" value="{{expHandlers(condArray.length,\'>\',9)}}"><template case="true">\t\t\t\t\t\t\t\t\t\t\t<lyte-drop-header>\t\t\t\t\t\t\t\t \t\t\t\t<lyte-search id="conditionSearchBox" onfocus="{{action(\'onFocusFieldSearch\', event, this)}}" onfocusout="{{action(\'onFocusOutFieldSearch\', event, this)}}" class="conditionSearchStyle{{criteriaIndex}}" lt-prop-style="padding-left:8px" lt-prop-placeholder="{{cruxGetI18n(\'crm.globalsearch.search.title\')}}" lt-prop-query-selector="{&quot;scope&quot;:&quot;.lyteConditionDropbody{{criteriaIndex}}&quot;,&quot;search&quot;:&quot;lyte-drop-item:not(.prevent)&quot;, &quot;target&quot; : &quot;lyte-drop-item:not(.prevent)&quot;}" style="width:100%" on-search="{{method(&quot;onConditionSearch&quot;)}}" lt-prop-appearance="box"> \t\t\t\t\t\t\t\t\t\t\t\t</lyte-search> \t\t\t\t\t\t\t\t\t\t\t</lyte-drop-header>\t\t\t\t\t\t\t\t\t\t</template></template>\t\t\t\t\t\t\t\t\t<lyte-drop-body class="lyteConditionDropbody{{criteriaIndex}}">\t\t\t\t\t\t\t\t\t\t<template is="for" items="{{condArray}}" item="item" index="index">\t\t\t\t\t\t\t\t\t\t<lyte-drop-item data-value="{{index}}" value="{{item.system}}">\t\t\t\t\t\t\t\t\t\t\t<span class="{{if(ifEquals(criteriaArray.comparator,item.system)),\'selectedTick\',\'\')}}"></span>\t\t\t\t\t\t\t\t\t\t\t{{item.display}}\t\t\t\t\t\t\t\t\t\t</lyte-drop-item>\t\t\t\t\t\t\t\t\t\t</template>\t\t\t\t\t\t\t\t\t\t<template is="if" value="{{emptyConditionShow}}"><template case="true">\t\t\t\t\t\t\t\t\t\t\t\t<lyte-drop-item class="prevent">{{ cruxGetI18n("crm.label.no.options.found") }}</lyte-drop-item>\t\t\t\t\t\t\t\t\t\t\t</template></template>\t\t\t\t\t\t\t\t\t</lyte-drop-body>\t\t\t\t\t\t\t\t</lyte-drop-box>\t\t\t\t\t\t\t</template>\t\t\t\t\t\t</lyte-dropdown>                  \t\t</div>                  \t</div>                </lyte-th>                <lyte-th>            \t\t<div id="searchval_div" class="pR">        \t\t\t\t<div class="w400 textInput hiden">        \t\t\t\t\t<crux-text-component cx-prop-from="criteria"></crux-text-component>        \t\t\t\t</div>        \t\t\t\t<div class="w400 numInput hiden">        \t\t\t\t\t<crux-number-component cx-prop-from="criteria"></crux-number-component>        \t\t\t\t</div>        \t\t\t\t<div class="w400 disabledText shown">        \t\t\t\t\t<lyte-input class="gBB disabledText" lt-prop-type="text" lt-prop-disabled="true"> </lyte-input>        \t\t\t\t</div>        \t\t\t\t<div class="w400 selectUsers hiden">        \t\t\t\t\t<crux-user-dropdown></crux-user-dropdown>        \t\t\t\t</div>        \t\t\t\t<div class="w400 tagPickList hiden">        \t\t\t\t\t<crux-tag-component cx-prop-from="criteria"></crux-tag-component>        \t\t\t\t</div>        \t\t\t\t<div class="w400 layoutPickList hiden">        \t\t\t\t\t<crux-layout-component cx-prop-from="criteria"></crux-layout-component>        \t\t\t\t</div>        \t\t\t\t<div class="w400 pickList hiden">        \t\t\t\t\t<crux-picklist-component cx-prop-from="criteria" cx-prop-field="{{selectedField}}"></crux-picklist-component>        \t\t\t\t</div>        \t\t\t\t<div class="w400 ageInDays dropdownDiv hiden">        \t\t\t\t\t<lyte-th style="width:25%">\t                \t\t\t<lyte-dropdown on-option-selected="{{method(\'changeAgeInDaysCondition\')}}" class="gBB" lt-prop-yield="true" lt-prop-tabindex="1" id="ageindayscondition">\t\t\t\t\t\t\t\t<template is="registerYield" yield-name="yield">\t\t\t\t\t\t\t\t\t<lyte-drop-box>\t\t\t\t\t\t\t\t\t\t<lyte-drop-body>\t\t\t\t\t\t\t\t\t\t\t<template is="for" items="{{ageindays}}" item="item" index="index">\t\t\t\t\t\t\t\t\t\t\t\t<lyte-drop-item data-value="{{index}}" value="{{item.system}}">{{item.display}}</lyte-drop-item>\t\t\t\t\t\t\t\t\t\t\t</template>\t\t\t\t\t\t\t\t\t\t</lyte-drop-body>\t\t\t\t\t\t\t\t\t</lyte-drop-box>\t\t\t\t\t\t\t\t</template>\t\t\t\t\t\t\t\t</lyte-dropdown>\t\t\t\t\t\t\t</lyte-th>\t\t\t\t\t\t\t<lyte-th style="width:75%">\t\t\t\t\t\t\t\t<crux-number-component cx-prop-from="criteria"></crux-number-component>\t\t\t\t\t\t\t</lyte-th>        \t\t\t\t</div>        \t\t\t\t<div class="w400 betweenNum hiden">        \t\t\t\t\t<crux-number-component cx-prop-from="criteria"></crux-number-component>        \t\t\t\t\t<crux-number-component cx-prop-from="criteria"></crux-number-component>        \t\t\t\t</div>        \t\t\t\t<div class="w400 dateCond hiden">        \t\t\t\t\t<crux-date-component cx-prop-date-pattern="{{datePattern}}" cx-prop-from="criteria"></crux-date-component>             \t\t\t</div>             \t\t\t<div class="w400 dateBetweenCond hiden">             \t\t\t\t<crux-date-component cx-prop-date-pattern="{{datePattern}}" cx-prop-from="criteria"></crux-date-component>             \t\t\t\t<crux-date-component cx-prop-date-pattern="{{datePattern}}" cx-prop-from="criteria"></crux-date-component>         \t\t\t\t</div>        \t\t\t\t<div class="w400 timeandDateCond hiden">        \t\t\t\t\t<crux-date-time-component cx-prop-date-pattern="{{datePattern}}" cx-prop-from="criteria"></crux-date-time-component>             \t\t\t</div>             \t\t\t<div class="w400 timeandDateBetweenCond hiden">             \t\t\t\t<crux-date-time-component cx-prop-date-pattern="{{datePattern}}" cx-prop-from="criteria"></crux-date-time-component>             \t\t\t\t<crux-date-time-component cx-prop-date-pattern="{{datePattern}}" cx-prop-from="criteria"></crux-date-time-component>         \t\t\t\t</div>         \t\t\t\t<div class="w400 lookupCond hiden">\t                 \t\t<crux-lookup-component id="lookupDropdown{{criteriaIndex}}" cx-prop-module="{{callModule}}" cx-prop-field-selector="{{lookupField}}" cx-prop-from="criteria" criteria-index="{{criteriaIndex}}" set-value="{{value}}"></crux-lookup-component>             \t\t\t</div>             \t\t\t<div class="w400 booleanCond gBB hiden">\t                 \t\t<crux-boolean-component cx-prop-from="criteria"></crux-boolean-component>             \t\t\t</div>            \t\t</div>                 </lyte-th>                 <lyte-th class="addRemove">        \t\t\t<div class="patternNumDiv" style="height: auto; opacity: 1; overflow: visible;">        \t\t\t\t<template is="if" value="{{showRemove}}"><template case="true">         \t\t\t\t<a id="check1" class="removeCriteria" onclick="{{action(\'removeCriteria\')}}"></a>         \t\t\t\t</template></template><template is="if" value="{{showAdd}}"><template case="true">         \t\t\t\t<a id="addRow" class="addCriteria" onclick="{{action(\'createNewCriteria\')}}"></a>         \t\t\t\t</template></template>         \t\t\t</div>                 </lyte-th>                 </div></template>',_dynamicNodes:[{type:"attr",position:[0,0,1,1]},{type:"if",position:[0,0,1,1],cases:{true:{dynamicNodes:[{type:"attr",position:[1,1]},{type:"componentDynamic",position:[1,1]}]}},default:{}},{type:"attr",position:[0,0,1,5]},{type:"componentDynamic",position:[0,0]},{type:"attr",position:[0,2,1,1,1]},{type:"registerYield",position:[0,2,1,1,1,1],dynamicNodes:[{type:"attr",position:[1,1]},{type:"if",position:[1,1],cases:{true:{dynamicNodes:[{type:"attr",position:[1,1]},{type:"componentDynamic",position:[1,1]},{type:"componentDynamic",position:[1]}]}},default:{}},{type:"attr",position:[1,3]},{type:"attr",position:[1,3,1]},{type:"attr",position:[1,3,1,1]},{type:"text",position:[1,3,1,3]},{type:"componentDynamic",position:[1,3,1]},{type:"attr",position:[1,3,3]},{type:"for",position:[1,3,3],dynamicNodes:[{type:"attr",position:[1]},{type:"attr",position:[1,1]},{type:"text",position:[1,3]},{type:"componentDynamic",position:[1]}]},{type:"attr",position:[1,3,5]},{type:"if",position:[1,3,5],cases:{true:{dynamicNodes:[{type:"text",position:[1,0]},{type:"componentDynamic",position:[1]}]}},default:{}},{type:"componentDynamic",position:[1,3]},{type:"componentDynamic",position:[1]}]},{type:"componentDynamic",position:[0,2,1,1,1]},{type:"componentDynamic",position:[0,2]},{type:"attr",position:[0,4,1,1,1]},{type:"registerYield",position:[0,4,1,1,1,1],dynamicNodes:[{type:"text",position:[1,1,1,0]},{type:"componentDynamic",position:[1,1,1]},{type:"componentDynamic",position:[1,1]},{type:"componentDynamic",position:[1]}]},{type:"componentDynamic",position:[0,4,1,1,1]},{type:"attr",position:[0,4,1,3,1]},{type:"registerYield",position:[0,4,1,3,1,1],dynamicNodes:[{type:"attr",position:[1,1]},{type:"if",position:[1,1],cases:{true:{dynamicNodes:[{type:"attr",position:[1,1]},{type:"componentDynamic",position:[1,1]},{type:"componentDynamic",position:[1]}]}},default:{}},{type:"attr",position:[1,3]},{type:"attr",position:[1,3,1]},{type:"for",position:[1,3,1],dynamicNodes:[{type:"attr",position:[1]},{type:"attr",position:[1,1]},{type:"text",position:[1,3]},{type:"componentDynamic",position:[1]}]},{type:"attr",position:[1,3,3]},{type:"if",position:[1,3,3],cases:{true:{dynamicNodes:[{type:"text",position:[1,0]},{type:"componentDynamic",position:[1]}]}},default:{}},{type:"componentDynamic",position:[1,3]},{type:"componentDynamic",position:[1]}]},{type:"componentDynamic",position:[0,4,1,3,1]},{type:"componentDynamic",position:[0,4]},{type:"componentDynamic",position:[0,6,1,1,1]},{type:"componentDynamic",position:[0,6,1,3,1]},{type:"componentDynamic",position:[0,6,1,5,1]},{type:"componentDynamic",position:[0,6,1,7,1]},{type:"componentDynamic",position:[0,6,1,9,1]},{type:"componentDynamic",position:[0,6,1,11,1]},{type:"attr",position:[0,6,1,13,1]},{type:"componentDynamic",position:[0,6,1,13,1]},{type:"attr",position:[0,6,1,15,1,1]},{type:"registerYield",position:[0,6,1,15,1,1,1],dynamicNodes:[{type:"attr",position:[1,1,1]},{type:"for",position:[1,1,1],dynamicNodes:[{type:"attr",position:[1]},{type:"text",position:[1,0]},{type:"componentDynamic",position:[1]}]},{type:"componentDynamic",position:[1,1]},{type:"componentDynamic",position:[1]}]},{type:"componentDynamic",position:[0,6,1,15,1,1]},{type:"componentDynamic",position:[0,6,1,15,1]},{type:"componentDynamic",position:[0,6,1,15,3,1]},{type:"componentDynamic",position:[0,6,1,15,3]},{type:"componentDynamic",position:[0,6,1,17,1]},{type:"componentDynamic",position:[0,6,1,17,3]},{type:"attr",position:[0,6,1,19,1]},{type:"componentDynamic",position:[0,6,1,19,1]},{type:"attr",position:[0,6,1,21,1]},{type:"componentDynamic",position:[0,6,1,21,1]},{type:"attr",position:[0,6,1,21,3]},{type:"componentDynamic",position:[0,6,1,21,3]},{type:"attr",position:[0,6,1,23,1]},{type:"componentDynamic",position:[0,6,1,23,1]},{type:"attr",position:[0,6,1,25,1]},{type:"componentDynamic",position:[0,6,1,25,1]},{type:"attr",position:[0,6,1,25,3]},{type:"componentDynamic",position:[0,6,1,25,3]},{type:"attr",position:[0,6,1,27,1]},{type:"componentDynamic",position:[0,6,1,27,1]},{type:"componentDynamic",position:[0,6,1,29,1]},{type:"componentDynamic",position:[0,6]},{type:"attr",position:[0,8,1,1]},{type:"if",position:[0,8,1,1],cases:{true:{dynamicNodes:[{type:"attr",position:[1]}]}},default:{}},{type:"attr",position:[0,8,1,2]},{type:"if",position:[0,8,1,2],cases:{true:{dynamicNodes:[{type:"attr",position:[1]}]}},default:{}},{type:"componentDynamic",position:[0,8]}],_observedAttributes:["module","type","fields","ageindays","criteria","showAdd","showRemove","selectCond","formCond","criteriaIndex","andOrCondition","ageindays","selectUser","ageInDays","dueInDays","users","dropdowndata","pickList","lookup","renderItems","criteriaObject","setCriteriaObj","tags","layout","emptyFieldShow","emptyPicklistShow","searchValue","showEmpty","condArray","tagComponent","layoutComponent","dataType","callModule","lookupField"],data:function(){return{module:Lyte.attr("string"),type:Lyte.attr("string"),fields:Lyte.attr("array"),ageindays:Lyte.attr("array"),criteria:Lyte.attr("number"),showAdd:Lyte.attr("boolean"),showRemove:Lyte.attr("boolean"),selectCond:Lyte.attr("string"),formCond:Lyte.attr("string"),criteriaIndex:Lyte.attr("number"),andOrCondition:Lyte.attr("string"),ageindays:Lyte.attr("array"),selectUser:Lyte.attr("boolean",{default:!1}),ageInDays:Lyte.attr("boolean",{default:!1}),dueInDays:Lyte.attr("boolean",{default:!1}),users:Lyte.attr("array"),dropdowndata:Lyte.attr("array"),pickList:Lyte.attr("boolean"),lookup:Lyte.attr("boolean"),renderItems:Lyte.attr("array",{default:[]}),criteriaObject:Lyte.attr("object"),setCriteriaObj:Lyte.attr("object"),tags:Lyte.attr("array"),layout:Lyte.attr("array"),emptyFieldShow:Lyte.attr("boolean",{default:!1}),emptyPicklistShow:Lyte.attr("boolean",{default:!1}),searchValue:Lyte.attr("string"),showEmpty:Lyte.attr("boolean",{default:!1}),condArray:Lyte.attr("array"),tagComponent:Lyte.attr("boolean",{default:!1}),layoutComponent:Lyte.attr("boolean",{default:!1}),dataType:Lyte.attr("string",{default:""}),callModule:Lyte.attr("string",{default:""}),lookupField:Lyte.attr("string",{default:""})}},init:function(){this.initCruxConditions("criteria"),this.setData("ageindays",this.ageInDaysConditions),this.setData("condArray",this.textConditions);var t={field:_cruxUtils.getI18n("None"),comparator:null,value:null};this.setData("criteriaObject",t),this.executeMethod("criteriaArrayObjectUpdate",this.getData("criteriaObject"),this.getData("criteriaIndex"))},didConnect:function(){this.getData("setCriteriaObj")&&this.setCriteria(this.getData("setCriteriaObj"))},getValue:function(){var t=document.getElementById("searchcrt"+this.getData("criteriaIndex")).querySelector("#searchval_div").querySelector("div.shown"),e=this.getData("criteriaObject.value");if(t.classList.contains("ageInDays")){var i=t.querySelector("crux-number-component").component.getValue();this.getData("ageInDays")?e="${AGE"+i+"}":this.getData("dueInDays")&&(e="${AGE+"+i+"}")}else if(1==t.childElementCount)t.children[0].classList.contains("disabledText")||(e=t.children[0].component.getValue());else if(2==t.childElementCount){e=t.children[0].component.getValue()+","+t.children[1].component.getValue()}this.setData("criteriaObject.value",e),this.executeMethod("criteriaArrayObjectUpdate",this.getData("criteriaObject"),this.getData("criteriaIndex"))},setCriteria:function(t){var e,i,o=t.field,a=t.comparator,n=t.value,r=document.getElementById("searchcrt"+this.getData("criteriaIndex")),c=document.querySelector("lyte-drop-item.selector"+this.getData("criteriaIndex")+'[value="'+o+'"]').getAttribute("data-value");this.changeFieldFunction(null,c),n.match(/\{/)&&("text"==this.getData("selectCond")||"num"==this.getData("selectCond")?n.match(/NOTEMPTY/)?a="is not empty":n.match(/EMPTY/)&&(a="is empty"):"date"==this.getData("selectCond")&&(n.match(/NOTEMPTY/)?a="is not empty":n.match(/EMPTY/)?a="is empty":n.match(/AGE\+/)?(e=a,i=n,a="Due in Days",n=n.replace(/\D/g,"")):n.match(/AGE/)?(e=a,i=n,a="Age in Days",n=n.replace(/\D/g,"")):a=n));var s=this.getData("selectCond"),d=r.querySelector("div#conditionDiv").querySelector('lyte-drop-item[value="'+a+'"]').getAttribute("data-value");if(this.changeConditionFunction(null,d),e){var l=r.querySelector("#ageindayscondition");c=l.querySelector('lyte-drop-item[value="'+e+'"]').getAttribute("data-value"),l.ltProp("selected",c),this.changeAgeInDaysConditionFunction(null,c)}i&&(this.changeValueFunction(i),r.querySelector("lyte-input.ageInput").ltProp("value",n));if(this.getData("pickList"))r.querySelector("div.pickList").cxProp("value",n);else if(a.match(/between/)){if("num"==s){n=n.split(",");var p=r.querySelector("div.betweenNum");p.children[0].cxProp("value",n[0]),p.children[1].cxProp("value",n[1])}else if("date"==s){(n=n.split(","))[0]=n[0].split(/ (.+)/),n[1]=n[1].split(/ (.+)/);var y=r.querySelector("lyte-input.betweenTimeAndDateFrom1"),u=r.querySelector("lyte-input.betweenTimeAndDateFrom2"),m=r.querySelector("lyte-input.betweenTimeAndDateTo1"),h=r.querySelector("lyte-input.betweenTimeAndDateTo2");y.ltProp("currentDate",n[0][0]),u.ltProp("defaultTime",n[0][1]),m.ltProp("currentDate",n[1][0]),h.ltProp("defaultTime",n[1][1])}}else{if("number"==s)r.querySelector("div.numInput").children[0].cxProp("value",n);else if("text"==s){r.querySelector("div.textInput").children[0].cxProp("value",n)}else if("date"==s){n=n.split(/ (.+)/);y=r.querySelector("lyte-input.timeAndDateCond1"),u=r.querySelector("lyte-input.timeAndDateCond2");y.ltProp("currentDate",n[0]),u.ltProp("defaultTime",n[1])}}},disabledCondition:function(t){var e=document.getElementById("searchcrt"+this.getData("criteriaIndex")).querySelector("#searchval_div"),i=e.querySelector("div.shown");i.classList.add("hiden"),i.classList.remove("shown");var o=e.querySelector("div.disabledText");o.classList.remove("hiden"),o.classList.add("shown"),o.children[0].ltProp("placeholder",t)},changeSearchVal:function(t){var e=document.getElementById("searchcrt"+this.getData("criteriaIndex")).querySelector("#searchval_div"),i=e.querySelector("div.shown");i.classList.add("hiden"),i.classList.remove("shown");var o=e.querySelector("div."+t);o.classList.remove("hiden"),o.classList.add("shown")},changeConditionFunction:function(t,e){var i=this.getData("selectCond");this.setData("ageInDays",!1);var o=this.getData("condArray"),a=document.getElementById("searchcrt"+this.getData("criteriaIndex"));a.querySelector("div#conditionDiv").children[0].ltProp("selected",e.toString());a.querySelector("#searchval_div");var n,r=o[e];n=r.system;var c=null;"text"==i&&0==e||"none"==i?this.disabledCondition(""):"boolean"==i?this.changeSearchVal("booleanCond"):"text"==i&&7==e||"number"==i&&8==e||"date"==i&&19==e||"defWithEmpty"==i&&2==e?(this.disabledCondition("$(EMPTY)"),n="equal",c="$(EMPTY)"):"text"==i&&8==e||"number"==i&&9==e||"date"==i&&20==e||"defWithEmpty"==i&&3==e?(this.disabledCondition("$(NOTEMPTY)"),n="equal",c="$(NOTEMPTY)"):this.getData("lookup")?this.changeSearchVal("lookupCond"):this.getData("selectUser")?this.changeSearchVal("selectUsers"):this.getData("tagComponent")?this.changeSearchVal("tagPickList"):this.getData("layoutComponent")?this.changeSearchVal("layoutPickList"):this.getData("pickList")||"defWithEmpty"==i||"default"==i?this.changeSearchVal("pickList"):"text"==i?this.changeSearchVal("textInput"):"number"!=i||7!=e&&6!=e?"number"==i?this.changeSearchVal("numInput"):"date"==i&&e>=6&&e<=16?(this.disabledCondition(r.system),n="equal",c=r.system):"date"!=i||4!=e&&5!=e?"date"!=i||17!=e&&18!=e?"date"==i&&("date"==this.getData("dataType")?this.changeSearchVal("dateCond"):this.changeSearchVal("timeandDateCond")):(this.changeSearchVal("ageInDays"),17==e?this.setData("ageInDays",!0):this.setData("dueInDays",!0)):"date"==this.getData("dataType")?this.changeSearchVal("dateBetweenCond"):this.changeSearchVal("timeandDateBetweenCond"):this.changeSearchVal("betweenNum"),this.setData("criteriaObject.comparator",n),this.setData("criteriaObject.value",c)},changeValueFunction:function(t){var e=!0;this.getMethods("onBeforeValueChangeCall")&&(e=this.executeMethod("onBeforeValueChangeCall")),e?(this.setData("criteriaObject.value",t),this.executeMethod("onValueChangeCall"),this.executeMethod("criteriaArrayObjectUpdate",this.getData("criteriaObject"),this.getData("criteriaIndex"))):this.setCriteria(this.getData("criteriaObject"))},changeFieldFunction:function(t,e){this.setData("renderItems",[]),this.setData("showEmpty",!1),this.setData("selectUser",!1),this.setData("pickList",!1),this.setData("lookup",!1),this.setData("tagComponent",!1),this.setData("layoutComponent",!1);var i=document.getElementById("searchcrt"+this.getData("criteriaIndex"));i.querySelector("lyte-dropdown.fields").ltProp("selected",e);var o=document.querySelector("lyte-drop-item.selector"+this.getData("criteriaIndex")+'[data-value="'+e+'"]'),a=o.id;this.setData("dataType",a);var n,r=o.getAttribute("value");this.getData("criteriaObject");switch(this.setData("criteriaObject.field",r),a){case"none":n="none";break;case"text":case"email":case"phone":case"website":case"textarea":n="text";break;case"currency":case"double":case"integer":case"bigint":n="number";break;case"datetime":case"date":n="date";break;case"boolean":n="boolean";break;case"ownerlookup":n="default",this.setData("selectUser",!0);break;case"picklist":this.setData("pickList",!0),n="text",this.setData("selectedField",this.getData("fields")[e]);break;case"lookup":n="text",this.setData("lookup",!0);var c=this.getData("fields")[e],s=c.lookup.module.api_name;store.findRecord("module",moduleRecordMapping[s].id),this.setData("callModule",s),this.setData("lookupField",c.api_name)}r.match(/Tag/)&&(this.setData("tagComponent",!0),n="defWithEmpty",this.setData("showEmpty",!0)),r.match(/Layout/)&&(this.setData("layoutComponent",!0),n="default",this.setData("showEmpty",!0));var d=n+"Conditions";if(this.setData("condArray",this[d]),this.setData("selectCond",n),(l=i.querySelector("div.shown"))&&(l.classList.add("hiden"),l.classList.remove("shown")),"none"==n){var l;(l=i.querySelector("div#nonecondition"))&&(l.classList.add("shown"),l.classList.remove("hiden"))}else{var p=i.querySelector("div#conditionDiv");p&&(p.classList.remove("hiden"),p.classList.add("shown"),p.children[0].ltProp("selected","[]"))}this.changeConditionFunction(t,0)},changeAgeInDaysConditionFunction:function(t,e){this.setData("criteriaObject.comparator",this.getData("ageindays")[e].system),this.executeMethod("criteriaArrayObjectUpdate",this.getData("criteriaObject"),this.getData("criteriaIndex"))},methods:{changeField:function(t,e){var i=!0;this.getMethods("onBeforeFieldChangeCall")&&(i=this.executeMethod("onBeforeFieldChangeCall")),i?(this.changeFieldFunction(t,e),this.executeMethod("onFieldChangeCall",this.getData("criteriaIndex")),this.executeMethod("criteriaArrayObjectUpdate",this.getData("criteriaObject"),this.getData("criteriaIndex"))):this.setCriteria(this.getData("criteriaObject"))},changeCondition:function(t,e){var i=!0;this.getMethods("onBeforeOperatorChangeCall")&&(i=this.executeMethod("onBeforeOperatorChangeCall")),i?(this.changeConditionFunction(t,e),this.executeMethod("onOperatorChangeCall"),this.executeMethod("criteriaArrayObjectUpdate",this.getData("criteriaObject"),this.getData("criteriaIndex"))):this.setCriteria(this.getData("criteriaObject"))},onFieldSearch:function(t){0==t.length?this.setData("emptyFieldShow",!0):this.setData("emptyFieldShow",!1)},onConditionSearch:function(t){0==t.length?this.setData("emptyConditionShow",!0):this.setData("emptyConditionShow",!1)},onFieldDropdownShow:function(){var t=document.querySelector("lyte-search.fieldSearchStyle"+this.getData("criteriaIndex"));t&&(t.setValue(""),t.querySelector("input").focus(),this.$node.constructor._actions.onFocusFieldSearch.call(this))},onConditionDropdownShow:function(){var t=document.querySelector("lyte-search.conditionSearchStyle"+this.getData("criteriaIndex"));t&&(t.setValue(""),t.querySelector("input").focus(),this.$node.constructor._actions.onFocusFieldSearch.call(this))},changeAgeInDaysCondition:function(t,e){this.changeAgeInDaysConditionFunction(t,e)}},actions:{createNewCriteria:function(){this.throwEvent("createNewCriteria")},removeCriteria:function(){this.throwEvent("removeCriteria",this.getData("criteriaIndex"))},changeAndOr:function(){this.throwEvent("changeAndOr",this.getData("andOrCondition"),this.getData("criteriaIndex"))},campLookUp:function(){showLookUp("temp_searchcampcv","lyte"+this.getData("criteriaIndex"),"Campaign Name","Campaigns",null,null,null,null,null,null,null,null,"equal")},onFocusFieldSearch:function(){document.querySelector("lyte-search.fieldSearchStyle"+this.getData("criteriaIndex")).setAttribute("style","border-bottom: 1px solid #2d7ad0;")},onFocusOutFieldSearch:function(){document.querySelector("lyte-search.fieldSearchStyle"+this.getData("criteriaIndex")).removeAttribute("style")}}},{mixins:["crux-criteria-conditions"]});