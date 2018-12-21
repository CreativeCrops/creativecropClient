Lyte.Component.register("crux-sharing-options-dropitem",{_template:'<template tag-name="crux-sharing-options-dropitem">\t<div class="scrollingDiv{{cxPropRequest}}" onscroll="{{action(\'onScrollDiv\',event)}}" style="overflow : auto; height: 150px;">\t\t<template is="for" items="{{systemData}}" item="item" index="index">\t\t\t<lyte-drop-item data-value="{{cxPropPrefix}}:{{item[cxPropIdSelector]}}" onclick="{{action(\'onClickDropitem\')}}">{{item[cxPropNameSelector]}}</lyte-drop-item>\t\t</template><template is="if" value="{{expHandlers(expHandlers(expHandlers(systemData.length,\'==\',0),\'||\',showNoResult),\'||\',expHandlers(onShow,\'==\',0))}}"><template case="true">\t\t\t<div class="showNoResultDiv">{{cruxGetI18n(\'None\')}}</div>\t\t</template></template>\t</div>\t<lyte-search class="lyteSearch{{cxPropRequest}}" lt-prop-query-selector="{&quot;scope&quot;:&quot;.scrollingDiv{{cxPropRequest}}&quot;,&quot;search&quot;:&quot;lyte-drop-item:not(.lyteDropdownActive&quot;}" on-search="{{method(\'showNoResult\')}}" style="display: none;">\t\t\t</lyte-search></template>',_dynamicNodes:[{type:"attr",position:[1]},{type:"attr",position:[1,1]},{type:"for",position:[1,1],dynamicNodes:[{type:"attr",position:[1]},{type:"text",position:[1,0]},{type:"componentDynamic",position:[1]}]},{type:"attr",position:[1,2]},{type:"if",position:[1,2],cases:{true:{dynamicNodes:[{type:"text",position:[1,0]}]}},default:{}},{type:"attr",position:[3]},{type:"componentDynamic",position:[3]}],_observedAttributes:["cxPropIdSelector","cxPropNameSelector","cxPropRequest","cxPropPrefix","cxPropExclude","currentPos","localData","pageNo","noMoreRecord","cxPropRecord","systemData","cxPropModuleName","cxPropCacheQuery","cxPropDataCache","cxPropPerPage","isSearch","cxPropSearchCount","cxPropInputValue","cxPropMinLength","cxPropSearchAction","showNoResult","onShow"],data:function(){return{cxPropIdSelector:Lyte.attr("string",{default:"id"}),cxPropNameSelector:Lyte.attr("string",{default:"name"}),cxPropRequest:Lyte.attr("string"),cxPropPrefix:Lyte.attr("string"),cxPropExclude:Lyte.attr("array",{default:[]}),currentPos:Lyte.attr("number",{default:0}),localData:Lyte.attr("array",{default:[]}),pageNo:Lyte.attr("number",{default:1}),noMoreRecord:Lyte.attr("boolean",{default:!0}),cxPropRecord:Lyte.attr("number",{default:50}),systemData:Lyte.attr("array",{default:[]}),cxPropModuleName:Lyte.attr("string"),cxPropCacheQuery:Lyte.attr("boolean",{default:!1}),cxPropDataCache:Lyte.attr("boolean",{default:!1}),cxPropPerPage:Lyte.attr("number",{default:200}),isSearch:Lyte.attr("boolean",{default:!1}),cxPropSearchCount:Lyte.attr("number",{default:500}),cxPropInputValue:Lyte.attr("string",{default:""}),cxPropMinLength:Lyte.attr("number",{default:2}),cxPropSearchAction:Lyte.attr("boolean",{default:!1}),showNoResult:Lyte.attr("boolean",{default:!1}),onShow:Lyte.attr("number",{default:0})}},init:function(){this.setData("cxPropModuleName",this.getData("cxPropRequest")),void 0==this.getData("cxPropIdSelector")&&this.setData("cxPropIdSelector","id"),void 0==this.getData("cxPropNameSelector")&&this.setData("cxPropNameSelector","name"),void 0==this.getData("cxPropSearchAction")&&this.setData("cxPropSearchAction",!1)},actions:{onScrollDiv:function(t){this.bodyScroll.call(this,"sharingUsers",t)},onClickDropitem:function(){this.checkDropitem()}},methods:{showNoResult:function(t){0==t.length?this.setData("showNoResult",!0):this.setData("showNoResult",!1)}},getItems:function(){this.setData("isSearch",!1),this.setData("cxPropInputValue",""),this.constructArray.call(this,"sharingUsers",!1)},setCriteria:function(){return this.getData("isSearch")?{criteria:"((first_name:starts_with:"+this.getData("cxPropInputValue")+")or(last_name:starts_with:"+this.getData("cxPropInputValue")+")or(email:starts_with:"+this.getData("cxPropInputValue")+"))"}:{}},updateInputValue:function(t){if(this.setData("cxPropInputValue",t),this.getData("cxPropSearchAction")){var e=document.querySelector(".scrollingDiv"+this.getData("cxPropRequest"));this.keyup.call(this,"sharingUsers",e,null)}else{document.querySelector(".lyteSearch"+this.getData("cxPropRequest")).setValue(this.getData("cxPropInputValue"))}},removeNone:function(){this.setData("showNoResult",!1)},systemDataObserver:function(){this.executeMethod("changeSelected"),this.checkDropitem()}.observes("systemData.[]"),checkDropitem:function(){var t=document.querySelector(".scrollingDiv"+this.getData("cxPropRequest"));m;for(var e=0;e<t.childElementCount;e++)"LYTE-DROP-ITEM"!=t.children[e].tagName||t.children[e].classList.contains("lyteDropdownActive")||this.setData("onShow",this.getData("onShow")+1)}},{mixins:["crux-user-utils"]});