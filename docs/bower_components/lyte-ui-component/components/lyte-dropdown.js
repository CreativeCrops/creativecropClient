/* wrap show hide in another function */
/* 
issues:  backspace selects an item
multiselect callout
setproperwidth
enter on hover causes a problem
ltPropShow might invoke callbacks more than once because we are closing it and opening it
*/
Lyte.Component.register( 'lyte-dropdown', {
_template:"<template tag-name=\"lyte-dropdown\">\t<template is=\"if\" value=\"{{expHandlers(ltPropHover,'==',true)}}\"><template case=\"true\">\t\t<template is=\"if\" value=\"{{expHandlers(multiple,'==',true)}}\"><template case=\"true\">\t\t\t<template is=\"if\" value=\"{{expHandlers(search,'==',true)}}\"><template case=\"true\">\t\t\t\t<template is=\"if\" value=\"{{expHandlers(drophead,'==','noyield')}}\"><template case=\"true\">\t\t\t\t\t<lyte-drop-button>\t\t\t\t\t\t<div class=\"lyteMultiselect\">\t\t\t\t\t\t\t<template is=\"if\" value=\"{{expHandlers(allSelected.length,'!==',0)}}\"><template case=\"true\">\t\t\t\t\t\t\t\t<ul class=\"lyteMultipleSelect\">\t\t\t\t\t\t\t\t\t<template is=\"for\" items=\"{{allSelected}}\" item=\"item\" index=\"indexVal\">\t\t\t\t\t\t\t\t\t\t<li data-value=\"{{item['value']}}\">\t\t\t\t\t\t\t\t\t\t\t<span class=\"lyteDropdownVisible\">{{item['display']}}</span>\t\t\t\t\t\t\t\t\t\t\t<lyte-drop-remove class=\"lyteCloseIcon\"></lyte-drop-remove>\t\t\t\t\t\t\t\t\t\t</li>\t\t\t\t\t\t\t\t\t</template>\t\t\t\t\t\t\t\t</ul>\t\t\t\t\t\t\t</template></template>\t\t\t\t\t\t\t<input type=\"text\" placeholder=\"{{ltPropPlaceholder}}\" class=\"lyteDropdownTextField\" autocomplete=\"off\" tabindex=\"{{ltPropTabindex}}\" onclick=\"{{action('showHide',event)}}\">\t\t\t\t\t\t</div>\t\t\t\t\t</lyte-drop-button>\t\t\t\t</template><template case=\"false\">\t\t\t\t</template></template>\t\t\t</template><template case=\"false\">\t\t\t\t<template is=\"if\" value=\"{{expHandlers(drophead,'==','noyield')}}\"><template case=\"true\">\t\t\t\t\t<div class=\"lyteDummyEventContainer\" onclick=\"{{action('showHide',event)}}\" onkeyup=\"{{action('checkKey',event)}}\" tabindex=\"{{ltPropTabindex}}\">\t\t\t\t\t\t<lyte-drop-button>\t\t\t\t\t\t\t<template is=\"if\" value=\"{{expHandlers(allSelected.length,'==',0)}}\"><template case=\"true\">\t\t\t\t\t\t\t\t<span class=\"lyteDropPlaceholderMultiple\">{{ltPropPlaceholder}}</span>\t\t\t\t\t\t\t</template></template>\t\t\t\t\t\t\t<ul class=\"lyteMultipleSelect\">\t\t\t\t\t\t\t\t<template is=\"for\" items=\"{{allSelected}}\" item=\"item\" index=\"indexVal\">\t\t\t\t\t\t\t\t\t<li data-value=\"{{item['value']}}\">\t\t\t\t\t\t\t\t\t\t<span class=\"lyteDropdownVisible\">{{item['display']}}</span>\t\t\t\t\t\t\t\t\t\t<lyte-drop-remove class=\"lyteCloseIcon\"></lyte-drop-remove>\t\t\t\t\t\t\t\t\t</li>\t\t\t\t\t\t\t\t</template>\t\t\t\t\t\t\t</ul>\t\t\t\t\t\t</lyte-drop-button>\t\t\t\t\t</div>\t\t\t\t</template><template case=\"false\">\t\t\t\t</template></template>\t\t\t</template></template>\t\t</template><template case=\"false\">\t\t\t<div onmouseenter=\"{{action('showHide',event,'enter')}}\" onmouseleave=\"{{action('closeIt',event)}}\" class=\"lyteDummyEventContainer\" tabindex=\"{{ltPropTabIndex}}\" style=\"\">\t\t\t\t<template is=\"if\" value=\"{{expHandlers(drophead,'==','noyield')}}\"><template case=\"true\">\t\t\t\t\t<lyte-drop-button>\t\t\t\t\t\t<template is=\"if\" value=\"{{ltPropDisplayValue}}\"><template case=\"true\">\t\t\t\t\t\t\t<span class=\"lyteMarginRight\">{{ltPropDisplayValue}}</span>\t\t\t\t\t\t</template><template case=\"false\">\t\t\t\t\t\t\t<span class=\"lyteDropPlaceholderNormal\">{{ltPropPlaceholder}}</span>\t\t\t\t\t\t</template></template>\t\t\t\t\t\t<lyte-icon class=\"{{ltPropIconClass}}\"></lyte-icon>\t\t\t\t\t</lyte-drop-button>\t\t\t\t</template><template case=\"false\"><template is=\"if\" value=\"{{expHandlers(drophead,'==','yield')}}\"><template case=\"true\">\t\t\t\t\t\t\t\t\t</template></template></template></template>\t\t\t</div>\t\t</template></template>\t</template><template case=\"false\">\t\t<template is=\"if\" value=\"{{expHandlers(multiple,'==',true)}}\"><template case=\"true\">\t\t\t<template is=\"if\" value=\"{{expHandlers(search,'==',true)}}\"><template case=\"true\">\t\t\t\t<template is=\"if\" value=\"{{expHandlers(drophead,'==','noyield')}}\"><template case=\"true\">\t\t\t\t\t<lyte-drop-button onclick=\"{{action('showHide',event)}}\">\t\t\t\t\t\t<div class=\"lyteMultiselect\">\t\t\t\t\t\t\t<template is=\"if\" value=\"{{expHandlers(allSelected.length,'!==',0)}}\"><template case=\"true\">\t\t\t\t\t\t\t\t<ul class=\"lyteMultipleSelect\">\t\t\t\t\t\t\t\t\t<template is=\"for\" items=\"{{allSelected}}\" item=\"item\" index=\"indexVal\">\t\t\t\t\t\t\t\t\t\t<li data-value=\"{{item['value']}}\">\t\t\t\t\t\t\t\t\t\t\t<span class=\"lyteDropdownVisible\">{{item['display']}}</span>\t\t\t\t\t\t\t\t\t\t\t<lyte-drop-remove class=\"lyteCloseIcon\"></lyte-drop-remove>\t\t\t\t\t\t\t\t\t\t</li>\t\t\t\t\t\t\t\t\t</template>\t\t\t\t\t\t\t\t</ul>\t\t\t\t\t\t\t</template></template>\t\t\t\t\t\t\t<input type=\"text\" placeholder=\"{{ltPropPlaceholder}}\" class=\"lyteDropdownTextField\" autocomplete=\"off\" tabindex=\"{{ltPropTabindex}}\">\t\t\t\t\t\t</div>\t\t\t\t\t</lyte-drop-button>\t\t\t\t</template><template case=\"false\">\t\t\t\t\t<div class=\"lyteDummyEventContainer\" tabindex=\"{{ltPropTabIndex}}\" style=\"\" onclick=\"{{action('showHide',event)}}\">\t\t\t\t\t</div>\t\t\t\t</template></template>\t\t\t</template><template case=\"false\">\t\t\t\t<div class=\"lyteDummyEventContainer\" onclick=\"{{action('showHide',event)}}\" onkeyup=\"{{action('checkKey',event)}}\" tabindex=\"{{ltPropTabindex}}\">\t\t\t\t<template is=\"if\" value=\"{{expHandlers(drophead,'==','noyield')}}\"><template case=\"true\">\t\t\t\t\t<lyte-drop-button>\t\t\t\t\t\t<template is=\"if\" value=\"{{expHandlers(allSelected.length,'==',0)}}\"><template case=\"true\">\t\t\t\t\t\t\t<span class=\"lyteDropPlaceholderMultiple\">{{ltPropPlaceholder}}</span>\t\t\t\t\t\t</template></template>\t\t\t\t\t\t<ul class=\"lyteMultipleSelect\">\t\t\t\t\t\t\t<template is=\"for\" items=\"{{allSelected}}\" item=\"item\" index=\"indexVal\">\t\t\t\t\t\t\t\t<li data-value=\"{{item['value']}}\">\t\t\t\t\t\t\t\t\t<span class=\"lyteDropdownVisible\">{{item['display']}}</span>\t\t\t\t\t\t\t\t\t<lyte-drop-remove class=\"lyteCloseIcon\"></lyte-drop-remove>\t\t\t\t\t\t\t\t</li>\t\t\t\t\t\t\t</template>\t\t\t\t\t\t</ul>\t\t\t\t\t</lyte-drop-button>\t\t\t\t</template><template case=\"false\">\t\t\t\t</template></template>\t\t\t\t</div>\t\t\t</template></template>\t\t</template><template case=\"false\">\t\t\t<div onclick=\"{{action('showHide',event)}}\" class=\"lyteDummyEventContainer\" tabindex=\"{{ltPropTabIndex}}\" style=\"\">\t\t\t\t<template is=\"if\" value=\"{{expHandlers(drophead,'==','noyield')}}\"><template case=\"true\">\t\t\t\t\t<lyte-drop-button>\t\t\t\t\t\t<template is=\"if\" value=\"{{ltPropDisplayValue}}\"><template case=\"true\">\t\t\t\t\t\t\t<span class=\"lyteMarginRight\">{{ltPropDisplayValue}}</span>\t\t\t\t\t\t</template><template case=\"false\">\t\t\t\t\t\t\t<span class=\"lyteDropPlaceholderNormal\">{{ltPropPlaceholder}}</span>\t\t\t\t\t\t</template></template>\t\t\t\t\t\t<lyte-icon class=\"{{ltPropIconClass}}\"></lyte-icon>\t\t\t\t\t</lyte-drop-button>\t\t\t\t</template><template case=\"false\"><template is=\"if\" value=\"{{expHandlers(drophead,'==','yield')}}\"><template case=\"true\">\t\t\t\t\t\t\t\t\t</template></template></template></template>\t\t\t</div>\t\t</template></template>\t</template></template>\t\t<template is=\"if\" value=\"{{expHandlers(ltPropHover,'==',false)}}\"><template case=\"true\">\t\t\t<template is=\"if\" value=\"{{expHandlers(dropbody,'==','noyield')}}\"><template case=\"true\">\t\t\t\t<lyte-drop-box class=\"lyteDropdownHidden\">\t\t\t\t<lyte-drop-body>\t\t\t\t\t<template is=\"for\" items=\"{{ltPropOptions}}\" item=\"item\" index=\"indexVal\"><template is=\"if\" value=\"{{lyteUiOptGroupCheck(item)}}\"><template case=\"true\">\t\t\t\t\t\t\t<lyte-drop-group>\t\t\t\t\t\t\t\t<lyte-drop-label>{{lyteUiReturnOnlyKey(item)}}</lyte-drop-label>\t\t\t\t\t\t\t\t<template is=\"for\" items=\"{{lyteUiReturnValueBy(item,lyteUiReturnOnlyKey(item))}}\" item=\"subitem\" index=\"indexval\">\t\t\t\t\t\t\t\t\t<template is=\"if\" value=\"{{lyteUiIsObject(subitem)}}\"><template case=\"true\">\t\t\t\t\t\t\t\t\t\t<lyte-drop-item data-value=\"{{subitem[ltPropSystemValue]}}\" disabled=\"{{lyteUiCheckDisabled(ltPropDisabledList,subitem[ltPropSystemValue])}}\">{{subitem[ltPropUserValue]}}</lyte-drop-item>\t\t\t\t\t\t\t\t\t</template><template case=\"false\">\t\t\t\t\t\t\t\t\t\t<lyte-drop-item data-value=\"{{subitem}}\" disabled=\"{{lyteUiCheckDisabled(ltPropDisabledList,subitem)}}\">{{subitem}}</lyte-drop-item>\t\t\t\t\t\t\t\t\t</template></template>\t\t\t\t\t\t\t\t</template>\t\t\t\t\t\t\t</lyte-drop-group>\t\t\t\t\t\t</template><template case=\"false\">\t\t\t\t\t\t\t<template is=\"if\" value=\"{{lyteUiIsObject(item)}}\"><template case=\"true\">\t\t\t\t\t\t\t\t<lyte-drop-item data-value=\"{{item[ltPropSystemValue]}}\" disabled=\"{{lyteUiCheckDisabled(ltPropDisabledList,item[ltPropSystemValue])}}\">{{item[ltPropUserValue]}}</lyte-drop-item>\t\t\t\t\t\t\t</template><template case=\"false\">\t\t\t\t\t\t\t\t<lyte-drop-item data-value=\"{{item}}\" disabled=\"{{lyteUiCheckDisabled(ltPropDisabledList,item)}}\">{{item}}</lyte-drop-item>\t\t\t\t\t\t\t</template></template>\t\t\t\t\t\t</template></template>\t\t\t\t\t</template>\t\t\t\t\t\t\t\t\t</lyte-drop-body>\t\t\t\t</lyte-drop-box>\t\t\t</template><template case=\"false\">\t\t\t</template></template>\t\t\t<div class=\"lyteLoadMsg\" style=\"display:none;\">Loading</div>\t\t</template><template case=\"false\">\t\t\t<template is=\"if\" value=\"{{expHandlers(dropbody,'==','noyield')}}\"><template case=\"true\">\t\t\t\t<lyte-drop-box>\t\t\t\t<lyte-drop-body>\t\t\t\t\t<template is=\"for\" items=\"{{ltPropOptions}}\" item=\"item\" index=\"indexVal\"><template is=\"if\" value=\"{{lyteUiOptGroupCheck(item)}}\"><template case=\"true\">\t\t\t\t\t\t\t<lyte-drop-group>\t\t\t\t\t\t\t\t<lyte-drop-label>lyteUiReturnOnlyKey(item)</lyte-drop-label>\t\t\t\t\t\t\t\t<template is=\"for\" items=\"{{lyteUiReturnValueBy(item,lyteReturnOnlyKey(item))}}\" item=\"subitem\" index=\"indexval\">\t\t\t\t\t\t\t\t\t<template is=\"if\" value=\"{{lyteUiIsObject(subitem)}}\"><template case=\"true\">\t\t\t\t\t\t\t\t\t\t<lyte-drop-item data-value=\"{{subitem[ltPropSystemValue]}}\" disabled=\"{{lyteUiCheckDisabled(ltPropDisabledList,subitem[ltPropSystemValue])}}\">{{subitem[ltPropUserValue]}}</lyte-drop-item>\t\t\t\t\t\t\t\t\t</template><template case=\"false\">\t\t\t\t\t\t\t\t\t\t<lyte-drop-item data-value=\"{{subitem}}\" disabled=\"{{lyteUiCheckDisabled(ltPropDisabledList,subitem)}}\">{{subitem}}</lyte-drop-item>\t\t\t\t\t\t\t\t\t</template></template>\t\t\t\t\t\t\t\t</template>\t\t\t\t\t\t\t</lyte-drop-group>\t\t\t\t\t\t</template><template case=\"false\">\t\t\t\t\t\t\t<template is=\"if\" value=\"{{lyteUiIsObject(item)}}\"><template case=\"true\">\t\t\t\t\t\t\t\t<lyte-drop-item data-value=\"{{item[ltPropSystemValue]}}\" disabled=\"{{lyteUiCheckDisabled(ltPropDisabledList,item[ltPropSystemValue])}}\">{{item[ltPropUserValue]}}</lyte-drop-item>\t\t\t\t\t\t\t</template><template case=\"false\">\t\t\t\t\t\t\t\t<lyte-drop-item data-value=\"{{item}}\" disabled=\"{{lyteUiCheckDisabled(ltPropDisabledList,item)}}\">{{item}}</lyte-drop-item>\t\t\t\t\t\t\t</template></template>\t\t\t\t\t\t</template></template>\t\t\t\t\t</template>\t\t\t\t</lyte-drop-body>\t\t\t\t</lyte-drop-box>\t\t\t</template><template case=\"false\">\t\t\t</template></template>\t\t\t<div class=\"lyteLoadMsg\" style=\"display:none;\">Loading</div>\t\t</template></template>\t\t<lyte-yield yield-name=\"yield\" style=\"display: none;\"></lyte-yield></template>",
_dynamicNodes : [{"type":"attr","position":[1]},{"type":"if","position":[1],"cases":{"true":{"dynamicNodes":[{"type":"attr","position":[1]},{"type":"if","position":[1],"cases":{"true":{"dynamicNodes":[{"type":"attr","position":[1]},{"type":"if","position":[1],"cases":{"true":{"dynamicNodes":[{"type":"attr","position":[1]},{"type":"if","position":[1],"cases":{"true":{"dynamicNodes":[{"type":"attr","position":[1,1,1]},{"type":"if","position":[1,1,1],"cases":{"true":{"dynamicNodes":[{"type":"attr","position":[1,1]},{"type":"for","position":[1,1],"dynamicNodes":[{"type":"attr","position":[1]},{"type":"text","position":[1,1,0]},{"type":"componentDynamic","position":[1,3]}]}]}},"default":{}},{"type":"attr","position":[1,1,3]},{"type":"componentDynamic","position":[1]}]},"false":{"dynamicNodes":[]}},"default":{}}]},"false":{"dynamicNodes":[{"type":"attr","position":[1]},{"type":"if","position":[1],"cases":{"true":{"dynamicNodes":[{"type":"attr","position":[1]},{"type":"attr","position":[1,1,1]},{"type":"if","position":[1,1,1],"cases":{"true":{"dynamicNodes":[{"type":"text","position":[1,0]}]}},"default":{}},{"type":"attr","position":[1,1,3,1]},{"type":"for","position":[1,1,3,1],"dynamicNodes":[{"type":"attr","position":[1]},{"type":"text","position":[1,1,0]},{"type":"componentDynamic","position":[1,3]}]},{"type":"componentDynamic","position":[1,1]}]},"false":{"dynamicNodes":[]}},"default":{}}]}},"default":{}}]},"false":{"dynamicNodes":[{"type":"attr","position":[1]},{"type":"attr","position":[1,1]},{"type":"if","position":[1,1],"cases":{"true":{"dynamicNodes":[{"type":"attr","position":[1,1]},{"type":"if","position":[1,1],"cases":{"true":{"dynamicNodes":[{"type":"text","position":[1,0]}]},"false":{"dynamicNodes":[{"type":"text","position":[1,0]}]}},"default":{}},{"type":"attr","position":[1,3]},{"type":"componentDynamic","position":[1,3]},{"type":"componentDynamic","position":[1]}]},"false":{"dynamicNodes":[{"type":"attr","position":[0]},{"type":"if","position":[0],"cases":{"true":{"dynamicNodes":[]}},"default":{}}]}},"default":{}}]}},"default":{}}]},"false":{"dynamicNodes":[{"type":"attr","position":[1]},{"type":"if","position":[1],"cases":{"true":{"dynamicNodes":[{"type":"attr","position":[1]},{"type":"if","position":[1],"cases":{"true":{"dynamicNodes":[{"type":"attr","position":[1]},{"type":"if","position":[1],"cases":{"true":{"dynamicNodes":[{"type":"attr","position":[1]},{"type":"attr","position":[1,1,1]},{"type":"if","position":[1,1,1],"cases":{"true":{"dynamicNodes":[{"type":"attr","position":[1,1]},{"type":"for","position":[1,1],"dynamicNodes":[{"type":"attr","position":[1]},{"type":"text","position":[1,1,0]},{"type":"componentDynamic","position":[1,3]}]}]}},"default":{}},{"type":"attr","position":[1,1,3]},{"type":"componentDynamic","position":[1]}]},"false":{"dynamicNodes":[{"type":"attr","position":[1]}]}},"default":{}}]},"false":{"dynamicNodes":[{"type":"attr","position":[1]},{"type":"attr","position":[1,1]},{"type":"if","position":[1,1],"cases":{"true":{"dynamicNodes":[{"type":"attr","position":[1,1]},{"type":"if","position":[1,1],"cases":{"true":{"dynamicNodes":[{"type":"text","position":[1,0]}]}},"default":{}},{"type":"attr","position":[1,3,1]},{"type":"for","position":[1,3,1],"dynamicNodes":[{"type":"attr","position":[1]},{"type":"text","position":[1,1,0]},{"type":"componentDynamic","position":[1,3]}]},{"type":"componentDynamic","position":[1]}]},"false":{"dynamicNodes":[]}},"default":{}}]}},"default":{}}]},"false":{"dynamicNodes":[{"type":"attr","position":[1]},{"type":"attr","position":[1,1]},{"type":"if","position":[1,1],"cases":{"true":{"dynamicNodes":[{"type":"attr","position":[1,1]},{"type":"if","position":[1,1],"cases":{"true":{"dynamicNodes":[{"type":"text","position":[1,0]}]},"false":{"dynamicNodes":[{"type":"text","position":[1,0]}]}},"default":{}},{"type":"attr","position":[1,3]},{"type":"componentDynamic","position":[1,3]},{"type":"componentDynamic","position":[1]}]},"false":{"dynamicNodes":[{"type":"attr","position":[0]},{"type":"if","position":[0],"cases":{"true":{"dynamicNodes":[]}},"default":{}}]}},"default":{}}]}},"default":{}}]}},"default":{}},{"type":"attr","position":[3]},{"type":"if","position":[3],"cases":{"true":{"dynamicNodes":[{"type":"attr","position":[1]},{"type":"if","position":[1],"cases":{"true":{"dynamicNodes":[{"type":"attr","position":[1,1,1]},{"type":"for","position":[1,1,1],"dynamicNodes":[{"type":"attr","position":[0]},{"type":"if","position":[0],"cases":{"true":{"dynamicNodes":[{"type":"text","position":[1,1,0]},{"type":"componentDynamic","position":[1,1]},{"type":"attr","position":[1,3]},{"type":"for","position":[1,3],"dynamicNodes":[{"type":"attr","position":[1]},{"type":"if","position":[1],"cases":{"true":{"dynamicNodes":[{"type":"attr","position":[1]},{"type":"text","position":[1,0]},{"type":"componentDynamic","position":[1]}]},"false":{"dynamicNodes":[{"type":"attr","position":[1]},{"type":"text","position":[1,0]},{"type":"componentDynamic","position":[1]}]}},"default":{}}]},{"type":"componentDynamic","position":[1]}]},"false":{"dynamicNodes":[{"type":"attr","position":[1]},{"type":"if","position":[1],"cases":{"true":{"dynamicNodes":[{"type":"attr","position":[1]},{"type":"text","position":[1,0]},{"type":"componentDynamic","position":[1]}]},"false":{"dynamicNodes":[{"type":"attr","position":[1]},{"type":"text","position":[1,0]},{"type":"componentDynamic","position":[1]}]}},"default":{}}]}},"default":{}}]},{"type":"componentDynamic","position":[1,1]},{"type":"componentDynamic","position":[1]}]},"false":{"dynamicNodes":[]}},"default":{}}]},"false":{"dynamicNodes":[{"type":"attr","position":[1]},{"type":"if","position":[1],"cases":{"true":{"dynamicNodes":[{"type":"attr","position":[1,1,1]},{"type":"for","position":[1,1,1],"dynamicNodes":[{"type":"attr","position":[0]},{"type":"if","position":[0],"cases":{"true":{"dynamicNodes":[{"type":"componentDynamic","position":[1,1]},{"type":"attr","position":[1,3]},{"type":"for","position":[1,3],"dynamicNodes":[{"type":"attr","position":[1]},{"type":"if","position":[1],"cases":{"true":{"dynamicNodes":[{"type":"attr","position":[1]},{"type":"text","position":[1,0]},{"type":"componentDynamic","position":[1]}]},"false":{"dynamicNodes":[{"type":"attr","position":[1]},{"type":"text","position":[1,0]},{"type":"componentDynamic","position":[1]}]}},"default":{}}]},{"type":"componentDynamic","position":[1]}]},"false":{"dynamicNodes":[{"type":"attr","position":[1]},{"type":"if","position":[1],"cases":{"true":{"dynamicNodes":[{"type":"attr","position":[1]},{"type":"text","position":[1,0]},{"type":"componentDynamic","position":[1]}]},"false":{"dynamicNodes":[{"type":"attr","position":[1]},{"type":"text","position":[1,0]},{"type":"componentDynamic","position":[1]}]}},"default":{}}]}},"default":{}}]},{"type":"componentDynamic","position":[1,1]},{"type":"componentDynamic","position":[1]}]},"false":{"dynamicNodes":[]}},"default":{}}]}},"default":{}},{"type":"insertYield","position":[5]}],
_observedAttributes :["changeItToInvoke","dummy1","dummy2","ltPropRemoveMultiple","ltPropYield","ltPropType","ltPropTabindex","ltPropShow","ltPropFreeze","ltPropOptions","ltPropUserValue","ltPropSystemValue","ltPropPosition","ltPropIconClass","ltPropSelected","ltPropCallout","ltPropPlaceholder","ltPropDisabled","ltPropHover","ltPropNoResult","ltPropInputClass","allSelected","ltPropBoundary","pos","firePos","ltPropAjaxRequest","firstRequest","ltPropDisplayValue","ltPropDisabledList","ltPropAnimate","ltPropSetPos"],
	init: function() {
		var type = this.getData( 'ltPropType' ),
		sel = this.getData( 'ltPropSelected' );
		this._close = this.closeDrop1.bind( this )

		// if( !Lyte.Component.registeredHelpers.lyteUiIsEmptyObject( this.getData( 'ltPropAjaxRequest' ) ) ) {
		// 	this.fetchData();
		// }

		if( !document.getElementById( 'lytedropdownfreezelayer' ) ) {
			var fzl ;
			fzl = document.createElement( 'div' );
			fzl.setAttribute( 'id', 'lytedropdownfreezelayer' );
			fzl.style.display = 'none';
			fzl.style.opacity = '0.01';
			fzl.style.background = '#fff';
			document.body.appendChild( fzl );
		}

		// Create toggle function
		this.$node.toggle = function( event, type ) {
			var val = event ? event : undefined;
			if( this.component.getData( 'ltPropDisabled' ) ) {
				return ;
			}

			this.constructor._actions.showHide.call(this.component, val, type, true);
		}


		if( type.indexOf( 'multiple' ) !== -1 
			|| type.indexOf( 'multisearch' ) !== -1 
		) {
			this.setData( 'multiple', true );
			this.setData( 'allSelected', [] );
			if( !sel ) {
				this.setData( 'ltPropSelected', '[]' );
			}

			if( type.indexOf('multisearch') !== -1 ) {
				this.setData( 'search', true );
			}
		}
	},

	didDestroy: function() {
		var body = this.childComp,
		mut = this.$node.mutobserver;

		if( body ) {
			body.remove();
		}

		if( mut ) {
			mut.disconnect()
		}
	},

	// Do a dfs to find the types of dropdown
	getChildren: function( childs ) {
		var head = this.getData( 'drophead' ),
		body = this.getData( 'dropbody' ),
		tag, i = 0, drop = this.$node;

		if( head === 'yield' && body === 'yield' ) {
			return ;
		}

		for( ; i < childs.length; i++ ) {

			tag = childs[i].tagName;
			if( tag === 'LYTE-DROPDOWN' 
				|| tag === 'TEMPLATE'
			) {
				continue;
			}

			if( tag === 'LYTE-DROP-BOX' ) {
				this.setData( 'dropbody', 'yield' );
				drop.querySelector( 'lyte-drop-box' ).classList.add( 'lyteDropdownHidden' );
			}
			else if( tag === 'LYTE-DROP-BUTTON' ) {
				this.setData( 'drophead', 'yield' );
				LyteComponent.appendChild( drop.querySelector( '.lyteDummyEventContainer' ), drop.querySelector( 'lyte-drop-button' ) );
				i--;
			}
			else {
				this.getChildren( childs[ i ].children );
			}
		}
	},

	didConnect: function() {

		var drop = this.$node,
		link = this.childComp,
		yd = drop.querySelector( 'lyte-yield' ),
		ph = this.getData( 'ltPropPlaceholder' ),
		hover = this.getData( 'ltPropHover' ),
		sel = this.getData( 'ltPropSelected' ),
		options = this.getData( 'ltPropOptions' ),
		type = this.getData( 'ltPropType' ),
		disabled = this.getData( 'ltPropDisabled' ),
		index = this.getData( 'ltPropTabindex' ),
		show = this.getData( 'ltPropShow' ),
		list = this.getData( 'ltPropDisabledList' ),
		disp = this.getData( 'ltPropDisplayValue' ),
		button, box, config, div, span, node, tab, head, body, boxes;


		this.getChildren( yd.children );
		head = this.getData( 'drophead' );
		body = this.getData( 'dropbody' );
		if( head !== 'yield' ) {
			this.setData( 'drophead', head = 'noyield' );
		}

		if( body !== 'yield') {
			this.setData( 'dropbody', body = 'noyield' );
		}

		box = drop.querySelector( 'lyte-drop-box' )

		// Mutation observer
		drop.mutobserver = new MutationObserver( function( mutations ) {
			if( this._prevent ) {
				return
			}
			if( this._hgtRemoval ) {
				delete this._hgtRemoval;
				return
			}
			var dropbox = this.childComp ? this.childComp : drop.querySelector( 'lyte-drop-box' ), ev, i,
			// Added so that users can now set the left and top in onBeforeShow callback without setCss interfering with it.
			manual = this.getData( 'ltPropSetPos' );

			if( manual 
				|| dropbox.classList.contains( 'lyteDropdownHidden' ) 
			) {
				return ;
			}

			if( this.getData( 'multiple' ) ) {
				var notselected = false
				for( i = 0; i < mutations.length; i++ ) {
					var allCases = mutations[i].type == 'childList' 
								   	&& mutations[i].target.tagName == 'LYTE-DROP-ITEM' 
								   	|| mutations[i].attributeName == 'selected' 
								   	|| (
										mutations[i].attributeName == 'class' 
										// Prevent firing when setting class to lyteArrow span
										&& ( !mutations[ i ].target.classList.contains( 'lyteArrow' )

											// Prevent firing when setting the lyteDropdownCurrent class for the lyte-drop-item
											// We want to fire in the other cases
											&& (
												mutations[ i ].target.tagName === 'LYTE-DROP-ITEM' ?
												!this.hasClassToggled( mutations[ i ], 'lyteMenuSelected' )
												: true
											)
										)
									) 
									|| ( 
										mutations[i].attributeName == 'style' 
										&& mutations[i].target.tagName != 'LYTE-DROP-BOX' 
										&& !mutations[i].target.classList.contains( 'lyteArrow' )
									);

					if( allCases ) {
						notselected = true
						break;
					}
				}

				if( notselected ) {
					$L.fastdom.measure( function() {
						// Not putting inside fastdom because it causes a jitter 
						if( this.data.ltPropAnimate ) {
							this._hgtRemoval = true
							this.childComp.querySelector( 'lyte-drop-body' ).style.height = '';
						}
						this.setCss();
						this.openSlideAnimate()
						if( this.getData( 'call' ) && this.getMethods( 'onShow' ) ) {
							ev = this.getData( 'call' );
							ev = ev === true ? undefined : ev;
							this.setData( 'call', null );
							this.executeMethod( 'onShow', ev, this );
						}
					}, this );
				}
			}
			else {
				var notselected = false
				var stylemutations = false
				for( i = 0; i < mutations.length; i++ ) {
					if( mutations[i].attributeName == 'style' 
						&& mutations[i].target.tagName == 'LYTE-DROP-BOX' 
					) {
						stylemutations = true
					}
				}

				for( i = 0; i < mutations.length; i++ ) {
					var allCases = // Fire when new children are added to the dropdown
									mutations[i].type == 'childList' 
									&& mutations[i].target.tagName == 'LYTE-DROP-ITEM' 
									|| (
										mutations[i].attributeName == 'style' 

										// Prevent firing when setting styles to drop-box
										&& mutations[i].target.tagName != 'LYTE-DROP-BOX'

										// Prevent firing when setting styles to lyteArrow 
										&& !mutations[i].target.classList.contains('lyteArrow')
									) 
									|| (
										mutations[i].attributeName == 'class'
										&& mutations[ i ].type === 'attributes'

										// Prevent firing when setting class to lyteArrow span
										&& ( !mutations[i].target.classList.contains( 'lyteArrow' )

											// Prevent firing when setting the lyteDropdownCurrent class for the lyte-drop-item
											// We want to fire in the other cases
											&& (
												mutations[ i ].target.tagName === 'LYTE-DROP-ITEM' ?
												!this.hasClassToggled( mutations[ i ], 'lyteMenuSelected' )
												: true
											)
										)
									);

					// If a class mutation happened,check if there is a style mutation in LYTE-DROP-BOX. If there is then do nothing
					if( allCases 
						&& mutations[ i ].attributeName == 'class' 
						&& mutations[ i ].target.tagName == 'LYTE-DROP-BOX' 
					) {
						if( !stylemutations ) {
							notselected = true
							break;
						}
					}
					else if( allCases && !stylemutations ) {
						notselected = true
					}
				}

				if( notselected ) {
					$L.fastdom.measure( function() { 
						// Not putting inside fastdom because it causes a jitter 
						if( this.data.ltPropAnimate ) {
							this._hgtRemoval = true
							this.childComp.querySelector( 'lyte-drop-body' ).style.height = '';
						}
						this.setCss();
						this.openSlideAnimate()
						if( this.getData( 'call' ) && this.getMethods( 'onShow' ) ) {
							ev = this.getData( 'call' );
							ev = ev === true ? undefined : ev;
							this.setData( 'call', null );
							this.executeMethod( 'onShow', ev, this );
						}
					}, this );
				}
			}

			if( this.getData( 'call' ) && this.getMethods( 'onShow' ) ) {
				ev = this.getData( 'call' );
				ev = ev === true ? undefined : ev;
				this.setData( 'call', null );
				this.executeMethod( 'onShow', ev, this );
			}
		}.bind( this ) );

		config = { 
			attributes: true,
			childList : true,
			subtree: true,
			attributeOldValue: true 
		};

		drop.mutobserver.observe( box, config );
		// Mutation observer ends

		div = document.createElement( 'div' );
		div.setAttribute( 'class', 'lyteDropdownNoResult' );
		div.textContent = _lyteUiUtils.i18n( 'no.results.found' );
		div.style.display = 'none';

		box.appendChild( div );
		box.addEventListener( 'click', function( event ) {
			this.actions.processElements.call( this, event );
		}.bind( this ) );

		if( hover ) {
			box.addEventListener( 'mouseout', function( event ) {
				this.actions.closeIt.call( this, event );
			}.bind( this ) );
		}

		span = document.createElement( 'span' );
		span.setAttribute( 'class', 'lyteArrow' );
		box.insertBefore( span, box.children[ 0 ] );

		//We need to set the first value in the dropdown as the selected one
		if( !ph && !disp && !sel && options.length > 0 ) {
			var firstElement = options[ 0 ],
			flag = false,
			value;

			if( firstElement.constructor == Object ) {
           		if( Object.keys( firstElement ).length == 1 ) {
	              	value = firstElement[ Object.keys( firstElement )[ 0 ] ];
	              	if( value.constructor == Array ) {
	                   	flag = true
	               	}
	            }   
           	}

           	if( flag ) {
           		if ( Object.prototype.toString.call( value[ 0 ] ) === '[object Object]' ) {
           			this.setData( 'ltPropSelected', value[ 0 ][ this.getData( 'ltPropSystemValue' ) ] );
           		}
           		else{
           			this.setData( 'ltPropSelected', value[ 0 ] );
           		}
           	}
           	else{
           		if ( Object.prototype.toString.call( firstElement ) === '[object Object]' ) {
           			this.setData( 'ltPropSelected', firstElement[ this.getData( 'ltPropSystemValue' ) ] );
           		}
           		else {
           			this.setData( 'ltPropSelected', firstElement );
           		}
           	}	
		}
		else if(
			!ph
			&& !disp
			&& !this.getData( 'ltPropSelected' ) 
			&& body == 'yield' 
			&& type !== 'multiple' 
			&& type !== 'multisearch'
		) { 
			boxes = drop.querySelectorAll( 'lyte-drop-body' );
			node = boxes[ boxes.length - 1 ].querySelector( 'lyte-drop-item' );
			if( node ) {
				node.setAttribute( 'selected', true );
			}
		}

		tab = drop.querySelector('[tabindex]');
		if( disabled ) {
			tab.classList.add( 'lyteDropdown-disabled' );
			tab.setAttribute( 'tabindex', -1 );
		}
		else {
			tab.classList.remove( 'lyteDropdown-disabled' )
			tab.setAttribute( 'tabindex', index );
		}

		tab.addEventListener( 'keyup', function( event ) {
			drop.constructor._actions.checkKey.call( this, event );
		}.bind( this ) );

		// Bad way to trigger an observer
		this.setData( 'changeItToInvoke', this.getData( 'changeItToInvoke' ) + 1 );

		if( show ) {
			this.setData( 'ltPropShow', false );
			drop.toggle();

			$L.fastdom.measure( function() {
				tab.focus();
				var pos = drop.getBoundingClientRect();

				// This doesn't work exactly it can be behind a overflow'd div and still not be visible.
				if( pos.left < 0 
					|| pos.top < 0 
				) { 
					drop.scrollIntoView();
				}
			} );
			
		}

		link = this.childComp;
		if( link ) {
			link.querySelectorAll( 'lyte-drop-body' )[ link.querySelectorAll( 'lyte-drop-body' ).length - 1 ].addEventListener( 'scroll', function( event ) {
				this.callOnScroll( event, this );
			}.bind( this ) );
		}
		else {
			drop.querySelectorAll( 'lyte-drop-body' )[drop.querySelectorAll( 'lyte-drop-body' ).length - 1 ].addEventListener( 'scroll', function( event ) {
				this.callOnScroll( event, this );
			}.bind( this ) );
		}

		if( 
			options.length > 0 
			&& list.length > 0 
		) {
			this.addDisabledClass( drop.querySelectorAll( 'lyte-drop-item' ) );
		}
		
	},

	openSlideAnimate : function() {
		if( this.getData( 'ltPropAnimate' ) ){
			if( this._preventSetcss ) {
				return
			}
			this._preventSetcss = true
			this._prevent = true
			var box = this.childComp ? this.childComp : this.$node.querySelector('lyte-drop-box') 
			var elem = this.childComp ? this.childComp.querySelector('lyte-drop-body') : this.$node.querySelector('lyte-drop-body');
			this._oriStyle = elem.style.height;
			// animation starts from zero
			elem.style.height = 0;
			// for invert animation
			if( [ 'up', 'upLeft', 'upRight' ].indexOf( this.getData( 'pos' ) ) != -1 ) {
				box.style.top = parseInt( box.style.top ) + this._hgt - this._header - this._footer + 'px';
			}
			setTimeout( function(){
				// animation class added
				box.classList.add( 'lyteAnimate' );
				setTimeout( function(){
					// invert anime starts
					if( [ 'up', 'upLeft', 'upRight' ].indexOf( this.getData( 'pos' ) ) != -1 ) {
						box.style.top = parseInt( box.style.top ) - this._hgt + this._header + this._footer + 'px';
					}
					// height animate starts
					elem.style.height = this._hgt - this._header - this._footer + 'px';
					setTimeout( function(){
						delete this._prevent;
					}.bind(this), 20)	
				}.bind(this), 20)	
			}.bind(this), 20)
		}
	},

	closeDrop : function( link, event, freeze ){
		if( this._prevent ) {
			return
		}
		if( this.getData( 'ltPropAnimate' ) ) {
			this._prevent = true;
			this._arguments = arguments;
			$L.fastdom.mutate( function(){
				var box = this.childComp ? this.childComp : this.$node.querySelector('lyte-drop-box') 
				var elem = this.childComp ? this.childComp.querySelector('lyte-drop-body') : this.$node.querySelector('lyte-drop-body');
				// height set to zero for hide animation
				elem.style.height = 0;
				// invert animation
				if( [ 'up', 'upLeft', 'upRight' ].indexOf( this.getData( 'pos' ) ) != -1 ) {
					box.style.top = parseInt( box.style.top ) + this._hgt - this._header - this._footer + 'px';
				}
				this._elem = elem;
				this._box = box;
				elem.addEventListener( 'transitionend', this._close )					
			}.bind(this))
		} else {
			this.closeDrop1( link, event, freeze )
		}
	},

	closeDrop1 : function( link, event, freeze){
		if( this._arguments ) {
			link = this._arguments[ 0 ], event = this._arguments[ 1 ], freeze = this._arguments[ 2 ]
			this._elem.style.height = this._oriStyle;
			//animate class removal
			this._box.classList.remove( 'lyteAnimate' );
			this._elem.removeEventListener( 'transitionend', this._close )	
			delete this._hgt; delete this._oriStyle; delete this._arguments; delete this._elem; delete this._box; delete this._header; delete this._footer
		}
		link.classList.add( 'lyteDropdownHidden' );
		var freezeLayer = document.querySelector( '#lytedropdownfreezelayer' )
		if( freezeLayer ){
			document.querySelector( '#lytedropdownfreezelayer' ).style.display = 'none'
		}
		// link.style.top = '';
		link.style.left = '';
		if( freeze ) {
			document.body.style.overflow = this.bodyoverflow ? this.bodyoverflow : ''
		}
		if( this.getMethods( 'onHide' ) ) {
			this.executeMethod( 'onHide', event, this );
		}

		this.setData( 'pos', '' );
		delete this._prevent;delete this._preventSetcss;
	},

	callOnScroll: function( event ) {
		var dropBody = this.childComp.querySelector('lyte-drop-body'),
		ajax = this.getData( 'ltPropAjaxRequest' );
		if( this.getMethods('onScroll') ) {
			this.executeMethod( 'onScroll', event, this );
		}

		// if( 
		// 	( dropBody.offsetHeight + dropBody.scrollTop == dropBody.scrollHeight ) 
		// 	&& !Lyte.Component.registeredHelpers.lyteUiIsEmptyObject( ajax ) 
		// ) {
		// 	this.fetchData();
		// }
	},

	// fetchData: function() {
	// 	var request = this.getData("ltPropAjaxRequest");
	// 	var param = request.param ? request.param : null;
	// 	var method = request.method ? request.method : 'GET';
	// 	var reqHeader = request.header && request.header.name ? request.header.name : "Content-type";
 //        var reqHeaderVal = request.header && request.header.value ? request.header.value : "application/x-www-form-urlencoded";
	// 	var self = this;
	// 	var httpRequest = new XMLHttpRequest();

	//     if (!httpRequest) {
	//       alert('Giving up :( Cannot create an XMLHTTP instance');
	//       return false;
	//     }
	//     httpRequest.onreadystatechange = function() {
	// 	    if (httpRequest.readyState === XMLHttpRequest.DONE) {
	// 	      if (httpRequest.status === 200) {
	// 	      	var key = self.getData('ltPropAjaxRequest').key;
	// 	      	if (self.getData('firstRequest')) {
	// 		  		self.setData('ltPropOptions',JSON.parse(httpRequest.responseText)[key]);
	// 		  		self.setData('ltPropSelected',self.getData('ltPropOptions')[0][self.getData('ltPropSystemValue')]);
	// 		  		self.setData('firstRequest',false);
	// 		  		// alert(httpRequest.responseText);
	// 		      }else{
	// 		      		var options = JSON.parse(httpRequest.responseText)[key];
	// 		      		Lyte.arrayUtils(self.getData('ltPropOptions'),"push",options);
	// 		      }
	// 	      } else {
	// 	        alert('There was a problem with the request.');
	// 	      }
	// 	    }
	// 	  }
	// 	if(method === "GET" && param){
	// 		httpRequest.open(method, request.url+'?'+param, true);
	// 		param = null;
	// 	}
	// 	else{
	//     	httpRequest.open(method, request.url, true);
	// 	}
	// 	httpRequest.setRequestHeader(reqHeader, reqHeaderVal);
	//     httpRequest.send(param);
	// },

	addDisabledClass: function( elements ) {
		var i = 0, e, ele;
		for( ; i < elements.length; i++ ) {
			ele = elements[ i ];
			if( ele.getAttribute( 'disabled' ) == 'true' ) {
				ele.classList.add( 'lyteDropdown-disabled' );
			}
			else if( ele.classList.contains( 'lyteDropdown-disabled' ) ) {
				ele.classList.remove( 'lyteDropdown-disabled' );
			}
		}
	},

	onChangeInDisabledList: function() {
		var elements = this.childComp ? this.childComp.querySelectorAll('lyte-drop-item') : this.$node.querySelector('lyte-drop-item');
		for(var i = 0; i<elements.length; i++){
			elements[i].setAttribute('disabled',Lyte.Component.registeredHelpers.lyteUiCheckDisabled(this.getData('ltPropDisabledList'),elements[i].dataset.value));
		}
		this.addDisabledClass(elements);

	}.observes('ltPropDisabledList'),

	firePosCallBack: function() {
		var pos = this.getData( 'pos' );

		if( this.getMethods( 'onPositionChanged' ) && pos !== '') {
			this.executeMethod( 'onPositionChanged', pos, this);
		}
	}.observes(
		'pos',
		'firePos'
	),

	returnValueBy: function( content, key ) {
		if( key ) {
			return content[ key ];
		}

		return content;
	},

	findParent: function() {
		var tag = this.$node;

		if( this.getData( 'buttondisplay' ) ) {
			return tag.querySelector('.lyteDropdownButtonContainer')
		}
		else if( this.getData( 'multiple' ) ) {
			return tag.querySelector( '.lyteMultiselect' );
		}
		else{
			return tag.querySelector( '.lyteDropdownElement1' );
		}
	},

	setProperWidth: function( dropdownbutton, bcr, dropdownwidth ) {
		// Incomplete function - will probably add it later			
	},
	/*
		Calculate left of dropdown container when it has to come below/above the select element when it exceeds window.innerWidth and there is space to the right
	*/
	setLeftExceedForDown: function( element, container, bcr, containerbcr, xscroll ) {
		var scrolledLeft = xscroll,
		elementBCR = bcr,
		elementLeft = elementBCR.left,
		elementWidth = elementBCR.width,
		containerBCR = containerbcr,
		containerWidth = containerBCR.width,
		total = scrolledLeft + elementLeft + elementWidth - containerWidth;

		return total
	},
	/*
		Calculate left of dropdown container when it has to come below/above the select element when it doesn't exceed window.innerWidth
	*/
	setLeftNotExceedForDown: function( element, bcr, xscroll ) {
		var scrolledLeft = xscroll,
		elementBCR = bcr,
		elementLeft = elementBCR.left,
		total = scrolledLeft + elementLeft;

		return total
	},
	/*
		Calculate top of dropdown container when it has to come above the select element
	*/
	setTopAboveForDown: function( element, container, bcr, containerbcr, yscroll ) {
		var scrolledHeight = yscroll,
		elementBCR = bcr,
		elementTop = elementBCR.top,
		containerBCR = containerbcr,
		containerHeight = containerBCR.height,
		total = scrolledHeight + elementTop  - containerHeight;

		return total
	},
	/*
		Calculate top of dropdown container when it has to come below the select element
	*/
	setTopBelowForDown: function( element, bcr, yscroll ) {
		var scrolledHeight = yscroll,
		elementBCR = bcr,
		elementTop = elementBCR.top,
		elementHeight = elementBCR.height,
		total = scrolledHeight + elementTop + elementHeight;

		return total
	},
	/*
		Calculate left of dropdown container when it has to come to right of the select element
	*/
	setLeftForRight:function( element, bcr, xscroll ) {
		var scrolledWidth = xscroll,
		elementBCR = bcr,
		elementLeft = elementBCR.left,
		elementWidth = elementBCR.width,
		total = scrolledWidth + elementLeft + elementWidth;

		return total
	},
	/*
		Calculate right of dropdown container when it has to come to left of the select element of right dropdown
	*/
	setRightForRight: function( element, container, bcr, elembcr, xscroll ) {
		var scrolledWidth = xscroll,
		elementBCR = bcr,
		containerBCR = elembcr,
		elementLeft = elementBCR.left,
		containerWidth = containerBCR.width,
		total = scrolledWidth + elementLeft - containerWidth;

		return total
	},
	/*
		Calculate top of dropdown container when it has to come to right of dropdown and there is space below
	*/
	setTopForRight:function( element, bcr, yscroll ) {
		var scrolledHeight = yscroll,
		elementBCR = bcr,
		elementTop = elementBCR.top,
		total = scrolledHeight + elementTop;

		return total
	},
	/*
		Calculate top of dropdown container when it has to come to right of dropdown and there is no space below
	*/
	setTopForRightAbove:function( element, container, bcr, elembcr, yscroll ) {
		var scrolledHeight = yscroll,
		elementBCR = bcr,
		elementTop = elementBCR.top,
		elementHeight = elementBCR.height,
		containerBCR = elembcr,
		containerHeight = containerBCR.height,
		total = scrolledHeight + elementTop + elementHeight - containerHeight;

		return total
	},
	/**
		Remove wrong arrow and append proper arrow
		@param string correct - the correct class
	*/
	setCorrectClass: function( cls ) {
		var arrow = this.childComp.querySelector( '.lyteArrow' ),
		list = arrow.classList, i = 0;
		for( ; i < list.length; i++ ) {
			if( list[ i ] == 'lyteArrow' || list[ i ] == cls ) {
				continue;
			}
			else { 
				arrow.classList.remove( list[ i ] );
				i--;
			}
		}

		arrow.classList.add( cls );
		arrow.classList.add( 'lyteArrowIcon' );
	},

	/**
	 * This going to check if a class has been toggled
	 * @param {MutationRecord} rec - The mutation record
	 * @param {String} cls - The class that needs to be checked
	 *
	 */
	hasClassToggled: function( rec, cls ) {
		var old = rec.oldValue ? rec.oldValue.split( " " ) : [],
		node = rec.target,
		olen = old.length,
		nlen = node.classList.length;

		if( ( ( !!~old.indexOf( cls )
			&& !node.classList.contains( cls ) )
			|| ( !~old.indexOf( cls )
				&& node.classList.contains( cls ) 
			) )

			// Only 1 class changed
			&& Math.abs( olen - nlen ) === 1
		) {
			return true;
		}

		return false;
	},

	/**
	 * The adjust width is going to adjust the width of the dropdown's body that is going to open
	 * @param {Element} body - The lyte-drop-box
	 * @param {Number} pwidth - The width of the parent Element
	 * @param {Number} bwidth - The width of the body Element
	 *
	 */

	adjustWidth: function( body, pwidth, bwidth ) {
			
		this.setData( 'widthAdjusted', 1 );

		if( bwidth < pwidth ) {
			body.style.width = pwidth + 'px';
			return parseFloat( pwidth );
		}
		// Shouldn't be there for the equal case
		else if( bwidth > pwidth ) {
			this.setData( 'widthAdjusted', 2 )
		}

		return bwidth;
		
	},


	/**
	 * Set the CSS for your dropdown
	 * refer commit ID 583ee6ccbeaa6b3729178bf9df0139032b016d19 and previous for the previous stable setCSS function.
	 * commit ID 583ee6ccbeaa6b3729178bf9df0139032b016d19 also gives a better understanding about the hard coded values in this function.
	 */ 
	setCss: function( onlyScroll ) {
		var link = this.childComp;

		if( !link 
			|| link.classList.contains( 'lyteDropdownHidden' )
		) {
			return;
		}

		// Get properties
		var callout = this.getData( 'ltPropCallout' );


		// Get button
		var body = link,
		custom = this.$node.element,
		par = custom ? custom : this.$node.querySelector( 'lyte-drop-button' );

		// if( !onlyScroll ) {
		// 	// Empty function which might be added in the future
		// 	this.setProperWidth( parNode, bcr, width );
		// }

		// Get Geometric propotions
		var wwidth = window.innerWidth, 
		wheight = window.innerHeight,
		drop = body.getBoundingClientRect(), 
		x = window.pageXOffset || document.documentElement.scrollLeft,
		y = window.pageYOffset || document.documentElement.scrollTop,
		height = body.offsetHeight,
		width = body.offsetWidth, 
		arrow = link.querySelector( '.lyteArrow' ),
		position = this.getData( 'ltPropPosition' ),
		offsets = par.getBoundingClientRect();

		if( this.data.ltPropAnimate ) {
			var drophead = body.querySelector( 'lyte-drop-header' ), dropfoot = body.querySelector( 'lyte-drop-footer' );
			this._header = drophead ? drophead.offsetHeight : 0; this._footer = dropfoot ? dropfoot.offsetHeight : 0;
			this._hgt = drop.height;
			body.querySelector( 'lyte-drop-body' ).style.height = ( this._hgt - this._header - this._footer ) + 'px';
		}

		// Adjusting width of the body is a one time thing. Atleast that is what we think.
		// Till the smoke clears around this issue we are going to hang on to onlyScroll
		// onlyScroll will probably be deprecated
		if( !onlyScroll && !this.getData( 'widthAdjusted' ) ) {
			width = this.adjustWidth( body, offsets.width, width );
		}

		// Intialize flags
		var downPos, 
		rightPos, 
		topPos, 
		leftPos; 

		// temp stores
		var tempStore,
		tempTop, 
		tempLeft, 
		tempMarginLeft, 
		tempMarginTop,
		tempNum, 
		tempDenom, 
		tempPer, 
		aHeight, 
		aWidth;

		if( position === 'down' ) {
			downPos = true;
			tempTop = offsets.top + offsets.height; 
			if( tempTop + height > wheight 
				&& offsets.top > height 
			) {
				downPos = false;		
			}
			else {
				downPos = true;
			}

			rightPos = true;
			tempLeft = offsets.left;
			if( tempLeft + width > wwidth 
				&& tempLeft > tempLeft + offsets.width - width
			) {
				rightPos = false;
				
			}
			else if( offsets.left + width <= wwidth ) {
				rightPos = true;
			}

			if( offsets.width > width ) {      //Think this is for multiselect(CODE HELP)
				arrow.style.left = ( ( width / 2 - 0 ) / width ) * 100 + "%"; // Had arrow.offsetWidth/2 instead of 0
			}

			if( downPos ) {
				if( callout ) {
					this.setCorrectClass( 'lyteArrowTop' );

					// layout thrashing happens here
					// Removing layout thrashing causes a jitter
					aHeight = window.getComputedStyle( arrow, ':before' ).borderWidth;
					tempStore = this.setTopBelowForDown( par, offsets, y ) + parseFloat( aHeight ? aHeight : '0px' ) + 'px';
				}
				else { 
					body.style.top = this.setTopBelowForDown( par, offsets, y ) + 'px';
				}

				
				
			}
			else {
				
				if( callout ) {
					this.setCorrectClass( 'lyteArrowBottom' );

					// layout thrashing happens here
					// Removing layout thrashing causes a jitter
					aHeight = window.getComputedStyle( arrow, ':before' ).borderWidth;
					tempStore = this.setTopAboveForDown( par, body, offsets, drop, y ) - parseFloat( aHeight ? aHeight : '0px' ) + 'px';					
				}
				else {
					body.style.top = this.setTopAboveForDown( par, body, offsets, drop, y ) + 'px';
				}

				
			}

			if( rightPos ) {
				if( callout ) {
					aWidth = window.getComputedStyle( arrow, ':before' ).borderWidth;
					aWidth = parseFloat( aWidth ? aWidth : '0px' );
					tempMarginLeft = window.getComputedStyle( arrow, ':before' ).marginLeft;
					tempMarginLeft = Math.abs( parseFloat( tempMarginLeft ? tempMarginLeft : '0px' ) );
					tempNum = offsets.width / 2 - aWidth + tempMarginLeft; // We removed arrow.offsetWidth because it was giving width as 0 px
					tempDenom = width / 100;
					tempPer = tempNum / tempDenom;
					arrow.style.left = tempPer + '%'; 	
				}

				body.style.top = tempStore ? tempStore : body.style.top;
				body.style.left = this.setLeftNotExceedForDown( par, offsets, x ) + 'px';	
			}
			else {
				if( callout ) {
					aWidth = window.getComputedStyle( arrow, ':before' ).borderWidth;
					aWidth = parseFloat( aWidth ? aWidth : '0px' );
					tempMarginLeft = window.getComputedStyle( arrow, ':before' ).marginLeft;
					tempMarginLeft = Math.abs( parseFloat( tempMarginLeft ? tempMarginLeft : '0px' ) );	
					tempDenom = width / 100;
					tempNum = width - ( offsets.width / 2 ) - aWidth + tempMarginLeft; // We removed arrow.offsetWidth because it was giving width as 0 px
					tempPer = tempNum / tempDenom;
					arrow.style.left = tempPer + '%'; 
				}

				body.style.top = tempStore ? tempStore : body.style.top;
				body.style.left = this.setLeftExceedForDown( par, body, offsets, drop, x ) + 'px'
			}

			if( downPos ) {
				this.setData( 'pos', 'down' );
			}
			else {
				this.setData( 'pos', 'up' );
			}

			
		}
		else if( position === 'right' ) {
			rightPos = true;
			if( offsets.left + offsets.width + width > wwidth
				&& offsets.left - drop.width > 0 
			) {   
				rightPos = false;
				
			}
			else{
				rightPos = true;
			}

			downPos = true;
			if( offsets.top + drop.height > wheight ) {
				downPos = false
			}
			else {
				downPos = true
			}

			if( rightPos ) {
				
				if( callout ) {
					this.setCorrectClass( 'lyteArrowLeft' );

					// layout thrashing happens here
					// Removing layout thrashing causes a jitter
					aWidth = window.getComputedStyle( arrow, ':before' ).borderWidth;
					aWidth = parseFloat( aWidth ? aWidth : '0px' );
					tempStore = this.setLeftForRight( par, offsets, x ) + aWidth + 'px';
				}
				else {
					body.style.left= this.setLeftForRight( par, offsets, x ) + 'px'
				}
			}
			else {
				
				if( callout ) {
					this.setCorrectClass( 'lyteArrowRight' );

					// layout thrashing happens here
					// Removing layout thrashing causes a jitter
					aWidth = window.getComputedStyle( arrow, ':before' ).borderWidth;
					aWidth = parseFloat( aWidth ? aWidth : '0px' );
					tempStore = this.setRightForRight( par, body, offsets, drop, x ) - aWidth + 'px';
				}
				else {
					body.style.left = this.setRightForRight( par, body, offsets, drop, x ) + 'px';
				}
			}

			if( downPos ) {
				if( callout ) {
					aHeight = window.getComputedStyle( arrow, ':before' ).borderWidth;
					aHeight = parseFloat( aHeight ? aHeight : '0px' );
					tempMarginTop = window.getComputedStyle( arrow, ':before' ).marginTop;
					tempMarginTop = Math.abs( parseFloat( tempMarginTop ? tempMarginTop : '0px' ) );
					tempNum = ( ( offsets.height / 2 ) - aHeight  + tempMarginTop ) * 100; // Had arrow.getBoundingClientRect()/2 removed cos its value is 0
					tempDenom = drop.height;
					tempPer = tempNum / tempDenom;
					arrow.style.top = tempPer + '%';
				}

				body.style.left = tempStore ? tempStore : body.style.left;
				body.style.top = this.setTopForRight( par, offsets, y ) + 'px' 
			}
			else {
				if( callout ) {
					aHeight = window.getComputedStyle( arrow, ':before' ).borderWidth;
					aHeight = parseFloat( aHeight ? aHeight : '0px' );
					tempMarginTop = window.getComputedStyle( arrow, ':before' ).marginTop;
					tempMarginTop = Math.abs( parseFloat( tempMarginTop ? tempMarginTop : '0px' ) ); 
					tempNum = ( drop.height - offsets.height / 2 - aHeight + tempMarginTop ) * 100; // Had arrow.getBoundingClientRect()/2 
					tempDenom = drop.height
					tempPer = tempNum / tempDenom;
					arrow.style.top = tempPer + '%';
				}

				body.style.left = tempStore ? tempStore : body.style.left;
				body.style.top = this.setTopForRightAbove( par, body, offsets, drop, y ) + 'px'
			}

			if( rightPos ) {
				this.setData( 'pos', 'right' );
			}
			else {
				this.setData( 'pos', 'left' );
			}
		}
		else if( position === 'up' ) {
			topPos = true
			if( offsets.top - drop.height < 0 
				&& offsets.top + offsets.height + height < wheight 
			) {
				topPos = false
			}
			else {
				topPos = true
			}

			rightPos = true
			if( offsets.left + width > wwidth 
				&& offsets.left > offsets.left + offsets.width - width
			) {
				rightPos = false
			}
			else if( offsets.left + width <= wwidth ) {
				rightPos = true
			}

			if( offsets.width > width ) {      //Think this is for multiselect(CODE HELP)
				arrow.style.left = ( ( width / 2 - 0 ) / width ) * 100 +'%'; // Had arrow.offsetWidth/2 removed cos its value is 0
			}

			if( topPos ) {
				
				if( callout ) {
					this.setCorrectClass( 'lyteArrowBottom' );

					// layout thrashing happens here
					// Removing layout thrashing causes a jitter
					aHeight = window.getComputedStyle( arrow, ':before' ).borderWidth;
					aHeight = parseFloat( aHeight ? aHeight : '0px' );
					tempStore = this.setTopAboveForDown( par, body, offsets, drop, y ) - aHeight + 'px';	
				}
				else {
					body.style.top = this.setTopAboveForDown( par, body, offsets, drop, y ) + 'px';
				}
			}
			else {
				
				if( callout ) {
					this.setCorrectClass( 'lyteArrowTop' );

					// layout thrashing happens here
					// Removing layout thrashing causes a jitter
					aHeight = window.getComputedStyle( arrow, ':before' ).borderWidth;
					aHeight = parseFloat( aHeight ? aHeight : '0px' );
					tempStore = this.setTopBelowForDown( par, offsets, y ) + aHeight + 'px';
				}
				else {
					body.style.top = this.setTopBelowForDown( par, offsets, y ) + 'px'
				}
			}
			if( rightPos ) {
				if( callout ) {
					aWidth = window.getComputedStyle( arrow, ':before' ).borderWidth;
					aWidth = parseFloat( aWidth ? aWidth : '0px' );
					tempMarginLeft = window.getComputedStyle( arrow, ':before' ).marginLeft;
					tempMarginLeft = Math.abs( parseFloat( tempMarginLeft ? tempMarginLeft : '0px' ) );
					tempNum = offsets.width / 2 + tempMarginLeft - aWidth; // We removed arrow.offsetWidth because it was giving width as 0 px
					tempDenom = width / 100;
					tempPer = tempNum / tempDenom;
					arrow.style.left = tempPer + '%' 
				}

				body.style.top = tempStore ? tempStore : body.style.top;
				body.style.left = this.setLeftNotExceedForDown( par, offsets, x ) + 'px';
			}
			else {
				if( callout ) {
					aWidth = window.getComputedStyle( arrow, ':before' ).borderWidth;
					aWidth = parseFloat( aWidth ? aWidth : '0px' );
					tempMarginLeft = window.getComputedStyle( arrow, ':before' ).marginLeft;
					tempMarginLeft = Math.abs( parseFloat( tempMarginLeft ? tempMarginLeft : '0px' ) );
					tempDenom = width / 100;
					tempNum = width - ( offsets.width / 2 ) + tempMarginLeft - aWidth; // We removed arrow.offsetWidth because it was giving width as 0 px
					tempPer = tempNum / tempDenom; 
					arrow.style.left = tempPer +'%'; 
				}

				body.style.top = tempStore ? tempStore : body.style.top;
				body.style.left = this.setLeftExceedForDown( par, body, offsets, drop, x ) + 'px';
			}

			if( topPos ) {
				this.setData( 'pos', 'up' );
			}
			else {
				this.setData( 'pos', 'down' );
			}
		}
		else if( position === 'left' ) {
			leftPos = true;
			if( offsets.left - drop.width < 0 
				&& offsets.left + drop.width < wwidth 
			) {
				leftPos = false;
			}
			else {
				leftPos = true;
			}

			downPos = true;
			if( offsets.top + drop.height > wheight ) {
				downPos = false;
			}
			else {
				downPos = true;
			}

			if( leftPos ) {
				
				if( callout ) {
					this.setCorrectClass( 'lyteArrowRight' );

					// layout thrashing happens here
					// Removing layout thrashing causes a jitter
					aWidth = window.getComputedStyle( arrow, ':before' ).borderWidth;
					aWidth = parseFloat( aWidth ? aWidth : '0px' );
					tempStore = this.setRightForRight( par, body, offsets, drop, x ) - aWidth + 'px';
				}
				else {
					body.style.left = this.setRightForRight( par, body, offsets, drop, x ) + 'px';
				}	
			}
			else {
				
				if( callout ) {
					this.setCorrectClass( 'lyteArrowLeft' );

					// layout thrashing happens here
					// Removing layout thrashing causes a jitter
					aWidth = window.getComputedStyle( arrow, ':before' ).borderWidth;
					aWidth = parseFloat( aWidth ? aWidth : '0px' );
					tempStore = this.setLeftForRight( par, offsets, x ) + aWidth + 'px';
				}
				else {
					body.style.left = this.setLeftForRight( par, offsets, x ) + 'px';
				}
			}
			if( downPos ) {
				if( callout ) {
					aHeight = window.getComputedStyle( arrow, ':before' ).borderWidth;
					aHeight = parseFloat( aHeight ? aHeight : '0px' );
					tempMarginTop = window.getComputedStyle( arrow, ':before' ).marginTop;
					tempMarginTop = Math.abs( parseFloat( tempMarginTop ? tempMarginTop : '0px' ) );
					tempNum = ( ( offsets.height / 2 ) - aHeight + tempMarginTop ) * 100; // Had arrow.getBoundingClientRect()/2 
					tempDenom = drop.height;
					tempPer = tempNum / tempDenom;
					arrow.style.top = tempPer + '%';
				}

				body.style.left = tempStore ? tempStore : body.style.left;
				body.style.top = this.setTopForRight( par, offsets, y ) + 'px';
			}
			else{
				if( callout ) {
					aHeight = window.getComputedStyle( arrow, ':before' ).borderWidth;
					aHeight = parseFloat( aHeight ? aHeight : '0px' );
					tempMarginTop = window.getComputedStyle( arrow, ':before' ).marginTop;
					tempMarginTop = Math.abs( parseFloat( tempMarginTop ? tempMarginTop : '0px' ) );
					tempNum = ( drop.height - offsets.height / 2 - aHeight + tempMarginTop ) * 100; // Had arrow.getBoundingClientRect()/2 
					tempDenom = drop.height;
					tempPer = tempNum / tempDenom;
					arrow.style.top = tempPer + '%'; 
				}

				body.style.left = tempStore ? tempStore : body.style.left;
				body.style.top = this.setTopForRightAbove( par, body, offsets, drop, y ) + 'px';
			}

			if( leftPos ) {
				this.setData( 'pos', 'left' );
			}
			else {
				this.setData( 'pos', 'right' );
			}
		}			
	},

	setAlignment: function() {
		$L.fastdom.measure( function() {
			var link = this.childComp;

			if( !link ) {
				return ;
			}

			var par = this.$node.querySelector( 'lyte-drop-button' ),
			offsets = par.getBoundingClientRect(),
			height = link.offsetHeight,
			top= link.getBoundingClientRect().top,
			arrowval = 0,
			callout = this.getData( 'ltPropCallout' );

			if( callout ) {
				// what?
				arrowval = 9;
			}
	
			if( top < offsets.top ) {
				link.style.top = offsets.top - height - arrowval + 'px';
			}

		}, this );
		
	},

	setFreezeLayer: function() {
		var node = document.getElementById( 'lytedropdownfreezelayer' ), body;
		node.style.display = 'block';
		node.style.height = window.innerHeight + 'px';
		node.style.width = window.innerWidth + 'px';
		node.style.top = '0px';
		node.style.left = '0px';
		node.style.position = 'fixed';
		node.classList.add( 'lyteDropdownZIndex' );
		node.style.overflow = 'hidden';
		body = document.body;
		body.style.overflow = 'hidden';
	},

	scrollIntoView: function( element, move ) {
		var parent = this.childComp.querySelector( 'lyte-drop-body' ),
		offsetTop = element.offsetTop,
		scrollT = parent.scrollTop,
		height = parent.getBoundingClientRect().height,
		elementHeight = element.getBoundingClientRect().height;

		if( move === 'down' 
			&& scrollT + height < offsetTop + elementHeight 
		) {
			parent.scrollTop = parent.scrollTop + offsetTop + elementHeight - ( height + scrollT );
		}
		else if( move === 'up' 
				&& offsetTop < scrollT 
			) {
			parent.scrollTop = offsetTop
		}
	},

	open: function() {
		var that = this, link,
		type = this.getData( 'ltPropType' ),
		head = this.getData( 'drophead' ),
		mul = this.getData( 'multiple' ),
		freeze = this.getData( 'ltPropFreeze' ),
		hover = this.getData( 'ltPropHover' );
		
		link = this.childComp = this.$node.querySelector('lyte-drop-box');
		this.hideNodes();
		if( 
			type === 'multisearch' 
			&& head !== 'yield' 
		) {
			$L( '.lyteDropdownTextField' ).search( {
				scope: link,
				search: 'lyte-drop-item',
				onSearch: function( res ) {
					var i = 0, div, lk = that.childComp;
					for( ; i < res.length; i++ ) {
						if( !res[ i ].classList.contains( 'lyteDropdownActive' ) ) {
							div = lk.querySelector( '.lyteDropdownNoResult' );
							if( div ) {
								div.style.display = 'none';
							}

							return ;
						}
					}

					if( lk.querySelector( '.lyteDropdownNoResult' ).style.display !== 'none' ) {
						return ;
					}

					lk.querySelector( '.lyteDropdownNoResult' ).style.display = 'block';
				}
			} );
		}

		LyteComponent.appendChild( document.body, link );
		link.origindd = this.$node;
		link.classList.remove( 'lyteDropdownHidden' );
		if( freeze && !mul && !hover ) {
			this.setFreezeLayer()
		}

	},

	hideNodes: function() {
		var link = this.childComp, selected, i = 0, item,
		mul = this.getData( 'multiple' ),
		sel = this.getData( 'ltPropSelected' );

		// Hide the filtered items in the dropdown list
		if( mul && sel.length > 2 ) {                    
			if( !link ) {
				return ;
			}

			try {
				selected = JSON.parse( this.getData( 'ltPropSelected' ) );
			}
			catch( err ) {
				console.error( 'Unable to parse ltPropSelected', err );
				return ;
			}

			// Hide new selected values
			for( ; i < selected.length; i++ ) {
				item = link.querySelector('[data-value="'+ selected[ i ] +'"]');
				if( item ) {
					item.classList.add( 'lyteDropdownActive' );
				}	
			}
		}
	},

	showNodes: function( change ) {
		var i = 0, j, olen, elm, res, 
		link = this.childComp,
		mul = this.getData( 'multiple' ),
		type = this.getData('ltPropType'),
		head = this.getData('drophead'),
		all = this.getData( 'allSelected' ),
		nv = change.newValue, 
		ov = change.oldValue;

		if( !mul ) {
			return ;
		}

		if( link ) {
			res = link.querySelector( '.lyteDropdownNoResult' );
		}

		try {
			// Convert to string for obvious reasons
			nv = JSON.parse( nv ).map( function( val ) {
				return '' + val;
			} );

			// Convert to string for obvious reasons
			ov = JSON.parse( ov ).map( function( val ) {
				return '' + val;
			} );
		}
		catch( err ) {
			console.error( 'Unable to parse ltPropSelected', err );
			return ;
		}

		olen = ov.length;
		for( ; i < olen; i++ ) {
			if( nv.indexOf( ov[ i ] ) === -1 ) {
				if( link ) {
					elm = link.querySelector( '[data-value="' + ov[ i ] + '"' );

					// show items in dropbox
					if( elm ) {
						elm.classList.remove( 'lyteDropdownActive' );
					}
				}
				

				// remove items from head
				if( head === 'noyield' ) {
					for( j = 0; j < all.length; j++ ) {
						if( all[ j ].value === ov[ i ] ) {
							Lyte.arrayUtils( all, 'removeAt', j, 1 );
							break;
						}
					}
				}

				if( res
					&& type !== 'multisearch'  
					&& head !== 'yield' 
				) {
					res.style.display = 'none';
				}
			}
		}
	},

	selObs: function( change ) {
		if( this.getData( 'prev' ) ) {
			return ;
		}

		this.hideNodes();
		this.showNodes( change );
	}.observes( 'ltPropSelected' ),

	first: function() {
		this.setData( 'ltPropShow', true );
		this.open();
	},

	subsequent: function( link, freeze, mul, hover ) {
		link.classList.remove( 'lyteDropdownHidden' );
		if( freeze && !mul && !hover ) {
			this.setFreezeLayer()
		}
	},

	beforeShow: function( event, fromTg, first ) {
		var res, that = this, link = this.childComp,
		freeze = this.getData( 'ltPropFreeze' ),
		mul = this.getData( 'multiple' ),
		hover = this.getData( 'ltPropHover' );

		res = this.executeMethod( 'onBeforeShow', event, this );
		if( res && res.then ) {
			Promise.resolve( res ).then( function( arg ) {
				that.setData( 'call', fromTg ? true : event );
				if( first ) {
					that.first();
				}
				else {
					that.subsequent( link, freeze, mul, hover );
				}
			}, function() {
					
			} );
		}
		else if( res !== false ) {
			that.setData( 'call', fromTg ? true : event );
			if( first ) {
				that.first();
			}
			else {
				that.subsequent( link, freeze, mul, hover );
			}
		}
	},

	/**
	 * Show the error div when one of the elements get removed
	 * @param link - the drop box
	 * @param head -  the dropdown's head
	 *
	 */

	closeError: function( link, head ) {
		var result = link && link.querySelector( '.lyteDropdownNoResult' );

		if( 
			link 
			&& result 
			&& head !== 'yield' 
		) {
			result.style.display='none'
		}
	},

	/**
	 * Remove selected values from an array of nodes
	 * @param sel - selected values
	 * @param nodes - nodes that are selected to be removed
	 * @param head - whether the content was yielded or not
	 *
	 */
	removeSelected: function( sel, nodes, head, link ) {
		var len = nodes.length, 
		i, j, all = this.getData( 'allSelected' ),
		body, node, removed = [], ind;

		try {
			sel = JSON.parse( sel );
		}
		catch( er ) {
			console.error( 'Unable to parse ltPropSelected', er );
		}

		// Unfortunately sortable and change the order of selected values 
		for( i = 0; i < len; i++ ) {
			ind = sel.indexOf( nodes[ i ].getAttribute( 'data-value' ) );
			removed = removed.concat( sel.splice( ind, 1 ) );
		}

		if( head == 'noyield' ) {
			for( i = 0; i < len; i++ ) {
				for( j = 0; j < all.length; j++ ) {
					if( all[ j ].value == nodes[ i ].getAttribute( 'data-value' ) ) {
						Lyte.arrayUtils( all, 'removeAt', j );
						break;
					}
				}
			}
		}

		// lyte-drop-body causes problem
		body = link ? link : this.$node.querySelector( 'lyte-drop-body' );

		for( i = 0; i < nodes.length; i++ ) {
			node = body.querySelector( '[data-value="'+ nodes[ i ].getAttribute( 'data-value' ) +'"]' );
			if( node ) {
				node.classList.remove( 'lyteDropdownActive' );
				node.classList.remove( 'lyteSearchHidden' );
				node.removeAttribute( 'selected' );
			}
		}

		this.setAlignment();
		this.setData( 'prev', true );
		this.setData( 'ltPropSelected', JSON.stringify( sel ) );
		this.setData( 'prev', false );

		return removed;

	},

	removeAll: function( event ) {
		var drop = this.$node,
		link = this.childComp,
		head = this.getData( 'drophead' ),
		button = drop.querySelector( 'lyte-drop-button' ),
		nodes = button.querySelectorAll( '.lyteDropMark' ),
		sel = this.getData( 'ltPropSelected' ),
		proper, removed;

		this.closeError( link, head );
		removed = this.removeSelected( sel, nodes, head, link );

		proper = this.getData( 'isKeyDown' ) ? 'keydown' : 'click';
		if( this.getMethods( 'onRemove' ) ) {
			this.executeMethod( 'onRemove', event, removed, this.getData( 'ltPropSelected' ), this, proper, nodes );
		}

		event.stopPropagation();
	},

	/**
	 * Returns true when current clicked node and previous selected node( only 1 ) are same or one of the previous selected nodes is behind. Else returns false
	 * 
	 * @param cur - currently selected node
	 */

	relativePosition: function( cur, prev ) {
		var iterator = cur;

		// When the current selected element and the previous selected element is the same
		if( prev.length === 1 && prev[ 0 ] === cur ) {
			return true;
		}

		// Loop through previous elements to check if it is present
		while( ( iterator = iterator.previousElementSibling ) ) {
			if( iterator.getAttribute( 'lyte-last' ) ) {
				return true;
			}
		}

		return false;
	},

	shade: function( node ) {
		var front, iterator, 
		// There can be dropdowns within dropdown - this guarantees the first button is selected
		present = this.$node
							.querySelector( 'lyte-drop-button' )
							.querySelectorAll( '.lyteDropMark' );

		// Don't process when a there are more than 1 selected items and the user clicks on one of the selected items
		if( present.length > 1 && node.classList.contains( 'lyteDropMark' ) ) {
			return ;
		}

		iterator = ( present.length === 0 || this.relativePosition( node, present ) ) ? 'previousElementSibling' : 
																			'nextElementSibling';

		do {
			node.classList.add( 'lyteDropMark' );
		} while( ( node = node[ iterator ] ) 
				&& !node.getAttribute( 'lyte-last' ) );
	},

	mark: function( node, shift, single ) {

		

		// When shift is pressed
		if( shift ) {
			_lyteDropdown.unmark( this );
			this.shade( node );
		}
		// When command or control is pressed
		else if( single ) {
			_lyteDropdown.unmark( this );
			node.classList.add( 'lyteDropMark' );
		}
		// When none of the modifier keys are pressed
		else {
			_lyteDropdown.unmark();
			node.classList.add( 'lyteDropMark' );
		}

		this.setLast( node );	
	},

	/** 
	 * Sets the current node as the last selected node 
	 * so that subsequent selections can proceed from this node ( Also removes the previous last)
	 * 
	 * @param node - the node which is going to be the last node that is getting set
	 */
	setLast: function( node ) {
		var prev = document.querySelector( '[lyte-last="true"]' );

		if( prev ) {
			prev.removeAttribute( 'lyte-last' );
		}

		node.setAttribute( 'lyte-last', true );
	},

	/**
	 * Function to set the first value as lt-prop-selected
	 *
	 */

	setInitialSelected: function() {
		var options = this.getData( 'ltPropOptions' ),
		firstElement = options[ 0 ],
		flag = false,
		value;

		if( firstElement.constructor == Object ) {
           	if( Object.keys( firstElement ).length == 1 ) {
	            value = firstElement[ Object.keys( firstElement )[ 0 ] ];
	            if( value.constructor == Array ) {
	                flag = true
	            }
	        }   
        }

        if( flag ) {
           	if ( Object.prototype.toString.call( value[ 0 ] ) === '[object Object]' ) {
           		this.setData( 'ltPropSelected', value[ 0 ][ this.getData( 'ltPropSystemValue' ) ] );
           	}
           	else{
           		this.setData( 'ltPropSelected', value[ 0 ] );
           	}
        }
        else{
           	if ( Object.prototype.toString.call( firstElement ) === '[object Object]' ) {
           		this.setData( 'ltPropSelected', firstElement[ this.getData( 'ltPropSystemValue' ) ] );
           	}
           	else {
           		this.setData( 'ltPropSelected', firstElement );
           	}
        }
	},

	/**
	 * Function to set an initial value to the dropdown when lt-prop-options is pushed later
	 * into the dropdown. When lt-prop-options is empty and new items are pushed in 
	 * @param change - Old value and new values
	 *
	 */
	contentChange: function( change ) {
		var oldValue = change.oldValue,
		newValue = change.newValue,
		sel = this.getData( 'ltPropSelected' ),
		ph = this.getData( 'ltPropPlaceholder' ),
		disp = this.getData( 'ltPropDisplayValue' ),
		body = this.getData( 'dropbody' ) === 'yield',

		// Old value of lt-prop-options should be empty and the new value should be filled
		initial = ( 
					( oldValue && oldValue.length === 0 ) 
					|| !oldValue 
				) && newValue && newValue.length > 0;

		if( initial && !sel && !ph && !disp && !body ) {
			this.setInitialSelected();	
		}
	}.observes( 'ltPropOptions' ),

	selChange: function() {
		var mul = this.getData( 'multiple' ),
		head = this.getData( 'drophead' ), 
		link = this.childComp,
		sel = this.getData( 'ltPropSelected' ),
		sels, parent = link ? link : this.$node.querySelector( 'lyte-drop-box' ), 
		node, selected, display, obj, flag, i = 0, j = 0, elm, prev;

		if( 
			mul 
			&& head !== 'yield' 
		) {
			if( !sel ) {
				return ;
			}

			try {
				selected = JSON.parse( sel );
			}
			catch( err ) {
				console.error( 'Could not parse ltPropSelected', err );
				return ;
			}

			display = this.getData( 'allSelected' );
			for( ; i < selected.length; i++ ) {
				flag = true;
				for( j = 0; j < display.length; j++ ) {
					if( selected[ i ] == display[ j ].value ) {
						flag = false;
						break;
					}
				}

				if( flag ) {
					obj = {};
					obj.value = selected[ i ];
					elm = parent.querySelector( '[data-value="' + selected[ i ] + '"]' );
					if( elm ) {
						obj.display = elm.textContent;
					}
					
					if( !obj.display ) {
						continue;
					}

					Lyte.arrayUtils( this.getData( 'allSelected' ), 'push', obj ); 
				}
			}	
		}
		else if( !mul ) {
			node = parent.querySelector( '[data-value="' + sel + '"]' );

			// Don't remove previous selected=true attribute when it is a multiselect should only remove it when the element is removed from the selected list.
			sels = parent.querySelectorAll( '[selected]' );

			for( ; i < sels.length; i++ ) {
				if( sels[ i ].getAttribute( 'data-value' ) != sel ) {
					sels[ i ].removeAttribute( 'selected' );
				}
			}

			if( head !== 'yield' ) {
				if( node ) {
					var innerText = node.textContent;
					this.setData( 'ltPropDisplayValue', innerText );
				}
			}	
		}

		// To set selected to true to the ltPropSelected node
		if( node ) {
			node.setAttribute( 'selected', 'true' );
			prev = parent.querySelector( '.lyteDropdownSelection' );
			prev ? prev.classList.remove( 'lyteDropdownSelection' ) : undefined;
			node.classList.add( 'lyteDropdownSelection' );
		}
	
	}.observes(
		'ltPropSelected',
		'changeItToInvoke'
	),

	tabIndexChange: function() {
		var disabled = this.getData( 'ltPropDisabled' ),
		tab = this.$node.querySelector( '[tabindex]' ),
		ind = this.getData( 'ltPropTabindex' );

		if( disabled ) {
			tab.classList.add( 'lyteDropdown-disabled' );
			tab.tabIndex = -1;
		}
		else{
			tab.classList.remove( 'lyteDropdown-disabled' );
			this.$node.querySelector( '[tabindex="-1"]' ).tabIndex = ind;
		}
	}.observes( 'ltPropDisabled' ),

	data: function() {
        return {
        	'changeItToInvoke':Lyte.attr("number",{"default":1}),
        	'dummy1':Lyte.attr("boolean",{"default":true}),
        	'dummy2':Lyte.attr("boolean",{"default":false}),

        	// Added to provide backward compatibility to multiselect.
        	// Multiselects usually remove only 1 value at a time but there was a case when you wanted to remove multiple values with
        	// the meta or the command keys
        	// onRemove improperly returned a string when one key was removed and an array when multiple keys were removed
        	// To better reflect the behaviour a new attribute was added.
        	'ltPropRemoveMultiple': Lyte.attr( 'boolean', { 'default': false } ),
        	'ltPropYield':Lyte.attr("boolean",{"default":false}),
        	'ltPropType':Lyte.attr("string",{"default":''}),
        	'ltPropTabindex':Lyte.attr("number",{"default":0}),
        	'ltPropShow':Lyte.attr("boolean",{"default":false}),
        	'ltPropFreeze':Lyte.attr("boolean",{"default": true}),
        	'ltPropOptions':Lyte.attr("array",{"default":[]}),
        	'ltPropUserValue':Lyte.attr("string",{"default":undefined}),
			'ltPropSystemValue':Lyte.attr("string",{"default":undefined}),
			'ltPropPosition':Lyte.attr("string",{"default":'down'}),
			'ltPropIconClass':Lyte.attr("string",{"default":'dropdown'}),
			'ltPropSelected':Lyte.attr("string",{"default":''}),
			'ltPropCallout':Lyte.attr("boolean",{"default": false}),
			'ltPropPlaceholder':Lyte.attr("string",{"default":''}),
			'ltPropDisabled':Lyte.attr("boolean",{"default": false}),
			'ltPropHover':Lyte.attr("boolean",{"default": false}),
			'ltPropNoResult':Lyte.attr("string",{"default":'No Results Found'}),
   			'ltPropInputClass':Lyte.attr("string",{"default":'lyteSearch'}),
   			'allSelected' : Lyte.attr("array", {"default" : []}),
   			'ltPropBoundary':Lyte.attr("object",{"default":{}}),
   			'pos':Lyte.attr("string",{"default":''}),
   			'firePos':Lyte.attr("number",{"default":1}),
   			'ltPropAjaxRequest':Lyte.attr("object",{"default":{}}),
   			'firstRequest':Lyte.attr("boolean",{"default":true}),
   			'ltPropDisplayValue': Lyte.attr("string",{"default":""}),
   			'ltPropDisabledList': Lyte.attr('array',{"default":[]}),
   			 ltPropAnimate : Lyte.attr( 'boolean', { default : false }),
   			'ltPropSetPos': Lyte.attr( 'boolean', { 'default': false })
			// 'ltPropContainerClass':Lyte.attr("string",{"default":''}),
			// 'ltPropSlide':Lyte.attr("boolean",{"default": false}),
		}
	},
	actions:{

		closeIt: function( event ) {
			var mx = event.clientX,my = event.clientY
			var dp = this.$node.querySelector('lyte-drop-button')
			var dpt = dp.getBoundingClientRect().top,dph = dp.getBoundingClientRect().height
			var dpl = dp.getBoundingClientRect().left,dpw = dp.getBoundingClientRect().width
			var dc = this.childComp
			var dct = dc.getBoundingClientRect().top,dch = dc.getBoundingClientRect().height
			var dcl = dc.getBoundingClientRect().left,dcw = dc.getBoundingClientRect().width
			if((mx >= dpl && mx <= dpl + dpw && my >= dpt && my <= dpt + dph)|| (mx >= dcl && mx <= dcl + dcw && my >= dct && my <= dct + dch)){
				return ;
			}
			this.$node.toggle(event,"leave")
		},

		processElements: function( event ) {
			var link = this.childComp,
			elm =  event.target,
			mul = this.getData( 'multiple' ),
			head = this.getData('drophead'),
			freeze = this.getData( 'ltPropFreeze' ),
			type = this.getData('ltPropType'),
			sel, res, elements, i = 0, j, src, visiblenodes, button;

			while( 
				elm.tagName !== 'HTML' 
				&& elm.tagName !== 'LYTE-DROP-ITEM' 
			) {
				elm = elm.parentElement
			}

			if( elm.tagName === 'HTML' ) {               //Clicking on header should not trigger an event(CODE HELP)
				return false;
			}

			if( !mul && head !== 'yield' ) {
				elm.setAttribute( 'selected', 'true' );
				if( this.getMethods( 'onOptionSelected' ) ) {
					this.executeMethod( 'onOptionSelected', event, this.getData( 'ltPropSelected' ), this, elm );
				}

				if( this.getMethods( 'onBeforeHide' ) ) {
					res = this.executeMethod( 'onBeforeHide', event, this );
					res = res == undefined ? true : false;
					if( !res ) {
						return ;
					}
				} 

				this.closeDrop( link, event, freeze);
			}
			else if( mul ) {

				if( head == 'noyield' 
					&& this.getData('search') 
				) {
					$L.fastdom.measure( function() { 
						this.$node.querySelector('input').focus();
					}, this );	
				}

				elements = link.querySelectorAll('lyte-drop-item');
				for( ; i < elements.length; i++ ) {
					if( elements[ i ].classList.contains( 'lyteDropdownSelection' ) ) {
						break;
					}
				}

				if( elements[ i ] ) {
					elements[ i ].classList.remove( 'lyteDropdownSelection' )
					j = i
					i++;
					j--;
					for( ; i < elements.length; i++ ) {
						if( !elements[i].classList.contains( 'lyteDropdownActive' ) ) {
							break
						}
					}

					if( i != elements.length ) {
						elements[ i ].classList.add( 'lyteDropdownSelection' );
					}
					else {
						for( ; j > -1; j-- ) {
							if( !elements[ j ].classList.contains( 'lyteDropdownActive' ) ) {
								break;
							}
						}

						if( j != -1 ) {
							elements[ j ].classList.add( 'lyteDropdownSelection' );
						}
					}
				}

				this.setData( 'prev', true );
				elm.setAttribute( 'selected', 'true' );
				this.setData( 'prev', false );

				src = elm.getAttribute( 'data-value' );

				link.querySelector( '[data-value="' + src + '"]').classList.add( 'lyteDropdownActive' );

				// check this things position in code now.
				if( this.getMethods('onAdd') ) {
					this.executeMethod( 'onAdd', event, src, this.getData('ltPropSelected'), this, elm );
				}

				// All of this should happen only when a non-custom dropdown is given.
				visiblenodes = link.querySelectorAll( 'lyte-drop-item:not(.lyteDropdownActive):not(.lyteSearchHidden)' );
				if( visiblenodes.length === 0 ) {
					if( 
						link.querySelector('.lyteDropdownNoResult') 
						&& type !== 'multisearch' && head !== 'yield' 
					) {
						link.querySelector( '.lyteDropdownNoResult' ).style.display = 'block';
					}

					if( type === 'multisearch' && head !== 'yield' ) {
						link.querySelector( '.lyteDropdownNoResult' ).style.display = 'block';
					}
				}

				this.setAlignment();

				// Might be opened up later
				// button = this.$node.querySelector( 'lyte-drop-button' )
				// this.setProperWidth( this, button, button.getBoundingClientRect(), button.offsetWidth );
			}
			else {	

				// Maybe need to set selected to true	
				// Have to remove and add lyteDropdownSelection over here cause we have a check over in selChange which prevents it from doing it there
				if( link.querySelector( 'lyte-drop-item.lyteDropdownSelection' ) ){
					link.querySelector('lyte-drop-item.lyteDropdownSelection').classList.remove( 'lyteDropdownSelection' );
				}

				elm.classList.add( 'lyteDropdownSelection' );
				this.setData( 'ltPropSelected',elm.getAttribute( 'data-value' ) );
				if( this.getMethods( 'onOptionSelected' ) ) {
					this.executeMethod( 'onOptionSelected', event, this.getData( 'ltPropSelected' ), this, elm );
				}

				if( this.getMethods( 'onBeforeHide' ) ) {
					res = this.executeMethod('onBeforeHide',event,this)
					res = res == undefined?true:false
					if( !res ) {
						return ;
					}
				}

				this.closeDrop( link, event, freeze);
			}
		},
		
		closeFun: function( event ) {
			var link = this.childComp,
			head = this.getData('drophead'), 
			rm = this.getData( 'ltPropRemoveMultiple' ),
			node = event.target, src, sel = this.getData( 'ltPropSelected' ), i = 0,
			res = [], body, end, proper, hide;

			// This is for inbuilt error display
			this.closeError( link, head );

			while( 
				!node.getAttribute( 'data-value' ) 
				&& node
			) {
				node = node.parentElement
			}

			if( !node ) {
				return ;
			}

			src = node.getAttribute( 'data-value' )	
			this.removeSelected( sel, [ node ], head, link );			
			proper = this.getData( 'isKeyDown' ) ? 'keydown' : 'click';
			if( this.getMethods( 'onRemove' ) ) {
				// Return an array of removed values in case of removeMultiple
				// else return a singular value
				this.executeMethod( 'onRemove', event, rm ? [ src ] : src  , this.getData('ltPropSelected'), this, proper, node );
			}

			event.stopPropagation();

		},

		searchAndCheck: function( event ) {
			this.$node.constructor._actions.checkKey.call( this, event );
		},

		searchAndOpen: function( event ) {
			this.$node.constructor._actions.showHide.call( this, event );
		},

		checkKey: function( event ) {
			var type = this.getData('ltPropType');
			if( event.keyCode == 9 ) {
				this.$node.toggle( this, event );
				if( type == 'multisearch' ) {
					this.$node.querySelector( '[type="text"]' ).focus()
				}
			}
		},

		showHide: function( event, eventtype, fromTg ) {
			var link = this.childComp,
			freeze = this.getData( 'ltPropFreeze' ),
			mul = this.getData( 'multiple' ),
			hover = this.getData( 'ltPropHover' ),
			rm = this.getData( 'ltPropRemoveMultiple' ),
			show = this.getData( 'ltPropShow' ), res, cur;

			// Exists to remove multiple selected values from a multiselect using either the meta key or the control key
			if( rm && event && mul ) {
				cur = event.target;
				while( cur && cur.tagName !== 'LYTE-DROPDOWN' && !cur.getAttribute( 'data-value' ) ) {
					cur = cur.parentNode;
				}

				// Node with data-value is clicked so you need to process it
				if( cur && cur.getAttribute( 'data-value' ) ) {
					this.mark( cur, event.shiftKey, event.ctrlKey || event.metaKey );
					return ;
				}
				// The node with data-value is not clicked so this is going to unmark everything
				else {
					_lyteDropdown.unmark();
				}
			}
			// When you click another dropdown whose rm is false
			else {
				_lyteDropdown.unmark();
			}

			// For some unknow reason the dropdown closes when you hover over the select box to prevent this we are doing this and same for the opposite
			if( eventtype == 'enter' ) {
				if( 
					link
					&& !link.classList.contains( 'lyteDropdownHidden' ) 
				) {
					return ;
				}

				this.$node.querySelector('[tabindex]').focus()
			}

			if( eventtype == 'leave' ) {
				if( 
					link 
					&& link.classList.contains( 'lyteDropdownHidden' ) 
				) {
					return ;
				}
			}

			if( !show ) {
				if( this.getMethods( 'onBeforeShow' ) ) {
					if( !link ) {
						this.childComp = this.$node.querySelector( 'lyte-drop-box' );
					}

					this.beforeShow( event, fromTg, true );
				}
				else {
					this.setData( 'call', fromTg ? true : event );
					this.first();
				}	
			}
			else if( link.classList.contains( 'lyteDropdownHidden' ) ) {
				if( this.getMethods( 'onBeforeShow' ) ) {

					this.beforeShow( event, fromTg, false );
					// res = this.executeMethod( 'onBeforeShow', event, this );
					// res = res == undefined ? true : false;
					// if( !res ) {
					// 	return ;
					// }
				}
				else {
					this.setData( 'call', fromTg ? true : event );
					this.subsequent( link, freeze, mul, hover );
				}
			}
			else if( fromTg || !mul ) {
				if( this.getMethods( 'onBeforeHide' ) ) {
					res = this.executeMethod( 'onBeforeHide', event, this );
					res = res == undefined ? true : false;
					if( !res ) {
						return ;
					}
				}

				this.closeDrop( link, event, freeze);
			}
			
		}
	}
});

