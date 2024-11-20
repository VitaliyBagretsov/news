import { EntityTarget } from 'typeorm';
import { Log } from '@entities/log.entity';
import { Link } from '@entities/link.entity';
import { Image } from '@entities/image.entity';
import { Media } from '@media/entities/media.entity';
import { News } from '@news/entities/news.entity';
import { User } from '@users/entities/user.entity';

type SourceType = {
  from: string,
  entity: EntityTarget<Record<string, unknown>>,
  searchFields?: string
}

export const ENTITY_LIST: {[key:string]: SourceType} = {
  user: {
    from: 'user',
    entity: User,
  },
  media: {
    from: 'media-view',
    entity: Media,
  },
  news: {
    from: 'news-view',
    entity: News,
    searchFields: '"header","summary","text"'
  },
  log: {
    from: 'log',
    entity: Log,
    searchFields: '"type","value"'
  },
  link: {
    from: 'link',
    entity: Link,
    searchFields: '"url"'
  },
  image: {
    from: 'image',
    entity: Image,
    searchFields: '"url"'
  },
}

export const DEFAULT_LIMIT = 100
export const DEFAULT_OFFSET = 0