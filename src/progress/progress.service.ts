import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Progress } from '../entities/progress.entity';
import { Lesson } from '../entities/lesson.entity';
import { Enrollment, EnrollmentStatus } from '../entities/enrollment.entity';
import { User } from '../entities/user.entity';

@Injectable()
export class ProgressService {
  constructor(
    @InjectRepository(Progress)
    private repo: Repository<Progress>,
    @InjectRepository(Lesson)
    private lessonsRepo: Repository<Lesson>,
    @InjectRepository(Enrollment)
    private enrollmentsRepo: Repository<Enrollment>,
    @InjectRepository(User)
    private usersRepo: Repository<User>,
  ) {}

  async markComplete(userId: string, lessonId: string, courseId: string): Promise<Progress> {
    const existing = await this.repo.findOne({ where: { userId, lessonId } });
    if (existing?.completed) return existing;

    const progress = existing
      ? await this.repo.save({ ...existing, completed: true, completedAt: new Date() })
      : await this.repo.save(
          this.repo.create({ userId, lessonId, courseId, completed: true, completedAt: new Date() }),
        );

    // Update enrollment progress percentage
    const totalLessons = await this.lessonsRepo.count({ where: { courseId, isPublished: true } });
    const completedLessons = await this.repo.count({ where: { userId, courseId, completed: true } });
    const percent = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

    await this.enrollmentsRepo.update(
      { userId, courseId },
      {
        progressPercent: percent,
        ...(percent === 100
          ? { status: EnrollmentStatus.COMPLETED, completedAt: new Date() }
          : {}),
      },
    );

    // Award points to user
    await this.usersRepo.increment({ id: userId }, 'points', 10);

    return progress;
  }

  async getCourseProgress(userId: string, courseId: string) {
    const completed = await this.repo.find({ where: { userId, courseId, completed: true } });
    const total = await this.lessonsRepo.count({ where: { courseId, isPublished: true } });
    return {
      completedLessonIds: completed.map((p) => p.lessonId),
      completedCount: completed.length,
      totalCount: total,
      percent: total ? Math.round((completed.length / total) * 100) : 0,
    };
  }
}
