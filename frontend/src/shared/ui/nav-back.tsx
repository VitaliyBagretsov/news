import { useNavigate } from "react-router-dom";

import style from './style.module.scss'

export const NavBack = () => {
  const navigate = useNavigate();
  
  const onClick = () => {
    navigate(-1);
  };

  return (
    <button className={style.buttonBack} onClick={onClick}>
      Назад
    </button>
  )
}