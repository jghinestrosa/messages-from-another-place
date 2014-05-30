(function($) { 

  /* Variables */

  var $title = $('#title');
  var $lights = $('#lights');
  var $letsRock = $('#lets-rock');

  /* Events*/

  // Show title when the lights animation has ended
  $lights
    .on('animationend', showTitle)
    .on('webkitAnimationEnd', showTitle);

  // Show Let's Rock div when the title transition has ended
  $title
    .on('transitionend', showLetsRock)
    .on('webkitTransitionEnd', showLetsRock);

  // Hide lights div when the Let's Rock transition has ended
  $letsRock
    .on('transitionend', hideLightsDiv)
    .on('webkitTransitionEnd', hideLightsDiv);

  // Functions for handling animation events
  function showTitle() {
    updateCss($title, 'opacity', '1.0');
  }

  function showLetsRock() {
    console.log('hola');
    updateCss($letsRock, 'opacity', '1.0');
  }

  function hideLightsDiv() {
    updateCss($lights, 'display', 'none');
  }

  function updateCss(element, property, value) {
    element.css(property, value);
  }

}(jQuery));
