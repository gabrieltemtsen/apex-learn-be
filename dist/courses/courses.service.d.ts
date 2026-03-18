import { Repository } from 'typeorm';
import { Course } from '../entities/course.entity';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
export declare class CoursesService {
    private courseRepo;
    constructor(courseRepo: Repository<Course>);
    findAll(filters: {
        tenantId?: string;
        category?: string;
        level?: string;
        search?: string;
    }): Promise<Course[]>;
    findOne(id: string): Promise<Course>;
    findBySlug(slug: string): Promise<Course>;
    create(dto: CreateCourseDto, instructorId: string): Promise<Course>;
    update(id: string, dto: UpdateCourseDto): Promise<Course>;
    remove(id: string): Promise<void>;
    publish(id: string): Promise<Course>;
    incrementEnrollment(courseId: string): Promise<void>;
    private generateSlug;
}
