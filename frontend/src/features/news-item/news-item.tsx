import { MouseEventHandler } from "react";
import { INews } from "../../entities/types";
import { convertTZ } from "../../shared/utils/parse.util";

import style from './style.module.scss';

interface IProps {
  props: INews,
  onClick: (arg: INews) => void
}

const NewsItem = ({props, onClick}: IProps) => {

  const onPress:MouseEventHandler<HTMLDivElement> = () => {
    onClick(props)
  }

  return(
    <div className={style.item} onClick={onPress}>
      <p className={style.header}>{props.header}</p>
      <p className={style.date}>{convertTZ(props.date, 'Europe/Moscow').toLocaleString('ru-RU')}</p>
    </div>
  )
}

export default NewsItem