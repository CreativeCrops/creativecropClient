// Lyte.Router.configureDefaults({baseURL:'',history : "html5"});

Lyte.Router.configureRoutes(function(){
	this.route('index',{path:'/'},function(){
		this.route("setup",{path :"/setup"});
	});
});

Lyte.Router.beforeRouteTransition = function() {
	//console.log('before Route Change');
}

Lyte.Router.afterRouteTransition = function() {
	//console.log('after Route Change');
}


Lyte.Router.registerRoute("index.setup",{
	// queryParams : [] to refresh route for any change in given qp.
	//forceFetch : false(boolean) to fetch models of routes sequential without waiting for resources and dependencies
	getResources : function() { //render Template hook waits for resources to be fetched.

	},
	getDependencies : function() { //before model hook waits for dependencies to be fetched

	},
	beforeModel : function(params)	{
		//All permission checks and route redirections can be done here.
	},
	model : function(params)	{		
		//Data request is initiated here.
	},
	afterModel : function(model,params)	{
		//Any changes to model before rendering can be done here.		
	},
	redirect : function() {

	},
	renderTemplate : function(model,params)	{
		return {outlet : "#setupoutlet",component : "usersetup-comp"}
	},
	afterRender : function(model,params){
	},
	actions: {//action that can be bubbled to parent by returning true
		onError : function(error,pausedTrans,params,hook) {
			// will be called on error in model hooks, transition can be resumed or redirected.
		},
		willTransition : function() {
			//will be called before any transition is made from this route.

		},
		didTransition : function() {
			//will be called after a transition is done.
            $('select').formSelect();
		}
	},
	beforeExit :function() {
		//will be called before this route is going to exit from view.
	}
});

Lyte.Router.registerRoute('index',{
	getResources : function(params) {
		
	},
	getDependencies : function(params) {

	},
	beforeModel : function(params)	{

	},
	model : function(params)	{

		return {features : [{module : 'Router',url : 'http://lyte/#/doc/route/introduction'},
							{module : 'Components',url : 'http://lyte/#/doc/components/introduction'},
							{module : 'Data',url : 'http://lyte/#/doc/data/introduction'},
							{module : 'CLI',url : 'http://lyte/#/doc/cli/introduction'}
							]}
				
							// {module : 'testing',url : 'http://lyte:3000/index.html#Routing/Introduction'}
	},
	afterModel : function(model,params)	{

	},
	redirect : function(model,params) {

	},
	renderTemplate : function(model,params)	{
		return {outlet : '#outlet',component:'welcome-comp'};
	},
	afterRender : function(model,params){

	},
	actions: {
		"willTransition" : function() {
		},
		"didTransition" : function(){
		}
	},
	beforeExit : function(model,params)	{
	}
	
});

