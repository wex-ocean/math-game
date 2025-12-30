export type Operator = '+' | '-' | '*' | '/';

export interface Question {
    id: string;
    operandA: number;
    operandB: number;
    operator: Operator;
    correctAnswer: number;
    options?: number[]; // For potential multiple choice
}

export type DifficultyLevel = 'EASY' | 'MEDIUM' | 'HARD';

export type GameStatus = 'IDLE' | 'PLAYING' | 'PAUSED' | 'GAME_OVER';

export interface GameState {
    status: GameStatus;
    difficulty: DifficultyLevel;
    currentQuestion: Question | null;
    score: number;
    maxScore: number;
    timeLeft: number; // in seconds
    streak: number;
    history: GameHistoryItem[];
}

export interface GameHistoryItem {
    questionId: string;
    isCorrect: boolean;
    timeTaken: number;
}
