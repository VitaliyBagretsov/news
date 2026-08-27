import { Alert, Spin } from 'antd';
import { useEffect } from 'react';

import type { Media as MediaEntity } from '@/entities/media';
import { useMediaQuery, useMediaStore } from '@/entities/media';
import MediaItem from '@/features/media-item';

import style from './style.module.scss';

const getItem = (item: MediaEntity) => {
  return (
    <li className={style.item} key={item.id}>
      <MediaItem {...item} />
    </li>
  );
};

export const Media = () => {
  const media = useMediaStore((state) => state.media);
  const setMedia = useMediaStore((state) => state.setMedia);
  const { data, isError, isPending } = useMediaQuery();

  useEffect(() => {
    if (data) setMedia(data.data);
  }, [data, setMedia]);

  if (isPending) return <Spin fullscreen size="large" />;
  if (isError) return <Alert message="Не удалось загрузить список медиа" type="error" />;

  return (
    <div className={style.page}>
      <h1 className={style.header}>Медиа ресурсы</h1>
      <ul className={style.media}>{media.map(getItem)}</ul>
    </div>
  );
};

export default Media;
