import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { Course } from '../entities/course.entity';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';

@Injectable()
export class CoursesService {
  constructor(
    @InjectRepository(Course)
    private courseRepo: Repository<Course>,
  ) {}

  async findAll(filters: { tenantId?: string; category?: string; level?: string; search?: string }): Promise<Course[]> {
    const where: any = {};
    if (filters.tenantId) where.tenantId = filters.tenantId;
    if (filters.category) where.category = filters.category;
    if (filters.level) where.level = filters.level;
    if (filters.search) where.title = Like(`%${filters.search}%`);

    return this.courseRepo.find({
      where,
      relations: ['instructor', 'tenant'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Course> {
    const course = await this.courseRepo.findOne({
      where: { id },
      relations: ['instructor', 'tenant'],
    });
    if (!course) throw new NotFoundException(`Course ${id} not found`);
    return course;
  }

  async findBySlug(slug: string): Promise<Course> {
    const course = await this.courseRepo.findOne({
      where: { slug },
      relations: ['instructor', 'tenant'],
    });
    if (!course) throw new NotFoundException(`Course with slug ${slug} not found`);
    return course;
  }

  async create(dto: CreateCourseDto, instructorId: string): Promise<Course> {
    const slug = dto.slug || this.generateSlug(dto.title);
    const course = this.courseRepo.create({ ...dto, instructorId, slug });
    return this.courseRepo.save(course);
  }

  async update(id: string, dto: UpdateCourseDto): Promise<Course> {
    await this.findOne(id);
    await this.courseRepo.update(id, dto);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    await this.findOne(id);
    await this.courseRepo.delete(id);
  }

  async publish(id: string): Promise<Course> {
    await this.findOne(id);
    await this.courseRepo.update(id, { isPublished: true });
    return this.findOne(id);
  }

  async incrementEnrollment(courseId: string): Promise<void> {
    await this.courseRepo.increment({ id: courseId }, 'enrollmentCount', 1);
  }

  private generateSlug(title: string): string {
    return title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') + '-' + Date.now();
  }
}
