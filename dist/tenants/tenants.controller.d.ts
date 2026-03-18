import { TenantsService } from './tenants.service';
import { CreateTenantDto } from './dto/create-tenant.dto';
export declare class TenantsController {
    private tenantsService;
    constructor(tenantsService: TenantsService);
    findAll(): Promise<import("../entities/tenant.entity").Tenant[]>;
    findBySlug(slug: string): Promise<import("../entities/tenant.entity").Tenant>;
    create(dto: CreateTenantDto): Promise<import("../entities/tenant.entity").Tenant>;
    update(id: string, dto: Partial<CreateTenantDto>): Promise<import("../entities/tenant.entity").Tenant>;
    remove(id: string): Promise<void>;
}
