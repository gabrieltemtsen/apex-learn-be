import { Controller, Get, Post, Body, UseGuards, Request, Headers, RawBodyRequest, Req } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { SubscriptionsService } from './subscriptions.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { SubscriptionPlan } from '../entities/subscription.entity';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

class InitializeSubDto {
  @ApiProperty() @IsNotEmpty() @IsString() tenantId: string;
  @ApiProperty({ enum: SubscriptionPlan }) @IsEnum(SubscriptionPlan) plan: SubscriptionPlan;
  @ApiProperty() @IsNotEmpty() @IsString() email: string;
}

@ApiTags('subscriptions')
@Controller('subscriptions')
export class SubscriptionsController {
  constructor(private subscriptionsService: SubscriptionsService) {}

  @Get('plans')
  @ApiOperation({ summary: 'Get available subscription plans' })
  getPlans() {
    return this.subscriptionsService.getPlans();
  }

  @Post('initialize')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Initialize a Paystack subscription' })
  initialize(@Body() dto: InitializeSubDto) {
    return this.subscriptionsService.initialize(dto.tenantId, dto.plan, dto.email);
  }

  @Get('my')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get my subscription' })
  getMySubscription(@Request() req: any) {
    return this.subscriptionsService.findMySubscription(req.user.tenantId);
  }

  @Post('webhook')
  @ApiOperation({ summary: 'Paystack webhook handler' })
  async handleWebhook(@Body() body: any, @Headers('x-paystack-signature') signature: string) {
    await this.subscriptionsService.handleWebhook(body.event, body.data);
    return { received: true };
  }
}
