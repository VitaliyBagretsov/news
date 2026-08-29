import type { MediaParserConfig } from '../entities/media-parser-config.entity.js';

export interface ParsedLink {
  href: string;
  rel?: string;
  textContent?: string;
}

export interface ParsedImage {
  src: string;
  alt?: string;
}

export interface ParsedNews {
  news: {
    mediaId: number;
    externalId: string;
    externalCode: string;
    date: Date;
    header: string;
    summary: string;
    text: string;
    url: string;
  };
  links: ParsedLink[];
  images: ParsedImage[];
}

export type ParserConfigInput = Omit<MediaParserConfig, 'id' | 'mediaId'>;
