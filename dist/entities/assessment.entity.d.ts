import { Course } from './course.entity';
export declare enum AssessmentType {
    QUIZ = "quiz",
    FINAL_EXAM = "final_exam",
    DIAGNOSTIC = "diagnostic"
}
export declare class Assessment {
    id: string;
    courseId: string;
    course: Course;
    lessonId: string;
    title: string;
    description: string;
    type: AssessmentType;
    isAiGenerated: boolean;
    timeLimitMinutes: number;
    passScore: number;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}
