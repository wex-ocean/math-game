import { DifficultyLevel, Question, Operator } from '../state/types';
import { getRandomInt, getRandomElement } from '../utils/random';

export class MathGenerator {
    static generate(difficulty: DifficultyLevel): Question {
        const operator = this.getOperator(difficulty);
        const { a, b } = this.getOperands(operator, difficulty);

        let answer: number;
        switch (operator) {
            case '+': answer = a + b; break;
            case '-': answer = a - b; break;
            case '*': answer = a * b; break;
            case '/': answer = a / b; break;
        }

        return {
            id: crypto.randomUUID(),
            operandA: a,
            operandB: b,
            operator,
            correctAnswer: answer
        };
    }

    private static getOperator(difficulty: DifficultyLevel): Operator {
        const ops: Operator[] = ['+', '-'];
        if (difficulty === 'MEDIUM') ops.push('*');
        if (difficulty === 'HARD') ops.push('*', '/');
        return getRandomElement(ops);
    }

    private static getOperands(op: Operator, diff: DifficultyLevel): { a: number, b: number } {
        let min = 1, max = 10;

        if (diff === 'MEDIUM') max = 20;
        if (diff === 'HARD') max = 50;

        let a = getRandomInt(min, max);
        let b = getRandomInt(min, max);

        // Ensure non-negative result for subtraction
        if (op === '-') {
            if (a < b) [a, b] = [b, a];
        }

        // Ensure integer division
        if (op === '/') {
            b = getRandomInt(2, Math.min(12, max / 2)); // Divisor usually smaller
            a = b * getRandomInt(1, Math.floor(max / b)); // a is multiple of b
        }

        // Easier multiplication for Easy/Medium
        if (op === '*' && diff === 'EASY') {
            max = 5;
            a = getRandomInt(min, max);
            b = getRandomInt(min, max);
        }

        return { a, b };
    }
}
