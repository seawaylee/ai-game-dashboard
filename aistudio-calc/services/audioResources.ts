// Enhanced Ultraman Battle Sound Effects using Web Audio API
// All sounds synthesized for maximum compatibility and excitement!

const createAudioContext = () => {
  const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
  if (!AudioContext) return null;
  return new AudioContext();
};

// Powerful punch/impact sound for button presses
export const playMechanicalClick = () => {
  const ctx = createAudioContext();
  if (!ctx) return;
  const t = ctx.currentTime;

  // Low frequency "thud" for impact
  const osc1 = ctx.createOscillator();
  const gain1 = ctx.createGain();
  osc1.type = 'sine';
  osc1.frequency.setValueAtTime(80, t);
  osc1.frequency.exponentialRampToValueAtTime(40, t + 0.08);
  gain1.gain.setValueAtTime(0.4, t);
  gain1.gain.exponentialRampToValueAtTime(0.01, t + 0.08);
  osc1.connect(gain1);
  gain1.connect(ctx.destination);

  // High frequency "crack" for sharpness
  const osc2 = ctx.createOscillator();
  const gain2 = ctx.createGain();
  osc2.type = 'square';
  osc2.frequency.setValueAtTime(800, t);
  osc2.frequency.exponentialRampToValueAtTime(100, t + 0.04);
  gain2.gain.setValueAtTime(0.15, t);
  gain2.gain.exponentialRampToValueAtTime(0.01, t + 0.04
  );
  osc2.connect(gain2);
  gain2.connect(ctx.destination);

  // Noise burst for realistic impact
  const bufferSize = ctx.sampleRate * 0.05;
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize);
  }
  const noise = ctx.createBufferSource();
  noise.buffer = buffer;
  const noiseGain = ctx.createGain();
  noiseGain.gain.value = 0.2;
  noise.connect(noiseGain);
  noiseGain.connect(ctx.destination);

  osc1.start();
  osc1.stop(t + 0.1);
  osc2.start();
  osc2.stop(t + 0.06);
  noise.start();
};

// Epic transformation/summon sound effect
export const playUltramanShuatch = () => {
  const ctx = createAudioContext();
  if (!ctx) return;
  const t = ctx.currentTime;

  // Massive white noise burst
  const bufferSize = ctx.sampleRate * 0.6;
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / bufferSize, 2);
  }

  const noise = ctx.createBufferSource();
  noise.buffer = buffer;
  const noiseFilter = ctx.createBiquadFilter();
  noiseFilter.type = 'bandpass';
  noiseFilter.frequency.value = 2000;
  noiseFilter.Q.value = 5;

  const noiseGain = ctx.createGain();
  noiseGain.gain.setValueAtTime(0.7, t);
  noiseGain.gain.exponentialRampToValueAtTime(0.01, t + 0.5);

  // Power-up sweep
  const osc = ctx.createOscillator();
  const oscGain = ctx.createGain();
  osc.type = 'sawtooth';
  osc.frequency.setValueAtTime(100, t);
  osc.frequency.exponentialRampToValueAtTime(2000, t + 0.3);
  osc.frequency.exponentialRampToValueAtTime(100, t + 0.6);
  oscGain.gain.setValueAtTime(0.0, t);
  oscGain.gain.linearRampToValueAtTime(0.6, t + 0.1);
  oscGain.gain.exponentialRampToValueAtTime(0.01, t + 0.6);

  // Sub-bass rumble
  const bass = ctx.createOscillator();
  const bassGain = ctx.createGain();
  bass.type = 'sine';
  bass.frequency.value = 40;
  bassGain.gain.setValueAtTime(0.5, t);
  bassGain.gain.exponentialRampToValueAtTime(0.01, t + 0.5);
  bass.connect(bassGain);
  bassGain.connect(ctx.destination);

  // Connections
  noise.connect(noiseFilter);
  noiseFilter.connect(noiseGain);
  noiseGain.connect(ctx.destination);
  osc.connect(oscGain);
  oscGain.connect(ctx.destination);

  noise.start();
  osc.start();
  bass.start();
  osc.stop(t + 0.8);
  bass.stop(t + 0.7);
};

// Color Timer alarm - danger alert!
export const playTimerSound = () => {
  const ctx = createAudioContext();
  if (!ctx) return;
  const t = ctx.currentTime;

  // Urgent pulsing alarm
  for (let i = 0; i < 3; i++) {
    const offset = i * 0.15;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(1200, t + offset);
    osc.frequency.exponentialRampToValueAtTime(800, t + offset + 0.08);
    gain.gain.setValueAtTime(0.25, t + offset);
    gain.gain.exponentialRampToValueAtTime(0.01, t + offset + 0.12);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(t + offset);
    osc.stop(t + offset + 0.15);
  }
};

// Ultimate finishing move - Specium Ray!
export const playBeamSound = () => {
  const ctx = createAudioContext();
  if (!ctx) return;
  const t = ctx.currentTime;

  // Charging phase - energy gathering
  const charge = ctx.createOscillator();
  const chargeGain = ctx.createGain();
  charge.type = 'sawtooth';
  charge.frequency.setValueAtTime(50, t);
  charge.frequency.exponentialRampToValueAtTime(800, t + 0.3);
  chargeGain.gain.setValueAtTime(0.1, t);
  chargeGain.gain.linearRampToValueAtTime(0.4, t + 0.3);
  chargeGain.gain.exponentialRampToValueAtTime(0.01, t + 1.2);
  charge.connect(chargeGain);
  chargeGain.connect(ctx.destination);

  // Beam firing - high energy laser
  const beam = ctx.createOscillator();
  const beamGain = ctx.createGain();
  const beamFilter = ctx.createBiquadFilter();
  beam.type = 'sawtooth';
  beam.frequency.setValueAtTime(800, t + 0.3);
  beam.frequency.linearRampToValueAtTime(1500, t + 0.5);
  beam.frequency.linearRampToValueAtTime(1000, t + 1.0);

  beamFilter.type = 'bandpass';
  beamFilter.frequency.setValueAtTime(1500, t + 0.3);
  beamFilter.Q.value = 10;

  beamGain.gain.setValueAtTime(0, t + 0.28);
  beamGain.gain.linearRampToValueAtTime(0.5, t + 0.32);
  beamGain.gain.setValueAtTime(0.5, t + 0.8);
  beamGain.gain.exponentialRampToValueAtTime(0.01, t + 1.2);

  beam.connect(beamFilter);
  beamFilter.connect(beamGain);
  beamGain.connect(ctx.destination);

  // Wobble modulation for energy effect
  const lfo = ctx.createOscillator();
  const lfoGain = ctx.createGain();
  lfo.type = 'sine';
  lfo.frequency.value = 40;
  lfoGain.gain.value = 300;
  lfo.connect(lfoGain);
  lfoGain.connect(beam.frequency);

  // Explosion at the end
  const bufferSize = ctx.sampleRate * 0.3;
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / bufferSize, 1.5);
  }
  const explosion = ctx.createBufferSource();
  explosion.buffer = buffer;
  const explosionGain = ctx.createGain();
  explosionGain.gain.value = 0.35;
  explosion.connect(explosionGain);
  explosionGain.connect(ctx.destination);

  charge.start();
  beam.start(t + 0.3);
  lfo.start(t + 0.3);
  explosion.start(t + 0.9);

  charge.stop(t + 1.3);
  beam.stop(t + 1.3);
  lfo.stop(t + 1.3);
};
