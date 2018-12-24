Lyte.Component.register("inputparamby-days-comp", {
	data : function(){
		return {
            data:Lyte.attr("object")
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
            document.getElementById("inputparambyfieldscomp").setData("data",store.peekAll("crop-params")[0])
            let e=$("#inputparambyfieldscomp")
            e.find("div").addClass("anm").removeClass("anm1")
            e.show()
        },
        optionselect:function (el) {
            let data=el.value
            store.findAll("crop-params").then(function (res) {
                $("#list").show()
                document.getElementById("inputparambydayscomp").setData("data",store.peekAll("crop-params")[0]);
            });


        }
    },init:function () {

    }
});
