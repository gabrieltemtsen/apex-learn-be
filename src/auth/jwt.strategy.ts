import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import jwksRsa from 'jwks-rsa';
import { UsersService } from '../users/users.service';
import { TenantsService } from '../tenants/tenants.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private configService: ConfigService,
    private usersService: UsersService,
    private tenantsService: TenantsService,
  ) {
    const jwksUri =
      configService.get<string>('CLERK_JWKS_URI') ||
      'https://grown-lionfish-89.clerk.accounts.dev/.well-known/jwks.json';
    const issuer =
      configService.get<string>('CLERK_ISSUER') ||
      'https://grown-lionfish-89.clerk.accounts.dev';

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      issuer,
      algorithms: ['RS256'],
      ignoreExpiration: false,
      secretOrKeyProvider: jwksRsa.passportJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 10,
        jwksUri,
      }),
    });
  }

  async validate(payload: any) {
    // Clerk sub looks like: user_2abc123...
    const clerkUserId = payload?.sub as string | undefined;
    if (!clerkUserId) throw new UnauthorizedException('Invalid token');

    // Clerk puts email in session claims if configured.
    // Fall back to sub-based synthetic email if not present.
    const email =
      (payload?.email as string | undefined)?.toLowerCase() ||
      `${clerkUserId}@clerk.local`;

    const configuredTenantId = this.configService.get<string>('DEFAULT_TENANT_ID');
    const defaultTenantId =
      configuredTenantId || (await this.tenantsService.getOrCreateDefault());

    const user = await this.usersService.findOrCreateClerkUser({
      clerkUserId,
      email,
      firstName: payload?.given_name || payload?.first_name || 'User',
      lastName: payload?.family_name || payload?.last_name || '',
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
