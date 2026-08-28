import { MouseEventHandler } from 'react';
import type { News } from '@/entities/news';
import { convertTZ } from '@/shared/utils';

import style from './style.module.scss';

interface IProps {
  props: News;
  onClick: (arg: News) => void;
}

const NewsItem = ({ props, onClick }: IProps) => {
  const onPress: MouseEventHandler<HTMLDivElement> = () => {
    onClick(props);
  };

  return (
    <div className={style.item} onClick={onPress}>
      <p className={style.header}>{props.header}</p>
      <p className={style.date}>{convertTZ(props.date, 'Europe/Moscow').toLocaleString('ru-RU')}</p>
    </div>
  );
};

export default NewsItem;
