import { Actions } from '../../state/actions';
import { store } from '../../state/store';
import { GameState } from '../../state/types';

export class GameOverScreen {
    private element: HTMLElement;

    constructor() {
        this.element = document.createElement('section');
        this.element.className = 'screen game-over-screen';
    }

    render(state: GameState) {
        // Calculate accuracy
        const total = state.history.length;
        const correct = state.history.filter(h => h.isCorrect).length;
        const accuracy = total > 0 ? Math.round((correct / total) * 100) : 0;

        this.element.innerHTML = `
      <div class="content">
        <h1>Time's Up!</h1>
        
        <div class="results-card">
          <div class="result-row">
            <span class="label">Final Score</span>
            <span class="value large">${state.score}</span>
          </div>
           <div class="result-row">
            <span class="label">Questions</span>
            <span class="value">${total}</span>
          </div>
          <div class="result-row">
            <span class="label">Accuracy</span>
            <span class="value">${accuracy}%</span>
          </div>
        </div>

        <button id="restart-btn" class="btn-primary">Play Again</button>
      </div>
    `;

        this.element.querySelector('#restart-btn')?.addEventListener('click', () => {
            store.dispatch(Actions.restartGame());
        });

        return this.element;
    }
}
