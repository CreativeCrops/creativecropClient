/* 
 * FlowUp
 *
 * Based on Eric Wenn's PullupScroll https://github.com/ericwenn/pullupscroll)
 * Changes include: 
 * - custom namespace for functions
 * - Not dependent on "$" jquery namespace
 * - Works better on items stacked on top of each other in chrome (does not flicker)
 * - Added some custom options including durations and y-displacement
 * - Added ability to control plugin via external CSS instead appending <head>
 * 
 */

var dgPull = dgPull || {};

document.addEventListener('DOMContentLoaded', function(){ 
  window.onscroll = dgPull.scrollFn;
}, false);

(function ( $ ) {
    $.fn.flowUp = function(e,options) {
      var settings = $.extend({
        translateY: "150px",//NO I18n
        duration: 0.8,
        externalCSS: false
      }, options);

      var ele = document.querySelectorAll(e);
      ele.forEach(function(el){
        el.classList.add("pullup-element");//NO I18n
        if(dgPull.visible(el, true)){
          el.classList.add("already-visible");//NO I18n
        }
      })
    if(!settings.externalCSS)
    {
      $("head").append('<style>.come-in{-ie-transform:translateY('+settings.translateY+');-webkit-transform:translateY('+settings.translateY+');transform:translateY('+settings.translateY+');-webkit-animation:come-in '+settings.duration+'s ease forwards;animation:come-in '+settings.duration+'s ease forwards}.come-in:nth-child(odd){-webkit-animation-duration:.6s;animation-duration:.6s}.already-visible{-ie-transform:translateY(0);-webkit-transform:translateY(0);transform:translateY(0);-webkit-animation:none;animation:none}@-webkit-keyframes come-in{to{-ie-transform:translateY(0);-webkit-transform:translateY(0);transform:translateY(0)}}@keyframes come-in{to{-ie-transform:translateY(0);-webkit-transform:translateY(0);transform:translateY(0)}}</style>');
    }
    return this;
    };

}( jQuery ));

dgPull.scrollFn = function() { 
  var ele = document.querySelectorAll(".pullup-element");//NO I18n
  ele.forEach(function(el){
    if(dgPull.visible(el, true)){
      el.classList.add("come-in");//NO I18n
    }
  })
}

dgPull.visible = function(ele, partial){
  var $t = ele,
  $w            = $(window),
  viewTop       = $w.scrollTop(),
  viewBottom    = viewTop + $w.height()-200,
  _top          = $t.offsetTop,
  _bottom       = _top + $t.offsetHeight,
  compareTop    = partial === true ? _bottom : _top,
  compareBottom = partial === true ? _top : _bottom;return ((compareBottom <= viewBottom) && (compareTop >= viewTop));  
}