window.addEventListener('scroll',function(event){	
	var elm = document.querySelector( 'lyte-drop-box:not(.lyteDropdownHidden)' ),
	tempele = elm,
	cur = event.target,
	drop, component, boundary, left, right, top, bottom, offsets, link;
	if( !elm ){
		return ;
	}

	while( elm.tagName != 'LYTE-DROP-BOX' ) {
		elm = elm.parentElement
	}

	if( cur.nodeName == "#document" ){     //This probably happens because scrollIntoView is used to focus the dropdown which is open at the start so the event.target is #document(CODE HELP)
		return ;
	}

	while( cur.tagName !== 'LYTE-DROP-BOX' && cur.tagName !== 'HTML' ) {
		cur = cur.parentElement;
	}

	if( cur.tagName === 'LYTE-DROP-BOX' ) {
		return ;
	}

	drop = elm.origindd
	if( !drop ) {
		return ;
	}

	component = drop.component;
	link = component.childComp;
	boundary = component.getData( 'ltPropBoundary' );
	left = boundary.left ? boundary.left : 0;
	right = boundary.right ? boundary.right : window.innerWidth;
	top = boundary.top ? boundary.top : 0;
	bottom = boundary.bottom ? boundary.bottom : window.innerHeight;
	offsets = drop.getBoundingClientRect();

	if( offsets.top < top || offsets.left < left || offsets.right > right || offsets.bottom > bottom ) {
		if( component.getMethods( 'onBeforeHide' ) ) {
			var result = component.executeMethod('onBeforeHide',event,component)
			result = result == undefined ? true : false;
			if( !result ) {
				return ;
			}
		}

		// elm.classList.add('lyteDropdownHidden')
		// if( component.getData( 'ltPropFreeze' ) ) {
		// 	document.body.style.overflow = openElem.origindd.component.bodyoverflow ? openElem.origindd.component.bodyoverflow : "";
		// }

		component.closeDrop.call( component, link, event, component.getData( 'ltPropFreeze' ));
	}
	
	drop.component.setCss(true)
},true);

