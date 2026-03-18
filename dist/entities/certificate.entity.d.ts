import { User } from './user.entity';
import { Course } from './course.entity';
import { Tenant } from './tenant.entity';
export declare class Certificate {
    id: string;
    userId: string;
    user: User;
    courseId: string;
    course: Course;
    tenantId: string;
    tenant: Tenant;
    certificateNumber: string;
    qrCodeData: string;
    pdfUrl: string;
    issuedAt: Date;
}
