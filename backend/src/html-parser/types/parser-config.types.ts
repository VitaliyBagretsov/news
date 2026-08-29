export enum ExternalCodeStrategy {
  LAST_PATH_SEGMENT = 'last-path-segment',
  PENULTIMATE_PATH_SEGMENT = 'penultimate-path-segment',
  RIA_ARTICLE = 'ria-article',
}

export enum ExternalIdStrategy {
  CODE = 'code',
  CODE_PREFIX = 'code-prefix',
  RIA_ARTICLE = 'ria-article',
}

export enum PublicationDateStrategy {
  DATETIME_ATTRIBUTE = 'datetime-attribute',
  RIA_TEXT = 'ria-text',
  RUSSIAN_MONTH_TEXT = 'russian-month-text',
}