document.addEventListener( 'click', function( event ) {
	var ele = event.target, cur, all, i = 0, j = 0,
	open, temp, component, res, freeze, link, drp, item;

	while( 
		ele.tagName !== 'LYTE-DROPDOWN' 
		&& ele.tagName !== 'HTML' 
		&& ele.tagName !== 'LYTE-DROP-BOX' 
		&& ele.tagName !== 'LYTE-DROP-REMOVE'
	) {
		ele = ele.parentElement;
		if( !ele ) {
			return ;
		}
	}

	if(ele.tagName == 'HTML') {
		_lyteDropdown.unmark();
		open = document.querySelectorAll('lyte-drop-box:not(.lyteDropdownHidden)');

		for( ; j < open.length; j++ ) {
			temp = open[ j ];
			if( temp ) {
				component = temp.origindd.component;
				if( component.getMethods( 'onBeforeHide' ) ) {
					res = component.executeMethod( 'onBeforeHide', event, component );
					res = res == undefined ? true : false;
					if( !res ) {
						continue ;
					}
				}

				// document.getElementById( 'lytedropdownfreezelayer' ).style.display = 'none';
				// temp.classList.add('lyteDropdownHidden');
				freeze = document.getElementById( 'lytedropdownfreezelayer' );
				component.closeDrop.call( component, temp, event, freeze);
			}
		}
	}
	else if( ele.tagName === 'LYTE-DROPDOWN' ) {
		cur = ele;
		all = document.querySelectorAll( 'lyte-drop-box:not(.lyteDropdownHidden)' )
		for( ; i < all.length; i++ ) {
			if( all[ i ].origindd == cur ) {
				continue;
			}
			else {
				drp = all[ i ].origindd;
				component = drp.component;
				_lyteDropdown.unmark();
				if( component.getMethods( 'onBeforeHide' ) ) {
					res = component.executeMethod( 'onBeforeHide', event, component );
					res = res == undefined ? true : false;
					if( !res ) {
						continue;
					}
				}

				// all[ i ].classList.add('lyteDropdownHidden');
				// freeze = cur.ltProp('freeze');
				// if( !freeze ) {
				// 	document.getElementById( 'lytedropdownfreezelayer' ).style.display = 'none';
				// }

				// if( component.getData('ltPropFreeze') ) {
				// 	document.body.style.overflow = component.bodyoverflow ? component.bodyoverflow : '';
				// }

				component.closeDrop.call( component, component.childComp, event, component.getData('ltPropFreeze'));
			}
		}
	}
	else if( ele.tagName === 'LYTE-DROP-REMOVE' ) {
		drp = ele;
		while( drp.tagName != 'LYTE-DROPDOWN' ) {
			if( drp.getAttribute( 'data-value' ) ) {
				item = drp;
			}
			drp = drp.parentElement;
		}

		if( item.classList.contains( 'lyteDropMark' ) ) {
			drp.component.removeAll( event );
		}
		else {
			_lyteDropdown.unmark();
			drp.component.actions.closeFun.call( drp.component, event );	
		}
	}
}, true );

