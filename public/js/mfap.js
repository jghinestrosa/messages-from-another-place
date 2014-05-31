(function($) { 

  /* Variables */

  var $title = $('#title');
  var $lights = $('#lights');
  var $letsRock = $('#lets-rock');

  /* Animation events*/

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
    updateCss($letsRock, 'opacity', '1.0');
  }

  function hideLightsDiv() {
    updateCss($lights, 'display', 'none');
  }

  function updateCss(element, property, value) {
    element.css(property, value);
  }

  /** Rest of events **/

  // Flip text when "Let's rock" is clicked
  $letsRock.on('click', function(){
    updateCss($title, 'transform', 'scaleX(-1)');
    updateCss($letsRock, 'transform', 'scaleX(-1)');
    updateCss($title, '-webkit-transform', 'scaleX(-1)');
    updateCss($letsRock, '-webkit-transform', 'scaleX(-1)');
  });


}(jQuery));
