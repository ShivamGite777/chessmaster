import { Howl } from 'howler';
import { useSettingsStore } from '../store';

// Sound files - in a real app, these would be actual audio files
const soundFiles = {
  move: '/sounds/move.mp3',
  capture: '/sounds/capture.mp3',
  check: '/sounds/check.mp3',
  checkmate: '/sounds/checkmate.mp3',
  victory: '/sounds/victory.mp3',
  defeat: '/sounds/defeat.mp3',
  draw: '/sounds/draw.mp3',
  castle: '/sounds/castle.mp3',
  promotion: '/sounds/promotion.mp3',
  timer: '/sounds/timer.mp3',
  click: '/sounds/click.mp3',
  notification: '/sounds/notification.mp3',
};

class SoundManager {
  private sounds: Map<string, Howl> = new Map();
  private isEnabled: boolean = true;
  private volume: number = 0.7;

  constructor() {
    this.initializeSounds();
  }

  private initializeSounds(): void {
    // Create silent sounds for now - in a real app, load actual audio files
    Object.entries(soundFiles).forEach(([key, src]) => {
      const sound = new Howl({
        src: [src],
        volume: this.volume,
        onloaderror: () => {
          // Create a silent sound if file doesn't exist
          this.sounds.set(key, new Howl({
            src: ['data:audio/wav;base64,UklGRigAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQAAAAA='],
            volume: 0,
          }));
        },
        onload: () => {
          this.sounds.set(key, sound);
        },
      });
    });
  }

  play(soundName: keyof typeof soundFiles): void {
    const { settings } = useSettingsStore.getState();
    
    if (!settings.sound.enabled || !this.isEnabled) {
      return;
    }

    const sound = this.sounds.get(soundName);
    if (sound) {
      sound.volume(settings.sound.volume);
      sound.play();
    }
  }

  playMove(): void {
    this.play('move');
  }

  playCapture(): void {
    this.play('capture');
  }

  playCheck(): void {
    this.play('check');
  }

  playCheckmate(): void {
    this.play('checkmate');
  }

  playVictory(): void {
    this.play('victory');
  }

  playDefeat(): void {
    this.play('defeat');
  }

  playDraw(): void {
    this.play('draw');
  }

  playCastle(): void {
    this.play('castle');
  }

  playPromotion(): void {
    this.play('promotion');
  }

  playTimer(): void {
    this.play('timer');
  }

  playClick(): void {
    this.play('click');
  }

  playNotification(): void {
    this.play('notification');
  }

  setEnabled(enabled: boolean): void {
    this.isEnabled = enabled;
  }

  setVolume(volume: number): void {
    this.volume = Math.max(0, Math.min(1, volume));
    this.sounds.forEach(sound => {
      sound.volume(this.volume);
    });
  }

  preloadSounds(): void {
    this.sounds.forEach(sound => {
      sound.load();
    });
  }
}

export const soundManager = new SoundManager();