import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Assessment } from '../entities/assessment.entity';
import { AssessmentQuestion } from '../entities/assessment-question.entity';
import { AssessmentAttempt } from '../entities/assessment-attempt.entity';
import { CreateAssessmentDto } from './dto/create-assessment.dto';
import { SubmitAttemptDto } from './dto/submit-attempt.dto';
import { UsersService } from '../users/users.service';
import { AiService } from '../ai/ai.service';

@Injectable()
export class AssessmentsService {
  constructor(
    @InjectRepository(Assessment)
    private assessmentRepo: Repository<Assessment>,
    @InjectRepository(AssessmentQuestion)
    private questionRepo: Repository<AssessmentQuestion>,
    @InjectRepository(AssessmentAttempt)
    private attemptRepo: Repository<AssessmentAttempt>,
    private usersService: UsersService,
    private aiService: AiService,
  ) {}

  findByCourse(courseId: string): Promise<Assessment[]> {
    return this.assessmentRepo.find({ where: { courseId, isActive: true } });
  }

  async findOne(id: string): Promise<Assessment & { questions: AssessmentQuestion[] }> {
    const assessment = await this.assessmentRepo.findOne({ where: { id }, relations: ['course'] });
    if (!assessment) throw new NotFoundException(`Assessment ${id} not found`);
    const questions = await this.questionRepo.find({
      where: { assessmentId: id },
      order: { order: 'ASC' },
    });
    return { ...assessment, questions };
  }

  async create(dto: CreateAssessmentDto): Promise<Assessment> {
    const assessment = this.assessmentRepo.create(dto);
    return this.assessmentRepo.save(assessment);
  }

  async update(id: string, dto: Partial<CreateAssessmentDto>): Promise<Assessment> {
    await this.assessmentRepo.findOne({ where: { id } });
    await this.assessmentRepo.update(id, dto);
    return this.assessmentRepo.findOne({ where: { id } }) as Promise<Assessment>;
  }

  async submitAttempt(assessmentId: string, userId: string, dto: SubmitAttemptDto): Promise<AssessmentAttempt> {
    const assessment = await this.assessmentRepo.findOne({ where: { id: assessmentId } });
    if (!assessment) throw new NotFoundException('Assessment not found');

    const questions = await this.questionRepo.find({ where: { assessmentId } });
    let correct = 0;
    for (const q of questions) {
      if (dto.answers[q.id] === q.correctAnswer) correct++;
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

  getResults(assessmentId: string, userId: string): Promise<AssessmentAttempt[]> {
    return this.attemptRepo.find({
      where: { assessmentId, userId },
      order: { completedAt: 'DESC' },
    });
  }

  async generateWithAI(courseTitle: string, topic: string, numQuestions: number, difficulty: string, assessmentId: string): Promise<AssessmentQuestion[]> {
    const generated = await this.aiService.generateQuiz(courseTitle, topic, numQuestions, difficulty);
    const questions: AssessmentQuestion[] = [];
    for (let i = 0; i < generated.length; i++) {
      const q = this.questionRepo.create({
        assessmentId,
        question: generated[i].question,
        options: generated[i].options,
        correctAnswer: generated[i].correctAnswer,
        explanation: generated[i].explanation,
        difficulty: difficulty as any,
        order: i,
      });
      questions.push(await this.questionRepo.save(q));
    }
    await this.assessmentRepo.update(assessmentId, { isAiGenerated: true });
    return questions;
  }
}
