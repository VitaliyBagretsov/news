import type { ReactNode } from 'react';

import type { MediaListItem } from '../model';

import style from './media-card.module.scss';
import { MediaLogo } from './media-logo';

interface MediaCardProps {
  actions?: ReactNode;
  logoAction?: ReactNode;
  media: MediaListItem;
}

const formatLastPublishedAt = (value: string | null): string =>
  value
    ? new Date(value).toLocaleString('ru-RU', {
        dateStyle: 'short',
        timeStyle: 'short',
      })
    : 'Нет публикаций';

export const MediaCard = ({ actions, logoAction, media }: MediaCardProps) => {
  return (
    <article className={style.card}>
      <div className={style.content}>
        <div className={style.logoContainer}>
          <MediaLogo className={style.logo} fileName={media.logo} title={media.title} />
          {logoAction}
        </div>
        <span className={style.title}>{media.title}</span>
      </div>

      <dl className={style.statistics}>
        <div>
          <dt>Всего новостей</dt>
          <dd>{media.newsCount}</dd>
        </div>
        <div>
          <dt>За 24 часа</dt>
          <dd>{media.publicationsLast24Hours}</dd>
        </div>
        <div>
          <dt>Последняя публикация</dt>
          <dd>{formatLastPublishedAt(media.lastPublishedAt)}</dd>
        </div>
      </dl>

      {actions && <div className={style.actions}>{actions}</div>}
    </article>
  );
};
