import { CourseLevel } from '../../entities/course.entity';
export declare class CreateCourseDto {
    title: string;
    description: string;
    tenantId: string;
    slug?: string;
    thumbnailUrl?: string;
    category?: string;
    level?: CourseLevel;
    durationHours?: number;
    tags?: string;
}
