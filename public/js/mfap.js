(function($, window, navigator, Recorder) { 

  /* Variables */

  var $window = $(window),
      $title = $('#title'),
      $lights = $('#lights'), 
      $blueLights = $('#blue-lights'),
      $letsRock = $('#lets-rock'),
      $curtains = $('.curtains'),
      $dimmed = $('.dimmed'),
      $shadow = $('#shadow'),
      $diary = $('#diary'),
      $tapeRecorder = $('#tape-recorder'),
      $bPlay = $('#play'),
      $bStop = $('#stop'),
      $bRecord = $('#record'),
      $bEject = $('#eject'),
      $tapeCircles = $('.tape-circle'),
      $redLight = $('.red-light'),
      $info = $('#info'),
      $infoIcon = $('#info-icon'),
      $infoText = $('#info-text'),
      $github = $('.github'),
      readyToStartRecording = false;

  /* Variables for the audio recording process */

  var recorder,
      audio = document.createElement('audio'),
      a = $('a')[0];

  // Set up getUserMedia, AudioContext and URL
  navigator.getUserMedia = (navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia);
  window.AudioContext = window.AudioContext || window.webkitAudioContext;
  window.URL = window.URL || window.webkitURL;

  // A nice easter egg...
  console.log('One day my log will have something to say about this');

  /* Animation and transition events*/

  // Show title when the lights animation has ended
  $lights.on('animationend webkitAnimationEnd', showTitle);

  // Show Let's Rock div when the title transition has ended
  $title.on('transitionend webkitTransitionEnd', dimRoom);
    
  $dimmed.on('transitionend  webkitTransitionEnd', function() {
    if (readyToStartRecording) {
      showTapeRecorder();
    }
    else {
      showLetsRock();
    }
  });

  // Hide lights div when the Let's Rock transition has ended
  $letsRock.on('transitionend webkitTransitionEnd', handleLetsRockTransitions);
  
  // Remove flashing lights when the flashing and flipping animations end
  $letsRock.on('animationend webkitAnimationEnd', prepareForRecording);

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

  // Toggle the info message visibility
  var toggleInfoMessage = (function() {
    var margin = $info.css('margin-bottom'),
    arrowOpacity = $infoIcon.css('opacity');

    return function() {
      if ($info.css('margin-bottom') === margin) {
        $infoIcon.css('opacity', '1');
        $info.css('margin-bottom', '0');
      }
      else {
        $infoIcon.css('opacity', arrowOpacity);
        $info.css('margin-bottom', margin);
      }
    };
  }());

  $infoIcon.on('click', toggleInfoMessage);
  $window.on('click', toggleInfoMessage);
  $github.on('click', function(e) {
    e.stopPropagation();
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
    readyToStartRecording = true;
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
    unpressButtons();
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

  function unpressButtons() {
    if ($bRecord.hasClass('pressed')) {
      $bRecord.removeClass('pressed');
    }

    if ($bPlay.hasClass('pressed')) {
      $bPlay.removeClass('pressed');
    }
  }

  function toggleButtonsPressed(buttons) {
    for (var i = 0; i < buttons.length; i++) {
      if (buttons[i].hasClass('pressed')) {
        buttons[i].removeClass('pressed');
      }
      else {
        buttons[i].addClass('pressed');
      }
    }
  }

  /* Audio recording process */

  // Audio player events
  $(audio).on('paused ended', function() {
    toggleButtonsPressed([$bPlay]);
    stopTapeAnimation();
  });

  $(audio).on('play', function() {
    toggleButtonsPressed([$bPlay]);
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
      if (!isRecordingAudio() && !isPlayingAudio()) {
        askForRecordingPermission();
      }

    });

    // Stop audio if playing or stop recording
    $bStop.on('click', function() {
      if (isRecordingAudio() || isPlayingAudio()) {
        if (isRecordingAudio()) {
          stopRecording();
          turnOffRecordingLight();
        }
        else {
          stopAudio();
        }
        stopTapeAnimation();
        toggleButtonsPressed([$bRecord, $bPlay]);
      }
    });

    $bPlay.on('click', function() {
        if (!isRecordingAudio() && !isPlayingAudio()) {
          playAudio();
        }

    });
  }

  function prepareForRecording() {
    removeFlashingLights();
    dimRoom();

    $letsRock.off('click');
    $letsRock.on('click', function() {
      restoreTextOrientation();
      hideTapeRecorder();
      readyToStartRecording = false;

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

    //showTapeRecorder();
  }

  function askForRecordingPermission() {
    if (!recorder) {
      if (navigator.getUserMedia) {
        navigator.getUserMedia({audio:true},
          function(stream) {
            initializeRecorder(stream);
            if (recorder) {
              startRecordingProcess();
            }
          },
          function(error) {
            console.log('Error: ' + error);
          });
      }
      else {
        showDiaryMessage();
      }
    }
    else {
      startRecordingProcess();
    }
  }

  // Start tape animation and start recording
  function startRecordingProcess() {
    turnOnRecordingLight();
    startTapeAnimation();
    toggleButtonsPressed([$bRecord, $bPlay]);
    startRecording();
  }

  // Initialize Recorder object for the first time
  function initializeRecorder(stream) {
    var audioContext = new AudioContext();
    var input = audioContext.createMediaStreamSource(stream);

    // Hack for Firefox - Prevent the action of garbage collector
    if (navigator.userAgent.toLowerCase().indexOf('firefox') !== -1) {
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
