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
Object.defineProperty(exports, "__esModule", { value: true });
exports.LeaderboardEntry = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("./user.entity");
const tenant_entity_1 = require("./tenant.entity");
let LeaderboardEntry = class LeaderboardEntry {
    id;
    userId;
    user;
    tenantId;
    tenant;
    points;
    rank;
    period;
    coursesCompleted;
    assessmentsPassed;
    updatedAt;
    createdAt;
};
exports.LeaderboardEntry = LeaderboardEntry;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], LeaderboardEntry.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], LeaderboardEntry.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User),
    (0, typeorm_1.JoinColumn)({ name: 'userId' }),
    __metadata("design:type", user_entity_1.User)
], LeaderboardEntry.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], LeaderboardEntry.prototype, "tenantId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => tenant_entity_1.Tenant),
    (0, typeorm_1.JoinColumn)({ name: 'tenantId' }),
    __metadata("design:type", tenant_entity_1.Tenant)
], LeaderboardEntry.prototype, "tenant", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 0 }),
    __metadata("design:type", Number)
], LeaderboardEntry.prototype, "points", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 0 }),
    __metadata("design:type", Number)
], LeaderboardEntry.prototype, "rank", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: ['weekly', 'monthly', 'all_time'], default: 'all_time' }),
    __metadata("design:type", String)
], LeaderboardEntry.prototype, "period", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 0 }),
    __metadata("design:type", Number)
], LeaderboardEntry.prototype, "coursesCompleted", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 0 }),
    __metadata("design:type", Number)
], LeaderboardEntry.prototype, "assessmentsPassed", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], LeaderboardEntry.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], LeaderboardEntry.prototype, "createdAt", void 0);
exports.LeaderboardEntry = LeaderboardEntry = __decorate([
    (0, typeorm_1.Entity)('leaderboard_entries')
], LeaderboardEntry);
//# sourceMappingURL=leaderboard.entity.js.map