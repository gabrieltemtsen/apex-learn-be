import { User } from './user.entity';
import { Lesson } from './lesson.entity';
import { Course } from './course.entity';
export declare class Progress {
    id: string;
    userId: string;
    user: User;
    lessonId: string;
    lesson: Lesson;
    courseId: string;
    course: Course;
    completed: boolean;
    watchTimeSeconds: number;
    completedAt: Date;
    createdAt: Date;
}
