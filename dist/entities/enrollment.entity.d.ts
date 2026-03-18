import { User } from './user.entity';
import { Course } from './course.entity';
import { Tenant } from './tenant.entity';
export declare enum EnrollmentStatus {
    ACTIVE = "active",
    COMPLETED = "completed",
    DROPPED = "dropped"
}
export declare class Enrollment {
    id: string;
    userId: string;
    user: User;
    courseId: string;
    course: Course;
    tenantId: string;
    tenant: Tenant;
    status: EnrollmentStatus;
    progressPercent: number;
    completedAt: Date;
    enrolledAt: Date;
    updatedAt: Date;
}
