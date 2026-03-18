import { Controller, Post, Get, Body, Param, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { ProgressService } from './progress.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

class MarkCompleteDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  lessonId: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  courseId: string;
}

@ApiTags('progress')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('progress')
export class ProgressController {
  constructor(private progressService: ProgressService) {}

  @Post()
  @ApiOperation({ summary: 'Mark a lesson as complete' })
  markComplete(@Body() dto: MarkCompleteDto, @Request() req: any) {
    return this.progressService.markComplete(req.user.sub, dto.lessonId, dto.courseId);
  }

  @Get('course/:courseId')
  @ApiOperation({ summary: 'Get progress for a course' })
  getCourseProgress(@Param('courseId') courseId: string, @Request() req: any) {
    return this.progressService.getCourseProgress(req.user.sub, courseId);
  }
}
