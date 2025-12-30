export class SoundManager {
    private static instance: SoundManager;
    private ctx: AudioContext | null = null;
    private isMuted: boolean = false;

    private constructor() { }

    static getInstance(): SoundManager {
        if (!SoundManager.instance) {
            SoundManager.instance = new SoundManager();
        }
        return SoundManager.instance;
    }

    private getContext(): AudioContext | null {
        if (!this.ctx) {
            // AudioContext needs user interaction to start.
            // We'll init lazily or handle 'suspended' state.
            const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
            if (AudioContext) {
                this.ctx = new AudioContext();
            }
        }
        return this.ctx;
    }

    // To be called on first user interaction (e.g. Start Game button)
    async init() {
        const ctx = this.getContext();
        if (ctx && ctx.state === 'suspended') {
            await ctx.resume();
        }
    }

    playClick() {
        if (this.isMuted) return;
        const ctx = this.getContext();
        if (!ctx) return;

        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.type = 'sine';
        osc.frequency.setValueAtTime(400, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(600, ctx.currentTime + 0.1);

        gain.gain.setValueAtTime(0.1, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);

        osc.start();
        osc.stop(ctx.currentTime + 0.1);
    }

    playCorrect() {
        if (this.isMuted) return;
        const ctx = this.getContext();
        if (!ctx) return;

        // Chime: Two tones
        const t = ctx.currentTime;
        this.tone(600, t, 0.1);
        this.tone(1000, t + 0.1, 0.2);
    }

    playWrong() {
        if (this.isMuted) return;
        const ctx = this.getContext();
        if (!ctx) return;

        // Buzz: Sawtooth
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(150, ctx.currentTime);
        osc.frequency.linearRampToValueAtTime(100, ctx.currentTime + 0.3);

        gain.gain.setValueAtTime(0.2, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.01, ctx.currentTime + 0.3);

        osc.start();
        osc.stop(ctx.currentTime + 0.3);
    }

    playGameOver() {
        if (this.isMuted) return;
        const ctx = this.getContext();
        if (!ctx) return;

        // Descending scale
        const t = ctx.currentTime;
        this.tone(500, t, 0.2, 'triangle');
        this.tone(400, t + 0.2, 0.2, 'triangle');
        this.tone(300, t + 0.4, 0.4, 'triangle');
    }

    private tone(freq: number, time: number, duration: number, type: OscillatorType = 'sine') {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.type = type;
        osc.frequency.setValueAtTime(freq, time);

        gain.gain.setValueAtTime(0.1, time);
        gain.gain.exponentialRampToValueAtTime(0.01, time + duration);

        osc.start(time);
        osc.stop(time + duration);
    }

    toggleMute() {
        this.isMuted = !this.isMuted;
        return this.isMuted;
    }
}
