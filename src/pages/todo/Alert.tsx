import { useEffect } from "react";
import { listType } from "./Todo";
import style from './todo.module.scss'

interface Ialert {
  show: boolean;
  msg: string;
  type: string;
  removeAlert: (show?: boolean, msg?: string, type?: string) => void;
  list: listType[];
}

export const Alert = ({ type, msg, removeAlert, list }: Ialert) => {
  useEffect(() => {
    const timeout = setTimeout(() => {
      removeAlert();
    }, 3000);

    return () => clearTimeout(timeout);
  }, [list]);
  return <p className={`${style.alert} ${style}-${type}`}>{msg}</p>;
};