import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn, JoinColumn } from 'typeorm';
import { Course } from './course.entity';

export enum AssessmentType {
  QUIZ = 'quiz',
  FINAL_EXAM = 'final_exam',
  DIAGNOSTIC = 'diagnostic',
}

@Entity('assessments')
export class Assessment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  courseId: string;

  @ManyToOne(() => Course)
  @JoinColumn({ name: 'courseId' })
  course: Course;

  @Column({ nullable: true })
  lessonId: string;

  @Column()
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'enum', enum: AssessmentType, default: AssessmentType.QUIZ })
  type: AssessmentType;

  @Column({ default: false })
  isAiGenerated: boolean;

  @Column({ nullable: true })
  timeLimitMinutes: number;

  @Column({ default: 70 })
  passScore: number;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
