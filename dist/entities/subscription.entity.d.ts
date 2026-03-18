import { Tenant } from './tenant.entity';
export declare enum SubscriptionPlan {
    BASIC = "basic",
    PROFESSIONAL = "professional",
    ENTERPRISE = "enterprise"
}
export declare enum SubscriptionStatus {
    ACTIVE = "active",
    PAST_DUE = "past_due",
    CANCELLED = "cancelled",
    TRIALING = "trialing"
}
export declare class Subscription {
    id: string;
    tenantId: string;
    tenant: Tenant;
    plan: SubscriptionPlan;
    status: SubscriptionStatus;
    paystackSubscriptionId: string;
    paystackCustomerCode: string;
    currentPeriodStart: Date;
    currentPeriodEnd: Date;
    amountKobo: number;
    createdAt: Date;
    updatedAt: Date;
}
