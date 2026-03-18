import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Progress } from '../entities/progress.entity';
import { LessonsService } from '../lessons/lessons.service';
import { EnrollmentsService } from '../enrollments/enrollments.service';

@Injectable()
export class ProgressService {
  constructor(
    @InjectRepository(Progress)
    private progressRepo: Repository<Progress>,
    private lessonsService: LessonsService,
    private enrollmentsService: EnrollmentsService,
  ) {}

  async markComplete(userId: string, lessonId: string, courseId: string): Promise<Progress> {
    let progress = await this.progressRepo.findOne({ where: { userId, lessonId } });
    if (progress) {
      if (!progress.completed) {
        await this.progressRepo.update(progress.id, { completed: true, completedAt: new Date() });
        progress = (await this.progressRepo.findOne({ where: { userId, lessonId } })) as Progress;
        await this.updateCourseProgress(userId, courseId);
      }
      return progress;
    }

    const newProgress = this.progressRepo.create({
      userId,
      lessonId,
      courseId,
      completed: true,
      completedAt: new Date(),
    });
    const saved = await this.progressRepo.save(newProgress);
    await this.updateCourseProgress(userId, courseId);
    return saved;
  }

  async getCourseProgress(userId: string, courseId: string) {
    const totalLessons = await this.lessonsService.countByCourse(courseId);
    const completedLessons = await this.progressRepo.count({
      where: { userId, courseId, completed: true },
    });
    const progressItems = await this.progressRepo.find({
      where: { userId, courseId },
      relations: ['lesson'],
    });
    const percent = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

    return {
      totalLessons,
      completedLessons,
      progressPercent: percent,
      progressItems,
    };
  }

  private async updateCourseProgress(userId: string, courseId: string): Promise<void> {
    const { progressPercent } = await this.getCourseProgress(userId, courseId);
    await this.enrollmentsService.updateProgress(userId, courseId, progressPercent);
  }
}
