CSS Morph
=========

Overview
--------

Morph is a jQuery plugin that provides elegant customizable transitions whenever style properties of a DOM element are changed.

It acts as an automatized interface to jQuery's 'animate' utility. Certain animations have been manually re-implemented in order to eliminate dependency on jQuery UI.

Installation
--------

Make sure you have the latest version of jQuery in your header

<code>
&lt;script src="http://code.jquery.com/jquery-latest.js"&gt;&lt;/script&gt;
</code>

Include Morph at the end of your HTML document along with your assignments

<code>
&lt;script type="text/javascript" src="morph.js"&gt;&lt;/script&gt;
</code>

<code>
&lt;script type="text/javascript"&gt;
$('*').morph();
&lt;/script&gt;
<code>


Congratulations, Morph is now installed and ready to use. 

Basic Usage
--------

With Morph you cou can easily apply automatic style transitions to every DOM element

<code>
$('*').morph();
</code>

or to individual elements - it's simply a matter of your jQuery selector:

<code>
$('#test_div').morph();
</code>

With automatic style transitions, jQuery never even has to be accessed directly by the developer for transitions to take place:

<code>
&lt;body onClick="document.getElementById('test_div').style.setProperty('background-color', 'red');"&gt;
</code>

If you wish, you can disable automatic detection of style changes in the DOM:

<code>
$('*').morph({auto: false});
</code>

If 'auto' is set to false, style changes will only be detected if jQuery's .css() method is accesssed:

<code>
$('#test_div').css('background-color', '#000') // Transitions
</code>
<code>
document.getElementById('test_div').style.setPropert('background-color', '#000') // Does nothing
</code>
