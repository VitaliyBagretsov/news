import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Cron } from '@nestjs/schedule';
import { NewsCollectorService } from '#news-collector';

@Injectable()
export class TasksService implements OnApplicationBootstrap {
  private readonly logger = new Logger(TasksService.name);
  private collectionIsRunning = false;

  constructor(
    private readonly newsCollectorService: NewsCollectorService,
    private readonly configService: ConfigService,
  ) {}

  async onApplicationBootstrap(): Promise<void> {
    const runOnStart =
      this.configService.get<string>('PARSER_RUN_ON_START') ?? 'true';

    if (runOnStart === 'true') {
      setImmediate(() => void this.collectNews('startup'));
    }
  }

  @Cron('0 */5 * * * *', { name: 'news-collection' })
  async cronWriteNews(): Promise<void> {
    await this.collectNews('schedule');
  }

  private async collectNews(trigger: 'schedule' | 'startup'): Promise<void> {
    if (this.collectionIsRunning) {
      this.logger.warn(
        `Skipping ${trigger} run: collection is already running`,
      );
      return;
    }

    this.collectionIsRunning = true;

    try {
      this.logger.log(`Starting ${trigger} collection`);
      await this.newsCollectorService.collectActiveMedia();
    } finally {
      this.collectionIsRunning = false;
    }
  }
}
