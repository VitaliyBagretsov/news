import { Module } from '@nestjs/common';
import { CommonService } from '@common/common.service';
import { NewsService } from './news.service';
import { NewsController } from './news.controller';

@Module({
  controllers: [NewsController],
  providers: [NewsService, CommonService,],
})
export class NewsModule {}
