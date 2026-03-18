import { SubscriptionsService } from './subscriptions.service';
import { SubscriptionPlan } from '../entities/subscription.entity';
declare class InitializeSubDto {
    tenantId: string;
    plan: SubscriptionPlan;
    email: string;
}
export declare class SubscriptionsController {
    private subscriptionsService;
    constructor(subscriptionsService: SubscriptionsService);
    getPlans(): {
        id: SubscriptionPlan;
        name: string;
        amountKobo: number;
        features: string[];
    }[];
    initialize(dto: InitializeSubDto): Promise<any>;
    getMySubscription(req: any): Promise<import("../entities/subscription.entity").Subscription | null>;
    handleWebhook(body: any, signature: string): Promise<{
        received: boolean;
    }>;
}
export {};
