import { Injectable } from '@nestjs/common';

const REQUEST_TIMEOUT_MS = 15_000;

@Injectable()
export class HtmlReaderService {
  async read(url: string): Promise<string> {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Accept: 'text/html,application/xhtml+xml',
        'User-Agent': 'news-parser/1.0 (+educational project)',
      },
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    });

    if (!response.ok) {
      throw new Error(`Request failed with HTTP ${response.status}: ${url}`);
    }

    return response.text();
  }
}
