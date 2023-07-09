import React, { useState } from "react";
import style from "./auth.module.scss";
import forgotImg from "../../assets/forgot.png";
import { Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { auth } from "../../firebase/config";
import { sendPasswordResetEmail } from "firebase/auth";
import spinnerImg from "../../assets/spinner.jpg";

const Reset = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const resetPassword = (e: any) => {
    e.preventDefault();
    setLoading(true);
    sendPasswordResetEmail(auth, email)
      .then(() => {
        setLoading(false);
        setEmail("")
        toast.success("Reset link send to your email.");
      })
      .catch((error) => {
        setLoading(false);
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
          <img src={forgotImg} alt="Reset" style={{ width: "400px" }} />
        </div>
        <div className={style.form}>
          <h2>Reset Password</h2>
          <form onSubmit={resetPassword}>
            <input
              type="email"
              placeholder="Email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button className="--btn --btn-primary --btn-block" type="submit">
              Reset Password
            </button>
            <div className="links">
              <p>
                <Link to="/login">- Login</Link>
              </p>
              <p>
                <Link to="/register">- Register</Link>
              </p>
            </div>
          </form>
        </div>
      </section>
    </>
  );
};

export default Reset;
