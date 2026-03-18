import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, JoinColumn } from 'typeorm';
import { Assessment } from './assessment.entity';

@Entity('assessment_questions')
export class AssessmentQuestion {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  assessmentId: string;

  @ManyToOne(() => Assessment)
  @JoinColumn({ name: 'assessmentId' })
  assessment: Assessment;

  @Column({ type: 'text' })
  question: string;

  @Column({ type: 'jsonb' })
  options: string[];

  @Column()
  correctAnswer: string;

  @Column({ type: 'text', nullable: true })
  explanation: string;

  @Column({ type: 'enum', enum: ['easy', 'medium', 'hard'], default: 'medium' })
  difficulty: string;

  @Column({ default: 0 })
  order: number;

  @CreateDateColumn()
  createdAt: Date;
}
