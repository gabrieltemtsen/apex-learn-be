import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import helmet from 'helmet';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Security headers
  app.use(helmet({
    crossOriginEmbedderPolicy: false,
    contentSecurityPolicy: false, // Disabled so Swagger UI works
  }));

  // CORS — allow FE origin from env, plus localhost for dev
  const allowedOrigins = [
    process.env.FRONTEND_URL,
    'http://localhost:3000',
    'http://localhost:3001',
  ].filter(Boolean);

  app.enableCors({
    origin: (origin, callback) => {
      // Allow requests with no origin (mobile apps, curl, etc.)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      // Allow any vercel.app subdomain in dev/staging
      if (origin.endsWith('.vercel.app') || origin.endsWith('.railway.app')) return callback(null, true);
      callback(new Error('Not allowed by CORS'));
    },
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
