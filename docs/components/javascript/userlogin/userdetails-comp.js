Lyte.Component.register("userdetails-comp", {
_template:"<template tag-name=\"userdetails-comp\">\n\n    <div class=\"col l7 m7 s12\">\n        <div class=\"col s12 left\">\n            <img src=\"components/images/img/logo-man.svg\" style=\"width: 40px;\"><br> <label>Creative Crops's</label>\n        </div>\n        <div class=\"col s12\">\n            <h5 class=\"left-align\">Create your CreativeCrops Account</h5>\n        </div>\n\n        <div class=\"col s12\">\n            <div class=\"col s6 input-field\">\n                <input type=\"text\" id=\"fname\" required=\"\" class=\"validate\">\n                <label for=\"fname\">First Name</label>\n            </div>\n            <div class=\"col s6 input-field\">\n                <input type=\"text\" id=\"lname\" class=\"validate\">\n                <label for=\"lname\">Last Name</label>\n            </div>\n        </div>\n\n        <div class=\"col s12\">\n            <div class=\"col s12 input-field\">\n                <input type=\"email\" id=\"email\" class=\"validate\" required=\"\">\n                <label for=\"email\">Last Name</label>\n                <span class=\"helper-text\" data-error=\"wrong\" data-success=\"right\">You can use letters, numbers &amp; periods</span>\n            </div>\n        </div>\n        <div class=\"col s12\">\n            <div class=\"col s6 input-field\" required=\"\">\n                <input type=\"password\" id=\"password\" required=\"\" class=\"validate\">\n                <label for=\"password\">Password</label>\n            </div>\n            <div class=\"col s6 input-field\" required=\"\">\n                <input type=\"password\" id=\"cpassword\" class=\"validate\">\n                <label for=\"cpassword\">Confirm Password</label>\n            </div>\n            <div class=\"col s12\">\n                <label class=\"helper-text\" style=\"position: relative;top: -10px\">Use 8 or more characters with a mix of letters, numbers &amp; symbols</label>\n            </div>\n\n        </div>\n\n        <div class=\"row \">\n            <div class=\"col s12\">\n                <br>\n                <br>\n                <button type=\"submit\" onclick=\"{{action('NextOption')}}\" class=\"btn-small waves-effect waves-light green lighten-2 white-text right\" style=\"margin-left: -25px\">Next</button>\n            </div>\n\n        </div>\n\n\n    </div>\n\n    <div class=\"col l5 m5 hide-on-small-only center\">\n        <div style=\"width: 100%;height: 100px;\"></div>\n        <img src=\"components/images/img/logo/account.svg\" style=\"width: 60%\">\n        <p class=\"center-align\">One account. All of CreativeCrop's working for you.</p>\n    </div>\n\n</template>",
_dynamicNodes : [{"type":"attr","position":[1,11,1,5]}],

	data : function(){
		return {

		}		
	},
	actions:{
        NextOption:function (el) {
			$("#userdetails").hide();
			let e=$("#userinfocomp")
			e.find("div").addClass("anm").removeClass("anm1")
			e.show()
        }
	}
});
