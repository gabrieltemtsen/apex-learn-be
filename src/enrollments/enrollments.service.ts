import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Enrollment, EnrollmentStatus } from '../entities/enrollment.entity';
import { CoursesService } from '../courses/courses.service';

@Injectable()
export class EnrollmentsService {
  constructor(
    @InjectRepository(Enrollment)
    private enrollmentRepo: Repository<Enrollment>,
    private coursesService: CoursesService,
  ) {}

  async enroll(userId: string, courseId: string, tenantId: string): Promise<Enrollment> {
    const existing = await this.enrollmentRepo.findOne({ where: { userId, courseId } });
    if (existing) throw new ConflictException('Already enrolled in this course');
    const enrollment = this.enrollmentRepo.create({ userId, courseId, tenantId });
    const saved = await this.enrollmentRepo.save(enrollment);
    await this.coursesService.incrementEnrollment(courseId);
    return saved;
  }

  findMyEnrollments(userId: string): Promise<Enrollment[]> {
    return this.enrollmentRepo.find({
      where: { userId },
      relations: ['course', 'course.instructor'],
    });
  }

  findByCourse(courseId: string): Promise<Enrollment[]> {
    return this.enrollmentRepo.find({
      where: { courseId },
      relations: ['user'],
    });
  }

  async drop(id: string, userId: string): Promise<void> {
    const enrollment = await this.enrollmentRepo.findOne({ where: { id } });
    if (!enrollment) throw new NotFoundException(`Enrollment ${id} not found`);
    await this.enrollmentRepo.update(id, { status: EnrollmentStatus.DROPPED });
  }

  async updateProgress(userId: string, courseId: string, progressPercent: number): Promise<void> {
    const enrollment = await this.enrollmentRepo.findOne({ where: { userId, courseId } });
    if (!enrollment) return;
    const update: any = { progressPercent };
    if (progressPercent >= 100) {
      update.status = EnrollmentStatus.COMPLETED;
      update.completedAt = new Date();
    }
    await this.enrollmentRepo.update(enrollment.id, update);
  }
}
