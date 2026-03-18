import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { Course } from '../entities/course.entity';
import { Enrollment, EnrollmentStatus } from '../entities/enrollment.entity';
import { Assessment } from '../entities/assessment.entity';
import { AssessmentAttempt } from '../entities/assessment-attempt.entity';
import { Certificate } from '../entities/certificate.entity';

@Injectable()
export class AnalyticsService {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(Course) private courseRepo: Repository<Course>,
    @InjectRepository(Enrollment) private enrollmentRepo: Repository<Enrollment>,
    @InjectRepository(AssessmentAttempt) private attemptRepo: Repository<AssessmentAttempt>,
    @InjectRepository(Certificate) private certRepo: Repository<Certificate>,
  ) {}

  async getTenantOverview(tenantId: string) {
    const [totalUsers, totalCourses, totalEnrollments, completedEnrollments, certificates] = await Promise.all([
      this.userRepo.count({ where: { tenantId } }),
      this.courseRepo.count({ where: { tenantId } }),
      this.enrollmentRepo.count({ where: { tenantId } }),
      this.enrollmentRepo.count({ where: { tenantId, status: EnrollmentStatus.COMPLETED } }),
      this.certRepo.count({ where: { tenantId } }),
    ]);

    const completionRate = totalEnrollments > 0
      ? Math.round((completedEnrollments / totalEnrollments) * 100)
      : 0;

    return {
      totalUsers,
      totalCourses,
      totalEnrollments,
      completedEnrollments,
      completionRate,
      certificates,
    };
  }

  async getLearnerActivity(tenantId: string) {
    const enrollments = await this.enrollmentRepo.find({
      where: { tenantId },
      relations: ['user', 'course'],
      order: { enrolledAt: 'DESC' },
      take: 50,
    });

    const attempts = await this.attemptRepo
      .createQueryBuilder('attempt')
      .leftJoinAndSelect('attempt.user', 'user')
      .leftJoinAndSelect('attempt.assessment', 'assessment')
      .leftJoinAndSelect('assessment.course', 'course')
      .where('user.tenantId = :tenantId', { tenantId })
      .orderBy('attempt.completedAt', 'DESC')
      .take(50)
      .getMany();

    return { recentEnrollments: enrollments, recentAttempts: attempts };
  }

  async getCourseStats(courseId: string) {
    const [totalEnrollments, completedEnrollments, enrollments] = await Promise.all([
      this.enrollmentRepo.count({ where: { courseId } }),
      this.enrollmentRepo.count({ where: { courseId, status: EnrollmentStatus.COMPLETED } }),
      this.enrollmentRepo.find({ where: { courseId }, select: ['progressPercent'] }),
    ]);

    const avgProgress = enrollments.length > 0
      ? Math.round(enrollments.reduce((sum, e) => sum + e.progressPercent, 0) / enrollments.length)
      : 0;

    const attempts = await this.attemptRepo
      .createQueryBuilder('attempt')
      .leftJoinAndSelect('attempt.assessment', 'assessment')
      .where('assessment.courseId = :courseId', { courseId })
      .getMany();

    const passRate = attempts.length > 0
      ? Math.round((attempts.filter((a) => a.passed).length / attempts.length) * 100)
      : 0;

    return {
      totalEnrollments,
      completedEnrollments,
      completionRate: totalEnrollments > 0 ? Math.round((completedEnrollments / totalEnrollments) * 100) : 0,
      averageProgress: avgProgress,
      assessmentAttempts: attempts.length,
      assessmentPassRate: passRate,
    };
  }
}
