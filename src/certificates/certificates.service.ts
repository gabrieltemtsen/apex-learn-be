import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Certificate } from '../entities/certificate.entity';
import { Course } from '../entities/course.entity';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class CertificatesService {
  constructor(
    @InjectRepository(Certificate)
    private certRepo: Repository<Certificate>,
    @InjectRepository(Course)
    private courseRepo: Repository<Course>,
  ) {}

  findMyCertificates(userId: string): Promise<Certificate[]> {
    return this.certRepo.find({
      where: { userId },
      relations: ['course', 'tenant'],
      order: { issuedAt: 'DESC' },
    });
  }

  async generate(userId: string, courseId: string, tenantId?: string): Promise<Certificate> {
    const existing = await this.certRepo.findOne({ where: { userId, courseId } });
    if (existing) return existing;

    // Auto-resolve tenantId from the course
    const resolvedTenantId = tenantId || (await this.courseRepo.findOne({ where: { id: courseId } }))?.tenantId || 'default';

    const certNumber = `APEX-${Date.now()}-${uuidv4().slice(0, 8).toUpperCase()}`;
    const qrCodeData = `https://apexlearn.ng/certificates/verify/${certNumber}`;

    const cert = this.certRepo.create({
      userId,
      courseId,
      tenantId: resolvedTenantId,
      certificateNumber: certNumber,
      qrCodeData,
    });
    return this.certRepo.save(cert);
  }

  async verify(certificateNumber: string): Promise<Certificate> {
    const cert = await this.certRepo.findOne({
      where: { certificateNumber },
      relations: ['user', 'course', 'course.instructor', 'tenant'],
    });
    if (!cert) throw new NotFoundException('Certificate not found or invalid');
    return cert;
  }
}
