class SoundEngine {
  private ctx: AudioContext | null = null;
  private enabled: boolean = true;
  private isMusicPlaying: boolean = false;
  private nextNoteTime: number = 0;
  private musicTimeout: any = null;

  constructor() {
    try {
      const AudioContextClass = (window.AudioContext || (window as any).webkitAudioContext);
      if (AudioContextClass) {
        this.ctx = new AudioContextClass();
      }
    } catch (e) {
      console.warn("AudioContext not supported");
    }
  }

  public init() {
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().then(() => {
        this.startAmbientMusic();
      });
    } else if (this.ctx && !this.isMusicPlaying) {
      this.startAmbientMusic();
    }
  }

  public toggle(on: boolean) {
    this.enabled = on;
    if (on) {
      this.init();
    } else {
      if (this.ctx) {
        this.ctx.suspend();
      }
      clearTimeout(this.musicTimeout);
      this.isMusicPlaying = false;
    }
  }

  // --- Generative Ambient Music (Minecraft Style) ---
  private startAmbientMusic() {
    if (this.isMusicPlaying || !this.enabled || !this.ctx) return;
    this.isMusicPlaying = true;
    this.scheduleNextNote();
  }

  private scheduleNextNote() {
    if (!this.enabled || !this.ctx) return;

    // Pentatonic scale frequencies (C Major Pentatonic: C, D, E, G, A)
    // Lower octaves for calm ambience
    const scale = [130.81, 146.83, 164.81, 196.00, 220.00, 261.63, 293.66, 329.63]; 
    const note = scale[Math.floor(Math.random() * scale.length)];
    
    // Very random timing: play a note, then wait 2-8 seconds
    const delay = Math.random() * 6000 + 2000; 

    this.playAmbientNote(note);

    this.musicTimeout = setTimeout(() => {
      this.scheduleNextNote();
    }, delay);
  }

  private playAmbientNote(freq: number) {
    if (!this.ctx) return;
    const t = this.ctx.currentTime;
    
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    
    // Soft triangle/sine for piano-like synth
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, t);

    // Slow attack, very long release (reverb-ish)
    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(0.05, t + 0.5); // Attack
    gain.gain.exponentialRampToValueAtTime(0.001, t + 4.0); // Release

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(t);
    osc.stop(t + 4.5);
  }

  // --- SFX ---

  public playPlaceSound() {
    if (!this.enabled || !this.ctx) return;
    // Ensure context is running if user interacted
    if (this.ctx.state === 'suspended') this.ctx.resume();
    // Start music on first interaction if not playing
    if (!this.isMusicPlaying) this.startAmbientMusic();

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    // Randomize pitch slightly (between 0.8x and 1.2x)
    const pitchMod = 0.9 + Math.random() * 0.3; 
    
    osc.type = 'square';
    // Base frequency randomized
    osc.frequency.setValueAtTime(150 * pitchMod, t);
    osc.frequency.exponentialRampToValueAtTime(40 * pitchMod, t + 0.08);

    gain.gain.setValueAtTime(0.2, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.08);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(t);
    osc.stop(t + 0.1);
  }

  public playWinSound() {
    if (!this.enabled || !this.ctx) return;
    
    const now = this.ctx.currentTime;
    // C Major Arpeggio
    const notes = [523.25, 659.25, 783.99, 1046.50]; 
    
    notes.forEach((freq, i) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const t = now + i * 0.12;

      osc.type = 'square';
      osc.frequency.value = freq;
      
      gain.gain.setValueAtTime(0.1, t);
      gain.gain.exponentialRampToValueAtTime(0.01, t + 0.3);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(t);
      osc.stop(t + 0.4);
    });
  }

  public playFireworkLaunch() {
    if (!this.enabled || !this.ctx) return;
    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(200, t);
    osc.frequency.exponentialRampToValueAtTime(600, t + 0.3); // Pitch up like a whistle

    gain.gain.setValueAtTime(0.05, t);
    gain.gain.linearRampToValueAtTime(0, t + 0.3);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(t);
    osc.stop(t + 0.3);
  }

  public playFireworkBlast() {
    if (!this.enabled || !this.ctx) return;

    const t = this.ctx.currentTime;
    // Create noise buffer
    const bufferSize = this.ctx.sampleRate * 0.5; 
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const gain = this.ctx.createGain();
    // Randomize volume slightly
    gain.gain.setValueAtTime(0.1 + Math.random() * 0.1, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.5);

    // Lowpass filter for "boom" sound
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(800, t);
    filter.frequency.exponentialRampToValueAtTime(50, t + 0.5);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    noise.start(t);
  }
}

export const soundEngine = new SoundEngine();
