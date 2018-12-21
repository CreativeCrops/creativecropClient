Lyte.Component.register("crux-user-tooltip",{_template:'<template tag-name="crux-user-tooltip"><lyte-popover lt-prop-origin-elem="{{elemId}}" id="popoverTooltip" lt-prop-show-close-button="false" lt-prop-freeze="false" lt-prop-scrollable="false" class="userTooltipPopoverClass" lt-prop-wrapper-class="infoPopover" lt-prop-type="{{if(isBusinessCard, \'box\', \'\')}}" on-show="{{method(\'showPopover\')}}" lt-prop-duration="0">\t<template is="registerYield" yield-name="popover">\t\t<lyte-popover-content class="{{if(isBusinessCard, \'userbcpopup\', \'\')}}" onmouseover="{{action(\'mouseOver\')}}" onmouseout="{{action(\'mouseOut\')}}">\t\t<template is="if" value="{{expHandlers(isBusinessCard,\'!\')}}"><template case="true">\t\t    <div class="mB8">\t\t        <img class="dIB vat lvttImg mR5" src="{{contactServerUrl}}/file?ID={{userData.zuid}}&amp;fs=thumb">\t\t        <div class="dIB vat">\t\t            <span class="bold color_1 dB mB3">{{userData.full_name}}</span>\t\t            <template is="if" value="{{isClientPortalUser}}"><template case="true">\t\t            \t<span class="color_9 f13">{{cruxGetI18n(\'custmr.prtl.user.role\')}}, {{userData.profile.name}}</span>\t\t            </template><template case="false">\t\t            \t<span class="color_9 f13">{{userData.role.name}}, {{userData.profile.name}}</span>\t\t            </template></template>\t\t        </div>\t\t    </div>\t\t    <div class="mB5"><span class="dIB vam lvttMailIcon mR10"></span><span class="dIB color_6 f13">{{userData.email}}</span></div>\t\t    <div><span class="dIB vam lvttPhoneIcon mR10"></span><span class="dIB color_6 f13">{{userData.phone}}</span></div>\t\t</template><template case="false">\t\t\t\t<div class="pR">\t\t\t\t\t<div class="up_space pA">\t\t\t\t\t\t<img class="up_size fL" src="{{contactServerUrl}}/file?ID={{userData.zuid}}&amp;fs=thumb">\t\t\t\t\t</div>\t\t\t\t\t<div class="userbc_info">\t\t\t\t\t\t<div class="proximas f15 pT5 pB5 userinfoMax" onclick="window.open(&quot;{{concat(&quot;/crm/settings/users/&quot;, userId)}}&quot;,&quot;_blank&quot;);">\t\t\t\t\t\t\t{{userData.full_name}}\t\t\t\t\t\t\t<span class="mL5 proxima normaltag">{{userData.profile.name}}</span>\t\t\t\t\t\t</div>\t\t\t\t\t\t<a class="emailicon lh24 black dB" href="mailto:{{{email}}}">{{userData.email}}</a>\t\t\t\t\t\t<div class="phoneicon lh24">{{userData.phone}}</div>\t\t\t\t\t\t<div class="mobileicon lh24">{{userData.mobile}}</div>\t\t\t\t\t</div>\t\t\t\t\t<div id="actionLayer" class="aligncenter">\t\t\t\t\t\t<template is="if" value="{{showChatIcon}}"><template case="true">\t\t\t\t\t\t<button id="chatBtn" type="button" class="dismiss-btn" onclick="WMSUI.chat(&quot;{{userData.zuid}}&quot;,this);">Chat</button>\t\t\t\t\t\t\t\t\t\t\t\t</template></template>\t\t\t\t\t</div>\t\t\t\t</div>\t\t    </template></template>\t\t</lyte-popover-content>\t</template></lyte-popover></template>',_dynamicNodes:[{type:"attr",position:[0]},{type:"registerYield",position:[0,1],dynamicNodes:[{type:"attr",position:[1]},{type:"attr",position:[1,1]},{type:"if",position:[1,1],cases:{true:{dynamicNodes:[{type:"attr",position:[1,1]},{type:"text",position:[1,3,1,0]},{type:"attr",position:[1,3,3]},{type:"if",position:[1,3,3],cases:{true:{dynamicNodes:[{type:"text",position:[1,0]},{type:"text",position:[1,2]}]},false:{dynamicNodes:[{type:"text",position:[1,0]},{type:"text",position:[1,2]}]}},default:{}},{type:"text",position:[3,1,0]},{type:"text",position:[5,1,0]}]},false:{dynamicNodes:[{type:"attr",position:[1,1,1]},{type:"attr",position:[1,3,1]},{type:"text",position:[1,3,1,1]},{type:"text",position:[1,3,1,3,0]},{type:"attr",position:[1,3,3]},{type:"text",position:[1,3,3,0]},{type:"text",position:[1,3,5,0]},{type:"text",position:[1,3,7,0]},{type:"attr",position:[1,5,1]},{type:"if",position:[1,5,1],cases:{true:{dynamicNodes:[{type:"attr",position:[1]}]}},default:{}}]}},default:{}},{type:"componentDynamic",position:[1]}]},{type:"componentDynamic",position:[0]}],_observedAttributes:["elemId","userId","userData","contactServerUrl","isBusinessCard","showChatIcon"],data:function(){return{elemId:Lyte.attr("string"),userId:Lyte.attr("string"),userData:Lyte.attr("object"),contactServerUrl:Lyte.attr("string"),isBusinessCard:Lyte.attr("boolean"),showChatIcon:Lyte.attr("boolean",{default:!0})}},methods:{showPopover:function(){var t=document.querySelector(".infoPopover").querySelector(".lytePopover"),e=this;store.findRecord("user",this.getData("userId")).then(function(s){if(e.setData("userData",s),e.getData("isBusinessCard")){t.classList.remove("lvOwnerTooltipLeft","lvOwnerTooltipRight"),(o=document.querySelector(e.getData("elemId")))&&(o.getBoundingClientRect().x+t.offsetWidth>=window.innerWidth?t.style.left=o.getBoundingClientRect().left-(o.getBoundingClientRect().x+t.offsetWidth-window.innerWidth)+"px":t.style.left=o.getBoundingClientRect().left+"px",t.style.top=o.getBoundingClientRect().top+22+"px")}else{var o;if(o=document.querySelector(e.getData("elemId"))){var a=o.getBoundingClientRect(),i=o.offsetWidth;if(t.style.padding="0px",t.querySelector("lyte-popover-content").style.padding="15px 20px",t.classList.contains("lvOwnerTooltip")||t.classList.contains("lvOwnerTooltipLeft")||t.classList.contains("lvOwnerTooltipRight"))var l=t.offsetWidth;else l=t.offsetWidth+23;a.x+i+l>=window.innerWidth?(t.classList.remove("lvOwnerTooltipRight","lvOwnerTooltip"),t.classList.add("lvOwnerTooltipLeft","lvOwnerTooltip"),t.style.left=a.x-(l+8)+"px",t.style.top=a.top-30+"px"):(t.classList.remove("lvOwnerTooltipLeft","lvOwnerTooltip"),t.classList.add("lvOwnerTooltipRight","lvOwnerTooltip"),t.style.left=a.x+i+8+"px",t.style.top=a.top-30+"px")}(e.getData("userId")==Crm.userDetails.USER_ID||!WmsContacts.contactslist[s.zuid]||WmsContacts.contactslist[s.zuid]&&-1==WmsContacts.contactslist[s.zuid].STATUS)&&e.setData("showChatIcon",!1)}})}},actions:{mouseOver:function(){this.getMethods("BCardHover")&&this.executeMethod("BCardHover")},mouseOut:function(){this.getMethods("BCardOut")&&this.executeMethod("BCardOut")}}});