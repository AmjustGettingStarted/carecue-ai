// Web Audio API chime generator for CareCue alarms (zero external audio file dependencies)

class AudioManager {
  private ctx: AudioContext | null = null;
  private intervalId: ReturnType<typeof setInterval> | null = null;
  private isAlarmPlaying = false;

  private getContext(): AudioContext | null {
    if (typeof window === "undefined") return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  // Play a pleasant 3-tone notification chime (C5 -> E5 -> G5)
  playChime(type: "alarm" | "success" | "gentle" = "alarm") {
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const frequencies =
        type === "success"
          ? [523.25, 659.25, 1046.5] // C5, E5, C6
          : type === "gentle"
          ? [440, 554.37] // A4, C#5
          : [587.33, 739.99, 880.0]; // D5, F#5, A5 (urgent yet melodic)

      frequencies.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, now + idx * 0.16);

        // Gentle attack, smooth release
        gain.gain.setValueAtTime(0.001, now + idx * 0.16);
        gain.gain.exponentialRampToValueAtTime(0.35, now + idx * 0.16 + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.16 + 0.38);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + idx * 0.16);
        osc.stop(now + idx * 0.16 + 0.4);
      });
    } catch (e) {
      console.warn("CareCue AudioContext play error:", e);
    }
  }

  // Start continuous loop for active alarm (rings every 2.5s)
  startAlarmLoop() {
    if (this.isAlarmPlaying) return;
    this.isAlarmPlaying = true;
    this.playChime("alarm");

    this.intervalId = setInterval(() => {
      this.playChime("alarm");
    }, 2400);
  }

  // Stop the alarm loop
  stopAlarmLoop() {
    this.isAlarmPlaying = false;
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  isPlaying(): boolean {
    return this.isAlarmPlaying;
  }
}

export const audioManager = new AudioManager();
