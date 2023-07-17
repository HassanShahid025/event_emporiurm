import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { Link } from "react-router-dom";

const AdminOnlyRoute = ({ children }: any) => {
  const { user } = useSelector((store: RootState) => store.auth.auth);

  if (user.email === import.meta.env.VITE_REACT_APP_ADMIN_USER) {
    // password = 123456
    return children;
  } else {
    return (
      <section style={{ height: "80vh" }}>
        <div className="container">
          <h2>Permission Denied.</h2>
          <p>This page is only accessible by Admin.</p>
          <br />
          <Link to="/">
            <button className="--btn btn">&larr; Back to Home</button>
          </Link>
        </div>
      </section>
    );
  }
};
export default AdminOnlyRoute;

export const AdminOnlyLinks = ({ children }: any) => {
  const { user } = useSelector((store: RootState) => store.auth.auth);

  if (user.email === import.meta.env.VITE_REACT_APP_ADMIN_USER) {
 
    return children;
  } else {
    return null;
  }
};
