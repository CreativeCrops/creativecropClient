Lyte.Component.register("inputparamby-fields-comp", {
	data : function(){
		return {
			data:Lyte.attr("object"),
			paran:Lyte.attr("object"),
			paran1:Lyte.attr("object")
		}
	},init:function () {
		
    },actions:{
        traditional:function (inx) {
			let data=this.getData("data");
            //console.log(data);
            let obj=data.traditional[parseInt(inx)]
            this.setData("paran",obj)

            console.log(obj);
        },
        advanced:function (inx) {
			let data=this.getData("data");
            //console.log(data);
            let obj=data.advanced[parseInt(inx)]
            console.log(obj);
            this.setData("paran",obj)
        }
	}
});
