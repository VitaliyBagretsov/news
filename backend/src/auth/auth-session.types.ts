export interface AuthenticatedUser {
  sub: string;
  username: string;
  email?: string;
  name?: string;
  roles: string[];
}

export interface OidcTokens {
  accessToken: string;
  refreshToken?: string;
  idToken?: string;
  expiresAt: number;
}

export interface NewsSessionData {
  auth?: {
    user: AuthenticatedUser;
    tokens: OidcTokens;
  };
}

declare module 'express-session' {
  interface SessionData {
    auth?: NewsSessionData['auth'];
  }
}

declare module 'express-serve-static-core' {
  interface Request {
    user?: AuthenticatedUser;
  }
}
