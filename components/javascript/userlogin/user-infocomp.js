Lyte.Component.register("user-infocomp", {
	data : function(){
		return {
            user:Lyte.attr("object",{default:{}}),
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


            let data=store.peekAll("user")[0]
            data.$.set("phone",parseInt(document.getElementById("phone").value))
            data.$.set("DOB",document.getElementById("day").value+"-"+document.getElementById("mon").value+"-"+document.getElementById("year").value)
            data.$.set("gander",document.getElementById("gender").value)


            $("#userinfocomp").hide();
            let e = $("#useraddresscomp")
            e.find("div").addClass("anm").removeClass("anm1")
            e.show()


        }
	}
});
