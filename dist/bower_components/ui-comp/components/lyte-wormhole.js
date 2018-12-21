Lyte.Component.register("lyte-wormhole",{
_template:"<template tag-name=\"lyte-wormhole\">\t<lyte-yield yield-name=\"lyte-content\"></lyte-yield>\t</template>",
_dynamicNodes : [{"type":"insertYield","position":[1]}],

	didConnect :function(){
		if(!this.appended){
			this.appended = true;
			this.throwEvent("wormholeDidConnect");
		}	
	}
});
