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


            let data=store.peekAll("user")[0]
            data.$.set("address",document.getElementById("street").value)
            data.$.set("landmark",document.getElementById("land").value)
            data.$.set("city",document.getElementById("city").value)
            data.$.set("state",document.getElementById("state").value)
            data.$.set("zipcode",document.getElementById("zip").value)

            data.$.save();


            $("#useraddresscomp").hide();
            let e=$("#userinfodetailscomp")
            e.find("div").addClass("anm").removeClass("anm1")
            e.show()
        }
    }
});
