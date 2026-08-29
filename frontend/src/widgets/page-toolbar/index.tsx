import { MediaLogo } from '@/entities/media';
import { NavBack, UiTest } from '@/shared/ui';

import style from './style.module.scss';

interface IPageToolbarProps {
  header: string;
  logo: string;
}

const PageToolbar = (props: IPageToolbarProps) => {
  return (
    <div className={style.toolbar}>
      <div className={style.toolbarLeft}>
        <NavBack />
      </div>
      <MediaLogo className={style.logo} fileName={props.logo} title={props.header} />
      <h2 className={style.toolbarCentral}>{props.header}</h2>
      <div className={style.toolbarRight}>
        <UiTest />
      </div>
    </div>
  );
};

export default PageToolbar;
