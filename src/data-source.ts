/**
 * TypeORM DataSource for CLI migrations.
 * Usage:
 *   npm run migration:generate -- src/migrations/AddSomeField
 *   npm run migration:run
 *   npm run migration:revert
 *
 * Set DATABASE_URL in your .env or environment before running these commands.
 */
import 'reflect-metadata';
import * as dotenv from 'dotenv';
import { DataSource } from 'typeorm';
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

dotenv.config();

export const AppDataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  entities: [
    Tenant, User, Course, Lesson, Enrollment, Progress,
    Assessment, AssessmentQuestion, AssessmentAttempt,
    Certificate, Subscription, LeaderboardEntry,
  ],
  migrations: ['src/migrations/*.ts'],
  synchronize: false, // NEVER true here — this is the migrations data source
  ssl: { rejectUnauthorized: false },
  extra: { family: 4 },
});

export default AppDataSource;
