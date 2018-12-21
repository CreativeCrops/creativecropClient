Lyte.Component.register("welcome-comp",{
_template:"<template tag-name=\"welcome-comp\">\n\t\n\n\t<div class=\"container\">\n\t\t<div class=\"row \">\n\t\t\t<div class=\"col l12 m12 s12\">\n\t\t\t\t<div style=\"width: 100%;height: 100px;\"></div>\n\t\t\t</div>\n\t\t\t<div class=\"l10 offset-l1 s12 m12 col z-depth-g\" style=\"padding: 20px;overflow: hidden\" id=\"setupoutlet\">\n\n\n\t\t\t</div>\n\t\t</div>\n\t</div>\n\n</template>",
_dynamicNodes : [],
_observedAttributes :["features"],
	data : function(){
		return {
			features : Lyte.attr("array")
		}
	}
});
