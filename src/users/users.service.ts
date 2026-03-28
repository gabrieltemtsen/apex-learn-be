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

  async findByAuth0Sub(auth0Sub: string) {
    return this.repo.findOne({ where: { auth0Sub } });
  }

  async findOrCreateAuth0User(data: {
    auth0Sub: string;
    email: string;
    firstName: string;
    lastName: string;
    tenantId?: string;
  }): Promise<User> {
    // 1. Try by auth0Sub (most reliable — no email needed)
    let user = await this.findByAuth0Sub(data.auth0Sub);
    if (user) return user;

    // 2. Try by email (link existing account)
    if (data.email && !data.email.includes('@auth0.local')) {
      user = await this.findByEmail(data.email);
      if (user) {
        await this.repo.update(user.id, { auth0Sub: data.auth0Sub });
        return this.findOne(user.id);
      }
    }

    // 3. Create new user (no ConflictException — guarded above)
    const newUser = this.repo.create({
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
      tenantId: data.tenantId,
      passwordHash: null,
      role: UserRole.LEARNER,
      auth0Sub: data.auth0Sub,
    });
    return this.repo.save(newUser);
  }

  async findOrCreateClerkUser(dto: {
    clerkUserId: string;
    email: string;
    firstName: string;
    lastName: string;
    tenantId: string;
  }) {
    const email = dto.email.toLowerCase();
    const isSyntheticEmail = email.endsWith('@clerk.local');

    // 1. Find by Clerk user ID (fastest — always unique)
    let user = await this.repo.findOne({ where: { auth0Sub: dto.clerkUserId } });
    if (user) return user;

    // 2. Find by real email (link existing account to Clerk)
    if (!isSyntheticEmail) {
      user = await this.repo.findOne({ where: { email } });
      if (user) {
        if (!user.auth0Sub) {
          await this.repo.update(user.id, { auth0Sub: dto.clerkUserId });
        }
        return this.repo.findOne({ where: { id: user.id } }) as Promise<User>;
      }
    }

    // 3. Create new user — handle race condition (concurrent first-login)
    try {
      const newUser = this.repo.create({
        auth0Sub: dto.clerkUserId,
        email,
        firstName: dto.firstName && dto.firstName !== 'User' ? dto.firstName : 'User',
        lastName: dto.lastName ?? '',
        tenantId: dto.tenantId,
        isActive: true,
        passwordHash: null,
        role: UserRole.LEARNER,
      });
      return await this.repo.save(newUser);
    } catch (err: any) {
      // Unique constraint violation — concurrent request already created the user
      if (err?.code === '23505') {
        const existing = await this.repo.findOne({
          where: [{ auth0Sub: dto.clerkUserId }, { email }],
        });
        if (existing) return existing;
      }
      throw err;
    }
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
