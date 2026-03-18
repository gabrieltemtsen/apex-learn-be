import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { Subscription, SubscriptionPlan } from '../entities/subscription.entity';
export declare class SubscriptionsService {
    private subRepo;
    private configService;
    private readonly logger;
    private readonly paystackBaseUrl;
    constructor(subRepo: Repository<Subscription>, configService: ConfigService);
    getPlans(): {
        id: SubscriptionPlan;
        name: string;
        amountKobo: number;
        features: string[];
    }[];
    findMySubscription(tenantId: string): Promise<Subscription | null>;
    initialize(tenantId: string, plan: SubscriptionPlan, email: string): Promise<any>;
    handleWebhook(event: string, data: any): Promise<void>;
}
