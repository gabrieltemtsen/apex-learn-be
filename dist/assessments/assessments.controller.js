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
exports.AssessmentsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const assessments_service_1 = require("./assessments.service");
const create_assessment_dto_1 = require("./dto/create-assessment.dto");
const submit_attempt_dto_1 = require("./dto/submit-attempt.dto");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const roles_guard_1 = require("../auth/roles.guard");
const roles_decorator_1 = require("../auth/roles.decorator");
const user_entity_1 = require("../entities/user.entity");
const class_validator_1 = require("class-validator");
const swagger_2 = require("@nestjs/swagger");
class GenerateAIDto {
    assessmentId;
    courseTitle;
    topic;
    numQuestions;
    difficulty;
}
__decorate([
    (0, swagger_2.ApiProperty)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], GenerateAIDto.prototype, "assessmentId", void 0);
__decorate([
    (0, swagger_2.ApiProperty)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], GenerateAIDto.prototype, "courseTitle", void 0);
__decorate([
    (0, swagger_2.ApiProperty)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], GenerateAIDto.prototype, "topic", void 0);
__decorate([
    (0, swagger_2.ApiProperty)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], GenerateAIDto.prototype, "numQuestions", void 0);
__decorate([
    (0, swagger_2.ApiProperty)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], GenerateAIDto.prototype, "difficulty", void 0);
let AssessmentsController = class AssessmentsController {
    assessmentsService;
    constructor(assessmentsService) {
        this.assessmentsService = assessmentsService;
    }
    findByCourse(courseId) {
        return this.assessmentsService.findByCourse(courseId);
    }
    findOne(id) {
        return this.assessmentsService.findOne(id);
    }
    create(dto) {
        return this.assessmentsService.create(dto);
    }
    update(id, dto) {
        return this.assessmentsService.update(id, dto);
    }
    generateAI(dto) {
        return this.assessmentsService.generateWithAI(dto.courseTitle, dto.topic, dto.numQuestions, dto.difficulty, dto.assessmentId);
    }
    submitAttempt(id, dto, req) {
        return this.assessmentsService.submitAttempt(id, req.user.id, dto);
    }
    getResults(id, req) {
        return this.assessmentsService.getResults(id, req.user.id);
    }
};
exports.AssessmentsController = AssessmentsController;
__decorate([
    (0, common_1.Get)('course/:courseId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get assessments for a course' }),
    __param(0, (0, common_1.Param)('courseId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AssessmentsController.prototype, "findByCourse", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get assessment by id (with questions)' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AssessmentsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(user_entity_1.UserRole.FACILITATOR, user_entity_1.UserRole.ADMIN, user_entity_1.UserRole.TENANT_ADMIN, user_entity_1.UserRole.SUPER_ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Create assessment' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_assessment_dto_1.CreateAssessmentDto]),
    __metadata("design:returntype", void 0)
], AssessmentsController.prototype, "create", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(user_entity_1.UserRole.FACILITATOR, user_entity_1.UserRole.ADMIN, user_entity_1.UserRole.TENANT_ADMIN, user_entity_1.UserRole.SUPER_ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Update assessment' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], AssessmentsController.prototype, "update", null);
__decorate([
    (0, common_1.Post)('generate-ai'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(user_entity_1.UserRole.FACILITATOR, user_entity_1.UserRole.ADMIN, user_entity_1.UserRole.TENANT_ADMIN, user_entity_1.UserRole.SUPER_ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Generate quiz questions with AI' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [GenerateAIDto]),
    __metadata("design:returntype", void 0)
], AssessmentsController.prototype, "generateAI", null);
__decorate([
    (0, common_1.Post)(':id/attempt'),
    (0, swagger_1.ApiOperation)({ summary: 'Submit assessment attempt' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, submit_attempt_dto_1.SubmitAttemptDto, Object]),
    __metadata("design:returntype", void 0)
], AssessmentsController.prototype, "submitAttempt", null);
__decorate([
    (0, common_1.Get)(':id/results'),
    (0, swagger_1.ApiOperation)({ summary: 'Get assessment results for current user' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], AssessmentsController.prototype, "getResults", null);
exports.AssessmentsController = AssessmentsController = __decorate([
    (0, swagger_1.ApiTags)('assessments'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('assessments'),
    __metadata("design:paramtypes", [assessments_service_1.AssessmentsService])
], AssessmentsController);
//# sourceMappingURL=assessments.controller.js.map