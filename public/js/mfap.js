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
      $diary = $('#diary'),
      $tapeRecorder = $('#tape-recorder'),
      $bPlay = $('.button.play'),
      $bStop = $('.button.stop'),
      $bRecord = $('.button.record'),
      $bEject = $('.button.eject'),
      $tapeCircles = $('.tape-circle'),
      $redLight = $('.red-light');

  /* Variables for the audio recording process */

  var recorder,
      audio = document.createElement('audio'),
      a = $('a')[0];

  // Set up getUserMedia, AudioContext and URL
  navigator.getUserMedia = (navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia);
  window.AudioContext = window.AudioContext || window.webkitAudioContext;
  window.URL = window.URL || window.webkitURL;

  /* Animation and transition events*/

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
  
  // Remove flashing lights when the flashing and flipping animations end
  $letsRock
    .on('animationend', prepareForRecording)
    .on('webkitAnimationEnd', prepareForRecording);

  // Hide diary message if the div is clicked
  $diary.on('transitionend webkitTransitionEnd', function() {
    if ($diary.css('opacity') === '0') {
      $diary.hide();
    }
  });

  $tapeRecorder.on('transitionend webkitTransitionEnd', function() {
    if ($tapeRecorder.css('opacity') === '0') {
      $tapeRecorder.hide();
    }
    else {
      listenTapeRecorderEvents(true);
    }
  });

  /* Click events */

  // Flip text when "Let's rock" is clicked
  $letsRock.on('click', startRecordingAnimation);

  // Hide diary when is clicked
  $diary.on('click', function() {
    hideDiaryMessage();
  });

  function dimRoom() {
    dimCurtains();
    showShadow();
  }

  function dimCurtains() {
    // Show destroys the opacity transition except in IE
    $dimmed.show();

    // Hack for Firefox and Webkit browsers
    setTimeout(function() {
      $dimmed.css('opacity', '0.5');
    }, 50);
  }

  function showShadow() {
    $shadow.addClass('movement');
    $shadow.show();
  }

  function illuminateRoom() {
    illuminateCurtains();
    hideShadow();
  }

  function illuminateCurtains() {
    // Hide destroys the opacity transition except in IE
    $dimmed.hide();
    $dimmed.css('opacity', '0.0');
  }

  function hideShadow() {
    $shadow.removeClass('movement');
    $shadow.hide();
  }

  function showTitle() {
    $title.css('opacity', '1.0');
  }

  function showLetsRock() {
    $letsRock.css('opacity', '1.0');
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

  function startRecordingAnimation() {
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
    $title.css('transform', 'scaleX(1)');
    $letsRock.css('transform', 'scaleX(1)');
  }

  function showDiaryMessage() {
    $diary.show();

    // Hack for Firefox and Webkit browsers
    setTimeout(function() {
      $diary.css('opacity', '1.0');
    }, 50);
  }

  function hideDiaryMessage() {
    $diary.css('opacity', '0.0');
  }

  function showTapeRecorder() {
    $tapeRecorder.css('display', 'inline-block');

    // Hack for Firefox and Webkit browsers
    setTimeout(function() {
      $tapeRecorder.css('opacity', '1.0');
    }, 50);
  }

  function hideTapeRecorder() {
    listenTapeRecorderEvents(false);
    $tapeRecorder.css('opacity', '0.0');
  }

  function startTapeAnimation() {
    if (!($tapeCircles.hasClass('spin'))) {
      $tapeCircles.addClass('spin');
    }
  } 

  function stopTapeAnimation() {
    $tapeCircles.removeClass('spin');
  } 

  function turnOnRecordingLight() {
    $redLight.css('background', '#f00');
  } 

  function turnOffRecordingLight() {
    $redLight.css('background', '#000');
  } 

  function isRecordingAudio() {
    return (recorder && recorder.isRecording());
  }

  /* Audio recording process */

  // Audio player events
  $(audio).on('paused ended', function() {
    stopTapeAnimation();
  });

  $(audio).on('play', function(e) {
    startTapeAnimation();
  });

  // Buttons of tape recorder
  function listenTapeRecorderEvents(enabled) {
    // Stop listening click events
    if (!enabled) {
      $bRecord.off('click');
      $bStop.off('click');
      $bPlay.off('click');
      return;
    }

    // Start listening click events
    
    // The recording button of the tape recorder is clicked
    $bRecord.on('click', function() {

      if (isRecordingAudio()) {
        stopRecording();
      }

      askForRecordingPermission();
    });


    // Stop audio if playing or stop recording
    $bStop.on('click', function() {
      if (isRecordingAudio()) {
        stopRecording();
        turnOffRecordingLight();
        stopTapeAnimation();
      }
      else {
        stopAudio();
      }

    });

    $bPlay.on('click', function() {
      if (isRecordingAudio()) {
        stopRecording();
        turnOffRecordingLight();
      }

      playAudio();

    });
  }

  function prepareForRecording() {
    //$dimmed.show(); //TODO Fix
    removeFlashingLights();
    dimRoom();

    $letsRock.off('click');
    $letsRock.on('click', function() {
      restoreTextOrientation();
      hideTapeRecorder();
      
      // Hide the diary message if it is visible
      if ($diary.css('opacity') === '1') {
        hideDiaryMessage();
      }

      // Check if audio is being recorded or played when "Let's rock" is clicked
      if (isPlayingAudio() || isRecordingAudio()) {
        if (isPlayingAudio()) {
          stopAudio();
        }

        if (isRecordingAudio()) {
          stopRecording();
          turnOffRecordingLight();
        }
        stopTapeAnimation();
      }

      $letsRock.off('click');
      $letsRock.on('click', startRecordingAnimation);
    });

    //askForRecordingPermission();
    showTapeRecorder();
  }

  function askForRecordingPermission() {
    if (!recorder) {
      if (navigator.getUserMedia) {
        navigator.getUserMedia({audio:true}, startRecordingProcess, function(error) {
          console.log('Error: ' + error);
        });
      }
      else {
        showDiaryMessage();
      }
    }
    else {
      turnOnRecordingLight();
      startTapeAnimation();
      startRecording();
    }
  }

  // Start tape animation and start recording
  function startRecordingProcess(stream) {
    initializeRecorder(stream);
    turnOnRecordingLight();
    startTapeAnimation();
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

  function startRecording() {
    if (!recorder) {
      return;
    }

    recorder.record();
  }

  function stopRecording() {
    if (!recorder) {
      return;
    }

    recorder.stop();
    createWAV();
    recorder.clear();
  }

  function playAudio() {
    if (audio.src !== '') {
      audio.play();
    }
  }

  function stopAudio() {
    audio.pause();
    audio.currentTime = 0;
  }

  function isPlayingAudio() {
    return !audio.paused;
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
