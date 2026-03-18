import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThrottlerModule } from '@nestjs/throttler';

import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { TenantsModule } from './tenants/tenants.module';
import { CoursesModule } from './courses/courses.module';
import { LessonsModule } from './lessons/lessons.module';
import { EnrollmentsModule } from './enrollments/enrollments.module';
import { ProgressModule } from './progress/progress.module';
import { AssessmentsModule } from './assessments/assessments.module';
import { CertificatesModule } from './certificates/certificates.module';
import { SubscriptionsModule } from './subscriptions/subscriptions.module';
import { LeaderboardModule } from './leaderboard/leaderboard.module';
import { AiModule } from './ai/ai.module';
import { AnalyticsModule } from './analytics/analytics.module';

import { Tenant } from './entities/tenant.entity';
import { User } from './entities/user.entity';
import { Course } from './entities/course.entity';
import { Lesson } from './entities/lesson.entity';
import { Enrollment } from './entities/enrollment.entity';
import { Progress } from './entities/progress.entity';
import { Assessment } from './entities/assessment.entity';
import { AssessmentQuestion } from './entities/assessment-question.entity';
import { AssessmentAttempt } from './entities/assessment-attempt.entity';
import { Certificate } from './entities/certificate.entity';
import { Subscription } from './entities/subscription.entity';
import { LeaderboardEntry } from './entities/leaderboard.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ThrottlerModule.forRoot([{ ttl: 60000, limit: 100 }]),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        url: configService.get<string>('DATABASE_URL'),
        entities: [
          Tenant, User, Course, Lesson, Enrollment, Progress,
          Assessment, AssessmentQuestion, AssessmentAttempt,
          Certificate, Subscription, LeaderboardEntry,
        ],
        synchronize: process.env.NODE_ENV !== 'production',
        logging: process.env.NODE_ENV !== 'production',
        ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    UsersModule,
    TenantsModule,
    CoursesModule,
    LessonsModule,
    EnrollmentsModule,
    ProgressModule,
    AssessmentsModule,
    CertificatesModule,
    SubscriptionsModule,
    LeaderboardModule,
    AiModule,
    AnalyticsModule,
  ],
})
export class AppModule {}
