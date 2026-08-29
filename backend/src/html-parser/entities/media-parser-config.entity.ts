import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

import {
  ExternalCodeStrategy,
  ExternalIdStrategy,
  PublicationDateStrategy,
} from '../types/parser-config.types.js';

@Entity({ schema: 'news', name: 'media_parser_config' })
@Index(['mediaId'], { unique: true })
export class MediaParserConfig {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  mediaId: number;

  @Column({ type: 'varchar', length: 1000 })
  articleLinkSelector: string;

  @Column({ type: 'varchar', length: 1000 })
  headerSelector: string;

  @Column({ type: 'varchar', length: 1000 })
  dateSelector: string;

  @Column({ type: 'varchar', length: 1000, nullable: true })
  summarySelector: string | null;

  @Column({ type: 'varchar', length: 1000 })
  textSelector: string;

  @Column({ type: 'varchar', length: 1000, nullable: true })
  linkSelector: string | null;

  @Column({ type: 'varchar', length: 1000, nullable: true })
  imageSelector: string | null;

  @Column({ type: 'varchar', length: 50 })
  externalCodeStrategy: ExternalCodeStrategy;

  @Column({ type: 'varchar', length: 50 })
  externalIdStrategy: ExternalIdStrategy;

  @Column({ type: 'varchar', length: 50 })
  publicationDateStrategy: PublicationDateStrategy;

  @Column({ type: 'boolean', default: true })
  sameHostOnly: boolean;

  @Column({ type: 'jsonb', default: () => "'[]'::jsonb" })
  excludedUrlPatterns: string[];
}
