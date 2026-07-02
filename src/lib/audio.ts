/**
 * Procedural audio engine — zero audio files.
 *
 * Everything is synthesized with raw WebAudio:
 *  · MUSIC  — a slow generative score: detuned pad voices walking an
 *             Am9 → Fmaj7 → Cmaj7 → G6 progression through a low-pass
 *             filter and a synthesized hall (noise-burst convolution),
 *             with sparse pentatonic plucks on top.
 *  · SFX    — filtered-noise whooshes for camera flights, sine blips for
 *             UI, shimmer chords for panel opens.
 *  · ROOM   — a faint band-passed noise bed so silence never feels dead.
 *
 * The AudioContext unlocks on the boot screen's ENTER press (autoplay
 * policy), and the engine degrades to silence gracefully if WebAudio is
 * unavailable.
 */

export type SfxName =
  | "click"
  | "hover"
  | "whoosh"
  | "open"
  | "close"
  | "success"
  | "begin";

const CHORDS: number[][] = [
  // Am9        F maj7        C maj7        G6
  [110.0, 164.81, 220.0, 246.94, 329.63],
  [87.31, 174.61, 220.0, 261.63, 329.63],
  [130.81, 196.0, 246.94, 329.63, 392.0],
  [98.0, 146.83, 196.0, 246.94, 293.66],
];

const PLUCK_SCALE = [440.0, 523.25, 587.33, 659.25, 783.99, 880.0];

const BAR_SECONDS = 7.5;

class AudioEngine {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private musicBus: GainNode | null = null;
  private sfxBus: GainNode | null = null;
  private roomBus: GainNode | null = null;
  private filter: BiquadFilterNode | null = null;
  private noiseBuffer: AudioBuffer | null = null;
  private schedulerId: number | null = null;
  private chordIndex = 0;
  private musicOn = false;
  private soundOn = true;
  private volume = 0.7;
  private lastHover = 0;

  get ready(): boolean {
    return this.ctx !== null;
  }

  /** Must be called from a user gesture. Safe to call repeatedly. */
  init(): void {
    if (typeof window === "undefined" || this.ctx) {
      void this.ctx?.resume();
      return;
    }
    const Ctor =
      window.AudioContext ??
      (window as unknown as { webkitAudioContext?: typeof AudioContext })
        .webkitAudioContext;
    if (!Ctor) return;

    const ctx = new Ctor();
    this.ctx = ctx;

    const compressor = ctx.createDynamicsCompressor();
    compressor.threshold.value = -18;
    compressor.knee.value = 24;
    compressor.ratio.value = 6;
    compressor.connect(ctx.destination);

    this.master = ctx.createGain();
    this.master.gain.value = this.volume;
    this.master.connect(compressor);

    // synthesized hall: exponentially decaying noise impulse
    const convolver = ctx.createConvolver();
    convolver.buffer = this.makeImpulse(3.2, 2.6);
    const wet = ctx.createGain();
    wet.gain.value = 0.55;
    convolver.connect(wet);
    wet.connect(this.master);

    this.filter = ctx.createBiquadFilter();
    this.filter.type = "lowpass";
    this.filter.frequency.value = 620;
    this.filter.Q.value = 0.6;

    this.musicBus = ctx.createGain();
    this.musicBus.gain.value = 0;
    this.musicBus.connect(this.filter);
    this.filter.connect(this.master);
    this.filter.connect(convolver);

    // slow breathing on the filter cutoff
    const lfo = ctx.createOscillator();
    lfo.frequency.value = 0.05;
    const lfoAmp = ctx.createGain();
    lfoAmp.gain.value = 180;
    lfo.connect(lfoAmp);
    lfoAmp.connect(this.filter.frequency);
    lfo.start();

    this.sfxBus = ctx.createGain();
    this.sfxBus.gain.value = this.soundOn ? 0.9 : 0;
    this.sfxBus.connect(this.master);
    this.sfxBus.connect(convolver);

    this.noiseBuffer = this.makeNoise(2.5);

    // faint industrial room tone
    this.roomBus = ctx.createGain();
    this.roomBus.gain.value = 0.05;
    this.roomBus.connect(this.master);
    const room = ctx.createBufferSource();
    room.buffer = this.noiseBuffer;
    room.loop = true;
    const roomFilter = ctx.createBiquadFilter();
    roomFilter.type = "bandpass";
    roomFilter.frequency.value = 160;
    roomFilter.Q.value = 0.4;
    room.connect(roomFilter);
    roomFilter.connect(this.roomBus);
    room.start();

    if (this.musicOn) this.startScheduler();
  }

