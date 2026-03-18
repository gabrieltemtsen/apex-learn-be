import { CertificatesService } from './certificates.service';
declare class GenerateCertDto {
    tenantId: string;
}
export declare class CertificatesController {
    private certificatesService;
    constructor(certificatesService: CertificatesService);
    getMyCertificates(req: any): Promise<import("../entities/certificate.entity").Certificate[]>;
    generate(courseId: string, dto: GenerateCertDto, req: any): Promise<import("../entities/certificate.entity").Certificate>;
    verify(certificateNumber: string): Promise<import("../entities/certificate.entity").Certificate>;
}
export {};
