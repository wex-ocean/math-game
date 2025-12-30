import { DifficultyLevel } from '../state/types';

export class Scoring {
    static calculateScore(basePoints: number, timeLeft: number, totalTime: number, streak: number): number {
        // Basic score
        let points = basePoints;

        // Speed bonus: up to 50% extra if answered immediately
        if (totalTime > 0) {
            const speedFactor = timeLeft / totalTime;
            points += Math.floor(basePoints * 0.5 * speedFactor);
        }

        // Streak multiplier: 10% extra per streak, capped at 2x (streak 10)
        const multiplier = 1 + Math.min(streak * 0.1, 1.0);

        return Math.floor(points * multiplier);
    }

    static getBasePoints(difficulty: DifficultyLevel): number {
        switch (difficulty) {
            case 'MEDIUM': return 20;
            case 'HARD': return 50;
            case 'EASY': default: return 10;
        }
    }
}
