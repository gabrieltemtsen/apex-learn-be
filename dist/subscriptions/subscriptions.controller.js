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
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubscriptionsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const subscriptions_service_1 = require("./subscriptions.service");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const subscription_entity_1 = require("../entities/subscription.entity");
const class_validator_1 = require("class-validator");
const swagger_2 = require("@nestjs/swagger");
class InitializeSubDto {
    tenantId;
    plan;
    email;
}
__decorate([
    (0, swagger_2.ApiProperty)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], InitializeSubDto.prototype, "tenantId", void 0);
__decorate([
    (0, swagger_2.ApiProperty)({ enum: subscription_entity_1.SubscriptionPlan }),
    (0, class_validator_1.IsEnum)(subscription_entity_1.SubscriptionPlan),
    __metadata("design:type", String)
], InitializeSubDto.prototype, "plan", void 0);
__decorate([
    (0, swagger_2.ApiProperty)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], InitializeSubDto.prototype, "email", void 0);
let SubscriptionsController = class SubscriptionsController {
    subscriptionsService;
    constructor(subscriptionsService) {
        this.subscriptionsService = subscriptionsService;
    }
    getPlans() {
        return this.subscriptionsService.getPlans();
    }
    initialize(dto) {
        return this.subscriptionsService.initialize(dto.tenantId, dto.plan, dto.email);
    }
    getMySubscription(req) {
        return this.subscriptionsService.findMySubscription(req.user.tenantId);
    }
    async handleWebhook(body, signature) {
        await this.subscriptionsService.handleWebhook(body.event, body.data);
        return { received: true };
    }
};
exports.SubscriptionsController = SubscriptionsController;
__decorate([
    (0, common_1.Get)('plans'),
    (0, swagger_1.ApiOperation)({ summary: 'Get available subscription plans' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], SubscriptionsController.prototype, "getPlans", null);
__decorate([
    (0, common_1.Post)('initialize'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Initialize a Paystack subscription' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [InitializeSubDto]),
    __metadata("design:returntype", void 0)
], SubscriptionsController.prototype, "initialize", null);
__decorate([
    (0, common_1.Get)('my'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Get my subscription' }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], SubscriptionsController.prototype, "getMySubscription", null);
__decorate([
    (0, common_1.Post)('webhook'),
    (0, swagger_1.ApiOperation)({ summary: 'Paystack webhook handler' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Headers)('x-paystack-signature')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], SubscriptionsController.prototype, "handleWebhook", null);
exports.SubscriptionsController = SubscriptionsController = __decorate([
    (0, swagger_1.ApiTags)('subscriptions'),
    (0, common_1.Controller)('subscriptions'),
    __metadata("design:paramtypes", [subscriptions_service_1.SubscriptionsService])
], SubscriptionsController);
//# sourceMappingURL=subscriptions.controller.js.map