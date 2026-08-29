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
  logo?: string | null;
}

export type CreateMedia = Omit<Media, 'id' | 'logo'>;
export type UpdateMedia = Partial<CreateMedia>;

export interface MediaStatistics {
  newsCount: number;
  publicationsLast24Hours: number;
  lastPublishedAt: string | null;
}

export interface MediaListItem extends Media, MediaStatistics {}
