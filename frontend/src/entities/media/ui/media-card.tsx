import type { ReactNode, SyntheticEvent } from 'react';

import type { MediaListItem } from '../model';

import style from './media-card.module.scss';

interface MediaCardProps {
  actions?: ReactNode;
  media: MediaListItem;
}

const formatLastPublishedAt = (value: string | null): string =>
  value
    ? new Date(value).toLocaleString('ru-RU', {
        dateStyle: 'short',
        timeStyle: 'short',
      })
    : 'Нет публикаций';

export const MediaCard = ({ actions, media }: MediaCardProps) => {
  const logo = media.logo || '/media.png';

  const handleLogoError = (event: SyntheticEvent<HTMLImageElement>) => {
    event.currentTarget.onerror = null;
    event.currentTarget.src = '/media.png';
  };

  return (
    <article className={style.card}>
      <div className={style.content}>
        <img
          alt={`${media.title} logo`}
          className={style.logo}
          onError={handleLogoError}
          src={logo}
        />
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
