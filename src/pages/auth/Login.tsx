import { useState } from "react";
import style from "./auth.module.scss";
import { Link, useNavigate } from "react-router-dom";
import { FaGoogle } from "react-icons/fa";
import loginImg from "../../assets/login.png";
import {
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { auth } from "../../firebase/config";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import spinnerImg from '../../assets/spinner.jpg'
import { useDispatch } from "react-redux";
import { removePrevURL } from "../../redux/features/authSlice";
import { toggle_favourite } from "../../redux/features/cartSlice";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // const { previousUrl } = useSelector((store: RootState) => store.cart);
  const { previousURL,product } = useSelector((store: RootState) => store.auth);

  const navigate = useNavigate();
  const dispatch = useDispatch()

  const redirectUser = () => {
    if (previousURL === null) {
      navigate("/");
    } else {
      navigate(previousURL);
      dispatch(toggle_favourite({ product}));
      dispatch(removePrevURL())
    }
  };

  const loginUser = (e: any) => {
    e.preventDefault();
    setLoading(true);
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredentials) => {
        setLoading(false);
        toast.success("Login Successful");
        setEmail("")
        setPassword("")
        redirectUser();
      })
      .catch((error) => {
        toast.error(error.message);
        setLoading(false);
      });
  };

  const provider = new GoogleAuthProvider();
  const signInWithGoogle = () => {
    signInWithPopup(auth, provider)
      .then((result) => {
        const user = result.user;
        toast.success("Login Successful");
        redirectUser();
      })
      .catch((error) => {
        toast.error(error.message);
      });
  };

  return (
    <>
      <ToastContainer />
      {loading && (
        <div className="loading-container">
           <img
              src={spinnerImg}
            />
        </div>
      )}
      <section className={`container ${style.auth}`}>
        <div className={style.img}>
          <img src={loginImg} alt="Login" style={{ width: "400px" }} />
        </div>
        <div className={style.form}>
          <h2>Login</h2>
          <form onSubmit={loginUser}>
            <input
              type="email"
              placeholder="Email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              placeholder="Password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button type="submit" className="--btn --btn-primary --btn-block">
              Login
            </button>
            <div className="links">
              <Link to="/reset">Reset Password</Link>
            </div>
            <p>-- or --</p>
          </form>
          <button
            className="--btn --btn-danger --btn-block"
            onClick={signInWithGoogle}
          >
            <FaGoogle color="#fff" /> Login With Google
          </button>
          <span className={style.register}>
            <p>Don't have a account?</p>
            <Link to="/register">Register</Link>
          </span>
        </div>
      </section>
    </>
  );
};

export default Login;
