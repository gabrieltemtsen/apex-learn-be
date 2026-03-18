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
exports.AssessmentsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const assessment_entity_1 = require("../entities/assessment.entity");
const assessment_question_entity_1 = require("../entities/assessment-question.entity");
const assessment_attempt_entity_1 = require("../entities/assessment-attempt.entity");
const users_service_1 = require("../users/users.service");
const ai_service_1 = require("../ai/ai.service");
let AssessmentsService = class AssessmentsService {
    assessmentRepo;
    questionRepo;
    attemptRepo;
    usersService;
    aiService;
    constructor(assessmentRepo, questionRepo, attemptRepo, usersService, aiService) {
        this.assessmentRepo = assessmentRepo;
        this.questionRepo = questionRepo;
        this.attemptRepo = attemptRepo;
        this.usersService = usersService;
        this.aiService = aiService;
    }
    findByCourse(courseId) {
        return this.assessmentRepo.find({ where: { courseId, isActive: true } });
    }
    async findOne(id) {
        const assessment = await this.assessmentRepo.findOne({ where: { id }, relations: ['course'] });
        if (!assessment)
            throw new common_1.NotFoundException(`Assessment ${id} not found`);
        const questions = await this.questionRepo.find({
            where: { assessmentId: id },
            order: { order: 'ASC' },
        });
        return { ...assessment, questions };
    }
    async create(dto) {
        const assessment = this.assessmentRepo.create(dto);
        return this.assessmentRepo.save(assessment);
    }
    async update(id, dto) {
        await this.assessmentRepo.findOne({ where: { id } });
        await this.assessmentRepo.update(id, dto);
        return this.assessmentRepo.findOne({ where: { id } });
    }
    async submitAttempt(assessmentId, userId, dto) {
        const assessment = await this.assessmentRepo.findOne({ where: { id: assessmentId } });
        if (!assessment)
            throw new common_1.NotFoundException('Assessment not found');
        const questions = await this.questionRepo.find({ where: { assessmentId } });
        let correct = 0;
        for (const q of questions) {
            if (dto.answers[q.id] === q.correctAnswer)
                correct++;
        }
        const score = questions.length > 0 ? (correct / questions.length) * 100 : 0;
        const passed = score >= assessment.passScore;
        const attempt = this.attemptRepo.create({
            userId,
            assessmentId,
            answers: dto.answers,
            score,
            passed,
            timeTakenSeconds: dto.timeTakenSeconds,
        });
        const saved = await this.attemptRepo.save(attempt);
        if (passed) {
            await this.usersService.updatePoints(userId, 50);
        }
        return saved;
    }
    getResults(assessmentId, userId) {
        return this.attemptRepo.find({
            where: { assessmentId, userId },
            order: { completedAt: 'DESC' },
        });
    }
    async generateWithAI(courseTitle, topic, numQuestions, difficulty, assessmentId) {
        const generated = await this.aiService.generateQuiz(courseTitle, topic, numQuestions, difficulty);
        const questions = [];
        for (let i = 0; i < generated.length; i++) {
            const q = this.questionRepo.create({
                assessmentId,
                question: generated[i].question,
                options: generated[i].options,
                correctAnswer: generated[i].correctAnswer,
                explanation: generated[i].explanation,
                difficulty: difficulty,
                order: i,
            });
            questions.push(await this.questionRepo.save(q));
        }
        await this.assessmentRepo.update(assessmentId, { isAiGenerated: true });
        return questions;
    }
};
exports.AssessmentsService = AssessmentsService;
exports.AssessmentsService = AssessmentsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(assessment_entity_1.Assessment)),
    __param(1, (0, typeorm_1.InjectRepository)(assessment_question_entity_1.AssessmentQuestion)),
    __param(2, (0, typeorm_1.InjectRepository)(assessment_attempt_entity_1.AssessmentAttempt)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        users_service_1.UsersService,
        ai_service_1.AiService])
], AssessmentsService);
//# sourceMappingURL=assessments.service.js.map