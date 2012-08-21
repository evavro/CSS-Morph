CSS Morph
=========

Overview
--------

A jQuery plugin that provides elegant customizable transitions whenever style properties of a DOM element are changed.

Acts as an automatized interface to jQuery's 'animate' utility. Certain animations have been manually re-implemented in order to eliminate dependency on jQuery UI.

Basic Usage
--------

You can easily apply automatic style transitions to every DOM element

<code>
$('*').morph();
</code>

or to individual elements; it's simply a matter of your jQuery selector:

<code>
$('#test_div').morph();
</code>

With automatic style transitions, jQuery never even has to be accessed directly by the developer for morph to take place:

<code>
&lt;body onClick="document.getElementById('test_div').style.setProperty('background-color', 'red');"&gt;
</code>

If you wish to disable automatic detection of style changes through the DOM:

<code>
$('*').morph({auto: false});
</code>

If 'auto' is set to false, changes will only be detected if jQuery's .css() method is accesssed:

<code>
$('#test_div').css('background-color', '#000') // Transitions
</code>
<code>
document.getElementById('test_div').style.setPropert('background-color', '#000') // Does nothing
</code>
