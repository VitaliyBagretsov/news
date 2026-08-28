import { Injectable } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';

import { CreateMediaDto } from './dto/create-media.dto.js';
import { UpdateMediaDto } from './dto/update-media.dto.js';
import { Media } from './entities/media.entity.js';
import type {
  MediaListItem,
  MediaStatistics,
  MediaStatisticsRow,
} from './media.types.js';
import { NotFoundException } from '#exceptions/not-found.exception';

@Injectable()
export class MediaService {
  constructor(
    @InjectEntityManager()
    private entityManager: EntityManager,
  ) {}

  create(createMediaDto: CreateMediaDto): Promise<Media> {
    return this.entityManager.save(Media, createMediaDto);
  }

  findAll() {
    return this.entityManager.find(Media);
  }

  async findStatistics(): Promise<MediaStatistics[]> {
    const rows = await this.entityManager.query<MediaStatisticsRow[]>(`
      SELECT
        media.id AS "mediaId",
        COUNT(news.id)::int AS "newsCount",
        COUNT(news.id) FILTER (
          WHERE news.date >= NOW() - INTERVAL '24 hours'
        )::int AS "publicationsLast24Hours",
        MAX(news.date) AS "lastPublishedAt"
      FROM news.media AS media
      LEFT JOIN news.news AS news ON news."mediaId" = media.id
      GROUP BY media.id
      ORDER BY media.id
    `);

    return rows.map((row) => ({
      mediaId: Number(row.mediaId),
      newsCount: Number(row.newsCount),
      publicationsLast24Hours: Number(row.publicationsLast24Hours),
      lastPublishedAt: row.lastPublishedAt
        ? new Date(row.lastPublishedAt)
        : null,
    }));
  }

  async addStatistics(mediaList: Media[]): Promise<MediaListItem[]> {
    const statistics = await this.findStatistics();
    const statisticsByMediaId = new Map(
      statistics.map((item) => [item.mediaId, item]),
    );

    return mediaList.map((media) => {
      const item = statisticsByMediaId.get(media.id);

      return {
        ...media,
        newsCount: item?.newsCount ?? 0,
        publicationsLast24Hours: item?.publicationsLast24Hours ?? 0,
        lastPublishedAt: item?.lastPublishedAt ?? null,
      };
    });
  }

  findOne(id: number) {
    return this.entityManager.findOneBy(Media, { id }).then((res) => {
      if (!res) throw new NotFoundException(id);
      return res;
    });
  }

  async update(id: number, updateMediaDto: UpdateMediaDto): Promise<Media> {
    const media = await this.findOne(id);

    return this.entityManager.save(Media, Object.assign(media, updateMediaDto));
  }

  remove(id: number) {
    return this.findOne(id).then((res) => {
      return this.entityManager.remove(Media, [res]);
    });
  }
}
