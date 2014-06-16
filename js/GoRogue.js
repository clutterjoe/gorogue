/*
 * We need the following objects within the library:
 *
 * Event Emitter (input, playback)
 * - Sends event object from midi to instruments.
 *
 * Instruments
 *  - Sampler
 *  - Synth
 *
 * Oscillator (waveform)
 *
 * Effect - modifies waveform
 *
 * AudioBus - gainNode
 */

(function() {
  var root = this;

  if (typeof root.GoRogue === 'object') {
    return root.GoRogue;
  }

  // Base object.
  var GoRogue = root.GoRogue = {
    AC: new (window.AudioContext || window.webkitAudioContext),
    bufferSize: 256,
    error: false,
    messages: [],
    setMessage: function(type, msg) {
      GoRogue.messages[GoRogue.messages.length] = {
        'type': type,
        'msg': msg
      }
    }
  };
  // If audiocontext is not supported, we're done here. Let's stop here for now.
  if (typeof GoRogue.AC === 'undefined') {
    GoRogue.error = true;
    GoRogue.setMessage('error', 'This environment does not support audioContext.')
    return null;
  }

  // Require Underscore, if we're on the server, and it's not already present.
  var _ = root._;
  if (!_ && (typeof require !== 'undefined')) _ = require('underscore');

  // Events that are shared across
  var Events = GoRogue.Events = {
    noteOn: function(noteObject, callback) {
      console.log('on');
    },
  };

  var Oscillator = GoRogue.Oscillator = {
    params: {
      freq: null,
      volume: 1,
      type: 'sine'
    },
    gain: null
  }



  var Voice = GoRogue.Voice = function(attributes) {
    var _this = this;
    this.attributes = attributes || {};
    _.each(this.attributes, function(element, index, list) {
      _this[index] = element;
    });

    this.initialize.apply(this, arguments);
  }

  _.extend(Voice.prototype, {
    defaults: {
      type: 'sine',
      numOscillators: 1,
      oscillatorSemitoneOffsets: [],
      glideRate: 0,
      volume: 1,
      output: null
    },
    ready: true,

    frequency: null,
    startingFrequency: null,
    currentFrequency: null,

    oscillators: [],
    gain: null,

    initialize: function(attributes) {
      this.reset(this.params);
    },
    reset: function(params) {
      this.params = _.extend(this.defaults, params);

      this.output = params.output;
      this.gain = GoRogue.AC.createGain();
      this.gain.connect(this.output);
    },
    play: function(freq, attack, decay, sustain) {

      if (this.currentFrequency === null || this.params.glideRate === 0) {
        this.currentFrequency = freq;
      }

      voice = this;

      this.frequency = freq;
      this.ready = false;
      this.oscillators = [];

      gain = GoRogue.AC.createGain();
      gain.connect(this.output);
//      gain.gain.value = 0;

/*
      processorNode = GoRogue.AC.createScriptProcessor(256, 2, 2);
      processorNode.connect(this.output);
      processorNode.onaudioprocess = function(e) {
      };
*/

console.log(this.params);
      for( i = 0; i < this.params.oscillatorSettings.length; i++) {
        semitoneOffset = (this.params.oscillatorSettings[i].semitoneOffset === 'undefined' ? 0 : this.params.oscillatorSettings[i].semitoneOffset);
        oscillatorGain = GoRogue.AC.createGain();
        oscillatorGain.connect(gain);
        oscillatorGain.gain.value = (this.params.oscillatorSettings[i].volume ? this.params.oscillatorSettings[i].volume : 1);
        oscillator = GoRogue.AC.createOscillator();
        oscillator.type = (this.params.oscillatorSettings[i].type ? this.params.oscillatorSettings[i].type : 'sine');
        oscillator.frequency.value = adjustFrequency(freq, semitoneOffset);
console.log(oscillator.frequency.value);
        oscillator.connect(oscillatorGain);
        oscillator.start(0);
        this.oscillators[this.oscillators.length] = oscillator;
      }

      this.gain = gain;
    },
    fade: function(release) {

    },
    clear: function() {
      this.frequency = null;
      this.ready = true;
      if (this.gain !== null) {
        this.gain.gain.value = 0;
        this.oscillators = [];
        this.gain = null;
      }
    }
  });

  var Synth = GoRogue.Synth = function(attributes) {
    var _this = this;
    this.attributes = attributes || {};
    _.each(this.attributes, function(element, index, list) {
      _this[index] = element;
    });

    this.initialize.apply(this, arguments);
  }


  _.extend(Synth.prototype, Events, {
    ready: true,

    pregain: null,
    postgain: null,

    voices: [],
    activeVoices: [],
    effects: [],
    processorNode: null,
    defaults: {
      numVoices: 1,
      oscillators: [{
        type: 'sine',
        semitoneOffset: 0,
        volume: 1
      },
      {
        type: 'sine',
        semitoneOffset: 7,
        volume: 0.5
      },
      {
        type: 'sine',
        semitoneOffset: 12,
        volume: 1
      }
      ],
      glideRate: 0,
      channels: 1,
      attack: 0,
      decay: 0,
      sustain: 0,
      release: 0
    },
    initialize: function(attributes) {
      this.reset(this.params);
    },
    reset: function(params) {
      this.params = _.extend(this.defaults, params);

      this.params.numVoices = (this.params.numVoices <= 1 ? 1 : this.params.numVoices);
      this.params.numOscillators = (this.params.numOscillators <= 1 ? 1 : this.params.numOscillators);
      this.params.glideRate = (this.params.glideRate <= 0 || this.params.numVoices === 1 ? 0 : this.params.glideRate);

      // set up script node
      this.processorNode = GoRogue.AC.createJavaScriptNode(GoRogue.buffer, this.params.channels, this.params.channels);

      // set up gains
      this.pregain = GoRogue.AC.createGain();
      this.postgain = GoRogue.AC.createGain();

      this.pregain.connect(GoRogue.AC.destination);


      // Set up voices.
      this.voices = [];

      for(i = 0; i < this.params.numVoices; i++) {
        var voiceParams = {
          oscillatorSettings: this.params.oscillators,
          glideRate: this.params.glideRate,
          output: this.pregain
        }
        this.voices[this.voices.length] = new Voice({ params: voiceParams });
      }
      // Setup effects.
      // tbd
    },
    noteOn: function(noteObject, callback) {

      var synth = this;
      var freq = noteObject.frequency;
      var vel = noteObject.velocity;

      if (vel === 0) {
        _.each(this.voices, function(voice, index) {
          if (voice.frequency == freq) {
//            voice.fade(synth.params.decay);
            voice.clear();
            synth.activeVoices.splice(index,1);
          }
        });
      }
      else {
        var startingFrequency = freq;
console.log('active voices ' + this.activeVoices.length + ' of ' + this.params.numVoices);
        if (this.activeVoices.length >= this.voices.length) {
          voice = this.voices[0];
          startingFrequency = voice.currentFrequency;
          voice.clear();
          this.activeVoices.splice(0,1);
        }
      _.each(this.voices, function(voice) {
        if (voice.ready === true) {
          voice.play(freq, synth.params.attack, synth.params.decay, synth.params.sustain, synth.params.release);
          synth.activeVoices[synth.activeVoices.length] = voice;
        }
      });
console.log(synth.activeVoices);
      }

      if (typeof(callback) === 'function') {
        callback.call();
      }
    }
  });



}).call(this);


