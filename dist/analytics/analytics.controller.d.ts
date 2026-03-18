import { AnalyticsService } from './analytics.service';
export declare class AnalyticsController {
    private analyticsService;
    constructor(analyticsService: AnalyticsService);
    getTenantOverview(tenantId: string): Promise<{
        totalUsers: number;
        totalCourses: number;
        totalEnrollments: number;
        completedEnrollments: number;
        completionRate: number;
        certificates: number;
    }>;
    getLearnerActivity(tenantId: string): Promise<{
        recentEnrollments: import("../entities/enrollment.entity").Enrollment[];
        recentAttempts: import("../entities/assessment-attempt.entity").AssessmentAttempt[];
    }>;
    getCourseStats(courseId: string): Promise<{
        totalEnrollments: number;
        completedEnrollments: number;
        completionRate: number;
        averageProgress: number;
        assessmentAttempts: number;
        assessmentPassRate: number;
    }>;
}
