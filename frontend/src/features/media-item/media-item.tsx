import React from 'react';
import { useNavigate } from 'react-router-dom';

import type { Media } from '@/entities/media';
import { createNewsPath } from '@/shared/config';

import style from './style.module.scss';

const MediaItem = (props: Media): React.ReactNode => {
  const navigate = useNavigate();

  const onClick = () => {
    navigate(createNewsPath(props.id));
  };

  return (
    <div className={style.item} onClick={onClick}>
      <img alt={`${props.title} logo`} className={style.logo} src={props.logo} />
      {props.title}
    </div>
  );
};

export default MediaItem;
