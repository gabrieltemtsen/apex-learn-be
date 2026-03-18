import { Course } from './course.entity';
export declare enum LessonType {
    VIDEO = "video",
    TEXT = "text",
    QUIZ = "quiz",
    LIVE = "live"
}
export declare class Lesson {
    id: string;
    courseId: string;
    course: Course;
    title: string;
    description: string;
    type: LessonType;
    videoUrl: string;
    content: string;
    durationSeconds: number;
    order: number;
    isPublished: boolean;
    isFree: boolean;
    createdAt: Date;
    updatedAt: Date;
}
