Lyte.Component.register("user-infodetailscomp", {
	data : function(){
		return {

		}		
	},
    actions:{
        preOption:function () {
            let e = $('#useraddresscomp');
            e.find("div").addClass("anm1").removeClass("anm")
            e.show();
            $("#userinfodetailscomp").hide()
        },
        NextOption:function (el) {
            $("#userinfodetailscomp").hide();
            let e=$("#inputparambyvaluecomp")
            e.find("div").addClass("anm").removeClass("anm1")
            e.show()
        }
    }
});
