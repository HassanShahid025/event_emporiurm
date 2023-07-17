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
import { IProducts } from "../../types";
import { toast } from "react-toastify";

const Product = () => {
  // const { data, isLoading } = useFetchCollection("products");
  const [ads, setAds] = useState<IProducts[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const getAds = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("http://localhost:3000/ads");
      const jsonData = await response.json();
      setAds(jsonData);
      setIsLoading(false)

    } catch (error) {
      setIsLoading(false)
      console.log(error)
    }
  };

  const [showFilter, setShowFilter] = useState(false);

  const dispatch = useDispatch();

  useEffect(() => {
    getAds()
    
  }, [dispatch]);

  useEffect(() => {
    dispatch(Store_Products({ products: ads }));
    dispatch(get_price_range({ products: ads }));
  }, [dispatch,ads])

  const { products } = useSelector((store: RootState) => store.product);
  const { filteredProducts } = useSelector((store: RootState) => store.filter);
 
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
