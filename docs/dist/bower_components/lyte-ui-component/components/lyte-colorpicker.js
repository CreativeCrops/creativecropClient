/*------------------------   NOTES   ------------------------*/
/*
  Things needed to document:
  1. No fill color will return transparent as color value on select. - done
*/

if(!ColorPicker_Util){
	var ColorPicker_Util = {
		component : null,
		baseConverter : function(numberToConvert, oldBase, newBase) {
	        if (newBase == 10) {
	            return parseInt(numberToConvert, 16);
	        }
	        if (newBase == 16) {
	            return parseInt(numberToConvert).toString(16);
	        }
	        numberToConvert = numberToConvert + "";
	        numberToConvert = numberToConvert.toUpperCase();
	        var listOfCharacters = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
	        var dec = 0;
	        for (var i = 0; i <= numberToConvert.length; i++) {
	            dec += (listOfCharacters.indexOf(numberToConvert.charAt(i))) * (Math.pow(oldBase, (numberToConvert.length - i - 1)));
	        }
	        numberToConvert = "";
	        var magnitude = Math.floor((Math.log(dec)) / (Math.log(newBase)));
	        for (var i = magnitude; i >= 0; i--) {
	            var amount = Math.floor(dec / Math.pow(newBase, i));
	            numberToConvert = numberToConvert + listOfCharacters.charAt(amount);
	            dec -= amount * (Math.pow(newBase, i));
	        }
	        if (numberToConvert.length == 0){
	            numberToConvertToConvert = 0;
	        }
	        if (!numberToConvert){
	            numberToConvert = 0;
	        }
	        return numberToConvert;
	    },
	    getHsvByRgbCode : function(rgbColor) {
	        var rgbColor = rgbColor.replace('#', ''),
	        red = ColorPicker_Util.baseConverter(rgbColor.substr(0, 2), 16, 10),
	        green = ColorPicker_Util.baseConverter(rgbColor.substr(2, 2), 16, 10),
	        blue = ColorPicker_Util.baseConverter(rgbColor.substr(4, 2), 16, 10);
	        if (red == 0 && green == 0 && blue == 0) {
	            var returnArray = {};
	            returnArray.hue = 0;
	            returnArray.saturation = 0;
	            returnArray.brightness = 0;
	            return returnArray;
	        }
	        red = red / 255;
	        green = green / 255;
	        blue = blue / 255;
	        maxValue = Math.max(red, green, blue);
	        minValue = Math.min(red, green, blue);
	        var hue = 0;
	        if (maxValue == minValue) {
	            hue = 0;
	            saturation = 0;
	        } else {
	            if (red == maxValue) {
	                hue = (green - blue) / (maxValue - minValue) / 1;
	            } else if (green == maxValue) {
	                hue = 2 + (blue - red) / 1 / (maxValue - minValue) / 1;
	            } else if (blue == maxValue) {
	                hue = 4 + (red - green) / (maxValue - minValue) / 1;
	            }
	            saturation = (maxValue - minValue) / maxValue;
	        }
	        hue = hue * 60;
	        valueBrightness = maxValue;
	        if (hue < 0){
	            hue += 360;
	        }
	        var returnArray = {};
	        returnArray.hue = hue;
	        returnArray.saturation = saturation;
	        returnArray.brightness = valueBrightness;
	        return returnArray;
	    },
	    getRgbCodeByRgbColors : function(red, green, blue) {
	        var red = ColorPicker_Util.baseConverter(red, 10, 16),
	        green = ColorPicker_Util.baseConverter(green, 10, 16),
	        blue = ColorPicker_Util.baseConverter(blue, 10, 16);
	        red = red + "";
	        green = green + "";
	        blue = blue + "";
	        while (red.length < 2) {
	            red = "0" + red;
	        }
	        while (green.length < 2) {
	            green = "0" + green;
	        }
	        while (blue.length < 2) {
	            blue = "0" + "" + blue;
	        }
	        rgbColor = red + "" + green + "" + blue;
	        return rgbColor.toUpperCase();
	    },
	    getRgbColorsByRgbCode : function(rgbCode) {
	        var retArray = {};
	        retArray.red = ColorPicker_Util.baseConverter(rgbCode.substr(0, 2), 16, 10);
	        retArray.green = ColorPicker_Util.baseConverter(rgbCode.substr(2, 2), 16, 10);
	        retArray.blue = ColorPicker_Util.baseConverter(rgbCode.substr(4, 2), 16, 10);
	        return retArray;
	    },
	    getRgbColorsByHsv : function(hue, saturation, valueBrightness) {
	        var Hi = Math.floor(hue / 60),
	        red,green,blue,f,p,q,t;
	        if (hue == 360){
	            hue = 0;
	        }
	        f = hue / 60 - Hi;
	        if (saturation > 1){
	            saturation /= 100;
	        }
	        if (valueBrightness > 1){
	            valueBrightness /= 100;
	        }
	        p = (valueBrightness * (1 - saturation));
	        q = (valueBrightness * (1 - (f * saturation)));
	        t = (valueBrightness * (1 - ((1 - f) * saturation)));
	        switch (Hi) {
	        case 0:
	            red = valueBrightness;
	            green = t;
	            blue = p;
	            break;
	        case 1:
	            red = q;
	            green = valueBrightness;
	            blue = p;
	            break;
	        case 2:
	            red = p;
	            green = valueBrightness;
	            blue = t;
	            break;
	        case 3:
	            red = p;
	            green = q;
	            blue = valueBrightness;
	            break;
	        case 4:
	            red = t;
	            green = p;
	            blue = valueBrightness;
	            break;
	        default:
	            red = valueBrightness;
	            green = p;
	            blue = q;
	            break;
	        }
	        if (saturation == 0) {
	            red = valueBrightness;
	            green = valueBrightness;
	            blue = valueBrightness;
	        }
	        red *= 255;
	        green *= 255;
	        blue *= 255;
	        red = Math.round(red);
	        green = Math.round(green);
	        blue = Math.round(blue);
	        return {
	            red: red,
	            green: green,
	            blue: blue
	        }
	    },
	    getRgbCodeByHsv : function(hue, saturation, valueBrightness) {
	        while (hue >= 360){
	            hue -= 360;
	        }
	        var colors = ColorPicker_Util.getRgbColorsByHsv(hue, saturation, valueBrightness);
	        return ColorPicker_Util.getRgbCodeByRgbColors(colors.red, colors.green, colors.blue);
	    },
	    getLeftPos : function(el) {
	        if (document.getBoxObjectFor) {
	            if (el.tagName != 'INPUT' && el.tagName != 'SELECT' && el.tagName != 'TEXTAREA'){
	                return document.getBoxObjectFor(el).x
	            }
	        }
	        var ret = el.offsetLeft;
	        while ((el = el.offsetParent) != null) {
	            if (el.tagName != 'HTML') {
	                ret += el.offsetLeft;
	                if (document.all){
	                    ret += el.clientLeft;
	                }
	            }
	        }
	        return ret;
	    },
	    getTopPos : function(el) {
	        if (document.getBoxObjectFor) {
	            if (el.tagName != 'INPUT' && el.tagName != 'SELECT' && el.tagName != 'TEXTAREA'){
	                return document.getBoxObjectFor(el).y
	            }
	        }
	        var ret = el.offsetTop;
	        while ((el = el.offsetParent) != null) {
	            if (el.tagName != 'HTML') {
	                ret += (el.offsetTop - el.scrollTop);
	                if (document.all){
	                    ret += el.clientTop;
	                }
	            }
	        }
	        return ret;
	    },
	    getCmykByRgbColors: function(rgb){
			var c = 1 - rgb[0] / 255;
		    var m = 1 - rgb[1] / 255;
		    var y = 1 - rgb[2] / 255,k;

		    var min_cmy = Math.min(c, m, y);
		    c = (c - min_cmy) / (1 - min_cmy);
		    m = (m - min_cmy) / (1 - min_cmy);
		    y = (y - min_cmy) / (1 - min_cmy);
		    k = min_cmy;

		    c = isNaN( c )? 0 :c;
		    m = isNaN( m )? 0 :m;
		    y = isNaN( y )? 0 :y;

			return [c, m, y, k];
		},
		getColorPicker : function(arg){
			var ele = arg.closest('lyte-colorpicker');
			// console.log(arg);
			// console.log(ele);
			if(!ele){
				components = LytePopup.components;
				for(var i =components.length - 1; i>=0; i--){
					if(components[i].$node.parentElement.tagName == 'LYTE-COLORPICKER' && components[i].childComp.style.visibility == 'visible'){
						ele = components[i].childComp;
						break;
					}
				}
				if(ele){
					var div = ele.querySelector('.popoverWrapper');
					if(div && div.classList.length > 1){
						var className = div.className.split(" ")[1];
						var colorpickers = document.querySelectorAll('lyte-colorpicker');
						for(var i = 0 ; i<colorpickers.length ; i++){
							if(colorpickers[i].component.getData('ltPropWrapperClass') === className){
								ele = colorpickers[i];
								break;
							}
						}
					}
				}
			}
			return ele;
		}
	}
}

