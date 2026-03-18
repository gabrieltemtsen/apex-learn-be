import { EnrollmentsService } from './enrollments.service';
declare class EnrollDto {
    courseId: string;
    tenantId: string;
}
export declare class EnrollmentsController {
    private enrollmentsService;
    constructor(enrollmentsService: EnrollmentsService);
    enroll(dto: EnrollDto, req: any): Promise<import("../entities/enrollment.entity").Enrollment>;
    getMyEnrollments(req: any): Promise<import("../entities/enrollment.entity").Enrollment[]>;
    getByCourse(courseId: string): Promise<import("../entities/enrollment.entity").Enrollment[]>;
    drop(id: string, req: any): Promise<void>;
}
export {};
