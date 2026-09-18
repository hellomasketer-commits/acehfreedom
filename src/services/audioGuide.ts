export class AudioGuideService {
  private synth: SpeechSynthesis | null = null;
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private audioCtx: AudioContext | null = null;
  private ambienceOscillators: OscillatorNode[] = [];
  private ambienceGain: GainNode | null = null;
  private isAmbiencePlaying: boolean = false;
  private onProgressCallback: ((currentTime: number, progress: number) => void) | null = null;
  private onEndCallback: (() => void) | null = null;
  private progressTimer: number | null = null;

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.synth = window.speechSynthesis;
    }
  }

  private initAudioContext() {
    if (!this.audioCtx && typeof window !== 'undefined') {
      const AudioCtxClass =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtxClass) {
        this.audioCtx = new AudioCtxClass();
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }

  public playNarration(
    text: string,
    totalDurationSeconds: number,
    voiceStyle: 'curator' | 'storyteller' | 'archivist',
    speed: number = 1.0,
    onProgress?: (currentTime: number, progress: number) => void,
    onEnd?: () => void
  ) {
    this.stopNarration();
    this.onProgressCallback = onProgress || null;
    this.onEndCallback = onEnd || null;

    const startTime = Date.now();
    const effectiveDuration = (totalDurationSeconds / speed) * 1000;

    // Start progress timer
    this.progressTimer = window.setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(1, elapsed / effectiveDuration);
      const currentTime = progress * totalDurationSeconds;

      if (this.onProgressCallback) {
        this.onProgressCallback(currentTime, progress);
      }

      if (progress >= 1) {
        this.stopNarration();
        if (this.onEndCallback) {
          this.onEndCallback();
        }
      }
    }, 150);

    if (!this.synth) {
      return;
    }

    try {
      this.synth.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = speed;

      // Select Indonesian / Malay voice if available, fallback to natural voice
      const voices = this.synth.getVoices();
      if (voices.length > 0) {
        const idVoice =
          voices.find((v) => v.lang.startsWith('id') || v.lang.startsWith('in')) ||
          voices.find((v) => v.lang.startsWith('ms')) ||
          voices.find((v) => v.name.includes('Indonesian') || v.name.includes('Indo')) ||
          voices.find((v) => v.name.includes('Natural') || v.name.includes('Google')) ||
          voices[0];

        if (idVoice) {
          utterance.voice = idVoice;
          if (idVoice.lang) {
            utterance.lang = idVoice.lang;
          }
        }

        if (voiceStyle === 'storyteller') {
          utterance.pitch = 0.94;
          utterance.rate = speed * 0.95;
        } else if (voiceStyle === 'archivist') {
          utterance.pitch = 1.06;
          utterance.rate = speed * 1.04;
        } else {
          utterance.pitch = 1.0;
        }
      }

      utterance.onend = () => {
        if (this.progressTimer) {
          clearInterval(this.progressTimer);
          this.progressTimer = null;
        }
        if (this.onProgressCallback) {
          this.onProgressCallback(totalDurationSeconds, 1);
        }
        if (this.onEndCallback) {
          this.onEndCallback();
        }
      };

      utterance.onerror = () => {
        // Fallback continues via progress timer
      };

      this.currentUtterance = utterance;
      this.synth.speak(utterance);
    } catch {
      // Audio speech fallback continues via timer
    }
  }

  public pauseNarration() {
    if (this.synth && this.synth.speaking) {
      this.synth.pause();
    }
    if (this.progressTimer) {
      clearInterval(this.progressTimer);
      this.progressTimer = null;
    }
  }

  public resumeNarration() {
    if (this.synth && this.synth.paused) {
      this.synth.resume();
    }
  }

  public stopNarration() {
    if (this.synth) {
      this.synth.cancel();
    }
    this.currentUtterance = null;
    if (this.progressTimer) {
      clearInterval(this.progressTimer);
      this.progressTimer = null;
    }
  }

  // Play atmospheric historical soundscapes via Web Audio API
  public startAmbientSoundscape(theme: 'seurune' | 'rapai' | 'azan_rimba' | 'vivaldi_forest') {
    this.initAudioContext();
    if (!this.audioCtx) return;

    this.stopAmbientSoundscape();
    this.isAmbiencePlaying = true;

    try {
      const masterGain = this.audioCtx.createGain();
      masterGain.gain.setValueAtTime(0.045, this.audioCtx.currentTime);
      masterGain.connect(this.audioCtx.destination);
      this.ambienceGain = masterGain;

      // Note frequencies reflecting Acehnese and classical motifs
      let notes: number[] = [];
      let oscType: OscillatorType = 'sine';

      switch (theme) {
        case 'seurune':
          // Pentatonic melodic motif inspired by traditional Seurune Kalee
          notes = [293.66, 329.63, 369.99, 440.0, 493.88, 587.33]; // D, E, F#, A, B, D
          oscType = 'triangle';
          break;
        case 'rapai':
          // Deep rhythmic resonance and gong overtone
          notes = [110.0, 146.83, 164.81, 220.0, 293.66]; // Low A, D, E
          oscType = 'sine';
          break;
        case 'azan_rimba':
          // Serene meditative mountain drone (Hijaz / Bayati resonance)
          notes = [220.0, 233.08, 277.18, 293.66, 329.63, 440.0];
          oscType = 'sine';
          break;
        case 'vivaldi_forest':
          // Baroque chamber chords (Bach & Vivaldi tapes in Hasan di Tiro's diary)
          notes = [196.0, 246.94, 293.66, 392.0, 440.0, 587.33]; // G minor / D major
          oscType = 'sawtooth';
          break;
      }

      notes.forEach((freq, idx) => {
        if (!this.audioCtx) return;
        const osc = this.audioCtx.createOscillator();
        const oscGain = this.audioCtx.createGain();

        osc.type = oscType;
        osc.frequency.setValueAtTime(freq, this.audioCtx.currentTime);

        // Low volume subtle harmonic
        const harmonicVol = oscType === 'sawtooth' ? 0.015 / (idx + 1) : 0.03 / (idx + 1);
        oscGain.gain.setValueAtTime(harmonicVol, this.audioCtx.currentTime);

        // Gentle tremolo LFO for natural breath
        const lfo = this.audioCtx.createOscillator();
        lfo.frequency.setValueAtTime(0.18 + idx * 0.08, this.audioCtx.currentTime);
        const lfoGain = this.audioCtx.createGain();
        lfoGain.gain.setValueAtTime(harmonicVol * 0.4, this.audioCtx.currentTime);
        lfo.connect(lfoGain);
        lfoGain.connect(oscGain.gain);
        lfo.start();

        osc.connect(oscGain);
        oscGain.connect(masterGain);
        osc.start();

        this.ambienceOscillators.push(osc, lfo);
      });
    } catch {
      // Audio context might be restricted before user interaction
    }
  }

  public stopAmbientSoundscape() {
    if (this.ambienceGain && this.audioCtx) {
      try {
        this.ambienceGain.gain.linearRampToValueAtTime(0.0001, this.audioCtx.currentTime + 0.5);
      } catch {
        // Safe catch
      }
    }

    setTimeout(() => {
      this.ambienceOscillators.forEach((osc) => {
        try {
          osc.stop();
          osc.disconnect();
        } catch {
          // Ignore
        }
      });
      this.ambienceOscillators = [];
      this.ambienceGain = null;
      this.isAmbiencePlaying = false;
    }, 550);
  }

  // Play traditional acoustic chime when interacting or teleporting
  public playAcousticChime(frequency: number = 523.25) {
    this.initAudioContext();
    if (!this.audioCtx) return;

    try {
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(frequency, this.audioCtx.currentTime);

      // Bell-like decay envelope
      gain.gain.setValueAtTime(0.12, this.audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.audioCtx.currentTime + 1.2);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc.start();
      osc.stop(this.audioCtx.currentTime + 1.2);
    } catch {
      // Safe ignore
    }
  }

  public playGongTone() {
    this.initAudioContext();
    if (!this.audioCtx) return;

    try {
      const freqs = [130.81, 164.81, 196.0];
      freqs.forEach((freq) => {
        if (!this.audioCtx) return;
        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, this.audioCtx.currentTime);

        gain.gain.setValueAtTime(0.15, this.audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, this.audioCtx.currentTime + 2.5);

        osc.connect(gain);
        gain.connect(this.audioCtx.destination);

        osc.start();
        osc.stop(this.audioCtx.currentTime + 2.5);
      });
    } catch {
      // Safe ignore
    }
  }

  // Play subtle cinematic swoosh with harmonic chime during camera transition
  public playCinematicSwoosh() {
    this.initAudioContext();
    if (!this.audioCtx) return;

    try {
      const now = this.audioCtx.currentTime;
      // Soft filtered frequency sweep
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.exponentialRampToValueAtTime(659.25, now + 0.35);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.09, now + 0.12);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.65);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc.start(now);
      osc.stop(now + 0.7);

      // Soft accompanying overtone chime
      const chime = this.audioCtx.createOscillator();
      const chimeGain = this.audioCtx.createGain();
      chime.type = 'triangle';
      chime.frequency.setValueAtTime(880, now + 0.1);
      chimeGain.gain.setValueAtTime(0.001, now + 0.1);
      chimeGain.gain.linearRampToValueAtTime(0.04, now + 0.2);
      chimeGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.75);

      chime.connect(chimeGain);
      chimeGain.connect(this.audioCtx.destination);

      chime.start(now + 0.1);
      chime.stop(now + 0.8);
    } catch {
      // Safe ignore
    }
  }

  public isPlaying(): boolean {
    return (this.synth?.speaking ?? false) || this.isAmbiencePlaying;
  }
}

export const audioGuide = new AudioGuideService();
