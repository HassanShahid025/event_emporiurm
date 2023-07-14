import {useState} from "react";
import style from "./viewProfile.module.scss";
import { Card } from "../../components/card/Card";
import EditProfile from "./EditProfile";



const ViewProfile = () => {
  const cities = ["Karachi", "Lahore", "Islamabad"];
  const genders = ["Male", "Female"];


  return (
    <section>
      <div className={`container`}>
        <h2>Your Profile</h2>
        <div className={style.section}>
          <div className={style.form}>
            <Card cardClass={style.card}>
              <div className={style.inputs}>
                <div>
                  <label>First Name:</label>
                  <input
                    type="text"
                    name="user_name"
                    placeholder="First name"
                    required
                  />
                </div>
                <div>
                  <label>Last Name:</label>
                  <input
                    type="email"
                    name="user_name"
                    placeholder="Last name"
                    required
                  />
                </div>
              </div>
              <div className={style.inputs}>
                <div>
                  <label>Mobile:</label>
                  <input
                    type="text"
                    name="user_name"
                    placeholder="Mobile number"
                    required
                  />
                </div>
                <div>
                  <label>City:</label>
                  <select required name="city">
                    <option value="" disabled>
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
                    name="user_name"
                    placeholder="Your email"
                    required
                  />
                </div>
                <div>
                  <label>Password:</label>
                  <input
                    type="password"
                    name="user_name"
                    placeholder="Full Name"
                    required
                  />
                </div>
              </div>

              <div className={style.inputs}>
              <div>
                  <label>Gender:</label>
                  <select required name="city">
                    <option value="" disabled>
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
              <EditProfile />
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ViewProfile;
