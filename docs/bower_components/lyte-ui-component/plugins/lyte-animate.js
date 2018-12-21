(function(window){

	function getDefaultDisplay( elem ) {
		if( !elem.lyteAnimateId ) {
			AniData.add( elem );
		}
		var nodeName = elem.nodeName, display = elData.get( elem, 'displayValue' );

		if ( display ) {
			return display;
		}

		temp = elem.ownerDocument.body.appendChild( elem.ownerDocument.createElement( nodeName ) );
		display = temp.ownerDocument.defaultView.getComputedStyle( temp ).display;
		elem.ownerDocument.body.removeChild( temp );

		if ( display === "none" ) {
			display = "block";
		}
		elData.set( elem, 'displayValue', display );
		return display;
	}

	function generateDummyProps ( prop, flag ) {
		var dummy = {};
		var arr = [ 'left', 'right', 'top', 'bottom' ];
		for( var i = 0; i < arr.length; i++ ){
			dummy[ 'margin-' + arr[ i ] ] = dummy[ 'padding-' + arr[ i ] ] = prop;
		}
		if( flag ){
			dummy.width = dummy.height = dummy.opacity = prop;
		}
		return dummy;
	}

	function showhide( elems, flag ) {
		var disps = []
		for( var i = 0; i < elems.length; i++ ) {
			var el = elems[ i ];
			AniData.add( el );
			var actDisp = el.style.display;
			if( flag ) {
				if( actDisp == 'none' ) {
					disps[ i ] = null || elData.get( el,'display' )
					if( !disps[ i ] ) {
						disps[ i ] = "";
					}
				}
				if( actDisp == "" && $L( el ).css( 'display' ) == "none" ) {
					disps[ i ] = getDefaultDisplay( el );
				}
			}else if( actDisp != 'none' ) {
				disps[ i ] = 'none';
				elData.set( el,'display', actDisp );
			}
		}
		for( var j = 0; j < elems.length; j++ ) {
			$L( elems[ j ] ).css( 'display', disps[ j ] )
		}
		return elems;
	}

	function show() {
		return showhide( [ this ], true );
	}

	function hide() {
		return showhide( [ this ] );
	}

	function toggle( arg ) {
		if( arg.constructor == Boolean ) {
			return showhide( [ this ], arg )
		}

		return $L.each( this, function() {
			toggle( $L( this ).css( 'display' ) != 'none' ) 
		})
	}

	function camelCase (string){
	 return string.replace(/(-\w)/g, function (m) {
            return m[1].toUpperCase();
        });
	}

	function dasherize(string){
		return string.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
	}

	function AnimationData(){
		this.data = {};
	}

	function animationEnd(evt){
		if(evt.target == this){
			elData.get(this, 'endCallback').call(this, evt);
		}
	}

	AnimationData.prototype = {
		add : function(elem){
			if('lyteAnimateId' in elem){
				return elem.lyteAnimateId;
			}
			var randomId = 'lyteAnimate' + parseInt(Math.random() * Math.pow(10,6));
			elem.lyteAnimateId = randomId;
			this.data[randomId] = [];
			elem[elem.lyteAnimateId] = {}
			return randomId;
		},
		queue : function(elems, options, value){
			for(var i = 0; i < elems.length; i++){
				var el = elems[i];
				var id  = el.lyteAnimateId
				if(!id){
						id = this.add(el);
					}
				this.data[id].push({elem : el, options : options, value : value, properties : Object.keys(value)});
				if(this.data[id].length == 1){
					el.addEventListener('transitionend', animationEnd);
					this.next(el);	
				}
			}
		},
		dequeue : function(elem){
		 	this.data[elem.lyteAnimateId].splice(0, 1);
			this.next(elem);
		},
		dequeueAll : function(elem){
			this.data[elem.lyteAnimateId] = this.data[elem.lyteAnimateId].splice();
			this.next(elem);
		},
		next : function(elems){
			setTimeout(this.call.bind(this), 13, elems);
		},
		call : function(elem){
			if(elem.lyteAnimateId && this.data[elem.lyteAnimateId][0]){
					lyteAnimation.call(elem);
			}else{
				this.data[elem.lyteAnimateId] = [];
				elem.removeEventListener('transitionend', animationEnd);
			}	
		}
	}

	function ElementData(){
	}

	ElementData.prototype = {
		set :  function(){
			if(arguments.length < 3){
				return;
			}
			if(arguments.length == 3){
				if(arguments[0][arguments[0].lyteAnimateId] == undefined){
					arguments[0][arguments[0].lyteAnimateId] = {};
				}
				arguments[0][arguments[0].lyteAnimateId][arguments[1]] = arguments[2];
			}
			else if(arguments.length == 4){
				if(arguments[0][arguments[0].lyteAnimateId][arguments[1]] == undefined){
					arguments[0][arguments[0].lyteAnimateId][arguments[1]] = {};
				}
				arguments[0][arguments[0].lyteAnimateId][arguments[1]][arguments[2]] = arguments[3]
			}

		},
		get : function(){
			if(arguments.length < 1){
				return;
			}
			if(arguments.length == 1){
				return arguments[0][arguments[0].lyteAnimateId];
			}
			else if(arguments.length == 2){
				return arguments[0][arguments[0].lyteAnimateId][arguments[1]];
			}
			else if(arguments.length == 3){
				if(arguments[0][arguments[0].lyteAnimateId][arguments[1]]){
					return arguments[0][arguments[0].lyteAnimateId][arguments[1]][arguments[2]];
				}	
			}
			return;
		}
	}

	function checkCrctValue(value, key, camelCaseKey, compStyle){
		var valueCopy = value[key].toString();
		if(/^(\()/g.exec(valueCopy)){
			return valueCopy;
		}
		var operatorRegex = /^\+=|\-=|\*=|\/=/g, unitRegex = /cm|mm|in|px|pt|pc|em|ex|ch|rem|vw|vh|auto|vmin|vmax|%+$/ig, unit = valueCopy.match(unitRegex), finalVal = valueCopy.match(operatorRegex);
		if(compStyle[camelCaseKey] != "none" && !/matrix/ig.test(compStyle[camelCaseKey])){
			if(unit == null){
				var newUnit = compStyle[camelCaseKey].match(unitRegex);
				if(newUnit == null){
					unit = "";
				}else{
					if(newUnit[0] == 'auto'){
						unit = 'px';
					}else{
						unit = newUnit[0]
					}
				}
			}else{
				unit = unit[0];
				valueCopy = valueCopy.slice(0, valueCopy.indexOf(unit));
			}
		}else{
			unit = "";
		}
		if(finalVal){
			var temp = parseInt(compStyle[camelCaseKey]), split = valueCopy.split("=");
			temp = temp == NaN ? 0 : temp;
			switch(split[0]){
				case '/' : 
					valueCopy = temp  / parseFloat(split[1]);
					break;
				case '-' : 
					valueCopy = temp  - parseFloat(split[1]);
					break;
				case '*' : 
					valueCopy = temp  * parseFloat(split[1]);
					break;
				default : 
					valueCopy = temp  + parseFloat(split[1]);
			}
		}
		return [valueCopy + unit, unit];

	}

	function findAnimeProperties (){
			var newObj = {}, units = {};
			AniData.add(this);
			// style need to be calculated
			var compStyle = this.ownerDocument.defaultView.getComputedStyle(this);
			var hidden = compStyle.display == 'none';
			if(!hidden && !this.offsetParent){
				AniData.dequeue(this);
				return;
			}
			var value  =  AniData.data[this.lyteAnimateId][0].value;
			var keys = Object.keys(value), val, animeProp = [], from = {};
			for(var i = 0; i < keys.length; i++){
				var kk = camelCase(keys[i]);
				val = null;
				if(['show', 'hide', 'toggle'].indexOf(value[keys[i]]) != -1){
					if(value[keys[i]] == 'hide' || !hidden && value[keys[i]] == 'toggle'){
						val = 'hide';
					}
					else if(value[keys[i]] == 'show'){
						val = 'show';
					}
				}
				if(val == 'show' && !hidden || hidden && val == 'hide'){
					delete elData.get(this, 'animeProp', 'animate')[kk];
					continue;
				}
				if(animeProp.indexOf(kk) == -1){
					animeProp.push(kk);
				}
				if(/^(?:toggle|show|hide)$/.test(value[keys[i]])){
					var originalData = elData.get(this, 'animeProp', 'original');
					if(originalData == undefined){
						elData.set(this, 'animeProp', 'original', {})
						originalData = elData.get(this, 'animeProp', 'original');
					}
					if(hidden){
						var ori = originalData[kk];
						if(ori == undefined){
							if(compStyle[kk] == 0 || compStyle[kk] == "0" || compStyle[kk] == "0px"){
 						     	continue;
 							}
							newObj[kk] = compStyle[kk]
						}
						else{
							newObj[kk] = ori;
						}
					}
					else{
						if(compStyle[kk] != 0 && compStyle[kk] != "0" && compStyle[kk] != "0px"){
							originalData[kk] = this.style[kk];
							newObj[kk] = 0;
						}
					}
					var ret = checkCrctValue.call(this, value, keys[i], kk, compStyle);
					units[kk] = ret[1];
				}
				else if(!hidden){
					var ret = checkCrctValue.call(this, value, keys[i], kk, compStyle);
					newObj[kk] = ret[0];
					units[kk] = ret[1];
				}else{
					animeProp.pop();
				}
				if(newObj[kk]){
					if((compStyle[kk] == newObj[kk] || parseFloat(compStyle[kk]) == newObj[kk] || newObj[kk] == this.style[kk]) && !hidden){
						delete newObj[kk]; delete units[kk];
						animeProp.pop();
					}
				}
			}
			
			if(animeProp.length){
				for(var x = 0; x < animeProp.length; x++){
					if(hidden){
						$L(this).css(animeProp[x], 0);
						from[animeProp[x]] = 0;
					}else{
						from[animeProp[x]] = compStyle[animeProp[x]];
					}
				}
				if(hidden){
					show.call(this);
				} 
			}
			
			elData.set(this, 'animeProp', 'animate', newObj);
			elData.set(this, 'animeProp', 'unit', units);
			elData.set(this, 'animeProp', 'mode', val);
			elData.set(this, 'animeProp', 'from', from);
	}

	function constructCss(){
		var opts = AniData.data[this.lyteAnimateId][0].options;
		var defaultOpts = ['timingFunction', 'duration', 'delay'], constyle="";
		var value  =  Object.keys(AniData.data[this.lyteAnimateId][0].value || {});
		for(var i = 0; i < defaultOpts.length; i++){
			if(defaultOpts[i] in opts){
				var sec = '';
				if(defaultOpts[i] == 'delay' || defaultOpts[i] == 'duration'){
					if(!/[ms|s]+/ig.test(opts[defaultOpts[i]])){
						sec = 'ms'
					}
				}
				constyle += 'transition-' + dasherize(defaultOpts[i]) + ':' + opts [defaultOpts[i]] + sec + ";";
 			}
		}
		if(value.length)
			{
				constyle += 'transition-property : ';
				for(var j = 0; j < value.length; j++){
					constyle += j > 0 ? ','+ dasherize(value[j]) : dasherize(value[j]);
				}
			}
		return constyle += ";";
	}

	function removeStyle(){
		this.style.removeProperty('transition');
	}

	function lyteAnimation () {
		findAnimeProperties.call(this);
		if( Object.keys(elData.get(this, 'animeProp', 'animate') || {}).length)
			{
				removeStyle.call(this);
				$L(this).css('transition', "");
				var newstyle = constructCss.call(this);
				elData.set(this, 'endCallback', function(evt){				
					evt.stopPropagation();
					var props = Object.keys(elData.get(this, 'animeProp', 'animate'))
					var opt = AniData.data[this.lyteAnimateId][0].options.complete;
					var propLength = elData.get(this, 'propertyCount');
					elData.set(this, 'propertyCount', ++propLength);
					if(props.length == propLength)
						{
							removeStyle.call(this);
							var mode = elData.get(this, 'animeProp', 'mode');
							if(mode){
								if(mode == 'hide'){
									  setTimeout(function(){
									  	hide.call(this);
									  	AniData.dequeue(this);
									  }.bind(this), 20);
									}
								else{
									var original = elData.get(this, 'animeProp', 'original');
									$L.each(elData.get(this, 'animeProp', 'animate'), function(prop, val){
										if(!original[prop]){
											$L(this).css(prop, "");
										}
									});
									AniData.dequeue(this);
								}
							}else{	
								AniData.dequeue(this);
							}
							if(opt){
								var aniProp = elData.get(this, 'animeProp');
								evt.transitionProperty = props;
								evt.startTime = aniProp.startTime;
								evt.from = aniProp.from;
								evt.to = aniProp.animate;
								opt.call(this, evt);
							}
						}
					var mode = elData.get(this, 'animeProp', 'mode');
				});
				var sty = $L(this).attr('style');
				$L(this).attr('style', (sty ? sty : "") + newstyle)
				elData.set(this, 'propertyCount', 0);
				var value  =  Object.keys(AniData.data[this.lyteAnimateId][0].value || {});
				var elem = this;
				$L.each(elData.get(this, 'animeProp', 'animate'), function(prop, val){
					$L(elem).css(prop, $L(elem).css(prop))
				})
				setTimeout(dummy.bind(this), 15);
			}
		else{
			AniData.dequeue(this);
		}		

	}

	function dummy(){
				var anidata = AniData.data[this.lyteAnimateId][0];
				if(anidata){
					var options = anidata.options;
					var currTime = Date.now();
					elData.set(this, 'animeProp', 'startTime', currTime);
					var aniProp = elData.get(this, 'animeProp');
					if(options.start){
						options.start.call(this, {options : options, from : aniProp.from, to : aniProp.animate, value : AniData.data[this.lyteAnimateId][0].value, startTime : currTime, target : this, transitionProperty : Object.keys(aniProp.animate)});
					}
					var elem = this;
					$L.each(elData.get(this, 'animeProp', 'animate'), function(prop, val){
							$L(elem).css(prop, val);
					})
				}else{
					removeStyle.call(this);
					this.removeEventListener('transitionend', animationEnd);
				}
	}

	var elData = new ElementData();
	var AniData = new AnimationData();

	function getCorrectOption (duration, ease, callbacks){
		var obj = {};
		if(callbacks){
			if(callbacks.constructor == Function){
				obj.complete = callbacks;
			}
		}
		if(ease){
			if(ease.constructor == Function){
				obj.complete = ease;
			}
			else if(ease.constructor == Object){
				Object.assign(obj, ease);
			}
			else if(ease.constructor == String){
				obj.timingFunction = ease;
			}
		}
		if(duration){
			if(duration.constructor == Object){
				Object.assign(obj, duration);
			}
			else if(duration.constructor == Number){
				obj.duration = duration
			}
			else if(duration.constructor == Function){
				obj.complete = duration
			}
		}
		if(obj.delay){
			if(/[s]+/ig.test(obj.delay)){
				options.delay = parseInt(options.delay) * 1000;
			}
		}
		if(!('duration' in obj)){
			obj.duration = 400;
		}
		if(/[s]+/ig.test(obj.duration)){
				options.duration = parseInt(options.duration) * 1000;
			}
		if(!obj.timingFunction){
			obj.timingFunction = "ease";
		}	
		return obj;
	}

	function replaceStyle( props, from, percent ) {
		$L(this).css(props, this.style[props].replace(/([0-9.-]+)/, function(arg){
			return ((parseInt(arg) - from) * percent + from);
		}))
	}

	function stopAnimation(jumpToEnd, clearQueue){
		if(jumpToEnd){
			var propLength = elData.get(this, 'propertyCount');
			elData.set(this, 'propertyCount', Object.keys(elData.get(this, 'animeProp', 'animate') || {}).length - 1);
			this.dispatchEvent(new Event('transitionend'));
			if(clearQueue){
				AniData.dequeueAll(this);
			}
		}else{
			var options = AniData.data[this.lyteAnimateId][0].options, animate = elData.get(this, 'animeProp');
			var currTime = Date.now(), val, from = animate.from, to = animate.animate;
			var startTime = animate.startTime;
			var remain = Math.max(0, startTime + options.duration - currTime);
			var percent = 1 - (remain / options.duration);
			var props = Object.keys(animate.animate || {});
			for(var i = 0; i < props.length; i++){
				var from = parseInt(from[props[i]]);
				from = isNaN(from) ? 0 : from;
				replaceStyle.call( this, props[ i ], from, percent )
			}
			$L(this).css('transition', '');
			if(clearQueue){
				AniData.dequeueAll(this);
			}else{
				AniData.dequeue(this);
			}
		}
	}

	if(lyteNode){
		lyteNode.prototype.animate = function(){
			if(arguments.length)
				{
					var opts = getCorrectOption(arguments[1], arguments[2], arguments[3]);
					AniData.queue(this, opts, arguments[0]);
				}
			return this;
		}

		lyteNode.prototype.fadeTo = function( value, duration, ease, callback){
			if( duration && duration.constructor == Number ){
				if( duration < 1 ){
					var temp = duration;
					duration = value;
					value = temp;
				}
			}
			value = value || 0;
			var opts = getCorrectOption(duration, ease, callback);
			AniData.queue(this, opts, value.constructor == Object ? value :  {opacity : value});
			return this;
		}

		$L.each({
				fadeIn : { opacity : 'show'}, 
				fadeOut : { opacity : 'hide' }, 
				fadeToggle : { opacity : 'toggle'},
				slideUp : { height : 'hide'},
				slideDown : {height : 'show'},
				slideToggle :  { height : 'toggle'}
			}, function(property, value){
				lyteNode.prototype[property] = function(duration, ease, callback){
				   return this.animate(value, duration, ease, callback);
				}
		})

		lyteNode.prototype.stop = function(clearQueue, jumpToEnd){
			$L.each(this, function(){
				stopAnimation.call(this, jumpToEnd, clearQueue);
			})
		}

		lyteNode.prototype.finish = function(){
			$L.each(this, function(){
				var queues = AniData.data[this.lyteAnimateId];
				if(queues.length)
					{
						for(var i = 1; i < queues.length; i++){
							queues[i].options.duration = 1;
						}
						stopAnimation.call(this, true, false);
					}
			})
		}

		$L.each({
				show : generateDummyProps('show', true), 
				hide : generateDummyProps('hide', true), 
				toggle : generateDummyProps('toggle', true)
			}, function(property, value){
				lyteNode.prototype[property] = function(duration, ease, callback){
				   if(duration && duration.constructor != Boolean){
						return this.animate(value, duration, ease, callback);
					}
				   return $L.each(this, function(){
						toggle.call(this, $L(this).css('display') == 'none');
					})
				}
		})
		
	}

})(window);