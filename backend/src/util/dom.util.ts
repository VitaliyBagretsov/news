import jsdom, { JSDOM } from 'jsdom';
import { getHtmlByFetch } from './api.util';
import { parserConfig } from '@constants/parser.constant';
import { IParseConfig } from '@config/types.config';
import { IParseNews } from '@types';
import { getImages, getLinks, getText } from './parse.util';

export const getDocuments = async (url: string): Promise<Document> => {
  return new JSDOM(await getHtmlByFetch(url)).window.document;
};

export const filterNews = (item, url) => {
  if (url.includes('rambler')) return true;
  if (item.includes('cnComments')) return false;
  return item.startsWith(url);
};

export const getActualListNewsLinks = async (mediaUrl: string) => {
  const document = await getDocuments(mediaUrl);
  const config = parserConfig.find((item) => mediaUrl.includes(item.baseUrl));

  const startLink = /^https:\/\//;

  return Array.from(document.querySelectorAll(config.selectors.news))
    .map(
      (item: HTMLAnchorElement) =>
        `${startLink.test(item.href) ? '' : mediaUrl}${item.href}`,
    )
    .filter((item) => filterNews(item, mediaUrl));
};

export const getNewsContent = async (url: string, config: IParseConfig, mediaId?: number): Promise<IParseNews> => {

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
      date: config.getDate(
        article.querySelector(config.selectors.date),
      ),
      header:
        article
          .querySelector(config.selectors.header)
          ?.textContent.substring(0, 99) ?? '',
      summary: article.querySelector(config.selectors.summary)
        ?.textContent,
      text,
      url,
    },
    links,
    images,
  };

}
