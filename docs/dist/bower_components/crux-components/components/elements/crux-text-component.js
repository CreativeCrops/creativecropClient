Lyte.Component.register("crux-text-component",{_template:'<template tag-name="crux-text-component">\t<template is="switch" value="{{cxPropFrom}}"><template case="view">{{cxPropValue}}</template><template case="criteria"></template><template case="filter"></template><template case="create">\t\t\t<template is="if" value="{{cxPropYield}}"><template case="true">\t\t\t\t<div class="customLabel">{{cxPropLabel}}</div>\t\t\t\t<div class="customControlothrs pRtop">\t\t\t\t\t<lyte-yield yield-name="yield"></lyte-yield>\t\t\t\t\t<div style="display: inline-block;">\t\t\t\t\t\t<lyte-input lt-prop-class="borderBottom" lt-prop-type="text" lt-prop-value="{{lbind(cxPropValue)}}" lt-prop-maxlength="{{cxPropMaxlength}}" lt-prop-direction="horizontal"> </lyte-input>\t\t\t\t\t</div>\t\t\t\t</div>\t\t\t</template><template case="false">\t\t\t\t<lyte-input lt-prop-class="borderBottom" lt-prop-type="text" lt-prop-value="{{lbind(cxPropValue)}}" lt-prop-placeholder="{{cxPropPlaceHolder}}" lt-prop-label="{{cxPropLabel}}" lt-prop-maxlength="{{cxPropMaxlength}}" lt-prop-direction="horizontal"> </lyte-input>\t\t\t</template></template>\t\t</template></template></template>',_dynamicNodes:[{type:"attr",position:[1]},{type:"switch",position:[1],cases:{view:{dynamicNodes:[{type:"text",position:[0]}]},criteria:{dynamicNodes:[],additional:{next:"filter"}},filter:{dynamicNodes:[],additional:{next:"create"}},create:{dynamicNodes:[{type:"attr",position:[1]},{type:"if",position:[1],cases:{true:{dynamicNodes:[{type:"text",position:[1,0]},{type:"insertYield",position:[3,1]},{type:"attr",position:[3,3,1]},{type:"componentDynamic",position:[3,3,1]}]},false:{dynamicNodes:[{type:"attr",position:[1]},{type:"componentDynamic",position:[1]}]}},default:{}}]}},default:{}}],_observedAttributes:["cxPropValue","cxPropFrom","cxPropPlaceHolder","cxPropField","cxPropLabel","cxPropMaxlength","cxPropYield"],data:function(){return{cxPropValue:Lyte.attr("string"),cxPropFrom:Lyte.attr("string",{default:"view"}),cxPropPlaceHolder:Lyte.attr("string"),cxPropField:Lyte.attr("object"),cxPropLabel:Lyte.attr("string",{default:""}),cxPropMaxlength:Lyte.attr("number"),cxPropYield:Lyte.attr("boolean",{default:!1})}},validate:function(){var t=this.getData("cxPropValue");return t&&""!=t?!(t.replace(/^\s+/g,"").replace(/\s+$/g,"").indexOf("*")>-1)||(alert(_cruxUtils.getI18n("crm.alert.character.not.allowed"),"*"),this.$node.querySelector("input").focus(),!1):(alert(_cruxUtils.getI18n("crm.field.valid.check",this.getData("cxPropField").field_label)),this.$node.querySelector("input").focus(),!1)},getValue:function(){return this.getData("cxPropValue")}});