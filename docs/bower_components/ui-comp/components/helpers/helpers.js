if( window._lyteUiUtils ) {
	window._lyteUiUtils[ 'i18n' ] = function(key) {
		var ret = _lyteUiComponentsLocale[ !key? '':key ];
		return ret? ret: key;
	}
}
else {
	window._lyteUiUtils = {}
	window._lyteUiUtils[ 'i18n' ] = function(key) {
		var ret = _lyteUiComponentsLocale[ !key? '':key ];
		return ret? ret: key;
	}
}

LyteComponent.registerHelper("lyteUiReturnOnlyKey",function(item){
	var objectkeys = Object.keys(item)
	if(objectkeys)
		{
			return objectkeys[0]
		}
	else
		{
			return false
		}
});
LyteComponent.registerHelper("lyteUiReturnOnlyValue",function(item){
	var objectkeys = Object.keys(item)
	return item[objectkeys[0]]
});

/**
 * Helper to return url when flag is true
 * @param {string} url - The url to return
 * @param {boolean} flag - True returns the URL , false returns an empty string
 *
 */

Lyte.Component.registerHelper( 'lyteUiSetURL', function( url, flag ) {

	if( flag ) {
		return url;
	} else {
		return '';
	}

} );


/**
 * Helper to check if an entire row in the calendar is empty or not
 * @param {object} vector - an array of objects where each object contains a particular date
 *
 */

LyteComponent.registerHelper( 'lyteUiCheckEmpty', function( vector ) {
	return vector && vector[ 0 ].emptyBlock && vector[ 6 ].emptyBlock;
} );


LyteComponent.registerHelper("lyteUiI18n",function(key){
	return _lyteUiUtils.i18n(key);
});

LyteComponent.registerHelper("lyteUiOptGroupCheck", function(content){
		if(content.constructor == Object)
            {
              if(Object.keys(content).length == 1)
	              {
	              	var value = content[Object.keys(content)[0]]
	              	if(value.constructor == Object || value.constructor == Array)
	                  {
	                      return true
	                  }
	               }
            }
        return false
});
LyteComponent.registerHelper("lyteUiCheckForType",function(item,ltPropUserValue,ltPropSystemValue,section){
	if(section){
		var count = 0;
		var tcount = 0;
		for(var key in item){
			tcount++;
			if(key == ltPropUserValue){
				count++;
			}
			if(key == ltPropSystemValue){
				count++;
			}
		}
		if(count == 2 || tcount != 1){
			return false;
		}
		else{
			return true
		}
	}
	else{
		if(typeof item == "object"){
			return true
		}
		else{
			return false
		}
	}
});
LyteComponent.registerHelper("lyteUiChildPadding", function(treeIcon) {

	if ( treeIcon === 'Arrow' ) {
		return "padding-left:20px;";
	} else if (treeIcon === 'Plus') {
		return "padding-left:25px;";
	} else {
		return "padding-left:27px;";
	}
});
LyteComponent.registerHelper("lyteUiHaveChildren", function(treeData,key) {

	if ( treeData[key] && treeData[key].length > 0 ) {

		return true;
	}
	return false;
});
LyteComponent.registerHelper("lyteUiIsObject", function(obj) {

	if ( Object.prototype.toString.call(obj) === "[object Object]" ) {
		return true;
	} else {
		return false;
	}
});
LyteComponent.registerHelper("lyteUiIsArray", function(obj) {

	if ( Object.prototype.toString.call(obj) === "[object Array]") {
		return true;
	} else {
		return false;
	}
});
LyteComponent.registerHelper('lyteUiGiveProper',function(full,val){
	var returnval = []
	for(var i=0;i<full.length;i++){
		if(full[i].menu == val){
			returnval.push(full[i])
		}
	}
	return returnval
});
LyteComponent.registerHelper('lyteUiAddClassModal',function(className,show,drag){
	var resp = className;
	if(drag){
		resp += " draggable";
	}
	if(show){
		resp += " "+className+"Show";
	}
	return resp;
});

LyteComponent.registerHelper('lyteUiAddShowClass',function(a,b,c){
	if(a === true){
		return b+" "+c;
	}
	return b;
});


LyteComponent.registerHelper('lyteUiCatwise',function(a,b){
    if(a==b[this.get('ltPropCategory')]){
        return true
    }
      else {
        return false
    }
});

LyteComponent.registerHelper('lyteUiCheckClassForDate',function(val){
	if(!val){
		return false;
	}
	if(val.indexOf('lyteCalGray') != -1){
		return true
	}
	return false
});

LyteComponent.registerHelper('lyteUiConcat',function(){
	var resp = '';
	var argLength = arguments.length;
	for(var i=0;i<argLength;i++){
		if(arguments[i] != undefined){
			resp += arguments[i];
		}
	}
	return resp;
});

LyteComponent.registerHelper('lyteUiConcatTypeClass',function(a,b,c){
	if(a!==""){
		return a+b+" "+c;
	}
	return c;
});

