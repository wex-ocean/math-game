```typescript
import { Actions } from '../../state/actions';
import { store } from '../../state/store';
import { GameState } from '../../state/types';
import { Keypad } from '../components/Keypad';
import { InputManager } from '../InputManager';
import { SoundManager } from '../../core/audio/SoundManager';

export class GameScreen {
  private element: HTMLElement;
  private scoreEl: HTMLElement;
  private timerEl: HTMLElement;
  private questionEl: HTMLElement;
  private answerInputEl: HTMLElement;
  private lastQuestionId: string | null = null;
  private currentInputDisplay: string = '';
  private unsubscribeInput: (() => void) | null = null;

  constructor() {
    this.element = document.createElement('section');
    this.element.className = 'screen game-screen';
    
    this.element.innerHTML = `
    < header class="game-hud" >
        <div class="hud-item score-box" >
            <span class="label" > Score </span>
                < span class="value" id = "score-val" > 0 </span>
                    </div>
                    < div class="hud-item timer-box" >
                        <span class="label" > Time </span>
                            < span class="value" id = "timer-val" > 60 </span>
                                </div>
                                </header>

                                < div class="question-area" >
                                    <div class="question-text fade-in" id = "question-text" > </div>
                                        < div class="answer-display" id = "answer-display" >? </div>
                                            </div>

                                            < div id = "keypad-container" > </div>
                                                `;

    this.scoreEl = this.element.querySelector('#score-val')!;
    this.timerEl = this.element.querySelector('#timer-val')!;
    this.questionEl = this.element.querySelector('#question-text')!;
    this.answerInputEl = this.element.querySelector('#answer-display')!;

    const keypad = new Keypad();
    this.element.querySelector('#keypad-container')?.appendChild(keypad.getElement());
    
    // Subscribe to Input
    // Note: We should only subscribe when this screen is active ideally. 
    // But since UIManager switches screens, we can add a 'mount/unmount' pattern?
    // For simplicity, we'll check if element is in DOM or we can assume UIManager handles "Active" state?
    // Let's just subscribe always but guard with status checks or let UIManager call mount.
    // simpler: subscribe in constructor, but ignore if not playing.
    this.unsubscribeInput = InputManager.getInstance().subscribe((key) => this.handleInput(key));
  }

  getElement() {
    return this.element;
  }

  update(state: GameState) {
    // Score feedback check
    const currentScore = parseInt(this.scoreEl.textContent || '0');
    if(state.score > currentScore) {
       SoundManager.getInstance().playCorrect();
       // Visual feedback could go here
    } else if (state.streak === 0 && currentScore > 0 && state.history.length > 0 && !state.history[state.history.length-1].isCorrect) {
       // Just reset logic, ideally we track 'wrong answer' event
       // But checking streak reset is a proxy
       SoundManager.getInstance().playWrong();
       this.element.classList.add('shake');
       setTimeout(() => this.element.classList.remove('shake'), 400);
    }

    this.scoreEl.textContent = state.score.toString();
    this.timerEl.textContent = state.timeLeft.toString();
    
    if (state.timeLeft <= 10) {
      this.timerEl.classList.add('urgent');
    } else {
      this.timerEl.classList.remove('urgent');
    }

    if (state.currentQuestion && state.currentQuestion.id !== this.lastQuestionId) {
      this.lastQuestionId = state.currentQuestion.id;
      const q = state.currentQuestion;
      
      // Formatting
      let opSymbol: string = q.operator;
      if (opSymbol === '*') opSymbol = '×';
      if (opSymbol === '/') opSymbol = '÷';

      this.questionEl.textContent = `${ q.operandA } ${ opSymbol } ${ q.operandB } `;
      // Reset input
      this.handleClear();
      
      // Re-trigger animation
      this.questionEl.classList.remove('fade-in');
      void this.questionEl.offsetWidth; // trigger reflow
      this.questionEl.classList.add('fade-in');
    }
  }

  private handleInput(key: string) {
    if (store.getState().status !== 'PLAYING') return;

    if (key === 'Enter') {
        if (!this.currentInputDisplay) return;
        const answer = parseInt(this.currentInputDisplay, 10);
        store.dispatch(Actions.submitAnswer(answer));
    } else if (key === 'Clear') {
        this.handleClear();
    } else if (key === 'Backspace') {
        if (this.currentInputDisplay.length > 0) {
            this.currentInputDisplay = this.currentInputDisplay.slice(0, -1);
            this.updateInputDisplay();
        }
    } else {
        // Digits
        if (this.currentInputDisplay.length < 6) {
           this.currentInputDisplay += key;
           this.updateInputDisplay();
        }
    }
  }

  private handleClear() {
    this.currentInputDisplay = '';
    this.updateInputDisplay();
  }

  private updateInputDisplay() {
    this.answerInputEl.textContent = this.currentInputDisplay || '?';
    if (this.currentInputDisplay) {
        this.answerInputEl.classList.add('has-value');
    } else {
        this.answerInputEl.classList.remove('has-value');
    }
  }
}
```
