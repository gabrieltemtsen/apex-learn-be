import { Repository } from 'typeorm';
import { Enrollment } from '../entities/enrollment.entity';
import { CoursesService } from '../courses/courses.service';
export declare class EnrollmentsService {
    private enrollmentRepo;
    private coursesService;
    constructor(enrollmentRepo: Repository<Enrollment>, coursesService: CoursesService);
    enroll(userId: string, courseId: string, tenantId: string): Promise<Enrollment>;
    findMyEnrollments(userId: string): Promise<Enrollment[]>;
    findByCourse(courseId: string): Promise<Enrollment[]>;
    drop(id: string, userId: string): Promise<void>;
    updateProgress(userId: string, courseId: string, progressPercent: number): Promise<void>;
}
