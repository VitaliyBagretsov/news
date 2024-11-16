import { EntityTarget } from 'typeorm';
import { Media } from "@entities/media.entity"
import { News } from '@entities/news.entity';
import { Log } from '@entities/log.entity';
import { Link } from '@entities/link.entity';
import { Image } from '@entities/image.entity';

type SourceType = {
  from: string,
  entity: EntityTarget<Record<string, unknown>>,
  searchFields?: string
}

export const ENTITY_LIST: {[key:string]: SourceType} = {
  media: {
    from: 'media',
    entity: Media,
  },
  news: {
    from: 'news',
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