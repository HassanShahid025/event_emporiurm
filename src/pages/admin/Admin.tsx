import { Route, Routes } from "react-router-dom";
import Navbar from "../../components/admin/navbar/Navbar";
import style from './admin.module.scss'
import AdminHome from "../../components/admin/home/AdminHome";
import ViewProducts from "../../components/admin/viewProducts/ViewProducts";
import Orders from "../../components/admin/orders/Orders";
import AddProduct from "../../components/admin/addProduct/AddProduct";
import OrderDetails from "../../components/admin/orderDetails/OrderDetails";

const Admin = () => {
  return (
    <div className={style.admin}>
      <div className={style.navbarr}>
        <Navbar />
      </div>
      <div className={style.content}>
        <Routes>
          <Route path="/home" element={<AdminHome/>} />
          <Route path="/all-products" element={<ViewProducts />} />
          <Route path="/add-product/:id" element={<AddProduct />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/order-details/:id" element={<OrderDetails/>} />
        </Routes>
      </div>
    </div>
  );
};

export default Admin;
