import { Controller, Get, Param, Query } from '@nestjs/common';
import { NewsService } from './news.service.js';

import { CommonService } from '#common';
import { News } from './entities/news.entity.js';

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
