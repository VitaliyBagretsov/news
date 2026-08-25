import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';

describe('AppController', () => {
  let appController: AppController;
  const appService = {
    test: (query: Record<string, unknown>) => query,
    writeNews: (url: string) => url,
  };

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [{ provide: AppService, useValue: appService }],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('test', () => {
    it('delegates query parameters to AppService', () => {
      const query = { url: 'https://example.com' };

      expect(appController.test(query)).toEqual(query);
    });
  });
});
