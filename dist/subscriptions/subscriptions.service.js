"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var SubscriptionsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubscriptionsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const config_1 = require("@nestjs/config");
const axios_1 = __importDefault(require("axios"));
const subscription_entity_1 = require("../entities/subscription.entity");
let SubscriptionsService = SubscriptionsService_1 = class SubscriptionsService {
    subRepo;
    configService;
    logger = new common_1.Logger(SubscriptionsService_1.name);
    paystackBaseUrl = 'https://api.paystack.co';
    constructor(subRepo, configService) {
        this.subRepo = subRepo;
        this.configService = configService;
    }
    getPlans() {
        return [
            {
                id: subscription_entity_1.SubscriptionPlan.BASIC,
                name: 'Multi-Tenant SaaS',
                amountKobo: 5000000,
                features: [
                    'Up to 500 learners',
                    'Up to 50 courses',
                    'Basic analytics',
                    'AI quiz generation (100/month)',
                    'QR certificates',
                    'Email support',
                ],
            },
            {
                id: subscription_entity_1.SubscriptionPlan.PROFESSIONAL,
                name: 'Professional',
                amountKobo: 15000000,
                features: [
                    'Up to 2,000 learners',
                    'Unlimited courses',
                    'Advanced analytics',
                    'AI quiz generation (unlimited)',
                    'White-label option',
                    'Custom domain',
                    'Priority support',
                ],
            },
            {
                id: subscription_entity_1.SubscriptionPlan.ENTERPRISE,
                name: 'Full White-Label Enterprise',
                amountKobo: 50000000,
                features: [
                    'Unlimited learners',
                    'Unlimited courses',
                    'Full analytics & reporting',
                    'Unlimited AI features',
                    'Full white-label',
                    'Custom integrations',
                    'Dedicated account manager',
                    'SLA guarantee',
                ],
            },
        ];
    }
    async findMySubscription(tenantId) {
        return this.subRepo.findOne({
            where: { tenantId },
            relations: ['tenant'],
            order: { createdAt: 'DESC' },
        });
    }
    async initialize(tenantId, plan, email) {
        const secretKey = this.configService.get('PAYSTACK_SECRET_KEY');
        const planInfo = this.getPlans().find((p) => p.id === plan);
        if (!planInfo)
            throw new Error('Invalid plan');
        try {
            const response = await axios_1.default.post(`${this.paystackBaseUrl}/transaction/initialize`, {
                email,
                amount: planInfo.amountKobo,
                metadata: { tenantId, plan },
                callback_url: `${this.configService.get('FRONTEND_URL')}/subscription/callback`,
            }, { headers: { Authorization: `Bearer ${secretKey}` } });
            const sub = this.subRepo.create({
                tenantId,
                plan,
                status: subscription_entity_1.SubscriptionStatus.TRIALING,
                amountKobo: planInfo.amountKobo,
            });
            await this.subRepo.save(sub);
            return response.data;
        }
        catch (error) {
            this.logger.error('Paystack initialization failed', error.response?.data);
            throw error;
        }
    }
    async handleWebhook(event, data) {
        if (event === 'charge.success') {
            const { metadata, reference } = data;
            if (metadata?.tenantId && metadata?.plan) {
                await this.subRepo.update({ tenantId: metadata.tenantId }, {
                    status: subscription_entity_1.SubscriptionStatus.ACTIVE,
                    currentPeriodStart: new Date(),
                    currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
                });
            }
        }
        if (event === 'subscription.disable') {
            const { customer } = data;
            await this.subRepo.update({ paystackCustomerCode: customer?.customer_code }, { status: subscription_entity_1.SubscriptionStatus.CANCELLED });
        }
    }
};
exports.SubscriptionsService = SubscriptionsService;
exports.SubscriptionsService = SubscriptionsService = SubscriptionsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(subscription_entity_1.Subscription)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        config_1.ConfigService])
], SubscriptionsService);
//# sourceMappingURL=subscriptions.service.js.map