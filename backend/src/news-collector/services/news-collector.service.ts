import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager, In } from 'typeorm';

import { HtmlParserService } from '#html-parser';
import { parseExternalCode } from '#html-parser/strategies';
import { Media } from '#media/entities';
import { News } from '#news/entities';

import { Image } from '../../entities/image.entity.js';
import { Link } from '../../entities/link.entity.js';
import { Log } from '../../entities/log.entity.js';
import type { CollectionResult } from '../types/index.js';

@Injectable()
export class NewsCollectorService {
  private readonly logger = new Logger(NewsCollectorService.name);

  constructor(
    @InjectEntityManager()
    private readonly entityManager: EntityManager,
    private readonly configService: ConfigService,
    private readonly htmlParser: HtmlParserService,
  ) {}

  async collectActiveMedia(): Promise<void> {
    const mediaList = await this.entityManager.findBy(Media, {
      isActive: true,
    });
    this.logger.log(`Starting collection for ${mediaList.length} source(s)`);

    for (const media of mediaList) {
      try {
        await this.collectMedia(media);
      } catch (error) {
        this.logger.error(
          `Source collection failed for ${media.url}: ${String(error)}`,
        );
      }
    }
  }

  async collectMedia(media: Media): Promise<CollectionResult> {
    const config = await this.htmlParser.getConfig(media.id);
    const articleUrls = (
      await this.htmlParser.discoverArticleUrlsWithConfig(media.url, config)
    ).slice(0, this.getMaxArticlesPerRun());
    const externalCodes = articleUrls.map((url) =>
      parseExternalCode(url, config.externalCodeStrategy),
    );
    const existingNews = externalCodes.length
      ? await this.entityManager.find(News, {
          select: { externalCode: true },
          where: { mediaId: media.id, externalCode: In(externalCodes) },
        })
      : [];
    const existingCodes = new Set(
      existingNews.map((item) => item.externalCode),
    );
    const newUrls = articleUrls.filter(
      (url) =>
        !existingCodes.has(parseExternalCode(url, config.externalCodeStrategy)),
    );
    let added = 0;
    let failed = 0;

    for (const articleUrl of newUrls) {
      try {
        const parsed = await this.htmlParser.parseArticle(
          media.id,
          articleUrl,
          config,
        );

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
      source: media.url,
      discovered: articleUrls.length,
      added,
      skipped: articleUrls.length - newUrls.length,
      failed,
    };
    this.logger.log(`Collection finished: ${JSON.stringify(result)}`);
    return result;
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
