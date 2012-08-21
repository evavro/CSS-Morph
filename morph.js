(function($) {

	// http://docs.jquery.com/Plugins/Authoring
	// http://www.blooberry.com/indexdot/css/propindex/all.htm
	// http://api.jquery.com/jQuery.data/
	// http://www.scriptiny.com/2008/05/javascript-color-fading-script/
	// http://jqueryui.com/demos/animate/
	// http://stackoverflow.com/questions/1004475/jquery-css-plugin-that-returns-computed-style-of-element-to-pseudo-clone-that-el
	// http://www.phpied.com/rgb-color-parser-in-javascript/
	// http://james.padolsey.com/javascript/monitoring-dom-properties/
	// http://www.quackit.com/css/css3/properties/
	// http://www.w3schools.com/css3/css3_animations.asp

	$.getScript('rgbcolor.js', function() {
	    console.log('RGB color library injected successfully');
	});

	var morphing = false;

	var morphMethods = {
		init : function(options) {
			var defaults = {
	  			'enabled': true,	// TODO
	  			'auto': false,		// TODO
	  			'color': true,
				'size': true,		
				'radius': true,		
				'position': true,	// TODO
				'alignment': true,	// TODO
				'shadow': true,		// TODO
				'opacity': true,	
				'duration': 200, 	// let's try to apply 'duration' per property instead of globally (optional!)
				'delay': 0  		// TODO
	  		};

	  		var jqueryAnims = ['opacity', 'border']; // TODO

	  		var opts = $.extend({ }, defaults, options);

	  		$.fn.morph.opts = opts;

	    	// apply plugin functionality to each element and add the "morph" data property, then chain
	  		return this.each(function() {
	     		var $this = $(this);

	     		$this.data('morph', true);

	     		if(opts.auto == true) {
	     			console.log("Automatically listening for style changes in DOM element '" + this.id + "[" + this.tagName + "]'");

		     		$this.morph('watch');
	     		}
	    	});
	    },

	    // TODO
	    /*changeCSS: function(elem, property, value) {
	    	
	    }*/

	    // TODO
	    load: function(cssFile) {
	    	// get a list of every element being changed
	    	// get a list of each property that's being changed in that element
	    	// call $.fn.morph.changeCSS for each property
	    },

	    // Want to move this to a global scope so we only have 1 looping watch function instead of 1 for each element
	    watch: function() {
        	var $this = $(this);
        	var oldHash = this.prop("hash");

	    	$this.data('watch_timer', setInterval(function() {
	    		var newHash = this.prop("hash");

	    		// FIXME - Only consider a style a chnage if we are not morphing!
	    		if(oldHash !== newHash) {
                    oldHash = newHash;

                    console.log("Style change detected in " + self.id);
                }
			}, 100));
	    },

	    unwatch: function() {
	    	clearInterval($(this).data('watch_timer'));
	    }
	}

  	$.fn.morph = function(method) { // options
		if (morphMethods[method]) {
			return morphMethods[method].apply(this, Array.prototype.slice.call(arguments, 1));
		} else if ( typeof method === 'object' || ! method ) {
			return morphMethods.init.apply(this, arguments);
		} else {
			$.error('Method ' +  method + ' does not exist in the jQuery.morph plugin');
		}   
  	}

  	// FIXME this clutters up the namespace - I think it may need to stay like this tho so it can be statically accessed
  	// $('div').tooltip('update', 'This is the new tooltip content!'); - http://docs.jquery.com/Plugins/Authoring
  	$.fn.morph.changeCSS = function(elem, property, value) {
	    var origPropVal = window.getComputedStyle(elem).getPropertyValue(property);

	    /*if(isNaN(origPropVal)) {
	    	console.log('WARN: Original property value is not an integer: ' + origPropVal);

	    	origPropVal = 0;
	    }*/

	    var duration = $.fn.morph.opts.duration,
			interval = 10;

	    var generalProperties = {
	     	'color': 		['color', 'background-color', 'border-color', 'border-top-color', 'border-bottom-color', 'border-right-color', 'border-left-color', 'scrollbar-arrow-color', 'scrollbar-base-color', 'scrollbar-dark-shadow-color', 'scrollbar-face-color', 'scrollbar-highlight-color', 'scrollbar-shadow-color', 'scrollbar-3d-light-color', 'scrollbar-track-color'],
	     	'size': 		['height', 'width', 'padding', 'padding-top', 'padding-bottom', 'padding-left', 'padding-right', 'margin', 'margin-top', 'margin-bottom', 'margin-left', 'margin-right', 'font-size', 'line-height'],
	     	'radius':		['border-radius', '-moz-border-radius', '-moz-border-radius-topleft', '-moz-border-radius-topright', '-moz-border-radius-bottomright', '-moz-border-radius-bottomleft'],
	     	'position': 	['top', 'right', 'bottom', 'left', 'background-position-x', 'background-position-y'],
	     	'alignment': 	['float'], // TODO
	     	'shadow':		[''], // TODO
	     	'opacity': 		['opacity', '-moz-opacity', 'visibility']
	    }

		var relevantGenProp = function(prop) {
			for(genProp in generalProperties) {
				if($.inArray(prop, generalProperties[genProp]) > -1) {
					console.log("Matched child property '" + prop + "' with parent property '" + genProp + "'");

					return genProp;
				}
			}
		}

		morphing = true;

		// Apply the transition function based on the general property
		// http://www.phpied.com/rgb-color-parser-in-javascript/
	    switch(relevantGenProp(property)) {
	     	case 'color':
	     		var start 	 = new RGBColor(origPropVal), // .toRGB()
	     			end   	 = new RGBColor(value); // .toRGB()
	     			
				if(start.ok && end.ok) {
					var lerp = function(a, b, u) {
					    return (1 - u) * a + u * b;
					};

		     		console.log("Transitioning color for " + property + " - old: " + start.toRGB() + ", new: " + end.toRGB() + " - duration: " + duration);

		     		var steps = duration / interval,
				    	step_u = 1.0 / steps,
				    	u = 0.0;

				    var fadeInterval = setInterval(function() {
				    	if (u >= 1.0) { clearInterval(fadeInterval) }

				        var r = parseInt(lerp(start.r, end.r, u));
				        var g = parseInt(lerp(start.g, end.g, u));
				        var b = parseInt(lerp(start.b, end.b, u));
				        var colorname = 'rgb('+r+','+g+','+b+')';

				        elem.style.setProperty(property, colorname);

				        u += step_u;
				   	}, interval);

				   	console.log("Completed transitioning colors");
				} else {
					console.log("Failed to transition colors because a color value was invalid - original: " + origPropVal + ", new: " + value);
				}

	     		break;
	     	case 'size': case 'radius': case 'shadow':
	    		var start 		= stripNonInt(origPropVal),
	     			end 		= stripNonInt(value),
	     			step 		= ((end - start) / duration) * interval,
	     			newSize 	= start;

	     		console.log('Transitioning size for ' + property + ' [' + start + ' to ' + end + ', step size: ' + step + ']');

	     		var resizeInterval = setInterval(function() {
	     			newSize += step;

	     			if (newSize == end) { clearInterval(resizeInterval) }

	     			elem.style.setProperty(property, newSize);
	     		}, interval);

	     		break;
	     	case 'position':
	     		console.log('Transitioning position for ' + property);

	     		// FIXME - If there's no + or -, assume we want an absolute position

	     		// FIXME - Utilize this in a more generalized manner for other jQuery animations
	     		var animProps = {};
	     			animProps[property] = ((origPropVal < value) ? '+=' : '-=') + value;

	     		$(elem).animate(animProps);

	     		break;
	     	case 'alignment': // TODO
	     		break;
	     	case 'opacity':
	     		console.log('Transitioning opacity for ' + property);

	     		// FIXME - 'visiblity' must be explicity set to 'hidden' in the element of interest
	     		if(property == "visibility")
	     			value = (value == "hidden" ? 0 : 1);

	     		$(elem).animate({
	     			opacity: value,
	     			duration: duration
	     		});

	     		break;
	    }

	    morphing = false;
  	}

  	// Converts colors from Hex to RGB
	function colorConv(color) {
		var rgb = [parseInt(color.substring(0,2),16), 
				   parseInt(color.substring(2,4),16), 
				   parseInt(color.substring(4,6),16)];

		return rgb;
	} 

	// FIXME - percents obviously need to be handled differently than pixels
	// also check for operators (+90px, -10%, etc)
	function stripNonInt(value) {
		if(isNaN(value)) {
			return parseInt(value.replace('px', '')
								 .replace('%', '')); 
		} else {
			return value;
		}
	}

	// From jQuery - overriding definition
	// FIXME - replace this clunky overriding definition with CSS Hooks - http://api.jquery.com/jQuery.cssHooks/
	jQuery.fn.css = function(name, value) {
		return jQuery.access(this, function(elem, name, value) {
			// TODO: Convert values that are colors from Hex to RGB!
			// TODO: Determien the type of value that's trying to be changed

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