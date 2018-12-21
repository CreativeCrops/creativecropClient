Lyte.Component.register("user-addresscomp", {
_template:"<template tag-name=\"user-addresscomp\">\n\n\n        <div class=\"col l6 m6 s12\">\n            <div class=\"col s12 left\">\n                <img src=\"components/images/img/logo-man.svg\" style=\"width: 40px;\"><br> <label>Creative Crops's</label>\n            </div>\n            <div class=\"col s12\">\n                <h5 class=\"left-align\">Address of the Account</h5>\n            </div>\n\n            <div class=\"col s12\">\n                <div class=\"col s12 input-field\">\n                    <input type=\"text\" id=\"street\" required=\"\" class=\"validate\">\n                    <label for=\"street\">Street address</label>\n\n                </div>\n            </div>\n\n            <div class=\"col s12\">\n                <div class=\"col s12 input-field\">\n                    <input type=\"text\" id=\"land\" required=\"\" class=\"validate\">\n                    <label for=\"land\">LandMark</label>\n\n                </div>\n            </div>\n\n            <div class=\"col s12\">\n                <div class=\"col s12 input-field\">\n                    <input type=\"text\" id=\"city\" required=\"\" class=\"validate\">\n                    <label for=\"city\">City</label>\n\n                </div>\n            </div>\n\n            <div class=\"col s12\">\n                <div class=\"col s6 input-field\">\n                    <input type=\"text\" id=\"state\" required=\"\" class=\"validate\">\n                    <label for=\"state\">State</label>\n\n                </div>\n\n                <div class=\"col s6 input-field\">\n                    <input type=\"text\" id=\"zip\" required=\"\" class=\"validate\">\n                    <label for=\"zip\">Zip code</label>\n\n                </div>\n            </div>\n\n\n\n            <div class=\"row \">\n                <div class=\"col s12\">\n                    <br>\n                    <br>\n                    <button onclick=\"{{action('NextOption')}}\" class=\"btn-small waves-effect waves-light green white-text right\" style=\"margin-left: -25px\">Next</button>\n                    <button onclick=\"{{action('preOption')}}\" class=\"btn-small waves-effect waves-light green white-text left\" style=\"margin-right: -25px\">back</button>\n                </div>\n\n            </div>\n\n\n        </div>\n        <div class=\"col l6 m6 hide-on-small-only center\">\n            <div style=\"width: 100%;height: 100px;\"></div>\n            <img src=\"components/images/img/logo/umbrella.svg\" class=\"responsive-img\">\n\n        </div>\n\n\n</template>",
_dynamicNodes : [{"type":"attr","position":[1,13,1,5]},{"type":"attr","position":[1,13,1,7]}],

	data : function(){
		return {

		}		
	},
    actions:{
        preOption:function () {
            let e = $('#userinfocomp');
            e.find("div").addClass("anm1").removeClass("anm")
            e.show();
            $("#useraddresscomp").hide()
        },
        NextOption:function (el) {
            $("#useraddresscomp").hide();
            let e=$("#userinfodetailscomp")
            e.find("div").addClass("anm").removeClass("anm1")
            e.show()
        }
    }
});
