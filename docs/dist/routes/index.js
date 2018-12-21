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
