(function($) { 

  /* Variables */

  var $title = $('#title');
  var $lights = $('#lights');

  /* Events*/

  // Lights on event
  $lights.on('animationend', function() {
    $title.css('opacity', '1.0');
  });

}(jQuery));
