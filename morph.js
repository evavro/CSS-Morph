(function($) {

	$.getScript('rgbcolor.js', function() {
	    mlog('RGB color library injected successfully');
	});

	function mlog(message) {
		console.log("[jQuery.Morph] - " + message);
	}

	function mwarn(message) {
		mlog("WARN - " + message);
	}

	function merror(message) {
		mlog("ERROR - " + message);
	}

	// Global variables
	var morphing = false;

	// These are the CSS properties that can be mapped to animation functions in the jQuery.animation utility
	var jqueryAnimPropMap = {
		'left': '',
		'right': '',
		'top': '',
		'bottom': '',
		'opacity': '',
		'visibility': '',
		'padding': '',
		'padding-top': '',
		'padding-right': '',
		'padding-bottom': '',
		'padding-left': '',
		'border': 'borderWidth',
		'border-top': 'borderTopWidth',
		'border-right': 'borderRightWidth',
		'border-bottom': 'borderBottomWidth',
		'border-left': 'borderLeftWidth',
		'font-size': 'fontSize',
	}

	// CSS properties that must be manually interpreted by Morph (ignore 'auto', it's just an entry to the jQuery animation property map)
	var generalProperties = {
	    'color': 		['color', 'background-color', 'border-color', 'border-top-color', 'border-bottom-color', 'border-right-color', 'border-left-color', 'scrollbar-arrow-color', 'scrollbar-base-color', 'scrollbar-dark-shadow-color', 'scrollbar-face-color', 'scrollbar-highlight-color', 'scrollbar-shadow-color', 'scrollbar-3d-light-color', 'scrollbar-track-color'],
	    'size': 		['height', 'width'], //'padding', 'padding-top', 'padding-bottom', 'padding-left', 'padding-right', 'margin', 'margin-top', 'margin-bottom', 'margin-left', 'margin-right', 'font-size', 'line-height'],
	    'radius':		['border-radius', '-moz-border-radius', '-moz-border-radius-topleft', '-moz-border-radius-topright', '-moz-border-radius-bottomright', '-moz-border-radius-bottomleft'],
	    'position': 	['top', 'right', 'bottom', 'left', 'background-position-x', 'background-position-y'],
	    'alignment': 	['float'], // TODO
	    'shadow':		['box-shadow', '-moz-box-shadow', '-webkit-box-shadow'], // TODO
	    'opacity': 		['opacity', '-moz-opacity', 'visibility'],
	    'custom': 		['abs-pos'], // TODO
	}
	
	var morphMethods = {
		init : function(options) {
			var defaults = {
	  			'enabled': true,	// TODO
	  			'auto': false,		// TODO
	  			'natural': true,	// TODO - let users choose if they want to support the natural jQuery anim lib
	  			'color': true,
				'size': true,		
				'radius': true,		
				'position': true,	// TODO
				'alignment': true,	// TODO
				'shadow': true,		// TODO
				'opacity': true,	
				'queue': false,		// TODO
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

	    // TODO - replace the namespace cluttering version with this dynamic method
	    changeCSS: function(elem, property, value) {
	    	return $.fn.morph.changeCSS(elem, property, value);
	    },

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

	    var start	 = origPropVal,
			end		 = value,
			queue	 = $.fn.morph.opts.queue,
			duration = $.fn.morph.opts.duration,
			interval = 10,
			manualAnimFunc = null;

		morphing = true;

		// Define a manual transition function based on the general property (if necessary) and modify variables from the .css function so they can be used properly
		// FIXME - Make most of these cases just modify the origPropVal and value variables as necessary to adhere to jQuery animation
	    switch(relevantGenProp(property)) {
	     	case 'color':
	     		start 	 = new RGBColor(origPropVal);
	     		end   	 = new RGBColor(value);

	     		// FIXME - This isn't really adhering to the "pre-modify" variable thing I'm trying to achieve - need to change some var names
	     		manualAnimFunc = function() {
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
					} else {
						mlog("Failed to transition colors because a color value was invalid - original: " + origPropVal + ", new: " + value);
					}
				}

	     		break;
	     	case 'size': case 'radius': case 'shadow':
	    		start 	= stripNonInt(origPropVal);
	     		end 	= stripNonInt(value);

	     		manualAnimFunc = function() {
		     		var	step 		= ((end - start) / duration) * interval,
		     			newSize 	= start;

		     		mlog('Transitioning size for ' + property + ' [' + start + ' to ' + end + ', step size: ' + step + ']');

		     		var resizeInterval = setInterval(function() {
		     			newSize += step;

		     			if (newSize == end) { clearInterval(resizeInterval) }

		     			elem.style.setProperty(property, newSize);
		     		}, interval);
		     	}

	     		break;
	     	case 'position':
	     		mlog('Transitioning position for ' + property);

	     		var switchPosPropMap = { 'right': 'left',
	     						  		 'bottom': 'top' };

	     		for(posProp in switchPosPropMap) {
	     			if(property == posProp) {
	     				property = switchPosPropMap[posProp];
	     				value *= -1;

	     				mlog("Warn - Switched value of position property to work with jQuery animation utility: " + posProp + " -> " + property);

	     				break;
	     			}
	     		}

	     		// FIXME - If there's no + or -, assume we want an absolute position
	     		value = ((origPropVal < value) ? '+=' : '-=') + value;

	     		break;
	     	case 'alignment': // TODO
	     		break;
	     	case 'opacity':
	     		mlog('Transitioning opacity for ' + property);

	     		// FIXME - 'visiblity' must be explicity set to 'hidden' in the element of interest
	     		if(property == "visibility") {
	     			value = (value == "hidden" ? 0 : 1);
	     			property = "opacity";
	     		}

	     		break;
	    }

	    // FIXME - determine if the user has chosen to disable the property before we even try animating it

	    // Work with the newly modified property values and start the morphing process
	    var autoPropName = jqueryAnimPropMap[property];
	    	autoPropName = autoPropName !== null && autoPropName !== '' ? autoPropName : property;

	    // If the CSS property has an animation that's automatically supported by jQuery, apply it. Otherwise, execute a manual animation
	   	if( jqueryAnimPropMap.hasOwnProperty(property) ) {
	     	var animProps		= { },
	     		animSettings	= { queue: queue,
	     							duration: duration }
			
	     	animProps[autoPropName] = value; // TODO - Modify 'value' based on the property

	     	mlog("Performing " + (queue ? "synchronous" : "asynchronous") + " natural jQuery.animation transition for property " + property + " [" + autoPropName + "]");

	     	$(elem).animate(animProps, animSettings);
	    } else if ( manualAnimFunc != null ) {
	    	manualAnimFunc();
	    } else {
	    	mlog("Could not determine a way to morph CSS property " + property); // FIXME - merror()
	    }

	    morphing = false;
  	}

  	function relevantGenProp(property) {
		for(genProp in generalProperties) {
			var genPropCollection =  generalProperties[genProp];

			// Using this logic both arrays and JSON keys are supported
			if ((genPropCollection instanceof Array && $.inArray(property, genPropCollection) > -1) ||
				(genPropCollection instanceof Object && property in genPropCollection)) {

				mlog("Matched child property '" + property + "' with parent property '" + genProp + "'");

				return genProp;
			}
		}
	}

	// FIXME - percents obviously need to be handled differently than pixels
	// also check for operators (+90px, -10%, etc)
	function stripNonInt(value) {
		if(value == null || value === undefined)
			value = "0";

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
	// Converts the naming convention of CSS size-based properties to a short-hand version supported by jQuery
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

				// return $.fn.morph('changeCSS', elem, name, value); // TODO - works, but implement

				return $.fn.morph.changeCSS(elem, name, value);
			} else {
				return value !== undefined ?
					jQuery.style(elem, name, value) :
					jQuery.css(elem, name);
			}
		}, name, value, arguments.length > 1);
	};
  	
})(jQuery);