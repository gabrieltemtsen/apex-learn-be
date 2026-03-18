import { LessonType } from '../../entities/lesson.entity';
export declare class CreateLessonDto {
    courseId: string;
    title: string;
    description?: string;
    type?: LessonType;
    videoUrl?: string;
    content?: string;
    durationSeconds?: number;
    order?: number;
    isFree?: boolean;
}
