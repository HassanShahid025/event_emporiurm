import { useEffect, useState } from "react";
import style from './todo.module.scss'
import Input from "./Input";
import TodoList from "./TodoList";


export interface listType {
  todo_id: string;
  description: string;
}

function App() {
  const [description, setDescription] = useState<string>("");
  const [list, setList] = useState<listType[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState<string>("");
  const [alert, setAlert] = useState({ show: false, msg: "", type: "" });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!description) {
      showAlert(true, "Please Enter Value", "danger");
    } else if (description && isEditing) {
   
      try {
        const body = { description };
        const response = await fetch(`http://localhost:3000/todos/${editId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
        setDescription("");
        setEditId("");
        setIsEditing(false);
        showAlert(true, "Task Edited", "success");
        getTodos();
      } catch (error) {
        showAlert(true, "Error Occured while editing from db", "danger");
      }
    } else {
      try {
        const body = { description };
        const response = await fetch("http://localhost:3000/todos", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
        setDescription("");
        getTodos();
        showAlert(true, "Task Added", "success");
      } catch (error) {
        showAlert(true, "Error Occured", "danger");
      }
    }
  };

  const showAlert = (show = false, msg = "", type = "") => {
    setAlert({ show, msg, type });
  };

  const clearList = () => {
    showAlert(true, "Empty List", "danger");
    setList([]);
  };

  const deleteItem = async (id: string) => {
    try {
      const deleteTodo = await fetch(`http://localhost:3000/todos/${id}`, {
        method: "DELETE",
      });
      getTodos();
      showAlert(true, "Task deleted", "danger");
    } catch (error) {
      showAlert(true, "Error Occured while deleting from db", "danger");
    }
  };

  const editItem = async (id: string) => {
    const specificItem = list.find((item) => item.todo_id === id);
    setIsEditing(true);
    if (specificItem) {
      setEditId(specificItem.todo_id);
      setDescription(specificItem.description);
    }
  };

  const getTodos = async () => {
    try {
      const response = await fetch("http://localhost:3000/todos");
      const jsonData = await response.json();
      setList(jsonData);
      console.log(jsonData);
    } catch (error) {
      showAlert(true, "Error Occured while fetching from db", "danger");
    }
  };

  useEffect(() => {
    getTodos();
  }, []);

  return (
    <section className={style['section-center']}>
      <Input
        handleSubmit={handleSubmit}
        list={list}
        description={description}
        setDescription={setDescription}
        isEditing={isEditing}
        showAlert={showAlert}
        alert={alert}
      />
      {list.length > 0 && (
        <div className={style['grocery-container']}>
          <TodoList items={list} deleteItem={deleteItem} editItem={editItem} />
          <button className={style["clear-btn"]} onClick={clearList}>
            Clear Tasks
          </button>
        </div>
      )}
    </section>
  );
}

export default App;
