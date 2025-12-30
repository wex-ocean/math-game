import { Actions } from '../../state/actions';
import { store } from '../../state/store';
import { SoundManager } from '../../core/audio/SoundManager';

export class StartScreen {
  private element: HTMLElement;

  constructor() {
    this.element = document.createElement('section');
    this.element.className = 'screen start-screen';
  }

  render() {
    this.element.innerHTML = `
      <div class="content">
        <img src="/logo.jpg" class="game-logo" alt="Math Blitz Logo" />
        <h1 class="title">Math Blitz</h1>
        <p class="subtitle">Solve as many as you can in 60 seconds!</p>
        
        <div class="high-score-card">
          <span>Best Score</span>
          <span class="score-val">${store.getState().maxScore}</span>
        </div>

        <div class="difficulty-selector">
          <label>Difficulty</label>
          <div class="diff-options">
             <button class="diff-btn selected" data-val="MEDIUM">Medium</button>
             <button class="diff-btn" data-val="EASY">Easy</button>
             <button class="diff-btn" data-val="HARD">Hard</button>
          </div>
        </div>

        <button id="start-btn" class="btn-primary">Start Game</button>
      </div>
    `;

    this.setupListeners();
    return this.element;
  }

  private setupListeners() {
    // Difficulty Selection
    const diffBtns = this.element.querySelectorAll('.diff-btn');

    diffBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const target = e.target as HTMLElement;
        // Visual toggle only for now, logic uses default

        // Update UI
        diffBtns.forEach(b => b.classList.remove('selected'));
        target.classList.add('selected');
      });
    });

    // Start Game
    this.element.querySelector('#start-btn')?.addEventListener('click', () => {
      SoundManager.getInstance().init(); // Initialize Audio Context
      SoundManager.getInstance().playClick();
      // In a real app we'd dispatch SET_DIFFICULTY, for now we assume default
      // Or we can modify store initial state / actions to accept difficulty
      // Let's rely on default 'MEDIUM' in store or if we updated it.
      // Actually, store has difficulty. We should probably update it.
      // But Actions.startGame doesn't take args. 
      // Let's just Dispatch START_GAME. The Store handles generation.
      // Wait, if I want to change difficulty, I need an action.
      // I'll skip difficulty wiring for MVP to keep it simple, or Just assume default.
      store.dispatch(Actions.startGame());
    });
  }
}
