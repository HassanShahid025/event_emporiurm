import "./navbar.scss";
import { FaUserCircle } from "react-icons/fa";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import { NavLink } from "react-router-dom";

const activeLink = ({ isActive }: { isActive: boolean }) =>
  isActive ? "activeAdminLinks" : "";

const Navbar = () => {
  const { user } = useSelector((store: RootState) => store.auth.auth);

  return (
    <div className="navbar">
      <div className="user">
        <FaUserCircle size={40} color="#fff" />
        <h4>{user.first_name}</h4>
      </div>
      <nav>
        <ul>
          <li>
            <NavLink to="/admin/home" className={activeLink}>
              Home
            </NavLink>
          </li>
          <li>
            <NavLink to="/admin/all-ads" className={activeLink}>
              All Ads
            </NavLink>
          </li>
          <li>
            <NavLink to="/admin/users" className={activeLink}>
              All Users
            </NavLink>
          </li>
          <li>
            <NavLink to="/admin/complaints" className={activeLink}>
              All Complaints
            </NavLink>
          </li>
          
        </ul>
      </nav>
    </div>
  );
};

export default Navbar;
