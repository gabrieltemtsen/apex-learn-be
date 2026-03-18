import { ConfigService } from '@nestjs/config';
export declare class AiService {
    private configService;
    private readonly logger;
    private genAI;
    constructor(configService: ConfigService);
    generateQuiz(courseTitle: string, topic: string, numQuestions: number, difficulty: string): Promise<Array<{
        question: string;
        options: string[];
        correctAnswer: string;
        explanation: string;
    }>>;
    generateCourseOutline(topic: string, targetAudience: string, durationHours: number): Promise<{
        title: string;
        modules: Array<{
            title: string;
            lessons: string[];
        }>;
    }>;
    getAdaptiveSuggestions(userId: string, completedTopics: string[], failedTopics: string[]): Promise<{
        suggestions: string[];
        nextTopics: string[];
        weakAreas: string[];
    }>;
    private getMockQuestions;
    private getMockOutline;
}
