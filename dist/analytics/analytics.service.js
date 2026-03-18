"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnalyticsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const user_entity_1 = require("../entities/user.entity");
const course_entity_1 = require("../entities/course.entity");
const enrollment_entity_1 = require("../entities/enrollment.entity");
const assessment_attempt_entity_1 = require("../entities/assessment-attempt.entity");
const certificate_entity_1 = require("../entities/certificate.entity");
let AnalyticsService = class AnalyticsService {
    userRepo;
    courseRepo;
    enrollmentRepo;
    attemptRepo;
    certRepo;
    constructor(userRepo, courseRepo, enrollmentRepo, attemptRepo, certRepo) {
        this.userRepo = userRepo;
        this.courseRepo = courseRepo;
        this.enrollmentRepo = enrollmentRepo;
        this.attemptRepo = attemptRepo;
        this.certRepo = certRepo;
    }
    async getTenantOverview(tenantId) {
        const [totalUsers, totalCourses, totalEnrollments, completedEnrollments, certificates] = await Promise.all([
            this.userRepo.count({ where: { tenantId } }),
            this.courseRepo.count({ where: { tenantId } }),
            this.enrollmentRepo.count({ where: { tenantId } }),
            this.enrollmentRepo.count({ where: { tenantId, status: enrollment_entity_1.EnrollmentStatus.COMPLETED } }),
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
    async getLearnerActivity(tenantId) {
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
    async getCourseStats(courseId) {
        const [totalEnrollments, completedEnrollments, enrollments] = await Promise.all([
            this.enrollmentRepo.count({ where: { courseId } }),
            this.enrollmentRepo.count({ where: { courseId, status: enrollment_entity_1.EnrollmentStatus.COMPLETED } }),
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
};
exports.AnalyticsService = AnalyticsService;
exports.AnalyticsService = AnalyticsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(1, (0, typeorm_1.InjectRepository)(course_entity_1.Course)),
    __param(2, (0, typeorm_1.InjectRepository)(enrollment_entity_1.Enrollment)),
    __param(3, (0, typeorm_1.InjectRepository)(assessment_attempt_entity_1.AssessmentAttempt)),
    __param(4, (0, typeorm_1.InjectRepository)(certificate_entity_1.Certificate)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], AnalyticsService);
//# sourceMappingURL=analytics.service.js.map