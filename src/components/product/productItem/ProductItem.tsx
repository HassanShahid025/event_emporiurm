import React, { useEffect, useState } from "react";
import style from "./ProductItem.module.scss";
import { IProducts } from "../../../types";
import { Card } from "../../card/Card";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { toggle_favourite } from "../../../redux/features/cartSlice";
import { AiOutlineHeart, AiTwotoneHeart } from "react-icons/ai";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import { addDoc, collection } from "firebase/firestore";
import { db } from "../../../firebase/config";
import Notiflix from "notiflix";
import { addPrevURL } from "../../../redux/features/authSlice";

interface IProductItem {
  product: IProducts;
  grid: boolean;
}

const ProductItem = ({ product, grid }: IProductItem) => {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const { ad_id, name, price, ad_desc, images, city } = product;
  const { cartItems } = useSelector((store: RootState) => store.cart);
  const { user_id, isLoggedIn } = useSelector((store: RootState) => store.auth);
  const isFavourite = cartItems.find((item) => item.ad_id === ad_id);

  const shortingText = (text: string, n: number) => {
    if (text.length > n) {
      const shortenedText = text.substring(0, n).concat("...");
      return shortenedText;
    }
    return text;
  };

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // const addToCart = (product: IProducts) => {
  //   dispatch(add_to_cart({ product }));
  //   dispatch(calculate_CartTotalQuantity());

  const checkLogin = () => {
    if (isLoggedIn) {
      toggleFavourite();
    } else {
      Notiflix.Confirm.show(
        "Login",
        "Login to add to favourites",
        "Login",
        "Cancel",
        function okCb() {
          navigate("/login");
          dispatch(addPrevURL({ product, url: "/" }));
        },
        function cancelCb() {
          console.log("cancel");
        },
        {
          width: "320px",
          borderRadius: "8px",
          titleColor: "#f7c17b",
          okButtonBackground: "#f7c17b",
          cssAnimationStyle: "zoom",
        }
      );
    }
  };

  const toggleFavourite = () => {
    dispatch(toggle_favourite({ product }));
  };

  useEffect(() => {
    setWindowWidth(windowWidth);
  }, [grid]);

  return (
    <Card cardClass={grid ? `${style.grid}` : `${style.list}`}>
      <Link to={`/product-details/${ad_id}`}>
        <div className={style.img}>
          <img src={images![0]} alt={name} />
        </div>
      </Link>
      <div className={style.content}>
        <div className={style.details}>
          <div>
            <h5>{`Rs ${price}`}</h5>
            {isFavourite ? (
              <AiTwotoneHeart
                size={25}
                style={{ cursor: "pointer" }}
                onClick={() => checkLogin()}
              />
            ) : (
              <AiOutlineHeart
                size={25}
                style={{ cursor: "pointer" }}
                onClick={() => checkLogin()}
              />
            )}
          </div>
          <h4>{shortingText(name!, 18)}</h4>
          <p>{city}</p>
        </div>
        {!grid && (
          <p className={style.desc}>
            {windowWidth > 500
              ? shortingText(ad_desc!, 200)
              : shortingText(ad_desc!, 50)}
          </p>
        )}
        {/* <button
          className="--btn --btn-danger"
          onClick={() => addToCart(product)}
        >
          Add To Cart
        </button> */}
      </div>
    </Card>
  );
};

export default ProductItem;
