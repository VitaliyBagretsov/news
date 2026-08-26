import { Test, TestingModule } from '@nestjs/testing';
import { jest } from '@jest/globals';
import type { Request, Response } from 'express';

import { AuthController } from './auth.controller.js';
import { AuthService } from './auth.service.js';
import { SessionAuthGuard } from './guards/session-auth.guard.js';

describe('AuthController', () => {
  let controller: AuthController;
  const authService = {
    login: jest.fn(async () => ({
      sub: '1',
      username: 'reader',
      roles: ['user'],
    })),
    logout: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        { provide: AuthService, useValue: authService },
        { provide: SessionAuthGuard, useValue: { canActivate: () => true } },
      ],
    }).compile();

    controller = module.get(AuthController);
  });

  it('returns a safe user profile after login', async () => {
    const request = { session: {} } as Request;
    await expect(
      controller.login({ username: 'reader', password: 'secret' }, request),
    ).resolves.toEqual({
      authenticated: true,
      user: { sub: '1', username: 'reader', roles: ['user'] },
    });
    expect(authService.login).toHaveBeenCalledWith(
      { username: 'reader', password: 'secret' },
      request,
    );
  });

  it('never exposes tokens in the session response', () => {
    const request = {
      user: { sub: '1', username: 'reader', roles: ['user'] },
    } as Request;

    expect(controller.session(request)).toEqual({
      authenticated: true,
      user: request.user,
    });
  });

  it('clears the session cookie on logout', async () => {
    const request = { session: {} } as Request;
    const response = { clearCookie: jest.fn() } as unknown as Response;

    await expect(controller.logout(request, response)).resolves.toEqual({
      authenticated: false,
    });
    expect(response.clearCookie).toHaveBeenCalledWith('news_session', {
      path: '/',
    });
  });
});
