import type { SyntheticEvent } from 'react';

import { NavBack, UiTest } from '@/shared/ui';

import style from './style.module.scss';

interface IPageToolbarProps {
  header: string;
  logo: string;
}

const PageToolbar = (props: IPageToolbarProps) => {
  const handleLogoError = (event: SyntheticEvent<HTMLImageElement>) => {
    event.currentTarget.onerror = null;
    event.currentTarget.src = '/media.png';
  };

  return (
    <div className={style.toolbar}>
      <div className={style.toolbarLeft}>
        <NavBack />
      </div>
      <img
        alt={`${props.header} logo`}
        className={style.logo}
        onError={handleLogoError}
        src={props.logo || '/media.png'}
      />
      <h2 className={style.toolbarCentral}>{props.header}</h2>
      <div className={style.toolbarRight}>
        <UiTest />
      </div>
    </div>
  );
};

export default PageToolbar;
