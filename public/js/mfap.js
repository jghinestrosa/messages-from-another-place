(function($) { 

  /* Variables */

  var $title = $('#title'),
      $lights = $('#lights'), 
      $blueLights = $('#blue-lights'),
      $letsRock = $('#lets-rock'),
      $curtains = $('.curtains'),
      $dimmed = $('.dimmed'),
      $spotlight = $('#spotlight');

  /* Animation events*/

  // Show title when the lights animation has ended
  $lights
    .on('animationend', showTitle)
    .on('webkitAnimationEnd', showTitle);

  // Show Let's Rock div when the title transition has ended
  $title
    .on('transitionend', dimRoom)
    .on('webkitTransitionEnd', dimRoom);
    
  $dimmed
    .on('transitionend', showLetsRock)
    .on('webkitTransitionEnd', showLetsRock);

  // Hide lights div when the Let's Rock transition has ended
  $letsRock
    .on('transitionend', handleLetsRockTransitions)
    .on('webkitTransitionEnd', handleLetsRockTransitions);
  
  // Remove flashing lights when the flashing and flipping animation end
  $letsRock
    .on('animationend', removeFlashingLights)
    .on('webkitAnimationEnd', removeFlashingLights);

  // Functions for handling animation events
  
  function turnSpotlightOn() {
    updateCss($spotlight, 'opacity', '0.2');
  }

  function dimRoom() {
    updateCss($dimmed, 'opacity', '0.4');
    turnSpotlightOn();
  }

  function showTitle() {
    updateCss($title, 'opacity', '1.0');
  }

  function showLetsRock() {
    updateCss($letsRock, 'opacity', '1.0');
  }

  function handleLetsRockTransitions(e) {
    var property = e.originalEvent.propertyName;

    if (property === 'opacity') {
      keepLightsOn();
    }
  }

  function keepLightsOn() {
    $lights.removeClass('turn-lights-on');
    $lights.hide();
  }

  function updateCss(element, property, value) {
    element.css(property, value);
  }

  /** Rest of events **/

  // Flip text when "Let's rock" is clicked
  $letsRock.on('click', function(){
    setFlashingLights();
    flipText();
  });

  function setFlashingLights() {
    $lights.show();
    $blueLights.show();
    $lights.addClass('flashing-lights');
    $blueLights.addClass('flashing-blue-lights');
  }

  function removeFlashingLights() {
    $lights.hide();
    $blueLights.hide();
    $lights.removeClass('flashing-lights');
    $blueLights.removeClass('flashing-blue-lights');
  }

  function flipText() {
    $title.addClass('flipping-text');
    $letsRock.addClass('flipping-text');
  }

}(jQuery));
