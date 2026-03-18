import { Repository } from 'typeorm';
import { Tenant } from '../entities/tenant.entity';
import { CreateTenantDto } from './dto/create-tenant.dto';
export declare class TenantsService {
    private tenantRepo;
    constructor(tenantRepo: Repository<Tenant>);
    findAll(): Promise<Tenant[]>;
    findOne(id: string): Promise<Tenant>;
    findBySlug(slug: string): Promise<Tenant>;
    create(dto: CreateTenantDto): Promise<Tenant>;
    update(id: string, dto: Partial<CreateTenantDto>): Promise<Tenant>;
    remove(id: string): Promise<void>;
}
