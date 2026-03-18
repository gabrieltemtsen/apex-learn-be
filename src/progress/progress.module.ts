import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Progress } from '../entities/progress.entity';
import { ProgressService } from './progress.service';
import { ProgressController } from './progress.controller';
import { LessonsModule } from '../lessons/lessons.module';
import { EnrollmentsModule } from '../enrollments/enrollments.module';

@Module({
  imports: [TypeOrmModule.forFeature([Progress]), LessonsModule, EnrollmentsModule],
  providers: [ProgressService],
  controllers: [ProgressController],
  exports: [ProgressService],
})
export class ProgressModule {}
