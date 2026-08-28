export interface AuthUser {
  sub: string;
  username: string;
  email?: string;
  name?: string;
  roles: string[];
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface AuthenticatedSession {
  authenticated: true;
  user: AuthUser;
}

export interface AnonymousSession {
  authenticated: false;
}
