import style from "./search.module.scss";
import { BiSearch } from "react-icons/bi";

interface ISearch {
  value: string;
  onChange: any;
}

const Search = ({ value, onChange }: ISearch) => {
  return (
    <div className={style.search}>
      <BiSearch size={18} className={style.icon} />
      <input
        type="text"
        placeholder="Search by name"
        value={value}
        onChange={onChange}
      />
    </div>
  );
};

export default Search;
