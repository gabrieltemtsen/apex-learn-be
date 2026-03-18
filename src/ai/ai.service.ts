import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GoogleGenerativeAI } from '@google/generative-ai';

@Injectable()
export class AiService {
  private readonly logger = new Logger(AiService.name);
  private genAI: GoogleGenerativeAI;

  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get<string>('GEMINI_API_KEY');
    if (apiKey) {
      this.genAI = new GoogleGenerativeAI(apiKey);
    }
  }

  async generateQuiz(
    courseTitle: string,
    topic: string,
    numQuestions: number,
    difficulty: string,
  ): Promise<Array<{ question: string; options: string[]; correctAnswer: string; explanation: string }>> {
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
    } catch (error) {
      this.logger.error('AI quiz generation failed', error);
      return this.getMockQuestions(numQuestions);
    }
  }

  async generateCourseOutline(
    topic: string,
    targetAudience: string,
    durationHours: number,
  ): Promise<{ title: string; modules: Array<{ title: string; lessons: string[] }> }> {
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
    } catch (error) {
      this.logger.error('AI course outline generation failed', error);
      return this.getMockOutline(topic);
    }
  }

  async getAdaptiveSuggestions(
    userId: string,
    completedTopics: string[],
    failedTopics: string[],
  ): Promise<{ suggestions: string[]; nextTopics: string[]; weakAreas: string[] }> {
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
    } catch (error) {
      this.logger.error('AI adaptive suggestions failed', error);
      return {
        suggestions: ['Review fundamental concepts', 'Practice with exercises'],
        nextTopics: ['Advanced topics', 'Applied projects'],
        weakAreas: failedTopics,
      };
    }
  }

  private getMockQuestions(count: number) {
    return Array.from({ length: count }, (_, i) => ({
      question: `Sample question ${i + 1}: What is the correct answer?`,
      options: ['A) Option A', 'B) Option B', 'C) Option C', 'D) Option D'],
      correctAnswer: 'A) Option A',
      explanation: 'This is a sample explanation.',
    }));
  }

  private getMockOutline(topic: string) {
    return {
      title: `Introduction to ${topic}`,
      modules: [
        { title: 'Module 1: Fundamentals', lessons: ['Overview', 'Key Concepts', 'Basic Principles'] },
        { title: 'Module 2: Intermediate', lessons: ['Advanced Concepts', 'Practical Application'] },
        { title: 'Module 3: Advanced', lessons: ['Expert Techniques', 'Case Studies', 'Final Project'] },
      ],
    };
  }
}
