import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,
  ) {}

  async findAll(tenantId?: string): Promise<User[]> {
    const where = tenantId ? { tenantId } : {};
    return this.userRepo.find({ where, relations: ['tenant'] });
  }

  async findOne(id: string): Promise<User> {
    const user = await this.userRepo.findOne({ where: { id }, relations: ['tenant'] });
    if (!user) throw new NotFoundException(`User ${id} not found`);
    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepo.findOne({ where: { email } });
  }

  async create(data: Partial<User>): Promise<User> {
    const user = this.userRepo.create(data);
    return this.userRepo.save(user);
  }

  async update(id: string, dto: UpdateUserDto): Promise<User> {
    await this.findOne(id);
    await this.userRepo.update(id, dto);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    await this.findOne(id);
    await this.userRepo.delete(id);
  }

  async updateRefreshToken(id: string, refreshToken: string | null): Promise<void> {
    await this.userRepo.update(id, { refreshToken: refreshToken ?? undefined });
  }

  async updateLastLogin(id: string): Promise<void> {
    await this.userRepo.update(id, { lastLoginAt: new Date() });
  }

  async updatePoints(id: string, points: number): Promise<void> {
    await this.userRepo.increment({ id }, 'points', points);
  }
}
