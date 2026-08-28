import type { Media } from './entities/media.entity.js';

export interface MediaStatistics {
  mediaId: number;
  newsCount: number;
  publicationsLast24Hours: number;
  lastPublishedAt: Date | null;
}

export interface MediaListItem extends Media {
  newsCount: number;
  publicationsLast24Hours: number;
  lastPublishedAt: Date | null;
}

export interface MediaStatisticsRow {
  mediaId: number;
  newsCount: number | string;
  publicationsLast24Hours: number | string;
  lastPublishedAt: Date | string | null;
}
