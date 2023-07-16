import {useState} from "react";
import style from "./viewProfile.module.scss";
import { Card } from "../../components/card/Card";
import EditProfile from "./EditProfile";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";



const ViewProfile = () => {
  const { user } = useSelector((store: RootState) => store.auth.auth);
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
                  value={user.first_name}
                    type="text"
                    disabled
                  />
                </div>
                <div>
                  <label>Last Name:</label>
                  <input
                    type="email"
                    value={user.last_name}
                    disabled
                  />
                </div>
              </div>
              <div className={style.inputs}>
                <div>
                  <label>Mobile:</label>
                  <input
                    type="text"
                    value={user.phone}
                  />
                </div>
                <div>
                  <label>City:</label>
                  <input
                    type="text"
                    value={user.city}
                    disabled
                  />
                </div>
              </div>
              <div className={style.inputs}>
                <div>
                  <label>Email:</label>
                  <input
                    type="email"
                    value={user.email}
                    disabled
                  />
                </div>
                <div>
                  <label>Gender:</label>
                  <input
                    type="text"
                    value={user.gender}
                  />
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
