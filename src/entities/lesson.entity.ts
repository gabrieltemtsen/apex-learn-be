import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn, JoinColumn } from 'typeorm';
import { Course } from './course.entity';

export enum LessonType {
  VIDEO = 'video',
  TEXT = 'text',
  QUIZ = 'quiz',
  LIVE = 'live',
}

@Entity('lessons')
export class Lesson {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  courseId: string;

  @ManyToOne(() => Course)
  @JoinColumn({ name: 'courseId' })
  course: Course;

  @Column()
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'enum', enum: LessonType, default: LessonType.VIDEO })
  type: LessonType;

  @Column({ nullable: true })
  videoUrl: string;

  @Column({ type: 'text', nullable: true })
  content: string;

  @Column({ default: 0 })
  durationSeconds: number;

  @Column({ default: 0 })
  order: number;

  @Column({ default: false })
  isPublished: boolean;

  @Column({ default: false })
  isFree: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
