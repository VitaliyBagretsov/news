import {
  ExternalCodeStrategy,
  ExternalIdStrategy,
  PublicationDateStrategy,
} from '../types/index.js';

const pathSegments = (url: string): string[] =>
  new URL(url).pathname.split('/').filter(Boolean);

export const parseExternalCode = (
  url: string,
  strategy: ExternalCodeStrategy,
): string => {
  const segments = pathSegments(url);

  switch (strategy) {
    case ExternalCodeStrategy.LAST_PATH_SEGMENT:
      return segments.at(-1) ?? '';
    case ExternalCodeStrategy.PENULTIMATE_PATH_SEGMENT:
      return segments.at(-2) ?? '';
    case ExternalCodeStrategy.RIA_ARTICLE:
      return (segments.at(-1) ?? '').replace(/\.html$/, '');
  }
};

export const parseExternalId = (
  url: string,
  code: string,
  strategy: ExternalIdStrategy,
): string => {
  switch (strategy) {
    case ExternalIdStrategy.CODE:
      return code;
    case ExternalIdStrategy.CODE_PREFIX:
      return code.split('-')[0];
    case ExternalIdStrategy.RIA_ARTICLE:
      return code.split('-').at(-1) ?? '';
  }
};

const russianMonths: Record<string, number> = {
  января: 0,
  февраля: 1,
  марта: 2,
  апреля: 3,
  мая: 4,
  июня: 5,
  июля: 6,
  августа: 7,
  сентября: 8,
  октября: 9,
  ноября: 10,
  декабря: 11,
};

const validDate = (value: Date): Date => {
  if (Number.isNaN(value.getTime()))
    throw new Error('Publication date could not be parsed');
  return value;
};

export const parsePublicationDate = (
  element: Element | null,
  strategy: PublicationDateStrategy,
): Date => {
  if (!element) throw new Error('Publication date element was not found');

  if (strategy === PublicationDateStrategy.DATETIME_ATTRIBUTE) {
    return validDate(new Date(element.getAttribute('datetime') ?? ''));
  }

  const value = element.textContent?.trim() ?? '';

  if (strategy === PublicationDateStrategy.RIA_TEXT) {
    const match = value.match(/(\d{1,2}:\d{2})\s+(\d{2})\.(\d{2})\.(\d{4})/);
    if (!match) throw new Error(`Unsupported RIA publication date: ${value}`);
    return validDate(
      new Date(`${match[4]}-${match[3]}-${match[2]}T${match[1]}:00`),
    );
  }

  const match = value
    .toLowerCase()
    .match(/(\d{1,2})\s+([а-яё]+)\s+(\d{4}),?\s+(\d{1,2}:\d{2})/u);
  if (!match || russianMonths[match[2]] === undefined) {
    throw new Error(`Unsupported Russian publication date: ${value}`);
  }
  const date = new Date(
    Number(match[3]),
    russianMonths[match[2]],
    Number(match[1]),
  );
  const [hours, minutes] = match[4].split(':').map(Number);
  date.setHours(hours, minutes, 0, 0);
  return validDate(date);
};
