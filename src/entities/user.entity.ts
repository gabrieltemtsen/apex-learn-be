import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
} from 'typeorm';
import { Tenant } from './tenant.entity';

export enum UserRole {
  LEARNER = 'learner',
  FACILITATOR = 'facilitator',
  ADMIN = 'admin',
  TENANT_ADMIN = 'tenant_admin',
  SUPER_ADMIN = 'super_admin',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  tenantId: string;

  @ManyToOne(() => Tenant, { nullable: true })
  @JoinColumn({ name: 'tenantId' })
  tenant: Tenant;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ unique: true })
  email: string;

  // Nullable to support OAuth-based accounts (Auth0) without local passwords.
  // IMPORTANT: for union types (string | null), TypeORM may infer design:type as Object.
  // Explicitly set the DB column type to avoid DataTypeNotSupportedError on Postgres.
  @Column({ type: 'text', nullable: true })
  passwordHash: string | null;

  // --- NRSA identity fields (single-tenant MVP) ---
  // Primary org identifier. May be populated by staff directory sync or admin.
  @Column({ unique: true, nullable: true })
  irNumber: string | null;

  @Column({ nullable: true })
  department: string | null;

  @Column({ nullable: true })
  roleGrade: string | null;

  // Manager / reporting line. Stored as IR number for easy directory alignment.
  @Column({ nullable: true })
  managerIrNumber: string | null;

  // Location breakdown (MVP analytics + leaderboards)
  @Column({ nullable: true })
  locationCity: string | null;

  @Column({ nullable: true })
  locationBranch: string | null;

  @Column({ nullable: true })
  locationOutstation: string | null;

  // Store bucketed value (e.g. "18-24", "25-34") to avoid collecting DOB for MVP.
  @Column({ nullable: true })
  ageGroup: string | null;

  // Auth0 identity
  @Column({ nullable: true })
  auth0Sub: string | null;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.LEARNER })
  role: UserRole;

  @Column({ nullable: true })
  avatarUrl: string;

  @Column({ nullable: true })
  bio: string;

  @Column({ nullable: true })
  jobTitle: string;

  @Column({ default: true })
  isActive: boolean;

  @Column({ default: false })
  isEmailVerified: boolean;

  @Column({ nullable: true })
  refreshToken: string;

  @Column({ nullable: true })
  lastLoginAt: Date;

  @Column({ nullable: true })
  resetPasswordToken: string;

  @Column({ nullable: true })
  resetPasswordExpires: Date;

  @Column({ default: 0 })
  points: number;

  @Column({ default: 0 })
  streak: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
