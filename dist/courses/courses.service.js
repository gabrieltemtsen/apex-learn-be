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
exports.CoursesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const course_entity_1 = require("../entities/course.entity");
let CoursesService = class CoursesService {
    courseRepo;
    constructor(courseRepo) {
        this.courseRepo = courseRepo;
    }
    async findAll(filters) {
        const where = {};
        if (filters.tenantId)
            where.tenantId = filters.tenantId;
        if (filters.category)
            where.category = filters.category;
        if (filters.level)
            where.level = filters.level;
        if (filters.search)
            where.title = (0, typeorm_2.Like)(`%${filters.search}%`);
        return this.courseRepo.find({
            where,
            relations: ['instructor', 'tenant'],
            order: { createdAt: 'DESC' },
        });
    }
    async findOne(id) {
        const course = await this.courseRepo.findOne({
            where: { id },
            relations: ['instructor', 'tenant'],
        });
        if (!course)
            throw new common_1.NotFoundException(`Course ${id} not found`);
        return course;
    }
    async findBySlug(slug) {
        const course = await this.courseRepo.findOne({
            where: { slug },
            relations: ['instructor', 'tenant'],
        });
        if (!course)
            throw new common_1.NotFoundException(`Course with slug ${slug} not found`);
        return course;
    }
    async create(dto, instructorId) {
        const slug = dto.slug || this.generateSlug(dto.title);
        const course = this.courseRepo.create({ ...dto, instructorId, slug });
        return this.courseRepo.save(course);
    }
    async update(id, dto) {
        await this.findOne(id);
        await this.courseRepo.update(id, dto);
        return this.findOne(id);
    }
    async remove(id) {
        await this.findOne(id);
        await this.courseRepo.delete(id);
    }
    async publish(id) {
        await this.findOne(id);
        await this.courseRepo.update(id, { isPublished: true });
        return this.findOne(id);
    }
    async incrementEnrollment(courseId) {
        await this.courseRepo.increment({ id: courseId }, 'enrollmentCount', 1);
    }
    generateSlug(title) {
        return title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') + '-' + Date.now();
    }
};
exports.CoursesService = CoursesService;
exports.CoursesService = CoursesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(course_entity_1.Course)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], CoursesService);
//# sourceMappingURL=courses.service.js.map