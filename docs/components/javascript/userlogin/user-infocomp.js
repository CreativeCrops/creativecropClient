Lyte.Component.register("user-infocomp", {
_template:"<template tag-name=\"user-infocomp\">\n\n        <div class=\"col l5 m5 hide-on-small-only center\">\n            <div style=\"width: 100%;height: 100px;\"></div>\n            <img src=\"components/images/img/logo/personal.svg\" style=\"width: 60%\">\n            <p class=\"center-align\">One account. All of CreativeCrop's working for you.</p>\n        </div>\n        <div class=\"col l7 m7 s12\">\n            <div class=\"col s12 left\">\n                <img src=\"components/images/img/logo-man.svg\" style=\"width: 40px;\"><br> <label>Creative Crops's</label>\n            </div>\n            <div class=\"col s12\">\n                <h5 class=\"left-align\">welcome to CreativeCrops Account</h5>\n            </div>\n\n            <div class=\"col s12\">\n                <div class=\"col s12 input-field\">\n                    <input type=\"text\" id=\"phone\" required=\"\" class=\"validate\">\n                    <label for=\"phone\">Phone</label>\n                    <span class=\"helper-text\" data-error=\"wrong\" data-success=\"right\">We’ll use your number for account security. It won’t be visible to others.</span>\n                </div>\n\n            </div>\n\n            <div class=\"col s12\">\n                <div class=\"col s4 input-field\">\n                    <select class=\"\">\n                        <option value=\"1\">January</option>\n                        <option value=\"2\">February</option>\n                        <option value=\"3\">March</option>\n                        <option value=\"4\">April</option>\n                        <option value=\"5\">May</option>\n                        <option value=\"6\">June</option>\n                        <option value=\"7\">July</option>\n                        <option value=\"8\">August</option>\n                        <option value=\"9\">September</option>\n                        <option value=\"10\">October</option>\n                        <option value=\"11\">November</option>\n                        <option value=\"12\">December</option>\n                    </select>\n                    <label>year</label>\n                </div>\n                <div class=\"col s4 input-field\">\n                    <input type=\"number\" id=\"day\" required=\"\" class=\"validate\">\n                    <label for=\"day\">Day</label>\n                </div>\n\n\n                <div class=\"col s4 input-field\">\n                    <input type=\"number\" id=\"year\" required=\"\" class=\"validate\">\n                    <label for=\"year\">Year</label>\n                </div>\n\n                <div class=\"col s12\">\n                    <label style=\"position: relative;top: -19px;\">Your birthday</label>\n                </div>\n\n            </div>\n            <div class=\"col s12\">\n                <div class=\"col s12 input-field\">\n                    <select>\n                        <option value=\"2\">Female</option>\n                        <option value=\"1\">Male</option>\n                        <option value=\"3\">Rather not say</option>\n                    </select>\n                    <label>Gender</label>\n                </div>\n            </div>\n\n\n            <div class=\"row \">\n                <div class=\"col s12\">\n                    <br>\n                    <br>\n                    <button onclick=\"{{action('NextOption')}}\" class=\"btn-small waves-effect waves-light green white-text right\" style=\"margin-left: -25px\">Next</button>\n                    <button onclick=\"{{action('preOption')}}\" class=\"btn-small waves-effect waves-light green white-text left\" style=\"margin-right: -25px\">back</button>\n                </div>\n\n            </div>\n\n\n        </div>\n\n</template>",
_dynamicNodes : [{"type":"attr","position":[3,11,1,5]},{"type":"attr","position":[3,11,1,7]}],

	data : function(){
		return {

		}		
	},
	init:function () {

    },
    actions:{
        preOption:function () {
            let e = $('#userdetails');
            e.find("div").addClass("anm1").removeClass("anm")
            e.show();
            $("#userinfocomp").hide()
        },
        NextOption:function (el) {
            $("#userinfocomp").hide();
            let e=$("#useraddresscomp")
            e.find("div").addClass("anm").removeClass("anm1")
            e.show()
        }
	}
});
