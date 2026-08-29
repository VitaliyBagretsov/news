import { Alert, Spin } from 'antd';
import { useEffect } from 'react';

import type { MediaListItem } from '@/entities/media';
import { MediaCard, useMediaQuery, useMediaStore } from '@/entities/media';
import CreateMediaFeature from '@/features/create-media';
import OpenMediaNews from '@/features/open-media-news';
import UpdateMediaFeature from '@/features/update-media';
import UpdateMediaLogo from '@/features/update-media-logo';

import style from './style.module.scss';

const MediaList = () => {
  const setMedia = useMediaStore((state) => state.setMedia);
  const mediaQuery = useMediaQuery();
  const media = mediaQuery.data?.data ?? [];

  useEffect(() => {
    if (mediaQuery.data) setMedia(mediaQuery.data.data);
  }, [mediaQuery.data, setMedia]);

  if (mediaQuery.isPending) {
    return <Spin fullscreen size="large" />;
  }

  if (mediaQuery.isError) {
    return <Alert message="Не удалось загрузить медиа" type="error" />;
  }

  const renderMedia = (item: MediaListItem) => (
    <li className={style.item} key={item.id}>
      <MediaCard
        actions={
          <>
            <UpdateMediaFeature media={item} />
            <OpenMediaNews mediaId={item.id} />
          </>
        }
        logoAction={<UpdateMediaLogo media={item} />}
        media={item}
      />
    </li>
  );

  return (
    <section className={style.widget}>
      <div className={style.toolbar}>
        <h1 className={style.header}>Медиа ресурсы</h1>
        <CreateMediaFeature />
      </div>
      <ul className={style.list}>{media.map(renderMedia)}</ul>
    </section>
  );
};

export default MediaList;
