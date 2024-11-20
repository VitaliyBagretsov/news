import { Injectable } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';

import { News } from './entities/news.entity';
import { NotFoundException } from '@exceptions/not-found.exception';

@Injectable()
export class NewsService {

  constructor(
    @InjectEntityManager()
    private entityManager: EntityManager,
  ) {}

  findOne(id: number) {
    return this.entityManager.findOneBy(News, { id }).then((res) => {
      if (!res) throw new NotFoundException(id);
      return res;
    });
  }

}