Lyte.Component.register("inputparamby-days-comp", {
_template:"<template tag-name=\"inputparamby-days-comp\">\n\n\n        <div class=\"col l4 m4 s12\">\n            <div class=\"col s12 left\">\n                <img src=\"components/images/img/logo-man.svg\" style=\"width: 40px;\"><br> <label>Creative Crops's</label>\n            </div>\n            <div class=\"col s12\">\n                <h5 class=\"left-align\">Date for crop's production</h5>\n            </div>\n\n\n            <div class=\"col s12\">\n                <select class=\"browser-default\" (change)=\"onChange($event.target.value)\">\n                    <option selected=\"\" disabled=\"\" value=\"\">Day's</option>\n                    <option value=\"60\">60</option>\n                    <option value=\"70\">70</option>\n                    <option value=\"80\">80</option>\n                    <option value=\"90\">90</option>\n                    <option value=\"100\">100</option>\n                    <option value=\"110\">110</option>\n                    <option value=\"120\">120</option>\n                    <option value=\"130\">130</option>\n                    <option value=\"140\">140</option>\n                    <option value=\"150\">150</option>\n                    <option value=\"160\">160</option>\n                    <option value=\"170\">170</option>\n                    <option value=\"180\">180</option>\n                    <option value=\"190\">190</option>\n                    <option value=\"200\">200</option>\n                    <option value=\"210\">210</option>\n                    <option value=\"220\">220</option>\n                    <option value=\"230\">230</option>\n                    <option value=\"240\">240</option>\n                    <option value=\"250\">250</option>\n                    <option value=\"260\">260</option>\n                    <option value=\"270\">270</option>\n                    <option value=\"280\">280</option>\n                    <option value=\"290\">290</option>\n                    <option value=\"300\">300</option>\n                    <option value=\"310\">310</option>\n                    <option value=\"320\">320</option>\n                    <option value=\"330\">330</option>\n                    <option value=\"340\">340</option>\n                    <option value=\"350\">350</option>\n                    <option value=\"360\">360</option>\n                    <option value=\"370\">370</option>\n                    <option value=\"380\">380</option>\n                    <option value=\"390\">390</option>\n                    <option value=\"400\">400</option>\n                    <option value=\"410\">410</option>\n                    <option value=\"420\">420</option>\n                    <option value=\"430\">430</option>\n                    <option value=\"440\">440</option>\n                    <option value=\"450\">450</option>\n                    <option value=\"460\">460</option>\n                    <option value=\"470\">470</option>\n                    <option value=\"480\">480</option>\n                    <option value=\"490\">490</option>\n                    <option value=\"500\">500</option>\n                    <option value=\"510\">510</option>\n                    <option value=\"520\">520</option>\n                    <option value=\"530\">530</option>\n                    <option value=\"540\">540</option>\n                    <option value=\"550\">550</option>\n                    <option value=\"560\">560</option>\n                    <option value=\"570\">570</option>\n                    <option value=\"580\">580</option>\n                    <option value=\"590\">590</option>\n                    <option value=\"600\">600</option>\n                    <option value=\"610\">610</option>\n                    <option value=\"620\">620</option>\n                    <option value=\"630\">630</option>\n                    <option value=\"640\">640</option>\n                    <option value=\"650\">650</option>\n                    <option value=\"660\">660</option>\n                    <option value=\"670\">670</option>\n                    <option value=\"680\">680</option>\n                    <option value=\"690\">690</option>\n                    <option value=\"700\">700</option>\n                    <option value=\"710\">710</option>\n                    <option value=\"720\">720</option>\n                    <option value=\"730\">730</option>\n                    <option value=\"740\">740</option>\n                    <option value=\"750\">750</option>\n                    <option value=\"760\">760</option>\n                    <option value=\"770\">770</option>\n                    <option value=\"780\">780</option>\n                    <option value=\"790\">790</option>\n                    <option value=\"800\">800</option>\n                    <option value=\"810\">810</option>\n                    <option value=\"820\">820</option>\n                    <option value=\"830\">830</option>\n                    <option value=\"840\">840</option>\n                    <option value=\"850\">850</option>\n                    <option value=\"860\">860</option>\n                    <option value=\"870\">870</option>\n                    <option value=\"880\">880</option>\n                    <option value=\"890\">890</option>\n                    <option value=\"900\">900</option>\n                    <option value=\"910\">910</option>\n                    <option value=\"920\">920</option>\n                    <option value=\"930\">930</option>\n                    <option value=\"940\">940</option>\n                    <option value=\"950\">950</option>\n                    <option value=\"960\">960</option>\n                    <option value=\"970\">970</option>\n                    <option value=\"980\">980</option>\n                    <option value=\"990\">990</option>\n                    <option value=\"1000\">1000</option>\n                </select>\n                <label>crop's production</label>\n            </div>\n\n\n\n\n            <div class=\"row \">\n                <div class=\"col s12\">\n                    <br>\n                    <br>\n                    <button onclick=\"{{action('NextOption')}}\" type=\"submit\" class=\"btn-small waves-effect waves-light green white-text right\" routerlink=\"/login7\" style=\"margin-left: -25px\">Next</button>\n                    <button onclick=\"{{action('preOption')}}\" type=\"submit\" class=\"btn-small waves-effect waves-light green white-text left\" routerlink=\"/login5\" style=\"margin-right: -25px\">back</button>\n                </div>\n\n            </div>\n\n\n        </div>\n\n\n\n</template>",
_dynamicNodes : [{"type":"attr","position":[1,7,1,5]},{"type":"attr","position":[1,7,1,7]}],

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

Lyte.Component.register("inputparamby-value-comp", {
_template:"<template tag-name=\"inputparamby-value-comp\">\n    <div class=\"anm\">\n\n        <div class=\"col l6 m6 s12\">\n            <div class=\"col s12 left\">\n                <img src=\"components/images/img/logo-man.svg\" style=\"width: 40px;\"><br> <label>Creative Crops's</label>\n            </div>\n            <div class=\"col s12\">\n                <h5 class=\"left-align\">Input Parameter</h5>\n            </div>\n\n            \n\n\n            <div class=\"col s12\">\n                <div class=\"col s6 input-field\">\n                    <input type=\"text\" class=\"validate\" id=\"copper\">\n                    <label for=\"copper\">Copper (Cu)</label>\n                </div>\n\n                <div class=\"col s6 input-field\">\n                    <input type=\"text\" class=\"validate\" id=\"Oxygen\">\n                    <label for=\"Oxygen\">Oxygen (O)</label>\n                </div>\n            </div>\n\n            <div class=\"col s12\">\n                <div class=\"col s6 input-field\">\n                    <input type=\"text\" class=\"validate\" id=\"Iron\">\n                    <label for=\"Iron\">Iron (Fe)</label>\n                </div>\n\n                <div class=\"col s6 input-field\">\n                    <input type=\"text\" class=\"validate\" id=\"Potassium\">\n                    <label for=\"Potassium\">Potassium (K)</label>\n                </div>\n            </div>\n\n\n            <div class=\"col s12\">\n                <div class=\"col s6 input-field\">\n                    <input type=\"text\" class=\"validate\" id=\"Maganese\">\n                    <label for=\"Maganese\">Maganese (M)</label>\n                </div>\n\n                <div class=\"col s6 input-field\">\n                    <input type=\"text\" class=\"validate\" id=\"Calcium\">\n                    <label for=\"Calcium\">Calcium (Ca)</label>\n                </div>\n            </div>\n\n            <div class=\"col s12\">\n                <div class=\"col s6 input-field\">\n                    <input type=\"text\" class=\"validate\" id=\"Boron\">\n                    <label for=\"Boron\">Boron (B)</label>\n                </div>\n\n                <div class=\"col s6 input-field\">\n                    <input type=\"text\" class=\"validate\" id=\"Magnesium\">\n                    <label for=\"Magnesium\">Magnesium (Mg)</label>\n                </div>\n            </div>\n            <div class=\"col s12\">\n                <div class=\"col s6 input-field\">\n                    <input type=\"text\" class=\"validate\" id=\"Chlorine\">\n                    <label for=\"Chlorine\">Chlorine (Cl)</label>\n                </div>\n\n                <div class=\"col s6 input-field\">\n                    <input type=\"text\" class=\"validate\" id=\"Molybdenum\">\n                    <label for=\"Molybdenum\">Molybdenum (Mo)</label>\n                </div>\n            </div>\n            <div class=\"col s12\">\n                <div class=\"col s6 input-field\">\n                    <input type=\"text\" class=\"validate\" id=\"Cobalt\">\n                    <label for=\"Cobalt\">Cobalt (Co)</label>\n                </div>\n\n\n            </div>\n\n\n\n\n\n            <div class=\"row \">\n                <div class=\"col s12\">\n                    <br>\n                    <br>\n                    <button onclick=\"{{action('NextOption')}}\" type=\"submit\" class=\"btn-small waves-effect waves-light green white-text right\" routerlink=\"/login6\" style=\"margin-left: -25px\">Next</button>\n                    <button onclick=\"{{action('preOption')}}\" type=\"submit\" class=\"btn-small waves-effect waves-light green white-text left\" routerlink=\"/login4\" style=\"margin-right: -25px\">back</button>\n                </div>\n\n            </div>\n\n\n        </div>\n        <div class=\"col l6 m6 hide-on-small-only center\">\n            <div style=\"width: 100%;height: 100px;\"></div>\n            <img src=\"components/images/img/logo/photo.svg\" class=\"responsive-img\">\n            <p>\n                A parameter, generally, is any characteristic that can help in defining or classifying a particular system. That\n                is, a parameter is an element of a system that is useful, or critical, when identifying the system, or when\n                evaluating its performance, status, condition, etc.\n            </p>\n\n\n        </div>\n    </div>\n\n</template>",
_dynamicNodes : [{"type":"attr","position":[1,1,17,1,5]},{"type":"attr","position":[1,1,17,1,7]}],

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

Lyte.Component.register("inputparamby-fields-comp", {
_template:"<template tag-name=\"inputparamby-fields-comp\">\n\n\n        <div class=\"col l6 m6 s12\">\n            <div class=\"col s12 left\">\n                <img src=\"components/images/img/logo-man.svg\" style=\"width: 40px;\"><br> <label>Creative Crops's</label>\n            </div>\n            <div class=\"col s12\">\n                <h5 class=\"left-align\">Input Parameter</h5>\n            </div>\n\n            \n\n\n            <div class=\"col s12\">\n                <div class=\"col s12 input-field\">\n                    <div class=\"progress\">\n                        <div class=\"determinate\" style=\"width: 30%\"></div>\n                    </div>\n                    <label>Copper (Cu)</label>\n                </div>\n\n                <div class=\"col s12 input-field\">\n                    <div class=\"progress\">\n                        <div class=\"determinate\" style=\"width: 50%\"></div>\n                    </div>\n                    <label>Oxygen (O)</label>\n                </div>\n            </div>\n\n            <div class=\"col s12\">\n                <div class=\"col s12 input-field\">\n                    <div class=\"progress\">\n                        <div class=\"determinate\" style=\"width: 70%\"></div>\n                    </div>\n                    <label>Iron (Fe)</label>\n                </div>\n\n                <div class=\"col s12 input-field\">\n                    <div class=\"progress\">\n                        <div class=\"determinate\" style=\"width: 45%\"></div>\n                    </div>\n                    <label>Potassium (K)</label>\n                </div>\n            </div>\n\n\n            <div class=\"col s12\">\n                <div class=\"col s12 input-field\">\n                    <div class=\"progress\">\n                        <div class=\"determinate\" style=\"width: 60%\"></div>\n                    </div>\n                    <label>Maganese (M)</label>\n                </div>\n\n                <div class=\"col s12 input-field\">\n                    <div class=\"progress\">\n                        <div class=\"determinate\" style=\"width: 30%\"></div>\n                    </div>\n                    <label>Calcium (Ca)</label>\n                </div>\n            </div>\n\n            <div class=\"col s12\">\n                <div class=\"col s12 input-field\">\n                    <div class=\"progress\">\n                        <div class=\"determinate\" style=\"width: 80%\"></div>\n                    </div>\n                    <label>Boron (B)</label>\n                </div>\n\n                <div class=\"col s12 input-field\">\n                    <div class=\"progress\">\n                        <div class=\"determinate\" style=\"width: 60%\"></div>\n                    </div>\n                    <label>Magnesium (Mg)</label>\n                </div>\n            </div>\n            <div class=\"col s12\">\n                <div class=\"col s12 input-field\">\n                    <div class=\"progress\">\n                        <div class=\"determinate\" style=\"width: 74%\"></div>\n                    </div>\n                    <label>Chlorine (Cl)</label>\n                </div>\n\n                <div class=\"col s12 input-field\">\n                    <div class=\"progress\">\n                        <div class=\"determinate\" style=\"width: 40%\"></div>\n                    </div>\n                    <label>Molybdenum (Mo)</label>\n                </div>\n            </div>\n            <div class=\"col s12\">\n                <div class=\"col s12 input-field\">\n                    <div class=\"progress\">\n                        <div class=\"determinate\" style=\"width: 70%\"></div>\n                    </div>\n                    <label>Cobalt (Co)</label>\n                </div>\n\n\n            </div>\n\n\n\n\n\n            <div class=\"row \">\n                <div class=\"col s12\">\n                    <br>\n                    <br>\n                    <button type=\"submit\" class=\"btn-small waves-effect waves-light green white-text right\" onclick=\"window.location.href='http://localhost:4201/'\" style=\"margin-left: -25px\">Process</button>\n                    <button type=\"submit\" class=\"btn-small waves-effect waves-light green white-text left\" routerlink=\"/login6\" style=\"margin-right: -25px\">back</button>\n                </div>\n\n            </div>\n\n\n        </div>\n        <div class=\"col l6 m6 hide-on-small-only center\">\n            <div style=\"width: 100%;height: 100px;\"></div>\n            <img src=\"components/images/img/logo/biker.svg\" class=\"responsive-img\">\n            <p>\n                A parameter, generally, is any characteristic that can help in defining or classifying a particular system. That\n                is, a parameter is an element of a system that is useful, or critical, when identifying the system, or when\n                evaluating its performance, status, condition, etc.\n            </p>\n\n\n        </div>\n\n\n</template>",
_dynamicNodes : [],

	data : function(){
		return {

		}		
	}
});

Lyte.Component.register("user-addresscomp", {
_template:"<template tag-name=\"user-addresscomp\">\n\n\n        <div class=\"col l6 m6 s12\">\n            <div class=\"col s12 left\">\n                <img src=\"components/images/img/logo-man.svg\" style=\"width: 40px;\"><br> <label>Creative Crops's</label>\n            </div>\n            <div class=\"col s12\">\n                <h5 class=\"left-align\">Address of the Account</h5>\n            </div>\n\n            <div class=\"col s12\">\n                <div class=\"col s12 input-field\">\n                    <input type=\"text\" id=\"street\" required=\"\" class=\"validate\">\n                    <label for=\"street\">Street address</label>\n\n                </div>\n            </div>\n\n            <div class=\"col s12\">\n                <div class=\"col s12 input-field\">\n                    <input type=\"text\" id=\"land\" required=\"\" class=\"validate\">\n                    <label for=\"land\">LandMark</label>\n\n                </div>\n            </div>\n\n            <div class=\"col s12\">\n                <div class=\"col s12 input-field\">\n                    <input type=\"text\" id=\"city\" required=\"\" class=\"validate\">\n                    <label for=\"city\">City</label>\n\n                </div>\n            </div>\n\n            <div class=\"col s12\">\n                <div class=\"col s6 input-field\">\n                    <input type=\"text\" id=\"state\" required=\"\" class=\"validate\">\n                    <label for=\"state\">State</label>\n\n                </div>\n\n                <div class=\"col s6 input-field\">\n                    <input type=\"text\" id=\"zip\" required=\"\" class=\"validate\">\n                    <label for=\"zip\">Zip code</label>\n\n                </div>\n            </div>\n\n\n\n            <div class=\"row \">\n                <div class=\"col s12\">\n                    <br>\n                    <br>\n                    <button onclick=\"{{action('NextOption')}}\" class=\"btn-small waves-effect waves-light green white-text right\" style=\"margin-left: -25px\">Next</button>\n                    <button onclick=\"{{action('preOption')}}\" class=\"btn-small waves-effect waves-light green white-text left\" style=\"margin-right: -25px\">back</button>\n                </div>\n\n            </div>\n\n\n        </div>\n        <div class=\"col l6 m6 hide-on-small-only center\">\n            <div style=\"width: 100%;height: 100px;\"></div>\n            <img src=\"components/images/img/logo/umbrella.svg\" class=\"responsive-img\">\n\n        </div>\n\n\n</template>",
_dynamicNodes : [{"type":"attr","position":[1,13,1,5]},{"type":"attr","position":[1,13,1,7]}],

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
            $("#useraddresscomp").hide();
            let e=$("#userinfodetailscomp")
            e.find("div").addClass("anm").removeClass("anm1")
            e.show()
        }
    }
});

Lyte.Component.register("user-infocomp", {
_template:"<template tag-name=\"user-infocomp\">\n\n        <div class=\"col l5 m5 hide-on-small-only center\">\n            <div style=\"width: 100%;height: 100px;\"></div>\n            <img src=\"components/images/img/logo/personal.svg\" style=\"width: 60%\">\n            <p class=\"center-align\">One account. All of CreativeCrop's working for you.</p>\n        </div>\n        <div class=\"col l7 m7 s12\">\n            <div class=\"col s12 left\">\n                <img src=\"components/images/img/logo-man.svg\" style=\"width: 40px;\"><br> <label>Creative Crops's</label>\n            </div>\n            <div class=\"col s12\">\n                <h5 class=\"left-align\">welcome to CreativeCrops Account</h5>\n            </div>\n\n            <div class=\"col s12\">\n                <div class=\"col s12 input-field\">\n                    <input type=\"text\" id=\"phone\" required=\"\" class=\"validate\">\n                    <label for=\"phone\">Phone</label>\n                    <span class=\"helper-text\" data-error=\"wrong\" data-success=\"right\">We’ll use your number for account security. It won’t be visible to others.</span>\n                </div>\n\n            </div>\n\n            <div class=\"col s12\">\n                <div class=\"col s4 input-field\">\n                    <select class=\"\">\n                        <option value=\"1\">January</option>\n                        <option value=\"2\">February</option>\n                        <option value=\"3\">March</option>\n                        <option value=\"4\">April</option>\n                        <option value=\"5\">May</option>\n                        <option value=\"6\">June</option>\n                        <option value=\"7\">July</option>\n                        <option value=\"8\">August</option>\n                        <option value=\"9\">September</option>\n                        <option value=\"10\">October</option>\n                        <option value=\"11\">November</option>\n                        <option value=\"12\">December</option>\n                    </select>\n                    <label>year</label>\n                </div>\n                <div class=\"col s4 input-field\">\n                    <input type=\"number\" id=\"day\" required=\"\" class=\"validate\">\n                    <label for=\"day\">Day</label>\n                </div>\n\n\n                <div class=\"col s4 input-field\">\n                    <input type=\"number\" id=\"year\" required=\"\" class=\"validate\">\n                    <label for=\"year\">Year</label>\n                </div>\n\n                <div class=\"col s12\">\n                    <label style=\"position: relative;top: -19px;\">Your birthday</label>\n                </div>\n\n            </div>\n            <div class=\"col s12\">\n                <div class=\"col s12 input-field\">\n                    <select>\n                        <option value=\"2\">Female</option>\n                        <option value=\"1\">Male</option>\n                        <option value=\"3\">Rather not say</option>\n                    </select>\n                    <label>Gender</label>\n                </div>\n            </div>\n\n\n            <div class=\"row \">\n                <div class=\"col s12\">\n                    <br>\n                    <br>\n                    <button onclick=\"{{action('NextOption')}}\" class=\"btn-small waves-effect waves-light green white-text right\" style=\"margin-left: -25px\">Next</button>\n                    <button onclick=\"{{action('preOption')}}\" class=\"btn-small waves-effect waves-light green white-text left\" style=\"margin-right: -25px\">back</button>\n                </div>\n\n            </div>\n\n\n        </div>\n\n</template>",
_dynamicNodes : [{"type":"attr","position":[3,11,1,5]},{"type":"attr","position":[3,11,1,7]}],

	data : function(){
		return {

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
            $("#userinfocomp").hide();
            let e=$("#useraddresscomp")
            e.find("div").addClass("anm").removeClass("anm1")
            e.show()
        }
	}
});

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

Lyte.Component.register("userdetails-comp", {
_template:"<template tag-name=\"userdetails-comp\">\n\n    <div class=\"col l7 m7 s12\">\n        <div class=\"col s12 left\">\n            <img src=\"components/images/img/logo-man.svg\" style=\"width: 40px;\"><br> <label>Creative Crops's</label>\n        </div>\n        <div class=\"col s12\">\n            <h5 class=\"left-align\">Create your CreativeCrops Account</h5>\n        </div>\n\n        <div class=\"col s12\">\n            <div class=\"col s6 input-field\">\n                <input type=\"text\" id=\"fname\" required=\"\" class=\"validate\">\n                <label for=\"fname\">First Name</label>\n            </div>\n            <div class=\"col s6 input-field\">\n                <input type=\"text\" id=\"lname\" class=\"validate\">\n                <label for=\"lname\">Last Name</label>\n            </div>\n        </div>\n\n        <div class=\"col s12\">\n            <div class=\"col s12 input-field\">\n                <input type=\"email\" id=\"email\" class=\"validate\" required=\"\">\n                <label for=\"email\">Last Name</label>\n                <span class=\"helper-text\" data-error=\"wrong\" data-success=\"right\">You can use letters, numbers &amp; periods</span>\n            </div>\n        </div>\n        <div class=\"col s12\">\n            <div class=\"col s6 input-field\" required=\"\">\n                <input type=\"password\" id=\"password\" required=\"\" class=\"validate\">\n                <label for=\"password\">Password</label>\n            </div>\n            <div class=\"col s6 input-field\" required=\"\">\n                <input type=\"password\" id=\"cpassword\" class=\"validate\">\n                <label for=\"cpassword\">Confirm Password</label>\n            </div>\n            <div class=\"col s12\">\n                <label class=\"helper-text\" style=\"position: relative;top: -10px\">Use 8 or more characters with a mix of letters, numbers &amp; symbols</label>\n            </div>\n\n        </div>\n\n        <div class=\"row \">\n            <div class=\"col s12\">\n                <br>\n                <br>\n                <button type=\"submit\" onclick=\"{{action('NextOption')}}\" class=\"btn-small waves-effect waves-light green lighten-2 white-text right\" style=\"margin-left: -25px\">Next</button>\n            </div>\n\n        </div>\n\n\n    </div>\n\n    <div class=\"col l5 m5 hide-on-small-only center\">\n        <div style=\"width: 100%;height: 100px;\"></div>\n        <img src=\"components/images/img/logo/account.svg\" style=\"width: 60%\">\n        <p class=\"center-align\">One account. All of CreativeCrop's working for you.</p>\n    </div>\n\n</template>",
_dynamicNodes : [{"type":"attr","position":[1,11,1,5]}],

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

Lyte.Component.register("usersetup-comp", {
_template:"<template tag-name=\"usersetup-comp\">\n    <userdetails-comp id=\"userdetails\"></userdetails-comp>\n    <user-infocomp id=\"userinfocomp\" style=\"display: none\"></user-infocomp>\n    <user-addresscomp id=\"useraddresscomp\" style=\"display: none\"></user-addresscomp>\n    <user-infodetailscomp id=\"userinfodetailscomp\" style=\"display: none\"></user-infodetailscomp>\n    <inputparamby-value-comp id=\"inputparambyvaluecomp\" style=\"display: none\"></inputparamby-value-comp>\n    <inputparamby-days-comp id=\"inputparambydayscomp\" style=\"display: none\"></inputparamby-days-comp>\n    <inputparamby-fields-comp id=\"inputparambyfieldscomp\" style=\"display: none\"></inputparamby-fields-comp>\n\n</template>\n<style>.homebg {\n    background-color: #e4e8ea;\n    background-image: url(components/images/blue-triangle.png);\n    background-repeat: no-repeat;\n    background-position: 0 0;\n}\n\n.z-depth-g{\n    width: 100%;\n    border-radius: 4px;\n    box-shadow: 0 2px 8px rgba(211,209,209,0.75);\n    border: none;\n    background-color: white;\n    padding: 20px;\n}\n\n.anm{\n    animation: 0.31s ease-in-out  anm;\n}\n\n\n@keyframes anm {\n    0%{transform: translateX(100%)}\n    100%{transform: translateX(0%)}\n}\n\n.anm1{\n    animation: 0.31s ease-in-out  anm1;\n}\n\n\n@keyframes anm1 {\n    0%{transform: translateX(-100%)}\n    100%{transform: translateX(0%)}\n}</style>",
_dynamicNodes : [{"type":"componentDynamic","position":[1]},{"type":"componentDynamic","position":[3]},{"type":"componentDynamic","position":[5]},{"type":"componentDynamic","position":[7]},{"type":"componentDynamic","position":[9]},{"type":"componentDynamic","position":[11]},{"type":"componentDynamic","position":[13]}],

	data : function(){
		return {

		}		
	}
});

Lyte.Component.register("welcome-comp",{
_template:"<template tag-name=\"welcome-comp\">\n\t\n\n\t<div class=\"container\">\n\t\t<div class=\"row \">\n\t\t\t<div class=\"col l12 m12 s12\">\n\t\t\t\t<div style=\"width: 100%;height: 100px;\"></div>\n\t\t\t</div>\n\t\t\t<div class=\"l10 offset-l1 s12 m12 col z-depth-g\" style=\"padding: 20px;overflow: hidden\" id=\"setupoutlet\">\n\n\n\t\t\t</div>\n\t\t</div>\n\t</div>\n\n</template>",
_dynamicNodes : [],
_observedAttributes :["features"],
	data : function(){
		return {
			features : Lyte.attr("array")
		}
	}
});

