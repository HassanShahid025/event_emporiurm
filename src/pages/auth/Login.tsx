import { useEffect, useState } from "react";
import style from "./auth.module.scss";
import { Link, json, useNavigate } from "react-router-dom";
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
import spinnerImg from "../../assets/spinner.jpg";
import { useDispatch } from "react-redux";
import { removePrevURL, setUser } from "../../redux/features/authSlice";
import { toggle_favourite } from "../../redux/features/cartSlice";

const Login = () => {
  const [email, setEmail] = useState("");
  const [enteredPassword, setPassword] = useState("");
  const [message,setMessage] = useState("")
  const [loading, setLoading] = useState(false);

  // const { previousUrl } = useSelector((store: RootState) => store.cart);
  const { previousURL, product,user } = useSelector(
    (store: RootState) => store.auth.auth
  );
  const [loginUser, setLoginUser] = useState({});

  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    console.log(loginUser)
    if(Object.keys(loginUser).length !== 0){
      dispatch(setUser(loginUser));
      redirectUser()
    }
  }, [loginUser]);


  const redirectUser = () => {
   
    if (previousURL === null) {
      navigate("/");
    } else {
      navigate(previousURL);
      dispatch(toggle_favourite({ product }));
      dispatch(removePrevURL());
    }
  };

  const checkCredentiols = async (jsonData: any) => {
    setLoading(true)
    setMessage("")
    const password = jsonData[0].password
    const body = { enteredPassword,password };
    try {
      const response = await fetch("http://localhost:3000/users-password", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
        if (response.ok) {
          // Handle the success case
          setMessage("Login successful");
          toast.success(message)
          setLoginUser(jsonData[0])
        } else {
          // Handle the error case
          setMessage("")
          setMessage('Invalid Password');
          toast.error(message)
          
        }
        setLoading(false)
        
    } catch (error) {
      toast.error("error occured");
      setLoading(false)
    }
    setMessage("")
  };

  const authUser = async (e: any) => {
    setMessage("")
    e.preventDefault();
   
    try {
      const response = await fetch(
        `http://localhost:3000/users-login/${email}`
      );
      const jsonData = await response.json();
      if (jsonData.length !== 0) {
        checkCredentiols(jsonData);
      } else {
        toast.error("Email is not registered");
        
      }
    } catch (error) {
      toast.error("error occured");
    }
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
          <img src={spinnerImg} />
        </div>
      )}
      <section className={`container ${style.auth}`}>
        <div className={style.img}>
          <img src={loginImg} alt="Login" style={{ width: "400px" }} />
        </div>
        <div className={style.form}>
          <h2>Login</h2>
          <form onSubmit={authUser}>
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
              value={enteredPassword}
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
            <p>Don't have a account? <Link to="/register">Register</Link></p>
            
          </span>
        </div>
      </section>
    </>
  );
};

export default Login;
