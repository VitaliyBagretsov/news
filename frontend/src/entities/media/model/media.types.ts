export interface Media {
  id: number;
  title: string;
  description?: string;
  url: string;
  copyright?: string;
  contact?: string;
  chiefEditor?: string;
  address?: string;
  email?: string;
  phone?: string;
  isActive: boolean;
  logo?: string;
}

export type CreateMedia = Omit<Media, 'id'>;
export type UpdateMedia = Partial<CreateMedia>;

export interface MediaStatistics {
  newsCount: number;
  publicationsLast24Hours: number;
  lastPublishedAt: string | null;
}

export interface MediaListItem extends Media, MediaStatistics {}
