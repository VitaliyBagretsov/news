import { AppService } from './app.service.js';
import { CommonService } from '#common';
import { parserConfig } from './constants/parser.constant.js';
import { Media } from './media/entities/index.js';
import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class TasksService {
  private readonly logger = new Logger(TasksService.name);
  private timerMitutes: number = 5;

  constructor(
    private readonly appService: AppService,
    private readonly commonService: CommonService,
  ) {}

  @Cron(`0 */5 * * * *`)
  async cronWriteNews() {
    const list = await this.commonService.getData<Media>('media', {
      filter: { isActive: true },
    });

    this.logger.debug(
      `Called every ${this.timerMitutes} minute for media: ${JSON.stringify(
        list.data.map((media) => media.url),
      )}`,
    );

    list.data.forEach((media: Media) => {
      if (parserConfig.find((item) => media.url.includes(item.baseUrl)))
        this.appService.writeNews(media.url, media.id);
    });
  }
}
