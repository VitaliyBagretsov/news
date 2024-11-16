import { Injectable } from '@nestjs/common';

import {
  filterNews,
  getActualListNewsLinks,
  getDocuments,
  getNewsContent,
} from './util/dom.util';
import { InjectDataSource, InjectEntityManager } from '@nestjs/typeorm';

import { DataSource, EntityManager } from 'typeorm';
import { ENTITY_LIST } from '@constants/news.const';
import { CreateMediaDto } from '@dto/media.dto';
import { Media } from '@entities/media.entity';
import { QueryDto } from '@dto/query.dto';
import { parserConfig } from '@constants/parser.constant';
import { getImages, getLinks, getText, prepareQuery } from '@util/parse.util';
import { IResponseData, QueryResult } from '@types';
import { News } from '@entities/news.entity';

@Injectable()
export class AppService {
  constructor(
    @InjectDataSource()
    private dataSource: DataSource,
    @InjectEntityManager()
    private entityManager: EntityManager,
  ) {}

  async test(query: any) {
    let { url } = query;
    const config = parserConfig.find((item) => url.includes(item.baseUrl));

    if (url.slice(-1) !== '/') url += '/';

    const arrayLinks = await getActualListNewsLinks(url);

    const { data: media } = await this.getEntity<Media>('media', {
      filter: {
        url,
      },
    });

    const mediaId = media[0].id;

    const { data: news } = await this.getEntity<News>('news', {
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
        getNewsContent(url, config, mediaId).then((res) => ({ ...res, mediaId })),
      );
      const data = await Promise.all(arrayNews);
      return data 

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

      const { data: news } = await this.getEntity<News>('news', {
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
          getNewsContent(url, config, mediaId).then((res) => ({ ...res, mediaId })),
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

  getMedia(entityName: string, query: QueryDto<Media>): Promise<Media[]> {
    return this.entityManager.find(Media);
  }

  postMedia(entityName: string, body: CreateMediaDto): Promise<any> {
    return this.entityManager.insert(ENTITY_LIST[entityName].entity, body);
  }

  async getEntity<Entity>(
    entityName: string,
    query: QueryDto<Entity>,
  ): Promise<IResponseData<Entity>> {
    const entityConfig = ENTITY_LIST[entityName];
    const { limit, skip, where, search, sort, select } = prepareQuery(query);
    const [queryString, param] = this.dataSource
      .createQueryBuilder()
      .select(select)
      .from(ENTITY_LIST[entityName].entity, 'news')
      .where(where)
      // .andWhere(
      //   query.searchBy && entityConfig.searchFields
      //     ? `contains((${entityConfig.searchFields}), '*${query.searchBy}*')`
      //     : {},
      // )
      .andWhere(search)
      .orderBy(sort)
      .take(limit)
      .skip(skip)
      .getQueryAndParameters();
    // console.log(queryString);
    // console.log(where);

    const [queryCountString, paramCount] = this.dataSource
      .createQueryBuilder()
      .select('count(*) as count')
      .from(ENTITY_LIST[entityName].entity, 'news')
      .where(where)
      .andWhere(
        query.searchBy && entityConfig.searchFields
          ? `contains((${entityConfig.searchFields}), '*${query.searchBy}*')`
          : {},
      )
      .andWhere(search)
      .getQueryAndParameters();

    const dataPromise = this.dataSource.query(queryString, param);
    const countPromise = this.dataSource.query(queryCountString, paramCount);
    const [data, countData] = await Promise.all([dataPromise, countPromise]);
    // console.log(data);  
    return { count: countData[0].count, data } as IResponseData<Entity>;

    // return this.entityManager.find(ENTITY_LIST[entityName].entity);
  }

  postEntity(
    entityName: string,
    body: Record<string, unknown>[],
  ): Promise<any> {
    return this.entityManager.insert(ENTITY_LIST[entityName].entity, body);
  }

  removeEntity(entityName: string, body: Record<string, unknown>[]) {
    return this.entityManager.remove(ENTITY_LIST[entityName].entity, body);
  }
}
