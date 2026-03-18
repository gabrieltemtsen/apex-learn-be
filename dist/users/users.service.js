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
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const user_entity_1 = require("../entities/user.entity");
let UsersService = class UsersService {
    userRepo;
    constructor(userRepo) {
        this.userRepo = userRepo;
    }
    async findAll(tenantId) {
        const where = tenantId ? { tenantId } : {};
        return this.userRepo.find({ where, relations: ['tenant'] });
    }
    async findOne(id) {
        const user = await this.userRepo.findOne({ where: { id }, relations: ['tenant'] });
        if (!user)
            throw new common_1.NotFoundException(`User ${id} not found`);
        return user;
    }
    async findByEmail(email) {
        return this.userRepo.findOne({ where: { email } });
    }
    async create(data) {
        const user = this.userRepo.create(data);
        return this.userRepo.save(user);
    }
    async update(id, dto) {
        await this.findOne(id);
        await this.userRepo.update(id, dto);
        return this.findOne(id);
    }
    async remove(id) {
        await this.findOne(id);
        await this.userRepo.delete(id);
    }
    async updateRefreshToken(id, refreshToken) {
        await this.userRepo.update(id, { refreshToken: refreshToken ?? undefined });
    }
    async updateLastLogin(id) {
        await this.userRepo.update(id, { lastLoginAt: new Date() });
    }
    async updatePoints(id, points) {
        await this.userRepo.increment({ id }, 'points', points);
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], UsersService);
//# sourceMappingURL=users.service.js.map