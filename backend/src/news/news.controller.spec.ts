import { Test, TestingModule } from '@nestjs/testing';
import { CommonService } from '#common';
import { NewsController } from './news.controller.js';
import { NewsService } from './news.service.js';

describe('NewsController', () => {
  let controller: NewsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NewsController],
      providers: [
        { provide: NewsService, useValue: {} },
        { provide: CommonService, useValue: {} },
      ],
    }).compile();

    controller = module.get<NewsController>(NewsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
