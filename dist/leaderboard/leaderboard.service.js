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
exports.LeaderboardService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const leaderboard_entity_1 = require("../entities/leaderboard.entity");
let LeaderboardService = class LeaderboardService {
    leaderboardRepo;
    constructor(leaderboardRepo) {
        this.leaderboardRepo = leaderboardRepo;
    }
    async getRankings(tenantId, period = 'all_time') {
        return this.leaderboardRepo.find({
            where: { tenantId, period },
            relations: ['user'],
            order: { points: 'DESC' },
            take: 100,
        });
    }
    async updateUserPoints(userId, tenantId, points, period = 'all_time') {
        let entry = await this.leaderboardRepo.findOne({ where: { userId, tenantId, period } });
        if (entry) {
            await this.leaderboardRepo.update(entry.id, {
                points: entry.points + points,
            });
        }
        else {
            entry = this.leaderboardRepo.create({ userId, tenantId, points, period });
            await this.leaderboardRepo.save(entry);
        }
        await this.recomputeRanks(tenantId, period);
    }
    async incrementCoursesCompleted(userId, tenantId) {
        const entry = await this.leaderboardRepo.findOne({ where: { userId, tenantId, period: 'all_time' } });
        if (entry) {
            await this.leaderboardRepo.increment({ id: entry.id }, 'coursesCompleted', 1);
        }
    }
    async recomputeRanks(tenantId, period) {
        const entries = await this.leaderboardRepo.find({
            where: { tenantId, period },
            order: { points: 'DESC' },
        });
        for (let i = 0; i < entries.length; i++) {
            await this.leaderboardRepo.update(entries[i].id, { rank: i + 1 });
        }
    }
};
exports.LeaderboardService = LeaderboardService;
exports.LeaderboardService = LeaderboardService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(leaderboard_entity_1.LeaderboardEntry)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], LeaderboardService);
//# sourceMappingURL=leaderboard.service.js.map