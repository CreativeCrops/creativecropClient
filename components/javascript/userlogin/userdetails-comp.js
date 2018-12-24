Lyte.Component.register("userdetails-comp", {
	data : function(){
		return {

		}		
	},
	actions:{
        NextOption:function (el) {

            store.createRecord("user",{});
            let data=store.peekAll("user")[0]
        	data.$.set("firstname",document.getElementById("fname").value);
            data.$.set("lastname",document.getElementById("lname").value);
            data.$.set("email",document.getElementById("email").value);
            data.$.set("password",document.getElementById("password").value===document.getElementById("cpassword").value?document.getElementById("cpassword").value:false);


            $("#userdetails").hide();
            let e = $("#userinfocomp")
            e.find("div").addClass("anm").removeClass("anm1")
            e.show()






        }
	}
});
