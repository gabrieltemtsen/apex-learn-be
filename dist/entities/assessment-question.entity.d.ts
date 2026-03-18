import { Assessment } from './assessment.entity';
export declare class AssessmentQuestion {
    id: string;
    assessmentId: string;
    assessment: Assessment;
    question: string;
    options: string[];
    correctAnswer: string;
    explanation: string;
    difficulty: string;
    order: number;
    createdAt: Date;
}