  setVolume(v: number): void {
    this.volume = v;
    if (this.master && this.ctx) {
      this.master.gain.setTargetAtTime(v, this.ctx.currentTime, 0.1);
    }
  }

  setSoundOn(on: boolean): void {
    this.soundOn = on;
    if (this.sfxBus && this.ctx) {
      this.sfxBus.gain.setTargetAtTime(on ? 0.9 : 0, this.ctx.currentTime, 0.05);
    }
  }

  setMusicOn(on: boolean): void {
    this.musicOn = on;
    if (!this.ctx || !this.musicBus) return;
    this.musicBus.gain.setTargetAtTime(
      on ? 0.5 : 0,
      this.ctx.currentTime,
      on ? 1.5 : 0.6
    );
    if (on) this.startScheduler();
    else this.stopScheduler();
  }

  /* ── music scheduler ─────────────────────────────────────── */

  private startScheduler(): void {
    if (!this.ctx || this.schedulerId !== null) return;
    this.playBar();
    this.schedulerId = window.setInterval(
      () => this.playBar(),
      BAR_SECONDS * 1000
    );
  }

  private stopScheduler(): void {
    if (this.schedulerId !== null) {
      window.clearInterval(this.schedulerId);
      this.schedulerId = null;
    }
  }

  private playBar(): void {
    const ctx = this.ctx;
    const bus = this.musicBus;
    if (!ctx || !bus || !this.musicOn) return;
    const t = ctx.currentTime + 0.05;
    const chord = CHORDS[this.chordIndex % CHORDS.length];
    this.chordIndex += 1;

    chord.forEach((freq, i) => {
      // two detuned voices per note = slow chorus
      for (const detune of [-4, 4]) {
        const osc = ctx.createOscillator();
        osc.type = i === 0 ? "sine" : "triangle";
        osc.frequency.value = freq;
        osc.detune.value = detune + (Math.random() * 3 - 1.5);
        const g = ctx.createGain();
        const peak = (i === 0 ? 0.09 : 0.05) / 2;
        g.gain.setValueAtTime(0.0001, t);
        g.gain.exponentialRampToValueAtTime(peak, t + 2.4);
        g.gain.setValueAtTime(peak, t + BAR_SECONDS - 2.8);
        g.gain.exponentialRampToValueAtTime(0.0001, t + BAR_SECONDS + 1.2);
        osc.connect(g);
        g.connect(bus);
        osc.start(t);
        osc.stop(t + BAR_SECONDS + 1.4);
      }
    });

    // sparse plucks — skip some bars so the score stays airy
    if (Math.random() < 0.75) {
      const count = 1 + Math.floor(Math.random() * 2);
      for (let i = 0; i < count; i++) {
        const when = t + 1 + Math.random() * (BAR_SECONDS - 3);
        const freq =
          PLUCK_SCALE[Math.floor(Math.random() * PLUCK_SCALE.length)];
        const osc = ctx.createOscillator();
        osc.type = "sine";
        osc.frequency.value = freq;
        const g = ctx.createGain();
        g.gain.setValueAtTime(0.0001, when);
        g.gain.exponentialRampToValueAtTime(0.05, when + 0.03);
        g.gain.exponentialRampToValueAtTime(0.0001, when + 2.2);
        osc.connect(g);
        g.connect(bus);
        osc.start(when);
        osc.stop(when + 2.4);
      }
    }
  }

  /* ── sound effects ───────────────────────────────────────── */

