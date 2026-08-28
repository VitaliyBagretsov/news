import type { News } from '@/entities/news';
import { convertTZ } from '@/shared/utils';
import style from './style.module.scss';

const NewsContent = (props: News) => {
  return (
    <div className={style.content}>
      <div className={style.sticky}>
        <p className={style.date}>
          {convertTZ(props.date, 'Europe/Moscow').toLocaleString('ru-RU')}
        </p>
        <p className={style.sumary}>{props.summary}</p>
        <p className={style.text}>{props.text}</p>
      </div>
    </div>
  );
};

export default NewsContent;
