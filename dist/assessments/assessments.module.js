"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AssessmentsModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const assessment_entity_1 = require("../entities/assessment.entity");
const assessment_question_entity_1 = require("../entities/assessment-question.entity");
const assessment_attempt_entity_1 = require("../entities/assessment-attempt.entity");
const assessments_service_1 = require("./assessments.service");
const assessments_controller_1 = require("./assessments.controller");
const users_module_1 = require("../users/users.module");
const ai_module_1 = require("../ai/ai.module");
let AssessmentsModule = class AssessmentsModule {
};
exports.AssessmentsModule = AssessmentsModule;
exports.AssessmentsModule = AssessmentsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([assessment_entity_1.Assessment, assessment_question_entity_1.AssessmentQuestion, assessment_attempt_entity_1.AssessmentAttempt]),
            users_module_1.UsersModule,
            ai_module_1.AiModule,
        ],
        providers: [assessments_service_1.AssessmentsService],
        controllers: [assessments_controller_1.AssessmentsController],
        exports: [assessments_service_1.AssessmentsService],
    })
], AssessmentsModule);
//# sourceMappingURL=assessments.module.js.map