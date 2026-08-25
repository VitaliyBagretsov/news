import { ConfigService } from '@nestjs/config';
import { jest } from '@jest/globals';
import { Test, TestingModule } from '@nestjs/testing';

import { AuthService } from './auth.service.js';

describe('AuthService', () => {
  it('is created with application configuration', async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: ConfigService, useValue: { getOrThrow: jest.fn() } },
      ],
    }).compile();

    expect(module.get(AuthService)).toBeDefined();
  });
});
