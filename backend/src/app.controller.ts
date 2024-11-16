import { Body, Controller, Delete, Get, Param, Post, Query } from '@nestjs/common';
import { AppService } from './app.service';
import { CreateMediaDto } from '@dto/media.dto';
import { QueryDto } from '@dto/query.dto';
import { Media } from '@entities/media.entity';
import { QueryResult } from '@types';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
  ) {}

  @Get('test')
  test(@Query() query: Record<string, unknown>): any {
    return this.appService.test(query);
  }

  @Get('write-news')
  writeNews(@Query() query: Record<string, unknown>): any {
    return this.appService.writeNews(query.url as string);
  }

  @Get(':entity')
  getEntity(
    @Param('entity') entityName: string,
    @Query() query: Record<string, unknown>,
  ): Promise<QueryResult> {
    return this.appService.getEntity(entityName, query);
  }

  @Post(':entity')
  postEntity(
    @Param('entity') entityName: string,
    @Body() body: Record<string, unknown>[],
  ): Promise<Record<string, unknown>[]> {
    return this.appService.postEntity(entityName, body);
  }

  @Delete(':entity')
  removeEntity(
    @Param('entity') entityName: string,
    @Body() body: Record<string, unknown>[],
  ): Promise<Record<string, unknown>[]> {
    return this.appService.removeEntity(entityName, body);
  }
}
