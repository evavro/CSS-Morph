CSS Morph
=========

Overview
--------

A jQuery plugin that provides elegant customizable transitions whenever style properties of a DOM element are changed.

Acts as an automatized interface to jQuery's 'animate' utility. Certain animations have been manually re-implemented in order to eliminate dependency on jQuery UI.

Basic Usage
--------

Automatic style transitions on all elements:

$('*').morph();

With automatic style transitions, jQuery never even has to be accessed directly by the developer for morph to take place:

<body onClick="document.getElementById('test_div').style.setProperty('background-color', 'red');">

If you wish to disable automatic detection of style changes through the DOM:

$('*').morph({auto: false});

If 'auto' is set to false, changes will only be detected if jQuery's .css() method is accesssed:

$('#test_div').css('background-color', '#000') <--- Transitions
document.getElementById('test_div').style.setPropert('background-color', '#000') <--- Does nothing