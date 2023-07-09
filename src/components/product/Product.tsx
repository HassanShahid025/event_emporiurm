import React, { useEffect, useState } from "react";
import style from "./product.module.scss";
import ProductFilter from "./productFilter/ProductFilter";
import { ProductList } from "./productList/ProductList";
import { useDispatch } from "react-redux";
import useFetchCollection from "../../customHooks/useFetchCollection";
import {
  Store_Products,
  get_price_range,
} from "../../redux/features/productSlice";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import spinnerImg from "../../assets/spinner.jpg";
import { FaCogs } from "react-icons/fa";

const Product = () => {
  const { data, isLoading } = useFetchCollection("products");

  const [showFilter, setShowFilter] = useState(false);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(Store_Products({ products: data }));
    dispatch(get_price_range({ products: data }));
  }, [dispatch, data]);

  const { products } = useSelector((store: RootState) => store.product);

  return (
    <div className={style.section}>
      <div className={`container ${style.product}`}>
        <aside
          className={
            showFilter ? `${style.filter} ${style.show}` : `${style.filter}`
          }
        >
          {isLoading ? null : <ProductFilter />}
        </aside>
        <div className={style.content}>
          {isLoading ? (
            <img
              src={spinnerImg}
              alt="Loading.."
              style={{ width: "50px" }}
              className="--center-all"
            />
          ) : (
            <ProductList products={products} />
          )}
          <div
            className={style.icon}
            onClick={() => setShowFilter(!showFilter)}
          >
            <FaCogs size={20} color="#f7c17b" />

            <p>
              <b>{showFilter ? "Hide Filter" : "Show Filter"}</b>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Product;
