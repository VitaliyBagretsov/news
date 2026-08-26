import { JSDOM } from 'jsdom';
import { getHtmlByFetch } from './api.util.js';
import { IParseConfig } from '../config/types.config.js';
import { parserConfig } from '../constants/parser.constant.js';
import { IParseNews } from '../types/index.js';
import { getImages, getLinks, getText } from './parse.util.js';

export const getDocuments = async (url: string): Promise<Document> => {
  return new JSDOM(await getHtmlByFetch(url), { url }).window.document;
};

export const filterNews = (item: string, sourceUrl: string): boolean => {
  if (sourceUrl.includes('rambler')) return true;
  if (item.includes('cnComments')) return false;
  return new URL(item).hostname === new URL(sourceUrl).hostname;
};

export const getActualListNewsLinks = async (
  mediaUrl: string,
): Promise<string[]> => {
  const document = await getDocuments(mediaUrl);
  const config = parserConfig.find((item) => mediaUrl.includes(item.baseUrl));

  if (!config) throw new Error(`Parser config is not defined for ${mediaUrl}`);

  return [
    ...new Set(
      Array.from(document.querySelectorAll(config.selectors.news))
        .map((item: HTMLAnchorElement) => new URL(item.href, mediaUrl).href)
        .filter((item) => filterNews(item, mediaUrl)),
    ),
  ];
};

export const getNewsContent = async (
  url: string,
  config: IParseConfig,
  mediaId?: number,
): Promise<IParseNews> => {
  const article = await getDocuments(url);
  const externalCode = config.externalCode(url);
  const externalId = config.externalId(url);

  const text = getText(
    article as unknown as HTMLElement,
    config.selectors.text,
  );

  const links = getLinks(
    article as unknown as HTMLElement,
    config.selectors.link,
  );

  const images = getImages(
    article as unknown as HTMLElement,
    config.selectors.image,
  );

  return {
    news: {
      mediaId,
      externalId,
      externalCode,
      date: config.getDate(article.querySelector(config.selectors.date)),
      header:
        article
          .querySelector(config.selectors.header)
          ?.textContent.substring(0, 99) ?? '',
      summary:
        article.querySelector(config.selectors.summary)?.textContent?.trim() ??
        '',
      text,
      url,
    },
    links,
    images,
  };
};
