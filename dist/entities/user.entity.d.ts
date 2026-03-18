import { Tenant } from './tenant.entity';
export declare enum UserRole {
    LEARNER = "learner",
    FACILITATOR = "facilitator",
    ADMIN = "admin",
    TENANT_ADMIN = "tenant_admin",
    SUPER_ADMIN = "super_admin"
}
export declare class User {
    id: string;
    tenantId: string;
    tenant: Tenant;
    firstName: string;
    lastName: string;
    email: string;
    passwordHash: string;
    role: UserRole;
    avatarUrl: string;
    bio: string;
    jobTitle: string;
    isActive: boolean;
    isEmailVerified: boolean;
    refreshToken: string;
    lastLoginAt: Date;
    points: number;
    streak: number;
    createdAt: Date;
    updatedAt: Date;
}
