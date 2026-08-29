import { JSDOM } from 'jsdom';

import {
  ExternalCodeStrategy,
  ExternalIdStrategy,
  PublicationDateStrategy,
} from '../types/index.js';
import {
  parseExternalCode,
  parseExternalId,
  parsePublicationDate,
} from './parser.strategies.js';

describe('parser strategies', () => {
  it('extracts RT identifiers from a slug', () => {
    const url = 'https://russian.rt.com/world/news-123456-title';
    const code = parseExternalCode(url, ExternalCodeStrategy.LAST_PATH_SEGMENT);

    expect(code).toBe('news-123456-title');
    expect(parseExternalId(url, code, ExternalIdStrategy.CODE_PREFIX)).toBe(
      'news',
    );
  });

  it('extracts a RIA article identifier', () => {
    const url = 'https://ria.ru/20260829/example-1234567890.html?source=main';
    const code = parseExternalCode(url, ExternalCodeStrategy.RIA_ARTICLE);

    expect(code).toBe('example-1234567890');
    expect(parseExternalId(url, code, ExternalIdStrategy.RIA_ARTICLE)).toBe(
      '1234567890',
    );
  });

  it('parses a datetime attribute', () => {
    const element = documentWith(
      '<time datetime="2026-08-29T08:30:00Z"></time>',
    );

    expect(
      parsePublicationDate(
        element,
        PublicationDateStrategy.DATETIME_ATTRIBUTE,
      ).toISOString(),
    ).toBe('2026-08-29T08:30:00.000Z');
  });
});

const documentWith = (html: string): Element => {
  const element = new JSDOM(html).window.document.body.firstElementChild;
  if (!element) throw new Error('Test element was not created');
  return element;
};
