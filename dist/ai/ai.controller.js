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
exports.AiController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const ai_service_1 = require("./ai.service");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const class_validator_1 = require("class-validator");
const swagger_2 = require("@nestjs/swagger");
class GenerateQuizDto {
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
], GenerateQuizDto.prototype, "courseTitle", void 0);
__decorate([
    (0, swagger_2.ApiProperty)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], GenerateQuizDto.prototype, "topic", void 0);
__decorate([
    (0, swagger_2.ApiProperty)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], GenerateQuizDto.prototype, "numQuestions", void 0);
__decorate([
    (0, swagger_2.ApiProperty)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], GenerateQuizDto.prototype, "difficulty", void 0);
class GenerateOutlineDto {
    topic;
    targetAudience;
    durationHours;
}
__decorate([
    (0, swagger_2.ApiProperty)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], GenerateOutlineDto.prototype, "topic", void 0);
__decorate([
    (0, swagger_2.ApiProperty)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], GenerateOutlineDto.prototype, "targetAudience", void 0);
__decorate([
    (0, swagger_2.ApiProperty)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], GenerateOutlineDto.prototype, "durationHours", void 0);
class AdaptiveSuggestionsDto {
    userId;
    completedTopics;
    failedTopics;
}
__decorate([
    (0, swagger_2.ApiProperty)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AdaptiveSuggestionsDto.prototype, "userId", void 0);
__decorate([
    (0, swagger_2.ApiProperty)(),
    (0, class_validator_1.IsArray)(),
    __metadata("design:type", Array)
], AdaptiveSuggestionsDto.prototype, "completedTopics", void 0);
__decorate([
    (0, swagger_2.ApiProperty)(),
    (0, class_validator_1.IsArray)(),
    __metadata("design:type", Array)
], AdaptiveSuggestionsDto.prototype, "failedTopics", void 0);
let AiController = class AiController {
    aiService;
    constructor(aiService) {
        this.aiService = aiService;
    }
    generateQuiz(dto) {
        return this.aiService.generateQuiz(dto.courseTitle, dto.topic, dto.numQuestions, dto.difficulty);
    }
    generateCourseOutline(dto) {
        return this.aiService.generateCourseOutline(dto.topic, dto.targetAudience, dto.durationHours);
    }
    getAdaptiveSuggestions(dto) {
        return this.aiService.getAdaptiveSuggestions(dto.userId, dto.completedTopics, dto.failedTopics);
    }
};
exports.AiController = AiController;
__decorate([
    (0, common_1.Post)('generate-quiz'),
    (0, swagger_1.ApiOperation)({ summary: 'Generate quiz questions with AI' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [GenerateQuizDto]),
    __metadata("design:returntype", void 0)
], AiController.prototype, "generateQuiz", null);
__decorate([
    (0, common_1.Post)('generate-course-outline'),
    (0, swagger_1.ApiOperation)({ summary: 'Generate course outline with AI' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [GenerateOutlineDto]),
    __metadata("design:returntype", void 0)
], AiController.prototype, "generateCourseOutline", null);
__decorate([
    (0, common_1.Post)('adaptive-suggestions'),
    (0, swagger_1.ApiOperation)({ summary: 'Get adaptive learning suggestions' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [AdaptiveSuggestionsDto]),
    __metadata("design:returntype", void 0)
], AiController.prototype, "getAdaptiveSuggestions", null);
exports.AiController = AiController = __decorate([
    (0, swagger_1.ApiTags)('ai'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('ai'),
    __metadata("design:paramtypes", [ai_service_1.AiService])
], AiController);
//# sourceMappingURL=ai.controller.js.map