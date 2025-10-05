export class TimeUtils {
  static formatTime(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  }

  static formatTimeMs(milliseconds: number): string {
    return this.formatTime(Math.floor(milliseconds / 1000));
  }

  static parseTimeString(timeString: string): number {
    const parts = timeString.split(':').map(Number);
    if (parts.length === 2) {
      // MM:SS format
      return parts[0] * 60 + parts[1];
    } else if (parts.length === 3) {
      // HH:MM:SS format
      return parts[0] * 3600 + parts[1] * 60 + parts[2];
    }
    return 0;
  }

  static getTimeControlLabel(timeControl: string, timeLimit: number, increment: number): string {
    const timeStr = this.formatTime(timeLimit);
    if (increment > 0) {
      return `${timeStr}+${increment}`;
    }
    return timeStr;
  }

  static getTimeControlFromString(timeString: string): { timeLimit: number; increment: number } {
    const [time, increment] = timeString.split('+');
    return {
      timeLimit: this.parseTimeString(time),
      increment: increment ? parseInt(increment) : 0,
    };
  }

  static isTimeLow(timeMs: number, warningThreshold = 30000): boolean {
    return timeMs <= warningThreshold;
  }

  static isTimeCritical(timeMs: number, criticalThreshold = 10000): boolean {
    return timeMs <= criticalThreshold;
  }

  static getTimeColor(timeMs: number): string {
    if (this.isTimeCritical(timeMs)) {
      return 'text-red-500';
    } else if (this.isTimeLow(timeMs)) {
      return 'text-yellow-500';
    }
    return 'text-white';
  }

  static calculateTimeRemaining(
    startTime: number,
    timeLimit: number,
    increment: number = 0,
    movesMade: number = 0
  ): number {
    const elapsed = Date.now() - startTime;
    const bonus = movesMade * increment * 1000;
    return Math.max(0, timeLimit * 1000 - elapsed + bonus);
  }

  static getTimeControlPresets() {
    return [
      { id: 'blitz-3-0', name: 'Blitz 3+0', timeLimit: 180, increment: 0 },
      { id: 'blitz-5-0', name: 'Blitz 5+0', timeLimit: 300, increment: 0 },
      { id: 'rapid-10-0', name: 'Rapid 10+0', timeLimit: 600, increment: 0 },
      { id: 'rapid-15-10', name: 'Rapid 15+10', timeLimit: 900, increment: 10 },
      { id: 'classical-30-0', name: 'Classical 30+0', timeLimit: 1800, increment: 0 },
      { id: 'classical-60-0', name: 'Classical 60+0', timeLimit: 3600, increment: 0 },
    ];
  }

  static getTimeControlById(id: string) {
    return this.getTimeControlPresets().find(preset => preset.id === id);
  }

  static formatDuration(seconds: number): string {
    if (seconds < 60) {
      return `${seconds}s`;
    } else if (seconds < 3600) {
      const minutes = Math.floor(seconds / 60);
      const remainingSeconds = seconds % 60;
      return remainingSeconds > 0 ? `${minutes}m ${remainingSeconds}s` : `${minutes}m`;
    } else {
      const hours = Math.floor(seconds / 3600);
      const minutes = Math.floor((seconds % 3600) / 60);
      return minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`;
    }
  }

  static getRelativeTime(timestamp: number): string {
    const now = Date.now();
    const diff = now - timestamp;
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) {
      return `${days}d ago`;
    } else if (hours > 0) {
      return `${hours}h ago`;
    } else if (minutes > 0) {
      return `${minutes}m ago`;
    } else {
      return 'Just now';
    }
  }
}