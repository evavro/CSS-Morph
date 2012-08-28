(function($) {

	$.getScript('rgbcolor.js', function() {
	    mlog('RGB color library injected successfully');
	});

	function mlog(message) {
		console.log("[jQuery.Morph] - " + message);
	}

	// Global variables

	var morphing = false;

	// These are the CSS properties that can be mapped to animation functions in the jQuery.animation utility
	var jqueryAnimPropMap = {
		'opacity': '',
		'padding': 'paddingWidth',
		'padding-top': 'paddingTopWidth',
		'padding-right': 'paddingRightWidth',
		'padding-bottom': 'paddingBottomWidth',
		'padding-left': 'paddingLeftWidth',
		'border': 'borderWidth',
		'border-top': 'borderTopWidth',
		'border-right': 'borderRightWidth',
		'border-bottom': 'borderBottomWidth',
		'border-left': 'borderLeftWidth',
		'font-size': 'fontSize',
		'FAKE': 'left'
	}

	// CSS properties that must be manually interpreted by Morph (ignore 'auto', it's just an entry to the jQuery animation property map)
	var generalProperties = {
	    'color': 		['color', 'background-color', 'border-color', 'border-top-color', 'border-bottom-color', 'border-right-color', 'border-left-color', 'scrollbar-arrow-color', 'scrollbar-base-color', 'scrollbar-dark-shadow-color', 'scrollbar-face-color', 'scrollbar-highlight-color', 'scrollbar-shadow-color', 'scrollbar-3d-light-color', 'scrollbar-track-color'],
	    'size': 		['height', 'width', 'padding', 'padding-top', 'padding-bottom', 'padding-left', 'padding-right', 'margin', 'margin-top', 'margin-bottom', 'margin-left', 'margin-right', 'font-size', 'line-height'],
	    'radius':		['border-radius', '-moz-border-radius', '-moz-border-radius-topleft', '-moz-border-radius-topright', '-moz-border-radius-bottomright', '-moz-border-radius-bottomleft'],
	    'position': 	['top', 'right', 'bottom', 'left', 'background-position-x', 'background-position-y'],
	    'alignment': 	['float'], // TODO
	    'shadow':		['box-shadow', '-moz-box-shadow', '-webkit-box-shadow'], // TODO
	    'opacity': 		['opacity', '-moz-opacity', 'visibility'],
	    'auto': 		jqueryAnimPropMap // WARN - This is probably gonna mess with some stuff, a lot of these manual general properties aren't even necessary
	}
	
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

	  		var opts = $.extend({ }, defaults, options);

	  		$.fn.morph.opts = opts;

	  		// TODO - maybe
	  		// dynamically construct a list of CSS properties that need to be converted to names supported by jQuery.animation

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

                    mlog("Style change detected in " + self.id);
                }
			}, 100));
	    },

	    unwatch: function() {
	    	clearInterval($(this).data('watch_timer'));
	    },

	    // TODO
	    // A path of absolute positions for an element to follow
	    path: function(path) {

	    },

	    // TODO
	    // Take in a sequence of style changes and perform them
	    pattern: function(pattern, repetitions) {

	    }
	}

	var specialAnims = {
		explode: function() {

		},

		flatten: function() {

		},

		growToScreen: function() {

		}
	}

  	$.fn.morph = function(method) { // options
		if (morphMethods[method]) {
			return morphMethods[method].apply(this, Array.prototype.slice.call(arguments, 1));
		} else if (typeof method === 'object' || !method) {
			return morphMethods.init.apply(this, arguments);
		} else {
			$.error('Method ' +  method + ' does not exist in the jQuery.morph plugin');
		}   
  	}

  	// FIXME this clutters up the namespace - I think it may need to stay like this tho so it can be statically accessed
  	// $('div').tooltip('update', 'This is the new tooltip content!'); - http://docs.jquery.com/Plugins/Authoring
  	$.fn.morph.changeCSS = function(elem, property, value) {
	    var origPropVal = window.getComputedStyle(elem).getPropertyValue(property);

	    var duration = $.fn.morph.opts.duration,
			interval = 10;

		var relevantGenProp = function(prop) {
			for(genProp in generalProperties) {
				var genPropCollection =  generalProperties[genProp];

				// Using this logic both arrays and JSON keys are supported
				if ((genPropCollection instanceof Array && $.inArray(prop, genPropCollection) > -1) ||
					(genPropCollection instanceof Object && prop in genPropCollection)) {

					mlog("Matched child property '" + prop + "' with parent property '" + genProp + "'");

					return genProp;
				}
			}
		}

		morphing = true;

		// Apply the manual transition function based on the general property (if necessary)
		// FIXME - Make most of these cases just modify the origPropVal and value variables as necessary to adhere to jQuery animation
	    switch(relevantGenProp(property)) {
	     	case 'color':
	     		var start 	 = new RGBColor(origPropVal),
	     			end   	 = new RGBColor(value);
	     			
				if(start.ok && end.ok) {
					var lerp = function(a, b, u) {
					    return (1 - u) * a + u * b;
					};

		     		mlog("Transitioning color for " + property + " - old: " + start.toRGB() + ", new: " + end.toRGB() + " - duration: " + duration);

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

				   	mlog("Completed transitioning colors");
				} else {
					mlog("Failed to transition colors because a color value was invalid - original: " + origPropVal + ", new: " + value);
				}

	     		break;
	     	case 'size': case 'radius': case 'shadow':
	    		var start 		= stripNonInt(origPropVal),
	     			end 		= stripNonInt(value),
	     			step 		= ((end - start) / duration) * interval,
	     			newSize 	= start;

	     		mlog('Transitioning size for ' + property + ' [' + start + ' to ' + end + ', step size: ' + step + ']');

	     		var resizeInterval = setInterval(function() {
	     			newSize += step;

	     			if (newSize == end) { clearInterval(resizeInterval) }

	     			elem.style.setProperty(property, newSize);
	     		}, interval);

	     		break;
	     	case 'position':
	     		mlog('Transitioning position for ' + property);

	     		var switchMap = { 'right': 'left',
	     						  'bottom': 'top' };

	     		for(switchVal in switchMap) {
	     			if(property == switchVal) {
	     				mlog("Warn - Switched value of position property to work with jQuery animation utility: " + switchVal + " -> " + switchMap[switchVal]);

	     				property = switchMap[switchVal];
	     				value *= -1;
	     				break;
	     			}
	     		}

	     		// FIXME - If there's no + or -, assume we want an absolute position

	     		// FIXME - Utilize this in a more generalized manner for other jQuery animations
	     		var animProps = {};
	     			animProps[property] = ((origPropVal < value) ? '+=' : '-=') + value;

	     		$(elem).animate(animProps);

	     		break;
	     	case 'alignment': // TODO
	     		break;
	     	case 'opacity':
	     		mlog('Transitioning opacity for ' + property);

	     		// FIXME - 'visiblity' must be explicity set to 'hidden' in the element of interest
	     		if(property == "visibility")
	     			value = (value == "hidden" ? 0 : 1);

	     		$(elem).animate({
	     			opacity: value,
	     			duration: duration
	     		});

	     		break;
	     	// FIXME - Since the cases will only pertain to how the original and new values are modified, auto will have to be a special condition outside of this switch statement
	     	case 'auto':
	     		// TODO - Make 'queue' optional
	     		var animProps 	= { queue: false,
	     							duration: duration },

					newPropName	= jqueryAnimPropMap[property]; // put the CSS property name into a naming convention supported by jQuery animation

				// TODO - Modify 'value' based on the property
	     		animProps[newPropName] = value;

	     		mlog("AUTO - " + property + " -> " + newPropName + " [" + value + "]");

	     		$(elem).animate(animProps);

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

	// TODO
	function parseCSSValueParts(value) {
		// examples
		// 1px solid black
		// 24px;
		// 10%
	}

	// TODO - Maybe
	function createUsableCSSValue(value, requiredType) {
		/*switch(value) {
			'auto'
		}*/
	}

	// TODO - Implement / decide if it's even worth implementing (as of now, not thinking so)
	// Converts the naming convention of CSS size-based properties to those supported by jQuery
	function relationalSizePropName(prop) {
	  	var relatedJQueryProp = "",
	  		splitProp = prop.split("-");

	  	if(splitProp.length > 1) {
	  		var propBaseName = splitProp[0],
	  			propRelation = splitProp[1];

	  		// Example: border-left -> borderWidthLeft
	  		return propBaseName + (propRelation.charAt(0).toUpperCase() + propRelation.slice(1)) + "Width";
	  	}

	  	return propBaseName + 'Width';
	}

	// From jQuery - overriding definition
	// FIXME - replace this clunky overriding definition with dynamic CSS Hooks - http://api.jquery.com/jQuery.cssHooks/
	jQuery.fn.css = function(name, value) {
		return jQuery.access(this, function(elem, name, value) {
			// TODO: Convert values that are colors from Hex to RGB!
			// TODO: Determien the type of value that's trying to be changed

			var elemChanging = window.getComputedStyle(elem).getPropertyValue(name) !== value;

			if($(elem).data("morph") == true && elemChanging) {
				mlog("Morphing CSS property '" + name + "'");

				return $.fn.morph.changeCSS(elem, name, value);
			} else {
				return value !== undefined ?
					jQuery.style(elem, name, value) :
					jQuery.css(elem, name);
			}
		}, name, value, arguments.length > 1);
	};
  	
})(jQuery);