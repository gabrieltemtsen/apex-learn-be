import { AssessmentType } from '../../entities/assessment.entity';
export declare class CreateAssessmentDto {
    courseId: string;
    title: string;
    description?: string;
    lessonId?: string;
    type?: AssessmentType;
    timeLimitMinutes?: number;
    passScore?: number;
}
