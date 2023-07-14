import { useState } from "react";
import "./dropdown.scss";
import { MdKeyboardArrowDown, MdKeyboardArrowUp } from "react-icons/md";
import { signOut } from "firebase/auth";
import { auth } from "../../firebase/config";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";

const UserDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { userName, userId } = useSelector((store: RootState) => store.auth);
  const navigate = useNavigate();

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleOptionClick = () => {
    setIsOpen(false)
  };

  const logoutUser = () => {
    signOut(auth)
      .then(() => {
        toast.success("Logout Successful");
        navigate("/");
      })
      .catch((error) => {
        toast.error(error.message);
      });
  };

  return (
    <div className="dropdown">
      <div className="dropdown-items">
        <FaUserCircle size={16} />
        Hi, {userName}
        {isOpen ? (
          <MdKeyboardArrowUp size={25} onClick={toggleDropdown} />
        ) : (
          <MdKeyboardArrowDown size={25} onClick={toggleDropdown} />
        )}
      </div>

      {isOpen && (
        <ul className="dropdown__menu">
          <Link to={`/favourites/${userId}`} onClick={handleOptionClick}><li>Favourites</li></Link>
          <Link to="" onClick={handleOptionClick}><li>Logout</li></Link>
          <Link to={`/view-profile/${userId}`} onClick={handleOptionClick}><li>View and Edit</li></Link>
          <Link to={`/todo/${userId}`} onClick={handleOptionClick}><li >Todo List</li></Link>
          <Link to={`/ads/${userId}`} onClick={handleOptionClick}><li >My Ads</li></Link>
        </ul>
      )}
    </div>
  );
};

export default UserDropdown;
