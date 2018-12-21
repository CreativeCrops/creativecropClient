Lyte.Component.register("crux-sortable-dropdown",{_template:'<template tag-name="crux-sortable-dropdown">\t<lyte-dropdown lt-prop-yield="true" on-add="{{method(\'addToList\')}}" on-remove="{{method(\'removeFromList\')}}" lt-prop-type="multisearch" lt-prop-tabindex="14" lt-prop-remove-multiple="true" style="width:400px; height : 10px;" lt-prop-selected="{{selectedIds}}"> \t\t<template is="registerYield" yield-name="yield">\t\t\t<lyte-drop-button class="multiSortDropButton">\t\t\t\t<template is="if" value="{{cxPropDropbuttonYield}}"><template case="true">\t\t\t\t\t<lyte-yield yield-name="dropbuttonYield"></lyte-yield>\t\t\t\t</template><template case="false"><template is="for" items="{{renderItems}}" item="selitem" index="indeval">\t\t\t\t\t\t<span class="singleItem" data-value="{{selitem[cxPropIdSelector]}}">\t\t\t\t\t\t\t{{selitem[cxPropNameSelector]}}\t\t\t\t\t\t\t<lyte-drop-remove class="boxclose">x</lyte-drop-remove>\t\t\t\t\t\t</span>\t\t\t\t\t</template></template></template>\t\t\t\t<lyte-search class="search" lt-prop-query-selector="{&quot;scope&quot;:&quot;lyte-drop-box:not(.lyteDropdownHidden) .parentscope&quot;,&quot;search&quot;:&quot;lyte-drop-item&quot;}" on-search="{{method(\'showNoResult\')}}" lt-prop-type="text">\t\t\t\t</lyte-search>\t\t\t</lyte-drop-button>\t\t\t<lyte-drop-box>\t\t\t\t<lyte-drop-body class="multiSortDropdown">\t\t\t\t\t<template is="if" value="{{cxPropDropbodyYield}}"><template case="true">\t\t\t\t\t\t<lyte-yield yield-name="dropbodyYield"></lyte-yield>\t\t\t\t\t</template><template case="false"><template is="for" items="{{dropdowndata}}" item="item" index="indeval">\t\t\t\t\t\t<lyte-drop-item data-value="{{item[cxPropIdSelector]}}"> {{item[cxPropNameSelector]}} </lyte-drop-item>\t\t\t\t\t</template></template></template>\t\t\t\t</lyte-drop-body>\t\t\t</lyte-drop-box>\t\t</template>\t</lyte-dropdown></template>',_dynamicNodes:[{type:"attr",position:[1]},{type:"registerYield",position:[1,1],dynamicNodes:[{type:"attr",position:[1,1]},{type:"if",position:[1,1],cases:{true:{dynamicNodes:[{type:"insertYield",position:[1]}]},false:{dynamicNodes:[{type:"attr",position:[0]},{type:"for",position:[0],dynamicNodes:[{type:"attr",position:[1]},{type:"text",position:[1,1]},{type:"componentDynamic",position:[1,3]}]}]}},default:{}},{type:"attr",position:[1,3]},{type:"componentDynamic",position:[1,3]},{type:"componentDynamic",position:[1]},{type:"attr",position:[3,1,1]},{type:"if",position:[3,1,1],cases:{true:{dynamicNodes:[{type:"insertYield",position:[1]}]},false:{dynamicNodes:[{type:"attr",position:[0]},{type:"for",position:[0],dynamicNodes:[{type:"attr",position:[1]},{type:"text",position:[1,1]},{type:"componentDynamic",position:[1]}]}]}},default:{}},{type:"componentDynamic",position:[3,1]},{type:"componentDynamic",position:[3]}]},{type:"componentDynamic",position:[1]}],_observedAttributes:["renderItems","dropdowndata","cxPropAvailable","cxPropSelected","selectedIds","sortedIds","cxPropNameSelector","cxPropIdSelector","calledWithIn","cxPropDropbuttonYield","cxPropDropbodyYield","cxPropSortable"],data:function(){return{renderItems:Lyte.attr("array",{default:[]}),dropdowndata:Lyte.attr("array"),cxPropAvailable:Lyte.attr("array"),cxPropSelected:Lyte.attr("array"),selectedIds:Lyte.attr("string"),sortedIds:Lyte.attr("array",{default:[]}),cxPropNameSelector:Lyte.attr("string",{default:"name"}),cxPropIdSelector:Lyte.attr("string",{default:"id"}),calledWithIn:Lyte.attr("boolean",{default:!1}),cxPropDropbuttonYield:Lyte.attr("boolean",{default:!1}),cxPropDropbodyYield:Lyte.attr("boolean",{default:!1}),cxPropSortable:Lyte.attr("boolean",{default:!0})}},init:function(){if(this.getData("cxPropAvailable")){this.setData("dropdowndata",this.getData("cxPropAvailable"));for(var t=this.getData("dropdowndata"),e=0;e<t.length;e++)for(var o=0;o<this.getData("cxPropSelected").length;o++)t[e][this.getData("cxPropIdSelector")]==this.getData("cxPropSelected")[o]&&Lyte.arrayUtils(this.getData("renderItems"),"push",t[e]);this.setData("selectedIds",JSON.stringify(this.getData("cxPropSelected")))}},didConnect:function(){var t=this;this.getData("cxPropSortable")&&$L(".multiSortDropButton").sortable({placeholder:"lyteSortablePlaceholder",restrict:".search",onBeforeDrop:function(e){t.getMethods("onBeforeSort")&&t.executeMethod("onBeforeSort",e)},onDrop:function(e,o){t.getSelected(),t.getMethods("onSort")&&t.executeMethod("onSort",droppableElement,o)}})},methods:{addToList:function(t,e,o){for(var a=this.getData("dropdowndata"),r=0;r<a.length&&a[r][this.getData("cxPropIdSelector")]!=e;r++);Lyte.arrayUtils(this.getData("renderItems"),"push",a[r]),this.getSelected(),this.getData("cxPropSortable")&&$L(".multiSortDropButton").sortable({placeholder:"lyteSortablePlaceholder"}),this.getMethods("onSelect")&&this.executeMethod("onSelect",t,e,o)},removeFromList:function(t,e,o){for(var a=0;a<this.getData("renderItems").length;a++)for(var r=0;r<e.length;r++)this.getData("renderItems")[a][this.getData("cxPropIdSelector")]==e[r]&&Lyte.arrayUtils(this.getData("renderItems"),"removeAt",a,1);this.getSelected(),this.getData("cxPropSortable")&&$L(".multiSortDropButton").sortable({placeholder:"lyteSortablePlaceholder"}),this.getMethods("onDeselect")&&this.executeMethod("onDeselect",t,e,o)},showNoResult:function(t){this.searchFunction(t)}},searchFunction:function(t){if(0==t.length){if(document.querySelector(".noresultstyle"))return;var e=document.querySelector(".multiSortDropdown"),o=document.createElement("div");o.setAttribute("class","noresultstyle"),o.textContent="No Results Found",e.appendChild(o)}else{var a=document.querySelector(".noresultstyle");a&&a.remove()}},getSelected:function(){var t,e=document.querySelector("lyte-drop-button.multiSortDropButton");for(i=0;i<e.childNodes.length;i++)"SPAN"==(t=e.childNodes[i]).nodeName&&Lyte.arrayUtils(this.getData("sortedIds"),"push",t.getAttribute("data-value"));this.setData("calledWithIn",!0),this.setData("cxPropSelected",this.getData("sortedIds")),this.setData("sortedIds",[])},changeAvailableObserverFunction:function(){this.setData("dropdowndata",this.getData("cxPropAvailable")),this.setData("selectedIds","[]"),this.setData("selectedIds",JSON.stringify(this.getData("cxPropSelected")))},changeSelectedObserverFunction:function(){this.setData("renderItems",[]);for(var t=this.getData("dropdowndata"),e=0;e<t.length;e++)for(var o=0;o<this.getData("cxPropSelected").length;o++)t[e][this.getData("cxPropIdSelector")]==this.getData("cxPropSelected")[o]&&Lyte.arrayUtils(this.getData("renderItems"),"push",t[e]);this.getData("cxPropSortable")&&$L(".multiSortDropButton").sortable({placeholder:"lyteSortablePlaceholder"}),this.setData("selectedIds",JSON.stringify(this.getData("cxPropSelected")))},changeAvailable:function(){this.changeAvailableObserverFunction()}.observes("cxPropAvailable.[]"),changeSelected:function(){this.getData("calledWithIn")||this.changeSelectedObserverFunction(),this.setData("calledWithIn",!1)}.observes("cxPropSelected")});