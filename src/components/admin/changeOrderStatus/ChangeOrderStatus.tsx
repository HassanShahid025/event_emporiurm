import { useState } from "react";
import style from "./changeOrderStatus.module.scss";

import { Card } from "../../card/Card";
import { IOrder } from "../../../types";
import { Timestamp, doc, setDoc } from "firebase/firestore";
import { db } from "../../../firebase/config";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import spinnerImg from "../../../assets/spinner.jpg";

interface IChangeOrderStatus {
  order: IOrder | undefined;
  id: string | undefined;
}

const ChangeOrderStatus = ({ order, id }: IChangeOrderStatus) => {
  const [status, setStatus] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const editOrder = (e: any, id: string) => {
    setIsLoading(true);
    e.preventDefault();
    const orderConfig = {
      userId: order?.userId,
      email: order?.email,
      orderDate: order?.orderDate,
      orderTime: order?.orderTime,
      orderAmount: order?.orderAmount,
      orderStatus: status,
      cartItems: order?.cartItems,
      shippingAddress: order?.shippingAddress,
      createdAt: order?.createdAt,
      editedAt: Timestamp.now().toDate(),
    };

    try {
      setDoc(doc(db, "orders", id), orderConfig);
      setIsLoading(false);
      toast.success("Order status updated successfully");
      navigate("/admin/orders");
    } catch (error: any) {
      setIsLoading(false);
      toast.error(error.message);
    }
  };

  return (
    <>
      <div className={style.status}>
      {isLoading && (
        <div className="loading-container">
          <img src={spinnerImg} />
        </div>
      )}
        <Card cardClass={style.card}>
          <h4>Update Status</h4>
          <form onSubmit={(e) => editOrder(e, id!)}>
            <span>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option disabled value="">
                  -- Select one --
                </option>
                <option value="Order Placed...">Order Placed...</option>
                <option value="Processing...">Processing...</option>
                <option value="Shipped...">Shipped...</option>
                <option value="Delivered">Delivered</option>
              </select>
            </span>
            <span>
              <button type="submit" className="--btn --btn-primary">
                Update Status
              </button>
            </span>
          </form>
        </Card>
      </div>
    </>
  );
};

export default ChangeOrderStatus;
