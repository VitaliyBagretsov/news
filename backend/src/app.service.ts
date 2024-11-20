import { Injectable } from '@nestjs/common';

import { getActualListNewsLinks, getNewsContent } from './util/dom.util';
import { InjectEntityManager } from '@nestjs/typeorm';

import { EntityManager } from 'typeorm';
import { CommonService } from '@common/common.service';
import { ENTITY_LIST } from '@constants/news.const';
import { parserConfig } from '@constants/parser.constant';
import { Media } from '@media/entities/media.entity';
import { News } from '@news/entities/news.entity';

@Injectable()
export class AppService {
  constructor(
    @InjectEntityManager()
    private entityManager: EntityManager,
    private readonly commonService: CommonService,
  ) {}

  async test(query: any) {
    let { url } = query;
    const config = parserConfig.find((item) => url.includes(item.baseUrl));

    if (url.slice(-1) !== '/') url += '/';

    const arrayLinks = await getActualListNewsLinks(url);

    const { data: media } = await this.commonService.getData<Media>('media', {
      filter: {
        url,
      },
    });

    const mediaId = media[0].id;

    const { data: news } = await this.commonService.getData<News>('news', {
      filter: {
        externalId: arrayLinks.map((url) => config.externalId(url)),
        mediaId,
      },
    });
    // return arrayLinks.map((url) => config.externalId(url))
    const arrayNews = arrayLinks
      .filter(
        (url) =>
          !news
            .map((item) => item.externalCode)
            .includes(config.externalCode(url)),
      )
      .map((url) =>
        getNewsContent(url, config, mediaId).then((res) => ({
          ...res,
          mediaId,
        })),
      );
    const data = await Promise.all(arrayNews);
    return data;

    const newData = data.filter(
      (item) =>
        !news.map((item) => item.externalCode).includes(item.news.externalCode),
    );

    // if (newData.length > 0) {
    //   newData.forEach((item) => {
    //     this.postEntity('news', [item.news]).then((response) => {
    //       const newsId = response.identifiers.id;
    //       console.log(newsId)
    //       // const newDataImage = item.images
    //       //   .filter((image) => !!image.src)
    //       //   .map((image) => ({ newsId, newsUrl: item.news.url, ...image }));

    //       // const newDataLink = item.links
    //       //   .filter((link) => !!link.href)
    //       //   .map((link) => ({
    //       //     newsId,
    //       //     newsUrl: item.news.url,
    //       //     ...link,
    //       //   }));

    //       // if (newDataLink.length > 0) this.postEntity('link', newDataLink);
    //       // if (newDataImage.length > 0) this.postEntity('image', newDataImage);
    //     }).catch(e=>console.log('ERROR:',e));
    //   });
    // }

    return newData;
  }

  async writeNews(url: string, mediaId?: number) {
    try {
      const config = parserConfig.find((item) => url.includes(item.baseUrl));

      const arrayLinks = await getActualListNewsLinks(url);

      const { data: news } = await this.commonService.getData<News>('news', {
        filter: {
          externalId: arrayLinks.map((url) => config.externalId(url)),
          mediaId,
        },
      });

      const arrayNews = arrayLinks
        .filter(
          (url) =>
            !news
              .map((item) => item.externalCode)
              .includes(config.externalCode(url)),
        )
        .map((url) =>
          getNewsContent(url, config, mediaId).then((res) => ({
            ...res,
            mediaId,
          })),
        );

      const data = await Promise.all(arrayNews);

      const newData = data.filter(
        (item) =>
          !news
            .map((item) => item.externalCode)
            .includes(item.news.externalCode),
      );

      console.log(`Новых новостей(${url}) - ${newData.length}`);
      if (newData.length > 0) {
        const insertNews = await this.postEntity(
          'news',
          newData.map((item) => item.news),
        );
        // console.log("Добавленные новости:", insertNews)
        const newDataImage = newData.reduce((prev, item) => {
          item.images.forEach((image) => {
            if (image.src)
              prev.push({ newsId: 0, newsUrl: item.news.url, ...image });
          });

          return prev;
        }, []);
        const newDataLink = newData.reduce((prev, item) => {
          item.links.forEach((link) => {
            if (link.href)
              prev.push({ newsId: 0, newsUrl: item.news.url, ...link });
          });

          return prev;
        }, []);
        if (newDataLink.length > 0) this.postEntity('link', newDataLink);
        if (newDataImage.length > 0) this.postEntity('image', newDataImage);

        return newData;
      } else {
        return null;
      }
    } catch (e) {
      console.log(`Ошибка: ${JSON.stringify(e)}`);
      return this.postEntity('log', [
        {
          type: 'error write news',
          value: `url:${url}, error: ${JSON.stringify(e)}`,
        },
      ]);
    }
  }

  postEntity(
    entityName: string,
    body: Record<string, unknown>[],
  ): Promise<any> {
    return this.entityManager.insert(ENTITY_LIST[entityName].entity, body);
  }
}
