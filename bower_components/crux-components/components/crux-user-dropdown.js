Lyte.Component.register("crux-user-dropdown",{_template:'<template tag-name="crux-user-dropdown">\t<lyte-dropdown data-zcqa="{{cxPropZcqa}}" class="outerDropdown" lt-prop-display-value="{{if(cxPropSelectedUser.full_name, cxPropSelectedUser.full_name, cxPropNoUserLabel)}}" lt-prop-tabindex="{{cxPropTabindex}}" lt-prop-type="{{cxPropType}}" lt-prop-selected="{{lbind(cxPropSelected)}}" lt-prop-yield="true" on-option-selected="{{method(\'userSelected\')}}" on-show="{{method(\'userShow\')}}" on-before-show="{{method(\'userBeforeShow\')}}" on-hide="{{method(\'userHide\')}}" on-before-hide="{{method(\'userBeforeHide\')}}" on-add="{{method(\'userAdd\')}}" on-remove="{{method(\'userRemove\')}}" on-position-change="{{method(\'userPositionChange\')}}" on-scroll="{{method(\'userScroll\')}}">\t\t<template is="registerYield" yield-name="yield">\t\t\t\t<template is="if" value="{{expHandlers(cxPropType,\'==\',\'multiple\')}}"><template case="true">\t\t\t\t\t\t<lyte-drop-button style="min-height: 0px;">\t\t\t\t\t\t<template is="if" value="{{expHandlers(addedItems.length,\'==\',0)}}"><template case="true"> \t\t\t\t\t\t\t<span style="color: #999 !important;">{{cxPropNoUserLabel}}</span>\t\t\t\t\t\t</template></template>\t\t\t\t\t\t\t<ul class="lyteMultipleSelect">\t\t\t\t\t\t\t\t<template is="for" items="{{addedItems}}" item="item" index="index">\t\t\t\t\t\t\t\t\t<li data-value="{{item[cxPropSystemValue]}}">\t\t\t\t\t\t\t\t\t\t<span class="lyteDropdownVisible">{{item[cxPropUserValue]}}</span>\t\t\t\t\t\t\t\t\t\t<lyte-drop-remove class="lyteCloseIcon"></lyte-drop-remove>\t\t\t\t\t\t\t\t\t</li>\t\t\t\t\t\t\t\t</template>\t\t\t\t\t\t\t</ul>\t\t\t\t\t\t</lyte-drop-button>\t\t\t\t</template><template case="false"><template is="if" value="{{cxPropUserButtonYield}}"><template case="true">\t\t\t\t\t<lyte-drop-button>\t\t\t\t\t\t<lyte-yield yield-name="userButtonYield"></lyte-yield>\t\t\t\t\t</lyte-drop-button>\t\t\t\t</template></template></template></template>\t\t\t<lyte-drop-box class="userDropbox dropdownSearch" style="padding:0;">\t\t\t\t\t<div class="wrapperdiv displayFlex">\t\t\t\t\t<template is="if" value="{{cxPropFilterable}}"><template case="true"><template is="if" value="{{cxPropFilterYield}}"><template case="true">\t\t\t\t\t\t\t\t<lyte-dropdown data-zcqa="user_dd_type" class="innerUserDropdown" lt-prop-yield="true" lt-prop-selected="{{lbind(cxPropFilterSelected)}}" lt-prop-tabindex="{{cxPropFilterTabindex}}" on-option-selected="{{method(\'filterSelected\')}}" on-show="{{method(\'filterShow\')}}" on-before-show="{{method(\'filterBeforeShow\')}}" on-hide="{{method(\'filterHide\')}}" on-before-hide="{{method(\'filterBeforeHide\')}}" on-position-change="{{method(\'filterPositionChange\')}}" on-scroll="{{method(\'filterScroll\')}}">\t\t\t\t\t\t\t\t\t<template is="registerYield" yield-name="yield">\t\t\t\t\t\t\t\t\t\t<lyte-yield yield-name="filterYield"></lyte-yield>\t\t\t\t\t\t\t\t\t</template>\t\t\t\t\t\t\t\t</lyte-dropdown>\t\t\t\t\t\t\t</template><template case="false">\t\t\t\t\t\t\t\t<lyte-dropdown data-zcqa="user_dd_type" class="filterDropDown" lt-prop-selected="{{cxPropFilterSelected}}" lt-prop-options="{{cxPropFilterOptions}}" lt-prop-user-value="{{cxPropFilterUserValue}}" lt-prop-system-value="{{cxPropFilterSystemValue}}" on-option-selected="{{method(\'filterSelected\')}}" on-show="{{method(\'filterShow\')}}" on-before-show="{{method(\'filterBeforeShow\')}}" on-hide="{{method(\'filterHide\')}}" on-before-hide="{{method(\'filterBeforeHide\')}}" on-position-change="{{method(\'filterPositionChange\')}}" on-scroll="{{method(\'filterScroll\')}}">\t\t\t\t\t\t\t\t</lyte-dropdown>\t\t\t\t\t\t\t</template></template></template></template><template is="if" value="{{cxPropSearchable}}"><template case="true">\t\t\t\t\t\t<span data-zcqa="user_dd_search_clear" class="{{if(cxPropInputValue,\'clearField\',\'\')}}" onclick="{{action(\'clearInputField\', event)}}" style="{{if(showSearchLoading,\'display:none\',\'display:inline-block\')}}"></span>\t\t\t\t\t\t<lyte-input data-zcqa="user_dd_search" class="{{if(cxPropInputValue,\'\',\'userSearchBox\')}} dropdownSearch vam" lt-prop-autocomplete="{{cxPropInputAutocomplete}}" lt-prop-placeholder="{{cxPropInputPlaceholder}}" lt-prop-autofocus="{{cxPropInputAutofocus}}" lt-prop-disabled="{{cxPropInputDisabled}}" lt-prop-style="{{cxPropInputStyle}}" lt-prop-maxlength="{{cxPropInputMaxlength}}" lt-prop-readonly="{{cxPropInputReadonly}}" lt-prop-id="{{cxPropInputId}}" lt-prop-class="{{cxPropInputClass}}" lt-prop-type="{{cxPropInputType}}" lt-prop-name="{{cxPropInputName}}" lt-prop-width="{{cxPropInputWidth}}" lt-prop-value="{{lbind(cxPropInputValue)}}" lt-prop-appearance="{{cxPropInputAppearance}}" lt-prop-direction="{{cxPropInputDirection}}" lt-prop-wrapper-style="{{cxPropInputWrapperStyle}}" lt-prop-tab-index="{{cxPropInputTabindex}}" onkeyup="{{action(\'keyup\', event)}}" style="width: 100%"></lyte-input>            <img src="/crm/CRMClient/images/crux-search-loader.svg" style="{{if(showSearchLoading,\'display:inline-block\',\'display:none\')}};position:absolute;right:2px;top:3px;" width="25" height="25" align="absmiddle">\t\t\t\t\t</template></template>\t\t\t\t</div>\t\t\t\t<lyte-drop-body class="bodyDropBody {{if(ifEquals(cxPropType, \'multiple\'), \'multiSelectDd\')}}">\t\t\t\t\t<template is="if" value="{{showLoading}}"><template case="true">\t\t\t\t\t\t<span class="loadingGifDiv">\t\t\t\t\t\t\t<img class="loadingGif" src="/crm/CRMClient/images/crux-search-loader.svg">\t\t\t\t\t\t</span>\t\t\t\t\t</template><template case="false">\t\t\t\t\t\t<template is="for" items="{{systemData}}" item="item" index="index">\t\t\t\t\t\t\t\t<lyte-drop-item data-zcqa="user_dd_list_{{item.full_name}}" class="{{if(cxPropUserYield, \'\', if(ifEquals(cxPropSelectedUser.id, item.id), \'result-selected\', \'\'))}}" data-value="{{item[cxPropSystemValue]}}" data-order="{{index}}">\t\t\t\t\t\t\t\t<template is="if" value="{{cxPropUserYield}}"><template case="true">\t\t\t\t\t\t\t\t\t<lyte-yield yield-name="userYield" item-value="{{item}}"></lyte-yield>\t\t\t\t\t\t\t\t</template><template case="false">\t\t\t\t\t\t\t\t\t<template is="if" value="{{expHandlers(item.image_link,\'!\')}}"><template case="true">\t\t\t\t\t\t\t\t\t <img src="/crm/CRMClient/images/nophoto.png" class="socialimg" style="height:32px;width:32px;border-radius:3px;">\t\t\t\t\t\t\t\t\t</template><template case="false">\t\t\t\t\t\t\t\t\t\t<img src="{{item.image_link}}" class="socialimg" style="height:32px;width:32px;border-radius:3px;">\t\t\t\t\t\t\t\t\t</template></template>\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<div class="userDetail">\t\t\t\t\t\t\t\t\t\t<div class="userPrimaryDetail">{{item[cxPropUserValue]}}</div>\t\t\t\t\t\t\t\t\t\t<div class="userSecondaryDetail">{{item.email}}</div>\t\t\t\t\t\t\t\t\t</div>\t\t\t\t\t\t\t\t</template></template>\t\t\t\t\t\t    </lyte-drop-item>\t\t\t\t\t\t</template>\t\t\t\t\t\t<template is="if" value="{{showScrollLoading}}"><template case="true">\t\t\t\t\t\t\t<span class="loadingGifDiv">\t\t\t\t\t\t\t\t<img class="scrollLoadingGif" src="/crm/CRMClient/images/crux-search-loader.svg">\t\t\t\t\t\t\t</span>\t\t\t\t\t\t</template></template>\t\t\t\t\t</template></template>\t\t\t\t</lyte-drop-body>\t\t\t</lyte-drop-box>\t\t</template>\t</lyte-dropdown></template>',_dynamicNodes:[{type:"attr",position:[1]},{type:"registerYield",position:[1,1],dynamicNodes:[{type:"attr",position:[1]},{type:"if",position:[1],cases:{true:{dynamicNodes:[{type:"attr",position:[1,1]},{type:"if",position:[1,1],cases:{true:{dynamicNodes:[{type:"text",position:[1,0]}]}},default:{}},{type:"attr",position:[1,3,1]},{type:"for",position:[1,3,1],dynamicNodes:[{type:"attr",position:[1]},{type:"text",position:[1,1,0]},{type:"componentDynamic",position:[1,3]}]},{type:"componentDynamic",position:[1]}]},false:{dynamicNodes:[{type:"attr",position:[0]},{type:"if",position:[0],cases:{true:{dynamicNodes:[{type:"insertYield",position:[1,1]},{type:"componentDynamic",position:[1]}]}},default:{}}]}},default:{}},{type:"attr",position:[3,1,1]},{type:"if",position:[3,1,1],cases:{true:{dynamicNodes:[{type:"attr",position:[0]},{type:"if",position:[0],cases:{true:{dynamicNodes:[{type:"attr",position:[1]},{type:"registerYield",position:[1,1],dynamicNodes:[{type:"insertYield",position:[1]}]},{type:"componentDynamic",position:[1]}]},false:{dynamicNodes:[{type:"attr",position:[1]},{type:"componentDynamic",position:[1]}]}},default:{}}]}},default:{}},{type:"attr",position:[3,1,2]},{type:"if",position:[3,1,2],cases:{true:{dynamicNodes:[{type:"attr",position:[1],attr:{style:{name:"style",helperInfo:{name:"if",args:["showSearchLoading","'display:none'","'display:inline-block'"]}}}},{type:"attr",position:[3]},{type:"componentDynamic",position:[3]},{type:"attr",position:[5],attr:{style:{name:"style",helperInfo:{name:"concat",args:["''",{type:"helper",value:{name:"if",args:["showSearchLoading","'display:inline-block'","'display:none'"]}},"';position:absolute;right:2px;top:3px;'"]}}}}]}},default:{}},{type:"attr",position:[3,3]},{type:"attr",position:[3,3,1]},{type:"if",position:[3,3,1],cases:{true:{dynamicNodes:[]},false:{dynamicNodes:[{type:"attr",position:[1]},{type:"for",position:[1],dynamicNodes:[{type:"attr",position:[1]},{type:"attr",position:[1,1]},{type:"if",position:[1,1],cases:{true:{dynamicNodes:[{type:"attr",position:[1]},{type:"insertYield",position:[1]}]},false:{dynamicNodes:[{type:"attr",position:[1]},{type:"if",position:[1],cases:{true:{dynamicNodes:[]},false:{dynamicNodes:[{type:"attr",position:[1]}]}},default:{}},{type:"text",position:[3,1,0]},{type:"text",position:[3,3,0]}]}},default:{}},{type:"componentDynamic",position:[1]}]},{type:"attr",position:[3]},{type:"if",position:[3],cases:{true:{dynamicNodes:[]}},default:{}}]}},default:{}},{type:"componentDynamic",position:[3,3]},{type:"componentDynamic",position:[3]}]},{type:"componentDynamic",position:[1]}],_observedAttributes:["cxPropFilterYield","cxPropFilterSystemValue","cxPropFilterUserValue","cxPropFilterTabindex","cxPropFilterOptions","cxPropFilterSelected","cxPropTabindex","cxPropUserYield","cxPropUserButtonYield","cxPropType","cxPropSelected","cxPropUserValue","cxPropSystemValue","cxPropInputAutocomplete","cxPropInputPlaceholder","cxPropInputAutofocus","cxPropInputDisabled","cxPropInputStyle","cxPropInputMaxlength","cxPropInputReadonly","cxPropInputId","cxPropInputClass","cxPropInputType","cxPropInputName","cxPropInputWidth","cxPropInputValue","cxPropInputAppearance","cxPropInputDirection","cxPropInputWrapperStyle","cxPropInputTabindex","cxPropRecords","cxPropSearchable","cxPropMinLength","cxPropFilterable","cacheQuery","dataCache","cxPropForcedFetch","systemData","addedItems","currentPos","localData","pageNo","perPage","searchPerPage","isSearch","cxPropSelectedUser","cxPropSelectedUsers","filters","contactServerUrl","cxPropExclude","areRecordsAvailable","cxPropSearchableField","cxPropNoUserLabel","activeUsersData","activeUsersPageNo","allActiveUsersFetched","cxPropZcqa","cxPropCriteria","cxPropSearchCriteria"],init:function(){if(0==this.getData("cxPropForcedFetch")?this.setData("cacheQuery",!0):this.setData("cacheQuery",!1),this.getData("cxPropNoUserLabel")||this.setData("cxPropNoUserLabel",_cruxUtils.getI18n("crm.label.picklist.none")),this.getData("cxPropSearchable")&&this.getData("cxPropMinLength")<2&&this.setData("cxPropMinLength",2),this.getData("cxPropFilterable")){if(this.getData("cxPropFilterYield")&&!this.getData("cxPropFilterSelected")&&this.setData("cxPropFilterSelected","ActiveUsers"),!this.getData("cxPropFilterYield"))if(0===(e=this.getData("cxPropFilterOptions")).length){var t=[];t[0]={id:"AllUsers",category:"All"},t[1]={id:"ActiveUsers",category:"Active"},t[2]={id:"DeactiveUsers",category:"Inactive"},t[3]={id:"ConfirmedUsers",category:"Confirmed"},t[4]={id:"NotConfirmedUsers",category:"Unconfirmed"},t[5]={id:"DeletedUsers",category:"Deleted"},t[6]={id:"ActiveConfirmedUsers",category:"Active Confirmed"},t[7]={id:"AdminUsers",category:"Admin"},t[8]={id:"ActiveConfirmedAdmins",category:"Active Confirmed Admins"},t[9]={id:"CurrentUser",category:"Current"},this.setData("cxPropFilterOptions",t),this.setData("cxPropFilterSystemValue","id"),this.setData("cxPropFilterUserValue","category"),this.getData("cxPropFilterSelected")||this.setData("cxPropFilterSelected",t[0].id)}else{var e=this.getData("cxPropFilterOptions"),a=this.getData("cxPropFilterSystemValue");this.getData("cxPropFilterSelected")||this.setData("cxPropFilterSelected",e[0][a])}}else this.getData("cxPropFilterSelected")||this.setData("cxPropFilterSelected","ActiveUsers");var r=this.getData("cxPropType");if("single"===r){var s=this.getData("cxPropSelectedUser");s?this.setData("cxPropSelected",s.id):this.setData("cxPropSelectedUser",{})}else if("multiple"===r){var o=this.getData("cxPropSelectedUsers");if(o){for(var i=[],l=o.length,c=0;c<l;c++)i[c]=o[c].id;this.setData("cxPropSelected",JSON.stringify(i)),this.setData("addedItems",o)}else this.setData("cxPropSelectedUsers",[])}},data:function(){return{cxPropFilterYield:Lyte.attr("boolean",{default:!1}),cxPropFilterSystemValue:Lyte.attr("string",{default:""}),cxPropFilterUserValue:Lyte.attr("string",{default:""}),cxPropFilterTabindex:Lyte.attr("string",{default:"0"}),cxPropFilterOptions:Lyte.attr("array",{default:[]}),cxPropFilterSelected:Lyte.attr("string",{default:""}),cxPropTabindex:Lyte.attr("string",{default:"0"}),cxPropUserYield:Lyte.attr("boolean",{default:!1}),cxPropUserButtonYield:Lyte.attr("boolean",{default:!1}),cxPropType:Lyte.attr("string",{default:"single"}),cxPropSelected:Lyte.attr("string",{default:""}),cxPropUserValue:Lyte.attr("string",{default:"full_name"}),cxPropSystemValue:Lyte.attr("string",{default:"id"}),cxPropInputAutocomplete:Lyte.attr("string",{default:"off"}),cxPropInputPlaceholder:Lyte.attr("string",{default:_cruxUtils.getI18n("crm.label.search.for.users")}),cxPropInputAutofocus:Lyte.attr("boolean",{default:!0}),cxPropInputDisabled:Lyte.attr("boolean",{default:!1}),cxPropInputStyle:Lyte.attr("string",{default:""}),cxPropInputMaxlength:Lyte.attr("number",{default:25}),cxPropInputReadonly:Lyte.attr("boolean",{default:!1}),cxPropInputId:Lyte.attr("string",{default:"inputId"}),cxPropInputClass:Lyte.attr("string",{default:""}),cxPropInputType:Lyte.attr("string",{default:""}),cxPropInputName:Lyte.attr("string",{default:""}),cxPropInputWidth:Lyte.attr("string",{default:"auto"}),cxPropInputValue:Lyte.attr("string",{default:""}),cxPropInputAppearance:Lyte.attr("string",{default:"flat"}),cxPropInputDirection:Lyte.attr("string",{default:"vertical"}),cxPropInputWrapperStyle:Lyte.attr("string",{default:""}),cxPropInputTabindex:Lyte.attr("string",{default:"0"}),cxPropRecords:Lyte.attr("number",{default:50}),cxPropSearchable:Lyte.attr("boolean",{default:!0}),cxPropMinLength:Lyte.attr("number",{default:2}),cxPropFilterable:Lyte.attr("boolean",{default:!0}),cacheQuery:Lyte.attr("boolean"),dataCache:Lyte.attr("boolean",{default:!1}),cxPropForcedFetch:Lyte.attr("boolean",{default:!1}),systemData:Lyte.attr("array",{default:[]}),addedItems:Lyte.attr("array",{default:[]}),currentPos:Lyte.attr("number",{default:0}),localData:Lyte.attr("array",{default:[]}),pageNo:Lyte.attr("number",{default:1}),perPage:Lyte.attr("number",{default:200}),searchPerPage:Lyte.attr("number",{default:200}),isSearch:Lyte.attr("boolean",{default:!1}),cxPropSelectedUser:Lyte.attr("object",{default:{}}),cxPropSelectedUsers:Lyte.attr("array",{default:[]}),filters:Lyte.attr("array",{default:[]}),contactServerUrl:Lyte.attr("string",{default:Crm.userDetails.contactServerUrl}),cxPropExclude:Lyte.attr("array",{default:[]}),areRecordsAvailable:Lyte.attr("boolean",{default:!0}),cxPropSearchableField:Lyte.attr("string",{default:"last_name"}),cxPropNoUserLabel:Lyte.attr("string",{default:_cruxUtils.getI18n("crm.label.picklist.none")}),activeUsersData:Lyte.attr("array",{default:[]}),activeUsersPageNo:Lyte.attr("number",{default:1}),allActiveUsersFetched:Lyte.attr("boolean",{default:!1}),cxPropZcqa:Lyte.attr("string",{default:""}),cxPropCriteria:Lyte.attr("string",{default:""}),cxPropSearchCriteria:Lyte.attr("string",{default:""})}},didConnect:function(){if(this.outerDropdown=this.$node.querySelector("lyte-dropdown"),this.outerDropdownBody=this.outerDropdown.querySelector("lyte-drop-body.bodyDropBody"),this.outerDropdownBox=this.outerDropdown.querySelector("lyte-drop-box"),this.innerDropdown=this.outerDropdown.querySelector("lyte-dropdown"),this.innerDropdown&&(this.innerDropdownBody=this.innerDropdown.querySelector("lyte-drop-body"),this.innerDropdownBox=this.innerDropdown.querySelector("lyte-drop-box")),"single"===this.getData("cxPropType")&&!this.getData("cxPropUserButtonYield")){var t=this.outerDropdown,e=this.getData("cxPropSelectedUser");if(!e.hasOwnProperty("id")||!e.hasOwnProperty("full_name"))t.querySelector("lyte-drop-button").className="grayColor"}},didDestroy:function(){var t=this.getData("cxPropFilterOptions"),e=this.getData("cxPropFilterSystemValue");this.setData("pageNo",1),t.forEach(function(t){"ActiveUsers"!==t[e]&&(this.setData("cxPropFilterSelected",t[e]),store.clearCachedQuery("user",this.getQueryParams()))}.bind(this))},selectedUsersObserver:function(){this.setData("addedItems",this.getData("cxPropSelectedUsers"))}.observes("cxPropSelectedUsers"),createRemoveErrorDiv:function(){if(this.$node.querySelector("lyte-dropdown").ltProp("show")){var t=this.getData("cxPropType"),e=this.$node.querySelector("lyte-dropdown").component.childComp.querySelectorAll("lyte-drop-body.bodyDropBody lyte-drop-item:not(.lyteDropdownActive)").length;if("multiple"===t&&e>0||"single"===t&&e>0){var a=this.outerDropdownBox;(r=this.outerDropdownBox.querySelector(".noUsersFoundDiv"))&&(r.style.display="none")}else if("multiple"===t&&0==e||"single"===t&&0==e){a=this.outerDropdownBox;if((r=this.outerDropdownBox.querySelector(".noUsersFoundDiv"))&&"none"===r.style.display)r.style.display="block";else if(!r){var r;(r=document.createElement("div")).setAttribute("class","noUsersFoundDiv"),r.innerHTML=_cruxUtils.getI18n("crm.security.group.users.empty"),r.setAttribute("style","display: block;"),a.appendChild(r)}}}},removeIds:function(t){var e=[],a=this.getData("cxPropExclude");if(t)for(var r=t.length,s=0;s<r;s++)-1==a.indexOf(t[s].id)&&(e[e.length]=t[s]);return e},getQueryParams:function(t){var e={};e.type=this.getData("cxPropFilterSelected");var a=this.getData("cxPropInputValue");if(this.getData("isSearch"),"search"===t){var r=this.getData("cxPropSearchCriteria");a&&(e.criteria=r?"(((first_name:starts_with:"+a+")or(last_name:starts_with:"+a+")or(email:starts_with:"+a+"))and"+r+")":"((first_name:starts_with:"+a+")or(last_name:starts_with:"+a+")or(email:starts_with:"+a+"))"),a.length>=this.getData("cxPropMinLength")?e.per_page=this.getData("searchPerPage"):e.per_page=this.getData("perPage"),e.page=this.getData("pageNo")}else{e.per_page=this.getData("perPage"),"ActiveUsers"===this.getData("cxPropFilterSelected")?e.page=this.getData("activeUsersPageNo"):e.page=this.getData("pageNo");var s=this.getData("cxPropCriteria");s&&(e.filters=s)}return e},usersUtil:function(t,e){this.setData("filterChanged",!1),this.setData("showSearchLoading",!1),this.setData("showLoading",!1);this.$node.querySelector(".outerDropdown").component.childComp.querySelector(".userDropbox lyte-input");var a,r=this.getData("cxPropFilterSelected");t?(t.meta?a=t.meta:t.$&&(a=t.$.meta),this.setData("areRecordsAvailable",!!a&&a.more_records)):this.setData("areRecordsAvailable",!1);t&&t.constructor==Object&&(t=t.user),("INVALID_DATA"===t||t&&t.$&&!0===t.$.isError)&&console.error("Error: format of query params for cxPropCriteria is incorrect."),t&&t.constructor===Array?(this.getData("isSearch")||this.setData("pageNo",this.getData("pageNo")+1),this.setData("localData",this.removeIds(t)),"ActiveUsers"===r&&(this.setData("activeUsersData",this.getData("localData")),this.setData("activeUsersPageNo",this.getData("activeUsersPageNo")+1)),(!t||t.length<this.getData("perPage"))&&"ActiveUsers"===r&&this.setData("allActiveUsersFetched",!0),this.setData("currentPos",0),this.paintUsers.call(this),this.outerDropdown.component.childComp&&(this.outerDropdown.component.childComp.querySelector("lyte-drop-body").scrollTop=0),this.createRemoveErrorDiv.call(this)):("ActiveUsers"===r&&this.setData("allActiveUsersFetched",!0),this.setData("systemData",[]),this.setData("localData",[]),this.createRemoveErrorDiv.call(this))},fetchUsers:function(t,e,a){var r=this.getData("cxPropFilterSelected");this.setData("areRecordsAvailable",!0);var s=this.getData("cxPropInputValue"),o="search"===t&&e&&8!==e.keyCode&&this.getData("localData").length>0,i="search"===t&&e&&8===e.keyCode;"search"!==t||i||o||(this.setData("showSearchLoading",!1),this.setData("showLoading",!1)),"search"!==t&&"ActiveUsers"!==r||"search"!==t&&"ActiveUsers"===r&&!this.getData("activeUsersData").length>0||i||o||a?this.getData("isSearch")&&s.length>=this.getData("cxPropMinLength")?store.triggerAction("user","search",this.getQueryParams(t)).then(function(t){this.getData("cxPropInputValue")&&this.usersUtil(t,e)}.bind(this),function(){console.error("Error: user data could not be fetched.")}.bind(this)):("search"===t&&this.getData("isSearch")||"search"!==t)&&("search"===t&&this.getData("isSearch")&&this.setData("activeUsersPageNo",1),"ActiveUsers"==r&&0==this.getData("cxPropForcedFetch")?this.setData("dataCache",!0):this.setData("dataCache",!1),store.findAll("user",this.getQueryParams(),this.getData("cacheQuery"),this.getData("dataCache")).then(function(t){this.usersUtil(t,e)}.bind(this),function(){console.error("Error: user data could not be fetched.")}.bind(this))):"search"!==t&&"ActiveUsers"===r&&this.getData("activeUsersData").length>0&&(this.setData("filterChanged",!1),this.getData("cxPropForcedFetch")?("ActiveUsers"==r&&0==this.getData("cxPropForcedFetch")?this.setData("dataCache",!0):this.setData("dataCache",!1),store.findAll("user",this.getQueryParams(),this.getData("cacheQuery"),this.getData("dataCache")).then(function(t){this.usersUtil(t,e)}.bind(this),function(){console.error("Error: user data could not be fetched.")}.bind(this))):(this.setData("showSearchLoading",!1),this.setData("showLoading",!1),this.setData("localData",this.getData("activeUsersData"))),this.setData("currentPos",0),this.paintUsers.call(this),this.outerDropdown.component.childComp&&(this.outerDropdown.component.childComp.querySelector("lyte-drop-body").scrollTop=0),this.createRemoveErrorDiv.call(this))},filterObs:function(){var t=this.$node.querySelector("lyte-dropdown.outerDropdown").component.childComp.querySelector(".noUsersFoundDiv");t&&t.setAttribute("style","display:none"),this.getData("cxPropForcedFetch")&&(this.setData("activeUsersPageNo",1),this.setData("allActiveUsersFetched",!1)),this.setData("filterChanged",!0),this.setData("showLoading",!0),this.setData("pageNo",1),this.setData("cxPropInputValue",""),this.fetchUsers.call(this)}.observes("cxPropFilterSelected"),fetchUsersByBatch:function(t,e,a){for(var r=[],s=(this.getData("cxPropExclude"),t.length),o=e;o<s&&r.length!=a;o++)r.push(t[o]);return this.setData("currentPos",o),r},paintNextUsers:function(t){this.setData("showScrollLoading",!1);var e,a=this.getData("cxPropFilterSelected");(this.setData("reqPending",!1),t)?(t.meta?e=t.meta:t.$&&(e=t.$.meta),this.setData("areRecordsAvailable",!!e&&e.more_records)):this.setData("areRecordsAvailable",!1);t&&t.constructor==Object&&(t=t.user),t&&t.constructor===Array?(this.setData("pageNo",this.getData("pageNo")+1),t&&(Lyte.arrayUtils(this.getData("localData"),"concat",this.removeIds(t)),"ActiveUsers"===a&&(this.setData("activeUsersData",this.getData("localData")),this.setData("activeUsersPageNo",this.getData("activeUsersPageNo")+1))),(!t||t.length<this.getData("perPage"))&&"ActiveUsers"===a&&this.setData("allActiveUsersFetched",!0),this.paintUsers.call(this)):("ActiveUsers"===a&&this.setData("allActiveUsersFetched",!0),this.createRemoveErrorDiv.call(this))},paintUsers:function(t){var e,a=this.getData("cxPropFilterSelected"),r=this.outerDropdownBox.classList.contains("lyteDropdownHidden");e=this.getData("localData");var s=this.getData("cxPropRecords"),o=this.getData("currentPos"),i=this.getData("systemData");this.getData("addedItems");o<e.length?(s=e.length-o>s?s:e.length-o,0===o?this.setData("systemData",this.fetchUsersByBatch.call(this,e,o,s)):Lyte.arrayUtils(i,"push",this.fetchUsersByBatch.call(this,e,o,s)),"multiple"==this.getData("cxPropType")&&this.outerDropdown.component.hideNodes.call(this.outerDropdown.component)):r||this.getData("areRecordsAvailable")&&("ActiveUsers"!==a||"ActiveUsers"===a&&!this.getData("allActiveUsersFetched"))&&(this.getData("reqPending")||(this.setData("reqPending",!0),this.getData("isSearch")&&this.getData("cxPropInputValue").length>=this.getData("cxPropMinLength")?(this.setData("showScrollLoading",!0),store.triggerAction("user","search",this.getQueryParams(t)).then(function(t){this.paintNextUsers(t)}.bind(this),function(){this.setData("reqPending",!1),console.error("Error: user data could not be fetched.")}.bind(this))):(this.setData("showScrollLoading",!0),store.findAll("user",this.getQueryParams(),!1,!1).then(function(t){this.paintNextUsers(t)}.bind(this),function(){this.setData("reqPending",!1),console.error("Error: user data could not be fetched.")}.bind(this)))))},searchUsers:function(t,e){this.setData("pageNo",1),clearTimeout(this._timeout),this._timeout=setTimeout(function(){this.setData("allActiveUsersFetched",!1);var a=this.getData("cxPropInputValue"),r=this.getData("cxPropMinLength");this.$node.querySelector(".outerDropdown").component.childComp.querySelector(".userDropbox lyte-input");(this.getData("isSearch")||a.length>=r)&&(this.setData("isSearch",!0),a.length>=r&&(this.setData("showSearchLoading",!0),this.fetchUsers.call(this,"search",t))),0==a.length&&(this.setData("showSearchLoading",!1),this.fetchUsers.call(this,"search",t,e),this.setData("isSearch",!1))}.bind(this),300)},actions:{keyup:function(t){this.searchUsers(t)},clearInputField:function(t){this.setData("cxPropInputValue",""),this.searchUsers(t,!0)}},methods:{userSelected:function(t,e,a,r){if(t&&t.stopPropagation(),"single"===this.getData("cxPropType")){for(var s,o=this.outerDropdown,i=(this.getData("cxPropFilterSelected"),this.getData("localData")),l=i.length,c=0;c<l;c++)if(i[c].id===e){s=i[c];break}this.setData("cxPropSelectedUser",s),o.querySelector("lyte-drop-button").className="",this.setData("cxPropInputValue",""),this.searchUsers(void 0,!0)}this.getMethods("onUserSelected")&&this.executeMethod("onUserSelected",t,s,a,r)},userBeforeShow:function(t,e){t&&t.stopPropagation();var a=this.getData("cxPropFilterSelected");this.getData("dataFetched")||this.getData("dataPending")||(this.setData("dataPending",!0),"ActiveUsers"==a&&0==this.getData("cxPropForcedFetch")?this.setData("dataCache",!0):this.setData("dataCache",!1),store.findAll("user",this.getQueryParams(),this.getData("cacheQuery"),this.getData("dataCache")).then(function(r){var s;(this.setData("showLoading",!1),this.setData("dataPending",!1),r)?(r.meta?s=r.meta:r.$&&(s=r.$.meta),this.setData("areRecordsAvailable",!!s&&s.more_records)):this.setData("areRecordsAvailable",!1);if(r&&r.constructor==Object&&(r=r.user),"INVALID_DATA"===r&&console.error("Error: format of query params for cxPropCriteria is incorrect."),r&&r.constructor===Array?(this.setData("pageNo",this.getData("pageNo")+1),this.setData("localData",this.removeIds(r)),"ActiveUsers"===a&&(this.setData("activeUsersData",this.getData("localData")),this.setData("activeUsersPageNo",this.getData("activeUsersPageNo")+1)),r.length<this.getData("perPage")&&"ActiveUsers"===a&&this.setData("allActiveUsersFetched",!0),this.paintUsers.call(this),this.createRemoveErrorDiv.call(this)):("ActiveUsers"===a&&this.setData("allActiveUsersFetched",!0),this.createRemoveErrorDiv.call(this)),this.getMethods("onUserBeforeShow"))return this.executeMethod("onUserBeforeShow",t,e);this.setData("dataFetched",!0)}.bind(this),function(){this.setData("dataPending",!0),console.error("Error: user data could not be fetched.")}.bind(this)),this.setData("showLoading",!0));var r=this.outerDropdown.querySelector(".userSearchBox");r&&r.querySelector("div[class='lyteField']").setAttribute("style","border: none; padding: 0px;")},userShow:function(t,e){this.getMethods("onUserShow")&&this.executeMethod("onUserShow",t,e)},userBeforeHide:function(t,e){var a=e.childComp.querySelector("div.wrapperdiv");return(!t||!a.contains(t.target))&&(this.getMethods("onUserBeforeHide")?this.executeMethod("onUserBeforeHide",t,e):void 0)},userHide:function(t,e){var a=e.childComp.querySelector("lyte-dropdown");a&&a.component.childComp&&!a.component.childComp.classList.contains("lyteDropdownHidden")&&a.toggle(),this.setData("cxPropInputValue",""),this.getData("isSearch")&&this.searchUsers(void 0,!0),this.getMethods("onUserHide")&&this.executeMethod("onUserHide",t,e)},userAdd:function(t,e,a,r,s){for(var o,i=this.getData("systemData"),l=this.getData("addedItems"),c=this.getData("cxPropSystemValue"),n=i.length,p=0;p<n;p++)if(i[p][c]==e){o=i[p];break}Lyte.arrayUtils(l,"push",i[p]);var d=this.outerDropdownBody;d&&parseInt(d.scrollHeight)==parseInt(d.offsetHeight)&&this.paintUsers.call(this),this.createRemoveErrorDiv.call(this),this.setData("cxPropSelected",a),this.setData("cxPropSelectedUsers",l),this.getMethods("onUserAdd")&&this.executeMethod("onUserAdd",t,o,l,r)},userRemove:function(t,e,a,r,s,o){for(var i,l=this.getData("addedItems"),c=this.getData("cxPropSystemValue"),n=l.length,p=0;p<n;p++)if(l[p][c]==e){i=l[p];break}if(Lyte.arrayUtils(l,"removeAt",p),this.setData("cxPropSelected",a),this.getMethods("onError")&&this.getData("cxPropSearchable")){var d=this.outerDropdownBody.querySelector("div.userComponent");d&&d.parentElement.removeChild(d)}this.createRemoveErrorDiv.call(this),this.setData("cxPropSelectedUsers",l),this.getMethods("onUserRemove")&&this.executeMethod("onUserRemove",t,i,l,r)},userPositionChange:function(t,e){this.getMethods("onUserPositionChange")&&this.executeMethod("onUserPositionChange",t,e)},userScroll:function(t,e){var a=t.target;clearTimeout(this.timeout1),this.timeout1=setTimeout(function(){a.scrollHeight<=Math.ceil(a.offsetHeight)+Math.ceil(a.scrollTop)&&(this.getData("filterChanged")||(this.getData("isSearch")?this.paintUsers.call(this,"search"):this.paintUsers.call(this),this.getMethods("onUserScroll")&&this.executeMethod("onUserScroll",t,e)))}.bind(this),100)},filterSelected:function(t,e,a,r){this.setData("cxPropFilterSelected",e),this.getMethods("onFilterSelected")&&this.executeMethod("onFilterSelected",t,e,a,r)},filterBeforeShow:function(t,e){if(this.getMethods("onFilterBeforeShow"))return this.executeMethod("onFilterBeforeShow",t,e)},filterShow:function(t,e){this.getMethods("onFilterShow")&&this.executeMethod("onFilterShow",t,e)},filterBeforeHide:function(t,e){if(this.getMethods("onFilterBeforeHide"))return this.executeMethod("onFilterBeforeHide",t,e)},filterHide:function(t,e){this.getMethods("onFilterHide")&&this.executeMethod("onFilterHide",t,e)},filterPositionChange:function(t,e){this.getMethods("onFilterPositionChange")&&this.executeMethod("onFilterPositionChange",t,e)},filterScroll:function(t,e){this.getMethods("onFilterScroll")&&this.executeMethod("onFilterScroll",t,e)}}});