import { LessonsService } from './lessons.service';
import { CreateLessonDto } from './dto/create-lesson.dto';
export declare class LessonsController {
    private lessonsService;
    constructor(lessonsService: LessonsService);
    findByCourse(courseId: string): Promise<import("../entities/lesson.entity").Lesson[]>;
    findOne(id: string): Promise<import("../entities/lesson.entity").Lesson>;
    create(dto: CreateLessonDto): Promise<import("../entities/lesson.entity").Lesson>;
    update(id: string, dto: Partial<CreateLessonDto>): Promise<import("../entities/lesson.entity").Lesson>;
    remove(id: string): Promise<void>;
}
