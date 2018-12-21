Lyte.Mixin.register("crux-criteria-conditions",{initCruxConditions:function(s){var t={system:"equal",display:_cruxUtils.getI18n("is")},e={system:"not_equal",display:_cruxUtils.getI18n("isn't")},i={system:"contains",display:_cruxUtils.getI18n("contains")},l={system:"not_contains",display:_cruxUtils.getI18n("doesn't contain")},a={system:"starts_with",display:_cruxUtils.getI18n("starts with")},n={system:"ends_with",display:_cruxUtils.getI18n("ends with")},y={system:"Due in Days",display:_cruxUtils.getI18n("Due in Days")},d={display:_cruxUtils.getI18n("Today"),system:"${TODAY}"},r={system:"${YESTERDAY}",display:_cruxUtils.getI18n("Yesterday")},u={system:"${LASTWEEK}",display:_cruxUtils.getI18n("Last Week")},m={system:"${LASTMONTH}",display:_cruxUtils.getI18n("Last Month")},c={system:"${EMPTY}",display:"is empty"},_={system:"${NOTEMPTY}",display:_cruxUtils.getI18n("is not empty")},o={display:_cruxUtils.getI18n("between"),system:"between"},p={display:_cruxUtils.getI18n("not between"),system:"not_between"};"criteria"==s?(this.textConditions=[{system:"None",display:_cruxUtils.getI18n("None")},t,e,i,l,a,n,c,_],this.dateConditions=[t,e,{system:"less_than",display:_cruxUtils.getI18n("is before")},{system:"greater_than",display:_cruxUtils.getI18n("is after")},o,p,d,{display:_cruxUtils.getI18n("Tomorrow"),system:"${TOMORROW}"},{system:"${TOMORROWPLUS}",display:_cruxUtils.getI18n("Tomorrow Onwards")},r,{system:"${YESTERDAYMINUS}",display:_cruxUtils.getI18n("Till Yesterday")},m,{system:"${THISMONTH}",display:_cruxUtils.getI18n("Current Month")},{system:"${NEXTMONTH}",display:_cruxUtils.getI18n("Next Month")},u,{system:"${THISWEEK}",display:_cruxUtils.getI18n("Current Week")},{system:"${NEXTWEEK}",display:_cruxUtils.getI18n("Next Week")},{system:"Age in Days",display:_cruxUtils.getI18n("Age in Days")},y,c,_],this["date-timeConditions"]=[t,e,{system:"less_than",display:_cruxUtils.getI18n("is before")},{system:"greater_than",display:_cruxUtils.getI18n("is after")},o,p,d,{display:_cruxUtils.getI18n("Tomorrow"),system:"${TOMORROW}"},{system:"${TOMORROWPLUS}",display:_cruxUtils.getI18n("Tomorrow Onwards")},r,{system:"${YESTERDAYMINUS}",display:_cruxUtils.getI18n("Till Yesterday")},m,{system:"${THISMONTH}",display:_cruxUtils.getI18n("Current Month")},{system:"${NEXTMONTH}",display:_cruxUtils.getI18n("Next Month")},u,{system:"${THISWEEK}",display:_cruxUtils.getI18n("Current Week")},{system:"${NEXTWEEK}",display:_cruxUtils.getI18n("Next Week")},{system:"Age in Days",display:_cruxUtils.getI18n("Age in Days")},y,c,_],this.ageInDaysConditions=[{system:"equal",display:"="},{system:"not_equal",display:"!="},{system:"less_than",display:"<"},{system:"less_equal",display:"<="},{system:"greater_than",display:">"},{system:"greater_equal",display:">="}]):"filter"==s&&(this.textConditions=[t,e,i,l,a,n,c,_],this.dateConditions=[{system:"Age in Days",display:_cruxUtils.getI18n("crm.condition.in.last")},y,{system:"equal",display:_cruxUtils.getI18n("on")},{system:"less_than",display:_cruxUtils.getI18n("before")},{system:"greater_than",display:_cruxUtils.getI18n("crm.label.general.small.after")},{system:"between",display:_cruxUtils.getI18n("between")},d,r,{system:"${THISWEEK}",display:_cruxUtils.getI18n("crm.thisweek")},{system:"${THISMONTH}",display:_cruxUtils.getI18n("crm.label.this.month")},{system:"${THISYEAR}",display:_cruxUtils.getI18n("crm.thisyear")},u,m,c,_]),this.enc_textConditions=[t,e,c,_],this.booleanConditions=[t],this.defaultConditions=[t,e],this.defWithEmptyConditions=[t,e,c,_],this.numberConditions=[{system:"equal",display:"="},{system:"not_equal",display:"!="},{system:"less_than",display:"<"},{system:"less_equal",display:"<="},{system:"greater_than",display:">"},{system:"greater_equal",display:">="},o,p,c,_],this.csConditions=[{system:"${Calls.Call Status.Scheduled}",display:_cruxUtils.getI18n("Scheduled")},{system:"${Calls.Call Status.Attended Dialled}",display:_cruxUtils.getI18n("Attended Dialled")},{system:"${Calls.Call Status.Unattended Dialled}",display:_cruxUtils.getI18n("Unattended Dialled")},{system:"${Calls.Call Status.Overdue}",display:_cruxUtils.getI18n("Overdue")},{system:"${Calls.Call Status.Cancelled}",display:_cruxUtils.getI18n("Cancelled")},{system:"${Calls.Call Status.Received}",display:_cruxUtils.getI18n("Received")},{system:"${Calls.Call Status.Missed}",display:_cruxUtils.getI18n("Missed")}]}});