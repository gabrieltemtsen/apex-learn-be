import { AiService } from './ai.service';
declare class GenerateQuizDto {
    courseTitle: string;
    topic: string;
    numQuestions: number;
    difficulty: string;
}
declare class GenerateOutlineDto {
    topic: string;
    targetAudience: string;
    durationHours: number;
}
declare class AdaptiveSuggestionsDto {
    userId: string;
    completedTopics: string[];
    failedTopics: string[];
}
export declare class AiController {
    private aiService;
    constructor(aiService: AiService);
    generateQuiz(dto: GenerateQuizDto): Promise<{
        question: string;
        options: string[];
        correctAnswer: string;
        explanation: string;
    }[]>;
    generateCourseOutline(dto: GenerateOutlineDto): Promise<{
        title: string;
        modules: Array<{
            title: string;
            lessons: string[];
        }>;
    }>;
    getAdaptiveSuggestions(dto: AdaptiveSuggestionsDto): Promise<{
        suggestions: string[];
        nextTopics: string[];
        weakAreas: string[];
    }>;
}
export {};
