import { useState, useEffect } from "react";
import "./header.scss";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { FaShoppingCart, FaTimes, FaUserCircle } from "react-icons/fa";
import { HiOutlineMenuAlt3 } from "react-icons/hi";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { auth } from "../../firebase/config";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch } from "react-redux";
import { removeUser, setUser } from "../../redux/features/authSlice";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { ShowOnLogin, ShowOnLogout } from "../hiddenLinks/HiddenLinks";
import AdminOnlyRoute, {
  AdminOnlyLinks,
} from "../adminOnlyRoute/AdminOnlyRoute";
import { calculate_CartTotalQuantity, calculate_cartTotalAmount } from "../../redux/features/cartSlice";

const logo = (
  <div className="logo">
    <Link to="/">
      <h2>
        e<span>Dukaan</span>.
      </h2>
    </Link>
  </div>
);

const activeLink = ({ isActive }: { isActive: boolean }) =>
  isActive ? "active" : "";


const Header = () => {
  const [showMenu, setShowMenu] = useState(false);
  const [name, setName] = useState<string | null>("");

  const { userName, isLoggedIn } = useSelector(
    (store: RootState) => store.auth
  );

  const {cartTotalQuantity, cartItems} = useSelector((store:RootState) => store.cart)  

  const dispatch = useDispatch();


  //Monitor currently signed in user
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        if (user.displayName) {
          setName(user.displayName!.split(" ")[0]);
        }
        dispatch(
          setUser({ email: user.email, userName: name, userId: user.uid })
        );
      } else {
        setName("");
        dispatch(removeUser());
      }
    });
  }, [name]);


  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };

  const hideMenu = () => {
    setShowMenu(false);
  };

  const navigate = useNavigate();

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

  const cart = (
    <span className="cart">
      <NavLink to="/cart" className={activeLink}>
        Cart
        <FaShoppingCart size={20} />
        <p>{cartTotalQuantity}</p>
      </NavLink>
    </span>
  );

  useEffect(() => {
    dispatch(calculate_cartTotalAmount())
    dispatch(calculate_CartTotalQuantity())
  },[cartItems])

  return (
    <>
      <ToastContainer />
      <header className="fixed" >
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
                  <a href="#" style={{ color: "#f7c17b" }}>
                    <FaUserCircle size={16} />
                    Hi, {userName}
                  </a>
                  <NavLink to="/order-history" className={activeLink}>
                    My Orders
                  </NavLink>
                  <NavLink to="/a" onClick={logoutUser}>
                    Logout
                  </NavLink>
                </ShowOnLogin>
              </span>
              {cart}
            </div>
          </nav>

          <div className="menu-icon">
            {cart}
            <HiOutlineMenuAlt3 size={28} onClick={toggleMenu} />
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;
