import { User } from './user.entity';
import { Assessment } from './assessment.entity';
export declare class AssessmentAttempt {
    id: string;
    userId: string;
    user: User;
    assessmentId: string;
    assessment: Assessment;
    score: number;
    answers: Record<string, string>;
    timeTakenSeconds: number;
    passed: boolean;
    completedAt: Date;
}
