import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { AssessmentType } from '../../entities/assessment.entity';

export class CreateAssessmentDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  courseId: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  lessonId?: string;

  @ApiPropertyOptional({ enum: AssessmentType })
  @IsOptional()
  @IsEnum(AssessmentType)
  type?: AssessmentType;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  timeLimitMinutes?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  passScore?: number;
}
