import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn, JoinColumn } from 'typeorm';
import { User } from './user.entity';
import { Tenant } from './tenant.entity';

@Entity('leaderboard_entries')
export class LeaderboardEntry {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  tenantId: string;

  @ManyToOne(() => Tenant)
  @JoinColumn({ name: 'tenantId' })
  tenant: Tenant;

  @Column({ default: 0 })
  points: number;

  @Column({ default: 0 })
  rank: number;

  @Column({ type: 'enum', enum: ['weekly', 'monthly', 'all_time'], default: 'all_time' })
  period: string;

  @Column({ default: 0 })
  coursesCompleted: number;

  @Column({ default: 0 })
  assessmentsPassed: number;

  @UpdateDateColumn()
  updatedAt: Date;

  @CreateDateColumn()
  createdAt: Date;
}
