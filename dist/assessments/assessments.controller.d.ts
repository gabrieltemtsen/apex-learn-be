import { AssessmentsService } from './assessments.service';
import { CreateAssessmentDto } from './dto/create-assessment.dto';
import { SubmitAttemptDto } from './dto/submit-attempt.dto';
declare class GenerateAIDto {
    assessmentId: string;
    courseTitle: string;
    topic: string;
    numQuestions: number;
    difficulty: string;
}
export declare class AssessmentsController {
    private assessmentsService;
    constructor(assessmentsService: AssessmentsService);
    findByCourse(courseId: string): Promise<import("../entities/assessment.entity").Assessment[]>;
    findOne(id: string): Promise<import("../entities/assessment.entity").Assessment & {
        questions: import("../entities/assessment-question.entity").AssessmentQuestion[];
    }>;
    create(dto: CreateAssessmentDto): Promise<import("../entities/assessment.entity").Assessment>;
    update(id: string, dto: Partial<CreateAssessmentDto>): Promise<import("../entities/assessment.entity").Assessment>;
    generateAI(dto: GenerateAIDto): Promise<import("../entities/assessment-question.entity").AssessmentQuestion[]>;
    submitAttempt(id: string, dto: SubmitAttemptDto, req: any): Promise<import("../entities/assessment-attempt.entity").AssessmentAttempt>;
    getResults(id: string, req: any): Promise<import("../entities/assessment-attempt.entity").AssessmentAttempt[]>;
}
export {};
