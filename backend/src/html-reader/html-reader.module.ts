import { Module } from '@nestjs/common';

import { HtmlReaderService } from './services/index.js';

@Module({
  providers: [HtmlReaderService],
  exports: [HtmlReaderService],
})
export class HtmlReaderModule {}
