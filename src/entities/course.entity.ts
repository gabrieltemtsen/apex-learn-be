import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn, JoinColumn } from 'typeorm';
import { User } from './user.entity';
import { Tenant } from './tenant.entity';

export enum CourseLevel {
  BEGINNER = 'beginner',
  INTERMEDIATE = 'intermediate',
  ADVANCED = 'advanced',
}

@Entity('courses')
export class Course {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  tenantId: string;

  @ManyToOne(() => Tenant)
  @JoinColumn({ name: 'tenantId' })
  tenant: Tenant;

  @Column()
  instructorId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'instructorId' })
  instructor: User;

  @Column()
  title: string;

  @Column({ unique: true })
  slug: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ nullable: true })
  thumbnailUrl: string;

  @Column({ nullable: true })
  category: string;

  @Column({ type: 'enum', enum: CourseLevel, default: CourseLevel.BEGINNER })
  level: CourseLevel;

  @Column({ type: 'float', default: 0 })
  durationHours: number;

  @Column({ default: false })
  isPublished: boolean;

  @Column({ default: false })
  isFeatured: boolean;

  @Column({ nullable: true })
  tags: string;

  @Column({ default: 0 })
  enrollmentCount: number;

  @Column({ type: 'float', default: 0 })
  averageRating: number;

  @Column({ default: 0 })
  reviewCount: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
