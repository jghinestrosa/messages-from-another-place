(function($, window, navigator, Recorder) { 

  /* Variables */

  var $title = $('#title'),
      $lights = $('#lights'), 
      $blueLights = $('#blue-lights'),
      $letsRock = $('#lets-rock'),
      $curtains = $('.curtains'),
      $dimmed = $('.dimmed'),
      $shadow = $('#shadow'),
      $diane = $('#diane'),
      $records = $('#records');

  /* Variables for the audio recording process */

  var recorder,
      audio = $('audio')[0],
      a = $('a')[0];

  // Set up getUserMedia, AudioContext and URL
  navigator.getUserMedia = (navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia);
  window.AudioContext = window.AudioContext || window.webkitAudioContext;
  window.URL = window.URL || window.webkitURL;

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
    .on('animationend', prepareForRecording)
    .on('webkitAnimationEnd', prepareForRecording);

  /* Click events */

  // Flip text when "Let's rock" is clicked
  $letsRock.on('click', startRecordingAnimation);

  function dimRoom() {
    updateCss($dimmed, 'opacity', '0.8');
    showShadow();
  }

  function showShadow() {
    $shadow.show();
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


  function startRecordingAnimation() {
    $records.hide();
    illuminateRoom();
    setFlashingLights();
    flipText();
  }

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

  function restoreTextOrientation() {
    $title.removeClass('flipping-text');
    $letsRock.removeClass('flipping-text');
    updateCss($title, 'transform', 'scaleX(1)');
    updateCss($letsRock, 'transform', 'scaleX(1)');
  }

  function illuminateRoom() {
    $shadow.hide();
    $dimmed.hide();
  }

  function showDianeMessage() {
    updateCss($diane, 'opacity', '1.0');
  }

  /* Audio recording process */

  function prepareForRecording() {
    removeFlashingLights();
    askForRecordingPermission();
  }

  function askForRecordingPermission() {
    if (!recorder) {
      if (navigator.getUserMedia) {
        navigator.getUserMedia({audio:true}, startRecordingProcess, function(error) {
          console.log('Error: ' + error);
        });
      }
    }
    else {
      showDianeMessage();
      startRecording();
    }
  }

  // Show "Diane..." message and start recording
  function startRecordingProcess(stream) {
    initializeRecorder(stream);
    showDianeMessage();
    startRecording();
  }

  // Initialize Recorder object for the first time
  function initializeRecorder(stream) {
    var audioContext = new AudioContext();
    var input = audioContext.createMediaStreamSource(stream);

    // Hack for Firefox - Prevent the action of garbage collector
    if (navigator.userAgent.indexOf('Firefox') !== -1) {
      window.audioInputHackForFirefox = input;
    }

    recorder = new Recorder(input, {workerPath:'js/recorderWorker.js'});
  }

  function startRecording(e) {
    if (!recorder) {
      return;
    }

    recorder.record();

    $diane.show();
    $letsRock.off('click');
    $letsRock.on('click', stopRecording);
  }

  function stopRecording(e) {
    if (!recorder) {
      return;
    }

    recorder.stop();
    $diane.hide();
    createWAV();
    $records.show();
    recorder.clear();

    restoreTextOrientation();

    $letsRock.off('click');
    $letsRock.on('click', startRecordingAnimation);
  }

  // Create WAV file, load it in the audio player
  // and set up a download link
  function createWAV() {
    if (!recorder) {
      return;
    }

    recorder.exportWAV(function(blob) {
      var url = URL.createObjectURL(blob);
      audio.src = url;
      a.href = url;
      a.download = 'message.wav';
    });
  }

}(jQuery, window, navigator, Recorder));
