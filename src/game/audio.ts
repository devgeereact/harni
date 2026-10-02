/** Tiny WebAudio blips. Nothing is created until the visitor turns sound on. */
export type Blip = 'jump' | 'pickup' | 'hit' | 'power' | 'over';

export interface Sfx {
  readonly enabled: boolean;
  /** Turns sound on or off. Must be called from a click or key press. Returns the new state. */
  setEnabled: (on: boolean) => boolean;
  play: (blip: Blip, pitch?: number) => void;
}

type AudioWindow = Window & { webkitAudioContext?: typeof AudioContext };

const NOTES: Record<Blip, { from: number; to: number; time: number; type: OscillatorType; gain: number }> = {
  jump: { from: 380, to: 620, time: 0.14, type: 'triangle', gain: 0.05 },
  pickup: { from: 760, to: 1180, time: 0.12, type: 'sine', gain: 0.05 },
  power: { from: 520, to: 1040, time: 0.28, type: 'triangle', gain: 0.05 },
  hit: { from: 220, to: 110, time: 0.22, type: 'sawtooth', gain: 0.04 },
  over: { from: 330, to: 196, time: 0.45, type: 'triangle', gain: 0.045 },
};

export const createSfx = (): Sfx => {
  let ctx: AudioContext | null = null;
  let on = false;

  const ensure = (): AudioContext | null => {
    if (ctx) return ctx;
    const Ctor = window.AudioContext ?? (window as AudioWindow).webkitAudioContext;
    if (!Ctor) return null;
    try {
      ctx = new Ctor();
    } catch {
      ctx = null;
    }
    return ctx;
  };

  return {
    get enabled() { return on; },
    setEnabled: (value) => {
      if (!value) {
        on = false;
        return false;
      }
      const audio = ensure();
      if (!audio) return false;
      void audio.resume().catch(() => undefined);
      on = true;
      return true;
    },
    play: (blip, pitch = 1) => {
      if (!on || !ctx) return;
      const note = NOTES[blip];
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = note.type;
      osc.frequency.setValueAtTime(note.from * pitch, now);
      osc.frequency.exponentialRampToValueAtTime(note.to * pitch, now + note.time);
      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.exponentialRampToValueAtTime(note.gain, now + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + note.time);
      osc.connect(gain).connect(ctx.destination);
      osc.start(now);
      osc.stop(now + note.time + 0.03);
    },
  };
};
