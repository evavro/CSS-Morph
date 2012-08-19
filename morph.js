(function($) {

	// http://docs.jquery.com/Plugins/Authoring
	// http://www.blooberry.com/indexdot/css/propindex/all.htm
	// http://api.jquery.com/jQuery.data/
	// http://www.scriptiny.com/2008/05/javascript-color-fading-script/
	// http://jqueryui.com/demos/animate/
	// http://stackoverflow.com/questions/1004475/jquery-css-plugin-that-returns-computed-style-of-element-to-pseudo-clone-that-el
	// http://www.phpied.com/rgb-color-parser-in-javascript/

	$.getScript('rgbcolor.js', function() {
	    console.log('RGB color library injected successfully');
	});

	var methods = {
		init : function(options) {

			var defaults = {
	  			'enabled': true,	// TODO
	  			'color': true, 		// TODO
				'size': true,		// TODO
				'radius': true,		// TODO
				'position': true,	// TODO
				'alignment': true,	// TODO
				'shadow': true,		// TODO
				'opacity': true,	// TODO
				'duration': 500 	// let's try to apply 'duration' per property instead of globally (optional!)
	  		};

	  		//var opts = $.extend({ }, $.fn.morph.defaults, options);

	  		var opts = $.extend({ }, defaults, options);

	  		$.fn.morph.opts = opts;

	    	// apply plugin functionality to each element and add the "morph" data property, then chain
	  		return this.each(function() {
	     		 var $this = $(this);

	     		 $this.data('morph', true);
	    	});
	    },

	    // TODO
	    /*changeCSS: function(elem, property, value) {
	    	
	    }*/
	}

	// safe to use $ here and not cause conflicts
  	$.fn.morph = function(method) { // options

		// COMMENTED OUT BECAUSE I'M TRYING OUT NON-NAMESPACE CLUTTERING TECHNIQUE
		/*// apply plugin functionality to each element and add the "morph" data property, then chain
  		return this.each(function() {
     		 var $this = $(this);

     		 $this.data('morph', true);
    	});*/

		if (methods[method]) {
			return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
		} else if ( typeof method === 'object' || ! method ) {
			return methods.init.apply(this, arguments);
		} else {
			$.error('Method ' +  method + ' does not exist in jQuery.morph');
		}   
  	}

  	// FIXME this clutters up the namespace - I think it may need to stay like this tho so it can be statically accessed
  	// $('div').tooltip('update', 'This is the new tooltip content!'); - http://docs.jquery.com/Plugins/Authoring
  	$.fn.morph.changeCSS = function(elem, property, value) {

  		// detect the original CSS properties
	  	// find differences between the current and desired CSS states
	    // call the appropriate jQuery.animate property based on what's going on

	    // http://www.quackit.com/css/css3/properties/
	    // http://www.w3schools.com/css3/css3_animations.asp

	    var origPropVal = window.getComputedStyle(elem).getPropertyValue(property);

	    var generalProperties = {
	     	'color': 		['color', 'background-color', 'border-color', 'border-top-color', 'border-bottom-color', 'border-right-color', 'border-left-color', 'scrollbar-arrow-color', 'scrollbar-base-color', 'scrollbar-dark-shadow-color', 'scrollbar-face-color', 'scrollbar-highlight-color', 'scrollbar-shadow-color', 'scrollbar-3d-light-color', 'scrollbar-track-color'],
	     	'size': 		['height, width', 'padding', 'padding-top', 'padding-bottom', 'padding-left', 'padding-right', 'margin', 'margin-top', 'margin-bottom', 'margin-left', 'margin-right', 'font-size', 'line-height'],
	     	'radius':		['border-radius', '-moz-border-radius', '-moz-border-radius-topleft', '-moz-border-radius-topright', '-moz-border-radius-bottomright', '-moz-border-radius-bottomleft'],
	     	'position': 	['float', 'top', 'right', 'bottom', 'left', 'background-position-x', 'background-position-y'],
	     	'alignment': 	[''], // TODO
	     	'shadow':		[''], // TODO
	     	'opacity': 		['opacity', '-moz-opacity', 'display']
	    }

	    /*var relevantGenProp = generalProperties.each(function (prop) {
	     	if($.inArray(property, prop))
	     		return property;
	    });*/

		var relevantGenProp = function(prop) {
			for(genProp in generalProperties) {
				if($.inArray(prop, genProp)) {
					console.log("Matched child property '" + property + "' with parent property '" + genProp + "'");

					return genProp;
				}
			}
		}

		// Apply the transition function based on the general property
	    switch(relevantGenProp(property)) {
	    	// http://www.phpied.com/rgb-color-parser-in-javascript/
	     	case 'color':
	     		var start 	 = new RGBColor(origPropVal), // .toRGB()
	     			end   	 = new RGBColor(value), // .toRGB()
	     			duration = $.fn.morph.opts.duration;
	     		
				if(start.ok && end.ok) {
					var lerp = function(a, b, u) {
					    return (1 - u) * a + u * b;
					};

		     		console.log("Transitioning color for " + property + " - old: " + start.toRGB() + ", new: " + end.toRGB() + " - duration: " + duration);

		     		var interval = 10,
				    	steps = duration / interval,
				    	step_u = 1.0 / steps,
				    	u = 0.0;
				    var theInterval = setInterval(function(){
				    	if (u >= 1.0) { clearInterval(theInterval) }

				        var r = parseInt(lerp(start.r, end.r, u));
				        var g = parseInt(lerp(start.g, end.g, u));
				        var b = parseInt(lerp(start.b, end.b, u));
				        var colorname = 'rgb('+r+','+g+','+b+')';

				        elem.style.setProperty(property, colorname);
				        u += step_u;
				   	}, interval); //

				   	console.log("Completed transitioning colors");
				} else {
					console.log("Failed to transition colors because a color value was invalid - original: " + origPropVal + ", new: " + value);
				}

	     		break;
	     	case 'size': case 'radius': case'shadow':
	     		// increment +1 pixels
	     		break;
	     	case 'position':
	     		// create an invisible temporary element that has the new alignment property and increment towards it's x/y coords
	     		break;
	     	case 'alignment': // TODO
	     		break;
	     	case 'opacity':
	     		// increment .1 opacity
	     		break;
	    }

	  	return value !== undefined ?
					jQuery.style(elem, property, value) :
					jQuery.css(elem, property);

  	}

  	// Converts colors from Hex to RGB
	function colorConv(color) {
		var rgb = [parseInt(color.substring(0,2),16), 
				   parseInt(color.substring(2,4),16), 
				   parseInt(color.substring(4,6),16)];

		return rgb;
	} 

	// From jQuery - overriding definition
	jQuery.fn.css = function(name, value) {
		return jQuery.access(this, function(elem, name, value) {
			// TODO: Convert values that are colors from Hex to RGB!

			var elemChanging = window.getComputedStyle(elem).getPropertyValue(name) !== value;

			if($(elem).data("morph") == true && elemChanging) {
				console.log("Morphing CSS property '" + name + "'");

				return $.fn.morph.changeCSS(elem, name, value);
			} else {
				return value !== undefined ?
					jQuery.style(elem, name, value) :
					jQuery.css(elem, name);
			}
		}, name, value, arguments.length > 1);
	};
  	
})(jQuery);

