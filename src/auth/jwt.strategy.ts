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
    const auth0Sub = payload?.sub as string | undefined;
    // Auth0 access tokens may not include email; fall back to sub-based email
    const email = (payload?.email as string | undefined)?.toLowerCase()
      || `${auth0Sub}@auth0.local`;

    if (!auth0Sub) throw new UnauthorizedException('Invalid token');

    const configuredTenantId = this.configService.get<string>('DEFAULT_TENANT_ID');
    const defaultTenantId =
      configuredTenantId || (await this.tenantsService.getOrCreateDefault());

    // Find or create user — handles auth0Sub, email linking, and first-time creation
    const user = await this.usersService.findOrCreateAuth0User({
      auth0Sub,
      email,
      firstName: payload?.given_name || payload?.name?.split(' ')?.[0] || 'User',
      lastName: payload?.family_name || payload?.name?.split(' ')?.[1] || '',
      tenantId: defaultTenantId,
    });

    if (!user.isActive) throw new UnauthorizedException('User disabled');

    return {
      sub: user.id,
      email: user.email,
      role: user.role,
      tenantId: user.tenantId,
    };
  }
}
