Lyte.Component.register("user-infodetailscomp", {
_template:"<template tag-name=\"user-infodetailscomp\">\n\n        <div class=\"col l12 m12 s12\">\n\n            <div class=\"col s12 center\">\n                <div style=\"width: 100%;height: 100px;\"></div>\n                <img src=\"components/images/img/logo/shields.svg\" style=\"width: 200px;\">\n            </div>\n\n\n            <div>\n                <p>\n                    Agriculture is getting worse in its way now-a-days. But many of young students are taking initiatives to develop agriculture. Since the world is getting digitalized we should also keep on its flow. This was the main reason why this project is going to be developed. The major intuition of this project is to get closer to farmers via digitalized technologies and make their lands more profitable beyond usual yield. The durability is also going to be taken as constraint so that the factor of dry lands will be avoided and during that season rather than usual crops some other crops will be recommended based on the rotation.<br>\n\n                    It has been planned to develop as an application and will be deployed on all platforms offering compatibility and portability. This will majorly focus neural networks for building relations and data mining for recommendation. This application will be deployed for all agriculturists with adaptable standards.<br>\n\n                    <br><b>Background</b><br>\n\n                    The farmer provides the crop field image as an input to the application. In the pre-processing stage,\n                    Removing noisy Data is done using Multiple Morphological Component Analysis (MMCA) and as a result, filtering the image retaining its necessary portions. SVM prefixed by Spatial Spectral Schrodinger Eigen Maps (SSSE) is used as a classification method wherein partial knowledge propagation is leveraged to improve the classification accuracy.<br>\n\n                    The classified image along with the Ground truth statistical data containing the weather, crop yield, state &amp; county wise crops are used to predict the yield of a particular crop under a particular weather condition. This predictive model used Ada Boost classifier. Crop recommendation is facilitated then by collaborative filtering. Further scope of the project would extend to predictive analytics on the commodity market of the goods grown in the agricultural fields to predict its waxing and waning.<br>\n\n                    <br><b>Scope and Relevance</b><br>\n\n                    The study focuses on developing a network of clusters containing various attributes as criteria using neural networks concept. The users can definitely use it in an efficient manner as well as it will be their beneficiary factor. Some attributes can be added to the networks only in the form of clusters with the help of admin rights. The Farmers can also mark their presence in the market through this app and can evaluate and compare their product prices with this application and they can sell and earn through this application.<br>\n                </p>\n            </div>\n\n\n\n            <div class=\"row \">\n                <div class=\"col s12\">\n                    <br>\n                    <br>\n                    <button onclick=\"{{action('NextOption')}}\" class=\"btn-small waves-effect waves-light green white-text right\" style=\"margin-left: -25px\">Next</button>\n                    <button onclick=\"{{action('preOption')}}\" class=\"btn-small waves-effect waves-light green white-text left\" style=\"margin-right: -25px\">back</button>\n                </div>\n\n            </div>\n\n\n        </div>\n\n\n\n</template>",
_dynamicNodes : [{"type":"attr","position":[1,5,1,5]},{"type":"attr","position":[1,5,1,7]}],

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
