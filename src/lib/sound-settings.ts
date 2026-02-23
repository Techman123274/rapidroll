let masterVolume = 1;
let muted = false;

export function setMasterVolume(volume: number) {
  masterVolume = Math.min(1, Math.max(0, volume));
}

export function setMuted(isMuted: boolean) {
  muted = isMuted;
}

export function getSoundSettings() {
  return { masterVolume, muted };
}

