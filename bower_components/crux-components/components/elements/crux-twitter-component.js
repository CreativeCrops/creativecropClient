Lyte.Component.register("crux-twitter-component",{_template:'<template tag-name="crux-twitter-component">\t<template is="if" value="{{cxPropValue}}"><template case="true">\t\t<a data-zcqa="dummy" class="link" href="{{cruxRebrandProperty(\'TW_URL\')}}/{{cruxEncodeURL(cxPropValue)}}" target="_blank" data-cid="dummy">{{cruxEncodeHTML(cxPropValue)}}</a>\t\t</template></template></template>',_dynamicNodes:[{type:"attr",position:[1]},{type:"if",position:[1],cases:{true:{dynamicNodes:[{type:"attr",position:[1]},{type:"text",position:[1,0]}]}},default:{}}],_observedAttributes:["cxPropValue","cxPropTwitterUrl","value","cxPropEmptyValue"],data:function(){return{cxPropValue:Lyte.attr("string"),cxPropTwitterUrl:Lyte.attr("string"),value:Lyte.attr("object"),cxPropEmptyValue:Lyte.attr("string",{default:""})}},init:function(){this.getData("cxPropValue")||this.setData("value",this.setData("cxPropEmptyValue"))}});