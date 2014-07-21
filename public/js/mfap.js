(function($, window, navigator, Recorder) { 

  /* Variables */

  // DOM 
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
      $github = $('.github');

  // Util 
  var readyToStartRecording = false,
      marginInfo = $info.css('margin-bottom'),
      arrowOpacity = $infoIcon.css('opacity');

  // Audio recording process
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

  showTitle();

  // Show title when the lights animation has ended
  //$lights.on('animationend webkitAnimationEnd', showTitle);

  // Dim room, keep lights on and show Let's Rock div
  // when the title transition has ended
  $title.on('transitionend webkitTransitionEnd', function() {
    dimRoom();
    showLetsRock();
    setTimeout(keepLightsOn, 2000);
  });
    
  // Hide lights div when the Let's Rock transition has ended
  //$letsRock.on('transitionend webkitTransitionEnd', handleLetsRockTransitions);
  
  // Remove flashing lights when the flashing and flipping animations end
  $letsRock.on('animationend webkitAnimationEnd', function() {
    prepareForRecording();
    showTapeRecorder();
  
  });

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
  });

  /* Click events */

  $tapeRecorder.on('mousedown', function(e) {
    e.preventDefault();
  });

  // Flip text when "Let's rock" is clicked
  $letsRock.on('click', startRecordingAnimation);
  $letsRock.on('mousedown', preventDefault);

  // Hide diary when is clicked
  $diary.on('click', function() {
    hideDiaryMessage();
  });

  function preventDefault(e) {
    e.preventDefault();
  }

  function showInfoMessage() {
    $infoIcon.css('opacity', '1');
    $info.css('margin-bottom', '0');
  }

  function hideInfoMessage() {
    $infoIcon.css('opacity', arrowOpacity);
    $info.css('margin-bottom', marginInfo);
  }

  // Toggle the info message visibility
  function toggleInfoMessage() {
    if ($info.css('margin-bottom') === marginInfo) {
      showInfoMessage();
    }
    else {
      hideInfoMessage();
    }
  }

  $infoIcon.on('click', toggleInfoMessage);
  $window.on('click', function(e) {
    if ($info.css('margin-bottom') === '0px') {
      hideInfoMessage();
    }
  });

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
    listenTapeRecorderEvents(true);
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

    // Delay only when showing the tape recorder
    setTimeout(function() {
      $tapeRecorder.css('opacity', '1.0');
    }, 2000);
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
      //$bPlay.off('click');
      $bPlay.off('mousedown');
      $bStop.off('mousedown mouseup mouseleave');
      $bEject.off('mousedown mouseup mouseleave');
      return;
    }

    // Start listening click events
    
    // The recording button of the tape recorder is clicked
    $bRecord.on('click', function(e) {
      e.preventDefault();
      if (!isRecordingAudio() && !isPlayingAudio()) {
        askForRecordingPermission();
      }

    });

    // Stop audio if playing or stop recording
    $bStop.on('mousedown touchstart', function(e) {
      e.preventDefault();
      if (isRecordingAudio() || isPlayingAudio()) {
        if (isRecordingAudio()) {
          stopRecording();
          turnOffRecordingLight();
          toggleButtonsPressed([$bRecord, $bPlay]);
        }
        else {
          stopAudio();
          toggleButtonsPressed([$bPlay]);
        }
        stopTapeAnimation();
      }

      toggleButtonsPressed([$bStop]);

      // Unpress stop button when mouseup
      $bStop.on('mouseup mouseleave touchend', function() {
        toggleButtonsPressed([$bStop]);
        $bStop.off('mouseup mouseleave touchend');
      });

    });

    $bPlay.on('mousedown touchstart', function() {

      // don't do anything if it is recording
      if (isRecordingAudio()) {
        return;
      }

      // if there is no audio file loaded, press and unpress button
      // with mousedown, mouseup and mouseleave
      if (audio.src === '') {
        toggleButtonsPressed([$bPlay]);
        $bPlay.on('mouseup mouseleave touchend', function() {
          toggleButtonsPressed([$bPlay]);
          $bPlay.off('mouseup mouseleave touchend');
        });
        return;
      }

      // if there is audio file loaded and is not recording nor playing audio
      if (!isRecordingAudio() && !isPlayingAudio()) {
        playAudio();
      }

    });

    $bEject.on('mousedown touchstart', function(e) {
      e.preventDefault();
      toggleButtonsPressed([$bEject]);

      $bEject.on('mouseup mouseleave touchend', function() {
        toggleButtonsPressed([$bEject]);
        $bEject.off('mouseup mouseleave touchend');
      });
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
