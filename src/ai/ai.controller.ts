import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { AiService } from './ai.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { IsArray, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

class GenerateQuizDto {
  @ApiProperty() @IsNotEmpty() @IsString() courseTitle: string;
  @ApiProperty() @IsNotEmpty() @IsString() topic: string;
  @ApiProperty() @IsNumber() numQuestions: number;
  @ApiProperty() @IsNotEmpty() @IsString() difficulty: string;
}

class GenerateOutlineDto {
  @ApiProperty() @IsNotEmpty() @IsString() topic: string;
  @ApiProperty() @IsNotEmpty() @IsString() targetAudience: string;
  @ApiProperty() @IsNumber() durationHours: number;
}

class AdaptiveSuggestionsDto {
  @ApiProperty() @IsNotEmpty() @IsString() userId: string;
  @ApiProperty() @IsArray() completedTopics: string[];
  @ApiProperty() @IsArray() failedTopics: string[];
}

@ApiTags('ai')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('ai')
export class AiController {
  constructor(private aiService: AiService) {}

  @Post('generate-quiz')
  @ApiOperation({ summary: 'Generate quiz questions with AI' })
  generateQuiz(@Body() dto: GenerateQuizDto) {
    return this.aiService.generateQuiz(dto.courseTitle, dto.topic, dto.numQuestions, dto.difficulty);
  }

  @Post('generate-course-outline')
  @ApiOperation({ summary: 'Generate course outline with AI' })
  generateCourseOutline(@Body() dto: GenerateOutlineDto) {
    return this.aiService.generateCourseOutline(dto.topic, dto.targetAudience, dto.durationHours);
  }

  @Post('adaptive-suggestions')
  @ApiOperation({ summary: 'Get adaptive learning suggestions' })
  getAdaptiveSuggestions(@Body() dto: AdaptiveSuggestionsDto) {
    return this.aiService.getAdaptiveSuggestions(dto.userId, dto.completedTopics, dto.failedTopics);
  }
}
