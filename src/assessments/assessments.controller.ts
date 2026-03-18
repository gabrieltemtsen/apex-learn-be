import { Controller, Get, Post, Patch, Body, Param, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { AssessmentsService } from './assessments.service';
import { CreateAssessmentDto } from './dto/create-assessment.dto';
import { SubmitAttemptDto } from './dto/submit-attempt.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '../entities/user.entity';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

class GenerateAIDto {
  @ApiProperty() @IsNotEmpty() @IsString() assessmentId: string;
  @ApiProperty() @IsNotEmpty() @IsString() courseTitle: string;
  @ApiProperty() @IsNotEmpty() @IsString() topic: string;
  @ApiProperty() @IsNumber() numQuestions: number;
  @ApiProperty() @IsNotEmpty() @IsString() difficulty: string;
}

@ApiTags('assessments')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('assessments')
export class AssessmentsController {
  constructor(private assessmentsService: AssessmentsService) {}

  @Get('course/:courseId')
  @ApiOperation({ summary: 'Get assessments for a course' })
  findByCourse(@Param('courseId') courseId: string) {
    return this.assessmentsService.findByCourse(courseId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get assessment by id (with questions)' })
  findOne(@Param('id') id: string) {
    return this.assessmentsService.findOne(id);
  }

  @Post()
  @UseGuards(RolesGuard)
  @Roles(UserRole.FACILITATOR, UserRole.ADMIN, UserRole.TENANT_ADMIN, UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Create assessment' })
  create(@Body() dto: CreateAssessmentDto) {
    return this.assessmentsService.create(dto);
  }

  @Patch(':id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.FACILITATOR, UserRole.ADMIN, UserRole.TENANT_ADMIN, UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Update assessment' })
  update(@Param('id') id: string, @Body() dto: Partial<CreateAssessmentDto>) {
    return this.assessmentsService.update(id, dto);
  }

  @Post('generate-ai')
  @UseGuards(RolesGuard)
  @Roles(UserRole.FACILITATOR, UserRole.ADMIN, UserRole.TENANT_ADMIN, UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Generate quiz questions with AI' })
  generateAI(@Body() dto: GenerateAIDto) {
    return this.assessmentsService.generateWithAI(dto.courseTitle, dto.topic, dto.numQuestions, dto.difficulty, dto.assessmentId);
  }

  @Post(':id/attempt')
  @ApiOperation({ summary: 'Submit assessment attempt' })
  submitAttempt(@Param('id') id: string, @Body() dto: SubmitAttemptDto, @Request() req: any) {
    return this.assessmentsService.submitAttempt(id, req.user.id, dto);
  }

  @Get(':id/results')
  @ApiOperation({ summary: 'Get assessment results for current user' })
  getResults(@Param('id') id: string, @Request() req: any) {
    return this.assessmentsService.getResults(id, req.user.id);
  }
}
