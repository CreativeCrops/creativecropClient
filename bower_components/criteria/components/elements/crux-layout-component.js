Lyte.Component.register("crux-layout-component",{_template:'<template tag-name="crux-layout-component">\t<template is="switch" value="{{cxPropFrom}}"><template case="view">\t\t{{cxPropValue.name}}\t\t\t</template><template case="filter"></template><template case="criteria">\t\t\t<lyte-dropdown lt-prop-yield="true" lt-prop-type="multisearch" lt-prop-tabindex="1" on-add="{{method(\'addToList\')}}" on-remove="{{method(\'removeFromList\')}}" lt-prop-disabled-list="{{disabledList}}">\t\t\t\t<template is="registerYield" yield-name="yield">\t\t\t\t\t<lyte-drop-button class="outerbox1">\t\t\t\t\t\t<template is="for" items="{{value}}" item="layout" index="index">\t\t\t\t\t\t\t<span class="singleItem" data-value="{{layout.id}}">{{layout.name}}<lyte-drop-remove class="boxclose">x</lyte-drop-remove></span>\t\t\t\t\t\t</template>\t\t\t\t\t\t<lyte-search lt-prop-type="text" lt-prop-query-selector="{&quot;scope&quot;:&quot;.parentscope_layout&quot;, &quot;target&quot;:&quot;.cruxlayoutList&quot;, &quot;search&quot;:&quot;lyte-drop-item&quot;}" on-search="{{method(\'showNoResult\', cxPropField)}}" id="search_layout" lt-prop-placeholder="{{cruxGetI18n(\'None\')}}"></lyte-search>\t\t\t\t\t</lyte-drop-button>\t\t\t\t\t<lyte-drop-box>\t\t\t\t\t\t<lyte-drop-body class="parentscope_layout">\t\t\t\t\t\t\t\t<template is="for" items="{{layout}}" item="layout" index="index">\t\t\t\t\t\t\t\t\t<lyte-drop-item class="picklist_values" data-value="{{layout.id}}">{{layout.name}}</lyte-drop-item>\t\t\t\t\t\t\t\t</template>\t\t\t\t\t\t\t<template is="if" value="{{expHandlers(layoutLength,\'!\')}}"><template case="true">\t\t\t\t\t\t\t\t<lyte-drop-item class="picklist_values lyteDropdown-disabled">{{cruxGetI18n(\'crm.label.no.options.found\')}}</lyte-drop-item>\t\t\t\t\t\t\t</template></template>\t\t\t\t\t\t</lyte-drop-body>\t\t\t\t\t</lyte-drop-box>\t\t\t\t</template>\t\t\t</lyte-dropdown>\t\t</template></template></template>',_dynamicNodes:[{type:"attr",position:[1]},{type:"switch",position:[1],cases:{view:{dynamicNodes:[{type:"text",position:[1]}]},filter:{dynamicNodes:[],additional:{next:"criteria"}},criteria:{dynamicNodes:[{type:"attr",position:[1]},{type:"registerYield",position:[1,1],dynamicNodes:[{type:"attr",position:[1,1]},{type:"for",position:[1,1],dynamicNodes:[{type:"attr",position:[1]},{type:"text",position:[1,0]},{type:"componentDynamic",position:[1,2]}]},{type:"attr",position:[1,3]},{type:"componentDynamic",position:[1,3]},{type:"componentDynamic",position:[1]},{type:"attr",position:[3,1,1]},{type:"for",position:[3,1,1],dynamicNodes:[{type:"attr",position:[1]},{type:"text",position:[1,0]},{type:"componentDynamic",position:[1]}]},{type:"attr",position:[3,1,3]},{type:"if",position:[3,1,3],cases:{true:{dynamicNodes:[{type:"text",position:[1,0]},{type:"componentDynamic",position:[1]}]}},default:{}},{type:"componentDynamic",position:[3,1]},{type:"componentDynamic",position:[3]}]},{type:"componentDynamic",position:[1]}]}},default:{}}],_observedAttributes:["cxPropValue","cxPropFrom","cxPropModule","layout","layoutLength","disabledList","cxPropEmptyValue"],data:function(){return{cxPropValue:Lyte.attr("object"),cxPropFrom:Lyte.attr("string",{default:"view"}),cxPropModule:Lyte.attr("string"),layout:Lyte.attr("array"),layoutLength:Lyte.attr("boolean",{default:!0}),disabledList:Lyte.attr("array",{default:["cruxDisabled"]}),cxPropEmptyValue:Lyte.attr("string",{default:""})}},init:function(){var t=this.getData("cxPropFrom");"criteria"==t||"filter"==t?(this.setData("layout",store.peekAll("layout",{module:this.getData("cxPropModule")})),0==this.getData("layout").length&&this.setData("layoutLength",!1)):this.getData("cxPropValue")||this.setData("value",this.getData("cxPropEmptyValue"))},methods:{addToList:function(t,e,o){Lyte.arrayUtils(this.getData("value"),"push",this.getData("layout").filterBy({id:e})[0]),this.$node.querySelector("lyte-search").ltProp("placeholder",""),this.getData("layout").length==JSON.parse(o).length&&this.setData("layoutLength",!1)},removeFromList:function(t,e){for(var o=this.getData("value"),a=0;a<o.length;a++)if(o[a].id==e){Lyte.arrayUtils(this.getData("value"),"removeAt",a);break}this.setData("layoutLength",!0)}},getValue:function(){return JSON.stringify(this.getData("value"))},valiate:function(){return!0}});