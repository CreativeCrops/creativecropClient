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
