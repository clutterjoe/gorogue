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
 * Aux (bus) - gainNode
 */

(function() {
  var root = this;

  if (typeof root.GoRogue === 'object') {
    return root.GoRogue;
  }

  // Base object.
  var GoRogue = root.GoRogue = {
    AC: new (window.AudioContext || window.webkitAudioContext),
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

console.log(GoRogue.AC);
return;

  // Require Underscore, if we're on the server, and it's not already present.
  var _ = root._;
  if (!_ && (typeof require !== 'undefined')) _ = require('underscore');

  // Events that are shared across
  var Events = GoRogue.Events = {
    on: function(name, callback, context) {

    },
    off: function(name, callback, context) {

    },
    attach: function(name, callback, context) {

    },
    detach: function(name, callback, context) {

    }
  };

  var Init = function(options) {
    this.options = options || {};
    this.initialize.apply(this, arguments);
  };

  var AudioFlow = {
    ac: GoRogue.AC,
    output: GoRogue.AC.audioDestination()
  };

  var Input = GoRogue.Input = {};
  var Oscillator = GoRogue.Oscillator = {};
  var Effect = GoRogue.Effect = {};
  var Instrument = GoRogue.Instrument = {};
  var Synth = GoRogue.Synth = {};
  var Sampler = GoRogue.Sampler = {};
  var Aux = GoRogue.Aux = {};

  _.extend(Input.prototype, Init, Events, {

  });
  _.extend(Oscillator.prototype, Init, AudioFlow, Events, {

  });

  _.extend(Effect.prototype, Init, AudioFlow, Events, {

  });

  _.extend(Instrument.prototype, Init, AudioFlow, Events, {
    components: [],
    effects: [],
    output: GoRogue.AC
  });







}).call(this);


