import React from 'react';
import { useNavigate } from 'react-router-dom';
import { IMedia } from '../../entities/news.entity';

import style from './style.module.scss';

const MediaItem = (props: IMedia): React.ReactNode => {
  const navigate = useNavigate();

  const onClick = () => {
    navigate(`news/${props.id}`, { replace: false });
  };

  return (
    <div className={style.item} onClick={onClick}>
      <img className={style.logo} src={props.logo} />
      {props.title}
    </div>
  );
};

export default MediaItem;
