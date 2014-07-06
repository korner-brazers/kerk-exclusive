// BigScreen v2.0.2 - 2013-07-03 - Apache 2.0 License
!function(a,b,c){"use strict";function d(a){var b=null;if("VIDEO"===a.tagName)b=a;else{var c=a.getElementsByTagName("video");c[0]&&(b=c[0])}return b}function e(a){var b=d(a);if(b&&b.webkitEnterFullscreen){try{b.readyState<b.HAVE_METADATA?(b.addEventListener("loadedmetadata",function e(){b.removeEventListener("loadedmetadata",e,!1),b.webkitEnterFullscreen(),l=!!b.getAttribute("controls")},!1),b.load()):(b.webkitEnterFullscreen(),l=!!b.getAttribute("controls")),k=b}catch(c){return r("not_supported",a)}return!0}return r(void 0===j.request?"not_supported":"not_enabled",a)}function f(){s.element||(q(),h())}function g(){c&&"webkitfullscreenchange"===j.change&&a.addEventListener("resize",f,!1)}function h(){c&&"webkitfullscreenchange"===j.change&&a.removeEventListener("resize",f,!1)}var i="undefined"!=typeof Element&&"ALLOW_KEYBOARD_INPUT"in Element,j=function(){var a=b.createElement("video"),c={request:["requestFullscreen","webkitRequestFullscreen","webkitRequestFullScreen","mozRequestFullScreen","msRequestFullscreen"],exit:["exitFullscreen","webkitExitFullscreen","webkitCancelFullScreen","mozCancelFullScreen","msExitFullscreen"],enabled:["fullscreenEnabled","webkitFullscreenEnabled","mozFullScreenEnabled","msFullscreenEnabled"],element:["fullscreenElement","webkitFullscreenElement","webkitCurrentFullScreenElement","mozFullScreenElement","msFullscreenElement"],change:["fullscreenchange","webkitfullscreenchange","mozfullscreenchange","MSFullscreenChange"],error:["fullscreenerror","webkitfullscreenerror","mozfullscreenerror","MSFullscreenError"]},d={};for(var e in c)for(var f=0,g=c[e].length;g>f;f++)if(c[e][f]in a||c[e][f]in b||"on"+c[e][f]in b){d[e]=c[e][f];break}return d}(),k=null,l=null,m=function(){},n=[],o=navigator.userAgent.indexOf("Android")>-1&&navigator.userAgent.indexOf("Chrome")>-1,p=function(a){var b=n[n.length-1];(a!==b.element&&a!==k||!b.hasEntered)&&("VIDEO"===a.tagName&&(k=a),1===n.length&&s.onenter(s.element),b.enter.call(b.element,a||b.element),b.hasEntered=!0)},q=function(){k&&!l&&(k.setAttribute("controls","controls"),k.removeAttribute("controls")),k=null,l=null;var a=n.pop();a&&(a.exit.call(a.element),s.element||(n.forEach(function(a){a.exit.call(a.element)}),n=[],s.onexit()))},r=function(a,b){if(n.length>0){var c=n.pop();b=b||c.element,c.error.call(b,a),s.onerror(b,a)}},s={request:function(a,d,f,g){if(a=a||b.body,n.push({element:a,enter:d||m,exit:f||m,error:g||m}),void 0===j.request)return e(a);if(c&&b[j.enabled]===!1)return e(a);if(o)return e(a);if(c&&void 0===j.enabled)return j.enabled="webkitFullscreenEnabled",a[j.request](),setTimeout(function(){b[j.element]?b[j.enabled]=!0:(b[j.enabled]=!1,e(a))},250),void 0;try{/5\.1[\.\d]* Safari/.test(navigator.userAgent)?a[j.request]():a[j.request](i&&Element.ALLOW_KEYBOARD_INPUT),setTimeout(function(){b[j.element]||r(c?"not_enabled":"not_allowed",a)},100)}catch(h){r("not_enabled",a)}},exit:function(){h(),b[j.exit]()},toggle:function(a,b,c,d){s.element?s.exit():s.request(a,b,c,d)},videoEnabled:function(a){if(s.enabled)return!0;a=a||b.body;var c=d(a);return c&&void 0!==c.webkitSupportsFullscreen?c.readyState<c.HAVE_METADATA?"maybe":c.webkitSupportsFullscreen:!1},onenter:m,onexit:m,onchange:m,onerror:m};try{Object.defineProperties(s,{element:{enumerable:!0,get:function(){return k&&k.webkitDisplayingFullscreen?k:b[j.element]||null}},enabled:{enumerable:!0,get:function(){return"webkitCancelFullScreen"!==j.exit||c?o?!1:b[j.enabled]||!1:!0}}})}catch(t){s.element=null,s.enabled=!1}j.change&&b.addEventListener(j.change,function(){if(s.onchange(s.element),s.element){var a=n[n.length-2];a&&a.element===s.element?q():(p(s.element),g())}else q()},!1),b.addEventListener("webkitbeginfullscreen",function(a){n.push({element:a.srcElement,enter:m,exit:m,error:m}),s.onchange(a.srcElement),p(a.srcElement)},!0),b.addEventListener("webkitendfullscreen",function(a){s.onchange(a.srcElement),q(a.srcElement)},!0),j.error&&b.addEventListener(j.error,function(){r("not_allowed")},!1),a.BigScreen=s}(window,document,self!==top);