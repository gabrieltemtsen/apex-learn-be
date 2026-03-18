import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Assessment } from '../entities/assessment.entity';
import { AssessmentQuestion } from '../entities/assessment-question.entity';
import { AssessmentAttempt } from '../entities/assessment-attempt.entity';
import { AssessmentsService } from './assessments.service';
import { AssessmentsController } from './assessments.controller';
import { UsersModule } from '../users/users.module';
import { AiModule } from '../ai/ai.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Assessment, AssessmentQuestion, AssessmentAttempt]),
    UsersModule,
    AiModule,
  ],
  providers: [AssessmentsService],
  controllers: [AssessmentsController],
  exports: [AssessmentsService],
})
export class AssessmentsModule {}
