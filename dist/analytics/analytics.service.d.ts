import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { Course } from '../entities/course.entity';
import { Enrollment } from '../entities/enrollment.entity';
import { AssessmentAttempt } from '../entities/assessment-attempt.entity';
import { Certificate } from '../entities/certificate.entity';
export declare class AnalyticsService {
    private userRepo;
    private courseRepo;
    private enrollmentRepo;
    private attemptRepo;
    private certRepo;
    constructor(userRepo: Repository<User>, courseRepo: Repository<Course>, enrollmentRepo: Repository<Enrollment>, attemptRepo: Repository<AssessmentAttempt>, certRepo: Repository<Certificate>);
    getTenantOverview(tenantId: string): Promise<{
        totalUsers: number;
        totalCourses: number;
        totalEnrollments: number;
        completedEnrollments: number;
        completionRate: number;
        certificates: number;
    }>;
    getLearnerActivity(tenantId: string): Promise<{
        recentEnrollments: Enrollment[];
        recentAttempts: AssessmentAttempt[];
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
