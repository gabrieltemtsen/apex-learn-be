import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Lesson } from '../entities/lesson.entity';
import { CreateLessonDto } from './dto/create-lesson.dto';

@Injectable()
export class LessonsService {
  constructor(
    @InjectRepository(Lesson)
    private lessonRepo: Repository<Lesson>,
  ) {}

  findByCourse(courseId: string): Promise<Lesson[]> {
    return this.lessonRepo.find({
      where: { courseId },
      order: { order: 'ASC' },
    });
  }

  async findOne(id: string): Promise<Lesson> {
    const lesson = await this.lessonRepo.findOne({ where: { id } });
    if (!lesson) throw new NotFoundException(`Lesson ${id} not found`);
    return lesson;
  }

  async create(dto: CreateLessonDto): Promise<Lesson> {
    const lesson = this.lessonRepo.create(dto);
    return this.lessonRepo.save(lesson);
  }

  async update(id: string, dto: Partial<CreateLessonDto>): Promise<Lesson> {
    await this.findOne(id);
    await this.lessonRepo.update(id, dto);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    await this.findOne(id);
    await this.lessonRepo.delete(id);
  }

  countByCourse(courseId: string): Promise<number> {
    return this.lessonRepo.count({ where: { courseId } });
  }
}
