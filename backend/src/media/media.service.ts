import { Injectable } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';

import { CreateMediaDto } from './dto/create-media.dto';
import { UpdateMediaDto } from './dto/update-media.dto';
import { Media } from './entities/media.entity';
import { NotFoundException } from '@exceptions/not-found.exception';

@Injectable()
export class MediaService {
  constructor(
    @InjectEntityManager()
    private entityManager: EntityManager,
  ) {}

  create(createMediaDto: CreateMediaDto) {
    return this.entityManager.insert(Media, createMediaDto);
  }

  findAll() {
    return this.entityManager.find(Media);
  }

  findOne(id: number) {
    return this.entityManager.findOneBy(Media, { id }).then((res) => {
      if (!res) throw new NotFoundException(id);
      return res;
    });
  }

  update(id: number, updateMediaDto: UpdateMediaDto) {
    return this.findOne(id).then(() => {
      return this.entityManager.update(Media, id, updateMediaDto);
    });
  }

  remove(id: number) {
    return this.findOne(id).then((res) => {
      return this.entityManager.remove(Media, [res]);
    });
  }
}
