import React, { useState } from "react";
import { Button, Modal } from "antd";
import { Card } from "../card/Card";
import style from './comaplain.module.scss'
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";


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

interface IComplain {
    name: string
}

const ComplainModal = ({name}:IComplain) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { user } = useSelector((store: RootState) => store.auth.auth);
  const [editUser, setEditUser] = useState({ ...user });
  const [complain, setComplain] = useState("")

  const { id } = useParams();
  const handleInput = (e: any) => {
    const {name, value} = e.target;
    setEditUser({ ...editUser, [name]: value });
  };
console.log(user.city)
  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    postComplain()
    
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const postComplain = async() => {
    try {
        const body = { ad_id:id, user_id:user.user_id, complain_text:complain, ad_name:name };
        const ad_id = id
        const response = await fetch(`http://localhost:3000/complaints-add/${ad_id}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
        setComplain("");
        toast.success("Complain Submitted")
        setIsModalOpen(false);
      } catch (error) {
        toast.error("Error occured while complaining");
      }
    }


  return (
    <>
      <button className={style.btn} onClick={showModal}>Report Ad</button>
      <Modal
        open={isModalOpen }
        onOk={handleOk}
        onCancel={handleCancel}
        width={900}
      >
         <h2>Complain</h2>
        <div className={style.section}>
          <div className={style.form}>
            <Card cardClass={style.card}>
              <div className={style.inputs}>
                <div>
                  <label>Ad ID:</label>
                  <input
                    type="text"
                    name="first_name"
                    value={id}
                    disabled
                  />
                </div>
                <div>
                  <label>Ad name:</label>
                  <input
                    type="text"
                    value={name}
                    disabled
                  />
                </div>
              </div>
              <div className={style.inputs}>
                <div>
                  <label>Complain:</label>
                  <textarea
                    value={complain}
                    onChange={(e) => setComplain(e.target.value)}
                    placeholder="complain"
                    required
                  />
                </div>
              </div>
            </Card>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default ComplainModal;
