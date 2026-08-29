import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthModule } from '#auth';
import { HtmlReaderModule } from '#html-reader';
import { Media } from '#media/entities';

import { ParserConfigController } from './controllers/index.js';
import { MediaParserConfig } from './entities/index.js';
import { HtmlParserService, ParserConfigService } from './services/index.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([MediaParserConfig, Media]),
    HtmlReaderModule,
    AuthModule,
  ],
  controllers: [ParserConfigController],
  providers: [HtmlParserService, ParserConfigService],
  exports: [HtmlParserService, ParserConfigService],
})
export class HtmlParserModule {}
