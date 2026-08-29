import { jest } from '@jest/globals';

import { HtmlReaderService } from './html-reader.service.js';

describe('HtmlReaderService', () => {
  const service = new HtmlReaderService();

  afterEach(() => jest.restoreAllMocks());

  it('returns response HTML', async () => {
    jest.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: true,
      text: async () => '<html></html>',
    } as Response);

    await expect(service.read('https://example.com')).resolves.toBe(
      '<html></html>',
    );
  });

  it('rejects unsuccessful responses', async () => {
    jest
      .spyOn(globalThis, 'fetch')
      .mockResolvedValue({ ok: false, status: 503 } as Response);

    await expect(service.read('https://example.com')).rejects.toThrow(
      'HTTP 503',
    );
  });
});
