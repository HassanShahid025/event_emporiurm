import { useState } from "react";
import style from "./auth.module.scss";
import registerImg from "../../assets/register.png";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "../../firebase/config";
import spinnerImg from "../../assets/spinner.jpg";

const initialState = {
  first_name: "",
  last_name: "",
  email: "",
  city: "",
  password: "",
  confirmPassword: "",
  gender: "",
  phone: "",
};

const Register = () => {
  const [user, setUser] = useState({ ...initialState });
  const [loading, setLoading] = useState(false);

  const handleInput = (e: any) => {
    const {name, value} = e.target;
    setUser({ ...user, [name]: value });
  };

  const isPasswordValid = user.password.length >= 6;
  const navigate = useNavigate();

  const registerUser = async(e: any) => {
    e.preventDefault();
    if (user.password !== user.confirmPassword) {
      toast.error("Passwords donot match.");
    } else {
      setLoading(true)
      try {
        const {
          first_name,
          last_name,
          email,
          city,
          password,
          gender,
          phone
        } = user;
        const body = {
          first_name,
          last_name,
          email,
          city,
          password,
          gender,
          phone
        };
  
        const response = await fetch("http://localhost:3000/users/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
        setUser({ ...initialState });
        setLoading(false)
        toast.success("Account created");
        navigate('/login')
      } catch (error) {
        setLoading(false)
        console.log(error);
        toast.error("error occures");
      }
    }
  };

  const cities = ["Karachi", "Lahore", "Islamabad"];
  const genders = ["Male", "Female"];

  return (
    <>
      <ToastContainer />
      {loading && (
        <div className="loading-container">
          <img src={spinnerImg} />
        </div>
      )}
      <section className={`container ${style.auth}`}>
        <div className={style.form}>
          <h2>Register</h2>
          <form onSubmit={registerUser}>
            <div className={style.inputs}>
              <div>
                <label>First Name:</label>
                <input
                  type="text"
                  name="first_name"
                  value={user.first_name}
                  placeholder="First name"
                  required
                  onChange={(e) => handleInput(e)}
                />
              </div>
              <div>
                <label>Last Name:</label>
                <input
                  type="text"
                  name="last_name"
                  value={user.last_name}
                  placeholder="Last name"
                  required
                  onChange={(e) => handleInput(e)}
                />
              </div>
            </div>

            <div className={style.inputs}>
              <div>
                <label>Mobile:</label>
                <input
                  type="text"
                  name="phone"
                  placeholder="Mobile number"
                  value={user.phone}
                  required
                  onChange={(e) => handleInput(e)}
                />
              </div>
              <div>
                <label>City:</label>
                <select required name="city" value={user.city} onChange={(e) => handleInput(e)}>
                  <option  disabled>
                    -- Choose City--
                  </option>
                  {cities.map((city, index) => {
                    return (
                      <option value={city} key={index}>
                        {city}
                      </option>
                    );
                  })}
                </select>
              </div>
            </div>
            <div className={style.inputs}>
              <div>
                <label>Email:</label>
                <input
                  type="email"
                  name="email"
                  placeholder="Your email"
                  value={user.email}
                  onChange={(e) => handleInput(e)}
                  required
                />
              </div>
              <div>
                <label>Password:</label>
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={user.password}
                  onChange={(e) => handleInput(e)}
                  required
                />
                <p
                  className={
                    user.password.length <= 5 && user.password.length > 0
                      ? "warning-text"
                      : "hide"
                  }
                  style={{ fontSize: "1.4rem" }}
                >
                  Minimum 6 characters.
                </p>
              </div>
            </div>

            <div className={style.inputs}>
              <div>
                <label>Confirm Password:</label>

                <input
                  type="password"
                  placeholder="Confirm Password"
                  name="confirmPassword"
                  required
                  value={user.confirmPassword}
                  onChange={(e) => handleInput(e)}
                />
              </div>
              <div>
                <label>Gender:</label>
                <select required name="gender" value={user.gender} onChange={(e) => handleInput(e)}>
                  <option  disabled>
                    -- Choose Your Gender--
                  </option>
                  {genders.map((gender, index) => {
                    return (
                      <option value={gender} key={index}>
                        {gender}
                      </option>
                    );
                  })}
                </select>
              </div>
            </div>

            <button
              type="submit"
              className="--btn --btn-primary --btn-block"
              disabled={!isPasswordValid}
            >
              Register
            </button>
          </form>
          <div className={style.register}>
            <p>Already have an account? <Link to="/login">Login</Link></p>
            
          </div>
        </div>
        <div className={style.img}>
          <img src={registerImg} alt="Register" style={{ width: "400px" }} />
        </div>
      </section>
    </>
  );
};

export default Register;
