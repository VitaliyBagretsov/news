import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { NotFoundException } from '#exceptions/not-found.exception';

import type { UpsertParserConfigDto } from '../dto/index.js';
import { MediaParserConfig } from '../entities/index.js';

@Injectable()
export class ParserConfigService {
  constructor(
    @InjectRepository(MediaParserConfig)
    private readonly repository: Repository<MediaParserConfig>,
  ) {}

  async findByMediaId(mediaId: number): Promise<MediaParserConfig> {
    const config = await this.findOptionalByMediaId(mediaId);
    if (!config) throw new NotFoundException(mediaId);
    return config;
  }

  findOptionalByMediaId(mediaId: number): Promise<MediaParserConfig | null> {
    return this.repository.findOneBy({ mediaId });
  }

  async upsert(
    mediaId: number,
    input: UpsertParserConfigDto,
  ): Promise<MediaParserConfig> {
    const existing = await this.repository.findOneBy({ mediaId });
    return this.repository.save({ ...existing, ...input, mediaId });
  }
}
