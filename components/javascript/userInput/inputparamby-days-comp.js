Lyte.Component.register("inputparamby-days-comp", {
	data : function(){
		return {

		}		
	},actions:{
        preOption:function () {
            let e = $('#inputparambyvaluecomp');
            e.find("div").addClass("anm1").removeClass("anm")
            e.show();
            $("#inputparambydayscomp").hide()
        },
        NextOption:function (el) {
            $("#inputparambydayscomp").hide();
            let e=$("#inputparambyfieldscomp")
            e.find("div").addClass("anm").removeClass("anm1")
            e.show()
        }
    }
});
