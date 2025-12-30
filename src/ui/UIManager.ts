import { store } from '../state/store';
import { GameStatus, GameState } from '../state/types';
import { StartScreen } from './screens/StartScreen';
import { GameScreen } from './screens/GameScreen';
import { GameOverScreen } from './screens/GameOverScreen';
import { Actions } from '../state/actions';
import { GameTimer } from '../core/GameTimer';

export class UIManager {
    private app: HTMLElement;
    private startScreen: StartScreen;
    private gameScreen: GameScreen;
    private gameOverScreen: GameOverScreen;
    private timer: GameTimer;
    private currentStatus: GameStatus | null = null;

    constructor(appElement: HTMLElement) {
        this.app = appElement;
        this.startScreen = new StartScreen();
        this.gameScreen = new GameScreen();
        this.gameOverScreen = new GameOverScreen();

        this.timer = new GameTimer(
            60,
            (t) => store.dispatch(Actions.tick(t)),
            () => store.dispatch(Actions.endGame())
        );

        store.subscribe((state) => {
            this.handleStateChange(state);
        });

        // Initial Render
        this.handleStateChange(store.getState());
    }

    private handleStateChange(state: GameState) {
        // 1. Manage Timer Lifecycle
        if (state.status === 'PLAYING') {
            this.timer.start();
        } else if (state.status === 'IDLE') {
            // Reset handling is done by store re-setting time, but timer object needs sync
            // If state says 60, timer should be 60.
            if (this.timer.getTime() !== state.timeLeft && state.timeLeft === 60) {
                this.timer.reset(60);
            }
        } else {
            this.timer.stop();
        }

        // 2. Render UI if status changed
        if (state.status !== this.currentStatus) {
            this.currentStatus = state.status;
            this.renderScreen(state);
        }

        // 3. Update active components
        if (state.status === 'PLAYING') {
            this.gameScreen.update(state);
        }
    }

    private renderScreen(state: GameState) {
        this.app.innerHTML = '';

        switch (state.status) {
            case 'IDLE':
                this.app.appendChild(this.startScreen.render());
                break;
            case 'PLAYING':
                this.app.appendChild(this.gameScreen.getElement());
                // Init update
                this.gameScreen.update(state);
                break;
            case 'GAME_OVER':
                this.app.appendChild(this.gameOverScreen.render(state));
                break;
        }
    }
}