document.addEventListener( 'keydown', function( event ) {  //This is to take care of the tabbing problems in a dropdown and traversing(CODE HELP)
	var kc = event.keyCode, 
	active, acomp, abutton, anodes,
	open = document.querySelector( 'lyte-drop-box:not(.lyteDropdownHidden)' ),
	type, res, drp, component, src, last, l = 0, cur, elem, elems, i = 0, j, all, k;

	if(
		( 
			kc == 38 
			|| kc == 40 
			|| kc == 13 
		) 
		&& open 
	) {
		if( kc == 38 
			|| kc == 40 
		) {
			event.preventDefault()
		}

		drp = open.origindd;
		component = drp.component;
		type = component.getData( 'ltPropType' );

		open = open.children;
		for( ; l < open.length; l++ ) {
			if( open[ l ].tagName === 'LYTE-DROP-BODY' ) {
				break;
			}
		}

		open = open[ l ];
		cur = open.querySelector('.lyteDropdownSelection')
		if( 
			!cur 
			|| ( cur 
				&& ( 
					cur.classList.contains('lyteSearchHidden') 
					|| cur.classList.contains('lyteDropdownActive') 
					)
				)
			) {
			elems = open.querySelectorAll('lyte-drop-item:not(.lyteSearchHidden):not(.lyteDropdownActive)') //wrong
			for( ; i < elems.length; i++ ) {
				if( elems[ i ].style.display != 'none' ) {
					elem = elems[ i ];
					break;
				}
			}

			if( cur ) {
				cur.classList.remove( 'lyteDropdownSelection' );
			}

			if( elem ) {
				elem.classList.add( 'lyteDropdownSelection' );
				return ;
			}
		}
			
		kc = event.keyCode;
		elems = open.querySelectorAll( 'lyte-drop-item' );
		for( i = 0; i < elems.length; i++ ) {
			if( elems[ i ].classList.contains( 'lyteDropdownSelection' ) ) {
				break;
			}
		}

		if( kc == 13 ) {
			if( component.getData( 'multiple' ) ) {
				if( !elems[ i ] ){ 
					return ;
				}
				elems[ i ].click();

				// You are just bad
				k = i;
				all = open.querySelectorAll( 'lyte-drop-item' );
				for( ; k < all.length; k++ ) {
					if( 
						!all[ k ].classList.contains( 'lyteSearchHidden' ) 
						&& !all[ k ].classList.contains( 'lyteDropdownActive' ) 
					) {
						break;
					}
				}

				if( k != all.length ) {
					all[ k ].classList.add( 'lyteDropdownSelection' );
				}
				else {
					k = i
					for( ; k > -1; k-- ) {
						if( 
							!all[ k ].classList.contains( 'lyteSearchHidden' ) 
							&& !all[ k ].classList.contains( 'lyteDropdownActive' )
						) {
							break;
						}
					}

					if( k != -1 ) {
						all[ k ].classList.add( 'lyteDropdownSelection' );
					}
				}
			}
			else {
				if( elems[ i ] ) {
					elems[ i ].click();
				}
			}
		}
		else if(
			kc == 38 
			&& i != 0 
		) {
			j = i;
			i = i - 1;
			for( ; i > -1; i-- ) {
				if( 
					!elems[ i ].classList.contains( 'lyteDropdownActive' )
					&& !elems[ i ].classList.contains( 'lyteSearchHidden' )
					&& elems[ i ].style.display !== 'none'
				) {
					break;
				}
			}

			if( i != -1 ) {
				component.scrollIntoView( elems[ i ], 'up' );
				elems[ j ].classList.remove( 'lyteDropdownSelection' );
				elems[ i ].classList.add( 'lyteDropdownSelection' );
			}							
		}
		else if(
			kc == 40
			&& i != elems.length -1
		) {
			j = i;
			i = i + 1;
			for( ; i < elems.length; i++ ) {
				if( 
					!elems[ i ].classList.contains('lyteDropdownActive') 
					&& !elems[ i ].classList.contains('lyteSearchHidden') 
					&& elems[ i ].style.display != 'none' 
				) {
					break;
				}
			}

			if( i < elems.length ) {  // Added this because it was breaking in CRM		
				component.scrollIntoView( elems[ i ],'down' );
				elems[ j ].classList.remove( 'lyteDropdownSelection' );
				elems[ i ].classList.add( 'lyteDropdownSelection' );
			}
		}
		
	}

	if( kc === 8 ) {
		active = _lyteDropdown.getActive();
		if( active ) {
			acomp = active.component;
			abutton = active.querySelector( 'lyte-drop-button' );
			anodes = abutton.querySelector( '.lyteDropMark' );
		}

		drp = open && open.origindd;
		component = drp && drp.component;
		type = component && component.getData( 'ltPropType' );
		
		if( anodes ) {
			acomp.setData( 'isKeyDown', true );
			acomp.removeAll( event );
			acomp.setData( 'isKeyDown', false );
		}
		else if( open && type === 'multisearch' && _lyteDropdown.isInput( event, open ) ) {
			last = drp.querySelectorAll( 'lyte-drop-remove' )
			if( last.length > 0 ) {
				drp.component.setData( 'isKeyDown', true );
				last[ last.length - 1 ].click();
				drp.component.setData( 'isKeyDown', false );
			}
		}
	}


	if( 
		kc != 9 
		&& kc != 27 
	) {
		return ;
	}

	if( open ) {
	 	while( open.tagName != 'LYTE-DROP-BOX' ) {
	 		open = open.parentNode;
	 	}

	 	component = open.origindd.component;
	 	if( component.getMethods( 'onBeforeHide' ) ) {
			res = component.executeMethod( 'onBeforeHide', event, component );
			res = res == undefined ? true : false;
			if( !res ) {
				return ;
			}
		}
		// open.classList.add('lyteDropdownHidden')
	 	component.closeDrop.call( component, component.childComp, event, component.getData('ltPropFreeze'));
	}

});

