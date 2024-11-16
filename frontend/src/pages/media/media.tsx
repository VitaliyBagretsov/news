import { IMedia } from '../../entities/news.entity';

import style from './style.module.scss';
import MediaItem from '../../features/media-item';
import { useSelector } from '../../shared/utils/store.util';

const getItem = (item: IMedia, index: number) => {
  return (
    <li className={style.item} key={index}>
      <MediaItem {...item} />
    </li>
  );
};

export const Media = () => {
  const data = useSelector((state) => state.newsSlice.data);

  return (
    <div className={style.page}>
      <h1 className={style.header}>Медиа ресурсы</h1>
      <ul className={style.media}>{data?.map(getItem)}</ul>
    </div>
  );
};

export default Media
