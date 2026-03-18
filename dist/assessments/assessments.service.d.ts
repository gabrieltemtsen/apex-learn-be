import { Repository } from 'typeorm';
import { Assessment } from '../entities/assessment.entity';
import { AssessmentQuestion } from '../entities/assessment-question.entity';
import { AssessmentAttempt } from '../entities/assessment-attempt.entity';
import { CreateAssessmentDto } from './dto/create-assessment.dto';
import { SubmitAttemptDto } from './dto/submit-attempt.dto';
import { UsersService } from '../users/users.service';
import { AiService } from '../ai/ai.service';
export declare class AssessmentsService {
    private assessmentRepo;
    private questionRepo;
    private attemptRepo;
    private usersService;
    private aiService;
    constructor(assessmentRepo: Repository<Assessment>, questionRepo: Repository<AssessmentQuestion>, attemptRepo: Repository<AssessmentAttempt>, usersService: UsersService, aiService: AiService);
    findByCourse(courseId: string): Promise<Assessment[]>;
    findOne(id: string): Promise<Assessment & {
        questions: AssessmentQuestion[];
    }>;
    create(dto: CreateAssessmentDto): Promise<Assessment>;
    update(id: string, dto: Partial<CreateAssessmentDto>): Promise<Assessment>;
    submitAttempt(assessmentId: string, userId: string, dto: SubmitAttemptDto): Promise<AssessmentAttempt>;
    getResults(assessmentId: string, userId: string): Promise<AssessmentAttempt[]>;
    generateWithAI(courseTitle: string, topic: string, numQuestions: number, difficulty: string, assessmentId: string): Promise<AssessmentQuestion[]>;
}
