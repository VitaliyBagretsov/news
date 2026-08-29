import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

import {
  ExternalCodeStrategy,
  ExternalIdStrategy,
  PublicationDateStrategy,
} from '../types/index.js';

export class UpsertParserConfigDto {
  @IsString()
  @MaxLength(1000)
  articleLinkSelector: string;

  @IsString()
  @MaxLength(1000)
  headerSelector: string;

  @IsString()
  @MaxLength(1000)
  dateSelector: string;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  summarySelector: string | null;

  @IsString()
  @MaxLength(1000)
  textSelector: string;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  linkSelector: string | null;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  imageSelector: string | null;

  @IsEnum(ExternalCodeStrategy)
  externalCodeStrategy: ExternalCodeStrategy;

  @IsEnum(ExternalIdStrategy)
  externalIdStrategy: ExternalIdStrategy;

  @IsEnum(PublicationDateStrategy)
  publicationDateStrategy: PublicationDateStrategy;

  @IsBoolean()
  @Type(() => Boolean)
  sameHostOnly: boolean;

  @IsArray()
  @IsString({ each: true })
  excludedUrlPatterns: string[];
}
