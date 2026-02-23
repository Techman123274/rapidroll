/**
 * Lightweight sound effects using Web Audio API.
 * No external files - generates tones in-browser.
 */

import { getSoundSettings } from "./sound-settings";

let audioContext: AudioContext | null = null;

function getContext(): AudioContext {
  if (!audioContext) {
    audioContext = new (window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
  }
  return audioContext;
}

function playTone(
  freq: number,
  duration: number,
  type: OscillatorType = "sine",
  baseVolume = 0.3
) {
  try {
    const { masterVolume, muted } = getSoundSettings();
    if (muted || masterVolume <= 0) return;

    const ctx = getContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.frequency.value = freq;
    osc.type = type;
    const volume = baseVolume * masterVolume;
    gain.gain.setValueAtTime(volume, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + duration);
  } catch {
    // Audio not supported or blocked
  }
}

export const gameSounds = {
  /**
   * Mines safe click / diamond reveal.
   */
  safeClick() {
    playTone(880, 0.15, "sine", 0.2);
    setTimeout(() => playTone(1320, 0.2, "sine", 0.15), 80);
  },
  /**
   * Mines mine explosion.
   */
  mineExplosion() {
    playTone(80, 0.4, "sawtooth", 0.4);
    playTone(60, 0.5, "square", 0.2);
  },
  /**
   * Generic win sequence.
   */
  winSequence() {
    [523, 659, 784, 1047].forEach((f, i) => {
      setTimeout(() => playTone(f, 0.2, "sine", 0.25), i * 100);
    });
  },
  rocket() {
    playTone(200, 0.1, "sawtooth", 0.08);
  },
  crash() {
    playTone(100, 0.3, "sawtooth", 0.5);
    setTimeout(() => playTone(50, 0.4, "square", 0.3), 100);
  },
  bet() {
    playTone(440, 0.1, "sine", 0.2);
  },
};
