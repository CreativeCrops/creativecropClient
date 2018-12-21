Lyte.Component.register("usersetup-comp", {
_template:"<template tag-name=\"usersetup-comp\">\n    <userdetails-comp id=\"userdetails\"></userdetails-comp>\n    <user-infocomp id=\"userinfocomp\" style=\"display: none\"></user-infocomp>\n    <user-addresscomp id=\"useraddresscomp\" style=\"display: none\"></user-addresscomp>\n    <user-infodetailscomp id=\"userinfodetailscomp\" style=\"display: none\"></user-infodetailscomp>\n    <inputparamby-value-comp id=\"inputparambyvaluecomp\" style=\"display: none\"></inputparamby-value-comp>\n    <inputparamby-days-comp id=\"inputparambydayscomp\" style=\"display: none\"></inputparamby-days-comp>\n    <inputparamby-fields-comp id=\"inputparambyfieldscomp\" style=\"display: none\"></inputparamby-fields-comp>\n\n</template>\n<style>.homebg {\n    background-color: #e4e8ea;\n    background-image: url(components/images/blue-triangle.png);\n    background-repeat: no-repeat;\n    background-position: 0 0;\n}\n\n.z-depth-g{\n    width: 100%;\n    border-radius: 4px;\n    box-shadow: 0 2px 8px rgba(211,209,209,0.75);\n    border: none;\n    background-color: white;\n    padding: 20px;\n}\n\n.anm{\n    animation: 0.31s ease-in-out  anm;\n}\n\n\n@keyframes anm {\n    0%{transform: translateX(100%)}\n    100%{transform: translateX(0%)}\n}\n\n.anm1{\n    animation: 0.31s ease-in-out  anm1;\n}\n\n\n@keyframes anm1 {\n    0%{transform: translateX(-100%)}\n    100%{transform: translateX(0%)}\n}</style>",
_dynamicNodes : [{"type":"componentDynamic","position":[1]},{"type":"componentDynamic","position":[3]},{"type":"componentDynamic","position":[5]},{"type":"componentDynamic","position":[7]},{"type":"componentDynamic","position":[9]},{"type":"componentDynamic","position":[11]},{"type":"componentDynamic","position":[13]}],

	data : function(){
		return {

		}		
	}
});
