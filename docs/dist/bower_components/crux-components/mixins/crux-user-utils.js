Lyte.Mixin.register("crux-user-utils",{excludeIds:function(t,e,a,s){for(var i=[],r=this.getData("cxPropExclude"),o=e.length,l=a;l<o&&i.length!=s;l++)if(-1==r.indexOf(e[l].id))if("userLookup"==t){var h=1,c=this.getData("totalAddedObjects");if("multiple"==this.getData("cxPropType")&&(h=this.getData("totalAddedObjects").length),0==this.getData("selectedList")){e[l].selected=!1;for(var u=0;u<h;u++)"multiple"==this.getData("cxPropType")?void 0!=c[u].id?c[u].id==e[l].id&&(e[l].selected=!0):c[u]==e[l].id&&(e[l].selected=!0):c==e[l].id&&(e[l].selected=!0)}else e[l].selected=!0;i.push(e[l])}else i.push(e[l]);return this.setData("currentPos",l),i},constructArray:function(t,e){var a;a=this.getData("localData"),"userLookup"!=t||"userLookup"==t&&0==this.getData("selectedList")?1!=this.getData("pageNo")&&0!=this.getData("pageNo")||this.setData("noMoreRecords",!0):"userLookup"==t&&1==this.getData("selectedList")&&1==this.getData("pageNo")&&this.setData("noMoreRecords",!0);var s=this.getData("cxPropRecords"),i=this.getData("currentPos");if("userLookup"==t||"lookupComponent"==t)if(0==this.getData("selectedList")||void 0==this.getData("selectedList"))var r=this.getData("systemData");else var o=this.getData("addedItems");else r=this.getData("systemData");if(i<a.length){if(s=a.length-i>s?s:a.length-i,"userLookup"==t||"lookupComponent"==t?(0==this.getData("selectedList")||void 0==this.getData("selectedList")?0===i?this.setData("systemData",this.excludeIds.call(this,t,a,i,s)):Lyte.arrayUtils(r,"push",this.excludeIds.call(this,t,a,i,s)):0===i?this.setData("addedItems",this.excludeIds.call(this,t,a,i,s)):Lyte.arrayUtils(o,"push",this.excludeIds.call(this,t,a,i,s)),this.setData("multiScroll",!1)):(0===i?this.setData("systemData",this.excludeIds.call(this,t,a,i,s)):Lyte.arrayUtils(r,"push",this.excludeIds.call(this,t,a,i,s)),this.setData("multiScroll",!1)),"userLookup"==t&&0!=i&&null!=this.bodydrop.querySelector("input[name=allSelectCheckbox]")&&1==this.bodydrop.querySelector("input[name=allSelectCheckbox]").checked&&0==this.getData("selectedList"))for(var l=this.bodydrop.querySelectorAll("input[name=checkbox]"),h=l.length,c=h-1;c>h-1-s;c--)l[c].parentElement.parentElement.ltProp("checked",!0)}else if(!e&&this.getData("noMoreRecords"))return this.getData("isSearch")?store.triggerAction(this.getData("cxPropModuleName"),"search",this.queryParams()).then(function(e){this.setReqData(e,t)}.bind(this),function(t){(0,console.error)(t),this.setData("multiScroll",!1)}.bind(this)):store.findAll(this.getData("cxPropModuleName"),this.queryParams(),this.getData("cxPropCacheQuery"),this.getData("cxPropDataCache")).then(function(e){this.setReqData(e,t)}.bind(this),function(t){(0,console.error)(t),this.setData("multiScroll",!1)}.bind(this));return!0},setReqData:function(t,e){var a=this.getData("systemData");this.setData("multiScroll",!1),t&&t.constructor==Object&&(t=t[this.getData("cxPropModuleName")]),t?(this.setData("pageNo",this.getData("pageNo")+1),"userLookup"==e&&(this.setData("noUsersAvilabel",!1),this.getData("selectedList")&&this.setData("pageNo",0)),Lyte.arrayUtils(this.getData("localData"),"concat",t),"userLookup"==e&&0==this.getData("selectedList")||"userLookup"!=e?t.length<this.getData("cxPropPerPage")&&this.setData("noMoreRecords",!1):"userLookup"==e&&1==this.getData("selectedList")&&t.length<this.getData("cxPropSelectedPerPage")&&this.setData("noMoreRecords",!1),this.constructArray.call(this,e,!0)):(0==this.getData("currentPos")?(this.setData("systemData",[]),"userLookup"==e&&this.setData("noUsersAvilabel",!0)):Lyte.arrayUtils(a,"push",[]),this.setData("noMoreRecords",!1)),this.loadMoreData&&this.loadMoreData()},queryParams:function(){var t=JSON.parse(JSON.stringify(this.getData("cxPropQueryParams")||{}));t=this.setCriteria();return 0!=this.getData("cxPropPerPage")&&(t.per_page=this.getData("cxPropPerPage")),0!=this.getData("pageNo")&&(t.page=this.getData("pageNo")),t},bodyScroll:function(t,e){var a=e.target;a.scrollHeight<=Math.ceil(a.offsetHeight)+Math.ceil(a.scrollTop)&&a._scrollEnd&&(this.getData("isSearch")||(this.setData("cxPropCacheQuery",!1),this.setData("cxPropDataCache",!1)),this.getData("multiScroll")||("userLookup"&&this.getData("noMoreRecords")&&(this.getData("selectedList")?this.setData("searchingSelectedScroll",!0):this.setData("searchingScroll",!0)),this.setData("multiScroll",!0),this.constructArray.call(this,"userLookup",!1)))},keyup:function(t,e,a){clearTimeout(this._timeout),this._timeout=setTimeout(function(){var s=this.getData("cxPropInputValue"),i=this.getData("cxPropMinLength");s.length>=i&&(null!=e&&(e.scrollTop=0),this.setData("multipleBack",!1),this.setData("isSearch",!0),"userLookup"!=t&&(this.setData("currentPos",0),this.setData("localData",[]),0!=this.getData("pageNo")&&this.setData("pageNo",1)),"userLookup"==t?this.filterObserver.call(this,"search",a):this.constructArray.call(this,t,!1)),0!=this.getData("multipleBack")&&void 0!=this.getData("multipleBack")||(void 0==this.getData("multipleBack")&&s.length<this.getData("cxPropMinLength")?this.setData("multipleBack",!0):0==s.length&&(this.setData("isSearch",!1),"userLookup"==t?this.filterObserver.call(this,void 0,a):this.constructArray.call(this,t,!1),this.setData("multipleBack",!0)))}.bind(this),300)}});