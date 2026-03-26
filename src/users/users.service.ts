import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserRole } from '../entities/user.entity';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private repo: Repository<User>) {}

  async findAll(tenantId?: string) {
    const where = tenantId ? { tenantId } : {};
    return this.repo.find({
      where,
      select: [
        'id',
        'firstName',
        'lastName',
        'email',
        'role',
        'avatarUrl',
        'isActive',
        'createdAt',
        'points',
        'streak',
      ],
    });
  }

  async findOne(id: string) {
    const user = await this.repo.findOne({ where: { id } });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async findByEmail(email: string) {
    return this.repo.findOne({ where: { email } });
  }

  async create(data: {
    firstName: string;
    lastName: string;
    email: string;
    password?: string;
    passwordHash?: string | null;
    role?: UserRole;
    tenantId?: string;
    avatarUrl?: string;
  }) {
    const existing = await this.findByEmail(data.email);
    if (existing) throw new ConflictException('Email already registered');
    let passwordHash = data.passwordHash;
    if (!passwordHash && data.password) {
      passwordHash = await bcrypt.hash(data.password, 12);
    }
    const { password, ...rest } = data;
    const user = this.repo.create({ ...rest, passwordHash });
    return this.repo.save(user);
  }

  async update(id: string, data: Partial<User>) {
    await this.repo.update(id, data);
    return this.findOne(id);
  }

  async updateRefreshToken(id: string, refreshToken: string | null) {
    const hashed = refreshToken ? await bcrypt.hash(refreshToken, 10) : null;
    await this.repo.update(id, { refreshToken: hashed ?? undefined });
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.repo.delete(id);
    return { message: 'User deleted' };
  }

  async validatePassword(plain: string, hashed: string | null | undefined) {
    if (!hashed) return false;
    return bcrypt.compare(plain, hashed);
  }

  async updateLastLogin(id: string) {
    await this.repo.update(id, { lastLoginAt: new Date() });
  }

  async updatePoints(id: string, points: number) {
    await this.repo.increment({ id }, 'points', points);
  }

  async getTopByPoints(limit = 50): Promise<Partial<User>[]> {
    return this.repo.find({
      where: { isActive: true },
      select: [
        'id',
        'firstName',
        'lastName',
        'avatarUrl',
        'role',
        'points',
        'streak',
        'createdAt',
      ],
      order: { points: 'DESC' },
      take: limit,
    });
  }

  async findByResetToken(token: string): Promise<User | null> {
    return this.repo.findOne({ where: { resetPasswordToken: token } });
  }

  async setResetToken(
    userId: string,
    token: string,
    expires: Date,
  ): Promise<void> {
    await this.repo.update(userId, {
      resetPasswordToken: token,
      resetPasswordExpires: expires,
    });
  }

  async clearResetToken(userId: string): Promise<void> {
    await this.repo.update(userId, {
      resetPasswordToken: null as any,
      resetPasswordExpires: null as any,
    });
  }
}
