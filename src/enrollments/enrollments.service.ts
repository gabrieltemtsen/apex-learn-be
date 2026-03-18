import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Enrollment, EnrollmentStatus } from '../entities/enrollment.entity';
import { CoursesService } from '../courses/courses.service';

@Injectable()
export class EnrollmentsService {
  constructor(
    @InjectRepository(Enrollment)
    private repo: Repository<Enrollment>,
    private coursesService: CoursesService,
  ) {}

  async enroll(userId: string, courseId: string, tenantId: string): Promise<Enrollment> {
    // Check if already enrolled — idempotent
    const existing = await this.repo.findOne({ where: { userId, courseId } });
    if (existing) return existing;

    // Increment course enrollment count
    await this.coursesService.incrementEnrollment(courseId);

    return this.repo.save(this.repo.create({ userId, courseId, tenantId, status: EnrollmentStatus.ACTIVE }));
  }

  async getUserEnrollments(userId: string): Promise<Enrollment[]> {
    return this.repo.find({
      where: { userId },
      relations: ['course', 'course.instructor'],
      order: { enrolledAt: 'DESC' },
    });
  }

  /** Alias kept for internal use by ProgressService */
  findMyEnrollments(userId: string): Promise<Enrollment[]> {
    return this.getUserEnrollments(userId);
  }

  findByCourse(courseId: string): Promise<Enrollment[]> {
    return this.repo.find({
      where: { courseId },
      relations: ['user'],
    });
  }

  async drop(userId: string, enrollmentId: string): Promise<{ message: string }> {
    const enrollment = await this.repo.findOne({ where: { id: enrollmentId, userId } });
    if (!enrollment) throw new NotFoundException('Enrollment not found');
    await this.repo.update(enrollmentId, { status: EnrollmentStatus.DROPPED });
    return { message: 'Dropped successfully' };
  }

  async updateProgress(userId: string, courseId: string, progressPercent: number): Promise<void> {
    const enrollment = await this.repo.findOne({ where: { userId, courseId } });
    if (!enrollment) return;
    const update: any = { progressPercent };
    if (progressPercent >= 100) {
      update.status = EnrollmentStatus.COMPLETED;
      update.completedAt = new Date();
    }
    await this.repo.update(enrollment.id, update);
  }
}