LyteComponent.registerHelper('lyteUiGetContainerClass',function(setselect,classval){
	var toRet=''
	if(!classval){
		classval = ''
	}
    if(setselect==true){
    	toRet = 'lyteDropdownContainer tick-selection ' + classval
    }
    else{
    	toRet = 'lyteDropdownContainer ' + classval
    }
    return toRet

});

LyteComponent.registerHelper('lyteUiGetDropdownClass',function(arg1){
	if(arg1 && arg1.toString().toLowerCase()  == "true"){
		return 'lyteDropdownElement1 lyteDropdown-disabled'
	}
	else{
		return 'lyteDropdownElement1'
	}
});

LyteComponent.registerHelper('lyteUiIfEquals',function(a,b){
	return a === b;
});

LyteComponent.registerHelper('lyteUiLabelCheck',function(a,b){
	if(a==b){
		return true;
	}
	else {
		return false
	}
});

LyteComponent.registerHelper('lyteUiObjectCheck',function(a){
    if(typeof a==='string'){
        return true;
    }
    else {
        return false
    }
});

LyteComponent.registerHelper('lyteUiReturnValueBy',function(content,key){
	if(key || key == 0){
		return content[key]
	}
	else{
		return content
	}
});
LyteComponent.registerHelper('lyteUiHeaderCheck',function(value){
	if(value)
		{
			return true;
		}
	else
		{
		return false;
		}
});
LyteComponent.registerHelper('lyteUiSetWH',function(radius){
	return parseInt(radius) * 2;
});
LyteComponent.registerHelper('lyteUiSetRadius',function(radius,stroke){
	return parseInt(radius)-parseInt(stroke)/2;
});
LyteComponent.registerHelper('lyteUiSetDashArray',function(radius,stroke){
	var r = parseInt(radius)-parseInt(stroke)/2;
	return  2 * 3.14159 * r;
});
LyteComponent.registerHelper('lyteUiSetOffset',function(radius,stroke,value){
	var r = parseInt(radius)-parseInt(stroke)/2;
	var strokeDash =  2 * 3.14159 * r;
	return strokeDash * (1 - parseInt(value)/100);
});
LyteComponent.registerHelper('lyteUiTextTransform',function(radius){
	return 'translate(0,-'+parseInt(radius) * 2+')';
});
LyteComponent.registerHelper('lyteUiMakeSortable',function(elementId){
	console.log(elementId);
	document.getElementById(elementId).classList.add('sortable');
	return true;
});
LyteComponent.registerHelper("lyteUiCheckTabPosition",function(position){
	if(position.pos === "bottom"){
		return false;
	}
	else{
		return true;
	}
});

LyteComponent.registerHelper('lyteUiGetValue',function(object, key){
	return object[key]
});

LyteComponent.registerHelper('lyteUiIsEmptyArray',function(obj){
     return obj.length == 0;
});
LyteComponent.registerHelper("lyteRgbToHex",function(item){
	var valArray = item.substring(4,item.length-1).split(",");
	var hexValue = "#";
	for(var i=0;i<3;i++){
		var val = parseInt(valArray[i]).toString(16).toUpperCase();
		if(val.length < 2){
			val = "0"+val;
		}
		hexValue += val;
	}
	return hexValue;
});
LyteComponent.registerHelper("lyteCPInsertBreak",function(index){
	if((index + 1)%10 == 0){
		return true;
	}
	return false;
});
LyteComponent.registerHelper("lyteUiCheckInRange",function(start,end,current){
	if(start === '' && end === ''){
		return true;
	}
	else if(start !== '' && end === ''){
		var startDate = new Date(start)
		var currentDate = new Date(current)
		if(currentDate >= startDate){
			return true
		}
	}
	else if(start !== '' && end !== ''){
		var startDate = new Date(start)
		var endDate = new Date(end)
		var currentDate = new Date(current)
		if(currentDate >= startDate && currentDate <= endDate){
			return true
		}
	}
	else {
		var endDate = new Date(end)
		var currentDate = new Date(current)
		if(currentDate <= endDate){
			return true
		}
	}
	return false
});
LyteComponent.registerHelper("lyteUiIsEmptyObject",function(item){
	for(var key in item) {
        if(item.hasOwnProperty(key)){
            return false;
        }
    }
    return true;
});
LyteComponent.registerHelper("lyteUiCheckDisabled",function(list,value){
	for(var i = 0; i<list.length; i++){
		if(value === list[i]){
			return "true";
		}
	}
    return "false";
});

LyteComponent.registerHelper("lyteUiTreeHelp",function(varr,index){
	return varr + index++ ;
});

LyteComponent.registerHelper("lyteUiTreeChildHelp",function(val,clas){

	if((val.children === undefined)||(val.children.length === 0)){
		return 'noChildClass';
	}

	return '';

});
