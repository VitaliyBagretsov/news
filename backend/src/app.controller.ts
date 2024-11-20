import { Controller, Get, Query } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('test')
  test(@Query() query: Record<string, unknown>): any {
    return this.appService.test(query);
  }

  @Get('write-news')
  writeNews(@Query() query: Record<string, unknown>): any {
    return this.appService.writeNews(query.url as string);
  }
}
