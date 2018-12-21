/* NOTES TO SELF ===>
	31-07-2018
	 1. Added ltPropStartDate, ltPropEndDate
 */

Lyte.Component.register("lyte-daterangepicker", {
_template:"<template tag-name=\"lyte-daterangepicker\">\t\t<div class=\"lyteDateRangePickerRow\" onmousedown=\"{{action('mouseDown',event)}}\" onmouseover=\"{{action('mouseOver',event)}}\">\t\t<div class=\"lyteDateRangePickerCol1\">\t\t\t<lyte-calendar nav-yield=\"true\" lt-prop-format=\"{{ltPropFormat}}\" lt-prop-max-date=\"{{ltPropMaxDate}}\" lt-prop-min-date=\"{{ltPropMinDate}}\" lt-prop-fill-rows=\"false\" class=\"dRPCalendar1\" on-viewdate-change=\"{{method('viewDateChange','cal1')}}\">\t\t\t\t<template is=\"registerYield\" yield-name=\"navigator\">\t\t\t\t\t<div class=\"lyteDateRPLeftNav\">\t\t\t\t\t\t<span case=\"true\" class=\"lyteCalNav lyteCalyearNavLft\" onclick=\"{{action('previous','Y',event)}}\"></span>\t\t\t        \t<span class=\"lyteCalNav lyteCaldLft\" onclick=\"{{action('previous','M',event)}}\"></span>\t\t\t\t\t</div>\t\t\t\t\t<div class=\"lyteDateRPMonthHeader\">\t\t\t\t\t\t\t\t\t\t\t\t\t<lyte-dropdown class=\"monthDD\" lt-prop-options=\"{{monthNames}}\" lt-prop-tabindex=\"1\" on-option-selected=\"{{method('optionSelected','cal1','M')}}\"></lyte-dropdown>\t\t\t\t\t\t\t<lyte-dropdown class=\"yearDD\" lt-prop-options=\"{{years}}\" lt-prop-tabindex=\"2\" on-option-selected=\"{{method('optionSelected','cal1','Y')}}\"></lyte-dropdown>\t\t\t\t\t\t\t\t\t        </div>\t\t\t\t</template>\t\t\t</lyte-calendar>\t\t</div>\t\t<div class=\"lyteDateRangePickerCol2\">\t\t\t<lyte-calendar nav-yield=\"true\" lt-prop-format=\"{{ltPropFormat}}\" lt-prop-max-date=\"{{ltPropMaxDate}}\" lt-prop-min-date=\"{{ltPropMinDate}}\" lt-prop-fill-rows=\"false\" class=\"dRPCalendar2\" select-date=\"false\" on-viewdate-change=\"{{method('viewDateChange','cal2')}}\">\t\t\t\t<template is=\"registerYield\" yield-name=\"navigator\">\t\t\t\t\t<div class=\"lyteDateRPMonthHeader\">\t\t\t\t\t\t\t\t\t\t\t\t\t<lyte-dropdown class=\"monthDD\" lt-prop-options=\"{{monthNames}}\" lt-prop-tabindex=\"1\" on-option-selected=\"{{method('optionSelected','cal2','M')}}\"></lyte-dropdown>\t\t\t\t\t\t\t<lyte-dropdown class=\"yearDD\" lt-prop-options=\"{{years}}\" lt-prop-tabindex=\"2\" on-option-selected=\"{{method('optionSelected','cal2','Y')}}\"></lyte-dropdown>\t\t\t\t\t\t\t\t            </div>\t\t            <div class=\"lyteDateRPRightNav\">\t\t\t            <span case=\"true\" class=\"lyteCalNav lyteCaldRgt\" onclick=\"{{action('next','M',event)}}\"></span>\t\t\t            <span class=\"lyteCalNav lyteCalyearNavRgt\" onclick=\"{{action('next','Y',event)}}\"></span>\t\t\t        </div>\t\t\t\t</template>\t\t\t</lyte-calendar>\t\t</div>\t</div></template>",
_dynamicNodes : [{"type":"attr","position":[1]},{"type":"attr","position":[1,1,1]},{"type":"registerYield","position":[1,1,1,1],"dynamicNodes":[{"type":"attr","position":[1,1]},{"type":"attr","position":[1,3]},{"type":"attr","position":[3,1]},{"type":"componentDynamic","position":[3,1]},{"type":"attr","position":[3,3]},{"type":"componentDynamic","position":[3,3]}]},{"type":"componentDynamic","position":[1,1,1]},{"type":"attr","position":[1,3,1]},{"type":"registerYield","position":[1,3,1,1],"dynamicNodes":[{"type":"attr","position":[1,1]},{"type":"componentDynamic","position":[1,1]},{"type":"attr","position":[1,3]},{"type":"componentDynamic","position":[1,3]},{"type":"attr","position":[3,1]},{"type":"attr","position":[3,3]}]},{"type":"componentDynamic","position":[1,3,1]}],
_observedAttributes :["monthHeader1","monthHeader2","ltPropCurrentDate","ltPropFormat","ltPropMonthHeaderFormat","shortMonthNames","longMonthNames","ltPropStartYear","ltPropEndYear","ltPropStartDate","ltPropEndDate","years","dateSelected","selectedDate1","selectedDate2","calViewDate1","calViewDate2","tempDate","monthNames","dateNode1","dateNode2","clickCount","ltPropDisabledDates","convertedDates","convert","ltPropMinDate","ltPropMaxDate","internallyChanged"],
    data : function(){
		return {
			"monthHeader1" : Lyte.attr("string",{"default":"Initializing.."}),
			"monthHeader2" : Lyte.attr("string",{"default":"Initializing.."}),
			"ltPropCurrentDate" : Lyte.attr("string",{"default":''}),
			"ltPropFormat" : Lyte.attr("string",{"default":"MM/DD/YYYY"}),
			"ltPropMonthHeaderFormat" : Lyte.attr("string",{"default":"MMM YYYY"}),
			"shortMonthNames": Lyte.attr("array",{"default":['Jan','Feb','Mar','Apr','short.may','Jun','Jul','Aug','Sep','Oct','Nov','Dec']}),
			'longMonthNames': Lyte.attr( 'array', { 
				'default': [
				'January',
				'February',
				'March',
				'April',
				'May',
				'June',
				'July',
				'August',
				'September',
				'October',
				'November',
				'December' 
				]
			} ),
			"ltPropStartYear" : Lyte.attr("number",{"default":1900}),
			"ltPropEndYear" : Lyte.attr("number",{"default":2100}),
			"ltPropStartDate" : Lyte.attr("string",{"default":""}),
			"ltPropEndDate" : Lyte.attr("string",{"default":""}),
			"years" : Lyte.attr("array",{"default":[]}),
			"dateSelected" : Lyte.attr("boolean",{"default" : false}),
			"selectedDate1" : Lyte.attr("string"),
			"selectedDate2" : Lyte.attr("string"),
			"calViewDate1" : Lyte.attr("object"),
			"calViewDate2" : Lyte.attr("object"),
			"tempDate" : Lyte.attr("string"),
			"monthNames" : Lyte.attr("array"),
			"dateNode1" : Lyte.attr("object"),
			"dateNode2" : Lyte.attr("object"),
			"clickCount" : Lyte.attr("number",{"default" : 0}),
			"ltPropDisabledDates" : Lyte.attr("array",{"default" : []}),
			"convertedDates" : Lyte.attr("array",{"default" : []}),
			"convert" : Lyte.attr("number",{"default" : 0}),
			"ltPropMinDate" : Lyte.attr("string",{"default" : ""}),
			"ltPropMaxDate" : Lyte.attr("string",{"default" : ""}),
			"internallyChanged" : Lyte.attr("boolean",{"default" : false})
		}		
	},
	initFunc : function(){
		var year = [];
		for(var i = this.getData("ltPropStartYear");i<=this.getData("ltPropEndYear");i++){
			year.push(i);
		}
		this.setData("years",year);
		var monthNames = [];
		// localeMonthString = [];
		if(this.getData('ltPropMonthHeaderFormat') === 'MMMM YYYY'){
			for(var i = 0; i<12; i++){
				// localeMonthString.push(_lyteUiUtils.i18n(this.getData('longMonthNames')[i]));
				monthNames.push(_lyteUiUtils.i18n(this.getData('longMonthNames')[i]));
			}
		}
		else{
			for(var i = 0; i<12; i++){
				// localeMonthString.push(_lyteUiUtils.i18n(this.getData('shortMonthNames')[i]));
				monthNames.push(_lyteUiUtils.i18n(this.getData('shortMonthNames')[i]));
			}
		}
		this.setData('monthNames',monthNames);
	}.observes('ltPropStartYear','ltPropEndYear').on('init'),
	convertDisabledDates : function(){
		// var disabledDates = this.getData('ltPropDisabledDates');
		// var convertedDates = [];
		// for(var i = 0; i<disabledDates.length; i++){
		// 	convertedDates.push(Date.parse(disabledDates[i]));
		// }
		// this.setData('convertedDates',convertedDates);
		if(this.getData('ltPropDisabledDates').length > 0){
			this.checkAndMarkDisabledDates();
		}
	}.observes("ltPropDisabledDates.[]","convert"),
	setMonths : function(){
		var monthNames = [];
		// localeMonthString = "";
		if(this.getData('ltPropMonthHeaderFormat') === 'MMMM YYYY'){
			for(var i = 0; i<12; i++){
				// localeMonthString += _lyteUiUtils.i18n(this.getData('longMonthNames')[i]);
				monthNames.push(_lyteUiUtils.i18n(this.getData('longMonthNames')[i]));
			}
		}
		else{
			for(var i = 0; i<12; i++){
				// localeMonthString += _lyteUiUtils.i18n(this.getData('shortMonthNames')[i]);
				monthNames.push(_lyteUiUtils.i18n(this.getData('shortMonthNames')[i]));
			}
		}
		this.setData('monthNames',monthNames);
	}.observes('ltPropMonthHeaderFormat'),
	didConnectFunc : function(){
		var cal1 = this.$node.querySelector('.dRPCalendar1');
		var cal2 = this.$node.querySelector('.dRPCalendar2');
		var currentDate = new Date();
		var today = this.getData("ltPropCurrentDate") ? new Date(this.getData("ltPropCurrentDate")) : currentDate;
		var dd = today.getDate();
		var mm = today.getMonth(); //January is 0!
		var yy = today.getFullYear();
		this.setMonthAndYear(cal1,{dd:dd,mm:mm,yy:yy},"cal1");
		if(mm < 11){
			mm += 1
		}
		else{
			mm = 0;
			yy += 1;
		}
		this.setMonthAndYear(cal2,{dd:dd,mm:mm,yy:yy});
		var selected = this.$node.querySelector('.lyteCalSel');
		if(selected){
			var selectedDate = new Date(selected.dataset.date);
			if(selectedDate.getMonth() === currentDate.getMonth() && selectedDate.getDate() === currentDate.getDate() && selectedDate.getFullYear() === currentDate.getFullYear()){
				selected.classList.remove('lyteCalSel');
				selected.classList.add('lyteCalToday');
			}
		}
		if(this.getData('ltPropDisabledDates').length > 0){
			this.setData('convert',this.getData('convert') + 1);
		}
		if(this.getData('ltPropStartDate') && this.getData('ltPropEndDate')){
			this.setData('selectedDate1',this.getData('ltPropStartDate'));
			this.setData('selectedDate2',this.getData('ltPropEndDate'));
			this.checkForSelectedDates(this.getData('ltPropStartDate'),this.getData('ltPropEndDate'));
		}
	}.observes('ltPropCurrentDate','ltPropMinDate','ltPropMaxDate').on('didConnect'),
	changeStartAndEndDate : function(){
		if(!this.getData('internallyChanged')){
			if(this.getData('ltPropStartDate') === "" || this.getData('ltPropEndDate') === ""){
				this.checkAndRemoveAllSelectedClasses();
				this.removeMonthEndAndStart();
			}
			else if(this.getData('ltPropStartDate') && this.getData('ltPropEndDate')){
				this.setData('selectedDate1',this.getData('ltPropStartDate'));
				this.setData('selectedDate2',this.getData('ltPropEndDate'));
				this.checkForSelectedDates(this.getData('ltPropStartDate'),this.getData('ltPropEndDate'));
			}
		}
		else{
			this.setData('internallyChanged',false);
		}
	}.observes('ltPropStartDate','ltPropEndDate'),
	setMonthAndYear : function(cal,date,view){
		cal.ltProp("currentDate",date.mm+1+'/'+date.dd+'/'+date.yy);
		cal.setData('currentDatechanged',cal.getData('currentDatechanged')+1);
		cal.querySelector('.monthDD').ltProp("selected",this.getData("monthNames")[date.mm]);
		cal.querySelector('.yearDD').ltProp("selected",""+date.yy);
		if(view == "cal1"){
			this.setData('calViewDate1',cal.getData('viewDate'));
		}
		else{
			this.setData('calViewDate2',cal.getData('viewDate'));
		}
	},
	selectDates : function(targetDate){
		var nodes = this.$node.querySelectorAll('.lyteCalCdate:not(.lyteCalGray)');
		var initNode = this.getData('dateNode1');
		var target = this.getData('dateNode2');
		var date1 = Date.parse(this.getData('selectedDate1'));
		var date2 = Date.parse(targetDate);
		var node1 = this.$node.querySelector('.lyteDateRPTempFirstDateSelected');
		var node2 = this.$node.querySelector('.lyteDateRPTempLastDateSelected');
		if(node1){
			node1.classList.remove('lyteDateRPTempFirstDateSelected');
		}
		if(node2){
			node2.classList.remove('lyteDateRPTempLastDateSelected');
		}
		this.removeMonthEndAndStart();
		if( date1 < date2){
			for(var i = 0; i<nodes.length; i++){
				var date = Date.parse(nodes[i].dataset.date);
				if(date >= date1 && date <= date2){
					if(nodes[i].classList.contains("lyteCalDisabled")){
						this.checkForBeforeAndAfter(nodes,i,date1,date2);
					}
					else{
						if(date == date1){
							initNode.classList.add('lyteDateRPTempFirstDateSelected');
						}
						else if(date == date2){
							target.classList.add('lyteDateRPTempLastDateSelected');
						}
						else{
							if(!nodes[i].classList.contains("lyteDateRPTempSelected")){
								nodes[i].classList.add("lyteDateRPTempSelected");
							}
						}
						this.checkForMonthEndAndStart(nodes,i,this.getData('selectedDate1'),targetDate);
					}
				}
				else{
					if(nodes[i].classList.contains("lyteDateRPTempSelected") || nodes[i].classList.contains("lyteCalSel")){
						nodes[i].classList.remove("lyteDateRPTempSelected",'lyteCalSel');
					}
				}
			}
		}
		else if(date1 > date2){
			for(var i = 0; i<nodes.length; i++){
				var date = Date.parse(nodes[i].dataset.date);
				if(date >= date2 && date <= date1){
					if(nodes[i].classList.contains("lyteCalDisabled")){
						this.checkForBeforeAndAfter(nodes,i,date2,date1);
					}
					else{
						if(date == date2){
							target.classList.add('lyteDateRPTempFirstDateSelected');
						}
						else if(date == date1){
							initNode.classList.add('lyteDateRPTempLastDateSelected');
						}
						else{
							if(!nodes[i].classList.contains("lyteDateRPTempSelected")){
								nodes[i].classList.add("lyteDateRPTempSelected");
							}
						}
						this.checkForMonthEndAndStart(nodes,i,targetDate,this.getData('selectedDate1'));
					}
				}
				else{
					if(nodes[i].classList.contains("lyteDateRPTempSelected") || nodes[i].classList.contains("lyteCalSel")){
						nodes[i].classList.remove("lyteDateRPTempSelected","lyteCalSel");
					}
				}
			}
		}
		else{
			this.checkAndRemoveAllSelectedClasses();
			this.setData('selectedDate1',targetDate)
			target.classList.add('lyteDateRPTempFirstDateSelected','lyteDateRPTempLastDateSelected');
			this.checkForMonthEndAndStart(nodes,Array.from(nodes).indexOf(target),targetDate,this.getData('selectedDate1'));
		}
		this.setData("tempDate",targetDate);
		
	},
	checkAndMarkDisabledDates : function(){
		var nodes = this.$node.querySelectorAll('.lyteCalCdate:not(.lyteCalGray)');
		if(nodes.length == 0){
			return
		}
		var date;
		for(var j=0; j<nodes.length; j++){
			date = nodes[j].dataset.date;
			if(this.checkForDisabledDates(date)){
				nodes[j].classList.add("lyteCalDisabled");
			}
		}
	},
	checkForDisabledDates : function(date){
		var disabledDates = this.getData('ltPropDisabledDates');
		for(var i = 0; i<disabledDates.length; i++){
			if(new RegExp(disabledDates[i]).test(date)){
				return true;
			}
		}
		return false;
	},
	checkForBeforeAndAfter : function(nodes,pos,startDate,endDate){
		if(pos > 0 && pos < nodes.length-1){
			var date1 = Date.parse(nodes[pos-1].dataset.date);
			var date2 = Date.parse(nodes[pos+1].dataset.date);
			if(date1 >= startDate && date1 <= endDate){
				nodes[pos-1].classList.add('lyteDateRPMonthEndDate');
			}
			if(date2 >= startDate && date2 <= endDate){
				nodes[pos+1].classList.add('lyteDateRPMonthStartDate');
			}
		}
	},
	checkAndRemoveAllSelectedClasses : function(){
		var nodes = Array.from(this.$node.querySelectorAll(".lyteDateRPFirstDateSelected"));
		Lyte.arrayUtils(nodes,"push",(Array.from(this.$node.querySelectorAll(".lyteDateRPLastDateSelected"))));
		Lyte.arrayUtils(nodes,"push",(Array.from(this.$node.querySelectorAll(".lyteDateRPTempLastDateSelected"))));
		Lyte.arrayUtils(nodes,"push",(Array.from(this.$node.querySelectorAll(".lyteDateRPTempFirstDateSelected"))));
		Lyte.arrayUtils(nodes,"push",(Array.from(this.$node.querySelectorAll(".lyteDateRPTempSelected"))));
		Lyte.arrayUtils(nodes,"push",(Array.from(this.$node.querySelectorAll(".lyteCalSel"))));
		Lyte.arrayUtils(nodes,"push",(Array.from(this.$node.querySelectorAll(".lyteCalToday"))));
		for(var i=0;i<nodes.length;i++){
			nodes[i].classList.remove("lyteDateRPFirstDateSelected","lyteDateRPTempSelected","lyteDateRPLastDateSelected","lyteDateRPTempFirstDateSelected","lyteDateRPTempLastDateSelected","lyteCalSel","lyteCalToday");
		}
		this.setData("selectedDate1","");
		this.setData("selectedDate2","");
	},
	checkForMonthEndAndStart : function(nodes,pos,startDate,endDate){
		var allNodes = this.$node.querySelectorAll('.lyteCalCdate');
		var lastNode = allNodes[allNodes.length-1];
		if(nodes[pos].innerText === "1" && Date.parse(nodes[pos].dataset.date) >= Date.parse(startDate) &&  Date.parse(nodes[pos].dataset.date) <= Date.parse(endDate)){
			nodes[pos].classList.remove('lyteDateRPTempSelected');
			nodes[pos].classList.add('lyteDateRPMonthStartDate');
		}
		else if((pos + 1 < nodes.length && nodes[pos + 1].innerText === "1" && Date.parse(nodes[pos + 1].dataset.date) >= Date.parse(startDate) &&  Date.parse(nodes[pos].dataset.date) <= Date.parse(endDate)) || (pos == nodes.length - 1 && nodes[pos].isEqualNode(lastNode) && Date.parse(nodes[pos].dataset.date) >= Date.parse(startDate) &&  Date.parse(nodes[pos].dataset.date) <= Date.parse(endDate))){
			nodes[pos].classList.remove('lyteDateRPTempSelected');
			nodes[pos].classList.add('lyteDateRPMonthEndDate');
		}
	},
	removeMonthEndAndStart : function(){
		var nodes = Array.from(this.$node.querySelectorAll('.lyteDateRPMonthStartDate'));
		Lyte.arrayUtils(nodes,"push",(Array.from(this.$node.querySelectorAll(".lyteDateRPMonthEndDate"))));
		for(var i=0;i<nodes.length;i++){
			nodes[i].classList.remove("lyteDateRPMonthStartDate","lyteDateRPMonthEndDate");
		}
	},
	executeSelected : function(event){
		if(this.getMethods('onDateSelected')){
			var date1 = Date.parse(this.getData('selectedDate1'));
			var date2 = Date.parse(this.getData('selectedDate2'));
			if(date1 <= date2){
				this.setData('internallyChanged',true);
				this.setData('ltPropStartDate',this.getData('selectedDate1'));
				this.setData('internallyChanged',true);
				this.setData('ltPropEndDate',this.getData('selectedDate2'));
				this.executeMethod('onDateSelected',event,this.getData('selectedDate1'),this.getData('selectedDate2'),this);
			}
			else{
				this.setData('internallyChanged',true);
				this.setData('ltPropStartDate',this.getData('selectedDate2'));
				this.setData('internallyChanged',true);
				this.setData('ltPropEndDate',this.getData('selectedDate1'));
				this.executeMethod('onDateSelected',event,this.getData('selectedDate2'),this.getData('selectedDate1'),this);
			}
		}
	},
	checkForSelectedDates : function( startDate, endDate){
		var nodes = this.$node.querySelectorAll('.lyteCalCdate:not(.lyteCalGray)');
		if(startDate && endDate){
			var date1 = Date.parse(startDate);
			var date2 = Date.parse(endDate);
			for(var i = 0 ; i<nodes.length ; i++){
				var date = Date.parse(nodes[i].dataset.date);
				if(date >= date1 && date <= date2){
					if(nodes[i].classList.contains('lyteCalDisabled')){
						this.checkForBeforeAndAfter(nodes,i,date1,date2);
					}
					else{
						if(date == date1){
							nodes[i].classList.add('lyteDateRPFirstDateSelected');
						}
						if(date == date2){
							nodes[i].classList.add('lyteDateRPLastDateSelected');
						}
						if(date !== date1 && date !== date2){
							nodes[i].classList.add('lyteDateRPTempSelected');
						}
						this.checkForMonthEndAndStart(nodes,i,startDate,endDate);
					}
				}
			}
		}
		else{
			if(this.getData('ltPropDisabledDates').length > 0){
				this.checkAndMarkDisabledDates();
			}
			var date1 = this.getData("selectedDate1");
			var date2 = this.getData("selectedDate2");
			var date3 = this.getData("tempDate");
			if(date1 && date2){
				// this.removeMonthEndAndStart();
				date1 = Date.parse(date1);
				date2 = Date.parse(date2);
				if(date1 < date2){
					for(var i = 0 ; i<nodes.length ; i++){
						var date = Date.parse(nodes[i].dataset.date);
						if(date >= date1 && date <= date2){
							if(nodes[i].classList.contains('lyteCalDisabled')){
								this.checkForBeforeAndAfter(nodes,i,date1,date2);
							}
							else{
								if(date == date1){
									nodes[i].classList.add('lyteDateRPFirstDateSelected');
								}
								if(date == date2){
									nodes[i].classList.add('lyteDateRPLastDateSelected');
								}
								if(date !== date1 && date !== date2){
									nodes[i].classList.add('lyteDateRPTempSelected');
								}
								this.checkForMonthEndAndStart(nodes,i,this.getData("selectedDate1"),this.getData("selectedDate2"));
							}
						}
					}
				}
				else{
					for(var i = 0 ; i<nodes.length ; i++){
						var date = Date.parse(nodes[i].dataset.date);
						if(date >= date2 && date <= date1){
							if(nodes[i].classList.contains('lyteCalDisabled')){
								this.checkForBeforeAndAfter(nodes,i,date2,date1);
							}
							else{
								if(date == date2){
									nodes[i].classList.add('lyteDateRPFirstDateSelected');
								}
								if(date == date1){
									nodes[i].classList.add('lyteDateRPLastDateSelected');
								}
								if(date !== date1 && date !== date2) {
									nodes[i].classList.add('lyteDateRPTempSelected');
								}
								this.checkForMonthEndAndStart(nodes,i,this.getData("selectedDate2"),this.getData("selectedDate1"));
							}
						}
					}
				}
			}
			else if(date1 && date3){
				date1 = Date.parse(date1);
				date3 = Date.parse(date3);
				if(date1 < date3){
					for(var i = 0 ; i<nodes.length ; i++){
						var date = Date.parse(nodes[i].dataset.date);
						if(nodes[i].classList.contains('lyteCalDisabled')){
							this.checkForBeforeAndAfter(nodes,i,date1,date3);
						}
						else{
							if(date1 <= date3 && date == date1){
								nodes[i].classList.add('lyteDateRPTempFirstDateSelected');
							}
							else if(date == date3){
								nodes[i].classList.add('lyteDateRPTempLastDateSelected');
							}
							else if(date > date1 && date < date3){
								nodes[i].classList.add('lyteDateRPTempSelected');
							}
						}
					}
				}
				else{
					for(var i = 0 ; i<nodes.length ; i++){
						var date = Date.parse(nodes[i].dataset.date);
						if(nodes[i].classList.contains('lyteCalDisabled')){
							this.checkForBeforeAndAfter(nodes,i,date3,date1);
						}
						else{
							if(date3 <= date1 && date == date1){
								nodes[i].classList.add('lyteDateRPTempFirstDateSelected');
							}
							else if(date == date1){
								nodes[i].classList.add('lyteDateRPTempLastDateSelected');
							}
							else if(date >= date2 && date < date1){
								nodes[i].classList.add('lyteDateRPTempSelected');
							}
						}
					}
				}
			}
		}
	},
	callOnNavigate : function(event,fromMonths,toMonths){
		if(this.getMethods('onNavigation')){
			this.executeMethod('onNavigation',event,fromMonths,toMonths);
		}
	},
	actions :{
		previous: function(opt,event){
			var calendar = this.$node.querySelector('.dRPCalendar1');
			var fromMonths = {"date1":this.getData('monthNames')[this.getData('calViewDate1').getMonth()] + " " + this.getData('calViewDate1').getFullYear(),
								"date2":this.getData('monthNames')[this.getData('calViewDate2').getMonth()] + " " + this.getData('calViewDate2').getFullYear()};
			calendar.setData('selectDate',false);
			var dd = 1;
			var mm;
			var yy;
			if(opt == 'M'){
				mm = calendar.getData('viewDate').getMonth() - 1;
			}
			else{
				mm = calendar.getData('viewDate').getMonth();
			}
			if(opt == 'Y'){
				yy = calendar.getData('viewDate').getFullYear() - 1;
			}
			else{
				yy = calendar.getData('viewDate').getFullYear();
			}
			if(mm == -1){
				mm = 11;
				yy -= 1;
			}
			if(yy < this.getData("ltPropStartYear")){
				return;
			}
			this.setMonthAndYear(calendar,{dd:dd,mm:mm,yy:yy},"cal1");
			if(mm < 11){
				mm += 1;
			}
			else{
				mm = 0;
				yy += 1;
			}
			this.setMonthAndYear(this.$node.querySelector('.dRPCalendar2'),{dd:dd,mm:mm,yy:yy});
			this.checkForSelectedDates();
			var toMonths = {"date1":this.getData('monthNames')[this.getData('calViewDate1').getMonth()] + " " + this.getData('calViewDate1').getFullYear(),
								"date2":this.getData('monthNames')[this.getData('calViewDate2').getMonth()] + " " + this.getData('calViewDate2').getFullYear()};
			this.callOnNavigate(event,fromMonths,toMonths,this);
		},
		next: function(opt,event){
			var calendar = this.$node.querySelector('.dRPCalendar2');
			calendar.setData('selectDate',false);
			var fromMonths = {"date1":this.getData('monthNames')[this.getData('calViewDate1').getMonth()] + " " + this.getData('calViewDate1').getFullYear(),
								"date2":this.getData('monthNames')[this.getData('calViewDate2').getMonth()] + " " + this.getData('calViewDate2').getFullYear()};
			var dd = 1;
			var mm;
			var yy;
			if(opt == 'M'){
				mm = calendar.getData('viewDate').getMonth() + 1;
			}
			else{
				mm = calendar.getData('viewDate').getMonth();
			}
			if(opt == 'Y'){
				yy = calendar.getData('viewDate').getFullYear() + 1;
			}
			else{
				yy = calendar.getData('viewDate').getFullYear();
			}
			if(mm == 12){
				mm = 0;
				yy += 1;
			}
			if(yy > this.getData('ltPropEndYear')){
				return;
			}
			this.setMonthAndYear(calendar,{dd:dd,mm:mm,yy:yy});
			if(mm > 0){
				mm -= 1;
			}
			else{
				mm = 11;
				yy -= 1;
			}
			this.$node.querySelector('.dRPCalendar1').setData('selectDate',false);
			this.setMonthAndYear(this.$node.querySelector('.dRPCalendar1'),{dd:dd,mm:mm,yy:yy},"cal1");
			this.checkForSelectedDates();
			var toMonths = {"date1":this.getData('monthNames')[this.getData('calViewDate1').getMonth()] + " " + this.getData('calViewDate1').getFullYear(),
								"date2":this.getData('monthNames')[this.getData('calViewDate2').getMonth()] + " " + this.getData('calViewDate2').getFullYear()};
			this.callOnNavigate(event,fromMonths,toMonths,this);
		},
		mouseDown : function(event){
			var target = event.target;
			while(target.parentElement){
				if(target.classList.contains('lyteCalCdate')){
					break;
				}
				target = target.parentElement;
			}
			if(target.tagName === "HTML"){
				return;
			}
			var clickCount = this.getData('clickCount');
		 	clickCount++;
		 	this.setData('clickCount',clickCount);
		 	var self = this;
		    if (clickCount === 1) {
		        singleClickTimer = setTimeout(function() {
		            clickCount = 0;
		            self.setData('clickCount',clickCount);
		        }, 400);
		    } else if (clickCount === 2) {
		        clearTimeout(singleClickTimer);
		        clickCount = 0;
		        this.setData('clickCount',clickCount);
		        // var target = event.target;
		        if(target.classList.contains("lyteCalCdate")){
					if(!target.classList.contains("lyteCalGray")){
						this.checkAndRemoveAllSelectedClasses();
						this.removeMonthEndAndStart();
						this.setData('dateNode1',target);
						this.setData('dateNode2',target);
						target.classList.add('lyteDateRPFirstDateSelected','lyteDateRPLastDateSelected');
						var nodes = this.$node.querySelectorAll('.lyteCalCdate:not(.lyteCalGray)');
						this.checkForMonthEndAndStart(nodes,Array.from(nodes).indexOf(target),target.dataset.date,target.dataset.date);
						this.setData('selectedDate1',target.dataset.date);
						this.setData('selectedDate2',target.dataset.date);
						this.setData('dateSelected',false);
						this.executeSelected(event);
					}
				}
		        return;
		    }
			
			if(target.classList.contains("lyteCalCdate")){
				if(!target.classList.contains("lyteCalGray")){
					if(!this.getData('dateSelected')){
						if(this.getMethods('firstSelection')){
							this.executeMethod('firstSelection',event,this);
						}
						this.checkAndRemoveAllSelectedClasses();
						this.removeMonthEndAndStart();
						this.setData('dateNode1',target);
						target.classList.add("lyteDateRPTempFirstDateSelected");
						target.classList.add("lyteDateRPTempLastDateSelected");
						var nodes = this.$node.querySelectorAll('.lyteCalCdate:not(.lyteCalGray)');
						this.checkForMonthEndAndStart(nodes,Array.from(nodes).indexOf(target),target.dataset.date,target.dataset.date);
						this.setData('selectedDate1',target.dataset.date);
						this.setData('dateSelected',true);
					}
					else{
						if(this.getMethods('secondSelection')){
							this.executeMethod('secondSelection',event,this);
						}
						if(target.classList.contains('lyteDateRPTempSelected')){
							target.classList.remove('lyteDateRPTempSelected');
						}
						var date1 = Date.parse(this.getData('selectedDate1'));
						var date2 = Date.parse(target.dataset.date);
						if(date1 <= date2){
							this.getData('dateNode1').classList.remove('lyteDateRPTempFirstDateSelected');
							this.getData('dateNode1').classList.add('lyteDateRPFirstDateSelected');
							this.getData('dateNode2').classList.remove('lyteDateRPTempLastDateSelected');
							this.getData('dateNode2').classList.add('lyteDateRPLastDateSelected');
						}
						else{
							this.getData('dateNode1').classList.remove('lyteDateRPTempLastDateSelected');
							this.getData('dateNode1').classList.add('lyteDateRPLastDateSelected');
							this.getData('dateNode2').classList.remove('lyteDateRPTempFirstDateSelected');
							this.getData('dateNode2').classList.add('lyteDateRPFirstDateSelected');
						}
						this.setData('selectedDate2',target.dataset.date);
						this.setData('tempDate',"");
						this.setData('dateSelected',false);
						this.executeSelected(event);
					}
				}
			}
		},
		mouseOver : function(event){
			if(this.getData("dateSelected")){
				var target = event.target;
				while(target.parentElement){
					if(target.classList.contains('lyteCalCdate')){
						break;
					}
					target = target.parentElement;
				}
				if(target.tagName === "HTML"){
					return;
				}
				if(target.classList.contains("lyteCalCdate")){
					if(!target.classList.contains("lyteCalGray")){
						this.setData('dateNode2',target);
						this.selectDates(target.dataset.date);
					}
				}
			}
		}
	},
	methods : {
		optionSelected : function(cal,opt,event,selected,comp){
			if(this.getMethods('ddOptionSelected')){
				this.executeMethod('ddOptionSelected',event,selected,comp,cal,opt);
			}
			if(cal == "cal1"){
				var calendar = this.$node.querySelector('.dRPCalendar1');
				calendar.setData('selectDate',false);
				var dd = 1;
				var mm;
				var yy;
				if(opt == 'M'){
					mm = this.getData('monthNames').indexOf(selected);
				}
				else{
					mm = calendar.getData('viewDate').getMonth();
				}
				if(opt == 'Y'){
					yy = parseInt(selected);
				}
				else{
					yy = calendar.getData('viewDate').getFullYear();
				}
				if(mm > 10 && yy == this.getData('ltPropEndYear')){
					if(selected == 'DEC'){
						calendar.querySelector('.monthDD').ltProp("selected",this.getData("monthNames")[calendar.getData('viewDate').getMonth()]);
					}
					else{
						calendar.querySelector('.yearDD').ltProp("selected",""+calendar.getData('viewDate').getFullYear());
					}
					// console.log("returning "+mm+" "+yy);
					return;
				}
				this.setMonthAndYear(calendar,{dd:dd,mm:mm,yy:yy},"cal1");
				if(mm < 11){
					mm += 1;
				}
				else{
					mm = 0;
					yy += 1;
				}
				this.setMonthAndYear(this.$node.querySelector('.dRPCalendar2'),{dd:dd,mm:mm,yy:yy});
			}
			else if(cal == "cal2"){
				var calendar = this.$node.querySelector('.dRPCalendar2');
				calendar.setData('selectDate',false);
				var dd = 1;
				var mm;
				var yy;
				if(opt == 'M'){
					mm = this.getData('monthNames').indexOf(selected);
				}
				else{
					mm = calendar.getData('viewDate').getMonth();
				}
				if(opt == 'Y'){
					yy = selected;
				}
				else{
					yy = calendar.getData('viewDate').getFullYear();
				}
				if(mm < 1 && yy == this.getData('ltPropStartYear')){
					if(selected == 'JAN'){
						calendar.querySelector('.monthDD').ltProp("selected",this.getData("monthNames")[calendar.getData('viewDate').getMonth()]);
					}
					else{
						calendar.querySelector('.yearDD').ltProp("selected",""+calendar.getData('viewDate').getFullYear());
					}
					// console.log("returning "+mm+" "+yy);
					return;
				}
				this.setMonthAndYear(calendar,{dd:dd,mm:mm,yy:yy});
				if(mm > 0){
					mm -= 1;
				}
				else{
					mm = 11;
					yy -= 1;
				}
				this.$node.querySelector('.dRPCalendar1').setData('selectDate',false);
				this.setMonthAndYear(this.$node.querySelector('.dRPCalendar1'),{dd:dd,mm:mm,yy:yy},"cal1");
			}
			this.checkForSelectedDates();
		},
		viewDateChange : function(cal,comp,viewDate){
			if(cal == "cal1" /*&& this.getData('calViewDate1').toString() != viewDate.toString()*/){
				var dd = 1;
				var mm = viewDate.getMonth();
				var yy = viewDate.getFullYear();
				comp.$node.querySelector('.monthDD').ltProp("selected",this.getData("monthNames")[mm]);
				comp.$node.querySelector('.yearDD').ltProp("selected",""+yy);
				// if(mm < 11){
				// 	mm += 1;
				// }
				// else{
				// 	mm = 0;
				// 	yy += 1;
				// }
				// this.setMonthAndYear(this.$node.querySelector('.dRPCalendar2'),{dd:dd,mm:mm,yy:yy});
			}
			else if(cal == "cal2"/* && this.getData('calViewDate2').toString() != viewDate.toString()*/){
				var dd = 1;
				var mm = viewDate.getMonth();
				var yy = viewDate.getFullYear();
				comp.$node.querySelector('.monthDD').ltProp("selected",this.getData("monthNames")[mm]);
				comp.$node.querySelector('.yearDD').ltProp("selected",""+yy);
				// if(mm > 0){
				// 	mm -= 1;
				// }
				// else{
				// 	mm = 11;
				// 	yy -= 1;
				// }
				// this.setMonthAndYear(this.$node.querySelector('.dRPCalendar1'),{dd:dd,mm:mm,yy:yy});
			}
		}
	}
});
