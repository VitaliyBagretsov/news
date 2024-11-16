import { IParseConfig } from 'src/config/types.config';

export const parserConfig: IParseConfig[] = [
  {
    baseUrl: 'https://russian.rt.com',
    selectors: {
      news: '.listing__column_main-news a',
      header: '.article>.article__heading',
      date: '.article time',
      summary: '.article>.article__summary',
      text: '.article>.article__text>p',
      link: '.article__text a',
      image: '.article img',
    },
    externalCode: (url: string) => url.split('/').slice(-1)[0],
    externalId: (url: string) => url.split('/').slice(-1)[0].split('-')[0],
    getDate: (element: HTMLElement) => {
      if (!element) return new Date();
      return new Date(element.getAttribute('datetime')) || new Date();
    },
  },
  {
    baseUrl: 'https://www.rambler.ru',
    selectors: {
      news: '[data-head-desktop^="latest_news::item::"]',
      header: '#headline',
      date: 'a>time',
      // date: 'a[data-woman_media-desktop="date"]>time',
      // date: 'a[data-woman_media-desktop]>time',
      summary: 'div.fontSize_0 p',
      text: 'div.fontSize_0 p',
      link: 'div.fontSize_0 a',
      image: 'div.fontSize_0 img',
    },
    externalCode: (url: string) => url.split('/').slice(-2)[0],
    externalId: (url: string) => url.split('/').slice(-2)[0].split('-')[0],
    getDate: (element: HTMLElement) => {
      if (!element) return new Date();
      return new Date(element.getAttribute('datetime')) || new Date();
    },
  },
  {
    baseUrl: 'https://ria.ru',
    selectors: {
      news: '.cell-list__item-link',
      header: '.article__header>.article__title',
      date: '.article__info-date a',
      summary: '.article__header>.article__second-title',
      text: '.article__body>.article__block>.article__text',
    },
    externalCode: (url: string) =>
      url.split('/').slice(-1)[0].split('?')[0].replace('.html', ''),
    externalId: (url: string) =>
      url
        .split('/')
        .slice(-1)[0]
        .split('?')[0]
        .split('-')
        .slice(-1)[0]
        .replace('.html', ''),
    getDate: (element: HTMLElement) => {
      const strDate = element?.textContent;
      const date = strDate.split(' ')[1].split('.');
      const time = strDate.split(' ')[0];
      return (
        new Date(
          new Date(`${[date[2], date[1], date[0]].join('-')}T${time}:00`),
        ) || new Date()
      );
    },
  },
  {
    baseUrl: 'https://www.cnews.ru',
    selectors: {
      news: '.newstoplist ul li a',
      header: '.news_container h1',
      date: '.news_container .article-date-desktop',
      summary: '.news_container .Anonce>p',
      text: '.news_container>p',
      link: '.news_container a',
      image: '.news_container img',
    },
    externalCode: (url: string) => url.split('/').slice(-1)[0],
    externalId: (url: string) => url.split('/').slice(-1)[0],
    getDate: (element: HTMLElement) => {
      const strDate = element?.textContent;
      if (!strDate) return new Date();
      const dateElem = strDate?.split(' ');
      return (
        new Date(
          new Date(
            `${[dateElem[2], Month[dateElem[1]], dateElem[0]].join('-')}T${
              dateElem[3]
            }:00`,
          ),
        ) || new Date()
      );
    },
  },
];

const Month = {
  Января: '01',
  Февраля: '02',
  Марта: '03',
  Апреля: '04',
  Мая: '05',
  Июня: '06',
  Июля: '07',
  Августа: '08',
  Сентября: '09',
  Октября: 10,
  Ноября: 11,
  Декабря: 12,
};
