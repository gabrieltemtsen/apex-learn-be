import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, JoinColumn } from 'typeorm';
import { User } from './user.entity';
import { Assessment } from './assessment.entity';

@Entity('assessment_attempts')
export class AssessmentAttempt {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  assessmentId: string;

  @ManyToOne(() => Assessment)
  @JoinColumn({ name: 'assessmentId' })
  assessment: Assessment;

  @Column({ type: 'float' })
  score: number;

  @Column({ type: 'jsonb' })
  answers: Record<string, string>;

  @Column({ default: 0 })
  timeTakenSeconds: number;

  @Column({ default: false })
  passed: boolean;

  @CreateDateColumn()
  completedAt: Date;
}
