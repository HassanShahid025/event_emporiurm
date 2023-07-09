import React, { useEffect, useState } from "react";
import style from "./orderDetails.module.scss";
import { Link, useParams } from "react-router-dom";
import useFetchDocument from "../../customHooks/useFetchDocument";
import spinnerImg from "../../assets/spinner.jpg";
import { IOrder } from "../../types";

const OrderDetails = () => {
  const { id } = useParams();
  const { document } = useFetchDocument("orders", id!);
  const [order, setOrder] = useState<IOrder>();

  useEffect(() => {
    setOrder(document);
  }, [document]);

  return (
    <section>
      <div className={`container ${style.table}`}>
        <h2>Order Details</h2>
        <div>
          <Link to="/order-history">&larr; Back To Orders</Link>
        </div>
        <br />
        {order === undefined || order === null ? (
          <div className="loading-container">
          <img
             src={spinnerImg}
           />
       </div>
        ) : (
          <>
            <p>
              <b>Order ID: </b>
              {order.id}
            </p>
            <p>
              <b>Order Amount: </b>${order!.orderAmount}
            </p>
            <p>
              <b>Order Status: </b>
              {order!.orderStatus}
            </p>
            <br />
            <table>
              <thead>
                <tr>
                  <th>s/n</th>
                  <th>Product</th>
                  <th>Price</th>
                  <th>Quantity</th>
                  <th>Total</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {order.cartItems.map((item, index: number) => {
                  const { id, name, price, imageURL, cartQuantiy } = item;
                  return (
                    <tr key={id}>
                      <td>
                        <b>{index + 1}</b>
                      </td>
                      <td>
                        <p>
                          <b>{name}</b>
                        </p>
                        <img
                          src={imageURL}
                          alt={name}
                          style={{ width: "100px" }}
                        />
                      </td>
                      <td>{price}</td>
                      <td>{cartQuantiy}</td>
                      <td>{"$" + (price! * cartQuantiy!).toFixed(2)}</td>
                      <td className={style.icon}>
                        <button className="--btn --btn-primary">
                          <Link
                            to={`/review-product/${id}`}
                            style={{ color: "white" }}
                          >
                            Review Product
                          </Link>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </>
        )}
      </div>
    </section>
  );
};

export default OrderDetails;
