import { NavBack } from '../../shared/ui/nav-back';
import { UiTest } from '../../shared/ui/ui-test';

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
      <img className={style.logo} src={props.logo} />
      <h2 className={style.toolbarCentral}>{props.header}</h2>
      <div className={style.toolbarRight}>
        <UiTest />
      </div>
    </div>
  );
};

export default PageToolbar;
