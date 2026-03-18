import { Repository } from 'typeorm';
import { Certificate } from '../entities/certificate.entity';
export declare class CertificatesService {
    private certRepo;
    constructor(certRepo: Repository<Certificate>);
    findMyCertificates(userId: string): Promise<Certificate[]>;
    generate(userId: string, courseId: string, tenantId: string): Promise<Certificate>;
    verify(certificateNumber: string): Promise<Certificate>;
}
