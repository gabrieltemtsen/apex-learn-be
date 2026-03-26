import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../users/users.service';
import { User, UserRole } from '../entities/user.entity';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async register(dto: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    tenantId?: string;
    role?: UserRole;
  }) {
    const user = await this.usersService.create(dto);
    const tokens = await this.generateTokens(user);
    await this.usersService.updateRefreshToken(user.id, tokens.refreshToken);
    return { user: this.sanitizeUser(user), ...tokens };
  }

  async login(email: string, password: string) {
    const user = await this.usersService.findByEmail(email.toLowerCase());
    if (!user || !user.isActive)
      throw new UnauthorizedException('Invalid credentials');
    if (!user.passwordHash)
      throw new UnauthorizedException(
        'Password login not available for this account',
      );

    const valid = await this.usersService.validatePassword(
      password,
      user.passwordHash,
    );
    if (!valid) throw new UnauthorizedException('Invalid credentials');

    await this.usersService.update(user.id, { lastLoginAt: new Date() });
    const tokens = await this.generateTokens(user);
    await this.usersService.updateRefreshToken(user.id, tokens.refreshToken);
    return { user: this.sanitizeUser(user), ...tokens };
  }

  async loginWithGoogle(profile: {
    googleId: string;
    email: string;
    firstName: string;
    lastName: string;
    avatarUrl?: string;
  }) {
    const email = profile.email?.toLowerCase();
    if (!email) throw new BadRequestException('Google profile missing email');

    const defaultTenantId = this.configService.get<string>('DEFAULT_TENANT_ID');

    let user = await this.usersService.findByEmail(email);
    if (!user) {
      user = await this.usersService.create({
        email,
        firstName: profile.firstName,
        lastName: profile.lastName,
        avatarUrl: profile.avatarUrl,
        tenantId: defaultTenantId,
        passwordHash: undefined,
        role: UserRole.LEARNER,
      });
    }

    // Update markers + basic profile refresh
    user = await this.usersService.update(user.id, {
      googleId: profile.googleId,
      isGoogleAuth: true,
      avatarUrl: profile.avatarUrl ?? user.avatarUrl,
      lastLoginAt: new Date(),
    });

    const tokens = await this.generateTokens(user);
    await this.usersService.updateRefreshToken(user.id, tokens.refreshToken);

    return { user: this.sanitizeUser(user), ...tokens };
  }

  async refresh(userId: string, refreshToken: string) {
    const user = await this.usersService.findOne(userId);
    if (!user || !user.refreshToken)
      throw new UnauthorizedException('Access denied');
    const valid = await bcrypt.compare(refreshToken, user.refreshToken);
    if (!valid) throw new UnauthorizedException('Access denied');
    const tokens = await this.generateTokens(user);
    await this.usersService.updateRefreshToken(user.id, tokens.refreshToken);
    return tokens;
  }

  async logout(userId: string) {
    await this.usersService.updateRefreshToken(userId, null);
    return { message: 'Logged out' };
  }

  async getMe(userId: string) {
    const user = await this.usersService.findOne(userId);
    return this.sanitizeUser(user);
  }

  private async generateTokens(user: User) {
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
      tenantId: user.tenantId,
    };
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.configService.get('JWT_SECRET'),
        expiresIn: '15m',
      }),
      this.jwtService.signAsync(payload, {
        secret: this.configService.get('JWT_REFRESH_SECRET'),
        expiresIn: '7d',
      }),
    ]);
    return { accessToken, refreshToken };
  }

  async forgotPassword(email: string): Promise<void> {
    const user = await this.usersService.findByEmail(email);
    if (!user) return; // Silent — don't reveal if email exists

    const token = require('crypto').randomBytes(32).toString('hex');
    const expires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
    await this.usersService.setResetToken(user.id, token, expires);

    const frontendUrl =
      this.configService.get('FRONTEND_URL') || 'http://localhost:3000';
    const resetUrl = `${frontendUrl}/reset-password?token=${token}`;

    const { Resend } = require('resend');
    const resend = new Resend(this.configService.get('RESEND_API_KEY'));

    await resend.emails.send({
      from: 'ApexLearn <noreply@apexlearn.ng>',
      to: user.email,
      subject: 'Reset your ApexLearn password',
      html: `
        <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:32px;">
          <h2 style="color:#4f46e5;">Reset Your Password</h2>
          <p>Hi ${user.firstName},</p>
          <p>We received a request to reset your password. Click the button below to set a new one:</p>
          <a href="${resetUrl}" style="display:inline-block;background:#4f46e5;color:white;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600;margin:16px 0;">Reset Password</a>
          <p style="color:#6b7280;font-size:14px;">This link expires in 1 hour. If you didn't request this, you can safely ignore this email.</p>
          <p style="color:#6b7280;font-size:12px;">Or copy this link: ${resetUrl}</p>
        </div>
      `,
    });
  }

  async resetPassword(token: string, newPassword: string): Promise<void> {
    const user = await this.usersService.findByResetToken(token);
    if (!user || !user.resetPasswordExpires) {
      throw new BadRequestException('Invalid or expired reset token');
    }
    if (user.resetPasswordExpires < new Date()) {
      throw new BadRequestException('Reset token has expired');
    }
    const bcryptLib = require('bcryptjs');
    const passwordHash = await bcryptLib.hash(newPassword, 10);
    await this.usersService.update(user.id, { passwordHash });
    await this.usersService.clearResetToken(user.id);
  }

  async seedAdmin(
    secret: string,
    data: {
      firstName: string;
      lastName: string;
      email: string;
      password: string;
    },
  ): Promise<object> {
    const expectedSecret = this.configService.get('ADMIN_SEED_SECRET');
    if (!expectedSecret || secret !== expectedSecret) {
      throw new Error('Invalid seed secret');
    }
    // Only works if no super admin exists yet
    const existing = await this.usersService.findByEmail(data.email);
    if (existing) {
      // Promote existing user to super admin
      await this.usersService.update(existing.id, {
        role: UserRole.SUPER_ADMIN,
      });
      return {
        message: 'Existing user promoted to SUPER_ADMIN',
        email: existing.email,
      };
    }
    const user = await this.usersService.create({
      ...data,
      role: UserRole.SUPER_ADMIN,
    });
    return { message: 'Super admin created', email: user.email };
  }

  private sanitizeUser(user: User) {
    const { passwordHash, refreshToken, ...safe } = user;
    return safe;
  }
}
