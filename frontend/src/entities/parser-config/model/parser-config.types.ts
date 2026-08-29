export type ExternalCodeStrategy = 'last-path-segment' | 'penultimate-path-segment' | 'ria-article';

export type ExternalIdStrategy = 'code' | 'code-prefix' | 'ria-article';

export type PublicationDateStrategy = 'datetime-attribute' | 'ria-text' | 'russian-month-text';

export interface ParserConfig {
  id: number;
  mediaId: number;
  articleLinkSelector: string;
  headerSelector: string;
  dateSelector: string;
  summarySelector: string | null;
  textSelector: string;
  linkSelector: string | null;
  imageSelector: string | null;
  externalCodeStrategy: ExternalCodeStrategy;
  externalIdStrategy: ExternalIdStrategy;
  publicationDateStrategy: PublicationDateStrategy;
  sameHostOnly: boolean;
  excludedUrlPatterns: string[];
}

export type UpdateParserConfig = Omit<ParserConfig, 'id' | 'mediaId'>;

export interface ParserPreview {
  articleUrlsFound: number;
  sample: {
    news: {
      header: string;
      date: string;
      summary: string;
      text: string;
      url: string;
    };
    links: unknown[];
    images: unknown[];
  } | null;
}
