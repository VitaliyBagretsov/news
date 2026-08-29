import { Module } from '@nestjs/common';

import { HtmlParserModule } from '#html-parser';

import { NewsCollectorService } from './services/index.js';

@Module({
  imports: [HtmlParserModule],
  providers: [NewsCollectorService],
  exports: [NewsCollectorService],
})
export class NewsCollectorModule {}
