"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnalyticsModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const user_entity_1 = require("../entities/user.entity");
const course_entity_1 = require("../entities/course.entity");
const enrollment_entity_1 = require("../entities/enrollment.entity");
const assessment_attempt_entity_1 = require("../entities/assessment-attempt.entity");
const certificate_entity_1 = require("../entities/certificate.entity");
const analytics_service_1 = require("./analytics.service");
const analytics_controller_1 = require("./analytics.controller");
let AnalyticsModule = class AnalyticsModule {
};
exports.AnalyticsModule = AnalyticsModule;
exports.AnalyticsModule = AnalyticsModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([user_entity_1.User, course_entity_1.Course, enrollment_entity_1.Enrollment, assessment_attempt_entity_1.AssessmentAttempt, certificate_entity_1.Certificate])],
        providers: [analytics_service_1.AnalyticsService],
        controllers: [analytics_controller_1.AnalyticsController],
    })
], AnalyticsModule);
//# sourceMappingURL=analytics.module.js.map