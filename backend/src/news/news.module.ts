import { Module } from '@nestjs/common';
import { CommonService } from '#common';
import { NewsService } from './news.service.js';
import { NewsController } from './news.controller.js';

@Module({
  controllers: [NewsController],
  providers: [NewsService, CommonService],
})
export class NewsModule {}