document.addEventListener( 'keypress', function( event ) { //It searches the dropdown items matching the pressed charactes when the dropdown is open
	var kc = event.which || event.keyCode, i = 0, children, pos,
	open = document.querySelectorAll( 'lyte-drop-box:not(.lyteDropdownHidden)' ), drp;

	if( 
		open.length > 0
		&& ( ( kc >= 65 && kc <= 90 ) 
			|| ( kc >= 97 && kc <= 122 ) )
	) {
		_lyteDropdown.pressedCharacter = _lyteDropdown.pressedCharacter ? _lyteDropdown.pressedCharacter += String.fromCharCode(kc) : String.fromCharCode(kc);
		if( _lyteDropdown.checkDDtimeoutId ) {
			clearTimeout( _lyteDropdown.checkDDtimeoutId );
		}

		_lyteDropdown.checkDDtimeoutId = setTimeout( function() {
			_lyteDropdown.pressedCharacter = null;
		}, 500 );

		drp = document.activeElement.parentElement;
		drp = drp.tagName == "LYTE-DROPDOWN" ? drp : null;
		if( open.length > 0 && drp ) {
			for(var i =0 ; i < open.length ; i++ ) {
				// breaking change
				if( open[ i ].origindd == drp ) {
					break;
				}
			}

			open = open[ i ];
			drp = open.origindd;
			children = open.querySelectorAll('lyte-drop-item');

			if( 
				_lyteDropdown.cachePreviousVal.char 
				&& _lyteDropdown.cachePreviousVal.char == _lyteDropdown.pressedCharacter 
				&& ( _lyteDropdown.cachePreviousVal.pos + 1 ) < children.length 
				&& children[ _lyteDropdown.cachePreviousVal.pos + 1 ].textContent.substring( 0, _lyteDropdown.pressedCharacter.length ).toLowerCase() === _lyteDropdown.pressedCharacter.toLowerCase() 
			) {
				pos = _lyteDropdown.cachePreviousVal.pos + 1;
			}
			else {
				for( i = 0; i < children.length; i++ ) {
					if(children[ i ].textContent.substring( 0, _lyteDropdown.pressedCharacter.length ).toLowerCase() === _lyteDropdown.pressedCharacter.toLowerCase() ) {
						pos = i;
						break;
					}
				}
			}
			
			if( pos != undefined ) {
				var selected = open.querySelectorAll( '.lyteDropdownSelection' );
				for(var j = 0; j< selected.length ; j++){
					selected[ j ].classList.remove( 'lyteDropdownSelection' );
				}
				children[ pos ].classList.add( 'lyteDropdownSelection' );
				var scrollDiv = open.querySelector( 'lyte-drop-body' );
				scrollDiv.scrollTop += parseInt( children[ pos ].getBoundingClientRect().top - scrollDiv.getBoundingClientRect().top );
			}

			_lyteDropdown.cachePreviousVal.char = _lyteDropdown.pressedCharacter;
			_lyteDropdown.cachePreviousVal.pos = pos;
		}

	}

});

