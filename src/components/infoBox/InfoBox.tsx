import React from 'react'
import style from './infoBox.module.scss'
import { Card } from '../card/Card'

interface IInfoBox{
    cardClass:string;
    title:string;
    count:number | string;
    icon:any
}

const InfoBox = ({cardClass,title,count,icon}:IInfoBox) => {
  return (
    <div className={style["info-box"]}>
        <Card cardClass={`${style.card}`}>
            <h4>{title}</h4>
            <span>
                <h3>{count}</h3>
                {icon}
            </span>
        </Card>
    </div>
  )
}

export default InfoBox