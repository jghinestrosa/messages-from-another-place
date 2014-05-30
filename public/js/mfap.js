(function($) { 

  /* Variables */

  var $title = $('#title');
  var $lights = $('#lights');
  var $letsRock = $('#lets-rock');

  /* Events*/

  // Lights on event
  $lights.on('animationend', function() {
    $title.css('opacity', '1.0');
    $letsRock.css('opacity', '1.0');
    $lights.css('display', 'none');
  });

}(jQuery));
