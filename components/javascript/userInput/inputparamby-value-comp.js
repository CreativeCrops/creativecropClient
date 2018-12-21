Lyte.Component.register("inputparamby-value-comp", {
	data : function(){
		return {

		}		
	},
    actions:{
        preOption:function () {
            let e = $('#userinfodetailscomp');
            e.find("div").addClass("anm1").removeClass("anm")
            e.show();
            $("#inputparambyvaluecomp").hide()
        },
        NextOption:function (el) {
            $("#inputparambyvaluecomp").hide();
            let e=$("#inputparambydayscomp")
            e.find("div").addClass("anm").removeClass("anm1")
            e.show()
        }
    }
});
