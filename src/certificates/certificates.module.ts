import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Certificate } from '../entities/certificate.entity';
import { Course } from '../entities/course.entity';
import { CertificatesService } from './certificates.service';
import { CertificatesController } from './certificates.controller';
import { PdfService } from './pdf.service';

@Module({
  imports: [TypeOrmModule.forFeature([Certificate, Course])],
  providers: [CertificatesService, PdfService],
  controllers: [CertificatesController],
  exports: [CertificatesService],
})
export class CertificatesModule {}
