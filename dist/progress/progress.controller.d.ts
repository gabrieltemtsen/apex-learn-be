import { ProgressService } from './progress.service';
declare class MarkCompleteDto {
    lessonId: string;
    courseId: string;
}
export declare class ProgressController {
    private progressService;
    constructor(progressService: ProgressService);
    markComplete(dto: MarkCompleteDto, req: any): Promise<import("../entities/progress.entity").Progress>;
    getCourseProgress(courseId: string, req: any): Promise<{
        totalLessons: number;
        completedLessons: number;
        progressPercent: number;
        progressItems: import("../entities/progress.entity").Progress[];
    }>;
}
export {};
