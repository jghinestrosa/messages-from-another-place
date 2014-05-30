(function($) { 

  /* Variables */

  var $title = $('#title');
  var $lights = $('#lights');
  var $letsRock = $('#lets-rock');

  /* Events*/

  // Lights on event
  $lights
    .on('animationend', showText)
    .on('webkitAnimationEnd', showText);

  // Hide lights div when the let's rock transition has ended
  $letsRock
    .on('transitionend', hideLightsDiv)
    .on('webkitTransitionEnd', hideLightsDiv);

  // Functions for handling animation events
  function showText() {
    updateCss($title, 'opacity', '1.0');
    updateCss($letsRock, 'opacity', '1.0');
  }

  function hideLightsDiv() {
    updateCss($lights, 'display', 'none');
  }

  function updateCss(element, property, value) {
    element.css(property, value);
  }

}(jQuery));
