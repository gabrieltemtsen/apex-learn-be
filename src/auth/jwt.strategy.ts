import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import jwksRsa from 'jwks-rsa';
import { UsersService } from '../users/users.service';
import { TenantsService } from '../tenants/tenants.service';
import { UserRole } from '../entities/user.entity';

// Auth0-backed JWT strategy (RS256, JWKS)
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private configService: ConfigService,
    private usersService: UsersService,
    private tenantsService: TenantsService,
  ) {
    const domain = configService.get<string>('AUTH0_DOMAIN');
    const audience = configService.get<string>('AUTH0_AUDIENCE');
    const issuer = domain ? `https://${domain}/` : undefined;

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      audience,
      issuer,
      algorithms: ['RS256'],
      // Use jwks-rsa.passportJwtSecret — handles kid extraction from raw JWT correctly
      secretOrKeyProvider: jwksRsa.passportJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: `https://${domain}/.well-known/jwks.json`,
      }),
    });
  }

  async validate(payload: any) {
    const sub = payload?.sub as string | undefined;
    const email = (payload?.email as string | undefined)?.toLowerCase();

    if (!sub) throw new UnauthorizedException('Invalid token');

    // Find or create user
    let user = email ? await this.usersService.findByEmail(email) : null;

    const configuredTenantId = this.configService.get<string>('DEFAULT_TENANT_ID');
    const defaultTenantId =
      configuredTenantId || (await this.tenantsService.getOrCreateDefault());

    if (!user) {
      user = await this.usersService.create({
        email: email || `${sub}@auth0.local`,
        firstName: payload?.given_name || 'NRSA',
        lastName: payload?.family_name || 'User',
        tenantId: defaultTenantId,
        passwordHash: null,
        role: UserRole.LEARNER,
      });
    }

    // Persist Auth0 subject
    if (!user.auth0Sub || user.auth0Sub !== sub) {
      await this.usersService.update(user.id, { auth0Sub: sub });
    }

    if (!user.isActive) throw new UnauthorizedException('User disabled');

    return {
      sub: user.id,
      email: user.email,
      role: user.role,
      tenantId: user.tenantId,
    };
  }
}
