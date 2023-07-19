import "./App.css";
import { Routes, Route } from "react-router-dom";
//Components
import { Header, Footer, AdminOnlyRoute } from "./components//export";

//Pages
import {
  Home,
  Contact,
  Login,
  Register,
  Reset,
  Admin,
  Cart,
} from "./pages/export";
import ProductDetails from "./components/product/productDetails/ProductDetails";
import ReviewProduct from "./components/reviewProduct/ReviewProduct";
import NotFound from "./pages/notFound/NotFound";
import ViewProfile from "./pages/viewProfile/ViewProfile";
import AddProduct from "./components/admin/addProduct/AddProduct";
import MyAds from "./pages/myAds/MyAds";

function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/reset" element={<Reset />} />
        <Route path="/view-profile/:user_id" element={<ViewProfile />} />
        <Route path="/product-details/:id" element={<ProductDetails />} />
        <Route path="/favourites/:id" element={<Cart />} />
        <Route path="/add-product/:id" element={<AddProduct />} />
        <Route path="/my-ads/:id" element={<MyAds />} />
        <Route path="/review-product/:id" element={<ReviewProduct />} />

        <Route
          path="/admin/*"
          element={
            <AdminOnlyRoute>
              <Admin />
            </AdminOnlyRoute>
          }
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Footer />
    </>
  );
}

export default App;
