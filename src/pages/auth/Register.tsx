import { useState } from "react";
import style from "./auth.module.scss";
import registerImg from "../../assets/register.png";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "../../firebase/config";
import spinnerImg from "../../assets/spinner.jpg";

const Register = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const isPasswordValid = password.length >= 6;
  const navigate = useNavigate();

  const registerUser = (e: any) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Passwords donot match.");
    } else {
      setLoading(true);
      createUserWithEmailAndPassword(auth, email, password)
        .then((userCredentials) => {
          const user = userCredentials.user;
          updateProfile(auth.currentUser!, {
            displayName: fullName,
          })
            .then(() => {
              // Profile updated!
              // ...
            })
            .catch((error) => {
              // An error occurred
              // ...
            });
          setLoading(false);
          toast.success("Registration Successfull");
          setFullName("")
          setEmail("")
          setConfirmPassword("")
          setPassword("")
          navigate("/login");
        })
        .catch((error) => {
          toast.error(error.message);
          setLoading(false);
        });
    }
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
        <div className={style.form}>
          <h2>Register</h2>
          <form onSubmit={registerUser}>
            <input
              type="text"
              placeholder="Full Name"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
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
            <p
              className={
                password.length <= 5 && password.length > 0
                  ? "warning-text"
                  : "hide"
              }
            >
              Minimum 6 characters.
            </p>
            <input
              type="password"
              placeholder="Confirm Password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <button
              type="submit"
              className="--btn --btn-primary --btn-block"
              disabled={!isPasswordValid}
            >
              Register
            </button>
          </form>
          <span className={style.register}>
            <p>Already have an account?</p>
            <Link to="/login">Login</Link>
          </span>
        </div>
        <div className={style.img}>
          <img src={registerImg} alt="Register" style={{ width: "400px" }} />
        </div>
      </section>
    </>
  );
};

export default Register;
