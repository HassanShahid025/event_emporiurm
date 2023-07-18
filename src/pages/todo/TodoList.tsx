import React from 'react'
import { listType } from "./Todo";
import { FaEdit, FaTrash } from "react-icons/fa";
import style from './todo.module.scss'


interface listItems {
  items: listType[];
  deleteItem: (id: string) => void;
  editItem: (id: string) => void;
}

const TodoList = ({ items, deleteItem, editItem}: listItems) => {
    return (
        <div className={style["grocery-list"]}>
          {items.map((item) => {
            const { description, todo_id } = item;
            return (
              <article key={todo_id} className={style["grocery-item"]}>
                <p className={style.title}>{description}</p>
                <div className={style["btn-container"]}>
                  <button type="button" className={style["edit-btn"]}
                  onClick={()=> editItem(todo_id)}>
                    <FaEdit />
                  </button>
                  <button
                    type="button"
                    className={style["delete-btn"]}
                    onClick={() => {
                      deleteItem(todo_id);
                    }}
                  >
                    <FaTrash />
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      );
}

export default TodoList