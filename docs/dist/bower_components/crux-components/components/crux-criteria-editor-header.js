Lyte.Component.register("crux-criteria-editor-header",{_template:'<template tag-name="crux-criteria-editor-header"><div class="header"><lyte-td style="opacity:1;">       \t\t\t\t<div class="patternNumDiv" style="height: auto; opacity: 1; overflow: visible;">       \t\t\t\t\t<template is="if" value="{{expHandlers(ifNotEquals(criteriaIndex,1),\'&amp;&amp;\',expHandlers(removePattern,\'!\'))}}"><template case="true">\t\t       \t\t\t\t<div class="andOr" style="opacity: 1; height: auto;">\t\t       \t\t\t\t\t<lyte-input lt-prop-style="color:blue;cursor:pointer; transform:scale(0.75)" lt-prop-readonly="true" lt-prop-value="{{andOrCondition}}" onclick="{{action(\'changeAndOr\')}}"></lyte-input>\t\t       \t\t\t\t</div>\t       \t\t\t\t</template></template>               \t\t\t<input type="hidden" id="match" value="">               \t\t\t<input type="text" id="patternNum" class="patterNum" value="{{criteriaIndex}}" readonly="">               \t\t</div>                </lyte-td>                <lyte-td>       \t\t\t\t<div class="patternNumDiv" style="height: auto; opacity: 1; overflow: visible;">\t\t\t\t\t\t<div class="dropdownDiv">\t\t\t\t\t\t\t<lyte-dropdown class="gBB fields" lt-prop-yield="true" lt-prop-tabindex="1" on-option-selected="{{method(\'changeField\')}}" on-show="{{method(\'onFieldDropdownShow\')}}">\t\t\t\t\t\t\t\t<template is="registerYield" yield-name="yield">\t\t\t\t\t\t\t\t\t<lyte-drop-box>\t\t\t\t\t\t\t\t\t\t<template is="if" value="{{expHandlers(fields.length,\'>\',9)}}"><template case="true">\t\t\t\t\t\t\t\t\t\t\t<lyte-drop-header>\t\t\t\t\t\t\t\t \t\t\t\t<lyte-search id="fieldSearchBox" onfocus="{{action(\'onFocusFieldSearch\', event, this)}}" onfocusout="{{action(\'onFocusOutFieldSearch\', event, this)}}" class="fieldSearchStyle{{criteriaIndex}}" lt-prop-style="padding-left:8px" lt-prop-placeholder="{{cruxGetI18n(\'crm.globalsearch.search.title\')}}" lt-prop-query-selector="{&quot;scope&quot;:&quot;.lyteFieldsDropbody{{criteriaIndex}}&quot;,&quot;search&quot;:&quot;lyte-drop-item:not(.prevent)&quot;, &quot;target&quot; : &quot;lyte-drop-item:not(.prevent)&quot;}" style="width:100%" on-search="{{method(&quot;onFieldSearch&quot;)}}" lt-prop-appearance="box"> \t\t\t\t\t\t\t\t\t\t\t\t</lyte-search> \t\t\t\t\t\t\t\t\t\t\t</lyte-drop-header>\t\t\t\t\t\t\t\t\t\t</template></template>\t\t\t\t\t\t\t\t\t\t<lyte-drop-body class="lyteFieldsDropbody{{criteriaIndex}}">\t\t\t\t\t\t\t\t\t\t\t<lyte-drop-item class="selector{{criteriaIndex}}" data-value="-1" id="none" value="{{cruxGetI18n(\'None\')}}">\t\t\t\t\t\t\t\t\t\t\t<span class="{{if(ifEquals(criteriaArray.api_name,cruxGetI18n(\'None\')),\'selectedTick\',\'\')}}"></span>\t\t\t\t\t\t\t\t\t\t\t{{cruxGetI18n(\'None\')}}\t\t\t\t\t\t\t\t\t\t\t</lyte-drop-item>\t\t\t\t\t\t\t\t\t\t\t<template is="for" items="{{fields}}" item="item" index="index">\t\t\t\t\t\t\t\t\t\t\t\t<lyte-drop-item class="selector{{criteriaIndex}}" data-value="{{index}}" id="{{item.data_type}}" value="{{item.api_name}}">\t\t\t\t\t\t\t\t\t\t\t\t<span class="{{if(ifEquals(criteriaArray.api_name,concat(module,\'.\',item.api_name)),\'selectedTick\',\'\')}}"></span>\t\t\t\t\t\t\t\t\t\t\t    {{item.field_label}}\t\t\t\t\t\t\t\t\t\t\t\t</lyte-drop-item>\t\t\t\t\t\t\t\t\t\t\t</template>\t\t\t\t\t\t\t\t\t\t\t<template is="if" value="{{emptyFieldShow}}"><template case="true">\t\t\t\t\t\t\t\t\t\t\t\t<lyte-drop-item class="prevent">{{ cruxGetI18n("crm.label.no.options.found") }}</lyte-drop-item>\t\t\t\t\t\t\t\t\t\t\t</template></template>\t\t\t\t\t\t\t\t\t\t</lyte-drop-body>\t\t\t\t\t\t\t\t\t</lyte-drop-box>\t\t\t\t\t\t\t\t</template>\t\t\t\t\t\t\t</lyte-dropdown>\t\t\t\t\t\t</div>\t\t\t\t\t</div>              </lyte-td>                <lyte-td>       \t\t\t\t<div class="patternNumDiv" style="height: auto; opacity: 1; overflow: visible;">               \t\t<div class="dropdownDiv shown" id="nonecondition">                  \t\t\t<lyte-dropdown class="gBB" lt-prop-yield="true" lt-prop-tabindex="1" id="textcondition" lt-prop-disabled="true" on-option-selected="{{method(\'changeCondition\')}}">\t\t\t\t\t\t\t<template is="registerYield" yield-name="yield">\t\t\t\t\t\t\t\t<lyte-drop-box>\t\t\t\t\t\t\t\t\t<lyte-drop-body>\t\t\t\t\t\t\t\t\t\t<lyte-drop-item data-value="0" value="none">{{cruxGetI18n("None")}}\t\t\t\t\t\t\t\t\t\t</lyte-drop-item>\t\t\t\t\t\t\t\t\t</lyte-drop-body>\t\t\t\t\t\t\t\t</lyte-drop-box>\t\t\t\t\t\t\t</template>\t\t\t\t\t\t</lyte-dropdown>                  \t\t</div>                  \t\t<div class="dropdownDiv hiden" id="conditionDiv">                  \t\t\t<lyte-dropdown class="gBB" lt-prop-yield="true" lt-prop-tabindex="1" id="comparator" on-option-selected="{{method(\'changeCondition\')}}" on-show="{{method(\'onConditionDropdownShow\')}}">\t\t\t\t\t\t\t<template is="registerYield" yield-name="yield">\t\t\t\t\t\t\t\t<lyte-drop-box>\t\t\t\t\t\t\t\t\t<template is="if" value="{{expHandlers(condArray.length,\'>\',9)}}"><template case="true">\t\t\t\t\t\t\t\t\t\t\t<lyte-drop-header>\t\t\t\t\t\t\t\t \t\t\t\t<lyte-search id="conditionSearchBox" onfocus="{{action(\'onFocusFieldSearch\', event, this)}}" onfocusout="{{action(\'onFocusOutFieldSearch\', event, this)}}" class="conditionSearchStyle{{criteriaIndex}}" lt-prop-style="padding-left:8px" lt-prop-placeholder="{{cruxGetI18n(\'crm.globalsearch.search.title\')}}" lt-prop-query-selector="{&quot;scope&quot;:&quot;.lyteConditionDropbody{{criteriaIndex}}&quot;,&quot;search&quot;:&quot;lyte-drop-item:not(.prevent)&quot;, &quot;target&quot; : &quot;lyte-drop-item:not(.prevent)&quot;}" style="width:100%" on-search="{{method(&quot;onConditionSearch&quot;)}}" lt-prop-appearance="box"> \t\t\t\t\t\t\t\t\t\t\t\t</lyte-search> \t\t\t\t\t\t\t\t\t\t\t</lyte-drop-header>\t\t\t\t\t\t\t\t\t\t</template></template>\t\t\t\t\t\t\t\t\t<lyte-drop-body class="lyteConditionDropbody{{criteriaIndex}}">\t\t\t\t\t\t\t\t\t\t<template is="for" items="{{condArray}}" item="item" index="index">\t\t\t\t\t\t\t\t\t\t<lyte-drop-item data-value="{{index}}" value="{{item.system}}">\t\t\t\t\t\t\t\t\t\t\t<span class="{{if(ifEquals(criteriaArray.comparator,item.system)),\'selectedTick\',\'\')}}"></span>\t\t\t\t\t\t\t\t\t\t\t{{item.display}}\t\t\t\t\t\t\t\t\t\t</lyte-drop-item>\t\t\t\t\t\t\t\t\t\t</template>\t\t\t\t\t\t\t\t\t\t<template is="if" value="{{emptyConditionShow}}"><template case="true">\t\t\t\t\t\t\t\t\t\t\t\t<lyte-drop-item class="prevent">{{ cruxGetI18n("crm.label.no.options.found") }}</lyte-drop-item>\t\t\t\t\t\t\t\t\t\t\t</template></template>\t\t\t\t\t\t\t\t\t</lyte-drop-body>\t\t\t\t\t\t\t\t</lyte-drop-box>\t\t\t\t\t\t\t</template>\t\t\t\t\t\t</lyte-dropdown>                  \t\t</div>                  \t</div>                </lyte-td>                <lyte-td>            \t\t            \t\t<div id="searchval_div" class="pR">            \t\t\t<template is="if" value="{{noneCondition}}"><template case="true">\t\t\t\t\t\t\t<lyte-input class="gBB disabledText" lt-prop-type="text" lt-prop-disabled="true" lt-prop-value="{{disableText}}"> </lyte-input>            \t\t\t</template><template case="false"><template is="if" value="{{ageInDaysCond}}"><template case="true">\t\t\t\t\t\t\t\t<lyte-td style="width:25%">\t\t                \t\t\t<lyte-dropdown on-option-selected="{{method(\'changeAgeInDaysCondition\')}}" class="gBB" lt-prop-yield="true" lt-prop-tabindex="1" id="ageindayscondition">\t\t\t\t\t\t\t\t\t<template is="registerYield" yield-name="yield">\t\t\t\t\t\t\t\t\t\t<lyte-drop-box>\t\t\t\t\t\t\t\t\t\t\t<lyte-drop-body>\t\t\t\t\t\t\t\t\t\t\t\t<template is="for" items="{{ageindays}}" item="item" index="index">\t\t\t\t\t\t\t\t\t\t\t\t\t<lyte-drop-item data-value="{{index}}" value="{{item.system}}">{{item.display}}</lyte-drop-item>\t\t\t\t\t\t\t\t\t\t\t\t</template>\t\t\t\t\t\t\t\t\t\t\t</lyte-drop-body>\t\t\t\t\t\t\t\t\t\t</lyte-drop-box>\t\t\t\t\t\t\t\t\t</template>\t\t\t\t\t\t\t\t\t</lyte-dropdown>\t\t\t\t\t\t\t\t</lyte-td>\t\t\t\t\t\t\t\t<lyte-td style="width:75%">\t\t\t\t\t\t\t\t\t<crux-number-component id="ageValueInput" cx-prop-from="criteria"></crux-number-component>\t\t\t\t\t\t\t\t</lyte-td>\t            \t\t\t</template><template case="false"><template is="if" value="{{betweenCond}}"><template case="true">\t\t\t\t\t\t\t\t\t<template is="component" id="betweenComponent1" component-name="crux-{{elementsCond}}-component" cx-prop-from="criteria" cx-prop-date-pattern="{{getUserDetail(\'DATE_PATTERN\')}}"></template>\t\t\t\t\t\t\t\t\t<template is="component" id="betweenComponent2" component-name="crux-{{elementsCond}}-component" cx-prop-from="criteria" cx-prop-date-pattern="{{getUserDetail(\'DATE_PATTERN\')}}"></template>\t            \t\t\t\t</template><template case="false">\t\t\t\t\t\t\t\t\t<template is="component" id="elementComponent" component-name="crux-{{elementsCond}}-component" cx-prop-from="criteria" cx-prop-module="{{module}}" cx-prop-date-pattern="{{getUserDetail(\'DATE_PATTERN\')}}" cx-prop-field="{{selectedField}}"></template>\t            \t\t\t\t</template></template></template></template></template></template>            \t\t</div>                 </lyte-td>                 <lyte-td class="addRemove">        \t\t\t<div class="patternNumDiv" style="height: auto; opacity: 1; overflow: visible;">        \t\t\t\t<template is="if" value="{{showRemove}}"><template case="true">         \t\t\t\t<a id="check1" class="removeCriteria" onclick="{{action(\'removeCriteria\')}}"></a>         \t\t\t\t</template></template><template is="if" value="{{showAdd}}"><template case="true">         \t\t\t\t<a id="addRow" class="addCriteria" onclick="{{action(\'createNewCriteria\')}}"></a>         \t\t\t\t</template></template>         \t\t\t</div>                 </lyte-td>                 </div></template>',_dynamicNodes:[{type:"attr",position:[0,0,1,1]},{type:"if",position:[0,0,1,1],cases:{true:{dynamicNodes:[{type:"attr",position:[1,1]},{type:"componentDynamic",position:[1,1]}]}},default:{}},{type:"attr",position:[0,0,1,5]},{type:"componentDynamic",position:[0,0]},{type:"attr",position:[0,2,1,1,1]},{type:"registerYield",position:[0,2,1,1,1,1],dynamicNodes:[{type:"attr",position:[1,1]},{type:"if",position:[1,1],cases:{true:{dynamicNodes:[{type:"attr",position:[1,1]},{type:"componentDynamic",position:[1,1]},{type:"componentDynamic",position:[1]}]}},default:{}},{type:"attr",position:[1,3]},{type:"attr",position:[1,3,1]},{type:"attr",position:[1,3,1,1]},{type:"text",position:[1,3,1,3]},{type:"componentDynamic",position:[1,3,1]},{type:"attr",position:[1,3,3]},{type:"for",position:[1,3,3],dynamicNodes:[{type:"attr",position:[1]},{type:"attr",position:[1,1]},{type:"text",position:[1,3]},{type:"componentDynamic",position:[1]}]},{type:"attr",position:[1,3,5]},{type:"if",position:[1,3,5],cases:{true:{dynamicNodes:[{type:"text",position:[1,0]},{type:"componentDynamic",position:[1]}]}},default:{}},{type:"componentDynamic",position:[1,3]},{type:"componentDynamic",position:[1]}]},{type:"componentDynamic",position:[0,2,1,1,1]},{type:"componentDynamic",position:[0,2]},{type:"attr",position:[0,4,1,1,1]},{type:"registerYield",position:[0,4,1,1,1,1],dynamicNodes:[{type:"text",position:[1,1,1,0]},{type:"componentDynamic",position:[1,1,1]},{type:"componentDynamic",position:[1,1]},{type:"componentDynamic",position:[1]}]},{type:"componentDynamic",position:[0,4,1,1,1]},{type:"attr",position:[0,4,1,3,1]},{type:"registerYield",position:[0,4,1,3,1,1],dynamicNodes:[{type:"attr",position:[1,1]},{type:"if",position:[1,1],cases:{true:{dynamicNodes:[{type:"attr",position:[1,1]},{type:"componentDynamic",position:[1,1]},{type:"componentDynamic",position:[1]}]}},default:{}},{type:"attr",position:[1,3]},{type:"attr",position:[1,3,1]},{type:"for",position:[1,3,1],dynamicNodes:[{type:"attr",position:[1]},{type:"attr",position:[1,1]},{type:"text",position:[1,3]},{type:"componentDynamic",position:[1]}]},{type:"attr",position:[1,3,3]},{type:"if",position:[1,3,3],cases:{true:{dynamicNodes:[{type:"text",position:[1,0]},{type:"componentDynamic",position:[1]}]}},default:{}},{type:"componentDynamic",position:[1,3]},{type:"componentDynamic",position:[1]}]},{type:"componentDynamic",position:[0,4,1,3,1]},{type:"componentDynamic",position:[0,4]},{type:"attr",position:[0,6,1,1]},{type:"if",position:[0,6,1,1],cases:{true:{dynamicNodes:[{type:"attr",position:[1]},{type:"componentDynamic",position:[1]}]},false:{dynamicNodes:[{type:"attr",position:[0]},{type:"if",position:[0],cases:{true:{dynamicNodes:[{type:"attr",position:[1,1]},{type:"registerYield",position:[1,1,1],dynamicNodes:[{type:"attr",position:[1,1,1]},{type:"for",position:[1,1,1],dynamicNodes:[{type:"attr",position:[1]},{type:"text",position:[1,0]},{type:"componentDynamic",position:[1]}]},{type:"componentDynamic",position:[1,1]},{type:"componentDynamic",position:[1]}]},{type:"componentDynamic",position:[1,1]},{type:"componentDynamic",position:[1]},{type:"componentDynamic",position:[3,1]},{type:"componentDynamic",position:[3]}]},false:{dynamicNodes:[{type:"attr",position:[0]},{type:"if",position:[0],cases:{true:{dynamicNodes:[{type:"attr",position:[1]},{type:"component",position:[1],dynamicNodes:[]},{type:"attr",position:[3]},{type:"component",position:[3],dynamicNodes:[]}]},false:{dynamicNodes:[{type:"attr",position:[1]},{type:"component",position:[1],dynamicNodes:[]}]}},default:{}}]}},default:{}}]}},default:{}},{type:"componentDynamic",position:[0,6]},{type:"attr",position:[0,8,1,1]},{type:"if",position:[0,8,1,1],cases:{true:{dynamicNodes:[{type:"attr",position:[1]}]}},default:{}},{type:"attr",position:[0,8,1,2]},{type:"if",position:[0,8,1,2],cases:{true:{dynamicNodes:[{type:"attr",position:[1]}]}},default:{}},{type:"componentDynamic",position:[0,8]}],_observedAttributes:["module","fields","ageindays","criteria","showAdd","showRemove","selectCond","formCond","criteriaIndex","andOrCondition","ageindays","selectUser","ageInDays","dueInDays","users","dropdowndata","pickList","lookup","renderItems","criteriaObject","setCriteriaObj","tags","layout","emptyFieldShow","emptyPicklistShow","searchValue","showEmpty","condArray","dataType","callModule","lookupField","betweenCond","elementsCond","noneCondition","ageInDaysCond","disableText","removePattern"],data:function(){return{module:Lyte.attr("string"),fields:Lyte.attr("array"),ageindays:Lyte.attr("array"),criteria:Lyte.attr("number"),showAdd:Lyte.attr("boolean"),showRemove:Lyte.attr("boolean"),selectCond:Lyte.attr("string"),formCond:Lyte.attr("string"),criteriaIndex:Lyte.attr("number"),andOrCondition:Lyte.attr("string"),ageindays:Lyte.attr("array"),selectUser:Lyte.attr("boolean",{default:!1}),ageInDays:Lyte.attr("boolean",{default:!1}),dueInDays:Lyte.attr("boolean",{default:!1}),users:Lyte.attr("array"),dropdowndata:Lyte.attr("array"),pickList:Lyte.attr("boolean"),lookup:Lyte.attr("boolean"),renderItems:Lyte.attr("array",{default:[]}),criteriaObject:Lyte.attr("object"),setCriteriaObj:Lyte.attr("object"),tags:Lyte.attr("array"),layout:Lyte.attr("array"),emptyFieldShow:Lyte.attr("boolean",{default:!1}),emptyPicklistShow:Lyte.attr("boolean",{default:!1}),searchValue:Lyte.attr("string"),showEmpty:Lyte.attr("boolean",{default:!1}),condArray:Lyte.attr("array"),dataType:Lyte.attr("string",{default:""}),callModule:Lyte.attr("string",{default:""}),lookupField:Lyte.attr("string",{default:""}),betweenCond:Lyte.attr("boolean",{default:!1}),elementsCond:Lyte.attr("string"),noneCondition:Lyte.attr("boolean",{default:!0}),ageInDaysCond:Lyte.attr("boolean",{default:!1}),disableText:Lyte.attr("string"),removePattern:Lyte.attr("boolean",{default:!1})}},init:function(){this.initCruxConditions("criteria"),this.setData("ageindays",this.ageInDaysConditions),this.setData("condArray",this.textConditions);var t={api_name:_cruxUtils.getI18n("None"),comparator:null,value:null};this.setData("criteriaObject",t),this.executeMethod("criteriaArrayObjectUpdate",this.getData("criteriaObject"),this.getData("criteriaIndex"))},didConnect:function(){this.getData("setCriteriaObj")&&this.setCriteria(this.getData("setCriteriaObj"))},getValue:function(){var t=this.$node.querySelector("#searchval_div"),e=this.getData("criteriaObject.value");if(this.getData("ageInDaysCond")){var i=t.querySelector("crux-number-component").component.getValue();this.getData("ageInDays")?e="${AGE"+i+"}":this.getData("dueInDays")&&(e="${AGE+"+i+"}")}else if(this.getData("betweenCond")){e=[t.querySelector("#betweenComponent1").component.getValue(),t.querySelector("#betweenComponent2").component.getValue()]}else this.getData("noneCondition")||(e=t.querySelector("#elementComponent").component.getValue());this.setData("criteriaObject.value",e),this.executeMethod("criteriaArrayObjectUpdate",this.getData("criteriaObject"),this.getData("criteriaIndex"))},setCriteria:function(t){var e,i,a=t.api_name,o=t.comparator,n=t.value,r=this.$node,s=this.$node.querySelector("lyte-drop-item.selector"+this.getData("criteriaIndex")+'[value="'+a+'"]').getAttribute("data-value");this.changeFieldFunction(null,s),"string"==typeof n&&n.match(/\{/)&&"date"==this.getData("selectCond")&&(n.match(/AGE\+/)?(e=o,i=n,o="Due in Days",n=n.replace(/\D/g,"")):n.match(/AGE/)&&(e=o,i=n,o="Age in Days",n=n.replace(/\D/g,"")));this.getData("selectCond");var l=r.querySelector("div#conditionDiv").querySelector('lyte-drop-item[value="'+o+'"]').getAttribute("data-value"),d=r.querySelector("#searchval_div");if(this.changeConditionFunction(null,l),this.getData("selectUser")&&(n={ids:n.join(",")}),e){var c=d.querySelector("#ageindayscondition");if(c.ltProp("show"))var p=c.component.childComp.querySelector('lyte-drop-item[value="'+e+'"]');else p=c.querySelector('lyte-drop-item[value="'+e+'"]');s=p.getAttribute("data-value"),c.ltProp("selected",s),this.changeAgeInDaysConditionFunction(null,s)}i&&(this.changeValueFunction(i),d.querySelector("#ageValueInput").cxProp("value",n));this.getData("betweenCond")?(d.querySelector("#betweenComponent1").cxProp("value",n[0]),d.querySelector("#betweenComponent2").cxProp("value",n[1])):this.getData("noneCondition")||d.querySelector("#elementComponent").cxProp("value",n)},changeConditionFunction:function(t,e){var i=this.getData("selectCond");this.setData("ageInDays",!1);var a=this.getData("condArray"),o=this.$node;o.querySelector("div#conditionDiv").children[0].ltProp("selected",e.toString());o.querySelector("#searchval_div");var n,r=a[e];n=r.system;var s=null;"text"==i&&0==e||"none"==i?(this.setData("noneCondition",!0),this.setData("disableText","")):"text"==i&&7==e||"number"==i&&8==e||"date"==i&&19==e||"date-time"==i&&19==e||"defWithEmpty"==i&&2==e?(this.setData("noneCondition",!0),this.setData("disableText","$(EMPTY)"),n="equal",s="$(EMPTY)"):"text"==i&&8==e||"number"==i&&9==e||"date"==i&&20==e||"date-time"==i&&19==e||"defWithEmpty"==i&&3==e?(this.setData("noneCondition",!0),this.setData("disableText","$(NOTEMPTY)"),n="equal",s="$(NOTEMPTY)"):"number"==i&&(7==e||6==e)||"date"==i&&(4==e||5==e)?this.setData("betweenCond",!0):"date"==i&&e>=6&&e<=16?(this.setData("noneCondition",!0),this.setData("disableText",r.system),n="equal",s=r.system):"date"!=i||17!=e&&18!=e?this.setData("noneCondition",!1):(this.setData("ageInDaysCond",!0),17==e?this.setData("ageInDays",!0):this.setData("dueInDays",!0)),this.setData("criteriaObject.comparator",n),this.setData("criteriaObject.value",s)},changeValueFunction:function(t){var e=!0;this.getMethods("onBeforeValueChangeCall")&&(e=this.executeMethod("onBeforeValueChangeCall")),e?(this.setData("criteriaObject.value",t),this.executeMethod("onValueChangeCall"),this.executeMethod("criteriaArrayObjectUpdate",this.getData("criteriaObject"),this.getData("criteriaIndex"))):this.setCriteria(this.getData("criteriaObject"))},changeFieldFunction:function(t,e){this.setData("renderItems",[]),this.setData("showEmpty",!1),this.setData("selectUser",!1),this.setData("pickList",!1),this.setData("lookup",!1);var i,a=this.$node,o=a.querySelector("lyte-dropdown.fields");o.ltProp("selected",e);var n=(i=o.ltProp("show")?o.component.childComp.querySelector("lyte-drop-item.selector"+this.getData("criteriaIndex")+'[data-value="'+e+'"]'):a.querySelector("lyte-drop-item.selector"+this.getData("criteriaIndex")+'[data-value="'+e+'"]')).id;this.setData("dataType",n);var r,s=i.getAttribute("value");this.getData("criteriaObject");switch(this.setData("criteriaObject.api_name",s),n){case"none":r="none",elementsCond="none";break;case"text":case"email":case"phone":case"website":case"textarea":r="text",elementsCond="text",this.setData("selectedField",this.getData("fields")[e]);break;case"currency":case"double":case"integer":case"bigint":r="number",elementsCond="number",this.setData("selectedField",this.getData("fields")[e]);break;case"datetime":r="date",elementsCond="date-time";break;case"date":r="date",elementsCond="date";break;case"boolean":r="boolean",elementsCond="boolean";break;case"ownerlookup":r="default",elementsCond="user",this.setData("selectUser",!0);break;case"picklist":this.setData("pickList",!0),r="text",elementsCond="picklist",this.setData("selectedField",this.getData("fields")[e]);break;case"lookup":r="text",elementsCond="text"}s.match(/Tag/)&&(r="defWithEmpty",elementsCond="tag",this.setData("showEmpty",!0)),s.match(/Layout/)&&(r="default",elementsCond="layout",this.setData("showEmpty",!0));var l=r+"Conditions";if(this.setData("condArray",this[l]),this.setData("noneCondition",!0),this.setData("betweenCond",!1),this.setData("ageInDaysCond",!1),this.setData("selectCond",r),this.setData("elementsCond",elementsCond),(d=a.querySelector("div.shown"))&&(d.classList.add("hiden"),d.classList.remove("shown")),"none"==r){var d;(d=a.querySelector("div#nonecondition"))&&(d.classList.add("shown"),d.classList.remove("hiden"))}else{var c=a.querySelector("div#conditionDiv");c&&(c.classList.remove("hiden"),c.classList.add("shown"),c.children[0].ltProp("selected","[]"))}this.changeConditionFunction(t,0)},changeAgeInDaysConditionFunction:function(t,e){this.setData("criteriaObject.comparator",this.getData("ageindays")[e].system),this.executeMethod("criteriaArrayObjectUpdate",this.getData("criteriaObject"),this.getData("criteriaIndex"))},methods:{changeField:function(t,e){this.changeFieldFunction(t,e),this.executeMethod("onFieldChangeCall",this.getData("criteriaIndex"),arguments[3].innerText),this.executeMethod("criteriaArrayObjectUpdate",this.getData("criteriaObject"),this.getData("criteriaIndex"))},changeCondition:function(t,e){this.changeConditionFunction(t,e),this.executeMethod("onOperatorChangeCall",this.getData("criteriaIndex"),arguments[3].innerText),this.executeMethod("criteriaArrayObjectUpdate",this.getData("criteriaObject"),this.getData("criteriaIndex"))},onFieldSearch:function(t){0==t.length?this.setData("emptyFieldShow",!0):this.setData("emptyFieldShow",!1)},onConditionSearch:function(t){0==t.length?this.setData("emptyConditionShow",!0):this.setData("emptyConditionShow",!1)},onFieldDropdownShow:function(){var t=this.$node.querySelector("lyte-search.fieldSearchStyle"+this.getData("criteriaIndex"));t&&(t.setValue(""),t.querySelector("input").focus(),this.$node.constructor._actions.onFocusFieldSearch.call(this))},onConditionDropdownShow:function(){var t=this.$node.querySelector("lyte-search.conditionSearchStyle"+this.getData("criteriaIndex"));t&&(t.setValue(""),t.querySelector("input").focus(),this.$node.constructor._actions.onFocusFieldSearch.call(this))},changeAgeInDaysCondition:function(t,e){this.changeAgeInDaysConditionFunction(t,e)}},actions:{createNewCriteria:function(){this.throwEvent("createNewCriteria")},removeCriteria:function(){this.throwEvent("removeCriteria",this.getData("criteriaIndex"))},changeAndOr:function(){this.throwEvent("changeAndOr",this.getData("andOrCondition"),this.getData("criteriaIndex"))},campLookUp:function(){showLookUp("temp_searchcampcv","lyte"+this.getData("criteriaIndex"),"Campaign Name","Campaigns",null,null,null,null,null,null,null,null,"equal")},onFocusFieldSearch:function(){this.$node.querySelector("lyte-search.fieldSearchStyle"+this.getData("criteriaIndex")).setAttribute("style","border-bottom: 1px solid #2d7ad0;")},onFocusOutFieldSearch:function(){this.$node.querySelector("lyte-search.fieldSearchStyle"+this.getData("criteriaIndex")).removeAttribute("style")}}},{mixins:["crux-criteria-conditions"]});