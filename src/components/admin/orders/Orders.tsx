import React, { useEffect } from "react";
import style from "./orders.module.scss";
import useFetchCollection from "../../../customHooks/useFetchCollection";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import { store_order } from "../../../redux/features/orderSlice";
import spinnerImg from '../../../assets/spinner.jpg'

const Orders = () => {
  const { data, isLoading } = useFetchCollection("orders");
  const { orderHistory } = useSelector((store: RootState) => store.order);

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(store_order(data));
  }, [data]);

  const navigate = useNavigate();

  const handleClick = (id: string) => {
    navigate(`/admin/order-details/${id}`);
  };

  return (
    <>
      <div className={`${style.order}`}>
        <h2>Your Order History</h2>
        <p>
          Open an order to <b>Change order status</b>
        </p>
        <br />
        <>
          {isLoading && (
            <div className="loading-container">
            <img
               src={spinnerImg}
             />
         </div>
          )}
          <div className={style.table}>
            {orderHistory.length === 0 ? (
              <p>No order found</p>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th>s/n</th>
                    <th>Date</th>
                    <th>Order ID</th>
                    <th>Order Amount</th>
                    <th>Order Status</th>
                  </tr>
                </thead>
                <tbody>
                  {orderHistory.map((order: any, index: any) => {
                    const {
                      id,
                      orderDate,
                      orderTime,
                      orderAmount,
                      orderStatus,
                    } = order;
                    return (
                      <tr key={id} onClick={() => handleClick(id)}>
                        <td>{index + 1}</td>
                        <td>
                          {orderDate} at {orderTime}
                        </td>
                        <td>{id}</td>
                        <td>{`$${orderAmount}`}</td>
                        <td>
                          <p
                            className={
                              orderStatus !== "Delivered"
                                ? `${style.pending}`
                                : `${style.delivered}`
                            }
                          >
                            {orderStatus}
                          </p>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </>
      </div>
    </>
  );
};

export default Orders;
