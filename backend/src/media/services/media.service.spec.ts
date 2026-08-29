import { jest } from '@jest/globals';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Media } from '../entities/media.entity.js';
import type { MediaStatisticsRow } from '../types/index.js';
import { MediaService } from './media.service.js';
import { MediaImagesService } from './media-images.service.js';

describe('MediaService', () => {
  let service: MediaService;
  const getRawMany = jest.fn<() => Promise<MediaStatisticsRow[]>>();
  const queryBuilder = {
    addSelect: jest.fn().mockReturnThis(),
    getRawMany,
    groupBy: jest.fn().mockReturnThis(),
    leftJoin: jest.fn().mockReturnThis(),
    orderBy: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
  };
  const mediaRepository = {
    createQueryBuilder: jest.fn(() => queryBuilder),
    find: jest.fn<() => Promise<Media[]>>(),
    findOneBy: jest.fn<() => Promise<unknown>>(),
    save: jest.fn<() => Promise<unknown>>(),
    remove: jest.fn<() => Promise<unknown>>(),
  };
  const mediaImagesService = {
    remove: jest.fn<() => Promise<void>>(),
    save: jest.fn<() => Promise<string>>(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MediaService,
        {
          provide: getRepositoryToken(Media),
          useValue: mediaRepository,
        },
        { provide: MediaImagesService, useValue: mediaImagesService },
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
    mediaRepository.save.mockResolvedValue(createdMedia);

    await expect(service.create(createMediaDto)).resolves.toEqual(createdMedia);
    expect(mediaRepository.save).toHaveBeenCalledWith(createMediaDto);
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
    mediaRepository.findOneBy.mockResolvedValue(media);
    mediaRepository.save.mockResolvedValue(updatedMedia);

    await expect(service.update(media.id, changes)).resolves.toEqual(
      updatedMedia,
    );
    expect(mediaRepository.save).toHaveBeenCalledWith(updatedMedia);
  });

  it('normalizes aggregated media statistics', async () => {
    getRawMany.mockResolvedValue([
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

    await expect(service.findStatistics([1, 2])).resolves.toEqual([
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
    expect(queryBuilder.where).toHaveBeenCalledWith(
      'media.id IN (:...mediaIds)',
      { mediaIds: [1, 2] },
    );
    expect(queryBuilder.leftJoin).toHaveBeenCalledWith(
      expect.any(Function),
      'news',
      'news.mediaId = media.id',
    );
  });

  it('adds statistics to media list items', async () => {
    const mediaList = [
      { id: 1, title: 'First media' },
      { id: 2, title: 'Second media' },
    ] as Media[];
    getRawMany.mockResolvedValue([
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

  it('does not query statistics for an empty media list', async () => {
    await expect(service.addStatistics([])).resolves.toEqual([]);
    expect(mediaRepository.createQueryBuilder).not.toHaveBeenCalled();
  });

  it('stores a new logo file name and removes the previous file', async () => {
    const media = { id: 1, title: 'Media', logo: '1-old.png' } as Media;
    const file = {
      buffer: Buffer.from('image'),
      mimetype: 'image/png',
      originalname: 'logo.png',
      size: 5,
    };
    mediaRepository.findOneBy.mockResolvedValue(media);
    mediaImagesService.save.mockResolvedValue('1-new.png');
    mediaRepository.save.mockResolvedValue({ ...media, logo: '1-new.png' });

    await expect(service.updateLogo(media.id, file)).resolves.toEqual({
      ...media,
      logo: '1-new.png',
    });
    expect(mediaImagesService.remove).toHaveBeenCalledWith('1-old.png');
  });
});
