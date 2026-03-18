import { User } from './user.entity';
import { Tenant } from './tenant.entity';
export declare enum CourseLevel {
    BEGINNER = "beginner",
    INTERMEDIATE = "intermediate",
    ADVANCED = "advanced"
}
export declare class Course {
    id: string;
    tenantId: string;
    tenant: Tenant;
    instructorId: string;
    instructor: User;
    title: string;
    slug: string;
    description: string;
    thumbnailUrl: string;
    category: string;
    level: CourseLevel;
    durationHours: number;
    isPublished: boolean;
    isFeatured: boolean;
    tags: string;
    enrollmentCount: number;
    averageRating: number;
    reviewCount: number;
    createdAt: Date;
    updatedAt: Date;
}