if(!ColorPicker_EventUtil){
	var ColorPicker_EventUtil = {
		__stopPropagation : false,
		__eventBound : false,
		__initHueMove: function(e,_this) {
			if(_this){
				_this.setData('hueStatus', 1);
		        // _this.setData('poxYHue', ColorPicker_Util.getTopPos(_this.getData('divElHueBar')));
		        _this.setData('poxXHue', ColorPicker_Util.getLeftPos(_this.getData('ltPropInline') ? _this.$node.querySelector('.colorSlider_hueBar') : _this.childComp.querySelector('.colorSlider_hueBar')));
		        _this.__setTextSelOk(false);
		        ColorPicker_EventUtil.__moveOnHueBar(e,_this);
		        return false;
			}
	    },

		__initPaletteMove : function(e,_this) {
	    	if(_this){
	    		var posdivElPalette = _this.getData('posdivElPalette');
		    	var circleOffsetBecauseOfWinWidget = _this.getData('circleOffsetBecauseOfWinWidget');
		    	var divElPalette =  _this.getData('ltPropInline') ? _this.$node.querySelector('#colorDiv') : _this.childComp.querySelector('#colorDiv');
		    	var circleOffsetSize = _this.getData('circleOffsetSize');
		        if (document.all){
		            e = event || window.event;
		        }
		        _this.__ffHackWinWidget();
		        posdivElPalette.x = ColorPicker_Util.getLeftPos(divElPalette) + circleOffsetBecauseOfWinWidget;
		        posdivElPalette.y = ColorPicker_Util.getTopPos(divElPalette) + circleOffsetBecauseOfWinWidget;
		        _this.setData('posdivElPalette',posdivElPalette);
		        _this.setData('dragStatus', 1);
		        _this.setData('paletteMaxX', (divElPalette.clientWidth - circleOffsetSize));
		        _this.setData('paletteMaxY', (divElPalette.clientHeight - circleOffsetSize));
		        ColorPicker_EventUtil.__moveOnPalette(e,_this);
		        _this.__setTextSelOk(false);
		        posdivElPalette = null;
		        divElPalette = null;
		        return false;
	    	}
	    },

	    __moveOnPalette : function(e,_this) {
	    	if(_this){
	    		e.preventDefault();
		    	var posdivElPalette = _this.getData('posdivElPalette');
		    	var circleOffsetSize = _this.getData('circleOffsetSize');
		    	var divElPaletteCircle = _this.getData('ltPropInline') ? _this.$node.querySelector('.colorSlider_palette_circle') : _this.childComp.querySelector('.colorSlider_palette_circle');
		        if (_this.getData('dragStatus') != 1){
		            return;
		        }
		        if (_this.getData('clickOnPaletteInProgress')){
		            return;
		        }
		        _this.setData('clickOnPaletteInProgress', true);
		        if (document.all){
		            e = event;
		        }
		        var leftEl = posdivElPalette.x;
		        var topEl = posdivElPalette.y;
		        var left = e.clientX + document.documentElement.scrollLeft - leftEl - circleOffsetSize;
		        var top = e.clientY + document.documentElement.scrollTop - topEl - circleOffsetSize;
		        if (left < circleOffsetSize * -1){
		            left = circleOffsetSize * -1;
		        }
		        if (top < circleOffsetSize * -1){
		            top = circleOffsetSize * -1;
		        }
		        if (left > _this.getData('paletteMaxX')){
		            left = _this.getData('paletteMaxX');
		        }
		        if (top > _this.getData('paletteMaxY')){
		            top = _this.getData('paletteMaxY');
		        }
		        divElPaletteCircle.style.left = left + 'px';
		        divElPaletteCircle.style.top = top + 'px';
		        _this.setData('currentSaturation', Math.round(((left + circleOffsetSize) / _this.getData('paletteSize').width) * 100));
		        _this.setData('currentBrightness', 100 - Math.round(((top + circleOffsetSize) / _this.getData('paletteSize').height) * 100));
		        _this.__setCurrentRgbCode();
		        _this.__setBgColorPreviewDiv();
		        _this.__updateRgbInForm();
		        _this.executeOnChange();
		        _this.setData('clickOnPaletteInProgress', false);
		        posdivElPalette = null;
		        divElPaletteCircle = null;
		        circleOffsetSize = null;
	    	}
	    },

	    __moveOnHueBar: function(e,_this) {
	    	if(_this){
	    		e.preventDefault();
		        if (_this.getData('hueStatus') != 1){
		            return;
		        }
		        if (document.all){
		            e = event;
		        }
		        var leftPos = _this.getData('poxXHue');
		        var diff = e.clientX + document.documentElement.scrollLeft - leftPos;
		        if (diff > _this.getData('paletteSize').height){
		            diff = _this.getData('paletteSize').height;
		        }
		        if (diff < 0){
		            diff = 0;
		        }
		        var ele = _this.getData('ltPropInline') ? _this.$node : _this.childComp;
		        if((diff - 9) > 247){
		        	ele.querySelector('.colorSlider_sliderHandle').style.left = '247px';
		        }
		        else{
		        	ele.querySelector('.colorSlider_sliderHandle').style.left = (diff - 9) + 'px';
		        }
		        var hue = Math.round(((_this.getData('paletteSize').height - diff) * (360 / _this.getData('paletteSize').height)));
		        if (hue == 360){
		            hue = 0;
		        }
		        _this.setData('currentHue', hue);
		        _this.__setCurrentRgbCode();
		        _this.__setPaletteBgColor();
		        _this.__setBgColorPreviewDiv();
		        _this.__updateRgbInForm();
		        _this.executeOnChange();
	    	}
	    },

	    __endDrag : function(e,_this) {
	    	if(_this){
	    		if(_this.getData('dragStatus') == 0 && _this.getData('hueStatus') == 0){
		    		return;
		    	}
		    	ColorPicker_EventUtil.__stopPropagation = true;
		        if (_this.getData('dragStatus') == 1) {
		            // _this.__updateHsvInForm();
		            _this.__updateRgbInForm();
		        }
		        _this.setData('dragStatus', 0);
		        _this.setData('hueStatus', 0);
		        _this.__setTextSelOk(true);
		        // var rgbColor = ColorPicker_Util.getRgbColorsByRgbCode(_this.getData('ltPropCurrentRgbCode'));
		        // var selectedColor = {
		        // 	"hex" : "#"+_this.getData('ltPropCurrentRgbCode'),
		        // 	"rgb" : "rgb("+rgbColor.red+", "+rgbColor.green+", "+rgbColor.blue+")"
		        // };
		        // _this.setData("ltPropSelectedColor",selectedColor);
		        _this.executeOnSelect();
	    	}
	    	ColorPicker_Util.component = null;
	    }
	}
}



