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
            let obj={}
            obj.copper=document.getElementById("copper")
            obj.Oxygen=document.getElementById("Oxygen")
            obj.Iron=document.getElementById("Iron")
            obj.Potassium=document.getElementById("Potassium")
            obj.Maganese=document.getElementById("Maganese")
            obj.Calcium=document.getElementById("Calcium")
            obj.Boron=document.getElementById("Boron")
            obj.Magnesium=document.getElementById("Magnesium")
            obj.Chlorine=document.getElementById("Chlorine")
            obj.Molybdenum=document.getElementById("Molybdenum")
            obj.Cobalt=document.getElementById("Cobalt")

            // store.createRecord("crop-param",{})
            // let data=store.peekAll("crop-param")[0]
            // data.$.set("CropParam",obj)


            $("#inputparambyvaluecomp").hide();
            let e=$("#inputparambydayscomp")
            e.find("div").addClass("anm").removeClass("anm1")
            e.show()
        }
    }
});
