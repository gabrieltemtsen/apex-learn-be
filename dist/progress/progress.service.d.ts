import { Repository } from 'typeorm';
import { Progress } from '../entities/progress.entity';
import { LessonsService } from '../lessons/lessons.service';
import { EnrollmentsService } from '../enrollments/enrollments.service';
export declare class ProgressService {
    private progressRepo;
    private lessonsService;
    private enrollmentsService;
    constructor(progressRepo: Repository<Progress>, lessonsService: LessonsService, enrollmentsService: EnrollmentsService);
    markComplete(userId: string, lessonId: string, courseId: string): Promise<Progress>;
    getCourseProgress(userId: string, courseId: string): Promise<{
        totalLessons: number;
        completedLessons: number;
        progressPercent: number;
        progressItems: Progress[];
    }>;
    private updateCourseProgress;
}
