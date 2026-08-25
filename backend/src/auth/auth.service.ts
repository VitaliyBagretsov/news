import {
  Injectable,
  Logger,
  ServiceUnavailableException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { Request } from 'express';
import type { Session } from 'express-session';
import * as oidc from 'openid-client';

import type { AuthenticatedUser, OidcTokens } from './auth-session.types.js';
import type { LoginDto } from './dto/login.dto.js';

type KeycloakResourceAccess = Record<string, { roles?: unknown }>;

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  private configuration?: Promise<oidc.Configuration>;

  constructor(private readonly configService: ConfigService) {}

  async login(
    credentials: LoginDto,
    request: Request,
  ): Promise<AuthenticatedUser> {
    const config = await this.getConfiguration();
    try {
      const tokens = await oidc.genericGrantRequest(config, 'password', {
        username: credentials.username,
        password: credentials.password,
        scope: 'openid profile email',
      });
      const user = await this.createUser(
        config,
        tokens.access_token,
        tokens.claims(),
      );

      await this.regenerateSession(request.session);
      request.session.auth = {
        user,
        tokens: this.createStoredTokens(tokens),
      };
      await this.saveSession(request.session);
      return user;
    } catch (error) {
      throw new UnauthorizedException('Invalid username or password', {
        cause: error,
      });
    }
  }

  async authenticate(request: Request): Promise<AuthenticatedUser> {
    const auth = request.session.auth;
    if (!auth) {
      throw new UnauthorizedException('Authentication is required');
    }

    if (auth.tokens.expiresAt <= Date.now() + 30_000) {
      await this.refresh(request);
    }

    request.user = request.session.auth?.user;
    if (!request.user) {
      throw new UnauthorizedException('Authentication session is invalid');
    }

    return request.user;
  }

  async logout(request: Request): Promise<void> {
    const refreshToken = request.session.auth?.tokens.refreshToken;
    try {
      if (refreshToken) {
        await oidc.tokenRevocation(
          await this.getConfiguration(),
          refreshToken,
          { token_type_hint: 'refresh_token' },
        );
      }
    } catch (error) {
      this.logger.warn(
        'Keycloak token revocation failed; local session removed',
      );
      this.logger.debug(error);
    } finally {
      await this.destroySession(request.session);
    }
  }

  private async refresh(request: Request): Promise<void> {
    const refreshToken = request.session.auth?.tokens.refreshToken;
    if (!refreshToken) {
      await this.destroySession(request.session);
      throw new UnauthorizedException('Authentication session has expired');
    }

    try {
      const config = await this.getConfiguration();
      const tokens = await oidc.refreshTokenGrant(config, refreshToken);
      const previous = request.session.auth;
      if (!previous) throw new Error('Session was removed during refresh');

      request.session.auth = {
        user: await this.createUser(
          config,
          tokens.access_token,
          tokens.claims(),
        ),
        tokens: this.createStoredTokens(tokens, previous.tokens),
      };
      await this.saveSession(request.session);
    } catch (error) {
      await this.destroySession(request.session);
      throw new UnauthorizedException('Authentication session has expired', {
        cause: error,
      });
    }
  }

  private async createUser(
    config: oidc.Configuration,
    accessToken: string,
    idTokenClaims: Record<string, unknown> | undefined,
  ): Promise<AuthenticatedUser> {
    const introspection = await oidc.tokenIntrospection(config, accessToken);
    if (!introspection.active) {
      throw new UnauthorizedException('Keycloak returned an inactive token');
    }

    const claims: Record<string, unknown> = {
      ...introspection,
      ...idTokenClaims,
      resource_access:
        (introspection as Record<string, unknown>).resource_access ??
        idTokenClaims?.resource_access,
    };
    if (!claims || typeof claims.sub !== 'string') {
      throw new UnauthorizedException('Keycloak returned an invalid ID token');
    }

    const resourceAccess = claims.resource_access as
      KeycloakResourceAccess | undefined;
    const clientRoles =
      resourceAccess?.[this.getRequired('KEYCLOAK_CLIENT_ID')]?.roles;

    return {
      sub: claims.sub,
      username:
        typeof claims.preferred_username === 'string'
          ? claims.preferred_username
          : claims.sub,
      email: typeof claims.email === 'string' ? claims.email : undefined,
      name: typeof claims.name === 'string' ? claims.name : undefined,
      roles: Array.isArray(clientRoles)
        ? clientRoles.filter((role): role is string => typeof role === 'string')
        : [],
    };
  }

  private createStoredTokens(
    tokens: {
      access_token: string;
      refresh_token?: string;
      id_token?: string;
      expiresIn(): number | undefined;
    },
    previous?: OidcTokens,
  ): OidcTokens {
    return {
      accessToken: tokens.access_token,
      refreshToken: tokens.refresh_token ?? previous?.refreshToken,
      idToken: tokens.id_token ?? previous?.idToken,
      expiresAt: Date.now() + (tokens.expiresIn() ?? 60) * 1000,
    };
  }

  private getConfiguration(): Promise<oidc.Configuration> {
    this.configuration ??= this.discoverConfiguration();
    return this.configuration;
  }

  private async discoverConfiguration(): Promise<oidc.Configuration> {
    try {
      const issuer = new URL(this.getRequired('KEYCLOAK_ISSUER_URL'));
      const discoveryOptions =
        issuer.protocol === 'http:'
          ? { execute: [oidc.allowInsecureRequests] }
          : undefined;
      const config = await oidc.discovery(
        issuer,
        this.getRequired('KEYCLOAK_CLIENT_ID'),
        { client_secret: this.getRequired('KEYCLOAK_CLIENT_SECRET') },
        oidc.ClientSecretPost(this.getRequired('KEYCLOAK_CLIENT_SECRET')),
        discoveryOptions,
      );
      return config;
    } catch (error) {
      this.configuration = undefined;
      throw new ServiceUnavailableException('Keycloak is unavailable', {
        cause: error,
      });
    }
  }

  private getRequired(name: string): string {
    return this.configService.getOrThrow<string>(name);
  }

  private saveSession(session: Session): Promise<void> {
    return new Promise((resolve, reject) =>
      session.save((error) => (error ? reject(error) : resolve())),
    );
  }

  private regenerateSession(session: Session): Promise<void> {
    return new Promise((resolve, reject) =>
      session.regenerate((error) => (error ? reject(error) : resolve())),
    );
  }

  private destroySession(session: Session): Promise<void> {
    return new Promise((resolve, reject) =>
      session.destroy((error) => (error ? reject(error) : resolve())),
    );
  }
}
