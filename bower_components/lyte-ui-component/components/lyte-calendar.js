/* NOTES TO SELF ===>
	31-07-2018
	 1. Added dropdown for month and year in month header
 */

Lyte.Component.register( 'lyte-calendar', {
_template:"<template tag-name=\"lyte-calendar\">    <div class=\"lyteCalendarPopup\">        <div class=\"lyteCalendarView\">            <div>                <template is=\"if\" value=\"{{navYield}}\"><template case=\"true\">                    <lyte-yield yield-name=\"navigator\"></lyte-yield>                </template><template case=\"false\">                    <div class=\"lyteCalendarNavigator\">                        <template is=\"if\" value=\"{{ifNotEquals(ltPropHeaderType,'dropdown')}}\"><template case=\"true\">                            <template is=\"if\" value=\"{{ltPropYear}}\">                            <template case=\"true\"><span class=\"lyteCalNav lyteCalyearNavLft\" onclick=\"{{action('previous','Y',event)}}\"></span></template>                            </template>                        </template></template>                        <span class=\"lyteCalNav lyteCaldLft\" onclick=\"{{action('previous','M',event)}}\"></span>                        <template is=\"if\" value=\"{{ifEquals(ltPropHeaderType,'dropdown')}}\"><template case=\"true\">                            <span class=\"lyteCalsCalMon\">                                <lyte-dropdown class=\"lyteCalMonthDD\" lt-prop-options=\"{{monthNames}}\" lt-prop-tabindex=\"1\" on-option-selected=\"{{method('optionSelected','M')}}\"></lyte-dropdown>                                <lyte-dropdown class=\"lyteCalYearDD\" lt-prop-options=\"{{years}}\" lt-prop-tabindex=\"2\" on-option-selected=\"{{method('optionSelected','Y')}}\"></lyte-dropdown>                            </span>                        </template><template case=\"false\">                            <span class=\"lyteCalsCalMon\">{{monthHeader}}</span>                        </template></template>                        <span class=\"lyteCalNav lyteCaldRgt\" onclick=\"{{action('next','M',event)}}\"></span>                        <template is=\"if\" value=\"{{ifNotEquals(ltPropHeaderType,'dropdown')}}\"><template case=\"true\">                            <template is=\"if\" value=\"{{ltPropYear}}\">                                <template case=\"true\"><span class=\"lyteCalNav lyteCalyearNavRgt\" onclick=\"{{action('next','Y',event)}}\"></span></template>                            </template>                        </template></template>                    </div>                </template></template>                            </div>            <div class=\"lyteCalTableContainer\">                <div class=\"lyteCalTableRowHeader\">                    <template is=\"for\" items=\"{{daysOfWeek}}\" item=\"day\" indexval=\"idod\">                        <div class=\"lyteCalTableCellHeader\">{{lyteUiI18n(day)}}</div>                    </template>                </div>                <template is=\"for\" items=\"{{matrix}}\" item=\"vector\" indexval=\"rowid\">                    <template is=\"if\" value=\"{{lyteUiCheckEmpty(vector)}}\">                        <template case=\"false\">                            <div class=\"lyteCalTableRow\">                                <template is=\"for\" items=\"{{vector}}\" item=\"date\" indexval=\"cellid\">                                    <template is=\"if\" value=\"{{lyteUiCheckInRange(ltPropMinDate,ltPropMaxDate,date.val)}}\">                                        <template case=\"true\">                                            <template is=\"if\" value=\"{{date.emptyBlock}}\">                                                <template case=\"true\">                                                    <div class=\"lyteCalEmpty\"></div>                                                </template>                                                <template case=\"false\">                                                    <div data-date=\"{{date.val}}\" onclick=\"{{action('dateSelected',event)}}\" class=\"{{date.clsname}}\"><span class=\"lyteCalDateSpan\">{{date.date}}</span></div>                                                </template>                                            </template>                                        </template>                                        <template case=\"false\">                                            <template is=\"if\" value=\"{{date.emptyBlock}}\">                                                <template case=\"true\">                                                    <div class=\"lyteCalEmpty\"></div>                                                </template>                                                <template case=\"false\">                                                    <div data-date=\"{{date.val}}\" class=\"{{date.clsname}}\"><span class=\"lyteCalDateSpan\">{{date.date}}</span></div>                                                </template>                                            </template>                                        </template>                                    </template>                                </template>                            </div>                        </template>                    </template>                </template>            </div>            <div>                <div class=\"lyteCalBtns\">                    <template is=\"if\" value=\"{{showToday}}\">                        <template case=\"true\"><p class=\"lyteCalCurrentDate\"><a onclick=\"{{action('today',event)}}\">{{lyteUiI18n('today')}}</a></p></template>                    </template>                    <template is=\"if\" value=\"{{ltPropYield}}\">                        <template case=\"true\">                            <lyte-yield yield-name=\"footer\"></lyte-yield>                        </template>                    </template>                </div>            </div>        </div>    </div></template>",
_dynamicNodes : [{"type":"attr","position":[1,1,1,1]},{"type":"if","position":[1,1,1,1],"cases":{"true":{"dynamicNodes":[{"type":"insertYield","position":[1]}]},"false":{"dynamicNodes":[{"type":"attr","position":[1,1]},{"type":"if","position":[1,1],"cases":{"true":{"dynamicNodes":[{"type":"attr","position":[1]},{"type":"if","position":[1],"cases":{"true":{"dynamicNodes":[{"type":"attr","position":[0]}]}},"default":{}}]}},"default":{}},{"type":"attr","position":[1,3]},{"type":"attr","position":[1,5]},{"type":"if","position":[1,5],"cases":{"true":{"dynamicNodes":[{"type":"attr","position":[1,1]},{"type":"componentDynamic","position":[1,1]},{"type":"attr","position":[1,3]},{"type":"componentDynamic","position":[1,3]}]},"false":{"dynamicNodes":[{"type":"text","position":[1,0]}]}},"default":{}},{"type":"attr","position":[1,7]},{"type":"attr","position":[1,9]},{"type":"if","position":[1,9],"cases":{"true":{"dynamicNodes":[{"type":"attr","position":[1]},{"type":"if","position":[1],"cases":{"true":{"dynamicNodes":[{"type":"attr","position":[0]}]}},"default":{}}]}},"default":{}}]}},"default":{}},{"type":"attr","position":[1,1,3,1,1]},{"type":"for","position":[1,1,3,1,1],"dynamicNodes":[{"type":"text","position":[1,0]}]},{"type":"attr","position":[1,1,3,3]},{"type":"for","position":[1,1,3,3],"dynamicNodes":[{"type":"attr","position":[1]},{"type":"if","position":[1],"cases":{"false":{"dynamicNodes":[{"type":"attr","position":[1,1]},{"type":"for","position":[1,1],"dynamicNodes":[{"type":"attr","position":[1]},{"type":"if","position":[1],"cases":{"true":{"dynamicNodes":[{"type":"attr","position":[1]},{"type":"if","position":[1],"cases":{"true":{"dynamicNodes":[]},"false":{"dynamicNodes":[{"type":"attr","position":[1]},{"type":"text","position":[1,0,0]}]}},"default":{}}]},"false":{"dynamicNodes":[{"type":"attr","position":[1]},{"type":"if","position":[1],"cases":{"true":{"dynamicNodes":[]},"false":{"dynamicNodes":[{"type":"attr","position":[1]},{"type":"text","position":[1,0,0]}]}},"default":{}}]}},"default":{}}]}]}},"default":{}}]},{"type":"attr","position":[1,1,5,1,1]},{"type":"if","position":[1,1,5,1,1],"cases":{"true":{"dynamicNodes":[{"type":"attr","position":[0,0]},{"type":"text","position":[0,0,0]}]}},"default":{}},{"type":"attr","position":[1,1,5,1,3]},{"type":"if","position":[1,1,5,1,3],"cases":{"true":{"dynamicNodes":[{"type":"insertYield","position":[1]}]}},"default":{}}],
_observedAttributes :["ltPropStartDate","ltPropEndDate","ltPropCurrentDate","ltPropFormat","ltPropYear","ltPropMonthHeaderFormat","daysOfWeek","monthNames","shortHands","todayName","viewDate","changeData","ltPropYield","ltPropMinDate","ltPropMaxDate","ltPropStartWeekDay","navYield","selectDate","currentDatechanged","ltPropFillRows","ltPropNumberOfRows","callFrmDidcnct","monthDD","yearDD","years","ltPropHeaderType"],
	data: function() {
		return {
			'ltPropStartDate': Lyte.attr( 'string', { 
				'default': ''
			} ),
			'ltPropEndDate': Lyte.attr( 'string', { 
				'default': ''
			} ),
			'ltPropCurrentDate': Lyte.attr( 'string', { 
				'default': '' 
			} ),
			'ltPropFormat': Lyte.attr( 'string', { 
				'default': 'MM/DD/YYYY' 
			} ),
			'ltPropYear': Lyte.attr( 'boolean', { 
				'default': true 
			} ),
			'ltPropMonthHeaderFormat': Lyte.attr( 'string', { 
				'default': 'MMMM YYYY' 
			} ),
			'daysOfWeek': Lyte.attr( 'array', { 
				'default': [] 
			} ),
			'monthNames': Lyte.attr( 'array', { 
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
			'shortHands': Lyte.attr( 'array', { 
				'default': [
				'Jan',
				'Feb',
				'Mar',
				'Apr',
				'short.may',
				'Jun',
				'Jul',
				'Aug',
				'Sep',
				'Oct',
				'Nov',
				'Dec'
				]
			} ),
			'todayName': Lyte.attr( 'string', {
				'default': 'Today' 
			} ),
			'viewDate': Lyte.attr( 'object', { 
				'default': {} 
			} ),
			'changeData': Lyte.attr( 'number', {
				'default': 0 
			} ),
			'ltPropYield': Lyte.attr( 'boolean', { 
				'default': false
			} ),
			'ltPropMinDate': Lyte.attr( 'string', { 
				'default': ''
			} ),
			'ltPropMaxDate': Lyte.attr( 'string', { 
				'default': '' 
			} ),
			'ltPropStartWeekDay': Lyte.attr( 'number', { 
				'default': 1 
			} ),
			'navYield': Lyte.attr( 'boolean', { 
				'default': false 
			} ),
			'selectDate': Lyte.attr( 'boolean', { 
				'default': true 
			} ),
			'currentDatechanged': Lyte.attr( 'number', { 
				'default': 0 
			} ),
			'ltPropFillRows': Lyte.attr( 'boolean', { 
				'default': true 
			} ),
			'ltPropNumberOfRows': Lyte.attr( 'number', { 
				'default': 6 
			} ),
			'callFrmDidcnct' : Lyte.attr('boolean',{"default" : false}),
			'monthDD' : Lyte.attr("object"),
			'yearDD' : Lyte.attr("object"),
			'years' :Lyte.attr("array",{"default":[1900, 1901, 1902, 1903, 1904, 1905, 1906, 1907, 1908, 1909, 1910, 1911, 1912, 1913, 1914, 1915, 1916, 1917, 1918, 1919, 1920, 1921, 1922, 1923, 1924, 1925, 1926, 1927, 1928, 1929, 1930, 1931, 1932, 1933, 1934, 1935, 1936, 1937, 1938, 1939, 1940, 1941, 1942, 1943, 1944, 1945, 1946, 1947, 1948, 1949, 1950, 1951, 1952, 1953, 1954, 1955, 1956, 1957, 1958, 1959, 1960, 1961, 1962, 1963, 1964, 1965, 1966, 1967, 1968, 1969, 1970, 1971, 1972, 1973, 1974, 1975, 1976, 1977, 1978, 1979, 1980, 1981, 1982, 1983, 1984, 1985, 1986, 1987, 1988, 1989, 1990, 1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998, 1999, 2000, 2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025, 2026, 2027, 2028, 2029, 2030, 2031, 2032, 2033, 2034, 2035, 2036, 2037, 2038, 2039, 2040, 2041, 2042, 2043, 2044, 2045, 2046, 2047, 2048, 2049, 2050, 2051, 2052, 2053, 2054, 2055, 2056, 2057, 2058, 2059, 2060, 2061, 2062, 2063, 2064, 2065, 2066, 2067, 2068, 2069, 2070, 2071, 2072, 2073, 2074, 2075, 2076, 2077, 2078, 2079, 2080, 2081, 2082, 2083, 2084, 2085, 2086, 2087, 2088, 2089, 2090, 2091, 2092, 2093, 2094, 2095, 2096, 2097, 2098, 2099, 2100]}),
			'ltPropHeaderType' : Lyte.attr("string",{"default" : "default"})

		}
	},

	changeDaysOfWeek: function() {
		var days = [ 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat' ], 
		startDay = this.getData( 'ltPropStartWeekDay' ), i, result = [] ;
		for( i = 0; i < 7; i++ ) { 
			result.push( days[ ( i + startDay ) % 7 ] );
		}

		this.setData( 'daysOfWeek', result );
		
	},

	setMonthAndYearDropdown : function(){
		if(!this.getData('navYield') && this.getData('ltPropHeaderType') == "dropdown" && this.getData('monthDD') && this.getData('yearDD')){
			var monthHeaders = this.getData('monthHeader').split(' '),
			format = this.getData( 'ltPropMonthHeaderFormat' ), 
			lmd = /MMMM YYYY/ig,
			ld = /MMM YYYY/ig,
			monthArray = [],
			monthNames;
			if(lmd.test( format )){
				monthNames = this.getData('monthNames');
			}
			else if(ld.test(format)){
				monthNames = this.getData('shortHands');
			}
			for(var i=0;i<monthNames.length; i++){
				monthArray[i] = _lyteUiUtils.i18n(monthNames[i]);
			}
			this.getData('monthDD').component.setData('ltPropOptions',monthArray);
			this.getData('monthDD').component.setData('ltPropSelected',monthHeaders[0]);
			this.getData('yearDD').component.setData('ltPropSelected',monthHeaders[1]);
		}
	}.observes('monthHeader','callFrmDidcnct'),

	startWeekDayObserver: function() {
		this.changeDaysOfWeek();
	}.observes( 'ltPropStartWeekDay' ),

	monthHeaderObserver: function() {
		this.setData( 'monthHeader', this.getMonthHeader.call( this ) )
	}.observes( 'monthNames.[]' ),

	getMonthHeader: function() {
		var format = this.getData( 'ltPropMonthHeaderFormat' ), 
		lmd = /MMMM YYYY/ig,
		ld = /MMM YYYY/ig,
		retval = "", monthArray;

		if( lmd.test( format ) ) {
			monthArray = this.getData( 'monthNames' )
			retval = _lyteUiUtils.i18n( monthArray[ this.getData( 'viewDate' ).getMonth() ] ) + " " + this.getData( 'viewDate' ).getFullYear();
		}
		else if( ld.test( format ) ) {
			monthArray = this.getData( 'shortHands' )
			retval = _lyteUiUtils.i18n( monthArray[ this.getData( 'viewDate' ).getMonth() ] ) + " " + this.getData( 'viewDate' ).getFullYear();
		}

		return retval;
	},

	revert: function( event ) {
		var from = new Date( this.getData( 'viewDate' ).getTime() ), 
		curDate = new Date();

		curDate.setDate(1);

		var to = new Date( curDate.getTime() );

		this.setData( 'viewDate', curDate )
		this.setData( 'monthHeader', this.getMonthHeader.call( this ) );
		this.setData( 'changeData', this.getData( 'changeData' ) + 1 );
		this.setData( 'showToday', false );
		if( this.getMethods( 'onNavigate' ) 
			&& ( from.getMonth() !== to.getMonth() 
			|| from.getFullYear() !== to.getFullYear() ) 
		) {
			this.executeMethod( 'onNavigate', event, this.getDateFromFormat( from, this.getData( 'ltPropFormat' ) ), this.getDateFromFormat( to, this.getData( 'ltPropFormat' ) ) ,this );
		}
	},

	getDateFromFormat: function( tdate, format ) {
		var date = tdate.getDate(), year  = tdate.getFullYear(), month= tdate.getMonth() + 1, monthArray,
		sd = /(MM).+(DD).+(YYYY)/ig,
		ld = /(MMM|DD|YYYY).+(MMM|DD|YYYY).+(YYYY|MMM|DD)/ig,
		lmd = /(MMMM|DD|YYYY).+(MMMM|DD|YYYY).+(YYYY|MMMM|DD)/ig,
		iso =/(YYYY).+(MM).+(DD)/ig;

		format = format.toUpperCase();
		
		if( month < 10 ) {
			month = '0' + month
		}

		if( date < 10 ) {
			date = '0' + date
		}

		if( lmd.test( format ) ){
			monthArray = [ 
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
			format = format.replace( 'MMMM', monthArray[ month - 1 ] )
			format = format.replace( 'DD', date )
			format = format.replace( 'YYYY', year )
		}
		else if( ld.test( format ) ){
			monthArray=[ 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec' ]
			format = format.replace( 'MMM', monthArray[ month - 1 ] )
			format = format.replace( 'DD', date )
			format = format.replace( 'YYYY', year )
		}
		else if( iso.test( format ) ){
			format = format.replace( 'MM', month )
			format = format.replace( 'DD', date )
			format = format.replace( 'YYYY', year )
		}
		else if( sd.test( format ) ) {
			format = format.replace( 'MM', month )
			format = format.replace( 'DD', date )
			format = format.replace( 'YYYY', year )
		}
		
		return format
	},

	isLeapYear: function( year ) {
		return ( ( year % 4 == 0 ) && ( year % 100 != 0 ) ) || ( year % 400 == 0 );
	},

	getNumber: function(month,year) {
		var daysinmonths = [ 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31 ];
		if( this.isLeapYear.call( this, year ) && month == 1 ) {
			return 29;
		}
		else{
			return daysinmonths[ month ];
		}
	},

	showtoday: function() {
		var curDate = new Date()
		if( curDate.getMonth() != this.getData('viewDate').getMonth() || curDate.getYear() != this.getData('viewDate').getYear() ) {
			this.setData( 'showToday', true )
		}
		else {
			this.setData( 'showToday', false )
		}
	},

	checkDate: function( current ) {
		var start = this.getData( 'ltPropMinDate' ), end = this.getData( 'ltPropMaxDate' ),
		startDate, endDate;
		if( start === '' && end === '' ){
			return true;
		}
		else if( start !== '' && end === '' ) {
			startDate = new Date( start )
			if( current >= startDate ) {
				return true
			}
		}
		else if( start !== '' && end !== '' ) {
			startDate = new Date( start )
			endDate = new Date( end )
			if( current >= startDate && current <= endDate ){
				return true
			}
		}
		else {
			endDate = new Date( end )
			if( current <= endDate ){
				return true
			}
		}

		return false
	},

	numberOfRowsChange: function() {
		// https://stackoverflow.com/questions/19727905/in-javascript-is-it-expensive-to-use-try-catch-blocks-even-if-an-exception-is-n
		// No penalty in chrome >= 60
		var numberOfRows = this.getData( 'ltPropNumberOfRows' )
		try {
			if( numberOfRows < 5 ) {
				throw "Calendar failed to render. The number of rows should be greater than 4.";
			}
		}
		catch( e ) {
			console.error( e );
			return ;
		}

		this.setDatesFunction();
	}.observes( 'ltPropNumberOfRows' ),

	setDates: function() {
		this.setDatesFunction()
	}.observes( 
		'ltPropStartDate', 
		'ltPropEndDate', 
		'changeData', 
		'ltPropMinDate', 
		'ltPropMaxDate',
		'ltPropFormat',
		'ltPropStartWeekDay'
	),

	getNumberOfFirstRowDates: function( firstday ) {
		var startDayOfMonth = this.getData( 'ltPropStartWeekDay' ), firstRowDays;
		if( firstday == 0 ) {
			firstRowDays = startDayOfMonth === 0 ? 7 : startDayOfMonth;
		}
		else {
			if( firstday < startDayOfMonth ) {
				firstRowDays = startDayOfMonth - firstday;
			}
			else {
				firstRowDays = 7 - ( firstday - startDayOfMonth );
			}
		}

		return firstRowDays;

	},

	getNumberToSubtract: function( firstday ) {
		var numberToSubtract, startDayOfMonth = this.getData( 'ltPropStartWeekDay' );

		if( firstday == 0 ){
			numberToSubtract = startDayOfMonth == 0 ? 0 : 7 - startDayOfMonth;
		}
		else {
			if( firstday < startDayOfMonth ){
				numberToSubtract = 7 - ( startDayOfMonth - firstday );
			}
			else {
				numberToSubtract = firstday - startDayOfMonth;
			}
		}

		return numberToSubtract;
	},

	getFirstDay: function( date, day ) {
		var first;

		first = date - Math.floor( date / 7 ) * 7 - 1;
		first = day - first;

		if( first < 0 ){
			first = 7 - first;
		}

		return first;
	},

	getRemainingDays: function( numberOfDaysInMonth, firstRowDays ) {
		var rem = numberOfDaysInMonth - firstRowDays;
		rem = rem - 28;

		return rem;
	},

	inc: function( rem, num ) {
		if( rem > 0 && num == 6 ) {
			return 7; 
		}

		return num;
	},

	setDatesFunction: function() {
		// Number of rows in the table
		var numberOfRows = this.getData( 'ltPropNumberOfRows' ), 
		fillRows = this.getData( 'ltPropFillRows' ), 
		reachedNextMonth = false, 
		result = [],
		cur = this.getData( 'viewDate' ), 
		day = cur.getDay(),
		date = cur.getDate(), 
		firstday =  this.getFirstDay( date, day ),
		month = cur.getMonth(),
		year = cur.getFullYear(),
		numberOfDaysInMonth = this.getNumber( this, month, year ),
		firstRowDays = this.getNumberOfFirstRowDates( firstday ),
		rem = this.getRemainingDays( numberOfDaysInMonth, firstRowDays );


		numberOfRows = this.inc( rem, numberOfRows );

		var calStartDate = new Date( month + 1 + '/1/' + year ), 
		numberToSubtract = this.getNumberToSubtract( firstday );

		calStartDate.setDate( calStartDate.getDate() -  numberToSubtract );
		
		var todayDate = new Date();

		// Construct array
		for( var i = 0; i < numberOfRows; i++ ) {

			// This is to ensure that we don't create an empty row when we reach the next month when fillRows is false.
			if(reachedNextMonth) {
				break;
			}

			result.push( [] );
			for( var j = 0; j < 7; j++ ) {
				if( !fillRows && month !== calStartDate.getMonth() ) {
					result[i].push( { emptyBlock: true } );
					calStartDate.setDate( calStartDate.getDate() + 1 );
					if( i != 0 ) {
						reachedNextMonth = true
					}

					continue;
				}

				var clsname = 'lyteCalCdate', newMonth = calStartDate.getMonth(),
				curDate = new Date( this.getData( 'viewDate' ).getTime() ),
				curMonth = curDate.getMonth(),
				ndate = calStartDate.getDate(),
				tdate = this.getData( 'ltPropCurrentDate' ) ? new Date( this.getData( 'ltPropCurrentDate' ) ) : 'nodate',
				nyear = calStartDate.getYear(),
				isInRange = this.checkDate( calStartDate ),
				isPresent = this.getData( 'ltPropMinDate' ) !== "" || this.getData( 'ltPropMaxDate' ) !== "";

				if( curMonth !== newMonth ) {
					if( isPresent && !isInRange || ( !isPresent ) ) {
						clsname += ' lyteCalGray';
					}		
				}
				else if( isPresent 
					&& !isInRange ) {
					clsname += ' lyteCalGray'
				}

				if( tdate !== 'nodate' && newMonth == tdate.getMonth() && tdate.getDate() == ndate && tdate.getYear() == nyear && this.getData( 'selectDate' ) ) {
					clsname += ' lyteCalSel'
				}

				if( todayDate.getMonth() === newMonth && todayDate.getDate() === ndate && todayDate.getYear() === nyear && this.getData( 'selectDate' ) ) {
					clsname += ' lyteCalToday'
				}

				// Add Classes for weekends
				if( calStartDate.getDay() == 0 || calStartDate.getDay() == 6 ) {
					clsname += ' lyteCalWeekend'
				}

				// Store in array and increment date by 1
				clsname += ' lyteCalTableCell';
				var obj = {};
				obj.date = calStartDate.getDate();
				obj.clsname = clsname;
				obj.val = this.getDateFromFormat.call( this, calStartDate, this.getData( 'ltPropFormat' ) );
				result[ i ].push( obj );
				// Lyte.arrayUtils( this.getData( 'matrix' )[ i ], 'push', obj )
				calStartDate.setDate( calStartDate.getDate() + 1 );
			}

		}

		this.setData( 'matrix', result );

	},

	executeViewDateChanges : function() {
		if( this.getMethods( 'onViewdateChange' ) ){
			this.executeMethod( 'onViewdateChange', this, this.getData( 'viewDate' ) );
		}
	}.observes( 'viewDate' ),

	initFn: function() {
		var viewDate = this.getData( 'ltPropCurrentDate' ) ? new Date( this.getData( 'ltPropCurrentDate' ) ) : new Date(),
		self = this;

		this.changeDaysOfWeek();
		viewDate.setDate( 1 )
		this.setData( 'viewDate', viewDate )
		this.setData( 'monthHeader', this.getMonthHeader.call( this ) )
		this.setDatesFunction()
		this.showtoday.call( this )

		// set revert
		this.$node.revertToToday = function() {
			self.revert();
		};
	}.observes( 'currentDatechanged' ).on( 'init' ),

	didConnect : function(){
		if(!this.getData('navYield') && this.getData('ltPropHeaderType') == "dropdown"){
			this.setData('monthDD',this.$node.querySelector('.lyteCalMonthDD'));
			this.setData('yearDD',this.$node.querySelector('.lyteCalYearDD'));
			this.getData('yearDD').component.setData('ltPropOptions',this.getData('years'));
			this.setData('callFrmDidcnct',true);
		}
	},

	removeClass: function() {
		var node = this.$node.querySelector( '.lyteCalSel' );

		if( node ) {
			node.classList.remove( 'lyteCalSel' );
		}
	},

	changeViewDate: function( val ) {
		var cur = this.getData( 'ltPropCurrentDate' );

		if( this.getData( 'preventObs' ) ) {
			return ;
		}

		// Current Date is set to empty
		if( !cur ) {
			this.removeClass();
			return ;
		}

		// Bad current date
		if( ( new Date( cur ) ).toString() === 'Invalid Date' ) {
			return ;
		}

		var val = this.getData( 'ltPropCurrentDate' );
		var newDate = new Date( val );
		newDate.setDate( 1 );
		this.setData( 'viewDate', newDate );
		this.setData( 'monthHeader', this.getMonthHeader.call( this ) );
		this.setDatesFunction();
		this.showtoday.call( this )
	}.observes( 'ltPropCurrentDate' ),

	monthHeaderFormatObserver: function() {
		this.setData( 'monthHeader', this.getMonthHeader.call( this ) );
	}.observes( 'ltPropMonthHeaderFormat' ),

	changeCurrentDate: function( set, val ) {
		var inter, to, from = new Date( this.getData( 'viewDate' ).getTime() ), fromDate, toDate;
		if( set === 'Y' ) {
			inter = this.getData( 'viewDate' )
			inter.setYear( 1900 + inter.getYear() + val )
			to = new Date( inter.getTime() )
			this.setData( 'viewDate', inter )
			this.setData( 'monthHeader', this.getMonthHeader.call( this ) )
			this.setData( 'changeData', this.getData( 'changeData' ) + 1 )
			this.showtoday.call( this )
		}
		else if( set === 'M' ) {
			inter = this.getData( 'viewDate' )
			inter.setMonth( inter.getMonth() + val )
			to = new Date( inter.getTime() )
			this.setData( 'viewDate', inter )
			this.setData( 'monthHeader', this.getMonthHeader.call( this ) )
			this.setData( 'changeData', this.getData( 'changeData' ) + 1 )
			this.showtoday.call( this )
		}

		fromDate = this.getDateFromFormat( from, this.getData( 'ltPropFormat' ) );
		toDate = this.getDateFromFormat( to, this.getData( 'ltPropFormat' ) );
		if( this.getMethods( 'onNavigate' ) ) {
			this.executeMethod( 'onNavigate', event, fromDate, toDate, this )
		}
	},

	/** 
	 * Get the proper calendar date item that was clicked
	 * @param {Element} elem - represents the element that was clickedd
	 *
	 */
	getProper: function( elem ) {
		while( elem 
			&& !elem.classList.contains( 'lyteCalTableCell' ) 
		) {
			elem = elem.parentElement;
		}

		return elem;
	},

	actions: {
		previous: function( val ) {
			this.changeCurrentDate( val, -1 );
		},

		next: function( val ) {
			this.changeCurrentDate( val, 1 );
		},

		dateSelected: function( event ) {
			var target = this.getProper( event.target ), ele;
			if( event.button !== 0 ) {
				return ;
			}

			ele = this.$node.getElementsByClassName( 'lyteCalSel' )
			if( ele.length !== 0 ){
				ele[0].classList.remove( 'lyteCalSel' )
			}

			this.setData( 'preventObs', true )
			this.setData( 'ltPropCurrentDate', target.getAttribute( 'data-date' ) )
			this.setData( 'preventObs', false )
			target.classList.add( 'lyteCalSel' )
			if( this.getMethods( 'onDateSelected' ) ){
				this.executeMethod( 'onDateSelected', event, target.getAttribute( 'data-date' ), this )
			}
		},

		today: function( event ) {
			this.revert( event );
		}

	},

	methods : {
		optionSelected : function(prop,event,selected,comp){
			if(prop == 'M'){
				var index = comp.getData('ltPropOptions').indexOf(selected);
				this.changeCurrentDate(prop, index - this.getData('viewDate').getMonth());
			}
			else if(prop == 'Y'){
				this.changeCurrentDate(prop, parseInt(selected) - this.getData('viewDate').getFullYear());
			}
		}
	}
});
