import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager, In } from 'typeorm';

import type { ICollectionResult, IParseConfig } from './config/types.config.js';
import { parserConfig } from './constants/parser.constant.js';
import { Image } from './entities/image.entity.js';
import { Link } from './entities/link.entity.js';
import { Log } from './entities/log.entity.js';
import { Media } from './media/entities/index.js';
import { News } from './news/entities/index.js';
import { getActualListNewsLinks, getNewsContent } from './util/dom.util.js';

@Injectable()
export class AppService {
  private readonly logger = new Logger(AppService.name);

  constructor(
    @InjectEntityManager()
    private readonly entityManager: EntityManager,
    private readonly configService: ConfigService,
  ) {}

  async writeNews(
    sourceUrl: string,
    mediaId?: number,
  ): Promise<ICollectionResult> {
    const normalizedSourceUrl = sourceUrl.replace(/\/+$/, '');
    const config = this.getParserConfig(normalizedSourceUrl);
    const targetMediaId =
      mediaId ??
      (
        await this.entityManager.findOneByOrFail(Media, {
          url: normalizedSourceUrl,
        })
      ).id;
    const maxArticles = this.getMaxArticlesPerRun();
    const articleUrls = (
      await getActualListNewsLinks(normalizedSourceUrl)
    ).slice(0, maxArticles);
    const externalCodes = articleUrls.map((url) => config.externalCode(url));
    const existingNews = externalCodes.length
      ? await this.entityManager.find(News, {
          select: { externalCode: true },
          where: {
            mediaId: targetMediaId,
            externalCode: In(externalCodes),
          },
        })
      : [];
    const existingCodes = new Set(
      existingNews.map((item) => item.externalCode),
    );
    const newUrls = articleUrls.filter(
      (url) => !existingCodes.has(config.externalCode(url)),
    );
    let added = 0;
    let failed = 0;

    for (const articleUrl of newUrls) {
      try {
        const parsed = await getNewsContent(articleUrl, config, targetMediaId);

        await this.entityManager.transaction(async (manager) => {
          const savedNews = await manager.save(News, parsed.news);
          const images = parsed.images
            .filter((image) => image.src)
            .map((image) => ({
              newsId: savedNews.id,
              newsUrl: savedNews.url,
              src: image.src,
              alt: image.alt ?? '',
            }));
          const links = parsed.links
            .filter((link) => link.href)
            .map((link) => ({
              newsId: savedNews.id,
              newsUrl: savedNews.url,
              href: link.href,
              rel: link.rel ?? '',
              textContent: link.textContent ?? '',
            }));

          if (images.length) await manager.insert(Image, images);
          if (links.length) await manager.insert(Link, links);
        });

        added += 1;
      } catch (error) {
        failed += 1;
        await this.logCollectionError(articleUrl, error);
      }
    }

    const result = {
      source: normalizedSourceUrl,
      discovered: articleUrls.length,
      added,
      skipped: articleUrls.length - newUrls.length,
      failed,
    };

    this.logger.log(`Collection finished: ${JSON.stringify(result)}`);

    return result;
  }

  private getParserConfig(sourceUrl: string): IParseConfig {
    const config = parserConfig.find((item) =>
      sourceUrl.includes(item.baseUrl),
    );

    if (!config) {
      throw new Error(`Parser config is not defined for ${sourceUrl}`);
    }

    return config;
  }

  private getMaxArticlesPerRun(): number {
    const configuredValue = Number(
      this.configService.get<string>('PARSER_MAX_ARTICLES_PER_RUN') ?? 20,
    );

    return Number.isInteger(configuredValue) && configuredValue > 0
      ? configuredValue
      : 20;
  }

  private async logCollectionError(url: string, error: unknown): Promise<void> {
    const message = error instanceof Error ? error.message : String(error);

    this.logger.error(`Failed to collect ${url}: ${message}`);

    try {
      await this.entityManager.insert(Log, {
        type: 'news collection error',
        value: `url=${url}; error=${message}`.slice(0, 250),
      });
    } catch (loggingError) {
      this.logger.error(
        `Failed to persist collection error: ${String(loggingError)}`,
      );
    }
  }
}
