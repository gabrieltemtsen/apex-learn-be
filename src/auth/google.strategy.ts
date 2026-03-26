import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { Strategy, Profile } from 'passport-google-oauth20';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(private config: ConfigService) {
    const clientID = config.get<string>('GOOGLE_CLIENT_ID');
    const clientSecret = config.get<string>('GOOGLE_CLIENT_SECRET');

    // Passport's OAuth2Strategy throws at startup if clientID is missing.
    // We provide dummy values so the API can boot even when Google OAuth isn't configured.
    // The GoogleAuthGuard blocks the /auth/google routes unless real env vars are set.
    super({
      clientID: clientID || 'DUMMY_GOOGLE_CLIENT_ID',
      clientSecret: clientSecret || 'DUMMY_GOOGLE_CLIENT_SECRET',
      callbackURL:
        config.get<string>('GOOGLE_CALLBACK_URL') ||
        'http://localhost:3001/auth/google/callback',
      scope: ['email', 'profile'],
    });
  }

  validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: (err: any, user?: any) => void,
  ) {
    const email = profile.emails?.[0]?.value?.toLowerCase();
    const firstName =
      profile.name?.givenName || profile.displayName?.split(' ')?.[0] || 'User';
    const lastName =
      profile.name?.familyName ||
      profile.displayName?.split(' ')?.slice(1).join(' ') ||
      '';
    const avatarUrl = profile.photos?.[0]?.value;

    done(null, {
      googleId: profile.id,
      email,
      firstName,
      lastName,
      avatarUrl,
    });
  }
}
