import { Controller, Get, Post, Param, UseGuards, Request, Body } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { CertificatesService } from './certificates.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

class GenerateCertDto {
  @ApiProperty() @IsNotEmpty() @IsString() tenantId: string;
}

@ApiTags('certificates')
@Controller('certificates')
export class CertificatesController {
  constructor(private certificatesService: CertificatesService) {}

  @Get('my')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get my certificates' })
  getMyCertificates(@Request() req: any) {
    return this.certificatesService.findMyCertificates(req.user.id);
  }

  @Post('generate/:courseId')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Generate certificate for completed course' })
  generate(@Param('courseId') courseId: string, @Body() dto: GenerateCertDto, @Request() req: any) {
    return this.certificatesService.generate(req.user.id, courseId, dto.tenantId);
  }

  @Get('verify/:certificateNumber')
  @ApiOperation({ summary: 'Verify a certificate (public)' })
  verify(@Param('certificateNumber') certificateNumber: string) {
    return this.certificatesService.verify(certificateNumber);
  }
}
