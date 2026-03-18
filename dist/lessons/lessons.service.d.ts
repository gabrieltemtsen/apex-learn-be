import { Repository } from 'typeorm';
import { Lesson } from '../entities/lesson.entity';
import { CreateLessonDto } from './dto/create-lesson.dto';
export declare class LessonsService {
    private lessonRepo;
    constructor(lessonRepo: Repository<Lesson>);
    findByCourse(courseId: string): Promise<Lesson[]>;
    findOne(id: string): Promise<Lesson>;
    create(dto: CreateLessonDto): Promise<Lesson>;
    update(id: string, dto: Partial<CreateLessonDto>): Promise<Lesson>;
    remove(id: string): Promise<void>;
    countByCourse(courseId: string): Promise<number>;
}
