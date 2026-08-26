import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Cron } from '@nestjs/schedule';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';

import { AppService } from './app.service.js';
import { Media } from './media/entities/index.js';

@Injectable()
export class TasksService implements OnApplicationBootstrap {
  private readonly logger = new Logger(TasksService.name);
  private collectionIsRunning = false;

  constructor(
    private readonly appService: AppService,
    private readonly configService: ConfigService,
    @InjectEntityManager()
    private readonly entityManager: EntityManager,
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
      const mediaList = await this.entityManager.findBy(Media, {
        isActive: true,
      });

      this.logger.log(
        `Starting ${trigger} collection for ${mediaList.length} source(s)`,
      );

      for (const media of mediaList) {
        try {
          await this.appService.writeNews(media.url, media.id);
        } catch (error) {
          this.logger.error(
            `Source collection failed for ${media.url}: ${String(error)}`,
          );
        }
      }
    } finally {
      this.collectionIsRunning = false;
    }
  }
}
