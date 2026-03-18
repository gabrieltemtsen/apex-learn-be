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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Enrollment = exports.EnrollmentStatus = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("./user.entity");
const course_entity_1 = require("./course.entity");
const tenant_entity_1 = require("./tenant.entity");
var EnrollmentStatus;
(function (EnrollmentStatus) {
    EnrollmentStatus["ACTIVE"] = "active";
    EnrollmentStatus["COMPLETED"] = "completed";
    EnrollmentStatus["DROPPED"] = "dropped";
})(EnrollmentStatus || (exports.EnrollmentStatus = EnrollmentStatus = {}));
let Enrollment = class Enrollment {
    id;
    userId;
    user;
    courseId;
    course;
    tenantId;
    tenant;
    status;
    progressPercent;
    completedAt;
    enrolledAt;
    updatedAt;
};
exports.Enrollment = Enrollment;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Enrollment.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Enrollment.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User),
    (0, typeorm_1.JoinColumn)({ name: 'userId' }),
    __metadata("design:type", user_entity_1.User)
], Enrollment.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Enrollment.prototype, "courseId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => course_entity_1.Course),
    (0, typeorm_1.JoinColumn)({ name: 'courseId' }),
    __metadata("design:type", course_entity_1.Course)
], Enrollment.prototype, "course", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Enrollment.prototype, "tenantId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => tenant_entity_1.Tenant),
    (0, typeorm_1.JoinColumn)({ name: 'tenantId' }),
    __metadata("design:type", tenant_entity_1.Tenant)
], Enrollment.prototype, "tenant", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: EnrollmentStatus, default: EnrollmentStatus.ACTIVE }),
    __metadata("design:type", String)
], Enrollment.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'float', default: 0 }),
    __metadata("design:type", Number)
], Enrollment.prototype, "progressPercent", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Date)
], Enrollment.prototype, "completedAt", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Enrollment.prototype, "enrolledAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Enrollment.prototype, "updatedAt", void 0);
exports.Enrollment = Enrollment = __decorate([
    (0, typeorm_1.Entity)('enrollments')
], Enrollment);
//# sourceMappingURL=enrollment.entity.js.map