  sfx(name: SfxName): void {
    const ctx = this.ctx;
    const bus = this.sfxBus;
    if (!ctx || !bus || !this.soundOn) return;
    const t = ctx.currentTime;

    switch (name) {
      case "click":
        this.blip(1150, 720, 0.07, 0.16);
        break;
      case "hover": {
        // rate-limit: pointer sweeps fire many hovers
        if (t - this.lastHover < 0.06) return;
        this.lastHover = t;
        this.blip(1800, 1500, 0.035, 0.05);
        break;
      }
      case "close":
        this.blip(540, 320, 0.12, 0.14);
        break;
      case "whoosh":
        this.whoosh(1.4);
        break;
      case "open":
        this.shimmer([523.25, 783.99, 1046.5], 0.09);
        break;
      case "success":
        this.shimmer([659.25, 830.61, 1318.5], 0.11);
        break;
      case "begin":
        this.whoosh(2.4);
        this.shimmer([261.63, 392.0, 523.25, 783.99], 0.1);
        break;
    }
  }

  private blip(f0: number, f1: number, dur: number, vol: number): void {
    const ctx = this.ctx;
    const bus = this.sfxBus;
    if (!ctx || !bus) return;
    const t = ctx.currentTime;
    const osc = ctx.createOscillator();
    osc.type = "sine";
    osc.frequency.setValueAtTime(f0, t);
    osc.frequency.exponentialRampToValueAtTime(f1, t + dur);
    const g = ctx.createGain();
    g.gain.setValueAtTime(vol, t);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    osc.connect(g);
    g.connect(bus);
    osc.start(t);
    osc.stop(t + dur + 0.05);
  }

  private shimmer(freqs: number[], vol: number): void {
    const ctx = this.ctx;
    const bus = this.sfxBus;
    if (!ctx || !bus) return;
    const t = ctx.currentTime;
    freqs.forEach((f, i) => {
      const osc = ctx.createOscillator();
      osc.type = "sine";
      osc.frequency.value = f;
      const g = ctx.createGain();
      const start = t + i * 0.05;
      g.gain.setValueAtTime(0.0001, start);
      g.gain.exponentialRampToValueAtTime(vol, start + 0.04);
      g.gain.exponentialRampToValueAtTime(0.0001, start + 0.9);
      osc.connect(g);
      g.connect(bus);
      osc.start(start);
      osc.stop(start + 1);
    });
  }

  private whoosh(dur: number): void {
    const ctx = this.ctx;
    const bus = this.sfxBus;
    if (!ctx || !bus || !this.noiseBuffer) return;
    const t = ctx.currentTime;
    const src = ctx.createBufferSource();
    src.buffer = this.noiseBuffer;
    src.loop = true;
    const bp = ctx.createBiquadFilter();
    bp.type = "bandpass";
    bp.Q.value = 0.8;
    bp.frequency.setValueAtTime(240, t);
    bp.frequency.exponentialRampToValueAtTime(1900, t + dur * 0.42);
    bp.frequency.exponentialRampToValueAtTime(320, t + dur);
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(0.22, t + dur * 0.38);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    src.connect(bp);
    bp.connect(g);
    g.connect(bus);
    src.start(t);
    src.stop(t + dur + 0.1);
  }

  /* ── buffers ─────────────────────────────────────────────── */

  private makeNoise(seconds: number): AudioBuffer {
    const ctx = this.ctx as AudioContext;
    const buffer = ctx.createBuffer(
      1,
      Math.floor(ctx.sampleRate * seconds),
      ctx.sampleRate
    );
    const data = buffer.getChannelData(0);
    for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
    return buffer;
  }

  private makeImpulse(seconds: number, decay: number): AudioBuffer {
    const ctx = this.ctx as AudioContext;
    const len = Math.floor(ctx.sampleRate * seconds);
    const buffer = ctx.createBuffer(2, len, ctx.sampleRate);
    for (let ch = 0; ch < 2; ch++) {
      const data = buffer.getChannelData(ch);
      for (let i = 0; i < len; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, decay);
      }
    }
    return buffer;
  }
}

/** Singleton — import anywhere, safe on the server (no-ops until init). */
export const audio = new AudioEngine();
