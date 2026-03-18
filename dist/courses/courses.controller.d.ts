import { CoursesService } from './courses.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
export declare class CoursesController {
    private coursesService;
    constructor(coursesService: CoursesService);
    findAll(tenantId?: string, category?: string, level?: string, search?: string): Promise<import("../entities/course.entity").Course[]>;
    findOne(id: string): Promise<import("../entities/course.entity").Course>;
    create(dto: CreateCourseDto, req: any): Promise<import("../entities/course.entity").Course>;
    update(id: string, dto: UpdateCourseDto): Promise<import("../entities/course.entity").Course>;
    remove(id: string): Promise<void>;
    publish(id: string): Promise<import("../entities/course.entity").Course>;
}
