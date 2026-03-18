import { Controller, Post, Get, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { EnrollmentsService } from './enrollments.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

class EnrollDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  courseId: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  tenantId: string;
}

@ApiTags('enrollments')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('enrollments')
export class EnrollmentsController {
  constructor(private enrollmentsService: EnrollmentsService) {}

  @Post()
  @ApiOperation({ summary: 'Enroll in a course' })
  enroll(@Body() dto: EnrollDto, @Request() req: any) {
    return this.enrollmentsService.enroll(req.user.id, dto.courseId, dto.tenantId);
  }

  @Get('my')
  @ApiOperation({ summary: 'Get my enrollments' })
  getMyEnrollments(@Request() req: any) {
    return this.enrollmentsService.findMyEnrollments(req.user.id);
  }

  @Get('course/:courseId')
  @ApiOperation({ summary: 'Get enrollments for a course (admin)' })
  getByCourse(@Param('courseId') courseId: string) {
    return this.enrollmentsService.findByCourse(courseId);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Drop a course enrollment' })
  drop(@Param('id') id: string, @Request() req: any) {
    return this.enrollmentsService.drop(id, req.user.id);
  }
}
