import { Injectable, NotFoundException, OnApplicationBootstrap } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { Tenant } from '../entities/tenant.entity';
import { CreateTenantDto } from './dto/create-tenant.dto';

@Injectable()
export class TenantsService implements OnApplicationBootstrap {
  private defaultTenantId: string | null = null;

  constructor(
    @InjectRepository(Tenant)
    private tenantRepo: Repository<Tenant>,
    private configService: ConfigService,
  ) {}

  /** Auto-runs on app start — ensures a default tenant always exists */
  async onApplicationBootstrap() {
    await this.getOrCreateDefault();
  }

  /** Get or create the platform default tenant. Returns its ID. */
  async getOrCreateDefault(): Promise<string> {
    if (this.defaultTenantId) return this.defaultTenantId;

    // Check if any tenant exists already
    const existing = await this.tenantRepo.findOne({ where: { isActive: true }, order: { createdAt: 'ASC' } });
    if (existing) {
      this.defaultTenantId = existing.id;
      return existing.id;
    }

    // Create the default platform tenant from env or fallback values
    const name = this.configService.get('DEFAULT_TENANT_NAME') || 'ApexLearn';
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const tenant = this.tenantRepo.create({
      name,
      slug,
      plan: 'saas',
      isActive: true,
      contactEmail: this.configService.get('DEFAULT_TENANT_EMAIL') || 'hello@apexlearn.ng',
    });
    const saved = await this.tenantRepo.save(tenant);
    this.defaultTenantId = saved.id;
    console.log(`✅ Default tenant created: "${name}" (${saved.id})`);
    return saved.id;
  }

  findAll(): Promise<Tenant[]> {
    return this.tenantRepo.find({ where: { isActive: true } });
  }

  async findOne(id: string): Promise<Tenant> {
    const tenant = await this.tenantRepo.findOne({ where: { id } });
    if (!tenant) throw new NotFoundException(`Tenant ${id} not found`);
    return tenant;
  }

  async findBySlug(slug: string): Promise<Tenant> {
    const tenant = await this.tenantRepo.findOne({ where: { slug } });
    if (!tenant) throw new NotFoundException(`Tenant with slug ${slug} not found`);
    return tenant;
  }

  async create(dto: CreateTenantDto): Promise<Tenant> {
    const tenant = this.tenantRepo.create(dto);
    return this.tenantRepo.save(tenant);
  }

  async update(id: string, dto: Partial<CreateTenantDto>): Promise<Tenant> {
    await this.findOne(id);
    await this.tenantRepo.update(id, dto);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    await this.findOne(id);
    await this.tenantRepo.delete(id);
  }
}
