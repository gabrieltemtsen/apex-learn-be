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
exports.ProgressController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const progress_service_1 = require("./progress.service");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const class_validator_1 = require("class-validator");
const swagger_2 = require("@nestjs/swagger");
class MarkCompleteDto {
    lessonId;
    courseId;
}
__decorate([
    (0, swagger_2.ApiProperty)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], MarkCompleteDto.prototype, "lessonId", void 0);
__decorate([
    (0, swagger_2.ApiProperty)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], MarkCompleteDto.prototype, "courseId", void 0);
let ProgressController = class ProgressController {
    progressService;
    constructor(progressService) {
        this.progressService = progressService;
    }
    markComplete(dto, req) {
        return this.progressService.markComplete(req.user.id, dto.lessonId, dto.courseId);
    }
    getCourseProgress(courseId, req) {
        return this.progressService.getCourseProgress(req.user.id, courseId);
    }
};
exports.ProgressController = ProgressController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Mark a lesson as complete' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [MarkCompleteDto, Object]),
    __metadata("design:returntype", void 0)
], ProgressController.prototype, "markComplete", null);
__decorate([
    (0, common_1.Get)('course/:courseId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get progress for a course' }),
    __param(0, (0, common_1.Param)('courseId')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], ProgressController.prototype, "getCourseProgress", null);
exports.ProgressController = ProgressController = __decorate([
    (0, swagger_1.ApiTags)('progress'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('progress'),
    __metadata("design:paramtypes", [progress_service_1.ProgressService])
], ProgressController);
//# sourceMappingURL=progress.controller.js.map