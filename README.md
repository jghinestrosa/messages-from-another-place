# Messages From Another Place

Messages From Another Place is a web application that lets you record audio as if you were in the Red Room from Twin Peaks.

## What is this?

Hi there! First of all, I have to declare myself as a big fan of Twin Peaks and David Lynch. Because of this, the last time I rewatched the entire show and also the movie, I thought it would be awesome if an application that let you talk backwards as if you were in the Red Room from the show would exist. Since I am really interested in web development and I wanted to do some kind of project that could really motivate me, I finally came up with Messages From Another Place.

I wanted an application that could not only be used in a computer, but also in a smarthpone or a tablet, so an HTML5 app would be perfect. This project would be useful for me because it would be the first web application I would entirely make by myself and I expected to learn a lot of new stuff.

I am also interested in the new APIs that are being developed right now and all the new features that they make possible to be present in every modern browser. In this particular case, the Web Audio API and MediaStream API are used for the recording process so, it is not necessary to use any external plugin to record audio.

I also thought this would be a good opportunity to learn about CSS3 and all those awesome effects that can be made with it and I have never used before. I'm talking about animations, transitions, 3D perspective...

So I started the project and for my surprise, the more I read and learned, the more details I wanted to add to the web. Because of this, the project started to grow and I focused in CSS3 more than in JavaScript.

In a nutshell, this is a project with learning purposes, but also the way I have to express the great admiration I feel for Twin Peaks.

## How to use it

If you want to give it a try, you can do it clicking [here](https://jghinestrosa.github.io/messages-from-another-place).

When the web is loaded, just click in "Let's Rock" to have access to the tape recorder. The orientation of the text indicates you the way you will have to record your messages. Use the record button of the tape recorder to record a message talking backwards, use the stop button to stop recording, use the play button to listen your message in regular way, and use the eject button to download the message as a wav file. 

If you record your message talking backwards, the web will reverse the audio and you will listen to yourself talking as the Man From Another Place in the Red Room.

## Install

You only have to download the source and run `npm install` to download all the dependencies.

If you want to give it a try in localhost the source contains an express server ready to use. Just run `npm start` and the server will start to listen in your `process.env.PORT` port or `9000` by default. 

Grunt is used to minify and concatenate the source files into the dist folder. Just run `grunt build`.

## Dependencies

### JavaScript

I have used jQuery and [Recorderjs](https://github.com/mattdiamond/Recorderjs).

I would really like to say **thank you** to [Matt Diamond](https://github.com/mattdiamond), who is the owner of the Recorderjs library and it has been very useful for me. I just had to add a couple of new functions that I needed for this particular project.

### CSS

I have used three fonts from Google Fonts:
* [Oswald](https://www.google.com/fonts/specimen/Oswald)
* [Cedarville Cursive](https://www.google.com/fonts/specimen/Cedarville+Cursive)
* [Sacramento](https://www.google.com/fonts/specimen/Sacramento)

I would also like to say **thank you** to their respectives authors, this fonts have helped me to make the Twin Peaks atmosphere more real.

### Tests

For now, I have tested the application in different computers, in some Android devices, in iPhone and iPad.

Right now, only Firefox, Chrome and Opera support `getUserMedia()`, the API that allows the web app to access to the microphone. Because of this, if you're an Internet Explorer or Safari user you can enjoy the animations and the design but you won't be able to record audio.

## Made with &hearts; by Jorge Garcia Hinestrosa under the sycamore trees

I have tried to design any aspect of the web using only CSS3. I did not want to add any image file if it wasn't totally necessary so, the curtains, the floor, the shadow, the tape recorder, the diary... everything has been made using CSS3 by myself.

The owl made by ASCII art that is included in the source is not mine. I found it in an ASCII art website and the author was unknown (thank you too!).

I hope you all like the web as much as I like developing it.

## License
MIT
