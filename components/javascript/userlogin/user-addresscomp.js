Lyte.Component.register("user-addresscomp", {
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
