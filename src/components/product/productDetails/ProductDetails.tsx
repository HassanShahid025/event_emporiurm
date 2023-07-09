import { useEffect, useState } from "react";
import style from "./ProductDetails.module.scss";
import { Link, useParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../../firebase/config";
import { IProducts } from "../../../types";
import { toast } from "react-toastify";
import spinnerImg from "../../../assets/spinner.jpg";
import {
  add_to_cart,
  calculate_CartTotalQuantity,
  decrease_cart,
} from "../../../redux/features/cartSlice";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import useFetchDocument from "../../../customHooks/useFetchDocument";
import useFetchCollection from "../../../customHooks/useFetchCollection";
import { Card } from "../../card/Card";
import StarsRating from "react-star-rate";

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState<IProducts | null>(null);

  const { document } = useFetchDocument("products", id!);

  useEffect(() => {
    setProduct(document);
  }, [document]);

  const dispatch = useDispatch();

  const { cartItems } = useSelector((store: RootState) => store.cart);
  const { data } = useFetchCollection("reviews");
  const filteredReviews = data.filter((review) => review.productID == id);
  console.log(filteredReviews);

  const cart = cartItems.find((cart) => cart.id === id);

  const decreaseCart = (cart: IProducts) => {
    dispatch(decrease_cart({ product: cart }));
    dispatch(calculate_CartTotalQuantity());
  };

  const addToCart = (product: IProducts) => {
    dispatch(add_to_cart({ product }));
    dispatch(calculate_CartTotalQuantity());
  };

  return (
    <section>
      <div className={`container ${style.product}`}>
        <h2>Product Details</h2>
        <div>
          <Link to="/#products">&larr; Back to Products</Link>
        </div>
        {product === null ? (
          <img src={spinnerImg} alt="Loading.." style={{ width: "50px" }} />
        ) : (
          <>
            <div className={style.details}>
              <div className={style.img}>
                <img src={product.imageURL} alt={product.name} />
              </div>
              <div className={style.content}>
                <h3>{product.name}</h3>
                <p className={style.price}>{`$${product.price}`}</p>
                <p>{product.desc}</p>
                <p>
                  <b>SKU</b> {product.id}
                </p>
                <p>
                  <b>Brand</b> {product.brand}
                </p>
                {cart && (
                  <div className={style.count}>
                    <button
                      className="--btn"
                      onClick={() => decreaseCart(product)}
                    >
                      -
                    </button>
                    <p>
                      <b>{cart?.cartQuantiy}</b>
                    </p>
                    <button
                      className="--btn"
                      onClick={() => addToCart(product)}
                    >
                      +
                    </button>
                  </div>
                )}
                <button
                  className="--btn --btn-danger"
                  onClick={() => addToCart(product)}
                >
                  ADD TO CART
                </button>
              </div>
            </div>
          </>
        )}
          <h3>Product Reviews</h3>
          <div>
            {filteredReviews.length === 0 ? (<p>There are no reviews for this product yet</p>) :(
              <>
        <Card cardClass={style.card}>
                {filteredReviews.map((item,index) => {
                  const {rate,review,reviewDate,userName} = item
                  return(
                    <div className={style.review} key={index}>
                      <StarsRating value={rate}/>
                      <p>{review}</p>
                      <span>
                        <b>{reviewDate}</b>
                      </span>
                      <br />
                      <span>
                        <b>By: {userName}</b>
                      </span>
                    </div>
                  )
                })}
            </Card>
              </>
            )}
          </div>
      </div>
    </section>
  );
};

export default ProductDetails;