Lyte.Component.register("lyte-colorpicker", {
_template:"<template tag-name=\"lyte-colorpicker\">\t<template is=\"if\" value=\"{{ltPropInline}}\"><template case=\"true\">\t<div class=\"lyteColorPicker\">\t\t<template is=\"if\" value=\"{{ltPropShowTitle}}\"><template case=\"true\">\t\t\t<div class=\"lyteColorPicker__titlebar\">\t\t\t\t<span class=\"lyteColorPicker__title\">{{ltPropTitle}}</span>\t\t\t\t\t\t\t</div>\t\t</template></template>\t\t<div class=\"lyteColorPicker__showhidecontainer\">\t\t\t<template is=\"if\" value=\"{{ltPropBasicColorPicker}}\"><template case=\"true\">\t\t\t\t<div class=\"lyteColorPicker__default\">\t\t\t\t\t<template is=\"if\" value=\"{{ltPropNoFillButton}}\"><template case=\"true\">\t\t\t\t\t<div class=\"lyteColorPicker__nocolorbutton\" onclick=\"{{action(&quot;noFillExecute&quot;,event)}}\">\t\t\t\t\t\t<span class=\"lyteColorPicker__icon\">\t\t\t\t\t\t\t<svg viewBox=\"0 0 16 16\">\t\t\t\t\t\t\t\t<path d=\"{{noFillPath}}\"></path>\t\t\t\t\t\t\t</svg>\t\t\t\t\t\t</span>\t\t\t\t\t\t<span class=\"lyteColorPicker__text\">{{ltPropNoFillLabel}}</span>\t\t\t\t\t</div>\t\t\t\t\t</template></template>\t\t\t\t\t<template is=\"if\" value=\"{{ltPropUsedColors}}\"><template case=\"true\">\t\t\t\t\t<div class=\"lyteColorPicker__palettecontainer usedColor__container\">\t\t\t\t\t\t<span class=\"lyteColorPicker__paletteheading\">{{lyteUiI18n(\"Recently.Used.Colors\")}}</span>\t\t\t\t\t\t<div class=\"lyteColorPicker__palette\">\t\t\t\t\t\t\t<ul class=\"used__colors\">\t\t\t\t\t\t\t\t<template is=\"for\" items=\"{{usedColors}}\" item=\"color\" index=\"indexVal\">\t\t\t\t\t\t\t\t<li class=\"lyteColorPicker__colorpan\" lt-prop-title=\"{{lyteRgbToHex(color)}}\" lt-prop-tooltip-config=\"{&quot;position&quot; : &quot;bottom&quot;,&quot;showdelay&quot; : &quot;1000&quot;}\" onclick=\"{{action(&quot;selectColor&quot;, event, color)}}\">{{color}}</li>\t\t\t\t\t\t\t\t<template is=\"if\" value=\"{{lyteCPInsertBreak(indexVal)}}\"><template case=\"true\">\t\t\t\t\t\t\t\t<br>\t\t\t\t\t\t\t\t</template></template>\t\t\t\t\t\t\t\t</template>\t\t\t\t\t\t\t</ul>\t\t\t\t\t\t</div>\t\t\t\t\t</div>\t\t\t\t\t</template></template>\t\t\t\t\t<div class=\"lyteColorPicker__palettecontainer\">\t\t\t\t\t\t<span class=\"lyteColorPicker__paletteheading\">{{ltPropPaletteLabel}}</span>\t\t\t\t\t\t<div class=\"lyteColorPicker__palette\">\t\t\t\t\t\t\t<div>\t\t\t\t\t\t\t\t<template is=\"for\" items=\"{{availableColors}}\" item=\"colorArray\" index=\"indexVal\">\t\t\t\t\t\t\t\t<ul class=\".lyteColorPicker__shades default__colors\">\t\t\t\t\t\t\t\t\t<template is=\"for\" items=\"{{colorArray}}\" item=\"color\" index=\"indexVal\">\t\t\t\t\t\t\t\t\t<li class=\"lyteColorPicker__colorpan\" lt-prop-title=\"{{lyteRgbToHex(color)}}\" lt-prop-tooltip-config=\"{&quot;position&quot; : &quot;bottom&quot;,&quot;showdelay&quot; : &quot;1000&quot;}\" onclick=\"{{action(&quot;selectColor&quot;, event, color)}}\">{{color}}</li>\t\t\t\t\t\t\t\t\t</template>\t\t\t\t\t\t\t\t</ul>\t\t\t\t\t\t\t\t</template>\t\t\t\t\t\t\t</div>\t\t\t\t\t\t</div>\t\t\t\t\t</div>\t\t\t\t\t<template is=\"if\" value=\"{{ltPropStandardColors}}\"><template case=\"true\">\t\t\t\t\t<div class=\"lyteColorPicker__palettecontainer\">\t\t\t\t\t\t<span class=\"lyteColorPicker__paletteheading\">{{lyteUiI18n(\"Standard.Colors\")}}</span>\t\t\t\t\t\t<div class=\"lyteColorPicker__palette\">\t\t\t\t\t\t\t<ul class=\"standard__colors\">\t\t\t\t\t\t\t\t<template is=\"for\" items=\"{{standardColorArray}}\" item=\"color\" index=\"indexVal\">\t\t\t\t\t\t\t\t<li class=\"lyteColorPicker__colorpan\" lt-prop-title=\"{{lyteRgbToHex(color)}}\" lt-prop-tooltip-config=\"{&quot;position&quot; : &quot;bottom&quot;,&quot;showdelay&quot; : &quot;1000&quot;}\" onclick=\"{{action(&quot;selectColor&quot;, event, color)}}\">{{color}}</li>\t\t\t\t\t\t\t\t</template>\t\t\t\t\t\t\t</ul>\t\t\t\t\t\t</div>\t\t\t\t\t</div>\t\t\t\t\t</template></template>\t\t\t\t\t<template is=\"if\" value=\"{{ltPropAdvancedColorButton}}\"><template case=\"true\">\t\t\t\t\t<div class=\"lyteColorPicker__navigatable lyteColorPicker__morecolorbutton\" onclick=\"{{action(&quot;goToAdvancedCP&quot;,event)}}\">\t\t\t\t\t\t<span class=\"lyteColorPicker__icon\">\t\t\t\t\t\t\t<svg viewBox=\"0 0 600 598\">\t\t\t\t\t\t\t\t<path d=\"{{moreColorsPath}}\"></path>\t\t\t\t\t\t\t</svg>\t\t\t\t\t\t</span>\t\t\t\t\t\t<span class=\"lyteColorPicker__text\" style=\"position: absolute; left: 50%; transform: translate(-50%);\">{{lyteUiI18n(\"Advanced.Colors\")}}</span>\t\t\t\t\t\t<span class=\"lyteColorpickerForwardArrow h-alignright\">\t\t\t\t\t\t\t\t\t\t\t\t\t</span>\t\t\t\t\t</div>\t\t\t\t\t</template></template>\t\t\t\t\t<template is=\"if\" value=\"{{ltPropColorPreview}}\"><template case=\"true\">\t\t\t\t\t<div class=\"lyteColorPicker__colorfieldcontainer\">\t\t\t\t\t\t<div class=\"lyteColorPicker__colorfield\">\t\t\t\t\t\t\t<span class=\"lyteColorPicker__colorfieldpreview lyteColorPicker__transparentbg\">\t\t\t\t\t\t\t\t<div class=\"lyteColorPicker__dynamiccolor\" lt-prop-title=\"{{lyteUiI18n('Copy.Color.value.to.Clipboard')}}\" lt-prop-tooltip-config=\"{&quot;position&quot; : &quot;bottom&quot;}\" onmouseover=\"{{action(&quot;onOverColorPreviewDiv&quot;,event,&quot;fromBasic&quot;,&quot;over&quot;)}}\" onmouseout=\"{{action(&quot;onOverColorPreviewDiv&quot;,event,&quot;fromBasic&quot;,&quot;out&quot;)}}\" onclick=\"{{action(&quot;copyValueToClipboard&quot;,&quot;fromBasic&quot;)}}\">\t\t\t\t\t\t\t\t\t<div id=\"basciPreviewDivImg\" class=\"clipboardImg basicClipboardPos\"></div>\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t</div>\t\t\t\t\t\t\t</span>\t\t\t\t\t\t\t<input style=\"width: 157px;\" id=\"readColorValue\" class=\"lyteColorPicker__textbox h-hidecursor\" readonly=\"readonly\">\t\t\t\t\t\t</div>\t\t\t\t\t</div>\t\t\t\t\t</template></template>\t\t\t\t</div>\t\t\t</template><template case=\"false\">\t\t\t\t<div class=\"lyteColorPicker--advanced\">\t\t\t\t\t<div style=\"width: 320px;height: 258px;\">\t\t\t\t\t\t<div class=\"lyteColorPicker__maparea\">\t\t\t\t\t\t\t<div class=\"colorDiv\" id=\"colorDiv\">\t\t\t\t\t\t\t\t<div id=\"lyteCPImgDiv\"></div>\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<div class=\"colorSlider_palette_circle colorSlider_palette_circleBlack\"></div>\t\t\t\t\t\t\t</div>\t\t\t\t\t\t</div>\t\t\t\t\t\t\t\t\t\t\t</div>\t\t\t\t\t<div class=\"lyteColorPicker__previewDiv\" style=\"padding: 3px 0px !important;\">\t\t\t\t\t\t<div class=\"colorSlider_hue\">\t\t\t\t\t\t\t<div class=\"colorSlider_sliderHandle\">\t\t\t\t\t\t\t</div>\t\t\t\t\t\t\t<div class=\"colorSlider_hueBar_border\">\t\t\t\t\t\t\t\t<div class=\"colorSlider_hueBar\"></div>\t\t\t\t\t\t\t</div>\t\t\t\t\t\t</div>\t\t\t\t\t\t<div class=\"previewDiv\" onmouseover=\"{{action(&quot;onOverColorPreviewDiv&quot;,event,&quot;fromAdv&quot;,&quot;over&quot;)}}\" onmouseout=\"{{action(&quot;onOverColorPreviewDiv&quot;,event,&quot;fromAdv&quot;,&quot;out&quot;)}}\" onclick=\"{{action(&quot;copyValueToClipboard&quot;,&quot;fromAdv&quot;)}}\" lt-prop-title=\"{{lyteUiI18n('Copy.Color.value.to.Clipboard')}}\" lt-prop-tooltip-config=\"{&quot;position&quot; : &quot;bottom&quot;}\">\t\t\t\t\t\t\t<div id=\"copyColorValueImg\" class=\"clipboardImg advClipboardPos\"></div>\t\t\t\t\t\t\t\t\t\t\t\t\t</div>\t\t\t\t\t</div>\t\t\t\t\t<div class=\"lyteColorPicker__previewDiv\">\t\t\t\t\t\t<div class=\"selectFormat\">\t\t\t\t\t\t\t<lyte-dropdown class=\"cPDropDown\" lt-prop-yield=\"true\" lt-prop-tabindex=\"1\" on-option-selected=\"{{method(&quot;changeFormatView&quot;)}}\">\t\t\t\t\t\t\t\t<template is=\"registerYield\" yield-name=\"yield\">\t\t\t\t\t\t\t\t\t<lyte-drop-button class=\"colorPickerDD\">\t\t\t\t\t\t\t\t\t\t<span class=\"lyteMarginRight\">{{dropButtonValue}}</span>\t\t\t\t\t\t\t\t\t\t<lyte-icon class=\"dropdown\"></lyte-icon>\t\t\t\t\t\t\t\t\t</lyte-drop-button>\t\t\t\t\t\t\t\t\t<lyte-drop-box style=\"width: 83px;min-width:83px!important;\">\t\t\t\t\t\t\t\t\t\t<lyte-drop-body>\t\t\t\t\t\t\t\t\t\t\t<template is=\"for\" items=\"{{ltPropColorFormats}}\" item=\"item\" index=\"indexVal\">\t\t\t\t\t\t\t\t\t\t\t\t<lyte-drop-item data-value=\"{{item}}\"> {{item}} </lyte-drop-item>\t\t\t\t\t\t\t\t\t\t\t</template>\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t</lyte-drop-body>\t\t\t\t\t\t\t\t\t</lyte-drop-box>\t\t\t\t\t\t\t\t</template>\t\t\t\t\t\t\t</lyte-dropdown>\t\t\t\t\t\t</div>\t\t\t\t\t\t<div>\t\t\t\t\t\t\t<div class=\"showValue\"><lyte-input id=\"lyteCPShowValue\" lt-prop-type=\"text\" lt-prop-appearance=\"box\" lt-prop-value=\"#000000\" lt-prop-direction=\"vertical\"> </lyte-input></div>\t\t\t\t\t\t</div>\t\t\t\t\t</div>\t\t\t\t\t<template is=\"if\" value=\"{{moreColorOptionSelected}}\"><template case=\"true\">\t\t\t\t\t\t<div class=\"lyteColorPicker__navigatable lyteColorPicker__morecolorbutton\" onclick=\"{{action(&quot;fromAdvCPtoBasic&quot;,event)}}\">\t\t\t\t\t\t\t<span class=\"lyteColorpickerBackwardArrow\"></span>\t\t\t\t\t\t\t<span class=\"lyteColorPicker__icon h-alignright\" style=\"    margin-top: 1px;\">\t\t\t\t\t\t\t\t<svg viewBox=\"0 0 600 598\">\t\t\t\t\t\t\t\t\t<path d=\"{{moreColorsPath}}\"></path>\t\t\t\t\t\t\t\t</svg>\t\t\t\t\t\t\t</span>\t\t\t\t\t\t\t<span class=\"lyteColorPicker__text lyteColorpickerText\">{{lyteUiI18n(\"Back.to.Basic.Colors\")}}</span>\t\t\t\t\t\t</div>\t\t\t\t\t</template><template case=\"false\"><template is=\"if\" value=\"{{expHandlers(ltPropInline,'!')}}\"><template case=\"true\">\t\t\t\t\t\t<div class=\"lyteColorPicker__commandbar\">\t\t\t\t\t\t\t<lyte-button lt-prop-appearance=\"primary\" style=\"float: right;\" onclick=\"{{action(&quot;closeColorPicker&quot;,event)}}\">\t\t\t\t\t\t\t\t<template is=\"registerYield\" yield-name=\"text\">Close</template>\t\t\t\t\t\t\t</lyte-button>\t\t\t\t\t\t</div>\t\t\t\t\t</template></template></template></template>\t\t\t\t</div>\t\t\t</template></template>\t\t</div>\t</div>\t</template><template case=\"false\">\t\t<lyte-popover class=\"lyteColorPicker popColorPicker\" on-close=\"{{method(&quot;closePopColorPicker&quot;)}}\" on-show=\"{{method(&quot;showColorPickerPopover&quot;,event)}}\">\t\t\t<template is=\"registerYield\" yield-name=\"popover\">\t\t\t\t<template is=\"if\" value=\"{{ltPropShowTitle}}\"><template case=\"true\">\t\t\t\t<lyte-popover-header class=\"lyteColorPicker__titlebar\">\t\t\t\t\t<span class=\"lyteColorPicker__title\">{{ltPropTitle}}</span>\t\t\t\t\t<template is=\"if\" value=\"{{ltPropCloseButton}}\"><template case=\"true\">\t\t\t\t\t<span class=\"lyteColorPicker__close\" onclick=\"{{action('closeColorPicker')}}\"></span>\t\t\t\t\t</template></template>\t\t\t\t</lyte-popover-header>\t\t\t\t</template></template>\t\t\t\t<lyte-popover-content class=\"lyteColorPicker__showhidecontainer\">\t\t\t\t\t<template is=\"if\" value=\"{{ltPropBasicColorPicker}}\"><template case=\"true\">\t\t\t\t\t<div class=\"lyteColorPicker__default\">\t\t\t\t\t\t<template is=\"if\" value=\"{{ltPropNoFillButton}}\"><template case=\"true\">\t\t\t\t\t\t<div class=\"lyteColorPicker__nocolorbutton\" onclick=\"{{action(&quot;noFillExecute&quot;,event)}}\">\t\t\t\t\t\t\t<span class=\"lyteColorPicker__icon\">\t\t\t\t\t\t\t\t<svg viewBox=\"0 0 16 16\">\t\t\t\t\t\t\t\t\t<path d=\"{{noFillPath}}\"></path>\t\t\t\t\t\t\t\t</svg>\t\t\t\t\t\t\t</span>\t\t\t\t\t\t\t<span class=\"lyteColorPicker__text\">{{ltPropNoFillLabel}}</span>\t\t\t\t\t\t</div>\t\t\t\t\t\t</template></template>\t\t\t\t\t\t<template is=\"if\" value=\"{{ltPropUsedColors}}\"><template case=\"true\">\t\t\t\t\t\t<div class=\"lyteColorPicker__palettecontainer usedColor__container\">\t\t\t\t\t\t\t<span class=\"lyteColorPicker__paletteheading\">{{lyteUiI18n(\"Recently.Used.Colors\")}}</span>\t\t\t\t\t\t\t<div class=\"lyteColorPicker__palette\">\t\t\t\t\t\t\t\t<ul class=\"used__colors\">\t\t\t\t\t\t\t\t\t<template is=\"for\" items=\"{{usedColors}}\" item=\"color\" index=\"indexVal\">\t\t\t\t\t\t\t\t\t<li class=\"lyteColorPicker__colorpan\" lt-prop-title=\"{{lyteRgbToHex(color)}}\" lt-prop-tooltip-config=\"{&quot;position&quot; : &quot;bottom&quot;,&quot;showdelay&quot; : &quot;1000&quot;}\" onclick=\"{{action(&quot;selectColor&quot;, event, color)}}\">{{color}}</li>\t\t\t\t\t\t\t\t\t<template is=\"if\" value=\"{{lyteCPInsertBreak(indexVal)}}\"><template case=\"true\">\t\t\t\t\t\t\t\t\t<br>\t\t\t\t\t\t\t\t\t</template></template>\t\t\t\t\t\t\t\t\t</template>\t\t\t\t\t\t\t\t</ul>\t\t\t\t\t\t\t</div>\t\t\t\t\t\t</div>\t\t\t\t\t\t</template></template>\t\t\t\t\t\t<div class=\"lyteColorPicker__palettecontainer\">\t\t\t\t\t\t\t<span class=\"lyteColorPicker__paletteheading\">{{ltPropPaletteLabel}}</span>\t\t\t\t\t\t\t<div class=\"lyteColorPicker__palette\">\t\t\t\t\t\t\t\t<div>\t\t\t\t\t\t\t\t\t<template is=\"for\" items=\"{{availableColors}}\" item=\"colorArray\" index=\"indexVal\">\t\t\t\t\t\t\t\t\t<ul class=\".lyteColorPicker__shades default__colors\">\t\t\t\t\t\t\t\t\t\t<template is=\"for\" items=\"{{colorArray}}\" item=\"color\" index=\"indexVal\">\t\t\t\t\t\t\t\t\t\t<li class=\"lyteColorPicker__colorpan\" lt-prop-title=\"{{lyteRgbToHex(color)}}\" lt-prop-tooltip-config=\"{&quot;position&quot; : &quot;bottom&quot;,&quot;showdelay&quot; : &quot;1000&quot;}\" onclick=\"{{action(&quot;selectColor&quot;, event, color)}}\">{{color}}</li>\t\t\t\t\t\t\t\t\t\t</template>\t\t\t\t\t\t\t\t\t</ul>\t\t\t\t\t\t\t\t\t</template>\t\t\t\t\t\t\t\t</div>\t\t\t\t\t\t\t</div>\t\t\t\t\t\t</div>\t\t\t\t\t\t<template is=\"if\" value=\"{{ltPropStandardColors}}\"><template case=\"true\">\t\t\t\t\t\t<div class=\"lyteColorPicker__palettecontainer\">\t\t\t\t\t\t\t<span class=\"lyteColorPicker__paletteheading\">{{lyteUiI18n(\"Standard.Colors\")}}</span>\t\t\t\t\t\t\t<div class=\"lyteColorPicker__palette\">\t\t\t\t\t\t\t\t<ul class=\"standard__colors\">\t\t\t\t\t\t\t\t\t<template is=\"for\" items=\"{{standardColorArray}}\" item=\"color\" index=\"indexVal\">\t\t\t\t\t\t\t\t\t<li class=\"lyteColorPicker__colorpan\" lt-prop-title=\"{{lyteRgbToHex(color)}}\" lt-prop-tooltip-config=\"{&quot;position&quot; : &quot;bottom&quot;,&quot;showdelay&quot; : &quot;1000&quot;}\" onclick=\"{{action(&quot;selectColor&quot;, event, color)}}\">{{color}}</li>\t\t\t\t\t\t\t\t\t</template>\t\t\t\t\t\t\t\t</ul>\t\t\t\t\t\t\t</div>\t\t\t\t\t\t</div>\t\t\t\t\t\t</template></template>\t\t\t\t\t\t<template is=\"if\" value=\"{{ltPropAdvancedColorButton}}\"><template case=\"true\">\t\t\t\t\t\t<div class=\"lyteColorPicker__navigatable lyteColorPicker__morecolorbutton\" onclick=\"{{action(&quot;goToAdvancedCP&quot;,event)}}\">\t\t\t\t\t\t\t<span class=\"lyteColorPicker__icon\">\t\t\t\t\t\t\t\t<svg viewBox=\"0 0 600 598\">\t\t\t\t\t\t\t\t\t<path d=\"{{moreColorsPath}}\"></path>\t\t\t\t\t\t\t\t</svg>\t\t\t\t\t\t\t</span>\t\t\t\t\t\t\t<span class=\"lyteColorPicker__text\" style=\"position: absolute; left: 50%; transform: translate(-50%);\">{{lyteUiI18n(\"Advanced.Colors\")}}</span>\t\t\t\t\t\t\t<span class=\"lyteColorpickerForwardArrow h-alignright\">\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t</span>\t\t\t\t\t\t</div>\t\t\t\t\t\t</template></template>\t\t\t\t\t\t<template is=\"if\" value=\"{{ltPropColorPreview}}\"><template case=\"true\">\t\t\t\t\t\t<div class=\"lyteColorPicker__colorfieldcontainer\">\t\t\t\t\t\t\t<div class=\"lyteColorPicker__colorfield\">\t\t\t\t\t\t\t\t<span class=\"lyteColorPicker__colorfieldpreview lyteColorPicker__transparentbg\">\t\t\t\t\t\t\t\t\t<div class=\"lyteColorPicker__dynamiccolor\" lt-prop-title=\"{{lyteUiI18n('Copy.Color.value.to.Clipboard')}}\" lt-prop-tooltip-config=\"{&quot;position&quot; : &quot;bottom&quot;}\" onmouseover=\"{{action(&quot;onOverColorPreviewDiv&quot;,event,&quot;fromBasic&quot;,&quot;over&quot;)}}\" onmouseout=\"{{action(&quot;onOverColorPreviewDiv&quot;,event,&quot;fromBasic&quot;,&quot;out&quot;)}}\" onclick=\"{{action(&quot;copyValueToClipboard&quot;,&quot;fromBasic&quot;)}}\">\t\t\t\t\t\t\t\t\t\t<div id=\"basciPreviewDivImg\" class=\"clipboardImg basicClipboardPos\"></div>\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t</div>\t\t\t\t\t\t\t\t</span>\t\t\t\t\t\t\t\t<input style=\"width: 157px;\" id=\"readColorValue\" class=\"lyteColorPicker__textbox h-hidecursor\" readonly=\"readonly\">\t\t\t\t\t\t\t</div>\t\t\t\t\t\t</div>\t\t\t\t\t\t</template></template>\t\t\t\t\t</div>\t\t\t\t\t</template><template case=\"false\">\t\t\t\t\t<div class=\"lyteColorPicker--advanced\">\t\t\t\t\t\t<div style=\"width: 320px;height: 258px;\">\t\t\t\t\t\t\t<div class=\"lyteColorPicker__maparea\">\t\t\t\t\t\t\t\t<div class=\"colorDiv\" id=\"colorDiv\">\t\t\t\t\t\t\t\t\t<div id=\"lyteCPImgDiv\"></div>\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<div class=\"colorSlider_palette_circle colorSlider_palette_circleBlack\"></div>\t\t\t\t\t\t\t\t</div>\t\t\t\t\t\t\t</div>\t\t\t\t\t\t\t\t\t\t\t\t\t</div>\t\t\t\t\t\t<div class=\"lyteColorPicker__previewDiv\" style=\"padding: 3px 0px !important;\">\t\t\t\t\t\t\t<div class=\"colorSlider_hue\">\t\t\t\t\t\t\t\t<div class=\"colorSlider_sliderHandle\">\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t</div>\t\t\t\t\t\t\t\t<div class=\"colorSlider_hueBar_border\">\t\t\t\t\t\t\t\t\t<div class=\"colorSlider_hueBar\"></div>\t\t\t\t\t\t\t\t</div>\t\t\t\t\t\t\t</div>\t\t\t\t\t\t\t<div class=\"previewDiv\" onmouseover=\"{{action(&quot;onOverColorPreviewDiv&quot;,event,&quot;fromAdv&quot;,&quot;over&quot;)}}\" onmouseout=\"{{action(&quot;onOverColorPreviewDiv&quot;,event,&quot;fromAdv&quot;,&quot;out&quot;)}}\" onclick=\"{{action(&quot;copyValueToClipboard&quot;,&quot;fromAdv&quot;)}}\" lt-prop-title=\"{{lyteUiI18n('Copy.Color.value.to.Clipboard')}}\" lt-prop-tooltip-config=\"{&quot;position&quot; : &quot;bottom&quot;}\">\t\t\t\t\t\t\t\t<div id=\"copyColorValueImg\" class=\"clipboardImg advClipboardPos\"></div>\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t</div>\t\t\t\t\t\t</div>\t\t\t\t\t\t<div class=\"lyteColorPicker__previewDiv\">\t\t\t\t\t\t\t<div class=\"selectFormat\">\t\t\t\t\t\t\t\t<lyte-dropdown class=\"cPDropDown\" lt-prop-yield=\"true\" lt-prop-tabindex=\"1\" on-option-selected=\"{{method(&quot;changeFormatView&quot;)}}\">\t\t\t\t\t\t\t\t\t<template is=\"registerYield\" yield-name=\"yield\">\t\t\t\t\t\t\t\t\t\t<lyte-drop-button class=\"colorPickerDD\">\t\t\t\t\t\t\t\t\t\t\t<span class=\"lyteMarginRight\">{{dropButtonValue}}</span>\t\t\t\t\t\t\t\t\t\t\t<lyte-icon class=\"dropdown\"></lyte-icon>\t\t\t\t\t\t\t\t\t\t</lyte-drop-button>\t\t\t\t\t\t\t\t\t\t<lyte-drop-box style=\"width: 83px;min-width:83px!important;\">\t\t\t\t\t\t\t\t\t\t\t<lyte-drop-body>\t\t\t\t\t\t\t\t\t\t\t\t<template is=\"for\" items=\"{{ltPropColorFormats}}\" item=\"item\" index=\"indexVal\">\t\t\t\t\t\t\t\t\t\t\t\t\t<lyte-drop-item data-value=\"{{item}}\"> {{item}} </lyte-drop-item>\t\t\t\t\t\t\t\t\t\t\t\t</template>\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t</lyte-drop-body>\t\t\t\t\t\t\t\t\t\t</lyte-drop-box>\t\t\t\t\t\t\t\t\t</template>\t\t\t\t\t\t\t\t</lyte-dropdown>\t\t\t\t\t\t\t</div>\t\t\t\t\t\t\t<div>\t\t\t\t\t\t\t\t<div class=\"showValue\"><lyte-input id=\"lyteCPShowValue\" lt-prop-type=\"text\" lt-prop-appearance=\"box\" lt-prop-value=\"#000000\" lt-prop-direction=\"vertical\"> </lyte-input></div>\t\t\t\t\t\t\t</div>\t\t\t\t\t\t</div>\t\t\t\t\t\t\t\t\t\t\t\t\t<template is=\"if\" value=\"{{moreColorOptionSelected}}\"><template case=\"true\">\t\t\t\t\t\t\t\t\t\t\t\t\t\t<div class=\"lyteColorPicker__navigatable lyteColorPicker__morecolorbutton\" onclick=\"{{action(&quot;fromAdvCPtoBasic&quot;,event)}}\">\t\t\t\t\t\t\t\t<span class=\"lyteColorpickerBackwardArrow\"></span>\t\t\t\t\t\t\t\t<span class=\"lyteColorPicker__icon h-alignright\" style=\"    margin-top: 1px;\">\t\t\t\t\t\t\t\t\t<svg viewBox=\"0 0 600 598\">\t\t\t\t\t\t\t\t\t\t<path d=\"{{moreColorsPath}}\"></path>\t\t\t\t\t\t\t\t\t</svg>\t\t\t\t\t\t\t\t</span>\t\t\t\t\t\t\t\t<span class=\"lyteColorPicker__text lyteColorpickerText\">{{lyteUiI18n(\"Back.to.Basic.Colors\")}}</span>\t\t\t\t\t\t\t</div>\t\t\t\t\t\t\t</template><template case=\"false\">\t\t\t\t\t\t\t<div class=\"lyteColorPicker__commandbar\">\t\t\t\t\t\t\t\t<lyte-button lt-prop-appearance=\"primary\" style=\"float: right;\" onclick=\"{{action(&quot;closeColorPicker&quot;,event)}}\">\t\t\t\t\t\t\t\t\t<template is=\"registerYield\" yield-name=\"text\">Close</template>\t\t\t\t\t\t\t\t</lyte-button>\t\t\t\t\t\t\t</div>\t\t\t\t\t\t\t</template></template>\t\t\t\t\t\t\t\t\t\t\t</div>\t\t\t\t\t</template></template>\t\t\t\t</lyte-popover-content>\t\t\t</template>\t\t</lyte-popover>\t</template></template></template>",
_dynamicNodes : [{"type":"attr","position":[1]},{"type":"if","position":[1],"cases":{"true":{"dynamicNodes":[{"type":"attr","position":[1,1]},{"type":"if","position":[1,1],"cases":{"true":{"dynamicNodes":[{"type":"text","position":[1,1,0]}]}},"default":{}},{"type":"attr","position":[1,3,1]},{"type":"if","position":[1,3,1],"cases":{"true":{"dynamicNodes":[{"type":"attr","position":[1,1]},{"type":"if","position":[1,1],"cases":{"true":{"dynamicNodes":[{"type":"attr","position":[1]},{"type":"attr","position":[1,1,1,1]},{"type":"text","position":[1,3,0]}]}},"default":{}},{"type":"attr","position":[1,3]},{"type":"if","position":[1,3],"cases":{"true":{"dynamicNodes":[{"type":"text","position":[1,1,0]},{"type":"attr","position":[1,3,1,1]},{"type":"for","position":[1,3,1,1],"dynamicNodes":[{"type":"attr","position":[1]},{"type":"text","position":[1,0]},{"type":"attr","position":[3]},{"type":"if","position":[3],"cases":{"true":{"dynamicNodes":[]}},"default":{}}]}]}},"default":{}},{"type":"text","position":[1,5,1,0]},{"type":"attr","position":[1,5,3,1,1]},{"type":"for","position":[1,5,3,1,1],"dynamicNodes":[{"type":"attr","position":[1,1]},{"type":"for","position":[1,1],"dynamicNodes":[{"type":"attr","position":[1]},{"type":"text","position":[1,0]}]}]},{"type":"attr","position":[1,7]},{"type":"if","position":[1,7],"cases":{"true":{"dynamicNodes":[{"type":"text","position":[1,1,0]},{"type":"attr","position":[1,3,1,1]},{"type":"for","position":[1,3,1,1],"dynamicNodes":[{"type":"attr","position":[1]},{"type":"text","position":[1,0]}]}]}},"default":{}},{"type":"attr","position":[1,9]},{"type":"if","position":[1,9],"cases":{"true":{"dynamicNodes":[{"type":"attr","position":[1]},{"type":"attr","position":[1,1,1,1]},{"type":"text","position":[1,3,0]}]}},"default":{}},{"type":"attr","position":[1,11]},{"type":"if","position":[1,11],"cases":{"true":{"dynamicNodes":[{"type":"attr","position":[1,1,1,1]}]}},"default":{}}]},"false":{"dynamicNodes":[{"type":"attr","position":[1,3,3]},{"type":"attr","position":[1,5,1,1]},{"type":"registerYield","position":[1,5,1,1,1],"dynamicNodes":[{"type":"text","position":[1,1,0]},{"type":"componentDynamic","position":[1,3]},{"type":"componentDynamic","position":[1]},{"type":"attr","position":[3,1,1]},{"type":"for","position":[3,1,1],"dynamicNodes":[{"type":"attr","position":[1]},{"type":"text","position":[1,1]},{"type":"componentDynamic","position":[1]}]},{"type":"componentDynamic","position":[3,1]},{"type":"componentDynamic","position":[3]}]},{"type":"componentDynamic","position":[1,5,1,1]},{"type":"componentDynamic","position":[1,5,3,1,0]},{"type":"attr","position":[1,7]},{"type":"if","position":[1,7],"cases":{"true":{"dynamicNodes":[{"type":"attr","position":[1]},{"type":"attr","position":[1,3,1,1]},{"type":"text","position":[1,5,0]}]},"false":{"dynamicNodes":[{"type":"attr","position":[0]},{"type":"if","position":[0],"cases":{"true":{"dynamicNodes":[{"type":"attr","position":[1,1]},{"type":"registerYield","position":[1,1,1],"dynamicNodes":[]},{"type":"componentDynamic","position":[1,1]}]}},"default":{}}]}},"default":{}}]}},"default":{}}]},"false":{"dynamicNodes":[{"type":"attr","position":[1]},{"type":"registerYield","position":[1,1],"dynamicNodes":[{"type":"attr","position":[1]},{"type":"if","position":[1],"cases":{"true":{"dynamicNodes":[{"type":"text","position":[1,1,0]},{"type":"attr","position":[1,3]},{"type":"if","position":[1,3],"cases":{"true":{"dynamicNodes":[{"type":"attr","position":[1]}]}},"default":{}},{"type":"componentDynamic","position":[1]}]}},"default":{}},{"type":"attr","position":[3,1]},{"type":"if","position":[3,1],"cases":{"true":{"dynamicNodes":[{"type":"attr","position":[1,1]},{"type":"if","position":[1,1],"cases":{"true":{"dynamicNodes":[{"type":"attr","position":[1]},{"type":"attr","position":[1,1,1,1]},{"type":"text","position":[1,3,0]}]}},"default":{}},{"type":"attr","position":[1,3]},{"type":"if","position":[1,3],"cases":{"true":{"dynamicNodes":[{"type":"text","position":[1,1,0]},{"type":"attr","position":[1,3,1,1]},{"type":"for","position":[1,3,1,1],"dynamicNodes":[{"type":"attr","position":[1]},{"type":"text","position":[1,0]},{"type":"attr","position":[3]},{"type":"if","position":[3],"cases":{"true":{"dynamicNodes":[]}},"default":{}}]}]}},"default":{}},{"type":"text","position":[1,5,1,0]},{"type":"attr","position":[1,5,3,1,1]},{"type":"for","position":[1,5,3,1,1],"dynamicNodes":[{"type":"attr","position":[1,1]},{"type":"for","position":[1,1],"dynamicNodes":[{"type":"attr","position":[1]},{"type":"text","position":[1,0]}]}]},{"type":"attr","position":[1,7]},{"type":"if","position":[1,7],"cases":{"true":{"dynamicNodes":[{"type":"text","position":[1,1,0]},{"type":"attr","position":[1,3,1,1]},{"type":"for","position":[1,3,1,1],"dynamicNodes":[{"type":"attr","position":[1]},{"type":"text","position":[1,0]}]}]}},"default":{}},{"type":"attr","position":[1,9]},{"type":"if","position":[1,9],"cases":{"true":{"dynamicNodes":[{"type":"attr","position":[1]},{"type":"attr","position":[1,1,1,1]},{"type":"text","position":[1,3,0]}]}},"default":{}},{"type":"attr","position":[1,11]},{"type":"if","position":[1,11],"cases":{"true":{"dynamicNodes":[{"type":"attr","position":[1,1,1,1]}]}},"default":{}}]},"false":{"dynamicNodes":[{"type":"attr","position":[1,3,3]},{"type":"attr","position":[1,5,1,1]},{"type":"registerYield","position":[1,5,1,1,1],"dynamicNodes":[{"type":"text","position":[1,1,0]},{"type":"componentDynamic","position":[1,3]},{"type":"componentDynamic","position":[1]},{"type":"attr","position":[3,1,1]},{"type":"for","position":[3,1,1],"dynamicNodes":[{"type":"attr","position":[1]},{"type":"text","position":[1,1]},{"type":"componentDynamic","position":[1]}]},{"type":"componentDynamic","position":[3,1]},{"type":"componentDynamic","position":[3]}]},{"type":"componentDynamic","position":[1,5,1,1]},{"type":"componentDynamic","position":[1,5,3,1,0]},{"type":"attr","position":[1,7]},{"type":"if","position":[1,7],"cases":{"true":{"dynamicNodes":[{"type":"attr","position":[1]},{"type":"attr","position":[1,3,1,1]},{"type":"text","position":[1,5,0]}]},"false":{"dynamicNodes":[{"type":"attr","position":[1,1]},{"type":"registerYield","position":[1,1,1],"dynamicNodes":[]},{"type":"componentDynamic","position":[1,1]}]}},"default":{}}]}},"default":{}},{"type":"componentDynamic","position":[3]}]},{"type":"componentDynamic","position":[1]}]}},"default":{}}],
_observedAttributes :["ltPropShow","ltPropShowTitle","ltPropTitle","ltPropCloseButton","ltPropDraggable","ltPropCloseOnBodyClick","ltPropCloseOnSelection","ltPropAdvancedColorButton","ltPropAppearance","ltPropColorPreview","ltPropStandardColors","ltPropUsedColors","ltPropBasicColorPicker","ltPropSelectedColor","ltPropOriginElement","ltPropWrapperClass","moreColorOptionSelected","ltPropCurrentRgbCode","ltPropBoundry","ltPropScrollable","ltPropNoFillButton","ltPropNoFillLabel","ltPropPaletteLabel","ltPropInline","ltPropColorFormats","availableColors","usedColors","standardColorArray","polygonPoints","noFillPath","moreColorsPath","currentHue","currentBrightness","currentSaturation","paletteSize","circleOffsetSize","circleOffsetBecauseOfWinWidget","posdivElPalette","dragStatus","paletteMaxX","paletteMaxY","okToSelect","clickOnPaletteInProgress","component","hueStatus","poxYHue","poxXHue","dropButtonValue","basicDimensions","advCPDimensions","changedColor"],
	data : function(){
		return {
			//Component Variables
			"ltPropShow" : Lyte.attr("boolean",{"default" : false}),
			"ltPropShowTitle" : Lyte.attr("boolean",{"default" : true}),
			"ltPropTitle" : Lyte.attr("string",{"default" : ""}),
			"ltPropCloseButton" : Lyte.attr("boolean",{"default" : true}),
			"ltPropDraggable" : Lyte.attr("boolean",{"default" : false}),
			"ltPropCloseOnBodyClick" : Lyte.attr("boolean",{"default" : true}),
			"ltPropCloseOnSelection" : Lyte.attr("boolean",{"default" : false}),
			"ltPropAdvancedColorButton" : Lyte.attr("boolean",{"default" : true}),
			"ltPropAppearance" : Lyte.attr("string",{"default" : "callout"}),
			"ltPropColorPreview" : Lyte.attr("boolean",{"default" : true}),
			"ltPropStandardColors" : Lyte.attr("boolean",{"default" : true}),
			"ltPropUsedColors" : Lyte.attr("boolean",{"default" : true}),
			"ltPropBasicColorPicker" : Lyte.attr("boolean",{"default" : true}),
			"ltPropSelectedColor" : Lyte.attr("object",{"default" : null}),
			"ltPropOriginElement" : Lyte.attr("string",{"default" : ""}),
			"ltPropWrapperClass" : Lyte.attr("string",{"default":"lyteColorPickerPopover"}),
			"moreColorOptionSelected" : Lyte.attr("boolean",{"default" : false}),
			"ltPropCurrentRgbCode" : Lyte.attr("string",{ "default" : "90c3d4"}),
			"ltPropBoundry" : Lyte.attr("object",{"default" : null}),
			"ltPropScrollable":Lyte.attr("boolean",{"default": true}),
			"ltPropNoFillButton":Lyte.attr("boolean",{"default":false}),
			"ltPropNoFillLabel":Lyte.attr("string",{"default":""}),
			"ltPropPaletteLabel": Lyte.attr("string",{"default":""}),
			"ltPropInline" : Lyte.attr("boolean",{"default" : false}),
			"ltPropColorFormats" : Lyte.attr("array",{"default" : ["HEX","RGB","HSV","CMYK"]}),

			//Local variables
			"availableColors" : Lyte.attr("array",{"default" : []}),
			"usedColors" : Lyte.attr("array",{"default" : []}),
			"standardColorArray" : Lyte.attr("array",{"default" : []}),
			"polygonPoints" : Lyte.attr("string",{"default" : "4.4,10.3 3.7,9.6 6.7,6.5 3.6,3.4 4.4,2.7 8.1,6.5"}),
			"noFillPath" : Lyte.attr("string",{"default" : "M8,0C3.6,0,0,3.6,0,8s3.6,8,8,8s8-3.6,8-8S12.4,0,8,0z M8,1c1.8,0,3.3,0.7,4.6,1.7l-9.9,9.9C1.7,11.3,1,9.8,1,8 C1,4.1,4.1,1,8,1z M8,15c-1.8,0-3.3-0.7-4.6-1.7l9.9-9.9C14.3,4.7,15,6.2,15,8C15,11.9,11.9,15,8,15z"}),
			"moreColorsPath" : Lyte.attr("string", {"default" : "M299.7-0.2C128.3-0.2-7,134,0.2,305.2C7.4,476.9,138,577.3,259.7,595.9c88.2,13.4,107.8-45.1,87.3-67.3 c-35.5-38.3-22.6-68.6-7.3-82.5c17.4-15.7,50.3-17.3,77.3-13.8c65.5,8.5,175-40,182.2-144.8C611,116.5,471.1-0.2,299.7-0.2z M118.1,299.7c-27.7,0-50.1-22.4-50.1-50.1c0-27.7,22.4-50.1,50.1-50.1c27.7,0,50.1,22.4,50.1,50.1 C168.2,277.3,145.8,299.7,118.1,299.7z M217.6,166.6c-27.7,0-50.1-22.4-50.1-50.1c0-27.7,22.4-50.1,50.1-50.1 c27.7,0,50.1,22.4,50.1,50.1C267.7,144.1,245.2,166.6,217.6,166.6z M384.9,166.9c-27.7,0-50.1-22.4-50.1-50.1 c0-27.7,22.4-50.1,50.1-50.1c27.7,0,50.1,22.4,50.1,50.1C435,144.4,412.6,166.9,384.9,166.9z M485.2,299.9 c-27.7,0-50.1-22.4-50.1-50.1c0-27.7,22.4-50.1,50.1-50.1c27.7,0,50.1,22.4,50.1,50.1C535.2,277.5,512.8,299.9,485.2,299.9z"}),
			

			//AdvColorPicker Local Variables
			"currentHue" : Lyte.attr("number",{ "default" : 0}),
			"currentBrightness" : Lyte.attr("number",{ "default" : 100}),
			"currentSaturation" : Lyte.attr("number",{ "default" : 100}),
			"paletteSize" : Lyte.attr("object",{ "default" : {'height':256,'width':320}}),
			"circleOffsetSize" : Lyte.attr("number",{ "default" : 6}),
			"circleOffsetBecauseOfWinWidget" : Lyte.attr("number",{ "default" : 0}),
			"posdivElPalette" : Lyte.attr("object",{ "default" : {}}),
			"dragStatus" : Lyte.attr("number",{ "default" : 0}),
			"paletteMaxX" : Lyte.attr("number",{ "default" : 0}),
			"paletteMaxY" : Lyte.attr("number",{ "default" : 0}),
			"okToSelect" : Lyte.attr("boolean",{ "default" : true}),
			"clickOnPaletteInProgress" : Lyte.attr("boolean",{ "default" : false}),
			"component" : Lyte.attr("object",{"default" : null}),
			"hueStatus" : Lyte.attr("number",{ "default" : 0}),
			"poxYHue" : Lyte.attr("number", { "default" : 0}),
			"poxXHue" : Lyte.attr("number", { "default" : 0}),
			"dropButtonValue" : Lyte.attr("string",{"default" : "HEX"}),
			"basicDimensions" : Lyte.attr("object",{"default" : {"width" : 252,"height" : 568}}),
			"advCPDimensions" : Lyte.attr("object",{"default" : {"width" : 322,"height" : 393}}),
			"changedColor" : Lyte.attr("object")
		}		
	},
	init : function(){
		var availableColors = [['rgb(255, 255, 255)', 'rgb(239, 22, 22)', 'rgb(239, 130, 22)', 'rgb(239, 177, 22)', 'rgb(93, 195, 90)', 'rgb(56, 215, 187)', 'rgb(22, 208, 239)', 'rgb(57, 142, 243)', 'rgb(197, 22, 239)', 'rgb(239, 22, 111)'],
								['rgb(230, 230, 230)', 'rgb(253, 232, 232)', 'rgb(253, 243, 232)', 'rgb(253, 247, 232)', 'rgb(239, 249, 239)', 'rgb(235, 251, 248)', 'rgb(232, 250, 253)', 'rgb(235, 244, 254)', 'rgb(249, 232, 253)', 'rgb(253, 232, 241)'],
								['rgb(204, 204, 204)', 'rgb(252, 208, 208)', 'rgb(252, 230, 208)', 'rgb(252, 239, 208)', 'rgb(223, 243, 222)', 'rgb(215, 247, 241)', 'rgb(208, 246, 252)', 'rgb(215, 232, 253)', 'rgb(243, 208, 252)', 'rgb(252, 208, 226)'],
								['rgb(153, 153, 153)', 'rgb(249, 162, 162)', 'rgb(249, 205, 162)', 'rgb(249, 224, 162)', 'rgb(190, 231, 189)', 'rgb(175, 239, 228)', 'rgb(162, 236, 249)', 'rgb(176, 210, 250)', 'rgb(232, 162, 249)', 'rgb(249, 162, 197)'],
								['rgb(102, 102, 102)', 'rgb(245, 115, 115)', 'rgb(245, 180, 115)', 'rgb(245, 208, 115)', 'rgb(158, 219, 156)', 'rgb(136, 231, 214)', 'rgb(115, 227, 245)', 'rgb(136, 187, 248)', 'rgb(220, 115, 245)', 'rgb(245, 115, 169)'],
								['rgb(51, 51, 51)', 'rgb(242, 69, 69)', 'rgb(242, 155, 69)', 'rgb(242, 193, 69)', 'rgb(125, 207, 123)', 'rgb(96, 223, 201)', 'rgb(69, 217, 242)', 'rgb(97, 165, 245)', 'rgb(209, 69, 242)', 'rgb(242, 69, 140)'],
								['rgb(25, 25, 25)', 'rgb(171, 12, 12)', 'rgb(171, 91, 12)', 'rgb(171, 125, 12)', 'rgb(56, 146, 53)', 'rgb(32, 158, 136)', 'rgb(12, 148, 171)', 'rgb(12, 97, 198)', 'rgb(140, 12, 171)', 'rgb(171, 12, 77)'],
								['rgb(0, 0, 0)', 'rgb(73, 5, 5)', 'rgb(73, 39, 5)', 'rgb(73, 54, 5)', 'rgb(24, 63, 23)', 'rgb(14, 68, 58)', 'rgb(5, 64, 73)', 'rgb(5, 42, 85)', 'rgb(60, 5, 73)', 'rgb(73, 5, 33)']];
		var standardColorArray = ['rgb(192, 0, 0)','rgb(255, 0, 0)','rgb(255, 192, 0)','rgb(255, 255, 0)','rgb(146, 208, 80)','rgb(0, 176, 80)','rgb(0, 176, 240)','rgb(0, 112, 192)','rgb(0, 32, 96)','rgb(112, 48, 160)'];
		this.setData('availableColors', availableColors);
		this.setData('standardColorArray', standardColorArray);
	},
	
	showColorPicker : function(){
		// debugger
		if(!this.getData('ltPropTitle')){
			this.setData('ltPropTitle',_lyteUiUtils.i18n("Choose.Color"));
		}
		if(!this.getData('ltPropNoFillLabel')){
			this.setData('ltPropNoFillLabel',_lyteUiUtils.i18n("No.Fill"));
		}
		if(!this.getData('ltPropPaletteLabel')){
			this.setData('ltPropPaletteLabel',_lyteUiUtils.i18n("Theme.Colors"));
		}
		if(this.getData('ltPropInline')){
			this.$node.style.display = "block";
			var div = this.$node.querySelector('.lyteColorPicker');
			if(this.getData('ltPropBasicColorPicker')){
				if(this.getData('ltPropColorFormats').length > 0){
					this.setData('dropButtonValue' , this.getData('ltPropColorFormats')[0]);
				}
				// div.style.height = this.getData('basicDimensions').height + "px";
				div.style.width = this.getData('basicDimensions').width + "px";
				this.initializeBasicColorPicker(event || window.event,this.$node);
			}
			else{
				div.style.width = this.getData('advCPDimensions').width + "px";
				this.initializeAdvColorPicker(event || window.event,this.$node);
			}
		}
		else{
			if(this.getData('ltPropShow')){
				if(this.getData('ltPropColorFormats').length > 0){
					this.setData('dropButtonValue' , this.getData('ltPropColorFormats')[0]);
				}
				this.$node.querySelector('.popColorPicker').ltProp("showCloseButton",false);
				if(this.getData('ltPropBoundry')){
					this.$node.querySelector('.popColorPicker').ltProp("boundry",this.getData('ltPropBoundry'));
				}
				this.$node.querySelector('.popColorPicker').ltProp({
					"originElem" : this.getData("ltPropOriginElement"),
					"wrapperClass" : this.getData("ltPropWrapperClass"),
					"type" : this.getData("ltPropAppearance"),
					"closeOnBodyClick" : false,
					"freeze" : false,
					"scrollable" : this.getData("ltPropScrollable"),
					"draggable" : false,
					"show" : true
				});
				this.executeOnBeforeOpen();
			}
			else{
				var ele = document.querySelector('.'+this.getData('ltPropWrapperClass'));
				if(ele && ele.classList.contains('lyteColorpickerVisible')){
					ele.classList.remove('lyteColorpickerVisible');
				}
				this.$node.querySelector('.popColorPicker').ltProp('show',false);
			}
		}
		this.setData('component',this);
	}.observes('ltPropShow').on('didConnect'),

	setColorPreviewAndValue : function(ele,color){
		if(color == "transparent"){
			ele.querySelector('.lyteColorPicker__dynamiccolor').style.backgroundImage = "url('/bower_components/ui-components/components/images/transparent.png')";
		}
		else{
			ele.querySelector('.lyteColorPicker__dynamiccolor').style.backgroundImage = "none";
		}
		ele.querySelector('.lyteColorPicker__dynamiccolor').style.backgroundColor = color;
		ele.querySelector('#readColorValue').value = color;
	},

	initializeAdvColorPicker : function(event,ele){
		var imageObj = ele.querySelector('#lyteCPImgDiv')
		var divElPalette = ele.querySelector('#colorDiv');
		var divElPaletteCircle = ele.querySelector('.colorSlider_palette_circle');
        ele.querySelector('.selectFormat .lyteDummyEventContainer').style.minWidth = "90px";
		
		//Adding Events to the elements
		if(!ColorPicker_EventUtil.__eventBound){
			document.addEventListener('mousemove',function(event){
				ColorPicker_EventUtil.__moveOnPalette(event,ColorPicker_Util.component);
			});
			document.addEventListener('mousemove',function(event){
				ColorPicker_EventUtil.__moveOnHueBar(event,ColorPicker_Util.component);
			});
			document.addEventListener('mouseup',function(event){
				ColorPicker_EventUtil.__endDrag(event,ColorPicker_Util.component);
			});
	        ColorPicker_EventUtil.__eventBound = true;
		}
		ele.querySelector('.colorSlider_hue').addEventListener('mousedown', function(event){
			ColorPicker_Util.component = ColorPicker_Util.getColorPicker(event.target).component;
			return ColorPicker_EventUtil.__initHueMove(event,ColorPicker_Util.component /*document.documentElement.querySelector('lyte-colorpicker').component.getData('component')*/);
		});
		divElPalette.addEventListener('mousedown',function(event){
			ColorPicker_Util.component = ColorPicker_Util.getColorPicker(event.target).component;
			return ColorPicker_EventUtil.__initPaletteMove(event,ColorPicker_Util.component /*document.documentElement.querySelector('lyte-colorpicker').component.getData('component')*/);
		});
		ele.querySelector('.colorSlider_hueBar').addEventListener('mousedown', function(event) {
			ColorPicker_Util.component = ColorPicker_Util.getColorPicker(event.target).component;
            ColorPicker_EventUtil.__moveOnHueBar(event,ColorPicker_Util.component);
        });
		this.setRgbColor("#"+this.getData("ltPropCurrentRgbCode"));
		ele = null;
		divElPalette = null;
		divElPaletteCircle = null;
		imageObj = null;
	},

	
	initializeBasicColorPicker : function(event,ele){
		var liELes = ele.querySelectorAll('.default__colors > li');
		for(var v =0; v<liELes.length ; v++){
			liELes[v].style.background = liELes[v].textContent;
		}
		if(this.getData('ltPropStandardColors')){
			liELes = ele.querySelectorAll('.standard__colors > li');
			for(var v =0; v<liELes.length ; v++){
				liELes[v].style.background = liELes[v].textContent;
			}
		}
		if(this.getData('ltPropUsedColors')){
			liELes = ele.querySelectorAll('.used__colors > li');
			for(var v =0; v<liELes.length ; v++){
				liELes[v].style.background = liELes[v].textContent;
			}
		}
		if(this.getData('ltPropColorPreview')){
			if(this.getData('ltPropCurrentRgbCode')){
				var color = ColorPicker_Util.getRgbColorsByRgbCode(this.getData('ltPropCurrentRgbCode'));
				this.setColorPreviewAndValue(ele,"rgb("+color.red+", "+color.green+", "+color.blue+")");
			}
		}
		liELes = null;
	},

	executeOnBeforeOpen : function(){
		if(this.getMethods('onBeforeOpen')){
			this.executeMethod('onBeforeOpen',this);
		}
	},

	executeOnSelect : function(event){
		if(this.getMethods("onSelect")){
			this.executeMethod("onSelect",event,this.getData('ltPropSelectedColor'));	
		}
		if(this.getData('ltPropCloseOnSelection')){
			this.executeOnClose(event);
			this.setData('ltPropShow',false);
		}
	},

	executeOnOpen : function(){
		if(this.getMethods('onOpen')){
			this.executeMethod('onOpen');
		}
	},

	executeOnClose : function(event){
		if(this.getMethods('onClose')){
			this.executeMethod('onClose',event);
		}
	},

	executeOnChange : function(){
		var rgbColor = ColorPicker_Util.getRgbColorsByRgbCode(this.getData('ltPropCurrentRgbCode'));
        var selectedColor = {
        	"hex" : "#"+this.getData('ltPropCurrentRgbCode'),
        	"rgb" : "rgb("+rgbColor.red+", "+rgbColor.green+", "+rgbColor.blue+")"
        };
        this.setData("ltPropSelectedColor",selectedColor);
		if(this.getMethods('onChange')){
			this.executeMethod('onChange',event,selectedColor);
		}
	},

	/*----------------- Start of Utility Methods for Color Picker ---------------*/

	setRgbColor : function(rgbColor) {
        var hsv = ColorPicker_Util.getHsvByRgbCode(rgbColor);
        this.setData('currentHue', hsv.hue);
        this.setData('currentBrightness', hsv.brightness * 100);
        this.setData('currentSaturation', hsv.saturation * 100);
        this.__changeViewAfterColorChange();
    },

    __changeViewAfterColorChange : function() {
        this.__setCurrentRgbCode();
        this.__setPaletteBgColor();
        this.__setSliderPos();
        this.__setBgColorPreviewDiv();
        this.__updateRgbInForm();
        /*this.__updateHsvInForm();*/
        this.__setSmallCirclePosition();
    },
	__setCurrentRgbCode : function() {
        this.setData('ltPropCurrentRgbCode', ColorPicker_Util.getRgbCodeByHsv(this.getData('currentHue'), this.getData('currentSaturation') / 100, this.getData('currentBrightness') / 100));
    },

    __setPaletteBgColor : function() {
        try {
        	if(this.getData('ltPropInline')){
        		this.$node.querySelector('#colorDiv').style.backgroundColor = '#' + ColorPicker_Util.getRgbCodeByHsv(this.getData('currentHue'), 1, 1);
        	}
        	else{
            	this.childComp.querySelector('#colorDiv').style.backgroundColor = '#' + ColorPicker_Util.getRgbCodeByHsv(this.getData('currentHue'), 1, 1);
        	}
        } catch (e) {}
    },

    __setSliderPos: function() {
        var leftPos = Math.round(this.getData('paletteSize').height - ((this.getData('currentHue') / 360) * this.getData('paletteSize').height));
        if(this.getData('ltPropInline')){
        	this.$node.querySelector('.colorSlider_sliderHandle').style.left = leftPos - 9 + "px";
        }
        else{
        	this.childComp.querySelector('.colorSlider_sliderHandle').style.left = leftPos - 9 + "px";
        }
    },

    __setSmallCirclePosition : function() {
    	var currentBrightness = this.getData('currentBrightness');
    	var currentSaturation = this.getData('currentSaturation');
    	var paletteSize = this.getData('paletteSize');
    	var circleOffsetSize = this.getData('circleOffsetSize');
    	var divElPaletteCircle = this.getData('ltPropInline') ? this.$node.querySelector('.colorSlider_palette_circle') : this.childComp.querySelector('.colorSlider_palette_circle');
        var leftPos = Math.round(currentSaturation * (paletteSize.width / 100)) - circleOffsetSize;
        var topPos = paletteSize.height - Math.round(currentBrightness * (paletteSize.height / 100)) - circleOffsetSize;
        divElPaletteCircle.style.left = leftPos + 'px';
        divElPaletteCircle.style.top = topPos + 'px';
        divElPaletteCircle.className = divElPaletteCircle.className.replace('colorSlider_palette_circleBlack', '');
        if (currentBrightness > 80) {
            divElPaletteCircle.className = divElPaletteCircle.className + 'colorSlider_palette_circleBlack';
        }
        divElPaletteCircle = null;
    },

    __setTextSelOk : function(okToS) {
        this.setData('okToSelect', okToS);
    },

    __ffHackWinWidget : function() {
    	var ele = this.getData('ltPropInline') ? this.$node : this.childComp;
        if (ele.querySelector('.lyteColorPicker--advanced').parentNode.className && ele.querySelector('.lyteColorPicker--advanced').parentNode.className.indexOf('windowContent') >= 0 && !document.all) {
            this.setData('circleOffsetBecauseOfWinWidget', 0);
        }
    },

    __setBgColorPreviewDiv : function() {
    	if(this.getData('ltPropInline')){
    		this.$node.querySelector('.previewDiv').style.backgroundColor = '#' + this.getData('ltPropCurrentRgbCode');
    	}
    	else{
    		this.childComp.querySelector('.previewDiv').style.backgroundColor = '#' + this.getData('ltPropCurrentRgbCode');
    	}
    },

    __updateRgbInForm : function(){
    	var ele = this.getData('ltPropInline') ? this.$node : this.childComp;
    	var format = ele.querySelector('.selectFormat').querySelector('lyte-dropdown').getData('ltPropSelected');
    	this.setData('dropButtonValue',format);
    	if(format === "HEX"){
    		ele.querySelector('#lyteCPShowValue').component.$node.ltProp("value",("#" + this.getData("ltPropCurrentRgbCode")));
    	}
    	else if(format === "RGB"){
    		var rgbColor = ColorPicker_Util.getRgbColorsByRgbCode(this.getData("ltPropCurrentRgbCode"));
    		ele.querySelector('#lyteCPShowValue').component.$node.ltProp("value",("rgb("+rgbColor.red+","+rgbColor.green+","+rgbColor.blue+")"));
    	}
    	else if(format === "HSV"){
    		var hue = Math.round(this.getData('currentHue'));
    		var saturation = Math.round(this.getData('currentSaturation'));
    		var valueBrightness = Math.round(this.getData('currentBrightness'));
    		ele.querySelector('#lyteCPShowValue').component.$node.ltProp("value",("hsv("+hue+"°,"+saturation+"%,"+valueBrightness+"%)"));
    	}
    	else if(format === "CMYK"){
    		var rgbColor = ColorPicker_Util.getRgbColorsByHsv(this.getData('currentHue'), this.getData('currentSaturation') / 100, this.getData('currentBrightness') / 100);
    		var cmykColors = ColorPicker_Util.getCmykByRgbColors([rgbColor.red,rgbColor.green,rgbColor.blue]);
    		ele.querySelector('#lyteCPShowValue').component.$node.ltProp("value",("cmyk("+Math.round(cmykColors[0]*100)+"%,"+Math.round(cmykColors[1]*100)+"%,"+Math.round(cmykColors[2]*100)+"%,"+Math.round(cmykColors[3]*100)+"%)"));
    	}
    },

	/*----------------- End of Utility Methods for Color Picker ---------------*/

	methods : {
		closePopColorPicker : function(){
			this.executeOnClose();
			if(this.getData('moreColorOptionSelected')){
				this.setData('moreColorOptionSelected',false);
			}
			this.setData('ltPropShow',false);
		},
		showColorPickerPopover : function(){
			// debugger
			this.childComp = this.$node.querySelector('lyte-popover').component.childComp;
			var ele = document.querySelector('.'+this.getData('ltPropWrapperClass'));
			ele.classList.add('lyteColorpickerVisible');

			//Check the used colors are properly rendered
			if(this.getData('ltPropUsedColors') && (ele.querySelectorAll('.used__colors > li').length < this.getData('usedColors').length)){
				this.setData('ltPropBasicColorPicker',false);
				this.setData('ltPropBasicColorPicker',true);
			}
			//Sometimes the content is not properly rendered when the 
			var headerHeight = ele.querySelector('lyte-popover-header') ? ele.querySelector('lyte-popover-header').getBoundingClientRect().height : 0;
			var contentHeight = this.getData('ltPropBasicColorPicker') ? ele.querySelector('.lyteColorPicker__default').getBoundingClientRect().height : ele.querySelector('.lyteColorPicker--advanced').getBoundingClientRect().height;
			if(this.getData('ltPropBasicColorPicker')){
				ele.querySelector('lyte-popover-content').style.height = contentHeight + "px";
				ele.querySelector('lyte-popover-content').style.maxHeight = contentHeight + "px";
				ele.querySelector('.lytePopover').style.height = (headerHeight + contentHeight + 2) + "px";
				this.initializeBasicColorPicker(event,ele);	
			}
			else{
				ele.querySelector('lyte-popover-content').style.height = contentHeight + "px";
				ele.querySelector('lyte-popover-content').style.maxHeight = contentHeight + "px";
				ele.querySelector('.lytePopover').style.height = (headerHeight + contentHeight + 2) + "px";
				this.initializeAdvColorPicker(event,ele);
			}
			if(this.getData('ltPropDraggable')){
				var drag = ele.querySelector('.lytePopover');
				var handle = ele.querySelector('lyte-popover-header') || ele.querySelector('lyte-popover-content');
				drag.id = "draggableColor";
				handle.id = "draghandle";
				$L('#draggableColor').draggable({
					handle : ['#draghandle']
				})
			}
			this.$node.querySelector('lyte-popover').component.computeOffsetImpl();
			this.executeOnOpen();
			ele = null;
		},

		changeFormatView : function(e,value){
			if(e.currentTarget.tagName == 'LYTE-DROP-BOX'){
	    		this.__updateRgbInForm();
			}
	    }
	},

	actions : {
		selectColor : function(event,color){
			var ele;
			var node;
			if(this.getData('ltPropInline')){
				ele = this.$node.querySelector('.lyteColorPicker');
				node = ele.querySelector('.lyteCPSelectedColor');
			}
			else{
				ele = document.querySelector('.'+this.getData('ltPropWrapperClass'));
				node = ele.querySelector('.lyteCPSelectedColor');
			}
			if(node){
				node.classList.remove('lyteCPSelectedColor');
			}
			event.target.classList.add('lyteCPSelectedColor');
			var colors = this.getData('usedColors');
			if(colors.indexOf(color) != -1){
				colors.splice(colors.indexOf(color), 1);
			}
			colors.push(color);
			this.setData('usedColors',colors);
			if(this.getData('ltPropColorPreview')){
				this.setColorPreviewAndValue(ele,color);
			}
			var rgbColor = color.substring(4,color.length-1).split(",");
			var selectedColor = {
				"hex" : ("#" + ColorPicker_Util.getRgbCodeByRgbColors(rgbColor[0],rgbColor[1],rgbColor[2])),
				"rgb" : color
			};
			this.setData('ltPropCurrentRgbCode',selectedColor.hex.substring(1));
			this.setData('ltPropSelectedColor',selectedColor);
			this.executeOnSelect(event);
		},

		goToAdvancedCP : function(event){
			var ele;
			var color = this.getData('ltPropSelectedColor');
			if(color != null){
				this.setData("ltPropCurrentRgbCode",color.hex ? color.hex.substring(1) : "FF0000");
			}
			this.setData('moreColorOptionSelected',true);
			var advCPDimensions = this.getData('advCPDimensions');
			if(this.getData('ltPropInline')){
				ele = this.$node.querySelector('.lyteColorPicker');
				ele.style.width = advCPDimensions.width + "px";
				this.setData('ltPropBasicColorPicker',false);
			}
			else{
				ele = document.querySelector('.'+this.getData('ltPropWrapperClass'));
				var popOver = ele.querySelector('.lytePopover');
				var popOverOffset = popOver.getBoundingClientRect();
				var headerHeight = popOver.querySelector('lyte-popover-header') ? popOver.querySelector('lyte-popover-header').getBoundingClientRect() : {};
				var height;
				var usedColorsHeight;
				if(this.getData('ltPropUsedColors')){
					usedColorsHeight = popOver.querySelector('.usedColor__container').getBoundingClientRect().height;
					height = popOverOffset.height - usedColorsHeight;
					usedColorsHeight -= popOver.querySelector('.lyteColorPicker__palette').getBoundingClientRect().height;
				}
				else{
					height = popOverOffset.height;
				}
				this.setData('basicDimensions',{"width" : popOverOffset.width, "height" : height, "usedColorsHeight" : usedColorsHeight});
				
				if(popOver.querySelector('lyte-popover-header')){
					popOver.style.height = (advCPDimensions.height + headerHeight.height) + "px";
				}else{
					popOver.style.height = advCPDimensions.height + "px";
				}
				popOver.style.width = advCPDimensions.width + "px";
				popOver.style.maxWidth = advCPDimensions.width + "px";
				popOver.querySelector('lyte-popover-content').style.height = advCPDimensions.height + "px";
				popOver.querySelector('lyte-popover-content').style.maxHeight = advCPDimensions.height + "px";
				this.setData('ltPropBasicColorPicker',false);
				// this.setData('ltPropShow',true);
				this.$node.querySelector('lyte-popover').component.computeOffsetImpl();
				popOverOffset = null;
				headerHeight = null;
				height = null;
				usedColorsHeight = null;
				popOver = null;
			}
			
			this.initializeAdvColorPicker(event,ele);
			ele = null;
			color = null;
			advCPDimensions = null;
		},

		noFillExecute : function(event){
			var color = 'transparent';
			if(this.getData('ltPropColorPreview')){
				this.setColorPreviewAndValue(document.querySelector('.'+this.getData('ltPropWrapperClass')),color);
			}
			var selectedColor = {
				"hex" : undefined,
				"rgb" : color
			};
			this.setData('ltPropSelectedColor',selectedColor);
			this.executeOnSelect(event);
		},

		defaultColorExecute : function(event){
			var color = 'rgb(0, 0, 0)';
			if(this.getData('ltPropColorPreview')){
				this.setColorPreviewAndValue(document.querySelector('.'+this.getData('ltPropWrapperClass')),color);
			}
			var rgbColor = color.substring(4,color.length-1).split(",");
			var selectedColor = {
				"hex" : ("#" + ColorPicker_Util.getRgbCodeByRgbColors(rgbColor[0],rgbColor[1],rgbColor[2])),
				"rgb" : color
			};
			this.setData('ltPropSelectedColor',selectedColor);
			this.executeOnSelect(event);
		},

		closeColorPicker : function(event){
			this.executeOnClose(event);
			this.setData('ltPropShow',false);
		},

		fromAdvCPtoBasic : function(event){
			this.setData('moreColorOptionSelected',false);
			var ele;
			var basicDimensions = this.getData('basicDimensions');
			if(this.getData('ltPropInline')){
				ele = this.$node.querySelector('.lyteColorPicker');
				ele.style.width = basicDimensions.width + "px";
				this.setData('ltPropBasicColorPicker',true);
			}
			else{
				ele = document.querySelector('.'+this.getData('ltPropWrapperClass'));
				var popOver = ele.querySelector('.lytePopover');
				var content = popOver.querySelector('lyte-popover-content');
				var contentHeight = 0;
				var height = 0;
				if(this.getData('ltPropUsedColors')){
					height = basicDimensions.usedColorsHeight + Math.ceil(this.getData('usedColors').length/10) * 22;
					contentHeight = (basicDimensions.height+height) - (popOver.querySelector('lyte-popover-header') ? popOver.querySelector('lyte-popover-header').getBoundingClientRect().height : 0);
				}
				else{
					contentHeight = basicDimensions.height - (popOver.querySelector('lyte-popover-header') ? popOver.querySelector('lyte-popover-header').getBoundingClientRect().height : 0);
				}
				popOver.style.height = (basicDimensions.height + height) + "px";
				content.style.height = contentHeight + "px";
				content.style.maxHeight = contentHeight + "px";
				popOver.style.width = basicDimensions.width + "px";
				popOver.style.maxWidth = basicDimensions.width + "px";
				this.setData('ltPropBasicColorPicker',true);
				this.$node.querySelector('lyte-popover').component.computeOffsetImpl();
			}
			this.initializeBasicColorPicker(event,ele);
			popOver = null;
		},
		copyValueToClipboard : function(prop){
			var ele = this.getData('ltPropInline') ? this.$node : this.childComp;
			if(prop == "fromAdv"){
				ele.querySelector('.previewDiv').querySelector('#copyColorValueImg').style.display = "none";
				var copyColorValue = ele.querySelector('#lyteCPShowValue').querySelector('input');
			}
			if(prop == "fromBasic"){
				var copyColorValue = ele.querySelector('#readColorValue');
			}
			copyColorValue.select();
			try {
				var successful = document.execCommand('copy');
			} catch (err) {
				// console.log('Oops, unable to copy');
			}
		},

		onOverColorPreviewDiv : function(event, type, prop){
			var ele = this.getData('ltPropInline') ? this.$node : this.childComp;
			if(type === "fromAdv"){
				if(prop === "over"){
					ele.querySelector('.previewDiv').querySelector('#copyColorValueImg').style.display = "block";
				}
				if(prop === "out"){
					ele.querySelector('.previewDiv').querySelector('#copyColorValueImg').style.display = "none";
				}
			}
			var node;
			if(this.getData('ltPropInline')){
				node = this.$node.querySelector('#basciPreviewDivImg');
			}
			else{
				node = this.$node.querySelector('lyte-popover').component.childComp.querySelector('#basciPreviewDivImg');
			}
			if(type === "fromBasic"){
				if(prop === "over"){
					node.style.display = "block";
				}
				if(prop === "out"){
					node.style.display = "none";
				}
			}
		}
	}
});

document.addEventListener('click',function(event){
	if(ColorPicker_EventUtil.__stopPropagation){
		ColorPicker_EventUtil.__stopPropagation = false;
		return;
	}
	var ele = event.target;
	while(!$L(ele).hasClass('lyteColorpickerVisible') && ele.tagName != 'LYTE-DROP-BOX' && ele.tagName != 'HTML'){
		ele = ele.parentElement;
		if(!ele){
			return
		}
	}
	if(ele.tagName == 'HTML'){
		var colorpicker = document.querySelector('.lyteColorpickerVisible');
		if(colorpicker && colorpicker.parentElement.parentElement._callee.parentElement.component.getData('ltPropCloseOnBodyClick')){
			colorpicker.parentElement.parentElement._callee.parentElement.ltProp('show',false);
		}
	}
	
},true);

