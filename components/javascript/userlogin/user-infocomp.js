Lyte.Component.register("user-infocomp", {
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
