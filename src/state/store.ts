import { GameState, GameHistoryItem } from './types';
import { Action, AnswerAction, TickAction } from './actions';
import { MathGenerator } from '../core/MathGenerator';
import { Scoring } from '../core/Scoring';

const INITIAL_STATE: GameState = {
    status: 'IDLE',
    difficulty: 'MEDIUM',
    currentQuestion: null,
    score: 0,
    maxScore: 0,
    timeLeft: 0,
    streak: 0,
    history: []
};

type Listener = (state: GameState) => void;

export class GameStore {
    private state: GameState;
    private listeners: Set<Listener> = new Set();

    constructor() {
        this.state = { ...INITIAL_STATE };
        const saved = localStorage.getItem('math-game-highscore');
        if (saved) {
            this.state.maxScore = parseInt(saved, 10) || 0;
        }
    }

    getState(): GameState {
        return this.state;
    }

    subscribe(listener: Listener): () => void {
        this.listeners.add(listener);
        // Notify immediately on subscribe? standard is no, but helpful.
        // Let's not, strictly.
        return () => this.listeners.delete(listener);
    }

    dispatch(action: Action) {
        this.state = this.reducer(this.state, action);
        this.notify();
    }

    private notify() {
        this.listeners.forEach(l => l(this.state));
    }

    private reducer(state: GameState, action: Action): GameState {
        switch (action.type) {
            case 'START_GAME':
                return {
                    ...state,
                    status: 'PLAYING',
                    score: 0,
                    streak: 0,
                    history: [],
                    currentQuestion: MathGenerator.generate(state.difficulty),
                    timeLeft: 60 // 60 seconds
                };

            case 'END_GAME':
                if (state.score > state.maxScore) {
                    localStorage.setItem('math-game-highscore', state.score.toString());
                }
                return {
                    ...state,
                    status: 'GAME_OVER',
                    maxScore: Math.max(state.score, state.maxScore)
                };

            case 'RESTART_GAME':
                return {
                    ...state,
                    status: 'IDLE',
                    currentQuestion: null
                };

            case 'TICK':
                const { timeLeft } = (action as TickAction).payload;
                return { ...state, timeLeft };

            case 'ANSWER_SUBMITTED':
                const { answer } = (action as AnswerAction).payload;
                const isCorrect = state.currentQuestion?.correctAnswer === answer;

                let newScore = state.score;
                let newStreak = state.streak;

                if (isCorrect) {
                    newStreak++;
                    // Simple scoring: Base + Streak Bonus
                    const base = Scoring.getBasePoints(state.difficulty);
                    // We don't have per-question time here easily without more state tracking.
                    // Fallback to simple streak logic
                    newScore += Math.floor(base * (1 + (newStreak * 0.1)));
                } else {
                    newStreak = 0;
                }

                const historyItem: GameHistoryItem = {
                    questionId: state.currentQuestion!.id,
                    isCorrect,
                    timeTaken: 0 // Placeholder
                };

                return {
                    ...state,
                    score: newScore,
                    streak: newStreak,
                    history: [...state.history, historyItem],
                    // Important: If wrong, do we skip? Yes usually math games maximize throughput.
                    currentQuestion: MathGenerator.generate(state.difficulty)
                };

            default:
                return state;
        }
    }
}

export const store = new GameStore();
