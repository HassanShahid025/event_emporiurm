import React from "react";
import style from "./checkoutsummary.module.scss";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { Link } from "react-router-dom";
import { Card } from "../card/Card";

const CheckoutSummary = () => {
  const { cartItems, cartTotalAmount, cartTotalQuantity } = useSelector(
    (store: RootState) => store.cart
  );

  return (
    <div>
      <h3>Checkout Summary</h3>
      <div>
        {cartItems.length === 0 ? (
          <>
            <p>No item in your cart</p>
            <button className="--btn">
              <Link to="/#products">Back To Shopping</Link>
            </button>
          </>
        ) : (
          <div>
            <p>
              Cart items(s): <b>{cartTotalQuantity}</b>
            </p>
            <div className={style.text}>
              <h4>Subtotal:</h4>
              <h3>{`$${cartTotalAmount.toFixed(2)}`}</h3>
            </div>
            {cartItems.map((item,index) => {
                const {name,id,price,cartQuantiy} = item
                return(
                    <Card cardClass={style.card} key={id    }>
                        <h4>Product: {name}</h4>
                        <p>Quantity: {cartQuantiy}</p>
                        <p>Unit Price: {price}</p>
                        <p>Total Price: {price! * cartQuantiy!}</p>
                    </Card>
                )
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default CheckoutSummary;
