import { useEffect } from "react";
import style from "./adminHome.module.scss";
import InfoBox from "../../infoBox/InfoBox";
import { AiFillDollarCircle } from "react-icons/ai";
import { BsCart4 } from "react-icons/bs";
import { FaCartArrowDown } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import {
  calc_total_orders_amount,
  store_order,
} from "../../../redux/features/orderSlice";
import useFetchCollection from "../../../customHooks/useFetchCollection";
import { Store_Products } from "../../../redux/features/productSlice";
import Chart from "../../chart/Chart";

//Icons
const earningIcon = <AiFillDollarCircle size={30} color="#b624ff" />;
const productIcon = <BsCart4 size={30} color="#1f93ff" />;
const ordersIcon = <FaCartArrowDown size={30} color="#f7c17b" />;

const AdminHome = () => {
  const { products } = useSelector((store: RootState) => store.product);
  const { orderHistory, totalOrderAmount } = useSelector(
    (store: RootState) => store.order
  );
  const fbProducts = useFetchCollection("products");
  const fbOrders = useFetchCollection("orders");

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(Store_Products({ products: fbProducts.data }));
    dispatch(store_order(fbOrders.data));
    dispatch(calc_total_orders_amount());
  }, [fbProducts, fbOrders]);

  return (
    <div className={style.home}>
      <h2>Admin Home</h2>
      <div className={style["info-box"]}>
        <InfoBox
          cardClass={"1"}
          title={"Earnings"}
          count={`$${totalOrderAmount}`}
          icon={earningIcon}
        />
        <InfoBox
          cardClass={`${style.card} ${style.card2}`}
          title={"Products"}
          count={products.length}
          icon={productIcon}
        />
        <InfoBox
          cardClass={`${style.card} ${style.card3}`}
          title={"Orders"}
          count={orderHistory.length}
          icon={ordersIcon}
        />
      </div>
      <div>
        <Chart />
      </div>
    </div>
  );
};

export default AdminHome;
