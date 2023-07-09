import { useEffect } from "react";
import style from "./orderHistory.module.scss";
import useFetchCollection from "../../customHooks/useFetchCollection";
import { useDispatch } from "react-redux";
import { store_order } from "../../redux/features/orderSlice";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import spinnerImg from "../../assets/spinner.jpg";
import { useNavigate } from "react-router-dom";

const OrderHistory = () => {
  const { data, isLoading } = useFetchCollection("orders");
  const { orderHistory } = useSelector((store: RootState) => store.order);
  const { userId } = useSelector((store: RootState) => store.auth);

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(store_order(data));
  }, [data]);

  const navigate = useNavigate();

  const handleClick = (id: string) => {
    navigate(`/order-details/${id}`);
  };

  console.log(orderHistory);

  const filteredOrders = orderHistory.filter(
    (order: any) => order.userId === userId
  );

  return (
    <section>
      <div className={`container ${style.order}`}>
        <h2>Your Order History</h2>
        <p>
          Open an order to leave a <b>Product Review</b>
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
            {filteredOrders.length === 0 ? (
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
                  {filteredOrders.map((order: any, index: any) => {
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
    </section>
  );
};

export default OrderHistory;
