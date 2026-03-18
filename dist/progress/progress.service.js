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
exports.ProgressService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const progress_entity_1 = require("../entities/progress.entity");
const lessons_service_1 = require("../lessons/lessons.service");
const enrollments_service_1 = require("../enrollments/enrollments.service");
let ProgressService = class ProgressService {
    progressRepo;
    lessonsService;
    enrollmentsService;
    constructor(progressRepo, lessonsService, enrollmentsService) {
        this.progressRepo = progressRepo;
        this.lessonsService = lessonsService;
        this.enrollmentsService = enrollmentsService;
    }
    async markComplete(userId, lessonId, courseId) {
        let progress = await this.progressRepo.findOne({ where: { userId, lessonId } });
        if (progress) {
            if (!progress.completed) {
                await this.progressRepo.update(progress.id, { completed: true, completedAt: new Date() });
                progress = (await this.progressRepo.findOne({ where: { userId, lessonId } }));
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
    async getCourseProgress(userId, courseId) {
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
    async updateCourseProgress(userId, courseId) {
        const { progressPercent } = await this.getCourseProgress(userId, courseId);
        await this.enrollmentsService.updateProgress(userId, courseId, progressPercent);
    }
};
exports.ProgressService = ProgressService;
exports.ProgressService = ProgressService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(progress_entity_1.Progress)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        lessons_service_1.LessonsService,
        enrollments_service_1.EnrollmentsService])
], ProgressService);
//# sourceMappingURL=progress.service.js.map