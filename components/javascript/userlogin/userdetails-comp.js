Lyte.Component.register("userdetails-comp", {
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
