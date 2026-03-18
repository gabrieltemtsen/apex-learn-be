"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const app_module_1 = require("./app.module");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.enableCors({
        origin: [process.env.FRONTEND_URL || 'http://localhost:3000', 'http://localhost:3000'],
        credentials: true,
    });
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: true,
    }));
    const config = new swagger_1.DocumentBuilder()
        .setTitle('ApexLearn API')
        .setDescription('AI-Native Multi-Tenant Learning Management System')
        .setVersion('1.0')
        .addBearerAuth()
        .addTag('auth', 'Authentication')
        .addTag('users', 'User management')
        .addTag('tenants', 'Tenant management')
        .addTag('courses', 'Course management')
        .addTag('lessons', 'Lesson management')
        .addTag('enrollments', 'Enrollment management')
        .addTag('progress', 'Learning progress')
        .addTag('assessments', 'Assessments & quizzes')
        .addTag('certificates', 'Certificates')
        .addTag('subscriptions', 'Subscriptions & billing')
        .addTag('leaderboard', 'Leaderboard & gamification')
        .addTag('ai', 'AI-powered features')
        .addTag('analytics', 'Analytics & reporting')
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('api/docs', app, document);
    const port = process.env.PORT || 3001;
    await app.listen(port);
    console.log(`🚀 ApexLearn API running on: http://localhost:${port}`);
    console.log(`📚 Swagger docs: http://localhost:${port}/api/docs`);
}
bootstrap();
//# sourceMappingURL=main.js.map