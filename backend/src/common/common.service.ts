import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

import { IResponseData } from '@types';
import { ENTITY_LIST } from '@constants/news.const';
import { QueryDto } from '@dto/query.dto';
import { prepareQuery } from '@util/parse.util';

@Injectable()
export class CommonService {
  constructor(
    @InjectDataSource()
    private dataSource: DataSource,
  ) {}

  async getData<Entity>(
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
      .andWhere(search)
      .orderBy(sort)
      .take(limit)
      .skip(skip)
      .getQueryAndParameters();

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

    return { count: countData[0].count, data } as IResponseData<Entity>;
  }
}
