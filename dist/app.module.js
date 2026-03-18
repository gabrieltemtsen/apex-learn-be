"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const typeorm_1 = require("@nestjs/typeorm");
const throttler_1 = require("@nestjs/throttler");
const auth_module_1 = require("./auth/auth.module");
const users_module_1 = require("./users/users.module");
const tenants_module_1 = require("./tenants/tenants.module");
const courses_module_1 = require("./courses/courses.module");
const lessons_module_1 = require("./lessons/lessons.module");
const enrollments_module_1 = require("./enrollments/enrollments.module");
const progress_module_1 = require("./progress/progress.module");
const assessments_module_1 = require("./assessments/assessments.module");
const certificates_module_1 = require("./certificates/certificates.module");
const subscriptions_module_1 = require("./subscriptions/subscriptions.module");
const leaderboard_module_1 = require("./leaderboard/leaderboard.module");
const ai_module_1 = require("./ai/ai.module");
const analytics_module_1 = require("./analytics/analytics.module");
const tenant_entity_1 = require("./entities/tenant.entity");
const user_entity_1 = require("./entities/user.entity");
const course_entity_1 = require("./entities/course.entity");
const lesson_entity_1 = require("./entities/lesson.entity");
const enrollment_entity_1 = require("./entities/enrollment.entity");
const progress_entity_1 = require("./entities/progress.entity");
const assessment_entity_1 = require("./entities/assessment.entity");
const assessment_question_entity_1 = require("./entities/assessment-question.entity");
const assessment_attempt_entity_1 = require("./entities/assessment-attempt.entity");
const certificate_entity_1 = require("./entities/certificate.entity");
const subscription_entity_1 = require("./entities/subscription.entity");
const leaderboard_entity_1 = require("./entities/leaderboard.entity");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({ isGlobal: true }),
            throttler_1.ThrottlerModule.forRoot([{ ttl: 60000, limit: 100 }]),
            typeorm_1.TypeOrmModule.forRootAsync({
                imports: [config_1.ConfigModule],
                useFactory: (configService) => ({
                    type: 'postgres',
                    url: configService.get('DATABASE_URL'),
                    entities: [
                        tenant_entity_1.Tenant, user_entity_1.User, course_entity_1.Course, lesson_entity_1.Lesson, enrollment_entity_1.Enrollment, progress_entity_1.Progress,
                        assessment_entity_1.Assessment, assessment_question_entity_1.AssessmentQuestion, assessment_attempt_entity_1.AssessmentAttempt,
                        certificate_entity_1.Certificate, subscription_entity_1.Subscription, leaderboard_entity_1.LeaderboardEntry,
                    ],
                    synchronize: process.env.NODE_ENV !== 'production',
                    logging: process.env.NODE_ENV !== 'production',
                    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
                }),
                inject: [config_1.ConfigService],
            }),
            auth_module_1.AuthModule,
            users_module_1.UsersModule,
            tenants_module_1.TenantsModule,
            courses_module_1.CoursesModule,
            lessons_module_1.LessonsModule,
            enrollments_module_1.EnrollmentsModule,
            progress_module_1.ProgressModule,
            assessments_module_1.AssessmentsModule,
            certificates_module_1.CertificatesModule,
            subscriptions_module_1.SubscriptionsModule,
            leaderboard_module_1.LeaderboardModule,
            ai_module_1.AiModule,
            analytics_module_1.AnalyticsModule,
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map