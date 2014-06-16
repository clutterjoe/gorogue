
/*
var osc = new GoRogue.Source({
  initialize: function() {
  }
});
*/

synth = new GoRogue.Synth({
  params: {
    numVoices: 1,
    oscillators: [{
      type: 'sawtooth',
      semitoneOffset: 0,
      volume: 1
    },
    {
      type: 'sine',
      semitoneOffset: 7,
      volume: 0.2
    },
    {
      type: 'sine',
      semitoneOffset: 12,
      volume: 1
    }
    ],

    glideRate: 500
  },

});


$(document).ready(function() {

  var lastPressed = null;
  var currentPressed = null;

  $(window).on('keydown', function(e) {

    var vel = (e.type == 'keydown' ? 127 : 0);
    var char = String.fromCharCode(e.keyCode);
    if (char === currentPressed) {
      return;
    }
    currentPressed = char;
    lastPressed = char;
console.log(vel + ' ' + char + ' ' + e.type);

    switch(char) {
      case 'a': // C
      case 'A':
        synth.noteOn({frequency: 261.63, velocity: vel});
        break;
      case 'w': // C# / Db
      case 'W':
        synth.noteOn({frequency: 277.18, velocity: vel});
        break;
      case 's': // D
      case 'S':
        synth.noteOn({frequency: 293.66, velocity: vel});
        break;
      case 'e': // D# / Eb
      case 'E':
        synth.noteOn({frequency: 311.13, velocity: vel});
        break;
      case 'd': // E
      case 'D':
        synth.noteOn({frequency: 329.63, velocity: vel});
        break;
      case 'f': // F
      case 'F':
        synth.noteOn({frequency: 349.23, velocity: vel});
        break;
      case 't': // F# / Gb
      case 'T':
        synth.noteOn({frequency: 369.99, velocity: vel});
        break;
      case 'g': // G
      case 'G':
        synth.noteOn({frequency: 392, velocity: vel});
        break;
      case 'y': // G# / Ab
      case 'Y':
        synth.noteOn({frequency: 415.3, velocity: vel});
        break;
      case 'h': // A
      case 'H':
        synth.noteOn({frequency: 440, velocity: vel});
        break;
      case 'u': // A# / Bb
      case 'U':
        synth.noteOn({frequency: 466.16, velocity: vel});
        break;
      case 'j': // B
      case 'J':
        synth.noteOn({frequency: 493.88, velocity: vel});
        break;
      case 'k': // C
      case 'K':
        synth.noteOn({frequency: 523.25, velocity: vel});
        break;
      }
  });


  $(window).on('keyup', function(e) {

    var vel = (e.type == 'keydown' ? 127 : 0);
    var char = String.fromCharCode(e.keyCode);
    if (char == currentPressed) {
      currentPressed = null;
    }
    lastPressed = null;

console.log(vel + ' ' + char + ' ' + e.type);

    switch(char) {
      case 'a': // C
      case 'A':
        synth.noteOn({frequency: 261.63, velocity: vel});
        break;
      case 'w': // C# / Db
      case 'W':
        synth.noteOn({frequency: 277.18, velocity: vel});
        break;
      case 's': // D
      case 'S':
        synth.noteOn({frequency: 293.66, velocity: vel});
        break;
      case 'e': // D# / Eb
      case 'E':
        synth.noteOn({frequency: 311.13, velocity: vel});
        break;
      case 'd': // E
      case 'D':
        synth.noteOn({frequency: 329.63, velocity: vel});
        break;
      case 'f': // F
      case 'F':
        synth.noteOn({frequency: 349.23, velocity: vel});
        break;
      case 't': // F# / Gb
      case 'T':
        synth.noteOn({frequency: 369.99, velocity: vel});
        break;
      case 'g': // G
      case 'G':
        synth.noteOn({frequency: 392, velocity: vel});
        break;
      case 'y': // G# / Ab
      case 'Y':
        synth.noteOn({frequency: 415.3, velocity: vel});
        break;
      case 'h': // A
      case 'H':
        synth.noteOn({frequency: 440, velocity: vel});
        break;
      case 'u': // A# / Bb
      case 'U':
        synth.noteOn({frequency: 466.16, velocity: vel});
        break;
      case 'j': // B
      case 'J':
        synth.noteOn({frequency: 493.88, velocity: vel});
        break;
      case 'k': // C
      case 'K':
        synth.noteOn({frequency: 523.25, velocity: vel});
        break;
      }
  });


});


/*
setInterval(function () {

  synth.noteOn({frequency: 300, velocity: 127}, function() {

    console.log('note on callback fired');

  });
  setTimeout(function() {
    synth.noteOn({frequency: 300, velocity: 0}, function() {

//    console.log('note off callback fired');

    });

    }, 500);
}, 1000);
*/