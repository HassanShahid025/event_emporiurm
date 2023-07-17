import React, { useState } from "react";
import { Button, Modal } from "antd";
import { Card } from "../../components/card/Card";
import style from './viewProfile.module.scss'
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";


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

const EditProfile = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { user } = useSelector((store: RootState) => store.auth.auth);
  const [editUser, setEditUser] = useState({ ...user });
  const [loading, setLoading] = useState(false);
  const cities = ["Karachi", "Lahore", "Islamabad"];
  const genders = ["Male", "Female"];
  const handleInput = (e: any) => {
    const {name, value} = e.target;
    setEditUser({ ...editUser, [name]: value });
  };
console.log(user.city)
  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <button className="--btn --btn-primary" onClick={showModal}>Edit Profile</button>
      <Modal
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        width={900}
      >
         <h2>Your Profile</h2>
        <div className={style.section}>
          <div className={style.form}>
            <Card cardClass={style.card}>
              <div className={style.inputs}>
                <div>
                  <label>First Name:</label>
                  <input
                    type="text"
                    name="first_name"
                    value={editUser.first_name}
                    onChange={(e) => handleInput(e)}
                    placeholder="First name"
                    required
                  />
                </div>
                <div>
                  <label>Last Name:</label>
                  <input
                    type="text"
                    name="last_name"
                    value={editUser.last_name}
                    onChange={(e) => handleInput(e)}
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
                    name="phone"
                    value={editUser.phone}
                    onChange={(e) => handleInput(e)}
                    placeholder="Mobile number"
                    required
                  />
                </div>
                <div>
                  <label>City:</label>
                  <select required name="city" value={user.city} onChange={(e) => handleInput(e)}>
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
                    name="email"
                    value={editUser.email}
                    onChange={(e) => handleInput(e)}
                    placeholder="Your email"
                    required
                  />
                </div>
                <div>
                  <label>Gender:</label>
                  <select required name="gender" value={user.gender} onChange={(e) => handleInput(e)}>
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
            </Card>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default EditProfile;