window.addEventListener( 'resize', function( event ) {
	delete this._hgt;
	var open = document.querySelector( 'lyte-drop-box:not(.lyteDropdownHidden)' ), freeze,
	wwidth = window.innerWidth, wheight = window.innerHeight;

	if( open ) {
		open.origindd.component.setCss();
	}

	freeze = document.getElementById( 'lytedropdownfreezelayer' );
	if( !freeze ){
		return ;
	}

	freeze.style.width = wwidth + 'px'
	freeze.style.height = wheight + 'px'
});



Lyte.createCustomElement( 'lyte-drop-item', {
	static : {
		"observedAttributes" : {
			get : function() {
				return [ 'selected' ];
			}
		}
	},
	"attributeChangedCallback": function(attr, oldValue, newValue, namespace) {
		var cur = this, drp, component, type, sel, last, res,
		src = this.getAttribute( 'data-value' );
		if( attr == 'selected' ) {
        	if( this.hasAttribute( 'selected' ) ) {
          		while( 
          			cur.tagName != 'LYTE-DROP-BOX' 
          			&& cur.tagName != 'BODY' 
          		) {
            		cur = cur.parentElement;
          		}

          		if ( cur.tagName == 'HTML' ) {
            		return;
          		}

          		drp = cur.origindd;
          		if ( !drp ) {
            		while( 
            			cur.tagName != 'LYTE-DROPDOWN' 
            			&& cur.tagName != 'BODY' 
            		) {
              			cur = cur.parentElement;
            		}

            		drp = cur;
          		}

          		component = drp.component;
          		type = component.getData( 'ltPropType' );

          		if ( type == 'multiple' 
          			|| type == 'multisearch'
          		) {
            		sel = component.getData( 'ltPropSelected' );
            		if ( sel.length == 2 ) {
              			sel = '["' + src + '"]';
              			// not setting prev to true here
              			component.setData( 'ltPropSelected', sel );
            		} 
            		else {
              			last = sel.indexOf( ']' );
              			res = sel.substring( 0, last ) + ',"' + src + '"]';
              			// not setting prev to true here
              			component.setData( 'ltPropSelected', res );
            		}
          		} 
          		else {
            		component.setData('ltPropSelected', src);
          		}
        	}
      	}
	}
});

