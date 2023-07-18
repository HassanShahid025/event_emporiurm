import { useState } from "react";
import "./header.scss";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { FaTimes } from "react-icons/fa";
import { HiOutlineMenuAlt3 } from "react-icons/hi";
import { ToastContainer,  } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { ShowOnLogin, ShowOnLogout } from "../hiddenLinks/HiddenLinks";
import  {
  AdminOnlyLinks,
} from "../adminOnlyRoute/AdminOnlyRoute";
import UserDropdown from "../userDropdown/UserDropdown";
const navigate = useNavigate()

const logo = (
  <div className="logo">
    <Link to="/">
      <h2>
        e<span>Emporium</span>.
      </h2>
    </Link>
  </div>
);

const activeLink = ({ isActive }: { isActive: boolean }) =>
  isActive ? "active" : "";

const Header = () => {
  const [showMenu, setShowMenu] = useState(false);
  const [name, setName] = useState<string | null>("");

  const { isLoggedIn, user } = useSelector(
    (store: RootState) => store.auth.auth
  );

  console.log(isLoggedIn)
  console.log(user)


  const { cartItems } = useSelector((store: RootState) => store.cart);

  const dispatch = useDispatch();

  //Monitor currently signed in user
  // useEffect(() => {
  //   onAuthStateChanged(auth, (user) => {
  //     if (user) {
  //       dispatch(
  //         setUser({ email: user.email, userName: name, user_id: user.uid })
  //       );
  //     } else {
  //       setName("");
  //       dispatch(removeUser());
  //     }
  //   });
  // }, [name]);

  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };

  const hideMenu = () => {
    setShowMenu(false);
  };

  

  const cart = (
    <span className="cart">
      <NavLink to="/cart" className={activeLink}>
        Favourites
        {/* <FaShoppingCart size={20} /> */}
        <p>{cartItems.length}</p>
      </NavLink>
    </span>
  );

  // useEffect(() => {
  //   dispatch(calculate_cartTotalAmount())
  //   dispatch(calculate_CartTotalQuantity())
  // },[cartItems])

  return (
    <>
      <ToastContainer />
      <header className="fixed">
        <div className="header">
          {logo}
          <nav className={showMenu ? "show-nav" : "hide-nav"}>
            <div
              className={
                showMenu ? "nav-wrapper show-nav-wrapper" : "nav-wrapper"
              }
              onClick={hideMenu}
            ></div>
            <ul onClick={hideMenu}>
              <li className="logo-mobile">
                <Link to="/">{logo}</Link>
                <FaTimes size={22} color="#fffff" onClick={hideMenu} />
              </li>
              <AdminOnlyLinks>
                <li>
                  <Link to="/admin/home">
                    <button className="--btn --btn-primary">Admin</button>
                  </Link>
                </li>
              </AdminOnlyLinks>
              <li>
                <NavLink to="/" className={activeLink}>
                  Home
                </NavLink>
              </li>
              <li>
                <NavLink to="/contact" className={activeLink}>
                  Contact Us
                </NavLink>
              </li>
            </ul>
            <div className="header-right" onClick={hideMenu}>
              <span className="links">
                <ShowOnLogout>
                  <NavLink to="/login" className={activeLink}>
                    Login
                  </NavLink>
                </ShowOnLogout>
                <ShowOnLogin>
                  <Link
                    to="#"
                    style={{ color: "#f7c17b", borderBottom: "none" }}
                  >
                    <UserDropdown />
                  </Link>
                  <NavLink to={"/add-product/ADD"} className={activeLink}>
                    Post an Ad
                  </NavLink>
                  {/* <NavLink to="/order-history" className={activeLink}>
                    My Orders
                  </NavLink> */}
                  {/* <NavLink to="/a" onClick={logoutUser}>
                    Logout
                  </NavLink> */}
                </ShowOnLogin>
              </span>
              {/* {cart} */}
            </div>
          </nav>

          <div className="menu-icon">
            {/* {cart} */}
            <HiOutlineMenuAlt3 size={28} onClick={toggleMenu} />
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;
