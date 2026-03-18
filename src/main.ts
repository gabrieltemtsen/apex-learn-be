import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // CORS
  app.enableCors({
    origin: [process.env.FRONTEND_URL || 'http://localhost:3000', 'http://localhost:3000'],
    credentials: true,
  });

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  // Swagger docs
  const config = new DocumentBuilder()
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

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = process.env.PORT || 3001;
  await app.listen(port);
  console.log(`🚀 ApexLearn API running on: http://localhost:${port}`);
  console.log(`📚 Swagger docs: http://localhost:${port}/api/docs`);
}
bootstrap();
