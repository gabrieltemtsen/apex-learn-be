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
exports.Assessment = exports.AssessmentType = void 0;
const typeorm_1 = require("typeorm");
const course_entity_1 = require("./course.entity");
var AssessmentType;
(function (AssessmentType) {
    AssessmentType["QUIZ"] = "quiz";
    AssessmentType["FINAL_EXAM"] = "final_exam";
    AssessmentType["DIAGNOSTIC"] = "diagnostic";
})(AssessmentType || (exports.AssessmentType = AssessmentType = {}));
let Assessment = class Assessment {
    id;
    courseId;
    course;
    lessonId;
    title;
    description;
    type;
    isAiGenerated;
    timeLimitMinutes;
    passScore;
    isActive;
    createdAt;
    updatedAt;
};
exports.Assessment = Assessment;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Assessment.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Assessment.prototype, "courseId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => course_entity_1.Course),
    (0, typeorm_1.JoinColumn)({ name: 'courseId' }),
    __metadata("design:type", course_entity_1.Course)
], Assessment.prototype, "course", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Assessment.prototype, "lessonId", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Assessment.prototype, "title", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Assessment.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: AssessmentType, default: AssessmentType.QUIZ }),
    __metadata("design:type", String)
], Assessment.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], Assessment.prototype, "isAiGenerated", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Number)
], Assessment.prototype, "timeLimitMinutes", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 70 }),
    __metadata("design:type", Number)
], Assessment.prototype, "passScore", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: true }),
    __metadata("design:type", Boolean)
], Assessment.prototype, "isActive", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Assessment.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Assessment.prototype, "updatedAt", void 0);
exports.Assessment = Assessment = __decorate([
    (0, typeorm_1.Entity)('assessments')
], Assessment);
//# sourceMappingURL=assessment.entity.js.map