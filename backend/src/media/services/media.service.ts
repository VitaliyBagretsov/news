import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateMediaDto } from '../dto/create-media.dto.js';
import { UpdateMediaDto } from '../dto/update-media.dto.js';
import { Media } from '../entities/media.entity.js';
import type {
  MediaListItem,
  MediaStatistics,
  MediaStatisticsRow,
} from '../types/index.js';
import type { UploadedMediaImage } from '../types/index.js';
import { MediaImagesService } from './media-images.service.js';
import { NotFoundException } from '#exceptions/not-found.exception';
import { News } from '#news/entities';

@Injectable()
export class MediaService {
  constructor(
    @InjectRepository(Media)
    private readonly mediaRepository: Repository<Media>,
    private readonly mediaImagesService: MediaImagesService,
  ) {}

  create(createMediaDto: CreateMediaDto): Promise<Media> {
    return this.mediaRepository.save(createMediaDto);
  }

  findAll(): Promise<Media[]> {
    return this.mediaRepository.find();
  }

  async findStatistics(mediaIds: number[]): Promise<MediaStatistics[]> {
    if (mediaIds.length === 0) return [];

    const rows = await this.mediaRepository
      .createQueryBuilder('media')
      .leftJoin(News, 'news', 'news.mediaId = media.id')
      .select('media.id', 'mediaId')
      .addSelect('COUNT(news.id)::int', 'newsCount')
      .addSelect(
        `COUNT(news.id) FILTER (
          WHERE news.date >= NOW() - INTERVAL '24 hours'
        )::int`,
        'publicationsLast24Hours',
      )
      .addSelect('MAX(news.date)', 'lastPublishedAt')
      .where('media.id IN (:...mediaIds)', { mediaIds })
      .groupBy('media.id')
      .orderBy('media.id')
      .getRawMany<MediaStatisticsRow>();

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
    const statistics = await this.findStatistics(
      mediaList.map((media) => media.id),
    );
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

  findOne(id: number): Promise<Media> {
    return this.mediaRepository.findOneBy({ id }).then((res) => {
      if (!res) throw new NotFoundException(id);
      return res;
    });
  }

  async update(id: number, updateMediaDto: UpdateMediaDto): Promise<Media> {
    const media = await this.findOne(id);

    return this.mediaRepository.save(Object.assign(media, updateMediaDto));
  }

  async remove(id: number): Promise<Media[]> {
    const media = await this.findOne(id);
    const removedMedia = await this.mediaRepository.remove([media]);
    await this.mediaImagesService.remove(media.logo);
    return removedMedia;
  }

  async updateLogo(id: number, file: UploadedMediaImage): Promise<Media> {
    const media = await this.findOne(id);
    const previousLogo = media.logo;
    const logo = await this.mediaImagesService.save(id, file);

    try {
      const updatedMedia = await this.mediaRepository.save({ ...media, logo });
      await this.mediaImagesService.remove(previousLogo);
      return updatedMedia;
    } catch (error) {
      await this.mediaImagesService.remove(logo);
      throw error;
    }
  }

  async removeLogo(id: number): Promise<Media> {
    const media = await this.findOne(id);
    const previousLogo = media.logo;
    const updatedMedia = await this.mediaRepository.save({
      ...media,
      logo: null,
    });
    await this.mediaImagesService.remove(previousLogo);
    return updatedMedia;
  }
}
