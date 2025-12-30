export class GameTimer {
    private intervalId: number | null = null;
    private remainingTime: number;
    private onTick: (time: number) => void;
    private onEnd: () => void;

    constructor(initialTime: number, onTick: (t: number) => void, onEnd: () => void) {
        this.remainingTime = initialTime;
        this.onTick = onTick;
        this.onEnd = onEnd;
    }

    start() {
        if (this.intervalId) return;
        this.intervalId = window.setInterval(() => {
            this.remainingTime--;
            this.onTick(this.remainingTime);
            if (this.remainingTime <= 0) {
                this.stop();
                this.onEnd();
            }
        }, 1000);
    }

    stop() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
    }

    reset(newTime: number) {
        this.stop();
        this.remainingTime = newTime;
    }

    getTime(): number {
        return this.remainingTime;
    }
}
