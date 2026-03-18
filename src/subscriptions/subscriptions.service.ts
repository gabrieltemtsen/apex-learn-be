import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { Subscription, SubscriptionPlan, SubscriptionStatus } from '../entities/subscription.entity';

@Injectable()
export class SubscriptionsService {
  private readonly logger = new Logger(SubscriptionsService.name);
  private readonly paystackBaseUrl = 'https://api.paystack.co';

  constructor(
    @InjectRepository(Subscription)
    private subRepo: Repository<Subscription>,
    private configService: ConfigService,
  ) {}

  getPlans() {
    return [
      {
        id: SubscriptionPlan.BASIC,
        name: 'Multi-Tenant SaaS',
        amountKobo: 5000000, // ₦50,000/month
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
        id: SubscriptionPlan.PROFESSIONAL,
        name: 'Professional',
        amountKobo: 15000000, // ₦150,000/month
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
        id: SubscriptionPlan.ENTERPRISE,
        name: 'Full White-Label Enterprise',
        amountKobo: 50000000, // ₦500,000/month
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

  async findMySubscription(tenantId: string): Promise<Subscription | null> {
    return this.subRepo.findOne({
      where: { tenantId },
      relations: ['tenant'],
      order: { createdAt: 'DESC' },
    });
  }

  async initialize(tenantId: string, plan: SubscriptionPlan, email: string): Promise<any> {
    const secretKey = this.configService.get<string>('PAYSTACK_SECRET_KEY');
    const planInfo = this.getPlans().find((p) => p.id === plan);
    if (!planInfo) throw new Error('Invalid plan');

    try {
      const response = await axios.post(
        `${this.paystackBaseUrl}/transaction/initialize`,
        {
          email,
          amount: planInfo.amountKobo,
          metadata: { tenantId, plan },
          callback_url: `${this.configService.get('FRONTEND_URL')}/subscription/callback`,
        },
        { headers: { Authorization: `Bearer ${secretKey}` } },
      );

      const sub = this.subRepo.create({
        tenantId,
        plan,
        status: SubscriptionStatus.TRIALING,
        amountKobo: planInfo.amountKobo,
      });
      await this.subRepo.save(sub);

      return response.data;
    } catch (error) {
      this.logger.error('Paystack initialization failed', error.response?.data);
      throw error;
    }
  }

  async handleWebhook(event: string, data: any): Promise<void> {
    if (event === 'charge.success') {
      const { metadata, reference } = data;
      if (metadata?.tenantId && metadata?.plan) {
        await this.subRepo.update(
          { tenantId: metadata.tenantId },
          {
            status: SubscriptionStatus.ACTIVE,
            currentPeriodStart: new Date(),
            currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          },
        );
      }
    }
    if (event === 'subscription.disable') {
      const { customer } = data;
      await this.subRepo.update(
        { paystackCustomerCode: customer?.customer_code },
        { status: SubscriptionStatus.CANCELLED },
      );
    }
  }
}
