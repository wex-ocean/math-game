export type ActionType =
    | 'START_GAME'
    | 'END_GAME'
    | 'RESTART_GAME'
    | 'ANSWER_SUBMITTED'
    | 'TICK'
    | 'SET_DIFFICULTY';

export interface Action {
    type: ActionType;
    payload?: any;
}

export interface StartGameAction extends Action {
    type: 'START_GAME';
}

export interface AnswerAction extends Action {
    type: 'ANSWER_SUBMITTED';
    payload: {
        answer: number;
        // timeTaken can be used for sophisticated scoring
    };
}

export interface TickAction extends Action {
    type: 'TICK';
    payload: {
        timeLeft: number;
    };
}

export const Actions = {
    startGame: (): StartGameAction => ({ type: 'START_GAME' }),
    endGame: (): Action => ({ type: 'END_GAME' }),
    restartGame: (): Action => ({ type: 'RESTART_GAME' }),
    submitAnswer: (answer: number): AnswerAction => ({
        type: 'ANSWER_SUBMITTED',
        payload: { answer }
    }),
    tick: (timeLeft: number): TickAction => ({ type: 'TICK', payload: { timeLeft } })
};
