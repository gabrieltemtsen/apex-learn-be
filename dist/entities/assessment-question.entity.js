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
exports.AssessmentQuestion = void 0;
const typeorm_1 = require("typeorm");
const assessment_entity_1 = require("./assessment.entity");
let AssessmentQuestion = class AssessmentQuestion {
    id;
    assessmentId;
    assessment;
    question;
    options;
    correctAnswer;
    explanation;
    difficulty;
    order;
    createdAt;
};
exports.AssessmentQuestion = AssessmentQuestion;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], AssessmentQuestion.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], AssessmentQuestion.prototype, "assessmentId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => assessment_entity_1.Assessment),
    (0, typeorm_1.JoinColumn)({ name: 'assessmentId' }),
    __metadata("design:type", assessment_entity_1.Assessment)
], AssessmentQuestion.prototype, "assessment", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text' }),
    __metadata("design:type", String)
], AssessmentQuestion.prototype, "question", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb' }),
    __metadata("design:type", Array)
], AssessmentQuestion.prototype, "options", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], AssessmentQuestion.prototype, "correctAnswer", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], AssessmentQuestion.prototype, "explanation", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: ['easy', 'medium', 'hard'], default: 'medium' }),
    __metadata("design:type", String)
], AssessmentQuestion.prototype, "difficulty", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 0 }),
    __metadata("design:type", Number)
], AssessmentQuestion.prototype, "order", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], AssessmentQuestion.prototype, "createdAt", void 0);
exports.AssessmentQuestion = AssessmentQuestion = __decorate([
    (0, typeorm_1.Entity)('assessment_questions')
], AssessmentQuestion);
//# sourceMappingURL=assessment-question.entity.js.map