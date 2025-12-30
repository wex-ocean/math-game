import { InputManager } from '../InputManager';
import { SoundManager } from '../../core/audio/SoundManager';

export class Keypad {
    private element: HTMLElement;

    constructor() {
        this.element = document.createElement('div');
        this.element.className = 'keypad';
        this.render();
    }

    getElement() {
        return this.element;
    }

    private render() {
        // Layout: 
        // 7 8 9
        // 4 5 6
        // 1 2 3
        // C 0 ⌫ 
        // Enter (Full Width)

        // We'll use CSS grid areas or just flex flow.
        // Let's stick to simple grid but update layout.

        const keys = [
            { label: '7', val: '7' }, { label: '8', val: '8' }, { label: '9', val: '9' },
            { label: '4', val: '4' }, { label: '5', val: '5' }, { label: '6', val: '6' },
            { label: '1', val: '1' }, { label: '2', val: '2' }, { label: '3', val: '3' },
            { label: 'C', val: 'Clear', cls: 'key-clear' },
            { label: '0', val: '0' },
            { label: '⌫', val: 'Backspace', cls: 'key-back' },
        ];

        const grid = document.createElement('div');
        grid.className = 'keypad-grid';

        keys.forEach(k => {
            const btn = document.createElement('button');
            btn.textContent = k.label;
            btn.className = `key ${k.cls || ''}`;
            btn.setAttribute('data-key', k.val); // For visual feedback from keyboard

            btn.addEventListener('click', (e) => {
                // Sound and Action
                SoundManager.getInstance().playClick();
                InputManager.getInstance().emit(k.val);
                (e.target as HTMLElement).blur();

                // Visual Ripple
                this.animatePress(btn);
            });
            grid.appendChild(btn);
        });

        // Enter Button distinct
        const enterBtn = document.createElement('button');
        enterBtn.textContent = 'Submit Answer';
        enterBtn.className = 'key key-enter-large';
        enterBtn.addEventListener('click', () => {
            SoundManager.getInstance().playClick();
            InputManager.getInstance().emit('Enter');
        });

        this.element.appendChild(grid);
        this.element.appendChild(enterBtn);

        // Listen to physical keyboard to animate virtual keys
        InputManager.getInstance().subscribe((key) => {
            let timer = null;
            if (key === 'Enter') {
                this.animatePress(enterBtn);
                return;
            }
            // Find button
            const btn = Array.from(grid.children).find(b => b.getAttribute('data-key') === key) as HTMLElement;
            if (btn) this.animatePress(btn);
        });
    }

    private animatePress(el: HTMLElement) {
        el.classList.add('active-press');
        setTimeout(() => el.classList.remove('active-press'), 150);
    }
}
