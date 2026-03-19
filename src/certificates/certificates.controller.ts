import { Controller, Get, Post, Param, Res, UseGuards, Request, Body, NotFoundException } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import type { Response } from 'express';
import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { SkipThrottle } from '@nestjs/throttler';
import { CertificatesService } from './certificates.service';
import { PdfService } from './pdf.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

class GenerateCertDto {
  @ApiProperty() @IsNotEmpty() @IsString() tenantId: string;
}

@ApiTags('certificates')
@Controller('certificates')
export class CertificatesController {
  constructor(
    private certificatesService: CertificatesService,
    private pdfService: PdfService,
  ) {}

  @Get('my')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get my certificates' })
  getMyCertificates(@Request() req: any) {
    return this.certificatesService.findMyCertificates(req.user.sub);
  }

  @Post('generate/:courseId')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Generate certificate for completed course' })
  generate(@Param('courseId') courseId: string, @Body() dto: GenerateCertDto, @Request() req: any) {
    return this.certificatesService.generate(req.user.sub, courseId, dto.tenantId);
  }

  @Get('verify/:certificateNumber')
  @SkipThrottle()
  @ApiOperation({ summary: 'Verify a certificate (public)' })
  verify(@Param('certificateNumber') certificateNumber: string) {
    return this.certificatesService.verify(certificateNumber);
  }

  @Get('download/:certificateNumber')
  @SkipThrottle()
  @ApiOperation({ summary: 'Download certificate as PDF (public via cert number)' })
  async download(
    @Param('certificateNumber') certificateNumber: string,
    @Res() res: Response,
  ) {
    const cert = await this.certificatesService.verify(certificateNumber);
    if (!cert) throw new NotFoundException('Certificate not found');

    const recipientName = cert.user
      ? `${cert.user.firstName} ${cert.user.lastName}`
      : 'Valued Learner';
    const courseTitle = cert.course?.title ?? 'Course Completion';
    const tenantName = cert.tenant?.name ?? 'ApexLearn™';
    const instructorName = cert.course?.instructor
      ? `${(cert.course.instructor as any).firstName} ${(cert.course.instructor as any).lastName}`
      : 'Expert Instructor';

    const pdfBuffer = await this.pdfService.generateCertificatePdf({
      recipientName,
      courseTitle,
      instructorName,
      tenantName,
      certificateNumber: cert.certificateNumber,
      issuedAt: cert.issuedAt,
      qrCodeData: cert.qrCodeData,
    });

    const filename = `ApexLearn-Certificate-${cert.certificateNumber}.pdf`;
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.setHeader('Content-Length', pdfBuffer.length);
    res.end(pdfBuffer);
  }
}
