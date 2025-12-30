export class InputManager {
    private static instance: InputManager;
    private listeners: Set<(key: string) => void> = new Set();

    private constructor() {
        this.setupPhysicalKeyboard();
    }

    static getInstance(): InputManager {
        if (!InputManager.instance) {
            InputManager.instance = new InputManager();
        }
        return InputManager.instance;
    }

    subscribe(callback: (key: string) => void): () => void {
        this.listeners.add(callback);
        return () => this.listeners.delete(callback);
    }

    // Called by Virtual Keypad
    emit(key: string) {
        this.listeners.forEach(cb => cb(key));
    }

    private setupPhysicalKeyboard() {
        window.addEventListener('keydown', (e) => {
            // Map physical keys to our internal format
            if (e.key >= '0' && e.key <= '9') {
                this.emit(e.key);
            } else if (e.key === 'Enter') {
                this.emit('Enter');
            } else if (e.key === 'Backspace' || e.key === 'Delete') {
                this.emit('Backspace');
            } else if (e.key.toLowerCase() === 'c') {
                this.emit('Clear');
            }
        });
    }
}
