const audioContext = new AudioContext();

// Create the oscillator and set the waveform and frequency
const oscillator = audioContext.createOscillator();
oscillator.type = "sawtooth";
oscillator.frequency.value = 440; // This will play the A4 note (440 Hz)

// Create the gain node and connect the oscillator to it
const gainNode = audioContext.createGain();
oscillator.connect(gainNode);

// Create the low-pass filter and connect the gain node to it
const filter = audioContext.createBiquadFilter();
filter.type = "lowpass";
filter.frequency.value = 1000;
gainNode.connect(filter);

// Connect the filter to the destination of the AudioContext
filter.connect(audioContext.destination);

// Use the envelope to shape the attack, decay, sustain, and release of the sound
const envelope = {
  attack: 0.1,
  decay: 0.1,
  sustain: 0.5,
  release: 1,
};

// Set the initial value of the gain node to 0
gainNode.gain.value = 0;

// Start the oscillator and ramp up the gain over the attack time
oscillator.start();
gainNode.gain.linearRampToValueAtTime(1, audioContext.currentTime + envelope.attack);

// Ramp down the gain over the decay time
gainNode.gain.linearRampToValueAtTime(
  envelope.sustain,
  audioContext.currentTime + envelope.attack + envelope.decay
);

// Stop the oscillator and ramp down the gain over the release time
setTimeout(() => {
  oscillator.stop();
  gainNode.gain.linearRampToValueAtTime(
    0,
    audioContext.currentTime + envelope.release
  );
}, 1000);
