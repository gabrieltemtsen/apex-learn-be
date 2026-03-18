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
var AiService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AiService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const generative_ai_1 = require("@google/generative-ai");
let AiService = AiService_1 = class AiService {
    configService;
    logger = new common_1.Logger(AiService_1.name);
    genAI;
    constructor(configService) {
        this.configService = configService;
        const apiKey = this.configService.get('GEMINI_API_KEY');
        if (apiKey) {
            this.genAI = new generative_ai_1.GoogleGenerativeAI(apiKey);
        }
    }
    async generateQuiz(courseTitle, topic, numQuestions, difficulty) {
        if (!this.genAI) {
            return this.getMockQuestions(numQuestions);
        }
        try {
            const model = this.genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
            const prompt = `Generate ${numQuestions} multiple choice quiz questions for a course titled "${courseTitle}" on the topic "${topic}". Difficulty: ${difficulty}.
      
Return as JSON array with format:
[{
  "question": "...",
  "options": ["A) ...", "B) ...", "C) ...", "D) ..."],
  "correctAnswer": "A) ...",
  "explanation": "..."
}]
Return ONLY the JSON array, no markdown.`;
            const result = await model.generateContent(prompt);
            const text = result.response.text().trim();
            const cleaned = text.replace(/```json\n?/g, '').replace(/```\n?/g, '');
            return JSON.parse(cleaned);
        }
        catch (error) {
            this.logger.error('AI quiz generation failed', error);
            return this.getMockQuestions(numQuestions);
        }
    }
    async generateCourseOutline(topic, targetAudience, durationHours) {
        if (!this.genAI) {
            return this.getMockOutline(topic);
        }
        try {
            const model = this.genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
            const prompt = `Create a course outline for topic "${topic}" targeting "${targetAudience}" with total duration ${durationHours} hours.

Return as JSON:
{
  "title": "...",
  "modules": [
    {
      "title": "...",
      "lessons": ["lesson 1", "lesson 2"]
    }
  ]
}
Return ONLY the JSON, no markdown.`;
            const result = await model.generateContent(prompt);
            const text = result.response.text().trim();
            const cleaned = text.replace(/```json\n?/g, '').replace(/```\n?/g, '');
            return JSON.parse(cleaned);
        }
        catch (error) {
            this.logger.error('AI course outline generation failed', error);
            return this.getMockOutline(topic);
        }
    }
    async getAdaptiveSuggestions(userId, completedTopics, failedTopics) {
        if (!this.genAI) {
            return {
                suggestions: ['Review fundamental concepts', 'Practice with exercises'],
                nextTopics: ['Advanced topics', 'Applied projects'],
                weakAreas: failedTopics,
            };
        }
        try {
            const model = this.genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
            const prompt = `A learner has completed these topics: ${completedTopics.join(', ')} and struggled with: ${failedTopics.join(', ')}.

Provide learning suggestions as JSON:
{
  "suggestions": ["actionable advice 1", "advice 2"],
  "nextTopics": ["recommended next topic 1", "topic 2"],
  "weakAreas": ["area needing improvement 1"]
}
Return ONLY the JSON.`;
            const result = await model.generateContent(prompt);
            const text = result.response.text().trim();
            const cleaned = text.replace(/```json\n?/g, '').replace(/```\n?/g, '');
            return JSON.parse(cleaned);
        }
        catch (error) {
            this.logger.error('AI adaptive suggestions failed', error);
            return {
                suggestions: ['Review fundamental concepts', 'Practice with exercises'],
                nextTopics: ['Advanced topics', 'Applied projects'],
                weakAreas: failedTopics,
            };
        }
    }
    getMockQuestions(count) {
        return Array.from({ length: count }, (_, i) => ({
            question: `Sample question ${i + 1}: What is the correct answer?`,
            options: ['A) Option A', 'B) Option B', 'C) Option C', 'D) Option D'],
            correctAnswer: 'A) Option A',
            explanation: 'This is a sample explanation.',
        }));
    }
    getMockOutline(topic) {
        return {
            title: `Introduction to ${topic}`,
            modules: [
                { title: 'Module 1: Fundamentals', lessons: ['Overview', 'Key Concepts', 'Basic Principles'] },
                { title: 'Module 2: Intermediate', lessons: ['Advanced Concepts', 'Practical Application'] },
                { title: 'Module 3: Advanced', lessons: ['Expert Techniques', 'Case Studies', 'Final Project'] },
            ],
        };
    }
};
exports.AiService = AiService;
exports.AiService = AiService = AiService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], AiService);
//# sourceMappingURL=ai.service.js.map