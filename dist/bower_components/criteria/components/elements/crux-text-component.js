Lyte.Component.register("crux-text-component",{_template:'<template tag-name="crux-text-component">\t<template is="switch" value="{{cxPropFrom}}"><template case="view">{{cxPropValue}}</template><template case="criteria"></template><template case="filter">\t\t\t<lyte-input lt-prop-class="borderBottom" lt-prop-type="text" lt-prop-value="{{lbind(cxPropValue)}}" lt-prop-placeholder="{{cxPropPlaceHolder}}"> </lyte-input>\t\t</template></template></template>',_dynamicNodes:[{type:"attr",position:[1]},{type:"switch",position:[1],cases:{view:{dynamicNodes:[{type:"text",position:[0]}]},criteria:{dynamicNodes:[],additional:{next:"filter"}},filter:{dynamicNodes:[{type:"attr",position:[1]},{type:"componentDynamic",position:[1]}]}},default:{}}],_observedAttributes:["cxPropValue","cxPropFrom","cxPropPlaceHolder","cxPropField"],data:function(){return{cxPropValue:Lyte.attr("string"),cxPropFrom:Lyte.attr("string",{default:"view"}),cxPropPlaceHolder:Lyte.attr("string"),cxPropField:Lyte.attr("object")}},validate:function(){var t=this.getData("cxPropValue");return t&&""!=t?!(t.replace(/^\s+/g,"").replace(/\s+$/g,"").indexOf("*")>-1)||(alert(_cruxUtils.getI18n("crm.alert.character.not.allowed"),"*"),this.$node.querySelector("input").focus(),!1):(alert(_cruxUtils.getI18n("crm.field.valid.check",this.getData("cxPropField").field_label)),this.$node.querySelector("input").focus(),!1)},getValue:function(){return this.getData("cxPropValue")}});