_lyteDropdown = {
	/** 
	 * Checks if the current target is an input within the dropdown and with no value
	 * @param event - the keydown event
	 *
	 */

	// Initialize variables
	pressedCharacter : null,

	checkDDtimeoutId : null,

	cachePreviousVal : {},

	isInput: function( event ) {
		// There maybe a case when a dropdown might be opened on pressing on an input with toggle. When backspace is pressed
		// on that input the global event handler for keydown might misbehave by trying to remove the last item
		// Fix is to check if the input is present inside the open dropdown
		var open = event.target;

		while( open && open.tagName !== 'LYTE-DROPDOWN' ) {
			open = open.parentElement;
		}

		if( open 
			&& event.target.tagName === 'INPUT' 
			&& event.target.type === 'text'
			&& !event.target.value 
		) {
			return true;
		}

		return false;
	},

	unmark: function( comp ) {
		var nodes = document.querySelectorAll( '.lyteDropMark' ), 
		i = 0, len = nodes.length, par;

		for( ; i < len; i++ ) {
			//nodes[ i ].classList.remove( 'lyteDropMark' );
			par = comp ? _lyteDropdown.findParent( nodes[ i ] ) : undefined;
			par && par == comp.$node ? undefined : nodes[ i ].classList.remove( 'lyteDropMark' );
		}
	},

	findParent: function( node ) {
		while( node && node.tagName !== 'LYTE-DROPDOWN' ) {
			node = node.parentElement;
		}

		return node;
	},

	getActive: function() {
		var node = document.querySelector( '.lyteDropMark' );
		while( node && node.tagName !== 'LYTE-DROPDOWN' ) {
			node = node.parentElement;
		}

		return node;
	}
}




Lyte.createCustomElement( "lyte-drop-group", {
	static : {
		"observedAttributes": {
			get : function() {
				return [ 'label' ];
			}
		}
	},
	"attributeChangedCallback": function( attr, oldValue, newValue, namespace ) {
		var node, value;

		if ( attr == 'label' ) {
            node = this.querySelector('lyte-drop-label');
            value = this.getAttribute('label');
            if ( node ) {
                node.textContent = value;
            } 
            else {
                node = document.createElement('lyte-drop-label');
                node.textContent = value;
                this.insertBefore( node, this.children[ 0 ] );
            }
        }
	}
});
