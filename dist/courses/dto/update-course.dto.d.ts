import { CourseLevel } from '../../entities/course.entity';
export declare class UpdateCourseDto {
    title?: string;
    description?: string;
    thumbnailUrl?: string;
    category?: string;
    level?: CourseLevel;
    durationHours?: number;
    tags?: string;
}
