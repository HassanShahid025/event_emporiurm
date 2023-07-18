import { Alert } from "./Alert";
import { listType } from "./Todo";
import style from './todo.module.scss'

interface IInput {
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
  list: listType[];
  description: string;
  setDescription: React.Dispatch<React.SetStateAction<string>>;
  isEditing: boolean;
  showAlert: (show?: boolean, msg?: string, type?: string) => void;
  alert: {
    show: boolean;
    msg: string;
    type: string;
  };
}

const Input = ({
  handleSubmit,
  list,
  description,
  setDescription,
  isEditing,
  showAlert,
  alert,
}: IInput) => {
  return (
    <form className={style["grocery-form"]} onSubmit={handleSubmit}>
      {alert.show && <Alert {...alert} removeAlert={showAlert} list={list} />}
      <h3>TODO LIST</h3>
      <div className={style["form-control"]}>
        <input
          type="text"
          className={style.grocery}
          placeholder="e.g. book venue"
          value={description}
          onChange={(e) => {
            setDescription(e.target.value);
          }}
        />
        <button type="submit" className={style["submit-btn"]}>
          {isEditing ? "edit" : "submit"}
        </button>
      </div>
    </form>
  );
};

export default Input;
