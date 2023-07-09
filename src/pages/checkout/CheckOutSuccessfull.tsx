import React from "react";
import { Link } from "react-router-dom";

const CheckOutSuccessfull = () => {
  return (
    <section>
      <div className="container">
        <h2>Checkout Successful</h2>
        <p>Thank you for your purchase</p>
        <br />
        <button className="--btn --btn-primary">
          <Link to="/order-history" style={{color:"white"}}>View Order Status</Link>
        </button>
      </div>
    </section>
  );
};

export default CheckOutSuccessfull;
