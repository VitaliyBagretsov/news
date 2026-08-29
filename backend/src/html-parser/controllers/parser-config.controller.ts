import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Roles, RolesGuard, SessionAuthGuard } from '#auth';
import { Media } from '#media/entities';

import { UpsertParserConfigDto } from '../dto/index.js';
import { HtmlParserService, ParserConfigService } from '../services/index.js';

@Controller('media/:mediaId/parser-config')
@UseGuards(SessionAuthGuard, RolesGuard)
@Roles('admin')
export class ParserConfigController {
  constructor(
    private readonly parserConfigService: ParserConfigService,
    private readonly htmlParserService: HtmlParserService,
    @InjectRepository(Media)
    private readonly mediaRepository: Repository<Media>,
  ) {}

  @Get()
  findOne(@Param('mediaId', ParseIntPipe) mediaId: number) {
    return this.parserConfigService.findOptionalByMediaId(mediaId);
  }

  @Put()
  upsert(
    @Param('mediaId', ParseIntPipe) mediaId: number,
    @Body() input: UpsertParserConfigDto,
  ) {
    this.htmlParserService.validateSelectors(input);
    return this.parserConfigService.upsert(mediaId, input);
  }

  @Post('preview')
  async preview(
    @Param('mediaId', ParseIntPipe) mediaId: number,
    @Body() input: UpsertParserConfigDto,
  ) {
    this.htmlParserService.validateSelectors(input);
    const media = await this.mediaRepository.findOneByOrFail({ id: mediaId });
    const config = { id: 0, mediaId, ...input };
    const articleUrls =
      await this.htmlParserService.discoverArticleUrlsWithConfig(
        media.url,
        config,
      );
    const sample = articleUrls[0]
      ? await this.htmlParserService.parseArticle(
          mediaId,
          articleUrls[0],
          config,
        )
      : null;

    return { articleUrlsFound: articleUrls.length, sample };
  }
}
