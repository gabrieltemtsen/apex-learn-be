import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('tenants')
export class Tenant {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  name: string;

  @Column({ unique: true })
  slug: string;

  @Column({ nullable: true })
  logoUrl: string;

  @Column({ default: '#6366f1' })
  primaryColor: string;

  @Column({ default: '#0f172a' })
  backgroundColor: string;

  @Column({ type: 'enum', enum: ['saas', 'white_label'], default: 'saas' })
  plan: string;

  @Column({ default: true })
  isActive: boolean;

  @Column({ nullable: true })
  domain: string;

  @Column({ nullable: true })
  contactEmail: string;

  @Column({ nullable: true })
  contactPhone: string;

  @Column({ nullable: true })
  address: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
