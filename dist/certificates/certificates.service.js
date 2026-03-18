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
exports.CertificatesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const certificate_entity_1 = require("../entities/certificate.entity");
const uuid_1 = require("uuid");
let CertificatesService = class CertificatesService {
    certRepo;
    constructor(certRepo) {
        this.certRepo = certRepo;
    }
    findMyCertificates(userId) {
        return this.certRepo.find({
            where: { userId },
            relations: ['course', 'tenant'],
            order: { issuedAt: 'DESC' },
        });
    }
    async generate(userId, courseId, tenantId) {
        const existing = await this.certRepo.findOne({ where: { userId, courseId } });
        if (existing)
            return existing;
        const certNumber = `APEX-${Date.now()}-${(0, uuid_1.v4)().slice(0, 8).toUpperCase()}`;
        const qrCodeData = `https://apexlearn.ng/certificates/verify/${certNumber}`;
        const cert = this.certRepo.create({
            userId,
            courseId,
            tenantId,
            certificateNumber: certNumber,
            qrCodeData,
        });
        return this.certRepo.save(cert);
    }
    async verify(certificateNumber) {
        const cert = await this.certRepo.findOne({
            where: { certificateNumber },
            relations: ['user', 'course', 'tenant'],
        });
        if (!cert)
            throw new common_1.NotFoundException('Certificate not found or invalid');
        return cert;
    }
};
exports.CertificatesService = CertificatesService;
exports.CertificatesService = CertificatesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(certificate_entity_1.Certificate)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], CertificatesService);
//# sourceMappingURL=certificates.service.js.map