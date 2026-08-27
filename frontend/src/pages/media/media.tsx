import type { Media as MediaEntity } from '@/entities/media';
import { useMediaStore } from '@/entities/media';
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

  return (
    <div className={style.page}>
      <h1 className={style.header}>Медиа ресурсы</h1>
      <ul className={style.media}>{media.map(getItem)}</ul>
    </div>
  );
};

export default Media;
