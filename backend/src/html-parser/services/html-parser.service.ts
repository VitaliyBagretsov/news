import { BadRequestException, Injectable } from '@nestjs/common';
import { JSDOM } from 'jsdom';

import { HtmlReaderService } from '#html-reader';

import type { MediaParserConfig } from '../entities/index.js';
import {
  parseExternalCode,
  parseExternalId,
  parsePublicationDate,
} from '../strategies/index.js';
import type { ParsedImage, ParsedLink, ParsedNews } from '../types/index.js';
import { ParserConfigService } from './parser-config.service.js';

@Injectable()
export class HtmlParserService {
  constructor(
    private readonly htmlReader: HtmlReaderService,
    private readonly configService: ParserConfigService,
  ) {}

  getConfig(mediaId: number): Promise<MediaParserConfig> {
    return this.configService.findByMediaId(mediaId);
  }

  async discoverArticleUrls(
    mediaId: number,
    mediaUrl: string,
  ): Promise<string[]> {
    const config = await this.getConfig(mediaId);
    return this.discoverArticleUrlsWithConfig(mediaUrl, config);
  }

  async discoverArticleUrlsWithConfig(
    mediaUrl: string,
    config: MediaParserConfig,
  ): Promise<string[]> {
    const document = await this.readDocument(mediaUrl);

    return [
      ...new Set(
        Array.from(
          document.querySelectorAll<HTMLAnchorElement>(
            config.articleLinkSelector,
          ),
        )
          .map((item) => new URL(item.href, mediaUrl).href)
          .filter((url) => this.isAllowedUrl(url, mediaUrl, config)),
      ),
    ];
  }

  async parseArticle(
    mediaId: number,
    url: string,
    config?: MediaParserConfig,
  ): Promise<ParsedNews> {
    const parserConfig = config ?? (await this.getConfig(mediaId));
    const article = await this.readDocument(url);
    const externalCode = parseExternalCode(
      url,
      parserConfig.externalCodeStrategy,
    );

    return {
      news: {
        mediaId,
        externalId: parseExternalId(
          url,
          externalCode,
          parserConfig.externalIdStrategy,
        ),
        externalCode,
        date: parsePublicationDate(
          article.querySelector(parserConfig.dateSelector),
          parserConfig.publicationDateStrategy,
        ),
        header:
          article
            .querySelector(parserConfig.headerSelector)
            ?.textContent?.trim()
            .slice(0, 100) ?? '',
        summary: parserConfig.summarySelector
          ? (article
              .querySelector(parserConfig.summarySelector)
              ?.textContent?.trim() ?? '')
          : '',
        text: this.getText(article, parserConfig.textSelector),
        url,
      },
      links: this.getLinks(article, parserConfig.linkSelector),
      images: this.getImages(article, parserConfig.imageSelector),
    };
  }

  validateSelectors(config: MediaParserConfig | UpsertConfig): void {
    const document = new JSDOM('<html></html>').window.document;
    const selectors = [
      config.articleLinkSelector,
      config.headerSelector,
      config.dateSelector,
      config.summarySelector,
      config.textSelector,
      config.linkSelector,
      config.imageSelector,
    ];
    try {
      selectors
        .filter(Boolean)
        .forEach((selector) => document.querySelector(selector));
    } catch (error) {
      throw new BadRequestException(`Invalid CSS selector: ${String(error)}`);
    }
  }

  private async readDocument(url: string): Promise<Document> {
    return new JSDOM(await this.htmlReader.read(url), { url }).window.document;
  }

  private isAllowedUrl(
    url: string,
    mediaUrl: string,
    config: MediaParserConfig,
  ): boolean {
    if (config.excludedUrlPatterns.some((pattern) => url.includes(pattern)))
      return false;
    return (
      !config.sameHostOnly ||
      new URL(url).hostname === new URL(mediaUrl).hostname
    );
  }

  private getText(document: Document, selector: string): string {
    return Array.from(document.querySelectorAll(selector))
      .map((item) => item.textContent ?? '')
      .join('');
  }

  private getLinks(document: Document, selector: string | null): ParsedLink[] {
    if (!selector) return [];
    return Array.from(
      document.querySelectorAll<HTMLAnchorElement>(selector),
    ).map((element) => ({
      href: element.href,
      rel: element.rel,
      textContent: element.textContent ?? '',
    }));
  }

  private getImages(
    document: Document,
    selector: string | null,
  ): ParsedImage[] {
    if (!selector) return [];
    return Array.from(
      document.querySelectorAll<HTMLImageElement>(selector),
    ).map((element) => ({
      src: element.src,
      alt: element.alt,
    }));
  }
}

type UpsertConfig = Omit<MediaParserConfig, 'id' | 'mediaId'>;
