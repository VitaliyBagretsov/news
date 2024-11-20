import { Controller, Get, Param, Query } from '@nestjs/common';
import { NewsService } from './news.service';

import { CommonService } from '@common/common.service';
import { News } from './entities/news.entity';

@Controller('news')
export class NewsController {
  constructor(
    private readonly newsService: NewsService,
    private readonly commonService: CommonService,
  ) {}

  @Get()
  find(@Query() query: Record<string, unknown>) {
    return this.commonService.getData<News>('news', query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.newsService.findOne(+id);
  }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.newsService.remove(+id);
  // }
}
