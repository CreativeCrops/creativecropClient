LyteColorbox = {
	_boxElement : 'lyteCBoxElement',
	_box : null,
	_content : null,
	_overlay : null,
	_title : null,
	_close : null,
	_download : null,
	_next : null,
	_prev : null,
	_open : null,
	_active : null,
	_closing : null,
	_previousOffset : {},
	_first : true,
	_photo : null,
	_related : null,
	_el : null,
	_photoRegex : /\.(gif|png|jp(e|g|eg)|bmp|ico|webp|jxr|svg)((#|\?).*)?$/i,
	_index : 0,
	_zoom : false,
	_component : null,
	_init : null,
	_winheight : null,
	_winWidth : null,
	_isArray : false,
	_hrefArray : [],
	_titleArray : [],

	setSize : function(size, dimension, param) {
		if(/%/.test(size)){
			return parseInt(size);
		}
		else{
			return Math.round((dimension === 'x' ? (isNaN(size/param) ? 0 : size/param) : (isNaN(size/param) ? 0 : size/param)) * 100);
		}
		// return Math.round((/%/.test(size) ? ((dimension === 'x' ? $window.width() : winheight()) / 100) : 1) * parseInt(size, 10));
	},

	createElement : function(tagName,id,className){
		var element = document.createElement(tagName);
		if (id) {
			element.id = id;
		}
		if (className) {
			$L(element).addClass(className);
		}
		return element;
	},

	getSelector : function(compSelectors,elemClasses){
		for(var i = 0; i<compSelectors.length; i++){
			if(elemClasses.indexOf(compSelectors[i]) != -1){
				return compSelectors[i];
			}
		}
		return false;
	},

	getIndex : function(increment) {
		var max = LyteColorbox._related.length,
		newIndex = (LyteColorbox._index + increment) % max;

		return (newIndex < 0) ? max + newIndex : newIndex;
	},

	isImage : function(url) {
		return LyteColorbox._photo || LyteColorbox._photoRegex.test(url);
	},

	createName : function(param){
		return param.replace(/[ ,-]/g,"_");
	},

	getRelated : function(rel) {
		LyteColorbox._index = 0;
		LyteColorbox._related = [];
		if (rel && rel !== false && rel !== 'nofollow') {
			var elements = Array.from(document.querySelectorAll('.' + LyteColorbox._boxElement)).filter(function (node) {
				return (LyteColorbox.getSelector(LyteColorbox._component.getData('ltPropSelectors'),Array.from(node.classList)) === rel);
			});
			for(var i = 0;i<elements.length;i++){
				var obj = Object.assign({},elements[i].dataset);
				obj.classList = elements[i].classList ? elements[i].classList : [rel];
				LyteColorbox._related.push(obj);
			}
			LyteColorbox._index = LyteColorbox._related.findIndex( function(obj) { return obj.lytecboxHref == LyteColorbox._el.lytecboxHref && obj.lytecboxTitle == LyteColorbox._el.lytecboxTitle});

			// Check direct calls to Colorbox.
			if (LyteColorbox._index === -1) {
				LyteColorbox._related = LyteColorbox._related.push(LyteColorbox._el);
				LyteColorbox._index = LyteColorbox._related.length - 1;
			}
		} else {
			LyteColorbox._related = LyteColorbox._el;
		}
	},

	appendHTML : function() {
		if (!LyteColorbox._box) {
			LyteColorbox._init = false;
			var comp = LyteColorbox._component;
			// debugger
			LyteColorbox._content = comp.$node.querySelector('.lyteCBoxContent');
			LyteColorbox._overlay = comp.$node.querySelector('.lyteCBoxOverlay');
			LyteColorbox._title = comp.$node.querySelector('.lyteCBoxTitle');
			LyteColorbox._close = comp.$node.querySelector('.lyteCBoxClose');
			LyteColorbox._download = comp.$node.querySelector('.lyteCBoxDownload');
			LyteColorbox._next = comp.$node.querySelector('.lyteCBoxNext');
			LyteColorbox._prev = comp.$node.querySelector('.lyteCBoxPrevious');
			LyteColorbox._box = comp.$node.querySelector('.lyteCBox') ? comp.$node.querySelector('.lyteCBox') : false;
			if(!LyteColorbox._box){
				LyteColorbox._box = LyteColorbox.createElement('div',null,'lyteCBox');
				var children = comp.$node.querySelector('lyte-yield').children;
				while(children.length > 0){
					LyteComponent.appendChild(LyteColorbox._box,children[0]);
				}
				LyteColorbox._box.classList.add('lyteColorbox');
			}
		}
		if (document.body && ((LyteColorbox._box.parentElement && LyteColorbox._box.parentElement.tagName != "BODY") || !LyteColorbox._box.parentElement) ) {
			LyteComponent.appendChild(document.body,LyteColorbox._box);
		}
	},

	launch : function(element) {
		if (!LyteColorbox._closing) {
			LyteColorbox._el = element;
			LyteColorbox.getRelated(LyteColorbox.getSelector(LyteColorbox._component.getData('ltPropSelectors'),Array.from(element.classList)));
			// LyteColorbox._component.setData('ltPropGroup',LyteColorbox._related);
			var returnVal = LyteColorbox._component.callOnBeforeOpen(LyteColorbox._related) == false ? false : true;
			if(!returnVal){
				LyteColorbox._related = null;
				LyteColorbox._el - null;
				return;
			}
			// LyteColorbox._related = LyteColorbox._component.getData('ltPropGroup');
			LyteColorbox._index = LyteColorbox._related instanceof Array ? LyteColorbox._related.findIndex( function(obj) { return obj.lytecboxHref == LyteColorbox._el.lytecboxHref && obj.lytecboxTitle == LyteColorbox._el.lytecboxTitle}) : 0;
			if(!LyteColorbox._component.getData('ltPropYield')){
				if(LyteColorbox._related.length > 1){
					LyteColorbox._next.classList.remove('lyteColorboxHideVisibility');
					LyteColorbox._prev.classList.remove('lyteColorboxHideVisibility');
				}
				else{
					LyteColorbox._next.classList.add('lyteColorboxHideVisibility');
					LyteColorbox._prev.classList.add('lyteColorboxHideVisibility');
				}
			}

			if (!LyteColorbox._open) {

				LyteColorbox._open = LyteColorbox._active = true; // Prevents the page-change action from queuing up if the visitor holds down the left or right keys.

				// setClass(settings.get('className'));
				LyteColorbox._box.classList.add('lyteColorboxHideVisibility','lyteColorboxDisplay');
				LyteColorbox.computeOffsetImpl();
				if(document.querySelector('.lyteCBoxPhoto')){
					document.querySelector('.lyteCBoxPhoto').remove();
				}
				LyteColorbox._box.classList.remove('lyteColorboxHideVisibility');
				LyteColorbox._component.callOnOpen();
				setTimeout(function(){
					LyteColorbox.load(element);
				},100)
				
			}
			else{
				LyteColorbox.load(element);
			}

			
		}
	},

	load : function(element){

		LyteColorbox._active = true;
		LyteColorbox._photo = false;
		
		href = element.lytecboxHref;
		title = element.lytecboxTitle;
		LyteColorbox._title.textContent = title;
		if(LyteColorbox.isImage(href)){
			LyteColorbox._photo = new Image();
			LyteColorbox._photo.classList.add("lyteCBoxPhoto","lyteCBoxPhotoZoomIn");
			LyteColorbox._photo.src = href;
			LyteColorbox._photo.alt = LyteColorbox._component.getData('ltPropImgError');
			
			LyteColorbox._photo.onload = function(){
				// debugger
				LyteColorbox.computeOffsetImpl(null,LyteColorbox._photo);
				LyteColorbox._component.callOnLoad(LyteColorbox._photo);
			};

		}

	},

	calculateOverlayHeight : function(winheight){
		if(!LyteColorbox._component.getData('ltPropYield')){
			LyteColorbox._overlay.style.height = winheight - 50 + "px";
		}
		else{
			LyteColorbox._overlay.style.height = LyteColorbox._overlay.getBoundingClientRect().height + "px";
		}
	},

	computeOffsetImpl : function(event,photo){
		if(LyteColorbox._open){
			var winWidth = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
	    	var winheight = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
	    	if(!LyteColorbox._component.getData('ltPropYield')){
				LyteColorbox.calculateOverlayHeight(winheight);
			}
			var offset = {};
			if(!LyteColorbox._first){
				window.removeEventListener('resize',LyteColorbox.computeOffsetImpl);
			}
			LyteColorbox._first = false;
	    	var overlayOffset = LyteColorbox._overlay.getBoundingClientRect();
			if(photo){
				LyteColorbox._content.style.overflow = 'hidden';
				if(LyteColorbox._component.getData('ltPropHeight')){
					offset.conHeight = parseInt(LyteColorbox._component.getData('ltPropHeight'));
				}
				else{
					if(photo.height >= overlayOffset.height){
						offset.conHeight = overlayOffset.height;
					}
					else{
						offset.conHeight = photo.height;
					}
				}
				if(LyteColorbox._component.getData('ltPropWidth')){
					offset.conWidth = parseInt(LyteColorbox._component.getData('ltPropWidth'));
				}
				else{
					if(photo.width >= overlayOffset.width){
						offset.conWidth = overlayOffset.width;
					}
					else{
						offset.conWidth = photo.width;
					}
				}

				LyteColorbox._content.style.height = LyteColorbox.setSize(offset.conHeight,'y',winheight) + "%";
				LyteColorbox._content.style.width = LyteColorbox.setSize(offset.conWidth,'x',winWidth) + "%";
				photo.style.height = "100%";
				photo.style.width = "100%";
				if(!LyteColorbox._component.getData('ltPropYield')){
					if(document.querySelector('.lyteColorboxLoadingImg').style.display != "none"){
						document.querySelector('.lyteColorboxLoadingImg').style.display = "none";
					}
				}
				
				LyteColorbox._content.append(photo);
				LyteColorbox._active = false;

			}
			if(!LyteColorbox._component.getData('ltPropYield')){
				offset.top = (winheight - LyteColorbox._content.getBoundingClientRect().height) / 2 ;
				offset.left = (winWidth - LyteColorbox._content.getBoundingClientRect().width) / 2;
				offset.iconTop = ((winheight - LyteColorbox._next.getBoundingClientRect().height) / 2 ) + (document.querySelector('.lyteColorboxHeader').getBoundingClientRect().height / 2);
				LyteColorbox._content.style.top = offset.top + (document.querySelector('.lyteColorboxHeader').getBoundingClientRect().height / 2) + "px";
				LyteColorbox._content.style.left = offset.left + "px";
				LyteColorbox._next.style.top = offset.iconTop + "px";
				LyteColorbox._next.style.left = winWidth - LyteColorbox._next.getBoundingClientRect().width + "px";
				LyteColorbox._prev.style.top = offset.iconTop + "px";
				LyteColorbox._prev.style.left = "0px";
			}
			else{
				var contentOffset = LyteColorbox._content.getBoundingClientRect();
				var overlayOffset = LyteColorbox._overlay ? LyteColorbox._overlay.getBoundingClientRect() : {height : winheight, width : winWidth};
				LyteColorbox._content.style.top = (overlayOffset.height - contentOffset.height) / 2 + "px";
				LyteColorbox._content.style.left = (overlayOffset.width - contentOffset.width) / 2 + "px";
				if(window.getComputedStyle(LyteColorbox._content).transform){
					LyteColorbox._content.style.transform = "none";
				}
			}
			
			window.addEventListener('resize',LyteColorbox.computeOffsetImpl);
		}
	},
	// Navigates to the next page/image in a set.
	next : function () {
		if (!LyteColorbox._active && LyteColorbox._related[1] && (LyteColorbox._component.getData('ltPropLoop') || LyteColorbox._related[LyteColorbox._index + 1])) {
			if(LyteColorbox._zoom){
				LyteColorbox._zoom = false;
				document.querySelector('.lyteCBoxPhoto').classList.remove('lyteCBoxPhotoZoomOut');
				document.querySelector('.lyteCBoxPhoto').classList.add('lyteCBoxPhotoZoomIn');
			}
			document.querySelector('.lyteCBoxPhoto').remove();
			LyteColorbox._index = LyteColorbox.getIndex(1);
			LyteColorbox._photo = null;
			LyteColorbox.load(LyteColorbox._related[LyteColorbox._index]);
		}
	},

	prev : function () {
		if (!LyteColorbox._active && LyteColorbox._related[1] && (LyteColorbox._component.getData('ltPropLoop') || LyteColorbox._index)) {
			if(LyteColorbox._zoom){
				LyteColorbox._zoom = false;
				document.querySelector('.lyteCBoxPhoto').classList.remove('lyteCBoxPhotoZoomOut');
				document.querySelector('.lyteCBoxPhoto').classList.add('lyteCBoxPhotoZoomIn');
			}
			document.querySelector('.lyteCBoxPhoto').remove();
			LyteColorbox._index = LyteColorbox.getIndex(-1);
			LyteColorbox._photo = null;
			LyteColorbox.load(LyteColorbox._related[LyteColorbox._index]);
		}
	},

	
	close : function () {
		if (LyteColorbox._open && !LyteColorbox._closing) {
			if(LyteColorbox._zoom){
				LyteColorbox._zoom = false;
				document.querySelector('.lyteCBoxPhoto').classList.remove('lyteCBoxPhotoZoomOut');
				document.querySelector('.lyteCBoxPhoto').classList.add('lyteCBoxPhotoZoomIn');
			}
			LyteColorbox._closing = true;
			LyteColorbox._open = false;
			LyteColorbox._box.classList.remove('lyteColorboxDisplay');
			LyteColorbox._component.callOnClose();
			LyteColorbox._photo = null;
			LyteColorbox._related = [];
			LyteColorbox._closing = false;
			LyteColorbox._el = null;
		}
	},

	download : function(){
		// debugger
		var a = document.createElement('a');
		a.setAttribute("href", LyteColorbox._el.lytecboxHref);
		a.setAttribute("download", LyteColorbox.createName(LyteColorbox._el.lytecboxTitle));
		document.body.append(a);
		a.click();
		a.remove();
	},

	zoomIn : function(){
		LyteColorbox._previousOffset = {
			width : LyteColorbox._content.style.width,
			height : LyteColorbox._content.style.height
		};
		var winWidth = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
    	var winheight = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
		var zoomBy = LyteColorbox._el.lytecboxZoomBy ? parseInt(LyteColorbox._el.lytecboxZoomBy) : parseInt(LyteColorbox._component.getData('ltPropZoomBy'));
		var contentOffset = LyteColorbox._content.getBoundingClientRect();
		var overlayOffset = LyteColorbox._overlay.getBoundingClientRect();
		var newWidth = contentOffset.width * ((100+zoomBy) / 100);
		var newHeight = contentOffset.height * ((100+zoomBy) / 100);
		var widthPercent = 0;
		var heightPercent = 0;

		if(newWidth > overlayOffset.width){
			widthPercent = ((newWidth - overlayOffset.width) / overlayOffset.width) * 100;
			newWidth = overlayOffset.width;
			LyteColorbox._content.style.overflow = 'auto';
		}
		if(newHeight > overlayOffset.height){
			heightPercent = ((newHeight - overlayOffset.height) / overlayOffset.height) * 100;
			newHeight = overlayOffset.height;
			LyteColorbox._content.style.overflow = 'auto';
		}
		LyteColorbox._content.style.height = LyteColorbox.setSize(newHeight,'y',winheight) + "%";
		LyteColorbox._content.style.width = LyteColorbox.setSize(newWidth,'x',winWidth) + "%";
		LyteColorbox._photo.style.height = Math.round(100+heightPercent) + "%";
		LyteColorbox._photo.style.width = Math.round(100+widthPercent) + "%";
		LyteColorbox.computeOffsetImpl();
	},

	zoomOut : function(){
		LyteColorbox._content.style.overflow = 'hidden';
		LyteColorbox._content.style.height = LyteColorbox._previousOffset.height;
		LyteColorbox._content.style.width = LyteColorbox._previousOffset.width;
		LyteColorbox._photo.style.height = "100%";
		LyteColorbox._photo.style.width = "100%";
		LyteColorbox.computeOffsetImpl();
	}

};

Lyte.Component.register("lyte-colorbox", {
_template:"<template tag-name=\"lyte-colorbox\">\t<template is=\"if\" value=\"{{ltPropYield}}\"><template case=\"true\">\t\t<lyte-yield yield-name=\"colorBoxYield\"></lyte-yield>\t</template><template case=\"false\">\t\t<div id=\"lyteColorbox\" class=\"lyteColorbox lyteCBox\">\t\t\t\t\t\t\t<div class=\"lyteColorboxHeader\">\t\t\t\t\t<div class=\"lyteColorboxTitle lyteCBoxTitle\"></div>\t\t\t\t\t<div class=\"lyteColorboxDownloadDiv lyteCBoxDownload\">\t\t\t\t\t\t<img src=\"/dist/bower_components/ui-components/components/images/download-arrow.svg\" style=\"height: 14px;\">\t\t\t\t\t</div>\t\t\t\t\t<div class=\"lyteColorboxCloseIcon lyteCBoxClose\">\t\t\t\t\t\t<svg viewport=\"0 0 12 12\" version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" style=\"width: 13px; height: 14px;\"><line x1=\"1\" y1=\"11\" x2=\"11\" y2=\"1\" stroke=\"white\" stroke-width=\"2\"></line><line x1=\"1\" y1=\"1\" x2=\"11\" y2=\"11\" stroke=\"white\" stroke-width=\"2\"></line></svg>\t\t\t\t\t</div>\t\t\t\t</div>\t\t\t\t<div class=\"lyteColorboxFreezeLayer lyteCBoxOverlay\"></div>\t\t\t\t<div class=\"lyteColorboxContent lyteCBoxContent\">\t\t\t\t\t<img class=\"lyteColorboxLoadingImg\" src=\"/dist/bower_components/ui-components/components/images/loading.gif\">\t\t\t\t</div>\t\t\t\t<div class=\"lyteColorboxIconDiv lyteCBoxPrevious\">\t\t\t\t\t<div class=\"lyteColorboxPreviousIcon\"></div>\t\t\t\t</div>\t\t\t\t<div class=\"lyteColorboxIconDiv lyteCBoxNext\">\t\t\t\t\t<div class=\"lyteColorboxNextIcon\"></div>\t\t\t\t</div>\t\t\t\t\t</div>\t</template></template></template>",
_dynamicNodes : [{"type":"attr","position":[1]},{"type":"if","position":[1],"cases":{"true":{"dynamicNodes":[{"type":"insertYield","position":[1]}]},"false":{"dynamicNodes":[]}},"default":{}}],
_observedAttributes :["ltPropYield","ltPropHeight","ltPropWidth","ltPropOverlayClose","ltPropLoop","ltPropArrowKey","ltPropSelectors","ltPropZoomBy","ltPropEscKey","ltPropImgError"],
	data : function(){
		return {
			'ltPropYield' : Lyte.attr("boolean",{"default":false}),
			'ltPropHeight' : Lyte.attr("string"),
			'ltPropWidth' : Lyte.attr("string"),
			'ltPropOverlayClose' : Lyte.attr("boolean",{"default":true}),
			'ltPropLoop' : Lyte.attr("boolean",{"default":true}),
			'ltPropArrowKey' : Lyte.attr("boolean",{"default":true}),
			'ltPropSelectors' : Lyte.attr("array",{"default" : []}),
			'ltPropZoomBy' : Lyte.attr("string",{"default":"50%"}),
			'ltPropEscKey' : Lyte.attr("boolean",{"default":true}),
			'ltPropImgError' : Lyte.attr("string",{"default":"This image failed to load."})
			
		}		
	},
	
	intialFunc : function(){
		// debugger
		if(!LyteColorbox._component){
			LyteColorbox._component = this;
		}
		LyteColorbox.appendHTML();

		var ele = this.getSelectorElements();
		if(ele.length > 0){
			this.addBindings(ele);
		}
		else{
			console.warn("No selector(s) provided to colorbox.")
		}
	}.observes('ltPropSelectors.[]').on('didConnect'),

	callOnBeforeOpen : function(arrayObj){
		var returnVal;
		if(this.getMethods('onBeforeOpen')){
			retrunVal = this.executeMethod('onBeforeOpen',arrayObj,this);
		}
		return returnVal;
	},

	callOnOpen : function(){
		if(this.getMethods('onOpen')){
			this.executeMethod('onOpen',this);
		}
	},

	callOnLoad : function(){
		if(this.getMethods('onLoad')){
			this.executeMethod('onLoad',arguments[0],this);
		}
	},

	getSelectorElements : function(){
		var selectors = this.getData('ltPropSelectors');
		var ele = [];
		for(var i = 0; i<selectors.length; i++){
			Lyte.arrayUtils(ele,'push',Array.from(document.querySelectorAll('.'+selectors[i])));
		}
		return ele;
	},

	callOnClose : function(){
		if(this.getMethods('onClose')){
			this.executeMethod("onClose",this);
		}
	},

	didDestroy: function() {
		// debugger
		if(!LyteColorbox._first){
			window.removeEventListener('resize',LyteColorbox.computeOffsetImpl);
		}
		LyteColorbox._component = null;
		LyteColorbox._box.remove();
		LyteColorbox._box = null;
		LyteColorbox._prev = null;
		LyteColorbox._next = null;
		LyteColorbox._content = null;
		LyteColorbox._overlay = null;;
		LyteColorbox._title = null;
		LyteColorbox._close = null;
		LyteColorbox._download = null;
		LyteColorbox._el = null;
	},

	clickHandler : function() {
		var e = event || window.event;
		// ignore non-left-mouse-clicks and clicks modified with ctrl / command, shift, or alt.
		// See: http://jacklmoore.com/notes/click-events/
		if (!(e.which > 1 || e.shiftKey || e.altKey || e.metaKey || e.ctrlKey)) {
			e.preventDefault();
			var obj = Object.assign({},this.dataset);
			obj.classList = this.classList;
			LyteColorbox.launch(obj);
		}
	},

	addBindings : function(ele) {

		if (LyteColorbox._box) {

			if(!LyteColorbox._init){
				LyteColorbox._init = true;
				
				if(LyteColorbox._next){
					LyteColorbox._next.addEventListener('click',function () {
						LyteColorbox.next();
					},true);
				}
				if(LyteColorbox._prev){
					LyteColorbox._prev.addEventListener('click',function () {
						LyteColorbox.prev();
					},true);
				}
				if(LyteColorbox._close){
					LyteColorbox._close.addEventListener('click',function () {
						LyteColorbox.close();
					},true);
				}
				if(LyteColorbox._overlay){
					LyteColorbox._overlay.addEventListener('click',function () {
						if (LyteColorbox._component.getData('ltPropOverlayClose')) {
							LyteColorbox.close();
						}
					},true);
				}
				if(LyteColorbox._download){
					LyteColorbox._download.addEventListener('click',function(){
						LyteColorbox.download();
					},true);
				}
				LyteColorbox._content.addEventListener('click',function(){
					if(!LyteColorbox._zoom){
						LyteColorbox._zoom = true;
						document.querySelector('.lyteCBoxPhoto').classList.remove('lyteCBoxPhotoZoomIn');
						document.querySelector('.lyteCBoxPhoto').classList.add('lyteCBoxPhotoZoomOut');
						LyteColorbox.zoomIn();
					}
					else{
						LyteColorbox._zoom = false;
						document.querySelector('.lyteCBoxPhoto').classList.remove('lyteCBoxPhotoZoomOut');
						document.querySelector('.lyteCBoxPhoto').classList.add('lyteCBoxPhotoZoomIn');
						LyteColorbox.zoomOut();
					}
				},true);

				// Key Bindings
				document.addEventListener('keydown', function (e) {
					var key = e.keyCode;
					if (LyteColorbox._open && LyteColorbox._component.getData('ltPropEscKey') && key === 27) {
						e.preventDefault();
						LyteColorbox.close();
					}
					if (LyteColorbox._open && LyteColorbox._component.getData('ltPropArrowKey') && LyteColorbox._related[1] && !e.altKey) {
						if (key === 37) {
							e.preventDefault();
							if(LyteColorbox._prev){
								LyteColorbox._prev.click();
							}
							else{
								if(LyteColorbox._related instanceof Array && LyteColorbox._related.length > 1){
									LyteColorbox.prev();
								}
							}
							
							
						} else if (key === 39) {
							e.preventDefault();
							if(LyteColorbox._next){
								LyteColorbox._next.click();
							}
							else{
								if(LyteColorbox._related instanceof Array && LyteColorbox._related.length > 1){
									LyteColorbox.next();
								}
							}
						}
					}
				});
			}
			
			

			// if(ele.length){
				for(var i = 0; i<ele.length; i++){
					ele[i].addEventListener("click",this.clickHandler,true);
					ele[i].classList.add(LyteColorbox._boxElement);
				}
			// }
			
			return true;
		}
		return false;
	}
});
