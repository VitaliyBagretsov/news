import { jest } from '@jest/globals';
import { Test, TestingModule } from '@nestjs/testing';
import { getEntityManagerToken } from '@nestjs/typeorm';
import type { Media } from './entities/media.entity.js';
import { MediaService } from './media.service.js';

describe('MediaService', () => {
  let service: MediaService;
  const entityManager = {
    findOneBy: jest.fn<() => Promise<unknown>>(),
    query: jest.fn<() => Promise<unknown>>(),
    save: jest.fn<() => Promise<unknown>>(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MediaService,
        {
          provide: getEntityManagerToken(),
          useValue: entityManager,
        },
      ],
    }).compile();

    service = module.get<MediaService>(MediaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('returns the created media', async () => {
    const createMediaDto = {
      title: 'Example media',
      url: 'https://example.com',
      isActive: true,
    };
    const createdMedia = { id: 1, ...createMediaDto };
    entityManager.save.mockResolvedValue(createdMedia);

    await expect(service.create(createMediaDto)).resolves.toEqual(createdMedia);
    expect(entityManager.save).toHaveBeenCalledWith(
      expect.any(Function),
      createMediaDto,
    );
  });

  it('returns the updated media', async () => {
    const media = {
      id: 1,
      title: 'Example media',
      url: 'https://example.com',
      isActive: true,
    };
    const changes = { title: 'Updated media' };
    const updatedMedia = { ...media, ...changes };
    entityManager.findOneBy.mockResolvedValue(media);
    entityManager.save.mockResolvedValue(updatedMedia);

    await expect(service.update(media.id, changes)).resolves.toEqual(
      updatedMedia,
    );
    expect(entityManager.save).toHaveBeenCalledWith(
      expect.any(Function),
      updatedMedia,
    );
  });

  it('normalizes aggregated media statistics', async () => {
    entityManager.query.mockResolvedValue([
      {
        mediaId: '1',
        newsCount: '12',
        publicationsLast24Hours: '3',
        lastPublishedAt: '2026-08-28T10:00:00.000Z',
      },
      {
        mediaId: 2,
        newsCount: 0,
        publicationsLast24Hours: 0,
        lastPublishedAt: null,
      },
    ]);

    await expect(service.findStatistics()).resolves.toEqual([
      {
        mediaId: 1,
        newsCount: 12,
        publicationsLast24Hours: 3,
        lastPublishedAt: new Date('2026-08-28T10:00:00.000Z'),
      },
      {
        mediaId: 2,
        newsCount: 0,
        publicationsLast24Hours: 0,
        lastPublishedAt: null,
      },
    ]);
  });

  it('adds statistics to media list items', async () => {
    const mediaList = [
      { id: 1, title: 'First media' },
      { id: 2, title: 'Second media' },
    ] as Media[];
    entityManager.query.mockResolvedValue([
      {
        mediaId: 1,
        newsCount: 12,
        publicationsLast24Hours: 3,
        lastPublishedAt: '2026-08-28T10:00:00.000Z',
      },
    ]);

    await expect(service.addStatistics(mediaList)).resolves.toEqual([
      {
        id: 1,
        title: 'First media',
        newsCount: 12,
        publicationsLast24Hours: 3,
        lastPublishedAt: new Date('2026-08-28T10:00:00.000Z'),
      },
      {
        id: 2,
        title: 'Second media',
        newsCount: 0,
        publicationsLast24Hours: 0,
        lastPublishedAt: null,
      },
    ]);
  });
});
