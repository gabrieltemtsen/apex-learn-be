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
exports.AssessmentAttempt = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("./user.entity");
const assessment_entity_1 = require("./assessment.entity");
let AssessmentAttempt = class AssessmentAttempt {
    id;
    userId;
    user;
    assessmentId;
    assessment;
    score;
    answers;
    timeTakenSeconds;
    passed;
    completedAt;
};
exports.AssessmentAttempt = AssessmentAttempt;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], AssessmentAttempt.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], AssessmentAttempt.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User),
    (0, typeorm_1.JoinColumn)({ name: 'userId' }),
    __metadata("design:type", user_entity_1.User)
], AssessmentAttempt.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], AssessmentAttempt.prototype, "assessmentId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => assessment_entity_1.Assessment),
    (0, typeorm_1.JoinColumn)({ name: 'assessmentId' }),
    __metadata("design:type", assessment_entity_1.Assessment)
], AssessmentAttempt.prototype, "assessment", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'float' }),
    __metadata("design:type", Number)
], AssessmentAttempt.prototype, "score", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb' }),
    __metadata("design:type", Object)
], AssessmentAttempt.prototype, "answers", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 0 }),
    __metadata("design:type", Number)
], AssessmentAttempt.prototype, "timeTakenSeconds", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], AssessmentAttempt.prototype, "passed", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], AssessmentAttempt.prototype, "completedAt", void 0);
exports.AssessmentAttempt = AssessmentAttempt = __decorate([
    (0, typeorm_1.Entity)('assessment_attempts')
], AssessmentAttempt);
//# sourceMappingURL=assessment-attempt.entity.js.map