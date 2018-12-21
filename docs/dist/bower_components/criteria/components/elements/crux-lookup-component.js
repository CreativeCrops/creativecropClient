Lyte.Component.register("crux-lookup-component",{_template:'<template tag-name="crux-lookup-component">\t<template is="switch" value="{{cxPropFrom}}"><template case="criteria">\t\t\t<lyte-dropdown on-before-show="{{method(\'onBeforeShow\')}}" on-scroll="{{method(&quot;onBodyScroll&quot;)}}" lt-prop-yield="true" on-add="{{method(\'addToList\')}}" on-remove="{{method(\'removeFromList\')}}" lt-prop-type="multisearch" lt-prop-tabindex="14">\t\t\t\t<template is="registerYield" yield-name="yield">\t\t\t\t\t<lyte-drop-button class="outerbox1">\t\t\t\t\t\t<template is="for" items="{{renderItems}}" item="selitem" index="indeval">\t\t\t\t\t\t\t<span class="singleItem" data-value="selitem[\'value\']">\t\t\t\t\t\t\t\tselitem[\'name\']\t\t\t\t\t\t\t\t<lyte-drop-remove class="boxclose"></lyte-drop-remove>\t\t\t\t\t\t\t</span>\t\t\t\t\t\t</template>\t\t\t\t\t\t<lyte-input onkeyup="{{action(\'onKeyUpSearch\',event)}}" onkeydown="{{action(\'onKeyDownSearch\',event)}}" lt-prop-value="{{lbind(cxPropInputValue)}}" lt-prop-type="text" lt-prop-direction="vertical"> </lyte-input>\t\t\t\t\t\t\t\t\t\t\t\t\t</lyte-drop-button>\t\t\t\t\t<lyte-drop-box>\t\t\t\t\t\t<lyte-drop-body class="lookUp{{cxPropModule}}">\t\t\t\t\t\t\t<template is="for" items="{{systemData}}" item="item" index="indeval">\t\t\t\t\t\t\t\t<lyte-drop-item data-value="{{item[cxPropValueSelector]}}"> {{item[cxPropFieldSelector]}} </lyte-drop-item>\t\t\t\t\t\t\t</template>\t\t\t\t\t\t\t<template is="if" value="{{cxPropInputValue}}"><template case="true">\t\t\t\t\t\t\t\t<lyte-drop-item data-value="{{cxPropInputValue}}">{{cxPropInputValue}}</lyte-drop-item>\t\t\t\t\t\t\t</template></template>\t\t\t\t\t\t\t<template is="if" value="{{expHandlers(expHandlers(systemData.length,\'==\',0),\'&amp;&amp;\',expHandlers(cxPropInputValue,\'!\'))}}"><template case="true">\t\t\t\t\t\t\t\t<div class="showNoResultDiv">{{cruxGetI18n(\'None\')}}</div>\t\t\t\t\t\t\t</template></template>\t\t\t\t\t\t</lyte-drop-body>\t\t\t\t\t</lyte-drop-box>\t\t\t\t</template>\t\t\t</lyte-dropdown>\t\t</template><template case="filter">\t\t\t\t\t</template><template case="view">\t\t\t<link-to data-zcqa="{{cxPropZcqa}}" lt-prop-route="{{cxPropRouteName}}" lt-prop-dp="{{cxPropDynamicParams}}" lt-prop-qp="{{cxPropQueryParams}}" lt-prop-id="{{cxPropId}}" lt-prop-td="{{cxPropTransitionData}}" lt-prop-class="link">\t\t\t\t<template is="if" value="{{expHandlers(cxPropIconClass,\'&amp;&amp;\',cxPropValue)}}"><template case="true">\t\t\t\t\t<div class="{{cxPropIconClass}}"></div>\t\t\t\t</template></template>\t\t\t{{cxPropValue}}\t\t\t</link-to>\t\t</template></template></template>',_dynamicNodes:[{type:"attr",position:[1]},{type:"switch",position:[1],cases:{criteria:{dynamicNodes:[{type:"attr",position:[1]},{type:"registerYield",position:[1,1],dynamicNodes:[{type:"attr",position:[1,1]},{type:"for",position:[1,1],dynamicNodes:[{type:"componentDynamic",position:[1,1]}]},{type:"attr",position:[1,3]},{type:"componentDynamic",position:[1,3]},{type:"componentDynamic",position:[1]},{type:"attr",position:[3,1]},{type:"attr",position:[3,1,1]},{type:"for",position:[3,1,1],dynamicNodes:[{type:"attr",position:[1]},{type:"text",position:[1,1]},{type:"componentDynamic",position:[1]}]},{type:"attr",position:[3,1,3]},{type:"if",position:[3,1,3],cases:{true:{dynamicNodes:[{type:"attr",position:[1]},{type:"text",position:[1,0]},{type:"componentDynamic",position:[1]}]}},default:{}},{type:"attr",position:[3,1,5]},{type:"if",position:[3,1,5],cases:{true:{dynamicNodes:[{type:"text",position:[1,0]}]}},default:{}},{type:"componentDynamic",position:[3,1]},{type:"componentDynamic",position:[3]}]},{type:"componentDynamic",position:[1]}]},filter:{dynamicNodes:[]},view:{dynamicNodes:[{type:"attr",position:[1]},{type:"attr",position:[1,1]},{type:"if",position:[1,1],cases:{true:{dynamicNodes:[{type:"attr",position:[1]}]}},default:{}},{type:"text",position:[1,3]},{type:"componentDynamic",position:[1]}]}},default:{}}],_observedAttributes:["cxPropModule","cxPropValue","cxPropRouteName","cxPropZcqa","cxPropDynamicParams","cxPropQueryParams","cxPropTransitionData","cxPropIconClass","cxPropId","cxPropFrom","cxPropExclude","currentPos","localData","pageNo","noMoreRecord","cxPropRecord","systemData","cxPropModuleName","cxPropCacheQuery","cxPropDataCache","cxPropPerPage","isSearch","cxPropSearchCount","cxPropInputValue","cxPropMinLength","cxPropValueSelector","cxPropFieldSelector","cxPropEmptyValue"],data:function(){return{cxPropModule:Lyte.attr("string"),cxPropValue:Lyte.attr("string"),cxPropRouteName:Lyte.attr("string"),cxPropZcqa:Lyte.attr("string"),cxPropDynamicParams:Lyte.attr("string"),cxPropQueryParams:Lyte.attr("string"),cxPropTransitionData:Lyte.attr("string"),cxPropIconClass:Lyte.attr("string"),cxPropId:Lyte.attr("string"),cxPropFrom:Lyte.attr("string",{default:"view"}),cxPropExclude:Lyte.attr("array",{default:[]}),currentPos:Lyte.attr("number",{default:0}),localData:Lyte.attr("array",{default:[]}),pageNo:Lyte.attr("number",{default:1}),noMoreRecord:Lyte.attr("boolean",{default:!0}),cxPropRecord:Lyte.attr("number",{default:50}),systemData:Lyte.attr("array",{default:[]}),cxPropModuleName:Lyte.attr("string"),cxPropCacheQuery:Lyte.attr("boolean",{default:!1}),cxPropDataCache:Lyte.attr("boolean",{default:!1}),cxPropPerPage:Lyte.attr("number",{default:200}),isSearch:Lyte.attr("boolean",{default:!1}),cxPropSearchCount:Lyte.attr("number",{default:500}),cxPropInputValue:Lyte.attr("string",{default:""}),cxPropMinLength:Lyte.attr("number",{default:2}),cxPropValueSelector:Lyte.attr("string",{default:"id"}),cxPropFieldSelector:Lyte.attr("string",{default:""}),cxPropEmptyValue:Lyte.attr("string",{default:""})}},init:function(){this.getData("cxPropModule")&&this.setData("cxPropModuleName",moduleRecordMapping[this.getData("cxPropModule")].id),"view"!=this.getData("cxPropFrom")||this.getData("cxPropValue")||this.setData("cxPropValue",this.getData("cxPropEmptyValue"))},actions:{onKeyUpSearch:function(t){var e="lookUp"+this.getData("cxPropModule"),o=document.querySelector("."+e);this.keyup.call(this,"lookupComponent",o,t)},stopPropgation:function(){event.stopPropagation()}},methods:{addToList:function(t,e,o){for(var a=this.getData("systemData"),r=0;r<a.length&&a[r][this.getData("cxPropValueSelector")]!=e;r++);if(e==this.getData("cxPropInputValue")){var p={[this.getData("cxPropFieldSelector")]:cxPropInputValue,[this.getData("cxPropValueSelector")]:cxPropInputValue};Lyte.arrayUtils(this.getData("renderItems"),"push",p)}Lyte.arrayUtils(this.getData("renderItems"),"push",a[r])},removeFromList:function(t,e,o){for(var a=0;a<this.getData("renderItems").length;a++)this.getData("renderItems")[a][this.getData("cxPropValueSelector")]==e&&Lyte.arrayUtils(this.getData("renderItems"),"removeAt",a,1)},onBeforeShow:function(){this.constructArray.call(this,"lookupComponent",!1)},onBodyScroll:function(t){this.bodyScroll.call(this,"lookupComponent",t)}},setCriteria:function(){var t;this.getData("isSearch")?t={criteria:this.getData("cxPropFieldSelector")+":starts_with:"+this.getData("cxPropInputValue")}:t={fields:[this.getData("cxPropFieldSelector")]};return t},getValue:function(){for(var t=this.getData("renderItems")[0][this.getData("cxPropValueSelector")],e=1;e<this.getData("renderItems").length;e++)t=t+","+this.getData("renderItems")[e][this.getData("cxPropValueSelector")];return t},moduleNameObserver:function(){this.setData("cxPropModuleName",moduleRecordMapping[this.getData("cxPropModule")].id)}.observes("cxPropModule")},{mixins:["crux-user-utils"]});